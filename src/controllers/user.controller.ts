import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class AuthController {
  
    static async register(req: Request, res: Response): Promise<Response> {
        const { name, email, password,role } = req.body;

        try {
           
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashedPassword,
                role: role
             
            });

            await user.save();
            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    }

    static async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
           console.log("reqbody",req.body)
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

            return res.status(200).json({ token });
        } catch (error:any) {
            return res.status(500).json({
                 message: 'Server error',
                 error: error.message

             });
        }
    }
}

export default AuthController;
