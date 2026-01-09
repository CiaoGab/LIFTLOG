import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const Home = () => {
  const navigate = useNavigate();
  const { activeSession, history, templates, startWorkout } = useAppStore();
  const lastSession = history[0];

  // Mock progress data
  const weeklyWorkouts = 3;
  const weeklyGoal = 4;

  const handleStartTemplate = (id: string) => {
    startWorkout(id);
    navigate('/workout');
  };

  const handleStartEmpty = () => {
    startWorkout();
    navigate('/workout');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-text-sub-light dark:text-text-sub-dark font-medium mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Quick Start</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark rounded-full border border-border-light dark:border-transparent shadow-sm">
          <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
          <span className="font-bold text-sm">3 Day Streak</span>
        </div>
      </div>

      {/* Active Workout Banner */}
      {activeSession && (
        <div className="bg-primary text-white rounded-2xl p-4 md:p-6 shadow-lg shadow-primary/20 relative overflow-hidden mb-8 group cursor-pointer" onClick={() => navigate('/workout')}>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-black/10 p-3 rounded-xl backdrop-blur-sm">
                <span className="material-symbols-outlined text-3xl">timer</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
                  <p className="text-sm font-bold uppercase tracking-wider opacity-80">Live Session</p>
                </div>
                <h3 className="text-2xl font-black">{activeSession.name}</h3>
                <p className="font-medium opacity-80 mt-1">In Progress</p>
              </div>
            </div>
            <button className="bg-white text-primary hover:bg-slate-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all">
              <span className="material-symbols-outlined">play_arrow</span>
              Resume Workout
            </button>
          </div>
        </div>
      )}

      {/* Hero / Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Start Empty */}
        <div className="group relative overflow-hidden rounded-3xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-transparent shadow-sm hover:shadow-md transition-all">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            <div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDi8PMRvIRF84WBkYILDrx0qse2wx9un7LBPmWNuuSdVfK3rPhfg8A1b3PBILNfZRKGyuYFRvw_Z138zvY6uWfEX7a4gjAJLu9QfVcmdOwSqqXEEud0dK9uf1ZVQwdxrWRLktUH9XlJZSjC7Z3PfB9NRi6oGzmQDCR6Jl-OVvQ5rX_fyTE17945up6DNmKrbB-QbroVeUcgq3oxwJHeoLqHpe9pRP3bh8w-n7z1UbgDj-cMBDLDkDfH7GWdgbQuZqfhltwlKEsUloE)'}}></div>
          </div>
          <div className="relative z-20 p-6 md:p-8 h-64 flex flex-col justify-end items-start text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to crush it?</h3>
            <p className="text-slate-200 mb-6 text-sm max-w-[80%]">Start a new empty workout and log as you go.</p>
            <button onClick={handleStartEmpty} className="bg-primary text-white hover:bg-primary-hover px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Start Empty Workout
            </button>
          </div>
        </div>

        {/* Last Session / Stats */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-transparent rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Last Session</h3>
              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded text-text-sub-light dark:text-text-sub-dark">
                {lastSession ? new Date(lastSession.startTime).toLocaleDateString() : 'No recent'}
              </span>
            </div>
            {lastSession ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl">
                    <span className="material-symbols-outlined">fitness_center</span>
                  </div>
                  <div>
                    <p className="text-sm text-text-sub-light dark:text-text-sub-dark">Workout</p>
                    <p className="font-bold text-lg">{lastSession.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-background-light dark:bg-black/20 rounded-xl">
                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark mb-1">Volume</p>
                    <p className="font-bold">-- kg</p>
                  </div>
                  <div className="p-3 bg-background-light dark:bg-black/20 rounded-xl">
                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark mb-1">Exercises</p>
                    <p className="font-bold">{lastSession.exercises.length}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-text-sub-light dark:text-text-sub-dark">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">history</span>
                <p>No workout history yet</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              <span>Keep up the consistency!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Quick Start Templates</h2>
          <button onClick={() => navigate('/templates')} className="text-primary hover:text-primary-hover text-sm font-semibold flex items-center gap-1">
            View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.slice(0, 3).map((template) => (
            <button key={template.id} onClick={() => handleStartTemplate(template.id)} className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-transparent shadow-sm hover:border-primary/50 dark:hover:border-primary/50 transition-all group text-left">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">{template.name.includes('Leg') ? 'directions_run' : template.name.includes('Upper') ? 'accessibility_new' : 'fitness_center'}</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">play_circle</span>
              </div>
              <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{template.name}</h4>
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark line-clamp-1">{template.description || 'No description'}</p>
            </button>
          ))}
          
          {/* Create New Stub */}
          <button onClick={() => navigate('/templates')} className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left flex flex-col justify-center items-center h-full min-h-[140px]">
            <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-600 mb-2">add_circle</span>
            <span className="font-medium text-text-sub-light dark:text-text-sub-dark text-sm">Create New Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};
