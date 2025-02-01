import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';
import { User } from '@/types/user';
import { getDatabase } from './db-factory';
import { D1Database } from '@cloudflare/workers-types';

export interface AuthenticatedRequest extends NextApiRequest {
  user: User;
  db: D1Database;
}

type ApiHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface WithAuthOptions {
  methods?: Method[];
  requireAdmin?: boolean;
}

export function withAuth(handler: ApiHandler, options: WithAuthOptions = {}) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // 检查请求方法
    if (options.methods && !options.methods.includes(req.method as Method)) {
      return res.status(405).json({ message: '方法不允许' });
    }

    try {
      // 从cookie中获取token
      const token = req.cookies.auth_token;

      if (!token) {
        return res.status(401).json({ message: '未认证' });
      }

      // 验证token
      const payload = verifyToken(token);

      // 如果需要管理员权限，检查用户角色
      if (options.requireAdmin && payload.role !== 'admin') {
        return res.status(403).json({ message: '权限不足' });
      }

      // 从环境变量获取D1实例
      const d1 = process.env.DB as unknown as D1Database;
      if (!d1) {
        throw new Error('数据库未配置');
      }

      // 从数据库获取用户信息
      const db = getDatabase(d1);
      const user = await db.getUserByUuid(payload.uuid);

      if (!user) {
        return res.status(401).json({ message: '用户不存在' });
      }

      // 将用户信息和数据库实例添加到请求对象
      (req as AuthenticatedRequest).user = user;
      (req as AuthenticatedRequest).db = d1;

      // 调用实际的处理函数
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('API认证错误:', error);
      return res.status(401).json({ message: '认证失败' });
    }
  };
}

// 这个函数需要根据实际的数据库实现来修改
async function getUserFromDatabase(uuid: string): Promise<User | null> {
  // 临时返回一个模拟用户，等待数据库实现
  return {
    uuid,
    username: 'temp_user',
    role: 'user',
    createdAt: new Date(),
  };
} 
