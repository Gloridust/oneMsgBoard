import { hash, verify } from 'argon2';
import { sign, verify as verifyJwt } from 'jsonwebtoken';
import { User, UserRole } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

export async function verifyPassword(
  hashedPassword: string,
  password: string
): Promise<boolean> {
  return await verify(hashedPassword, password);
}

export function generateToken(user: Pick<User, 'uuid' | 'role'>): string {
  return sign(
    { uuid: user.uuid, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): {
  uuid: string;
  role: UserRole;
} {
  try {
    return verifyJwt(token, JWT_SECRET) as { uuid: string; role: UserRole };
  } catch {
    throw new Error('Invalid token');
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function canManageBoard(user: User | null, creatorUuid: string): boolean {
  return isAdmin(user) || user?.uuid === creatorUuid;
}

export function canManagePost(user: User | null, authorUuid: string): boolean {
  return isAdmin(user) || user?.uuid === authorUuid;
} 