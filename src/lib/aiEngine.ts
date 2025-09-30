import type { Train, FitnessCertificate, JobCard, BrandingCommitment, CleaningSchedule, MileageLog, InductionDecision } from '../types';

interface TrainData {
  train: Train;
  certificates: FitnessCertificate[];
  jobCards: JobCard[];
  branding: BrandingCommitment[];
  cleaning: CleaningSchedule[];
  mileageLogs: MileageLog[];
}

interface DecisionContext {
  allTrains: TrainData[];
  date: string;
  avgMileage: number;
}

export function generateInductionDecision(
  trainData: TrainData,
  context: DecisionContext
): Omit<InductionDecision, 'id' | 'created_at'> {
  const { train, certificates, jobCards, branding, cleaning, mileageLogs } = trainData;
  const conflicts: InductionDecision['conflicts'] = [];
  const justification: InductionDecision['justification'] = {
    reasons: [],
    fitness_check: true,
    job_card_check: true,
    branding_check: true,
    mileage_check: true,
    cleaning_check: true,
  };

  const expiredCerts = certificates.filter(cert => cert.status === 'expired');
  if (expiredCerts.length > 0) {
    justification.fitness_check = false;
    conflicts.push({
      type: 'fitness_certificate',
      severity: 'critical',
      message: `${expiredCerts.length} expired certificate(s): ${expiredCerts.map(c => c.department).join(', ')}`,
    });
  }

  const pendingCerts = certificates.filter(cert => cert.status === 'pending');
  if (pendingCerts.length > 0) {
    conflicts.push({
      type: 'fitness_certificate',
      severity: 'warning',
      message: `${pendingCerts.length} certificate(s) expiring soon: ${pendingCerts.map(c => c.department).join(', ')}`,
    });
  }

  const openCriticalJobs = jobCards.filter(j => j.status === 'open' && j.priority === 'critical');
  const openHighJobs = jobCards.filter(j => j.status === 'open' && j.priority === 'high');

  if (openCriticalJobs.length > 0) {
    justification.job_card_check = false;
    conflicts.push({
      type: 'job_card',
      severity: 'critical',
      message: `${openCriticalJobs.length} critical job(s) pending: ${openCriticalJobs.map(j => j.job_number).join(', ')}`,
    });
  }

  if (openHighJobs.length > 0) {
    conflicts.push({
      type: 'job_card',
      severity: 'warning',
      message: `${openHighJobs.length} high priority job(s) pending`,
    });
  }

  const activeBranding = branding.filter(b => b.status === 'active' || b.status === 'overdue');
  activeBranding.forEach(brand => {
    const completion = (brand.hours_completed / brand.minimum_hours_required) * 100;
    if (completion < 50) {
      justification.branding_check = false;
      conflicts.push({
        type: 'branding',
        severity: 'critical',
        message: `${brand.advertiser} campaign only ${completion.toFixed(0)}% complete (${brand.hours_completed}/${brand.minimum_hours_required} hours)`,
      });
    } else if (completion < 80) {
      conflicts.push({
        type: 'branding',
        severity: 'warning',
        message: `${brand.advertiser} campaign ${completion.toFixed(0)}% complete, needs more service hours`,
      });
    }
  });

  const recent30DaysMileage = mileageLogs
    .filter(log => new Date(log.log_date) >= new Date(Date.now() - 30 * 86400000))
    .reduce((sum, log) => sum + log.kilometers, 0);

  const mileageVariance = ((recent30DaysMileage - context.avgMileage) / context.avgMileage) * 100;

  if (mileageVariance > 20) {
    conflicts.push({
      type: 'mileage',
      severity: 'warning',
      message: `Train usage ${mileageVariance.toFixed(0)}% above average, consider rest`,
    });
  } else if (mileageVariance < -20) {
    justification.mileage_check = false;
    conflicts.push({
      type: 'mileage',
      severity: 'info',
      message: `Train usage ${Math.abs(mileageVariance).toFixed(0)}% below average, prioritize for service`,
    });
  }

  const upcomingCleaning = cleaning.filter(
    c => c.status === 'scheduled' && new Date(c.scheduled_date).getTime() <= Date.now() + 86400000
  );

  if (upcomingCleaning.length > 0) {
    conflicts.push({
      type: 'cleaning',
      severity: 'info',
      message: `Cleaning scheduled for ${upcomingCleaning[0].scheduled_date} (${upcomingCleaning[0].slot_time})`,
    });
  }

  let decision: 'service' | 'standby' | 'maintenance' = 'service';
  let confidenceScore = 100;

  if (!justification.fitness_check || !justification.job_card_check) {
    decision = 'maintenance';
    justification.reasons.push('Critical safety issues: expired certificates or open critical jobs');
    confidenceScore = 95;
  } else if (openHighJobs.length > 0) {
    decision = 'maintenance';
    justification.reasons.push('High priority maintenance pending');
    confidenceScore = 85;
  } else if (!justification.branding_check) {
    decision = 'service';
    justification.reasons.push('Critical branding commitment requires immediate service hours');
    confidenceScore = 90;
  } else if (mileageVariance > 20) {
    decision = 'standby';
    justification.reasons.push('Train usage significantly above average, recommended rest period');
    confidenceScore = 75;
  } else if (mileageVariance < -20 && activeBranding.length > 0) {
    decision = 'service';
    justification.reasons.push('Low mileage train with active branding commitments, optimal for service');
    confidenceScore = 90;
  } else if (conflicts.filter(c => c.severity === 'warning').length >= 2) {
    decision = 'standby';
    justification.reasons.push('Multiple moderate concerns, standby recommended for assessment');
    confidenceScore = 70;
  } else {
    decision = 'service';
    justification.reasons.push('All systems nominal, train ready for revenue service');
    confidenceScore = 95;
  }

  if (conflicts.length === 0) {
    justification.reasons.push('No conflicts detected, optimal operational status');
  }

  return {
    train_id: train.id,
    decision_date: context.date,
    decision,
    confidence_score: confidenceScore,
    justification,
    conflicts,
    overridden: false,
  };
}

export function generateAllDecisions(context: DecisionContext): Array<Omit<InductionDecision, 'id' | 'created_at'>> {
  return context.allTrains.map(trainData => generateInductionDecision(trainData, context));
}

export function simulateScenario(
  context: DecisionContext,
  modifications: Array<{ trainId: string; status?: Train['current_status']; removeFromService?: boolean }>
): Array<Omit<InductionDecision, 'id' | 'created_at'>> {
  const modifiedContext = { ...context };
  modifiedContext.allTrains = context.allTrains.map(td => {
    const mod = modifications.find(m => m.trainId === td.train.id);
    if (mod) {
      return {
        ...td,
        train: {
          ...td.train,
          current_status: mod.status || td.train.current_status,
        },
      };
    }
    return td;
  });

  if (modifications.some(m => m.removeFromService)) {
    modifiedContext.allTrains = modifiedContext.allTrains.filter(
      td => !modifications.find(m => m.trainId === td.train.id && m.removeFromService)
    );
  }

  return generateAllDecisions(modifiedContext);
}