export interface Property {
  id?: number;
  owner_id: number;
  title: string;
  property_description?: string;
  rent_per_day: number;
  location: string;
  amenities?: string;
  photo1?: Buffer | string | null;
  photo2?: Buffer | string | null;
  photo3?: Buffer | string | null;
  photo4?: Buffer | string | null;
  created_at?: Date;
}

export interface PropertyCreateDTO {
  owner_id: number;
  title: string;
  property_description?: string;
  rent_per_day: number;
  location: string;
  amenities?: string;
  photo1?: string | null;  
  photo2?: string | null;  
  photo3?: string | null;  
  photo4?: string | null;  
}

export interface PropertyUpdateDTO {
  title?: string;
  property_description?: string;
  rent_per_day?: number;
  location?: string;
  amenities?: string;
  photo1?: string | null;  
  photo2?: string | null;  
  photo3?: string | null;  
  photo4?: string | null;  
}

export interface PropertyResponseDTO {
  id: number;
  owner_id: number;
  title: string;
  property_description?: string;
  rent_per_day: number;
  location: string;
  amenities?: string;
  photo1?: string | null;  
  photo2?: string | null;  
  photo3?: string | null;  
  photo4?: string | null;  
  created_at: Date;
}

export interface PropertyFilterDTO {
  location?: string;
  min_rent?: number;
  max_rent?: number;
  amenities?: string;
}
