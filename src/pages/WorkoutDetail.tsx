import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const WorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { history, settings, duplicateWorkout, deleteHistoryItem, getPersonalRecords } = useAppStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const workout = history.find(h => h.id === id);
  const prs = getPersonalRecords();

  if (!workout) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center py-20">
        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">error</span>
        <h2 className="text-xl font-bold mb-2">Workout Not Found</h2>
        <button onClick={() => navigate('/history')} className="text-primary font-medium">
          Back to History
        </button>
      </div>
    );
  }

  const duration = workout.endTime 
    ? Math.round((workout.endTime - workout.startTime) / 60000) 
    : 0;

  const totalVolume = workout.exercises.reduce((acc, ex) => 
    acc + ex.sets.reduce((sAcc, s) => {
      if (!s.completed) return sAcc;
      // For time-based sets, skip volume calculation
      if (ex.trackingMode === 'time') return sAcc;
      return sAcc + (Number(s.weight) * Number(s.reps) || 0);
    }, 0), 0
  );

  const totalSets = workout.exercises.reduce((acc, ex) => 
    acc + ex.sets.filter(s => s.completed).length, 0
  );

  const handleDuplicate = () => {
    duplicateWorkout(workout.id);
    navigate('/workout');
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteHistoryItem(workout.id);
    navigate('/history');
  };

  // Check if a set is a PR for its exercise
  const isPR = (exerciseName: string, weight: number): boolean => {
    const key = exerciseName.toLowerCase();
    return prs[key]?.weight === weight && weight > 0;
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      {/* Back button */}
      <button 
        onClick={() => navigate('/history')}
        className="flex items-center gap-1 text-text-sub-light dark:text-text-sub-dark hover:text-primary mb-4 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span className="text-sm font-medium">Back to History</span>
      </button>

      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight mb-1">{workout.name}</h1>
            <p className="text-text-sub-light dark:text-text-sub-dark flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {new Date(workout.startTime).toLocaleDateString(undefined, { 
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDuplicate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 text-center">
            <p className="text-xs text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider font-bold mb-1">Duration</p>
            <p className="text-2xl font-black">{duration}<span className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">m</span></p>
          </div>
          <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 text-center">
            <p className="text-xs text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider font-bold mb-1">Volume</p>
            <p className="text-2xl font-black">{totalVolume.toLocaleString()}<span className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">{settings.units}</span></p>
          </div>
          <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 text-center">
            <p className="text-xs text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider font-bold mb-1">Sets</p>
            <p className="text-2xl font-black">{totalSets}</p>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {workout.exercises.map((exercise, exIndex) => (
          <div 
            key={exercise.id} 
            className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden"
          >
            {/* Exercise header */}
            <div className="p-4 border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-black/20 flex items-center gap-3">
              <div className="bg-primary text-white size-8 rounded-lg flex items-center justify-center font-bold text-sm">
                {exIndex + 1}
              </div>
              <div>
                <h3 className="font-bold text-lg">{exercise.name}</h3>
                <p className="text-xs text-text-sub-light dark:text-text-sub-dark">{exercise.muscleGroup}</p>
              </div>
            </div>

            {/* Sets table */}
            <div className="p-4">
              <div className="grid grid-cols-4 gap-2 text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider text-center mb-2">
                <div>Set</div>
                <div>{settings.units}</div>
                <div>{exercise.trackingMode === 'time' ? 'Time' : 'Reps'}</div>
                <div>Status</div>
              </div>

              <div className="space-y-1">
                {exercise.sets.map((set, setIndex) => {
                  const weight = Number(set.weight) || 0;
                  const isSetPR = set.completed && isPR(exercise.name, weight);

                  return (
                    <div 
                      key={set.id}
                      className={`grid grid-cols-4 gap-2 items-center p-3 rounded-xl text-center ${
                        set.completed 
                          ? isSetPR 
                            ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-300 dark:border-yellow-700' 
                            : 'bg-green-50 dark:bg-green-900/10'
                          : 'bg-slate-50 dark:bg-black/10'
                      }`}
                    >
                      <div className="font-bold text-text-sub-light dark:text-text-sub-dark">
                        {setIndex + 1}
                      </div>
                      <div className="font-bold flex items-center justify-center gap-1">
                        {set.weight || '-'}
                        {isSetPR && (
                          <span className="text-yellow-500 text-xs" title="Personal Record">🏆</span>
                        )}
                      </div>
                      <div className="font-bold">
                        {exercise.trackingMode === 'time' 
                          ? (set.durationSeconds 
                              ? `${Math.floor(set.durationSeconds / 60)}:${String(Math.floor(set.durationSeconds % 60)).padStart(2, '0')}`
                              : '-')
                          : (set.reps || '-')}
                      </div>
                      <div>
                        {set.completed ? (
                          <span className="inline-flex items-center justify-center size-6 bg-green-500 text-white rounded-full">
                            <span className="material-symbols-outlined text-sm">check</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center size-6 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-full">
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            {exercise.notes && (
              <div className="px-4 pb-4">
                <div className="bg-slate-50 dark:bg-black/10 rounded-lg p-3">
                  <p className="text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm">{exercise.notes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Workout"
        message="Are you sure you want to delete this workout from history? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

