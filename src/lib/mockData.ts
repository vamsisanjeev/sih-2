import type { Train, FitnessCertificate, JobCard, BrandingCommitment, CleaningSchedule, MileageLog, DepotLayout } from '../types';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const mockTrains: Train[] = Array.from({ length: 25 }, (_, i) => ({
  id: `train-${i + 1}`,
  train_number: `Train ${String(i + 1).padStart(2, '0')}`,
  depot_location: i < 20 ? 'Muttom Depot' : 'Aluva Depot',
  total_mileage: Math.floor(Math.random() * 50000) + 10000,
  current_status: ['service', 'standby', 'maintenance'][Math.floor(Math.random() * 3)] as any,
  stabling_position: `A${Math.floor(i / 5) + 1}-${(i % 5) + 1}`,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: new Date().toISOString(),
}));

export const mockCertificates: FitnessCertificate[] = mockTrains.flatMap(train => {
  const departments = ['Electrical', 'Mechanical', 'Signaling', 'Safety'];
  return departments.map((dept, idx) => {
    const daysUntilExpiry = Math.floor(Math.random() * 180) - 30;
    const expiryDate = new Date(Date.now() + daysUntilExpiry * 86400000);
    return {
      id: `cert-${train.id}-${idx}`,
      train_id: train.id,
      department: dept,
      certificate_number: `CERT-${train.train_number.replace(' ', '')}-${dept.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9999)}`,
      issue_date: new Date(expiryDate.getTime() - 180 * 86400000).toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      status: (daysUntilExpiry < 0 ? 'expired' : daysUntilExpiry < 7 ? 'pending' : 'valid') as any,
      created_at: new Date().toISOString(),
    };
  });
});

export const mockJobCards: JobCard[] = mockTrains.flatMap(train => {
  const numJobs = Math.floor(Math.random() * 4);
  return Array.from({ length: numJobs }, (_, idx) => {
    const jobTypes: Array<'preventive' | 'corrective' | 'inspection'> = ['preventive', 'corrective', 'inspection'];
    const priorities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
    const statuses: Array<'open' | 'in_progress' | 'closed'> = ['open', 'in_progress', 'closed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: `job-${train.id}-${idx}`,
      train_id: train.id,
      job_number: `JOB-${train.train_number.replace(' ', '')}-${String(idx + 1).padStart(3, '0')}`,
      job_type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      description: `Routine maintenance check for ${train.train_number}`,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      assigned_to: status !== 'open' ? `Tech-${Math.floor(Math.random() * 10) + 1}` : undefined,
      due_date: new Date(Date.now() + Math.random() * 30 * 86400000).toISOString().split('T')[0],
      completed_at: status === 'closed' ? new Date(Date.now() - Math.random() * 7 * 86400000).toISOString() : undefined,
      created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    };
  });
});

export const mockBranding: BrandingCommitment[] = mockTrains.slice(0, 15).map((train, idx) => {
  const advertisers = ['Coca-Cola', 'Samsung', 'Airtel', 'Amazon', 'Flipkart'];
  const minHours = Math.floor(Math.random() * 500) + 200;
  const hoursCompleted = Math.floor(Math.random() * minHours * 1.2);

  return {
    id: `branding-${train.id}`,
    train_id: train.id,
    advertiser: advertisers[idx % advertisers.length],
    campaign_name: `Campaign ${idx + 1} - Brand Awareness`,
    contract_start: new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0],
    contract_end: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    minimum_hours_required: minHours,
    hours_completed: hoursCompleted,
    status: (hoursCompleted >= minHours ? 'completed' : hoursCompleted < minHours * 0.5 ? 'overdue' : 'active') as any,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  };
});

export const mockCleaning: CleaningSchedule[] = mockTrains.map((train, idx) => {
  const slots: Array<'morning' | 'afternoon' | 'evening'> = ['morning', 'afternoon', 'evening'];
  const types: Array<'light' | 'deep' | 'exterior'> = ['light', 'deep', 'exterior'];

  return {
    id: `cleaning-${train.id}`,
    train_id: train.id,
    scheduled_date: new Date(Date.now() + (idx % 3) * 86400000).toISOString().split('T')[0],
    slot_time: slots[idx % slots.length],
    cleaning_type: types[idx % types.length],
    duration_minutes: types[idx % types.length] === 'deep' ? 120 : 60,
    manpower_required: types[idx % types.length] === 'deep' ? 4 : 2,
    status: idx % 3 === 0 ? 'completed' : 'scheduled',
    completed_at: idx % 3 === 0 ? yesterday : undefined,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  };
});

export const mockMileageLogs: MileageLog[] = mockTrains.flatMap(train => {
  return Array.from({ length: 30 }, (_, dayIdx) => ({
    id: `mileage-${train.id}-${dayIdx}`,
    train_id: train.id,
    log_date: new Date(Date.now() - (30 - dayIdx) * 86400000).toISOString().split('T')[0],
    kilometers: train.current_status === 'service' ? Math.floor(Math.random() * 100) + 50 : 0,
    route: train.current_status === 'service' ? 'Aluva-Pettah' : undefined,
    created_at: new Date(Date.now() - (30 - dayIdx) * 86400000).toISOString(),
  }));
});

export const mockDepotLayout: DepotLayout[] = [
  { id: 'pos-1', position_id: 'A1-1', depot_name: 'Muttom Depot', track_number: 1, can_be_blocked: true, blocks_positions: ['A1-2'], maintenance_pit: false, created_at: today },
  { id: 'pos-2', position_id: 'A1-2', depot_name: 'Muttom Depot', track_number: 1, can_be_blocked: true, blocks_positions: ['A1-3'], maintenance_pit: false, created_at: today },
  { id: 'pos-3', position_id: 'A1-3', depot_name: 'Muttom Depot', track_number: 1, can_be_blocked: true, blocks_positions: [], maintenance_pit: true, created_at: today },
  { id: 'pos-4', position_id: 'A2-1', depot_name: 'Muttom Depot', track_number: 2, can_be_blocked: true, blocks_positions: ['A2-2'], maintenance_pit: false, created_at: today },
  { id: 'pos-5', position_id: 'A2-2', depot_name: 'Muttom Depot', track_number: 2, can_be_blocked: true, blocks_positions: ['A2-3'], maintenance_pit: false, created_at: today },
  { id: 'pos-6', position_id: 'A2-3', depot_name: 'Muttom Depot', track_number: 2, can_be_blocked: false, blocks_positions: [], maintenance_pit: false, created_at: today },
  { id: 'pos-7', position_id: 'B1-1', depot_name: 'Aluva Depot', track_number: 1, can_be_blocked: true, blocks_positions: ['B1-2'], maintenance_pit: false, created_at: today },
  { id: 'pos-8', position_id: 'B1-2', depot_name: 'Aluva Depot', track_number: 1, can_be_blocked: true, blocks_positions: [], maintenance_pit: true, created_at: today },
];