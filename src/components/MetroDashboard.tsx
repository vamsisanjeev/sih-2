import { Activity, Wrench, Award, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import MetricCard from './MetricCard';
import { getDashboardData } from '../lib/metroData';
import { useEffect, useState } from 'react';

export default function MetroDashboard() {
  const [data, setData] = useState(getDashboardData());

  useEffect(() => {
    setData(getDashboardData());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Supervisor Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Real-time train fleet monitoring and metrics
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated</p>
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Train Health" delay={0}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <Activity size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {data.health_summary.fit}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fit for Service</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                  <Activity size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {data.health_summary.issues}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Maintenance Required</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Fleet Availability</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {Math.round((data.health_summary.fit / data.trains.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(data.health_summary.fit / data.trains.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </MetricCard>

        <MetricCard title="Open Maintenance Jobs" delay={100}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                <Wrench size={32} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-800 dark:text-white">
                  {data.open_jobs}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Jobs</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {data.maintenance_jobs.filter(j => j.status === 'open').map((job, idx) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        job.priority === 'critical' ? 'bg-red-500' :
                        job.priority === 'high' ? 'bg-orange-500' :
                        job.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {data.trains.find(t => t.id === job.train_id)?.train_number}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full font-medium">
                    {job.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </MetricCard>

        <MetricCard title="Branding Compliance" delay={200}>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - data.avg_branding_compliance / 100)}`}
                  className="text-[#0078BE] transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Award size={32} className="text-[#0078BE] mb-2" />
                <p className="text-3xl font-bold text-slate-800 dark:text-white">
                  {data.avg_branding_compliance}%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Average fleet compliance rate
            </p>
          </div>
        </MetricCard>

        <MetricCard title="Mileage Balance" delay={300}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {Math.round(data.trains.reduce((sum, t) => sum + t.current_mileage, 0) / data.trains.length).toLocaleString()}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Avg. KM per train</p>
              </div>
            </div>
            <div className="h-32 flex items-end justify-between gap-1">
              {data.trains.map((train, idx) => {
                const maxMileage = Math.max(...data.trains.map(t => t.current_mileage));
                const height = (train.current_mileage / maxMileage) * 100;
                return (
                  <div
                    key={train.id}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-1000 ease-out hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                    style={{ height: `${height}%`, animationDelay: `${idx * 50}ms` }}
                    title={`${train.train_number}: ${train.current_mileage.toLocaleString()} km`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Mileage Variance</span>
              <span className="font-semibold text-green-600 dark:text-green-400">Balanced</span>
            </div>
          </div>
        </MetricCard>

        <MetricCard title="Cleaning Slots" delay={400}>
          <div className="flex flex-col items-center py-4">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - data.cleaning_slots_utilization / 100)}`}
                  className="text-[#4CAF50] transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Sparkles size={28} className="text-[#4CAF50] mb-1" />
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {data.cleaning_slots_utilization}%
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 text-center">
              Slot Utilization Rate
            </p>
            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Clean</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {data.trains.filter(t => t.cleaning_status === 'clean').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Scheduled</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {data.trains.filter(t => t.cleaning_status === 'scheduled').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Overdue</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {data.trains.filter(t => t.cleaning_status === 'overdue').length}
                </span>
              </div>
            </div>
          </div>
        </MetricCard>

        <MetricCard title="Depot Layout" delay={500}>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {data.trains.map((train) => (
                <div
                  key={train.id}
                  className={`
                    relative p-2 rounded-lg text-center cursor-pointer
                    transition-all duration-200 hover:scale-105
                    ${train.health_status === 'fit'
                      ? 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800'
                      : 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800'
                    }
                  `}
                  title={`${train.train_number} - ${train.depot_location}`}
                >
                  <MapPin
                    size={16}
                    className={`mx-auto ${
                      train.health_status === 'fit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  />
                  <p className={`text-xs font-medium mt-1 ${
                    train.health_status === 'fit'
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {train.train_number}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {train.depot_location}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Maintenance</span>
              </div>
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
}