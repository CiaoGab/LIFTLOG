import React, { useState } from 'react';
import { Template, TemplateExercise } from '../models/types';
import { TemplateExerciseRow } from './TemplateExerciseRow';
import { ExercisePickerModal } from './ExercisePickerModal';
import { v4 as uuidv4 } from 'uuid';

interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Omit<Template, 'id'>) => void;
  onCancel: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(template?.name ?? '');
  const [description, setDescription] = useState(template?.description ?? '');
  const [exercises, setExercises] = useState<TemplateExercise[]>(
    template?.exercises ?? []
  );
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddExercise = (exName: string, muscleGroup: string) => {
    setExercises([
      ...exercises,
      { id: uuidv4(), name: exName, muscleGroup, targetSets: 3, targetReps: '8-10', restSeconds: 90 },
    ]);
    setShowExercisePicker(false);
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    const newExercises = [...exercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]];
    setExercises(newExercises);
  };

  const handleUpdateSets = (id: string, sets: number) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, targetSets: sets } : ex));
  };

  const handleUpdateReps = (id: string, reps: string) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, targetReps: reps } : ex));
  };

  const handleUpdateRest = (id: string, rest: number) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, restSeconds: rest } : ex));
  };

  const handleSave = () => {
    setError(null);
    if (!name.trim()) {
      setError('Template name is required');
      return;
    }
    if (exercises.length === 0) {
      setError('Add at least one exercise');
      return;
    }
    onSave({ name: name.trim(), description: description.trim(), exercises, tags: template?.tags });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-background-light dark:bg-background-dark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-surface-light dark:bg-surface-dark shrink-0">
          <h2 className="font-bold text-xl">
            {template ? 'Edit Template' : 'New Template'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-2">Template Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Push Day, Leg Day..."
              className="w-full px-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this template..."
              rows={2}
              className="w-full px-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Exercises */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold">Exercises ({exercises.length})</label>
            </div>

            <div className="space-y-2">
              {exercises.map((ex, index) => (
                <TemplateExerciseRow
                  key={ex.id}
                  exercise={ex}
                  index={index}
                  canMoveUp={index > 0}
                  canMoveDown={index < exercises.length - 1}
                  onMoveUp={() => handleMoveExercise(index, 'up')}
                  onMoveDown={() => handleMoveExercise(index, 'down')}
                  onUpdateSets={(sets) => handleUpdateSets(ex.id, sets)}
                  onUpdateReps={(reps) => handleUpdateReps(ex.id, reps)}
                  onUpdateRest={(rest) => handleUpdateRest(ex.id, rest)}
                  onRemove={() => handleRemoveExercise(ex.id)}
                />
              ))}
            </div>

            <button
              onClick={() => setShowExercisePicker(true)}
              className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-border-light dark:border-border-dark text-text-sub-light dark:text-text-sub-dark hover:text-primary hover:border-primary hover:bg-primary/5 transition-all font-bold flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add Exercise
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex gap-3 shrink-0">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-border-light dark:border-border-dark font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
          >
            {template ? 'Save Changes' : 'Create Template'}
          </button>
        </div>
      </div>

      {/* Exercise picker */}
      <ExercisePickerModal
        isOpen={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelect={handleAddExercise}
      />
    </div>
  );
};

