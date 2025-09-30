import {
  LayoutDashboard,
  PlayCircle,
  Upload,
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Simulator', icon: PlayCircle },
    { id: 'data-upload', label: 'Data Upload', icon: Upload },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const handleTabClick = (id: string) => {
    onTabChange(id);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0078BE] text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-slate-900 text-white w-64
          flex flex-col shadow-2xl z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0078BE] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">K</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Kochi Metro</h1>
              <p className="text-xs text-slate-400">Train Planning</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 text-left
                  ${isActive
                    ? 'bg-[#0078BE] text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
          <p>Supervisor Dashboard v2.0</p>
        </div>
      </aside>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}