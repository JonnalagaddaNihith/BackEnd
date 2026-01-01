export interface AdminAnalytics {
  totalUsers: number;
  totalTenants: number;
  totalOwners: number;
  totalProperties: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  recentUsers: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: Date;
  }>;
  topOwners: Array<{
    id: number;
    name: string;
    email: string;
    propertyCount: number;
  }>;
  topTenants: Array<{
    id: number;
    name: string;
    email: string;
    bookingCount: number;
  }>;
}