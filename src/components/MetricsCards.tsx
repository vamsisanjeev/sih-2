import { Brain as Train, AlertTriangle, CheckCircle, Clock, Wrench, Package, MapPin } from 'lucide-react';
import type { DashboardMetrics } from '../types';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Trains',
      value: metrics.total_trains,
      icon: Train,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Service Ready',
      value: metrics.service_ready,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Maintenance',
      value: metrics.maintenance_required,
      icon: Wrench,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      title: 'Standby',
      value: metrics.standby,
      icon: Clock,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700',
    },
    {
      title: 'Branding Compliance',
      value: `${metrics.branding_compliance.toFixed(0)}%`,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Open Job Cards',
      value: metrics.open_job_cards,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: 'Expired Certificates',
      value: metrics.expired_certificates,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: 'Avg Mileage',
      value: `${(metrics.avg_mileage / 1000).toFixed(1)}k km`,
      icon: MapPin,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          style={{
            animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-2">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}