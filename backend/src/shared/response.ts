import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export function sendSuccess<T>(res: Response, data: T, message = "Success", statusCode = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode = 400, errors?: string[]): void {
  const response: ApiResponse = {
    success: false,
    message,
    data: null,
    errors,
  };
  res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  limit: number,
  message = "Success",
): void {
  const response = {
    success: true,
    message,
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
  res.status(200).json(response);
}
