import { useState } from 'react';
import { PlayCircle, Upload, FileText } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import MetroDashboard from './MetroDashboard';
import PlaceholderView from './PlaceholderView';

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MetroDashboard />;
      case 'simulator':
        return (
          <PlaceholderView
            icon={PlayCircle}
            title="Train Simulator"
            description="Simulate train scheduling and induction planning scenarios to optimize operations."
          />
        );
      case 'data-upload':
        return (
          <PlaceholderView
            icon={Upload}
            title="Data Upload"
            description="Upload and manage train data, maintenance records, and operational metrics."
          />
        );
      case 'reports':
        return (
          <PlaceholderView
            icon={FileText}
            title="Reports"
            description="Generate and view comprehensive reports on fleet performance and maintenance."
          />
        );
      default:
        return <MetroDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="container mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}