export type SurveyStatus = 'new' | 'in_review' | 'verified' | 'sent_back';

export type ProgrammeType = 'ANC' | 'NCD' | 'TB' | 'Immunization' | 'RMNCH' | 'General';

export interface SurveyBatch {
  id: string;
  batch_id: string;
  anm_name: string;
  anm_id: string;
  village: string;
  sub_centre: string;
  programme: ProgrammeType;
  status: SurveyStatus;
  total_households: number;
  submitted_at: string;
  indicators: {
    anc_4_plus: number;
    immunization_complete: number;
    high_bp_count: number;
    referrals: number;
  };
}

export interface HouseholdSurvey {
  id: string;
  household_id: string;
  head_name: string;
  members_count: number;
  anc_registered?: boolean;
  immunization_status?: string;
  bp_reading?: string;
  has_issues: boolean;
  issues?: string[];
}

export interface SubCentre {
  id: string;
  name: string;
  anm_name: string;
  anm_id: string;
  last_lhv_visit?: string;
  performance_score: number;
  gaps: string[];
  villages: string[];
}

export interface VisitNote {
  id: string;
  sub_centre_id: string;
  date: string;
  notes: string;
  issues_found: string[];
}
