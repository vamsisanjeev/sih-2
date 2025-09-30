export interface Train {
  id: string;
  train_number: string;
  depot_location: string;
  total_mileage: number;
  current_status: 'service' | 'standby' | 'maintenance';
  stabling_position?: string;
  created_at: string;
  updated_at: string;
}

export interface FitnessCertificate {
  id: string;
  train_id: string;
  department: string;
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  status: 'valid' | 'expired' | 'pending';
  created_at: string;
}

export interface JobCard {
  id: string;
  train_id: string;
  job_number: string;
  job_type: 'preventive' | 'corrective' | 'inspection';
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'closed';
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
}

export interface BrandingCommitment {
  id: string;
  train_id: string;
  advertiser: string;
  campaign_name: string;
  contract_start: string;
  contract_end: string;
  minimum_hours_required: number;
  hours_completed: number;
  status: 'active' | 'completed' | 'overdue';
  created_at: string;
}

export interface CleaningSchedule {
  id: string;
  train_id: string;
  scheduled_date: string;
  slot_time: 'morning' | 'afternoon' | 'evening';
  cleaning_type: 'light' | 'deep' | 'exterior';
  duration_minutes: number;
  manpower_required: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  completed_at?: string;
  created_at: string;
}

export interface InductionDecision {
  id: string;
  train_id: string;
  decision_date: string;
  decision: 'service' | 'standby' | 'maintenance';
  confidence_score: number;
  justification: {
    reasons: string[];
    fitness_check: boolean;
    job_card_check: boolean;
    branding_check: boolean;
    mileage_check: boolean;
    cleaning_check: boolean;
  };
  conflicts: Array<{
    type: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
  }>;
  overridden: boolean;
  override_reason?: string;
  approved_by?: string;
  created_at: string;
}

export interface MileageLog {
  id: string;
  train_id: string;
  log_date: string;
  kilometers: number;
  route?: string;
  created_at: string;
}

export interface DepotLayout {
  id: string;
  position_id: string;
  depot_name: string;
  track_number: number;
  can_be_blocked: boolean;
  blocks_positions: string[];
  maintenance_pit: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'supervisor' | 'maintenance_manager' | 'branding_manager';
  department?: string;
  created_at: string;
}

export interface TrainWithDetails extends Train {
  certificates: FitnessCertificate[];
  job_cards: JobCard[];
  branding: BrandingCommitment[];
  cleaning: CleaningSchedule[];
  latest_decision?: InductionDecision;
  mileage_logs: MileageLog[];
}

export interface DashboardMetrics {
  total_trains: number;
  service_ready: number;
  maintenance_required: number;
  standby: number;
  branding_compliance: number;
  open_job_cards: number;
  expired_certificates: number;
  cleaning_slots_used: number;
  avg_mileage: number;
}

export interface MetroTrain {
  id: string;
  train_number: string;
  health_status: 'fit' | 'issues';
  current_mileage: number;
  last_maintenance_date: string;
  branding_compliance: number;
  cleaning_status: 'clean' | 'scheduled' | 'overdue';
  depot_location: string;
  is_operational: boolean;
}

export interface MaintenanceJob {
  id: string;
  train_id: string;
  job_type: 'routine' | 'repair' | 'inspection';
  status: 'open' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  scheduled_date: string;
}

export interface MileageRecord {
  id: string;
  train_id: string;
  date: string;
  mileage: number;
}

export interface MetroDashboardData {
  trains: MetroTrain[];
  maintenance_jobs: MaintenanceJob[];
  mileage_records: MileageRecord[];
  health_summary: {
    fit: number;
    issues: number;
  };
  open_jobs: number;
  avg_branding_compliance: number;
  cleaning_slots_utilization: number;
}