export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

export interface Article {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  author: User;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  articleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ArticleFormData {
  title: string;
  content: string;
  status: 'draft' | 'published';
}
