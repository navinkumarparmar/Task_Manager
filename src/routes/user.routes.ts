import express, { Request, Response } from 'express';
import AuthController from '../controllers/user.controller'; 

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  await AuthController.register(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await AuthController.login(req, res); 
});

export default router;
