import React from 'react';

export const Progress = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <h1 className="text-3xl font-black tracking-tight mb-8">Progress Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
          <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">Total Workouts</p>
          <h3 className="text-4xl font-black">12</h3>
          <p className="text-green-500 text-sm font-bold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span> +2 this week
          </p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
          <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">Volume (30d)</p>
          <h3 className="text-4xl font-black text-primary">45k <span className="text-lg text-text-sub-light dark:text-text-sub-dark">kg</span></h3>
          <p className="text-green-500 text-sm font-bold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span> +5% vs last month
          </p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
          <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">Best Streak</p>
          <h3 className="text-4xl font-black">5 <span className="text-lg text-text-sub-light dark:text-text-sub-dark">Weeks</span></h3>
          <p className="text-text-sub-light dark:text-text-sub-dark text-sm mt-2">Keep it going!</p>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 h-96 flex flex-col justify-center items-center text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <span className="material-symbols-outlined text-4xl text-primary">insights</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Detailed Charts Coming Soon</h3>
        <p className="text-text-sub-light dark:text-text-sub-dark max-w-md">
          We are gathering more data to build your 1RM estimations and volume progression charts. Log a few more workouts!
        </p>
      </div>
    </div>
  );
};
