import { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

interface EventContext<Env, P, Data> {
  env: Env;
  params: P;
  data: Data;
  next(): Promise<Response>;
}

export const onRequest = async (context: EventContext<Env, string, unknown>) => {
  try {
    // 将D1实例添加到环境变量中
    const env = context.env;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.env.DB = env.DB as any;

    return await context.next();
  } catch (error) {
    console.error('中间件错误:', error);
    return new Response('Internal Error', { status: 500 });
  }
}; 
