import { MetroTrain, MaintenanceJob, MileageRecord, MetroDashboardData } from '../types';

export const mockTrains: MetroTrain[] = [
  {
    id: '1',
    train_number: 'T-101',
    health_status: 'fit',
    current_mileage: 45000,
    last_maintenance_date: new Date('2025-09-25').toISOString(),
    branding_compliance: 98,
    cleaning_status: 'clean',
    depot_location: 'A1',
    is_operational: true,
  },
  {
    id: '2',
    train_number: 'T-102',
    health_status: 'fit',
    current_mileage: 42000,
    last_maintenance_date: new Date('2025-09-24').toISOString(),
    branding_compliance: 95,
    cleaning_status: 'clean',
    depot_location: 'A2',
    is_operational: true,
  },
  {
    id: '3',
    train_number: 'T-103',
    health_status: 'issues',
    current_mileage: 48000,
    last_maintenance_date: new Date('2025-09-20').toISOString(),
    branding_compliance: 88,
    cleaning_status: 'scheduled',
    depot_location: 'B1',
    is_operational: false,
  },
  {
    id: '4',
    train_number: 'T-104',
    health_status: 'fit',
    current_mileage: 41000,
    last_maintenance_date: new Date('2025-09-26').toISOString(),
    branding_compliance: 100,
    cleaning_status: 'clean',
    depot_location: 'A3',
    is_operational: true,
  },
  {
    id: '5',
    train_number: 'T-105',
    health_status: 'fit',
    current_mileage: 43500,
    last_maintenance_date: new Date('2025-09-23').toISOString(),
    branding_compliance: 97,
    cleaning_status: 'clean',
    depot_location: 'B2',
    is_operational: true,
  },
  {
    id: '6',
    train_number: 'T-106',
    health_status: 'issues',
    current_mileage: 49000,
    last_maintenance_date: new Date('2025-09-18').toISOString(),
    branding_compliance: 85,
    cleaning_status: 'overdue',
    depot_location: 'C1',
    is_operational: false,
  },
  {
    id: '7',
    train_number: 'T-107',
    health_status: 'fit',
    current_mileage: 40000,
    last_maintenance_date: new Date('2025-09-28').toISOString(),
    branding_compliance: 99,
    cleaning_status: 'clean',
    depot_location: 'A4',
    is_operational: true,
  },
  {
    id: '8',
    train_number: 'T-108',
    health_status: 'fit',
    current_mileage: 44000,
    last_maintenance_date: new Date('2025-09-22').toISOString(),
    branding_compliance: 96,
    cleaning_status: 'scheduled',
    depot_location: 'B3',
    is_operational: true,
  },
];

export const mockMaintenanceJobs: MaintenanceJob[] = [
  {
    id: '1',
    train_id: '3',
    job_type: 'repair',
    status: 'open',
    priority: 'high',
    description: 'Brake system inspection required',
    scheduled_date: new Date('2025-10-02').toISOString(),
  },
  {
    id: '2',
    train_id: '6',
    job_type: 'repair',
    status: 'in_progress',
    priority: 'critical',
    description: 'Door mechanism fault',
    scheduled_date: new Date('2025-10-01').toISOString(),
  },
  {
    id: '3',
    train_id: '1',
    job_type: 'routine',
    status: 'open',
    priority: 'low',
    description: 'Scheduled maintenance',
    scheduled_date: new Date('2025-10-05').toISOString(),
  },
  {
    id: '4',
    train_id: '8',
    job_type: 'inspection',
    status: 'open',
    priority: 'medium',
    description: 'Monthly safety inspection',
    scheduled_date: new Date('2025-10-03').toISOString(),
  },
];

export const mockMileageRecords: MileageRecord[] = (() => {
  const records: MileageRecord[] = [];
  const today = new Date('2025-09-30');

  mockTrains.forEach((train) => {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      records.push({
        id: `${train.id}-${i}`,
        train_id: train.id,
        date: date.toISOString().split('T')[0],
        mileage: train.current_mileage - (i * 150),
      });
    }
  });

  return records;
})();

export function getDashboardData(): MetroDashboardData {
  const fitTrains = mockTrains.filter(t => t.health_status === 'fit').length;
  const issueTrains = mockTrains.filter(t => t.health_status === 'issues').length;
  const openJobs = mockMaintenanceJobs.filter(j => j.status === 'open').length;
  const avgCompliance = Math.round(
    mockTrains.reduce((sum, t) => sum + t.branding_compliance, 0) / mockTrains.length
  );

  const cleaningUtilization = Math.round(
    (mockTrains.filter(t => t.cleaning_status !== 'overdue').length / mockTrains.length) * 100
  );

  return {
    trains: mockTrains,
    maintenance_jobs: mockMaintenanceJobs,
    mileage_records: mockMileageRecords,
    health_summary: {
      fit: fitTrains,
      issues: issueTrains,
    },
    open_jobs: openJobs,
    avg_branding_compliance: avgCompliance,
    cleaning_slots_utilization: cleaningUtilization,
  };
}