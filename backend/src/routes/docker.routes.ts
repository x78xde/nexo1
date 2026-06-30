import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { dockerService } from "../services/docker.service.js";
import { getErrorMessage, sendError, sendSuccess } from "../utils/response.js";

type ContainerParams = {
  id: string;
};

export const dockerRouter = Router();

dockerRouter.use(authMiddleware);

dockerRouter.get("/containers", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await dockerService.listContainers());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

dockerRouter.post(
  "/containers/:id/start",
  async (req: Request<ContainerParams>, res: Response) => {
    try {
      sendSuccess(res, await dockerService.startContainer(req.params.id));
    } catch (error) {
      sendError(res, getErrorMessage(error));
    }
  },
);

dockerRouter.post(
  "/containers/:id/stop",
  async (req: Request<ContainerParams>, res: Response) => {
    try {
      sendSuccess(res, await dockerService.stopContainer(req.params.id));
    } catch (error) {
      sendError(res, getErrorMessage(error));
    }
  },
);

dockerRouter.post(
  "/containers/:id/restart",
  async (req: Request<ContainerParams>, res: Response) => {
    try {
      sendSuccess(res, await dockerService.restartContainer(req.params.id));
    } catch (error) {
      sendError(res, getErrorMessage(error));
    }
  },
);
