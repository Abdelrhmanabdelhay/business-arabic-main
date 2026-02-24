export interface CreatePostDto {
  title: string;
  content: Map<object, any>[];
  image?: string;
  seoScore: number;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  image?: string;
  seoScore: number;
}

export interface PostResponseDto {
  id: string;
  title: string;
  content: Map<object, any>[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostListResponseDto {
  posts: PostResponseDto[];
  total: number;
  page: number;
  limit: number;
}
