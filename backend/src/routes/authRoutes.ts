// backend/src/routes/authRoutes.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { dataService } from '../services/dataService';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// ── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Email, username y password son requeridos' });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, error: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (dataService.getUserByEmail(email)) {
      return res
        .status(409)
        .json({ success: false, error: 'Ya existe un usuario con ese email' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const user = dataService.createUser({
      userId,
      email,
      username,
      passwordHash,
      createdAt: Date.now(),
      lastSeen: Date.now(),
      status: 'offline',
    });

    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { userId: user.userId, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Email y password son requeridos' });
    }

    const user = dataService.getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      user: { userId: user.userId, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// ── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const user = dataService.getUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  }
  res.json({
    success: true,
    user: { userId: user.userId, email: user.email, username: user.username },
  });
});

// ── GET /api/auth/users/search?q=... ────────────────────────────────────────
router.get('/users/search', authMiddleware, (req: AuthRequest, res: Response) => {
  const query = (req.query.q as string) || '';
  if (!query.trim()) {
    return res.json({ success: true, users: [] });
  }
  const users = dataService.searchUsers(query, req.userId).map((u) => ({
    userId: u.userId,
    email: u.email,
    username: u.username,
    status: u.status,
  }));
  res.json({ success: true, users });
});

export default router;
