import { NextApiRequest, NextApiResponse } from 'next';
import { registerSchema } from '@/lib/validations';
import { hashPassword, generateToken } from '@/lib/auth';
import { serialize } from 'cookie';
import { v4 as uuidv4 } from 'uuid';
import { Gender } from '@/types/user';
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
    const data = registerSchema.parse(req.body);

    // 从环境变量获取D1实例
    const d1 = process.env.DB as unknown as D1Database;
    if (!d1) {
      throw new Error('数据库未配置');
    }

    const db = getDatabase(d1);

    // 检查用户名是否已存在
    const existingUser = await db.getUserByUsername(data.username);
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 检查是否是第一个用户（将作为管理员）
    const isFirstUser = await db.isFirstUser();

    // 创建新用户
    const user = await db.createUser({
      uuid: uuidv4(),
      username: data.username,
      password_hash: await hashPassword(data.password),
      role: isFirstUser ? 'admin' : 'user',
      nickname: data.nickname,
      gender: data.gender as Gender | undefined,
      createdAt: new Date(),
    });

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
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('注册错误:', error);
    return res.status(400).json({ message: '注册失败' });
  }
} 