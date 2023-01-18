import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import userRoutes from './routes/userRoutes';
import { buildTokens, clearTokens, refreshTokens, setTokens, verifyRefreshToken } from './api/token';
import { Cookies } from './api/types';
import { getUserById, increaseTokenVersion } from './api/userService';
import { authMiddleware } from './api/middleware';

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.post('/api/refresh', async (req, res) => {
  try {
    const current = verifyRefreshToken(req.cookies[Cookies.RefreshToken]);
    const user = await getUserById(current.userId);
    if (!user) throw 'User not found';

    const { accessToken, refreshToken } = refreshTokens(current, user.tokenVersion);
    setTokens(res, accessToken, refreshToken);
  } catch (error) {
    clearTokens(res);
  }
});
app.post('/api/logout', authMiddleware, (req, res) => {
  clearTokens(res);
  res.end();
});
app.post('/api/logout-all', async (req, res) => {
  await increaseTokenVersion(res.locals.token.userId);

  clearTokens(res);
  res.end();
});
app.get('/me', async (req, res) => {
  const user = await getUserById(res.locals.token.userId);
  res.status(200).json(user);
});

app.get('/', (req, res) => res.send('hiy'));

app.listen(3001, () => {
  console.log('running on port 3001');
});
