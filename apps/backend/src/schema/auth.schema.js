import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().trim().email('Ingresa un correo válido.').toLowerCase(),
  phone: z.string().trim().min(7, 'Ingresa un teléfono válido.'),
  password: z.string().min(5, 'La contraseña debe tener al menos 5 caracteres.'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Ingresa un correo válido.').toLowerCase(),
  password: z.string().min(5, 'La contraseña debe tener al menos 5 caracteres.'),
});
