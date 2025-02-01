import { D1Database } from '@cloudflare/workers-types';
import { Database } from './db';

let db: Database | null = null;

export function getDatabase(d1: D1Database): Database {
  if (!db) {
    db = new Database(d1);
  }
  return db;
} 