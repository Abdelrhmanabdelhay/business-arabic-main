export interface CreateBlogDto {
  title: string;
  summary: string;
  content: Map<object, any>[];
  image?: string;
}

export interface UpdateBlogDto {
  title?: string;
  summary?: string;
  content?: string;
  image?: string;
}

export interface BlogResponseDto {
  id: string;
  title: string;
  summary: string;
  content: Map<object, any>[];
  image?: string;
}

export interface BlogListResponseDto {
  blogs: BlogResponseDto[];
  total: number;
  page: number;
  limit: number;
}
