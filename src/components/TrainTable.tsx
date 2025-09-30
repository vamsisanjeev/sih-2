import { useState, useMemo } from 'react';
import { Search, ChevronDown, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';
import type { TrainWithDetails } from '../types';

interface TrainTableProps {
  trains: TrainWithDetails[];
  onSelectTrain: (trainId: string) => void;
}

export default function TrainTable({ trains, onSelectTrain }: TrainTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'train_number' | 'mileage' | 'status'>('train_number');

  const filteredTrains = useMemo(() => {
    let filtered = trains.filter(train => {
      const matchesSearch = train.train_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || train.current_status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'train_number') {
        return a.train_number.localeCompare(b.train_number);
      } else if (sortBy === 'mileage') {
        return b.total_mileage - a.total_mileage;
      } else {
        return a.current_status.localeCompare(b.current_status);
      }
    });

    return filtered;
  }, [trains, searchTerm, statusFilter, sortBy]);

  const getStatusBadge = (status: string) => {
    const configs = {
      service: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      maintenance: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle },
      standby: { bg: 'bg-slate-100', text: 'text-slate-800', icon: Clock },
    };
    const config = configs[status as keyof typeof configs] || configs.standby;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getHealthStatus = (train: TrainWithDetails) => {
    const expiredCerts = train.certificates.filter(c => c.status === 'expired').length;
    const openCritical = train.job_cards.filter(j => j.status === 'open' && j.priority === 'critical').length;

    if (expiredCerts > 0 || openCritical > 0) {
      return { status: 'critical', icon: AlertCircle, color: 'text-red-600' };
    }

    const pendingCerts = train.certificates.filter(c => c.status === 'pending').length;
    const openHigh = train.job_cards.filter(j => j.status === 'open' && j.priority === 'high').length;

    if (pendingCerts > 0 || openHigh > 0) {
      return { status: 'warning', icon: AlertCircle, color: 'text-orange-600' };
    }

    return { status: 'healthy', icon: CheckCircle, color: 'text-green-600' };
  };

  const getBrandingProgress = (train: TrainWithDetails) => {
    if (train.branding.length === 0) return null;
    const brand = train.branding[0];
    const progress = (brand.hours_completed / brand.minimum_hours_required) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Train Inventory</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search trains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="service">Service</option>
              <option value="maintenance">Maintenance</option>
              <option value="standby">Standby</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="train_number">Train Number</option>
              <option value="mileage">Mileage</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Train</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Health</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Mileage</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Branding</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Jobs</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Decision</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTrains.map((train, index) => {
              const health = getHealthStatus(train);
              const brandingProgress = getBrandingProgress(train);
              const HealthIcon = health.icon;

              return (
                <tr
                  key={train.id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{train.train_number}</div>
                    <div className="text-sm text-slate-500">{train.depot_location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <HealthIcon className={`w-5 h-5 ${health.color}`} />
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(train.current_status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{train.total_mileage.toLocaleString()} km</div>
                  </td>
                  <td className="px-6 py-4">
                    {brandingProgress !== null ? (
                      <div className="w-24">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-600">{brandingProgress.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              brandingProgress >= 80 ? 'bg-green-500' : brandingProgress >= 50 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${brandingProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      train.job_cards.filter(j => j.status === 'open').length > 0 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {train.job_cards.filter(j => j.status === 'open').length} open
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {train.latest_decision ? (
                      <div className="flex items-center gap-2">
                        {getStatusBadge(train.latest_decision.decision)}
                        <span className="text-xs text-slate-500">
                          {train.latest_decision.confidence_score.toFixed(0)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onSelectTrain(train.id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTrains.length === 0 && (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Info className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No trains found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}