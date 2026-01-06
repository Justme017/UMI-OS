import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Settings, 
  User, 
  CreditCard, 
  Smartphone, 
  Lock, 
  Bell, 
  LogOut,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  Menu
} from 'lucide-react';
import { View } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  isDarkMode, 
  toggleTheme,
  isCollapsed,
  toggleSidebar
}) => {
  const [activeSection, setActiveSection] = useState('User Information');

  const navClass = (view: View) => `
    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-1
    ${currentView === view 
      ? 'bg-primary/10 text-primary font-medium shadow-sm' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'}
    ${isCollapsed ? 'justify-center' : ''}
  `;

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-full md:w-72'
      } border-r border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0A0E17]/80 backdrop-blur-3xl flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out z-20 overflow-hidden relative`}
    >
      <div className="p-4 md:p-6 flex flex-col h-full">
        {/* Header / Toggle */}
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={toggleSidebar}
            className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all hover:bg-primary/20 hover:scale-105 shrink-0`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <LayoutGrid size={22} />
          </button>
          
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-display font-bold text-lg tracking-tight text-slate-800 dark:text-white whitespace-nowrap overflow-hidden"
            >
              UMI <span className="text-slate-400 font-normal">OS</span>
            </motion.span>
          )}
        </div>

        <div className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
          {/* Main Menu */}
          {!isCollapsed && (
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3 mt-4 animate-in fade-in duration-300">Menu</div>
          )}
          
          <button onClick={() => onChangeView('workspace')} className={navClass('workspace')} title="Workspace">
            <LayoutGrid size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm truncate">Workspace</span>}
          </button>
          
          <button onClick={() => onChangeView('settings')} className={navClass('settings')} title="Settings">
            <Settings size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm truncate">Settings</span>}
          </button>

          {/* Preferences Submenu */}
          {currentView === 'settings' && (
             <div className="mt-6 border-t border-slate-200 dark:border-white/5 pt-4">
               {!isCollapsed && (
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3 animate-in fade-in duration-300">Preferences</div>
               )}
               <div className="space-y-1">
                 {[
                   { icon: User, label: 'User Information' },
                   { icon: CreditCard, label: 'Plan Details' },
                   { icon: Smartphone, label: 'Connected Devices' },
                   { icon: Lock, label: 'Privacy & Data' },
                   { icon: Bell, label: 'Notifications' },
                 ].map((item, idx) => {
                   const isActive = item.label === activeSection;
                   return (
                     <button 
                       key={idx} 
                       onClick={() => setActiveSection(item.label)}
                       className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1 ${
                         isActive 
                           ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 font-medium' 
                           : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                       } ${isCollapsed ? 'justify-center' : ''}`}
                       title={item.label}
                     >
                       <item.icon size={18} className={`shrink-0 ${isActive ? 'text-primary' : ''}`} />
                       {!isCollapsed && (
                          <>
                            <span className="text-sm truncate">{item.label}</span>
                            {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-primary shrink-0"></div>}
                          </>
                       )}
                     </button>
                   );
                 })}
               </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className={`mt-auto pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} mb-2`}>
              <button 
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform"
                  title="Toggle Theme"
              >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {!isCollapsed && <span className="text-xs text-slate-400 font-mono">v2.4.0</span>}
          </div>
          <button 
            className={`w-full flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors py-2 px-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}
            title="Sign Out"
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};