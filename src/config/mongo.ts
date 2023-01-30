import mongoose, { ConnectOptions } from 'mongoose';
import logger from './logger';

export async function connect(): Promise<void> {
  const URL: string =
    process.env.MONGO_URL || 'mongodb://localhost:27017/DB_NAME';

  try {
    const db = await mongoose.connect(URL);
    logger.info.info(`MongoDB connected to ${db.connection.db.namespace}`);
  } catch (error) {
    logger.error.error(`MongoDB connection error: ${error}`);
  }
}
