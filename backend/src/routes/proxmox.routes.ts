import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { proxmoxService } from "../services/proxmox.service.js";
import { getErrorMessage, sendError, sendSuccess } from "../utils/response.js";

type VmidParams = {
  vmid: string;
};

export const proxmoxRouter = Router();

proxmoxRouter.use(authMiddleware);

proxmoxRouter.get("/version", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.getVersion());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.get("/nodes", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.getNodes());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.get("/cluster/status", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.getClusterStatus());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.get("/storage", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.getStorage());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.get("/resources", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.getResources());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.get("/vms", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.getVirtualMachines());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.get("/containers", async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.getContainers());
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.post("/vms/:vmid/start", async (req: Request<VmidParams>, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.runVirtualMachineAction(req.params.vmid, "start"));
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.post("/vms/:vmid/stop", async (req: Request<VmidParams>, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.runVirtualMachineAction(req.params.vmid, "stop"));
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.post("/vms/:vmid/reboot", async (req: Request<VmidParams>, res: Response) => {
  try {
    sendSuccess(res, await proxmoxService.runVirtualMachineAction(req.params.vmid, "reboot"));
  } catch (error) {
    sendError(res, getErrorMessage(error));
  }
});

proxmoxRouter.post(
  "/containers/:vmid/start",
  async (req: Request<VmidParams>, res: Response) => {
    try {
      sendSuccess(res, await proxmoxService.runContainerAction(req.params.vmid, "start"));
    } catch (error) {
      sendError(res, getErrorMessage(error));
    }
  },
);

proxmoxRouter.post(
  "/containers/:vmid/stop",
  async (req: Request<VmidParams>, res: Response) => {
    try {
      sendSuccess(res, await proxmoxService.runContainerAction(req.params.vmid, "stop"));
    } catch (error) {
      sendError(res, getErrorMessage(error));
    }
  },
);

proxmoxRouter.post(
  "/containers/:vmid/reboot",
  async (req: Request<VmidParams>, res: Response) => {
    try {
      sendSuccess(res, await proxmoxService.runContainerAction(req.params.vmid, "reboot"));
    } catch (error) {
      sendError(res, getErrorMessage(error));
    }
  },
);
