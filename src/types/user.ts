export type Gender = 'male' | 'female' | 'other';
export type UserRole = 'admin' | 'user';

export interface User {
  uuid: string;
  username: string;
  nickname?: string;
  gender?: Gender;
  birthday?: Date;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Board {
  id: number;
  name: string;
  description?: string;
  creatorUuid: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface Permission {
  userUuid: string;
  boardId: number;
  canRead: boolean;
  canWrite: boolean;
}

export interface Post {
  id: number;
  boardId: number;
  authorUuid: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Comment {
  id: number;
  postId: number;
  authorUuid: string;
  content: string;
  createdAt: Date;
}

export interface Like {
  userUuid: string;
  postId: number;
} 