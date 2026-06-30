import type { Response } from "express";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
): Response<ApiSuccess<T>> => res.status(statusCode).json({ success: true, data });

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
): Response<ApiError> => res.status(statusCode).json({ success: false, message });

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Error interno del servidor";
};
