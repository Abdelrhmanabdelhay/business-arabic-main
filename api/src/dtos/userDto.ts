export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role?: "user" | "admin";
}

export interface UpdateUserDto {
  email?: string;
  fullName?: string;
  role?: "user" | "admin";
}

export interface UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: Date;
}

export interface UserListResponseDto {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}
