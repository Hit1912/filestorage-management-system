import ApiKeyModel from '../models/apiKeys.model';
import { NotFoundException } from '../utils/app-error';
import { generateAPIKey } from '../utils/key';
import { Env } from '../config/env.config';
import { mockDb, saveMockDb } from '../config/mock-db';
import { v4 as uuidv4 } from 'uuid';

export const createApiKeyService = async (userId: string, name: string) => {
  const { rawKey, hashedKey, displayKey } = generateAPIKey();

  if (Env.MOCK_MODE === 'true') {
    const apiKey = {
      _id: uuidv4(),
      userId,
      name,
      hashedKey,
      displayKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.apikeys.push(apiKey);
    saveMockDb();
    return { rawKey };
  }

  const apiKey = new ApiKeyModel({
    userId,
    name,
    hashedKey,
    displayKey,
  });
  await apiKey.save();

  return {
    rawKey,
  };
};

export const getAllApiKeysService = async (
  userId: string,
  pagination: {
    pageSize: number;
    pageNumber: number;
  },
) => {
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  if (Env.MOCK_MODE === 'true') {
    const userKeys = mockDb.apikeys.filter((k: any) => k.userId === userId);
    const totalCount = userKeys.length;
    const paginatedKeys = userKeys.slice(skip, skip + pageSize);
    return {
      apiKeys: paginatedKeys,
      pageination: {
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageNumber,
        skip,
      },
    };
  }

  const [apiKeys, totalCount] = await Promise.all([
    ApiKeyModel.find({ userId })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }),
    ApiKeyModel.countDocuments({ userId }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    apiKeys,
    pageination: {
      pageSize,
      totalCount,
      totalPages,
      pageNumber,
      skip,
    },
  };
};

export const deleteApiKeyService = async (userId: string, apiKeyId: string) => {
  if (Env.MOCK_MODE === 'true') {
    const initialLen = mockDb.apikeys.length;
    mockDb.apikeys = mockDb.apikeys.filter(
      (k: any) => !(k._id === apiKeyId && k.userId === userId)
    );
    if (mockDb.apikeys.length === initialLen) {
      throw new NotFoundException('API Key not found');
    }
    saveMockDb();
    return { deletedCount: 1 };
  }

  const result = await ApiKeyModel.deleteOne({
    _id: apiKeyId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw new NotFoundException('API Key not found');
  }

  return {
    deletedCount: result.deletedCount,
  };
};
