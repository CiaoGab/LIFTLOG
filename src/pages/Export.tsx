import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  filterByDateRange, 
  downloadWorkoutsCSV, 
  downloadExercisesCSV, 
  downloadSetsCSV,
  downloadAllCSV 
} from '../utils/csv';

const FILE_SCHEMAS = [
  {
    name: 'workouts.csv',
    icon: 'fitness_center',
    description: 'One row per workout session',
    columns: [
      { name: 'workout_id', desc: 'Unique workout identifier' },
      { name: 'name', desc: 'Workout name' },
      { name: 'date', desc: 'Date (YYYY-MM-DD)' },
      { name: 'start_time', desc: 'Start timestamp (ISO 8601)' },
      { name: 'end_time', desc: 'End timestamp (ISO 8601)' },
      { name: 'duration_min', desc: 'Duration in minutes' },
      { name: 'exercise_count', desc: 'Number of exercises' },
      { name: 'total_sets', desc: 'Total completed sets' },
      { name: 'total_volume', desc: 'Total volume (weight × reps)' },
    ]
  },
  {
    name: 'exercises.csv',
    icon: 'exercise',
    description: 'One row per exercise in each workout',
    columns: [
      { name: 'exercise_id', desc: 'Unique exercise identifier' },
      { name: 'workout_id', desc: 'Parent workout ID (FK)' },
      { name: 'workout_date', desc: 'Workout date' },
      { name: 'name', desc: 'Exercise name' },
      { name: 'muscle_group', desc: 'Target muscle group' },
      { name: 'set_count', desc: 'Total sets' },
      { name: 'completed_sets', desc: 'Completed sets' },
      { name: 'volume', desc: 'Exercise volume' },
      { name: 'notes', desc: 'Exercise notes' },
    ]
  },
  {
    name: 'sets.csv',
    icon: 'repeat',
    description: 'One row per set (most granular)',
    columns: [
      { name: 'set_id', desc: 'Unique set identifier' },
      { name: 'exercise_id', desc: 'Parent exercise ID (FK)' },
      { name: 'workout_id', desc: 'Parent workout ID (FK)' },
      { name: 'workout_date', desc: 'Workout date' },
      { name: 'exercise_name', desc: 'Exercise name' },
      { name: 'set_number', desc: 'Set number (1, 2, 3...)' },
      { name: 'weight', desc: 'Weight lifted' },
      { name: 'reps', desc: 'Repetitions' },
      { name: 'rpe', desc: 'Rate of perceived exertion' },
      { name: 'completed', desc: 'Was set completed (true/false)' },
    ]
  }
];

export const Export = () => {
  const { history, settings } = useAppStore();
  const [exportAll, setExportAll] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedSchema, setExpandedSchema] = useState<string | null>(null);

  const filteredHistory = useMemo(() => {
    if (exportAll) return history;
    return filterByDateRange(
      history,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }, [history, exportAll, startDate, endDate]);

  const stats = useMemo(() => {
    const workouts = filteredHistory.length;
    const exercises = filteredHistory.reduce((acc, w) => acc + w.exercises.length, 0);
    const sets = filteredHistory.reduce((acc, w) => 
      acc + w.exercises.reduce((eAcc, e) => eAcc + e.sets.length, 0), 0
    );
    return { workouts, exercises, sets };
  }, [filteredHistory]);

  const handleDownload = (type: 'all' | 'workouts' | 'exercises' | 'sets') => {
    switch (type) {
      case 'all':
        downloadAllCSV(filteredHistory);
        break;
      case 'workouts':
        downloadWorkoutsCSV(filteredHistory);
        break;
      case 'exercises':
        downloadExercisesCSV(filteredHistory);
        break;
      case 'sets':
        downloadSetsCSV(filteredHistory);
        break;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <h1 className="text-3xl font-black tracking-tight mb-2">Export Data</h1>
      <p className="text-text-sub-light dark:text-text-sub-dark mb-8">
        Download your training history as CSV files for analysis in Excel, Google Sheets, or other tools.
      </p>

      {/* Date Range Filter */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Date Range</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={exportAll}
              onChange={() => setExportAll(true)}
              className="w-4 h-4 text-primary"
            />
            <span className="font-medium">All history</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={!exportAll}
              onChange={() => setExportAll(false)}
              className="w-4 h-4 text-primary"
            />
            <span className="font-medium">Custom range</span>
          </label>
        </div>

        {!exportAll && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">
                From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">
                To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Stats preview */}
        <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-text-sub-light dark:text-text-sub-dark">Workouts: </span>
              <span className="font-bold">{stats.workouts}</span>
            </div>
            <div>
              <span className="text-text-sub-light dark:text-text-sub-dark">Exercises: </span>
              <span className="font-bold">{stats.exercises}</span>
            </div>
            <div>
              <span className="text-text-sub-light dark:text-text-sub-dark">Sets: </span>
              <span className="font-bold">{stats.sets}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download All Button */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-full text-white">
            <span className="material-symbols-outlined text-2xl">folder_zip</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Download All Files</h3>
            <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
              Get all 3 CSV files at once
            </p>
          </div>
        </div>
        <button
          onClick={() => handleDownload('all')}
          disabled={stats.workouts === 0}
          className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">download</span>
          Download All
        </button>
      </div>

      {/* File Schemas */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg">Individual Files</h2>
        
        {FILE_SCHEMAS.map((schema) => (
          <div 
            key={schema.name}
            className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">{schema.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold">{schema.name}</h3>
                  <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
                    {schema.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedSchema(expandedSchema === schema.name ? null : schema.name)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                  title="View schema"
                >
                  <span className="material-symbols-outlined text-sm">
                    {expandedSchema === schema.name ? 'expand_less' : 'info'}
                  </span>
                </button>
                <button
                  onClick={() => handleDownload(schema.name.replace('.csv', '') as 'workouts' | 'exercises' | 'sets')}
                  disabled={stats.workouts === 0}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-bold transition-opacity flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download
                </button>
              </div>
            </div>

            {/* Schema details */}
            {expandedSchema === schema.name && (
              <div className="border-t border-border-light dark:border-border-dark p-4 bg-slate-50 dark:bg-black/20">
                <h4 className="text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider mb-3">
                  Columns
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {schema.columns.map((col) => (
                    <div key={col.name} className="flex items-start gap-2">
                      <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">
                        {col.name}
                      </code>
                      <span className="text-xs text-text-sub-light dark:text-text-sub-dark">
                        {col.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Units note */}
      <p className="mt-6 text-xs text-text-sub-light dark:text-text-sub-dark text-center">
        Weight values are exported as entered (currently using {settings.units.toUpperCase()})
      </p>
    </div>
  );
};

