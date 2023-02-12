import { Response } from "express";

export const send404Error = (res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: 'Not found',
  });
};