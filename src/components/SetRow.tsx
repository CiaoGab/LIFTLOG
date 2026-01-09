import React, { useState, useEffect } from 'react';
import { Set } from '../models/types';
import { RestTimer } from './RestTimer';
import { DurationInput } from './workout/DurationInput';

interface SetRowProps {
  set: Set;
  index: number;
  units: 'kg' | 'lb';
  onUpdate: (updates: Partial<Set>) => void;
  onRemove: () => void;
  restSeconds?: number;
  enableRestTimer?: boolean;
  trackingMode?: 'reps' | 'time';
  category?: string;
}

export const SetRow: React.FC<SetRowProps> = ({
  set,
  index,
  units,
  onUpdate,
  onRemove,
  restSeconds = 90,
  enableRestTimer = true,
  trackingMode = 'reps',
  category,
}) => {
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(set.completed);

  // Show rest timer when set becomes completed
  useEffect(() => {
    if (enableRestTimer && restSeconds > 0 && set.completed && !wasCompleted) {
      setShowRestTimer(true);
    }
    setWasCompleted(set.completed);
  }, [set.completed, wasCompleted, enableRestTimer, restSeconds]);

  const handleToggleComplete = () => {
    onUpdate({ completed: !set.completed });
  };

  return (
    <div className="space-y-2">
      <div
        className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-colors ${
          set.completed ? 'bg-green-50 dark:bg-green-900/10' : 'bg-transparent'
        }`}
      >
        {/* Set number */}
        <div className="col-span-1 flex items-center justify-center">
          <span className="text-sm font-bold text-text-sub-light dark:text-text-sub-dark">
            {index + 1}
          </span>
        </div>

        {/* Weight input */}
        <div className="col-span-4">
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={set.weight ?? ''}
              onChange={(e) => onUpdate({ weight: e.target.value })}
              placeholder="0"
              min="0"
              disabled={trackingMode === 'time' && category === 'cardio'}
              className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-lg text-center font-bold py-2 pr-8 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-sub-light dark:text-text-sub-dark">
              {units}
            </span>
          </div>
        </div>

        {/* Reps or Duration input */}
        <div className="col-span-4">
          {trackingMode === 'time' ? (
            <DurationInput
              value={set.durationSeconds}
              onChange={(seconds) => onUpdate({ durationSeconds: seconds })}
              className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-lg text-center font-bold py-2 focus:ring-2 focus:ring-primary"
            />
          ) : (
            <input
              type="number"
              inputMode="numeric"
              value={set.reps ?? ''}
              onChange={(e) => onUpdate({ reps: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-lg text-center font-bold py-2 focus:ring-2 focus:ring-primary"
            />
          )}
        </div>

        {/* Complete toggle */}
        <div className="col-span-3 flex justify-center gap-1">
          <button
            onClick={handleToggleComplete}
            className={`flex-1 h-10 rounded-lg flex items-center justify-center transition-all ${
              set.completed
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-slate-200 dark:bg-slate-700 text-text-sub-light dark:text-text-sub-dark hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <span className="material-symbols-outlined">check</span>
          </button>
          <button
            onClick={onRemove}
            className="h-10 px-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-text-sub-light dark:text-text-sub-dark hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>

      {/* Rest timer chip */}
      {showRestTimer && set.completed && enableRestTimer && restSeconds > 0 && (
        <div className="flex justify-center">
          <RestTimer initialSeconds={restSeconds} onDismiss={() => setShowRestTimer(false)} />
        </div>
      )}
    </div>
  );
};

