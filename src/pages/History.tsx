import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { WorkoutSession } from '../models/types';

// Helper to get week number
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Helper to group workouts
const groupWorkouts = (history: WorkoutSession[]): { label: string; workouts: WorkoutSession[] }[] => {
  const now = new Date();
  const thisWeek = getWeekNumber(now);
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const groups: Record<string, { order: number; workouts: WorkoutSession[] }> = {};

  history.forEach(workout => {
    const date = new Date(workout.startTime);
    const week = getWeekNumber(date);
    const month = date.getMonth();
    const year = date.getFullYear();

    let label: string;
    let order: number;

    if (year === thisYear && week === thisWeek) {
      label = 'This Week';
      order = 0;
    } else if (year === thisYear && week === thisWeek - 1) {
      label = 'Last Week';
      order = 1;
    } else if (year === thisYear && month === thisMonth) {
      label = 'This Month';
      order = 2;
    } else {
      label = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      // Order by reverse chronological (newer months first)
      order = 100 + (thisYear - year) * 12 + (thisMonth - month);
    }

    if (!groups[label]) {
      groups[label] = { order, workouts: [] };
    }
    groups[label].workouts.push(workout);
  });

  return Object.entries(groups)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([label, { workouts }]) => ({ label, workouts }));
};

export const History = () => {
  const { history, settings } = useAppStore();
  const navigate = useNavigate();

  const groupedWorkouts = useMemo(() => groupWorkouts(history), [history]);

  const formatDuration = (start: number, end?: number): string => {
    if (!end) return '-';
    const mins = Math.round((end - start) / 60000);
    return `${mins}m`;
  };

  const calculateVolume = (workout: WorkoutSession): number => {
    return workout.exercises.reduce((acc, ex) => 
      acc + ex.sets.reduce((sAcc, s) => 
        sAcc + (s.completed ? (Number(s.weight) * Number(s.reps) || 0) : 0), 0
      ), 0
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <h1 className="text-3xl font-black tracking-tight mb-6">Workout History</h1>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">history</span>
          <h3 className="text-xl font-bold mb-2">No History Yet</h3>
          <p className="text-text-sub-light dark:text-text-sub-dark">Complete a workout to see it here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedWorkouts.map(group => (
            <div key={group.label}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-text-sub-light dark:text-text-sub-dark">{group.label}</h2>
                <div className="flex-1 h-px bg-border-light dark:bg-border-dark"></div>
                <span className="text-sm text-text-sub-light dark:text-text-sub-dark">
                  {group.workouts.length} workout{group.workouts.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Workouts in group */}
              <div className="space-y-3">
                {group.workouts.map(workout => (
                  <button
                    key={workout.id}
                    onClick={() => navigate(`/history/${workout.id}`)}
                    className="w-full text-left bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                            {workout.name}
                          </h3>
                          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">
                            chevron_right
                          </span>
                        </div>
                        <p className="text-sm text-text-sub-light dark:text-text-sub-dark flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {new Date(workout.startTime).toLocaleDateString(undefined, { 
                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>

                      <div className="flex gap-4 sm:gap-6">
                        <div className="text-center sm:text-right">
                          <p className="text-xs text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider font-bold">Duration</p>
                          <p className="font-mono font-medium">{formatDuration(workout.startTime, workout.endTime)}</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="text-xs text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider font-bold">Volume</p>
                          <p className="font-mono font-medium">{calculateVolume(workout).toLocaleString()} {settings.units}</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="text-xs text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider font-bold">Exercises</p>
                          <p className="font-mono font-medium">{workout.exercises.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Exercise preview */}
                    <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark flex flex-wrap gap-2">
                      {workout.exercises.slice(0, 4).map(ex => (
                        <span 
                          key={ex.id} 
                          className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-xs font-medium text-text-sub-light dark:text-text-sub-dark"
                        >
                          {ex.name}
                        </span>
                      ))}
                      {workout.exercises.length > 4 && (
                        <span className="px-2 py-1 text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                          +{workout.exercises.length - 4} more
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
