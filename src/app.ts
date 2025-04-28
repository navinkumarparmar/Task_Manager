import express from 'express';
import { loggerMiddleware } from './middleware/logger';
import dotenv from 'dotenv';
import authRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import path from 'path';

dotenv.config();

const app = express();

// Middlewares
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

// Static HTML route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
