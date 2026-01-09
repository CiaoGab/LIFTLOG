import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { ExerciseCard } from '../components/ExerciseCard';
import { ExercisePickerModal } from '../components/ExercisePickerModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const formatElapsed = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const Workout = () => {
  const navigate = useNavigate();
  const {
    activeSession,
    settings,
    updateSet,
    addSet,
    copyLastSet,
    removeSet,
    removeExercise,
    finishWorkout,
    cancelWorkout,
    addExerciseToSession,
    startWorkout,
    toggleTrackingMode,
  } = useAppStore();

  const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Elapsed timer
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - activeSession.startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // No active session view
  if (!activeSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <span className="material-symbols-outlined text-6xl text-primary">fitness_center</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">No Active Workout</h2>
        <p className="text-text-sub-light dark:text-text-sub-dark mb-8">
          Get moving and track your progress!
        </p>
        <button
          onClick={() => startWorkout()}
          className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Start Empty Workout
        </button>
      </div>
    );
  }

  const handleFinish = () => {
    setError(null);
    const result = finishWorkout();
    if (result.success) {
      navigate('/history');
    } else {
      setError(result.error || 'Failed to finish workout');
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    cancelWorkout();
    navigate('/home');
  };

  const handleAddExercise = (name: string, muscleGroup: string, category?: string) => {
    addExerciseToSession(name, muscleGroup, category);
    setExerciseModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark relative">
      {/* Header */}
      <header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-4 py-4 flex justify-between items-center shrink-0 z-10 shadow-sm sticky top-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight line-clamp-1">{activeSession.name}</h2>
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap">
              Active
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-sub-light dark:text-text-sub-dark text-xs font-medium">
            <span className="material-symbols-outlined text-sm">timer</span>
            <span className="font-mono">{formatElapsed(elapsed)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <button
            onClick={handleFinish}
            className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
          >
            Finish
          </button>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3 flex items-center gap-2 border-b border-red-200 dark:border-red-800">
          <span className="material-symbols-outlined text-sm">error</span>
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
        {activeSession.exercises.map((exercise, exIndex) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={exIndex}
            units={settings.units}
            onUpdateSet={(setId, updates) => updateSet(exercise.id, setId, updates)}
            onAddSet={() => addSet(exercise.id)}
            onCopyLastSet={() => copyLastSet(exercise.id)}
            onRemoveSet={(setId) => removeSet(exercise.id, setId)}
            onRemoveExercise={() => removeExercise(exercise.id)}
            onToggleTrackingMode={() => toggleTrackingMode(exercise.id)}
          />
        ))}

        {/* Add exercise button */}
        <button
          onClick={() => setExerciseModalOpen(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark text-text-sub-light dark:text-text-sub-dark hover:text-primary hover:border-primary hover:bg-primary/5 transition-all font-bold flex flex-col items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-3xl">add_circle</span>
          Add Exercise
        </button>
      </div>

      {/* Exercise picker modal */}
      <ExercisePickerModal
        isOpen={isExerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        onSelect={handleAddExercise}
      />

      {/* Cancel workout confirmation */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Cancel Workout"
        message="Current progress will be lost. Are you sure?"
        confirmLabel="Cancel Workout"
        cancelLabel="Keep Working"
        variant="destructive"
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  );
};
