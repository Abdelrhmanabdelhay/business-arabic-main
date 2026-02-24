export interface CreateIdeaClubDto {
  name: string;
  description: string;
  content: string;
  category: string;
}

export interface UpdateIdeaClubDto {
  name?: string;
  description?: string;
  content?: string;
  category: string;
}

export interface IdeaClubResponseDto {
  id: string;
  name: string;
  description: string;
  category: string;
  content: Map<object, any>[];
  createdAt: string;
  updatedAt: string;
}

export interface IdeaClubListResponseDto {
  ideas: any[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
}
export interface PaymentResponseDto {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
