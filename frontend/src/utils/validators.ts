import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const messageSchema = z.object({
  text: z.string().min(1, 'El mensaje no puede estar vacío').max(1000, 'El mensaje es muy largo'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;