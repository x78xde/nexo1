import cors from "cors";
import express, { type Request, type Response } from "express";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { dockerRouter } from "./routes/docker.routes.js";
import { proxmoxRouter } from "./routes/proxmox.routes.js";
import { systemRouter } from "./routes/system.routes.js";
import { sendError, sendSuccess } from "./utils/response.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  sendSuccess(res, {
    name: "Nexo Lab Backend",
    version: "1.0.0",
    status: "ok",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/proxmox", proxmoxRouter);
app.use("/api/system", systemRouter);
app.use("/api/docker", dockerRouter);

app.use((_req: Request, res: Response) => {
  sendError(res, "Ruta no encontrada", 404);
});

app.listen(env.port, () => {
  console.log(`Nexo Lab Backend listening on port ${env.port}`);
});
