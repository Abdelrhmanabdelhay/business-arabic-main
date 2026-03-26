export interface CreateGrowthServiceDto {
  icon: string;
  title: string;
  description: string;
}

export interface UpdateGrowthServiceDto {
  icon?: string;
  title?: string;
  description?: string;
}

export interface GrowthServiceResponseDto {
  id: string;
  icon: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthServiceListResponseDto {
  services: GrowthServiceResponseDto[];
  total: number;
}