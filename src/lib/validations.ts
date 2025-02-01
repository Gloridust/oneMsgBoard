import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

export const registerSchema = loginSchema.extend({
  nickname: z.string().min(2).max(20).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birthday: z.date().optional(),
});

export const boardSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  isPublic: z.boolean(),
});

export const postSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(500),
});

export const permissionSchema = z.object({
  userUuid: z.string().uuid(),
  boardId: z.number().int().positive(),
  canRead: z.boolean(),
  canWrite: z.boolean(),
}); 