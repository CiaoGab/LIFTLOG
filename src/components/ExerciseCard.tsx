import React, { useState } from 'react';
import { Exercise, Set } from '../models/types';
import { SetRow } from './SetRow';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  units: 'kg' | 'lb';
  onUpdateSet: (setId: string, updates: Partial<Set>) => void;
  onAddSet: () => void;
  onCopyLastSet: () => void;
  onRemoveSet: (setId: string) => void;
  onRemoveExercise: () => void;
  onToggleTrackingMode: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  units,
  onUpdateSet,
  onAddSet,
  onCopyLastSet,
  onRemoveSet,
  onRemoveExercise,
  onToggleTrackingMode,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const completedCount = exercise.sets.filter(s => s.completed).length;
  const totalSets = exercise.sets.length;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-black/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white size-8 rounded-lg flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{exercise.name}</h3>
            {/* Target line - only show if targets exist */}
            {exercise.targetSets && exercise.targetReps ? (
              <p className="text-xs text-primary font-medium">
                {exercise.targetSets} x {exercise.targetReps} •{' '}
                {exercise.restSeconds === 0 ? 'No rest' : `Rest ${exercise.restSeconds}s`}
              </p>
            ) : null}
            <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
              {completedCount}/{totalSets} sets completed
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Reps/Time toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={onToggleTrackingMode}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                exercise.trackingMode === 'reps'
                  ? 'bg-white dark:bg-slate-600 text-primary shadow-sm'
                  : 'text-text-sub-light dark:text-text-sub-dark hover:text-primary'
              }`}
            >
              Reps
            </button>
            <button
              onClick={onToggleTrackingMode}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                exercise.trackingMode === 'time'
                  ? 'bg-white dark:bg-slate-600 text-primary shadow-sm'
                  : 'text-text-sub-light dark:text-text-sub-dark hover:text-primary'
              }`}
            >
              Time
            </button>
          </div>
          
          <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg py-1 min-w-[160px]">
                <button
                  onClick={() => { onRemoveExercise(); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Remove Exercise
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Sets */}
      <div className="p-2">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-2 px-2 py-2 text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider text-center">
          <div className="col-span-1">Set</div>
          <div className="col-span-4">{units.toUpperCase()}</div>
          <div className="col-span-4">{exercise.trackingMode === 'time' ? 'TIME' : 'Reps'}</div>
          <div className="col-span-3">Done</div>
        </div>

        {/* Set rows */}
        <div className="space-y-1">
          {exercise.sets.map((set, setIndex) => (
            <SetRow
              key={set.id}
              set={set}
              index={setIndex}
              units={units}
              restSeconds={exercise.restSeconds}
              enableRestTimer={exercise.isWorking !== false}
              trackingMode={exercise.trackingMode}
              category={exercise.category}
              onUpdate={(updates) => onUpdateSet(set.id, updates)}
              onRemove={() => onRemoveSet(set.id)}
            />
          ))}
        </div>

        {/* Add set buttons */}
        <div className="mt-4 px-2 mb-2 flex gap-2">
          <button
            onClick={onAddSet}
            className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Set
          </button>
          <button
            onClick={onCopyLastSet}
            className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold text-text-sub-light dark:text-text-sub-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copy Last
          </button>
        </div>
      </div>
    </div>
  );
};

