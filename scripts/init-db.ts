import { D1Database } from '@cloudflare/workers-types';
import fs from 'fs';
import path from 'path';

async function initializeDatabase(db: D1Database) {
  try {
    // 读取初始化SQL文件
    const sqlFile = path.join(process.cwd(), 'db', 'migrations', '0000_initial.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    // 分割SQL语句
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // 执行每个SQL语句
    for (const statement of statements) {
      await db
        .prepare(statement)
        .run();
    }

    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

// 如果这个脚本被直接运行
if (require.main === module) {
  const d1 = process.env.DB as unknown as D1Database;
  if (!d1) {
    console.error('错误: 未找到数据库配置');
    process.exit(1);
  }

  initializeDatabase(d1)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default initializeDatabase; 