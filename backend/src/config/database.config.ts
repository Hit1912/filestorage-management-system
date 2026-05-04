import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Env } from './env.config';
import { logger } from '../utils/logger';

let mongoServer: MongoMemoryServer | null = null;

const connectDatabase = async () => {
  if (Env.MOCK_MODE === 'true') {
    logger.warn('*** MOCK MODE ENABLED: Skipping real database connection ***');
    return;
  }

  try {
    // Try connecting to the provided MONGO_URI
    await mongoose.connect(Env.MONGO_URI);
    logger.info('Connected to Mongo database');
  } catch (error) {
    logger.error(
      'Failed to connect to Mongo database. Attempting to start Mock Mode (In-Memory)...',
    );

    try {
      // Fallback to In-Memory MongoDB if local connection fails
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);

      logger.warn('-------------------------------------------------------');
      logger.warn('*** RUNNING IN MOCK MODE (In-Memory Database) ***');
      logger.warn('Note: Your data will NOT be persisted across restarts.');
      logger.warn('To use a real database, please start your local MongoDB');
      logger.warn('or provide a valid MONGO_URI in the .env file.');
      logger.warn('-------------------------------------------------------');
    } catch (mockError) {
      logger.error(
        'Critical Error: Failed to start even in Mock Mode. The server is running in a DEGRADED STATE (No Database).',
      );
      logger.error('Please check your .env file and ensure MONGO_URI is correct.');
      // We don't exit here so the user can see the logs and fix the .env file
    }
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    logger.info('Disconnected from Mongo database');
  } catch (error) {
    logger.error('Error disconnecting from Mongo database', error);
  }
};

export { connectDatabase, disconnectDatabase };
