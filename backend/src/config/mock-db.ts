import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

const MOCK_DB_FILE = path.join(process.cwd(), 'mock-db.json');

// Helper to load data
const loadData = () => {
  try {
    if (fs.existsSync(MOCK_DB_FILE)) {
      const data = fs.readFileSync(MOCK_DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      
      // Convert date strings back to Date objects
      const reviveDates = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        for (const key in obj) {
          if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])) {
            const date = new Date(obj[key]);
            if (!isNaN(date.getTime())) {
              obj[key] = date;
            }
          } else if (typeof obj[key] === 'object') {
            reviveDates(obj[key]);
          }
        }
      };
      reviveDates(parsed);
      return parsed;
    }
  } catch (error) {
    logger.error('Failed to load mock database:', error);
  }
  return {
    users: [],
    files: [],
    storage: [],
    apikeys: [],
  };
};

// In-memory database for Mock Mode with persistence
export const mockDb = loadData();

// Helper to save data
export const saveMockDb = () => {
  try {
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(mockDb, null, 2));
  } catch (error) {
    logger.error('Failed to save mock database:', error);
  }
};

logger.warn('Mock Database initialized with file persistence.');
