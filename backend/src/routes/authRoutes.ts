import { Router, Request, Response } from 'express';
import { dataService } from '../services/dataService';
import { v4 as uuidv4 } from 'uuid';
import type { AuthResponse } from '../models/types';

const router = Router();

// Login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email y contraseña son requeridos',
    } as AuthResponse);
  }

  const user = dataService.findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Credenciales inválidas',
    } as AuthResponse);
  }

  // Actualizar estado a online
  dataService.updateUserStatus(user.userId, 'online');

  // Generar token simple (en producción usar JWT)
  const accessToken = `token-${user.userId}-${Date.now()}`;

  const response: AuthResponse = {
    success: true,
    user: {
      userId: user.userId,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      status: 'online',
    },
    accessToken,
  };

  res.json(response);
});

// Register
router.post('/register', (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Todos los campos son requeridos',
    } as AuthResponse);
  }

  // Verificar si el usuario ya existe
  const existingUser = dataService.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'El email ya está registrado',
    } as AuthResponse);
  }

  // Crear nuevo usuario
  const user = dataService.createUser(email, username, password);

  // Generar token
  const accessToken = `token-${user.userId}-${Date.now()}`;

  const response: AuthResponse = {
    success: true,
    user: {
      userId: user.userId,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      status: 'online',
    },
    accessToken,
  };

  res.status(201).json(response);
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  const { userId } = req.body;

  if (userId) {
    dataService.updateUserStatus(userId, 'offline');
  }

  res.json({ success: true });
});

export default router;