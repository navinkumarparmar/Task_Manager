import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model"; 
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
console.log("JWT_SECRET",JWT_SECRET)

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" });
      return; 
    }

    console.log("authHeader",authHeader)
    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log("decode",decoded)

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    (req as any).user = user; 
    next();
  } catch (error:any) {
    res.status(401).json({ message: "Invalid token" ,
      error: error.message
    });
  }
};


export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; 

  if (!user) {
     res.status(401).json({ message: "Unauthorized - No User" })
     return;
  }

  if (user.role !== "admin") {
     res.status(403).json({ message: "Access denied - Admins only" })
     return;
  }

  next();
};