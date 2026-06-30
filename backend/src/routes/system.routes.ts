import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { systemService } from "../services/system.service.js";
import { getErrorMessage, sendError, sendSuccess } from "../utils/response.js";

export const systemRouter = Router();

systemRouter.use(authMiddleware);

systemRouter.get("/health", (_req: Request, res: Response) => {
  sendSuccess(res, systemService.getHealth());
});

systemRouter.get("/metrics", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await systemService.getMetrics());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

systemRouter.get("/disks", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await systemService.getDisks());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

systemRouter.get("/network", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await systemService.getNetwork());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});
