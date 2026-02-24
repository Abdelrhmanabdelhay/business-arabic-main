export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  createdAt: string;
}

export interface Idea {
  id: string;
  name: string;
  description: string;
  category: string;
  content: Record<string, any>;  // Using Record instead of Map for JSON compatibility
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface IdeasResponse {
  ideas: Idea[];
  total: number;
  page: number;
  limit: number;
}
