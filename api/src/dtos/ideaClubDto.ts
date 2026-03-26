export interface CreateIdeaClubDto {
  name: string;
  description: string;
content: string[];
  category: string;
    imageUrl?: string;

}

export interface UpdateIdeaClubDto {
  name?: string;
  description?: string;
content?: string[];
  category: string;
    imageUrl?: string;

}

export interface IdeaClubResponseDto {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string[];
    createdAt: string;
  updatedAt: string;
    imageUrl?: string;

}

export interface IdeaClubListResponseDto {
  ideas: any[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
    imageUrl?: string;

}
export interface PaymentResponseDto {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
    imageUrl?: string;

}
