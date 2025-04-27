import { Request, Response } from "express";
import { TaskModel } from "../models/task.model";
import User from '../models/user.model';
import { redisClient } from '../config/redisClient';
import dotenv from 'dotenv';
dotenv.config();

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assignedTo } = req.body; 

    let formattedDueDate = req.body.dueDate;
    if (formattedDueDate) {
      formattedDueDate = new Date(formattedDueDate).toISOString();
    }

    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) {
         res.status(404).json({ 
          statusCode: 404,
           message: "User not found"
         });
         return;
      }
    }

    const task = await TaskModel.create({
      ...req.body,
      dueDate: formattedDueDate,
    });
    await redisClient.del('tasks:*');

    res.status(201).json({ 
      statusCode: 201,
      task
   
    });  

  } catch (error:any) {
    res.status(500).json({ 
      statusCode: 500, 
      message: "Internal server error", 
      error: error.message,
     
    });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await TaskModel.findById(req.params.id)
      .select("title status dueDate")
      .populate("assignedTo", "name email")
      .lean();

    if (!task) {
      res.status(404).json({
        statusCode: 404,
        message: "Task not found", 
  
      });
      return;
    }

    res.json({
      statusCode: 200,
      message: "Successfully fetched task",
      task: task,
   
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error", 
      error: error.message,
     
    });
  }
};

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  console.log("Query Parameters: ", req.query);  
  const { status, dueDate,assignedTo, page = 1, limit = 5 } = req.query;

 
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const query: any = {};
  if (status) query.status = status;
  if (dueDate) query.dueDate = { $lte: new Date(dueDate as string) };
  if (assignedTo) query.assignedTo = assignedTo; 
  console.log("Query after applying filters: ", query); 

  try {

     // Check if data is cached in Redis
     const cacheKey = `tasks:${JSON.stringify(query)}:${pageNum}:${limitNum}`;
     const cachedTasks = await redisClient.get(cacheKey);
     if (cachedTasks) {
      console.log('Returning data from cache'); 
      res.json(JSON.parse(cachedTasks));
      return;  // Return cached data
    }


    const skip = (pageNum - 1) * limitNum;

    const tasks = await TaskModel.find(query)
      .select("title status dueDate")  
      .populate("assignedTo", "name email")
      .skip(skip)  
      .limit(limitNum) 
      .lean(); 

    if (tasks.length === 0) {
      res.status(404).json({
        statusCode: 404,
        message: "No tasks found",
      });
      return;
    }

    const totalTasks = await TaskModel.countDocuments(query)
    const totalPages = Math.ceil(await TaskModel.countDocuments(query) / limitNum)
    const response = {
      statusCode: 200,
      message: "Successfully fetched tasks",
      tasks: tasks,
      pagination: {
        currentPage: pageNum,
        totalTasks: totalTasks,
        totalPages: totalPages,
        limit: limitNum,
      },
    };


    await redisClient.setEx(cacheKey, 60, JSON.stringify(response));

     res.json(response); 
     return; 
  } catch (error: any) {
    res.status(500).json({ 
      statusCode: 500,
      message: "Error fetching tasks", 
      error: error.message,
    });
  }
};


export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      res.status(404).json({
        statusCode: 404,
        message: "Task not found", 
  
      });
      return;
    }

    await redisClient.del('tasks:*');  
    res.json({ 
      statusCode: 200,
      task
   
    });
  } catch (error:any) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error", 
      error: error.message,
     
    });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({
        statusCode: 404,
        message: "Task not found", 
      
      });
      return;
    }
    await redisClient.del('tasks:*');  // Delete the cached task list

    res.json({
      statusCode: 200,
      message: "Task deleted", 
 
    });
  } catch (error:any) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error", 
      error: error.message,
     
    });
  }
};
