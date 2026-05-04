import mongoose from 'mongoose';
import {
  LoginSchemaType,
  RegisterSchemaType,
} from '../validators/auth.validator';
import UserModel from '../models/user.model';
import { NotFoundException, UnauthorizedException } from '../utils/app-error';
import StorageModel from '../models/storage.model';
import { logger } from '../utils/logger';
import { signJwtToken } from '../utils/jwt';
import { Env } from '../config/env.config';
import { mockDb, saveMockDb } from '../config/mock-db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const registerService = async (body: RegisterSchemaType) => {
  const { email, password, name } = body;

  if (Env.MOCK_MODE === 'true') {
    logger.warn(`MOCK MODE: Registering user ${email}`);
    const existingUser = mockDb.users.find((u: any) => u.email === email);
    if (existingUser) throw new UnauthorizedException('User already exists');

    const newUser = {
      _id: uuidv4(),
      name,
      email,
      password: await bcrypt.hash(password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDb.users.push(newUser);
    mockDb.storage.push({ userId: newUser._id, totalSize: 0 });
    saveMockDb();
    return { user: { name, email, _id: newUser._id } };
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new UnauthorizedException('User already exists');

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const newUser = new UserModel({
        ...body,
        profilePicture: body.profilePicture || null,
      });

      await newUser.save({ session });

      const storage = new StorageModel({
        userId: newUser._id,
      });

      await storage.save({ session });
    });
  } catch (error: any) {
    // Fallback for standalone MongoDB (no replica set/transactions)
    if (
      error.message?.includes('sessions are not supported') ||
      error.codeName === 'NotMaster' ||
      error.code === 20
    ) {
      logger.warn('Standalone DB detected: Registering without transaction');
      const newUser = new UserModel({
        ...body,
        profilePicture: body.profilePicture || null,
      });
      await newUser.save();

      const storage = new StorageModel({
        userId: newUser._id,
      });
      await storage.save();
    } else {
      logger.error('Error registering user', error);
      throw error;
    }
  } finally {
    await session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;

  if (Env.MOCK_MODE === 'true') {
    logger.warn(`MOCK MODE: Logging in user ${email}`);
    let user = mockDb.users.find((u: any) => u.email === email);
    
    // Auto-create user for seamless mock login if they don't exist
    if (!user) {
      const newUserId = uuidv4();
      user = {
        _id: newUserId,
        name: email.split('@')[0],
        email,
        password: await bcrypt.hash(password, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDb.users.push(user);
      mockDb.storage.push({ userId: user._id, totalSize: 0 });
      saveMockDb();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Email/Password is incorrect');

    const { token, expiresAt } = signJwtToken({ userId: user._id });

    return {
      user: { name: user.name, email: user.email, _id: user._id },
      accessToken: token,
      expiresAt,
    };
  }

  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException('Email/Password not found');

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid)
    throw new UnauthorizedException('Email/Password is incorrect');

  const { token, expiresAt } = signJwtToken({
    userId: user.id,
  });

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
  };
};
