import { User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-30 transition-colors duration-300">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0078BE] to-[#4CAF50] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Kochi Metro Rail
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Train Induction Planning Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-slate-700 dark:text-slate-200" />
            ) : (
              <Sun size={20} className="text-slate-200" />
            )}
          </button>

          <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <div className="w-8 h-8 bg-[#0078BE] rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                Supervisor
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}