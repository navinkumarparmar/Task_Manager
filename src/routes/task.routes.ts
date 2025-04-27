import express from "express";
import { body, param, query } from "express-validator";
import { createTask ,getTaskById ,updateTask,deleteTask,getAllTasks} from "../controllers/task.controller";
import { validateRequest } from "../middleware/validateRequest";
import { authMiddleware ,adminOnly} from "../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  body("title").notEmpty(),
  body("assignedTo").isMongoId(),
  validateRequest,
  createTask
);

router.get("/all", authMiddleware, getAllTasks);

router.get("/:id", authMiddleware, param("id").isMongoId(), validateRequest, getTaskById);

router.put(
  "/update/:id",
  authMiddleware,
  param("id").isMongoId(),
  validateRequest,
  updateTask
);

router.delete("/delete/:id", authMiddleware, adminOnly, param("id").isMongoId(), validateRequest, deleteTask);

export default router;
