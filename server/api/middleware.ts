import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from './token';
import { Cookies } from './types';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = verifyAccessToken(req.cookies[Cookies.AccessToken]);
  if (!token) {
    res.status(401);
    return new Error('Not signed in');
  }
  res.locals.token = token;
  next();
}
