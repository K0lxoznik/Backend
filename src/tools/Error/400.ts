import { Response } from 'express';

export const send400Error = (res: Response): void => {
  res.status(400).json({
    status: 'error',
    message: 'Bad request',
    });
};
