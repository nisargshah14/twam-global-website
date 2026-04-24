import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const router = Router();

router.post('/login', (req: Request, res: Response): void => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }

  const expectedUser = Buffer.from(config.adminUser);
  const expectedPass = Buffer.from(config.adminPass);
  const givenUser = Buffer.from(username);
  const givenPass = Buffer.from(password);

  const userMatch =
    givenUser.length === expectedUser.length &&
    crypto.timingSafeEqual(givenUser, expectedUser);
  const passMatch =
    givenPass.length === expectedPass.length &&
    crypto.timingSafeEqual(givenPass, expectedPass);

  if (!userMatch || !passMatch) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ sub: username }, config.jwtSecret, { expiresIn: '8h' });
  res.json({ token });
});

export default router;
