import { Response } from "express";

export const send401Error = (res: Response): void => {
  res.status(401).json({
    status: 'error',
    message: 'Unauthorized',
  });
};