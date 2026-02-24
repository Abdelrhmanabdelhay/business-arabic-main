export interface BlogPost {
  _id: string;
  title: string;
  content?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  imageUrl: string;
  seoScore: number;
  createdAt: string;
}

export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}