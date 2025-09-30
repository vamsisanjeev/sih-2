import { useState, useEffect } from 'react';
import { LayoutDashboard, Gauge, Upload, Moon, Sun, Brain as TrainIcon } from 'lucide-react';
import Dashboard from './Dashboard';
import Simulator from './Simulator';
import { mockTrains, mockCertificates, mockJobCards, mockBranding, mockCleaning, mockMileageLogs } from '../lib/mockData';
import type { TrainWithDetails } from '../types';

type View = 'dashboard' | 'simulator';

export default function Layout() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [trains, setTrains] = useState<TrainWithDetails[]>([]);

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
  };

  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator' as View, label: 'Simulator', icon: Gauge },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-[1800px] mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                    <TrainIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold text-slate-900">KMRL</div>
                </div>

                <div className="flex items-center gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-slate-600" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </nav>

        <main>
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'simulator' && <Simulator trains={trains} />}
        </main>
      </div>
    </div>
  );
}