export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline: Date;
  subject: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}