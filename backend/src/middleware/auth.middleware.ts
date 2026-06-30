import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

export type AuthUser = {
  username: string;
  role: "admin";
};

type JwtPayload = AuthUser & {
  iat?: number;
  exp?: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "Token no proporcionado", 401);
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = {
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch {
    sendError(res, "Token invalido o expirado", 401);
  }
};
