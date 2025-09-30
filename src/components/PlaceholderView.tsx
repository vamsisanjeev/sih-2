import { Video as LucideIcon } from 'lucide-react';

interface PlaceholderViewProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function PlaceholderView({ icon: Icon, title, description }: PlaceholderViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6">
        <Icon size={48} className="text-slate-400 dark:text-slate-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md">
        {description}
      </p>
    </div>
  );
}