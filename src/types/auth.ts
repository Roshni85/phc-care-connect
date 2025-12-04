export type UserRole = 'LHV' | 'ANM' | 'ASHA_SUPERVISOR' | 'LAB_TECH' | 'PHARMACIST' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  phc_id: string;
  phc_name: string;
  sub_centres?: string[];
  villages?: string[];
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface LoginResponse {
  auth_token: string;
  role: UserRole;
  profile: UserProfile;
}
