export interface Booking {
  id?: number;
  property_id: number;
  tenant_id: number;
  check_in: Date;
  check_out: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  request_time?: Date;
}

export interface BookingCreateDTO {
  property_id: number;
  tenant_id: number;
  check_in: string | Date;
  check_out: string | Date;
}

export interface BookingUpdateStatusDTO {
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface BookingResponseDTO {
  id: number;
  property_id: number;
  tenant_id: number;
  check_in: Date;
  check_out: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  request_time: Date;
  property_title?: string;
  property_location?: string;
  property_rent_per_day?: number;
  tenant_name?: string;
  tenant_email?: string;
  owner_id?: number;
}
