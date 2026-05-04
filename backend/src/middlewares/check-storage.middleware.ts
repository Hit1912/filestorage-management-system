import { Request, Response, NextFunction } from 'express';
import { BadRequestException, UnauthorizedException } from '../utils/app-error';
import StorageModel from '../models/storage.model';
import { logger } from '../utils/logger';
import { Env } from '../config/env.config';
import { mockDb } from '../config/mock-db';

export const CheckStorageAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files =
      (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

    if (!files || files.length === 0)
      throw new BadRequestException('No file uploaded');

    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedException('Unauthorized access');

    const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);

    if (Env.MOCK_MODE === 'true') {
      const userStorage = mockDb.storage.find((s: any) => s.userId === userId);
      const storageQuota = 2 * 1024 * 1024 * 1024; // 2GB
      const currentUsage = userStorage?.totalSize || 0;
      
      if (currentUsage + totalFileSize > storageQuota) {
        throw new BadRequestException('Insufficient storage.');
      }
      return next();
    }

    const result = await StorageModel.validateUpload(userId, totalFileSize);

    logger.info(`Storage result: ${JSON.stringify(result)}`);

    next();
  } catch (error) {
    next(error);
  }
};
