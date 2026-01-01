export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'Owner' | 'Tenant' | 'Admin';
  created_at?: Date;
}

export interface UserRegistrationDTO {
  name: string;
  email: string;
  password: string;
  role: 'Owner' | 'Tenant' | 'Admin';
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Tenant' | 'Admin';
  created_at: Date;
}
