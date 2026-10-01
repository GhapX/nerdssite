export interface Project {
  id: number;
  title: string;
  description: string;
  stack: string[];
  image: string;
  url?: string;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  image?: string;
}
