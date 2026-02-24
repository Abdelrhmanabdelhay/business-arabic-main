export interface CreateLaunchedProjectDto {
  name: string;
  description: string;
  category: string;
  image: string;
  price: string;
}

export interface UpdateLaunchedProjectDto {
  name?: string;
  description?: string;
  image?: string;
  price?: string;
}

export interface LaunchedProjectResponseDto {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: string;
  createdAt: Date;
}

export interface LaunchedProjectListResponseDto {
  projects: LaunchedProjectResponseDto[];
  total: number;
  page: number;
  limit: number;
}

