import app from './app';
import { connectRedis } from './config/redisClient';
import connectDB from './models/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Server and database connections
const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await connectDB();
      await connectRedis();
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
