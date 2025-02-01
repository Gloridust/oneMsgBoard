import { NextApiRequest, NextApiResponse } from 'next';
import { loginSchema } from '@/lib/validations';
import { verifyPassword, generateToken } from '@/lib/auth';
import { serialize } from 'cookie';
import { getDatabase } from '@/lib/db-factory';
import { D1Database } from '@cloudflare/workers-types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    // 验证请求数据
    const data = loginSchema.parse(req.body);

    // 从环境变量获取D1实例
    const d1 = process.env.DB as unknown as D1Database;
    if (!d1) {
      throw new Error('数据库未配置');
    }

    // 从数据库中获取用户
    const db = getDatabase(d1);
    const user = await db.getUserByUsername(data.username);

    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValid = await verifyPassword(user.password_hash, data.password);

    if (!isValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成JWT令牌
    const token = generateToken({
      uuid: user.uuid,
      role: user.role,
    });

    // 设置cookie
    res.setHeader(
      'Set-Cookie',
      serialize('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7天
      })
    );

    // 返回用户信息（不包含密码）
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('登录错误:', error);
    return res.status(400).json({ message: '登录失败' });
  }
} 