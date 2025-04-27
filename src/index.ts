import express from 'express';
import { loggerMiddleware } from "./middleware/logger";
import dotenv from 'dotenv';
import connectDB from './models/db';  // Import the DB connection
import authRoutes from './routes/user.routes';
import taskRoutes from "./routes/task.routes";
import { connectRedis} from './config/redisClient';


dotenv.config();

const app = express();
app.use(loggerMiddleware);
connectRedis()
  .then(() => console.log('Redis Connected Successfully'))
  .catch((err:any) => console.error('Redis Connection Failed', err));
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Use the authentication routes
app.use('/api/auth', authRoutes);
app.use("/api/task", taskRoutes);

// Connect to MongoDB
connectDB();
app.use('/',(req,res)=>{
  res.send("server is running")
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
