export interface CreateFeasibilityStudyDto {
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
}

export interface UpdateFeasibilityStudyDto {
  name?: string;
  description?: string;
  image?: string;
  price?: string;
  category?: string;
}

export interface FeasibilityStudyResponseDto {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
