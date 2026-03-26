export interface CreateSuccessStoryDto {
  name: string;
  company: string;
  revenue: string;
  quote: string;
  avatar?: string;
  color?: string;
}

export interface UpdateSuccessStoryDto {
  name?: string;
  company?: string;
  revenue?: string;
  quote?: string;
  avatar?: string;
  color?: string;
}

export interface SuccessStoryResponseDto {
  id: string;
  name: string;
  company: string;
  revenue: string;
  quote: string;
  avatar?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuccessStoryListResponseDto {
  stories: SuccessStoryResponseDto[];
  total: number;
  page: number;
  limit: number;
}