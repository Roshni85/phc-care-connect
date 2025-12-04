import { UserRole } from './auth';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  phc_id: string;
  sub_centres?: string[];
  villages?: string[];
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface PHCInfo {
  id: string;
  name: string;
  district: string;
  state: string;
  sub_centres: SubCentreInfo[];
}

export interface SubCentreInfo {
  id: string;
  name: string;
  villages: VillageInfo[];
}

export interface VillageInfo {
  id: string;
  name: string;
  population: number;
}

export interface ProgrammeModule {
  id: string;
  name: string;
  description: string;
  is_enabled: boolean;
}
