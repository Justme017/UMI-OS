import React from 'react';
import { 
  LayoutGrid, 
  Settings, 
  User, 
  CreditCard, 
  Smartphone, 
  Lock, 
  Bell, 
  HelpCircle, 
  Mail, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isDarkMode, toggleTheme }) => {
  const navClass = (view: View) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
    ${currentView === view 
      ? 'bg-primary/10 text-primary font-medium shadow-sm' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'}
  `;

  return (
    <aside className="w-full md:w-72 border-r border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0A0E17]/80 backdrop-blur-3xl flex flex-col h-full shrink-0 transition-all duration-500 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => onChangeView('workspace')}>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <LayoutGrid size={20} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-800 dark:text-white">
            UMI <span className="text-slate-400 font-normal">OS</span>
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-6">Menu</div>
          
          <button onClick={() => onChangeView('workspace')} className={navClass('workspace')}>
            <LayoutGrid size={20} />
            <span className="text-sm">Workspace</span>
          </button>
          
          <button onClick={() => onChangeView('settings')} className={navClass('settings')}>
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </button>
        </div>

        {currentView === 'settings' && (
           <div className="space-y-1 mt-6 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Preferences</div>
             {[
               { icon: User, label: 'User Information' },
               { icon: CreditCard, label: 'Plan Details' },
               { icon: Smartphone, label: 'Connected Devices' },
               { icon: Lock, label: 'Privacy & Data' },
               { icon: Bell, label: 'Notifications' },
             ].map((item, idx) => (
               <button key={idx} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                 <item.icon size={18} />
                 <span className="text-sm">{item.label}</span>
               </button>
             ))}
           </div>
        )}
      </div>

      <div className="mt-auto p-6 border-t border-slate-200 dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform"
            >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className="text-xs text-slate-400 font-mono">v2.4.0</span>
        </div>
        <button className="w-full flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors py-2 px-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};