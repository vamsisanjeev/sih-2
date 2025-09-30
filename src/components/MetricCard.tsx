import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

export default function MetricCard({ title, children, delay = 0 }: MetricCardProps) {
  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 animate-slideIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
        {title}
      </h3>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}