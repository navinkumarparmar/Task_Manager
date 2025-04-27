import express from 'express';
import { loggerMiddleware } from "./middleware/logger";
import dotenv from 'dotenv';
import connectDB from './models/db';  // Import the DB connection
import authRoutes from './routes/user.routes';
import taskRoutes from "./routes/task.routes";
import { connectRedis} from './config/redisClient';
import path from 'path'; 

dotenv.config();

const app = express();
app.use(loggerMiddleware);
connectRedis()

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Use the authentication routes
app.use('/api/auth', authRoutes);
app.use("/api/task", taskRoutes);

// Connect to MongoDB
connectDB();
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));  
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
