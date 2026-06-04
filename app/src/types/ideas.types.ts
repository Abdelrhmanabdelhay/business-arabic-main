import { Block } from "@blocknote/core";

export interface IdeaClub {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  imageUrl?: string;        
  likes?: number;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IdeasResponse {
  ideas: IdeaClub[];
  categories: string[];
  page: number;
  limit: number;
  total: number;
  message?: string;
}

export type IdeasComponentProps = {
  ideas: IdeaClub[];
  onDelete: (id: string) => Promise<void>;
  selectedId: string;
  isDeleting: boolean;
  isDeleted: boolean;
};

export interface CreateIdeaClubDto {
  name: string;
  description: string;
  content: string | string[];
  category: string;
  imageUrl?: string;
  imageFile?: File;
}

export interface UpdateIdeaClubDto {
  name?: string;
  description?: string;
  content?: string | string[];
  category?: string;
  imageUrl?: string;
  imageFile?: File;
}