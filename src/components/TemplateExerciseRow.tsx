import React from 'react';
import { TemplateExercise } from '../models/types';

interface TemplateExerciseRowProps {
  exercise: TemplateExercise;
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdateSets: (sets: number) => void;
  onUpdateReps: (reps: string) => void;
  onUpdateRest: (rest: number) => void;
  onRemove: () => void;
}

export const TemplateExerciseRow: React.FC<TemplateExerciseRowProps> = ({
  exercise,
  index,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onUpdateSets,
  onUpdateReps,
  onUpdateRest,
  onRemove,
}) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Reorder buttons */}
      <div className="flex sm:flex-col gap-1 order-2 sm:order-1">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        </button>
      </div>

      {/* Exercise info */}
      <div className="flex-1 order-1 sm:order-2">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary size-6 rounded flex items-center justify-center text-xs font-bold">
            {index + 1}
          </span>
          <h4 className="font-bold">{exercise.name}</h4>
        </div>
        <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-1">
          {exercise.muscleGroup}
        </p>
      </div>

      {/* Sets input */}
      <div className="flex items-center gap-2 order-3">
        <label className="text-xs text-text-sub-light dark:text-text-sub-dark whitespace-nowrap">
          Sets:
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={exercise.targetSets}
          onChange={(e) => onUpdateSets(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 px-2 py-1 bg-slate-100 dark:bg-black/20 rounded-lg text-center font-bold focus:ring-2 focus:ring-primary border-none"
        />
      </div>

      {/* Reps input */}
      <div className="flex items-center gap-2 order-4">
        <label className="text-xs text-text-sub-light dark:text-text-sub-dark whitespace-nowrap">
          Reps:
        </label>
        <input
          type="text"
          value={exercise.targetReps}
          onChange={(e) => onUpdateReps(e.target.value)}
          placeholder="8-10"
          className="w-20 px-2 py-1 bg-slate-100 dark:bg-black/20 rounded-lg text-center font-bold focus:ring-2 focus:ring-primary border-none"
        />
      </div>

      {/* Rest input */}
      <div className="flex items-center gap-2 order-5">
        <label className="text-xs text-text-sub-light dark:text-text-sub-dark whitespace-nowrap">
          Rest:
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="600"
            step="15"
            value={exercise.restSeconds ?? 90}
            onChange={(e) => onUpdateRest(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 px-2 py-1 bg-slate-100 dark:bg-black/20 rounded-lg text-center font-bold focus:ring-2 focus:ring-primary border-none"
          />
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-text-sub-light dark:text-text-sub-dark">s</span>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors order-5"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
    </div>
  );
};

