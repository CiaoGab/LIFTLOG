import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const Settings = () => {
  const { settings, toggleTheme, toggleUnits } = useAppStore();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24">
      <h1 className="text-3xl font-black tracking-tight mb-8">Settings</h1>

      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden">
        
        <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg">
              <span className="material-symbols-outlined">dark_mode</span>
            </div>
            <div>
              <h3 className="font-bold">Dark Mode</h3>
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark">Toggle application theme</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full relative transition-colors ${settings.theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 size-4 bg-white rounded-full transition-transform ${settings.theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg">
              <span className="material-symbols-outlined">scale</span>
            </div>
            <div>
              <h3 className="font-bold">Units</h3>
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark">Weight display (KG/LB)</p>
            </div>
          </div>
          <button 
            onClick={toggleUnits}
            className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-lg text-xs font-bold"
          >
            <span className={`px-3 py-1.5 rounded-md transition-all ${settings.units === 'kg' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-text-sub-light'}`}>KG</span>
            <span className={`px-3 py-1.5 rounded-md transition-all ${settings.units === 'lb' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-text-sub-light'}`}>LB</span>
          </button>
        </div>

      </div>

      <div className="mt-8 text-center text-xs text-text-sub-light dark:text-text-sub-dark">
        <p>LiftLog Pro v1.0.0</p>
      </div>
    </div>
  );
};
