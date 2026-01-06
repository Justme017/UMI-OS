import React, { useState } from 'react';
import { Camera, Watch, Router, Trash2, PlusCircle, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../types';

interface SettingsProps {
  user: User;
}

export const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 overflow-y-auto h-full p-8 md:p-12 pb-32"
    >
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-semibold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Manage your personal information, subscription, and hardware connections.</p>
        </div>

        {/* User Info Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white px-1">User Information</h3>
          <div className="glass-card rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="relative group cursor-pointer">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                      <span className="font-display font-bold text-3xl text-primary">{user.avatarInitials}</span>
                    </div>
                  </div>
                  <button className="absolute bottom-1 right-1 w-9 h-9 bg-white dark:bg-slate-800 text-slate-500 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:text-primary hover:border-primary transition-colors z-10">
                    <Camera size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 w-full space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">First Name</label>
                    <input className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none" type="text" defaultValue={user.firstName} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Last Name</label>
                    <input className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none" type="text" defaultValue={user.lastName} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Email Address</label>
                  <input className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Bio / Context</label>
                  <textarea className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none resize-none h-24" defaultValue={user.bio}></textarea>
                </div>
                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 px-6 font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 ${saved ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : ''}`}
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : (saved ? <Check size={18} /> : <Check size={18} />)}
                    {isSaving ? 'Saving...' : (saved ? 'Changes Saved' : 'Save Changes')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plan Details */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white px-1">Plan Details</h3>
          <div className="glass-card rounded-3xl p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">UMI Pro</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase border border-indigo-200 dark:border-indigo-800">Active</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Your next billing date is <span className="text-slate-900 dark:text-white font-medium">October 24, 2023</span>.</p>
              </div>
              <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm transition-colors shadow-sm bg-white/50 dark:bg-transparent backdrop-blur-sm">
                Manage Subscription
              </button>
            </div>

            <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-5 border border-white/40 dark:border-white/5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">Memory Usage</span>
                <span className="text-sm text-slate-500">450 / 1,000 items</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Includes text notes, audio transcriptions, and image analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Devices */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white px-1">Connected Devices</h3>
          <div className="glass-card rounded-3xl border border-white/40 dark:border-white/5 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
             {[
               { icon: Watch, name: 'UMI Pendant', status: 'Connected • Battery 82%', statusColor: 'bg-emerald-500' },
               { icon: Router, name: 'UMI Home Hub', status: 'Offline • Last seen 2 days ago', statusColor: 'bg-slate-400' }
             ].map((device, idx) => (
              <div key={idx} className="p-5 flex items-center justify-between group hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <device.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-medium">{device.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${device.statusColor}`}></span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{device.status}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
             ))}
             
             <button className="w-full p-4 bg-primary/5 dark:bg-primary/10 flex justify-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors text-primary font-medium text-sm gap-2 items-center">
                <PlusCircle size={18} />
                Add New Device
             </button>
          </div>
        </section>

      </div>
    </motion.div>
  );
};