import { useState, useMemo } from 'react';
import { Play, RotateCcw, AlertTriangle, TrendingUp, Wrench } from 'lucide-react';
import type { TrainWithDetails } from '../types';
import { simulateScenario } from '../lib/aiEngine';

interface SimulatorProps {
  trains: TrainWithDetails[];
}

export default function Simulator({ trains }: SimulatorProps) {
  const [modifications, setModifications] = useState<Array<{ trainId: string; status?: any; removeFromService?: boolean }>>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const avgMileage = useMemo(() => {
    return trains.reduce((sum, t) => sum + t.total_mileage, 0) / trains.length;
  }, [trains]);

  const handleAddModification = (trainId: string) => {
    const existing = modifications.find(m => m.trainId === trainId);
    if (existing) {
      setModifications(modifications.filter(m => m.trainId !== trainId));
    } else {
      setModifications([...modifications, { trainId, status: 'maintenance' }]);
    }
  };

  const handleRunSimulation = () => {
    const decisions = simulateScenario(
      {
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
      },
      modifications
    );

    const serviceCount = decisions.filter(d => d.decision === 'service').length;
    const maintenanceCount = decisions.filter(d => d.decision === 'maintenance').length;
    const standbyCount = decisions.filter(d => d.decision === 'standby').length;

    setSimulationResult({
      decisions,
      summary: {
        total: decisions.length,
        service: serviceCount,
        maintenance: maintenanceCount,
        standby: standbyCount,
        availabilityRate: (serviceCount / decisions.length) * 100,
      },
    });
  };

  const handleReset = () => {
    setModifications([]);
    setSimulationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">What-If Simulator</h1>
          <p className="text-slate-600">Test different scenarios and see how they impact train availability</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Scenario Setup</h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
              {trains.slice(0, 15).map((train) => {
                const isModified = modifications.find(m => m.trainId === train.id);
                return (
                  <div
                    key={train.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isModified
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                    onClick={() => handleAddModification(train.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{train.train_number}</div>
                        <div className="text-sm text-slate-500">Current: {train.current_status}</div>
                      </div>
                      {isModified && (
                        <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                          Under Repair
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleRunSimulation}
                disabled={modifications.length === 0}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Run Simulation
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Simulation Results</h2>

            {!simulationResult ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
                    <AlertTriangle className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">No simulation run yet</p>
                  <p className="text-sm text-slate-400 mt-1">Select trains and run a simulation</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-sm text-green-700 mb-1">Service Ready</div>
                    <div className="text-3xl font-bold text-green-800">{simulationResult.summary.service}</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-sm text-orange-700 mb-1">Maintenance</div>
                    <div className="text-3xl font-bold text-orange-800">{simulationResult.summary.maintenance}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-sm text-slate-700 mb-1">Standby</div>
                    <div className="text-3xl font-bold text-slate-800">{simulationResult.summary.standby}</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-700 mb-1">Availability</div>
                    <div className="text-3xl font-bold text-blue-800">
                      {simulationResult.summary.availabilityRate.toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Impact Analysis
                  </h3>

                  <div className="space-y-3">
                    {modifications.length > 0 && (
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-start gap-3">
                          <Wrench className="w-5 h-5 text-orange-600 mt-0.5" />
                          <div>
                            <div className="font-semibold text-orange-900 mb-1">
                              {modifications.length} train(s) under maintenance
                            </div>
                            <div className="text-sm text-orange-700">
                              Service availability reduced by {((modifications.length / trains.length) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {simulationResult.summary.availabilityRate < 70 && (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <div className="font-semibold text-red-900 mb-1">Critical Alert</div>
                            <div className="text-sm text-red-700">
                              Train availability below 70%. Service disruption likely.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {simulationResult.summary.availabilityRate >= 80 && (
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-semibold text-green-900 mb-1">Good Scenario</div>
                            <div className="text-sm text-green-700">
                              Sufficient train availability for normal operations.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}