import { Env } from '../config/env.config';
import { mockDb, saveMockDb } from '../config/mock-db';
import UserModel from '../models/user.model';

export const findByIdUserService = async (userId: string) => {
  if (Env.MOCK_MODE === 'true') {
    let user = mockDb.users.find((u: any) => u._id === userId);
    
    // Auto-recreate user if they have a valid token but mockDb was cleared by a server restart
    if (!user) {
      user = {
        _id: userId,
        name: 'Mock User',
        email: 'mockuser@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDb.users.push(user);
      mockDb.storage.push({ userId, totalSize: 0 });
      saveMockDb();
    }

    return { name: user.name, email: user.email, _id: user._id };
  }
  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};

export const updateUserByIdService = async (
  userId: string,
  body: { name: string },
) => {
  if (Env.MOCK_MODE === 'true') {
    const userIndex = mockDb.users.findIndex((u: any) => u._id === userId);
    if (userIndex !== -1) {
      mockDb.users[userIndex].name = body.name;
      mockDb.users[userIndex].updatedAt = new Date();
      saveMockDb();
      return {
        name: mockDb.users[userIndex].name,
        email: mockDb.users[userIndex].email,
        _id: mockDb.users[userIndex]._id,
      };
    }
    return null;
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { name: body.name },
    { new: true },
  );
  return user?.omitPassword();
};
