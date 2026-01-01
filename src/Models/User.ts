export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'owner' | 'tenant' | 'admin';
  created_at?: Date;
}

export interface UserRegistrationDTO {
  name: string;
  email: string;
  password: string;
  role: 'owner' | 'tenant' | 'admin';
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'tenant' | 'admin';
  created_at: Date;
}
