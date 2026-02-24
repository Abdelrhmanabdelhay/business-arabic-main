export interface SignUpDto {
  email: string;
  password: string;
  fullName: string;
  role?: 'user' | 'admin';
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  token: string;
}