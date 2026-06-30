import bcrypt from "bcryptjs";
import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sendError } from "../utils/response.js";

type LoginBody = {
  username?: string;
  password?: string;
};

export const authRouter = Router();

const isBcryptHash = (value: string): boolean => /^\$2[aby]\$\d{2}\$/.test(value);

authRouter.post("/login", async (req: Request<object, object, LoginBody>, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    sendError(res, "Usuario y password son requeridos", 400);
    return;
  }

  const usernameMatches = username === env.adminUser;
  const passwordMatches = isBcryptHash(env.adminPassword)
    ? await bcrypt.compare(password, env.adminPassword)
    : password === env.adminPassword;

  if (!usernameMatches || !passwordMatches) {
    res.status(401).json({
      success: false,
      message: "Credenciales incorrectas",
    });
    return;
  }

  const user = {
    username: env.adminUser,
    role: "admin" as const,
  };

  const token = jwt.sign(user, env.jwtSecret, { expiresIn: "8h" });

  res.json({
    success: true,
    token,
    user,
  });
});

authRouter.get("/me", authMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: req.user,
  });
});
