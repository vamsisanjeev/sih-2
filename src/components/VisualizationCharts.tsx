import { useMemo } from 'react';
import { TrendingUp, Package, Wrench, BarChart3 } from 'lucide-react';
import type { TrainWithDetails, DashboardMetrics } from '../types';

interface VisualizationChartsProps {
  trains: TrainWithDetails[];
  metrics: DashboardMetrics;
}

export default function VisualizationCharts({ trains, metrics }: VisualizationChartsProps) {
  const mileageDistribution = useMemo(() => {
    return trains.map(t => ({
      name: t.train_number,
      value: t.total_mileage,
    })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [trains]);

  const statusDistribution = useMemo(() => {
    return [
      { name: 'Service', value: metrics.service_ready, color: 'bg-green-500' },
      { name: 'Maintenance', value: metrics.maintenance_required, color: 'bg-orange-500' },
      { name: 'Standby', value: metrics.standby, color: 'bg-slate-500' },
    ];
  }, [metrics]);

  const maxMileage = Math.max(...mileageDistribution.map(d => d.value));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Status Distribution</h3>
        </div>

        <div className="space-y-4">
          {statusDistribution.map((status, index) => {
            const percentage = (status.value / metrics.total_trains) * 100;
            return (
              <div key={status.name} style={{ animation: `slideIn 0.5s ease-out ${index * 0.1}s both` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{status.name}</span>
                  <span className="text-sm font-semibold text-slate-900">{status.value}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${status.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{metrics.service_ready}</div>
              <div className="text-xs text-green-600 mt-1">Ready for Service</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">{metrics.maintenance_required}</div>
              <div className="text-xs text-orange-600 mt-1">Need Attention</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-teal-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Top 10 Mileage</h3>
        </div>

        <div className="space-y-3">
          {mileageDistribution.map((train, index) => {
            const percentage = (train.value / maxMileage) * 100;
            return (
              <div key={train.name} style={{ animation: `slideIn 0.5s ease-out ${index * 0.05}s both` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-600">{train.name}</span>
                  <span className="text-xs font-semibold text-slate-900">{(train.value / 1000).toFixed(1)}k km</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Branding Compliance</h3>
        </div>

        <div className="relative">
          <svg className="w-full" viewBox="0 0 200 120">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="20"
              strokeDasharray="251.2"
              transform="rotate(-90 100 100)"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={metrics.branding_compliance >= 80 ? '#10b981' : metrics.branding_compliance >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="20"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * metrics.branding_compliance) / 100}
              transform="rotate(-90 100 100)"
              className="transition-all duration-1000 ease-out"
              style={{ strokeLinecap: 'round' }}
            />
            <text x="100" y="95" textAnchor="middle" className="text-3xl font-bold fill-slate-900">
              {metrics.branding_compliance.toFixed(0)}%
            </text>
            <text x="100" y="115" textAnchor="middle" className="text-xs fill-slate-600">
              Compliance Rate
            </text>
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Wrench className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Maintenance Overview</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div>
              <div className="text-sm font-medium text-red-900">Expired Certificates</div>
              <div className="text-xs text-red-600 mt-1">Requires immediate action</div>
            </div>
            <div className="text-2xl font-bold text-red-700">{metrics.expired_certificates}</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div>
              <div className="text-sm font-medium text-orange-900">Open Job Cards</div>
              <div className="text-xs text-orange-600 mt-1">Pending maintenance tasks</div>
            </div>
            <div className="text-2xl font-bold text-orange-700">{metrics.open_job_cards}</div>
          </div>
        </div>
      </div>
    </div>
  );
}