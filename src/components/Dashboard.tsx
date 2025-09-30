import { useState, useEffect, useMemo } from 'react';
import { Brain as TrainIcon, AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';
import type { TrainWithDetails, DashboardMetrics } from '../types';
import { mockTrains, mockCertificates, mockJobCards, mockBranding, mockCleaning, mockMileageLogs } from '../lib/mockData';
import { generateAllDecisions } from '../lib/aiEngine';
import MetricsCards from './MetricsCards';
import TrainTable from './TrainTable';
import VisualizationCharts from './VisualizationCharts';
import DecisionJustificationModal from './DecisionJustificationModal';

export default function Dashboard() {
  const [trains, setTrains] = useState<TrainWithDetails[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_trains: 0,
    service_ready: 0,
    maintenance_required: 0,
    standby: 0,
    branding_compliance: 0,
    open_job_cards: 0,
    expired_certificates: 0,
    cleaning_slots_used: 0,
    avg_mileage: 0,
  });
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadTrainData();
  }, []);

  const loadTrainData = () => {
    const trainsWithDetails: TrainWithDetails[] = mockTrains.map(train => ({
      ...train,
      certificates: mockCertificates.filter(c => c.train_id === train.id),
      job_cards: mockJobCards.filter(j => j.train_id === train.id),
      branding: mockBranding.filter(b => b.train_id === train.id),
      cleaning: mockCleaning.filter(c => c.train_id === train.id),
      mileage_logs: mockMileageLogs.filter(m => m.train_id === train.id),
    }));

    setTrains(trainsWithDetails);
    calculateMetrics(trainsWithDetails);
  };

  const calculateMetrics = (trainsData: TrainWithDetails[]) => {
    const totalTrains = trainsData.length;
    const serviceReady = trainsData.filter(t => t.current_status === 'service').length;
    const maintenanceRequired = trainsData.filter(t => t.current_status === 'maintenance').length;
    const standby = trainsData.filter(t => t.current_status === 'standby').length;

    const totalBranding = trainsData.flatMap(t => t.branding).length;
    const completedBranding = trainsData
      .flatMap(t => t.branding)
      .filter(b => b.hours_completed >= b.minimum_hours_required).length;
    const brandingCompliance = totalBranding > 0 ? (completedBranding / totalBranding) * 100 : 100;

    const openJobCards = trainsData.flatMap(t => t.job_cards).filter(j => j.status === 'open').length;
    const expiredCertificates = trainsData
      .flatMap(t => t.certificates)
      .filter(c => c.status === 'expired').length;

    const cleaningScheduled = trainsData.flatMap(t => t.cleaning).filter(c => c.status === 'scheduled').length;
    const cleaningSlotsUsed = (cleaningScheduled / (totalTrains * 3)) * 100;

    const avgMileage =
      trainsData.reduce((sum, t) => sum + t.total_mileage, 0) / totalTrains;

    setMetrics({
      total_trains: totalTrains,
      service_ready: serviceReady,
      maintenance_required: maintenanceRequired,
      standby,
      branding_compliance: brandingCompliance,
      open_job_cards: openJobCards,
      expired_certificates: expiredCertificates,
      cleaning_slots_used: cleaningSlotsUsed,
      avg_mileage: avgMileage,
    });
  };

  const handleGenerateDecisions = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const avgMileage = trains.reduce((sum, t) => sum + t.total_mileage, 0) / trains.length;

      const decisions = generateAllDecisions({
        allTrains: trains.map(t => ({
          train: t,
          certificates: t.certificates,
          jobCards: t.job_cards,
          branding: t.branding,
          cleaning: t.cleaning,
          mileageLogs: t.mileage_logs,
        })),
        date: new Date().toISOString().split('T')[0],
        avgMileage,
      });

      const updatedTrains = trains.map(train => {
        const decision = decisions.find(d => d.train_id === train.id);
        return {
          ...train,
          latest_decision: decision ? { ...decision, id: `dec-${train.id}`, created_at: new Date().toISOString() } : undefined,
        };
      });

      setTrains(updatedTrains);
      setIsGenerating(false);
    }, 1500);
  };

  const selectedTrain = useMemo(() => {
    return trains.find(t => t.id === selectedTrainId);
  }, [selectedTrainId, trains]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                <TrainIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Kochi Metro</h1>
                <p className="text-sm text-slate-600">AI-Driven Train Induction Planning</p>
              </div>
            </div>
            <button
              onClick={handleGenerateDecisions}
              disabled={isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 animate-spin" />
                  Generating Plan...
                </span>
              ) : (
                'Generate Induction Plan'
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-8 space-y-8">
        <MetricsCards metrics={metrics} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <TrainTable trains={trains} onSelectTrain={setSelectedTrainId} />
          </div>
          <div>
            <VisualizationCharts trains={trains} metrics={metrics} />
          </div>
        </div>
      </main>

      {selectedTrainId && selectedTrain && (
        <DecisionJustificationModal
          train={selectedTrain}
          onClose={() => setSelectedTrainId(null)}
        />
      )}
    </div>
  );
}