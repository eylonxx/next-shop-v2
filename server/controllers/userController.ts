import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { buildTokens, setTokens } from '../api/token';
import { login } from '../api/userService';

const authUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    let user = await login(req.body);
    if (!user) {
      res.status(404).json('user not found');
      return;
    }
    const { accessToken, refreshToken } = buildTokens(user);
    setTokens(res, accessToken, refreshToken);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json(error.message);
  }
  // const user = await User.findOne({ email });
});

export { authUser };
