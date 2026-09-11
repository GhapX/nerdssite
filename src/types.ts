export type GeminiRole = 'user' | 'model';

export interface GeminiMessage {
  role: GeminiRole;
  text: string;
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

export interface Course {
  id: number;
  title: string;
  category: string;
  progress: number;
  image: string;
  signupUrl?: string;
  description?: string;
}

export interface Article {
  id: number;
  title: string;
  tags: string[];
  date: string;
  readTime: string;
  image?: string;
  content?: string;
  url?: string;
}

export interface Edict {
  id: number;
  title: string;
  type: string;
  deadline: string;
  status: 'Aberto' | 'Em breve';
  description?: string;
  formUrl?: string;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  image?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  url: string;
}

export interface Prototype {
  id: number;
  title: string;
  summary: string;
  description: string;
  status: string;
  stack: string[];
  image: string;
  url?: string;
}
