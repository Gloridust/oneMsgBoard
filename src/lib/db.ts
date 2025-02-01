import { D1Database } from '@cloudflare/workers-types';
import { User, Board, Post, Comment } from '@/types/user';

interface DatabaseUser extends User {
  password_hash: string;
}

export class Database {
  constructor(private db: D1Database) {}

  // 用户相关方法
  async getUserByUsername(username: string): Promise<DatabaseUser | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first<DatabaseUser>();
    return result || null;
  }

  async getUserByUuid(uuid: string): Promise<User | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE uuid = ?')
      .bind(uuid)
      .first<DatabaseUser>();
    
    if (!result) return null;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user } = result;
    return user;
  }

  async createUser(user: DatabaseUser): Promise<DatabaseUser> {
    await this.db
      .prepare(
        `INSERT INTO users (uuid, username, password_hash, nickname, gender, role, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        user.uuid,
        user.username,
        user.password_hash,
        user.nickname || null,
        user.gender || null,
        user.role,
        user.createdAt.toISOString()
      )
      .run();

    return user;
  }

  async isFirstUser(): Promise<boolean> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as count FROM users')
      .first<{ count: number }>();
    return result?.count === 0;
  }

  // 留言板相关方法
  async createBoard(board: Omit<Board, 'id'>): Promise<Board> {
    const result = await this.db
      .prepare(
        `INSERT INTO boards (name, description, creator_uuid, is_public, created_at)
         VALUES (?, ?, ?, ?, ?)
         RETURNING *`
      )
      .bind(
        board.name,
        board.description || null,
        board.creatorUuid,
        board.isPublic,
        board.createdAt.toISOString()
      )
      .first<Board>();

    if (!result) {
      throw new Error('创建留言板失败');
    }

    return result;
  }

  async getBoard(id: number): Promise<Board | null> {
    const result = await this.db
      .prepare('SELECT * FROM boards WHERE id = ?')
      .bind(id)
      .first<Board>();
    return result || null;
  }

  async getUserBoards(userUuid: string): Promise<Board[]> {
    const results = await this.db
      .prepare(
        `SELECT DISTINCT b.* FROM boards b
         LEFT JOIN permissions p ON b.id = p.board_id
         WHERE b.is_public = true 
         OR b.creator_uuid = ?
         OR (p.user_uuid = ? AND p.can_read = true)`
      )
      .bind(userUuid, userUuid)
      .all<Board>();

    return results.results;
  }

  // 权限相关方法
  async setPermission(
    userUuid: string,
    boardId: number,
    canRead: boolean,
    canWrite: boolean
  ): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO permissions (user_uuid, board_id, can_read, can_write)
         VALUES (?, ?, ?, ?)
         ON CONFLICT (user_uuid, board_id)
         DO UPDATE SET can_read = ?, can_write = ?`
      )
      .bind(userUuid, boardId, canRead, canWrite, canRead, canWrite)
      .run();
  }

  async getPermission(userUuid: string, boardId: number) {
    return await this.db
      .prepare(
        `SELECT can_read, can_write FROM permissions
         WHERE user_uuid = ? AND board_id = ?`
      )
      .bind(userUuid, boardId)
      .first<{ can_read: boolean; can_write: boolean }>();
  }

  // 帖子相关方法
  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    const result = await this.db
      .prepare(
        `INSERT INTO posts (board_id, author_uuid, content, created_at)
         VALUES (?, ?, ?, ?)
         RETURNING *`
      )
      .bind(
        post.boardId,
        post.authorUuid,
        post.content,
        post.createdAt.toISOString()
      )
      .first<Post>();

    if (!result) {
      throw new Error('创建帖子失败');
    }

    return result;
  }

  async getBoardPosts(boardId: number): Promise<Post[]> {
    const results = await this.db
      .prepare('SELECT * FROM posts WHERE board_id = ? ORDER BY created_at DESC')
      .bind(boardId)
      .all<Post>();

    return results.results;
  }

  // 评论相关方法
  async createComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
    const result = await this.db
      .prepare(
        `INSERT INTO comments (post_id, author_uuid, content, created_at)
         VALUES (?, ?, ?, ?)
         RETURNING *`
      )
      .bind(
        comment.postId,
        comment.authorUuid,
        comment.content,
        comment.createdAt.toISOString()
      )
      .first<Comment>();

    if (!result) {
      throw new Error('创建评论失败');
    }

    return result;
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    const results = await this.db
      .prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC')
      .bind(postId)
      .all<Comment>();

    return results.results;
  }

  // 点赞相关方法
  async toggleLike(userUuid: string, postId: number): Promise<boolean> {
    const exists = await this.db
      .prepare('SELECT 1 FROM likes WHERE user_uuid = ? AND post_id = ?')
      .bind(userUuid, postId)
      .first<{ 1: number }>();

    if (exists) {
      await this.db
        .prepare('DELETE FROM likes WHERE user_uuid = ? AND post_id = ?')
        .bind(userUuid, postId)
        .run();
      return false;
    } else {
      await this.db
        .prepare(
          'INSERT INTO likes (user_uuid, post_id, created_at) VALUES (?, ?, ?)'
        )
        .bind(userUuid, postId, new Date().toISOString())
        .run();
      return true;
    }
  }

  async getPostLikes(postId: number): Promise<number> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as count FROM likes WHERE post_id = ?')
      .bind(postId)
      .first<{ count: number }>();

    return result?.count || 0;
  }

  async hasUserLikedPost(userUuid: string, postId: number): Promise<boolean> {
    const result = await this.db
      .prepare('SELECT 1 FROM likes WHERE user_uuid = ? AND post_id = ?')
      .bind(userUuid, postId)
      .first<{ 1: number }>();

    return !!result;
  }
} 
