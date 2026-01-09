import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, WorkoutSession, Exercise, Set, Template } from '../models/types';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      history: [],
      // Default templates ship with the app.
      // If a user deletes all templates, we keep it empty (no auto-respawn).
      templates: DEFAULT_TEMPLATES,
      settings: {
        theme: 'dark',
        units: 'kg'
      },

      startWorkout: (templateId) => {
        const { templates } = get();
        let newSession: WorkoutSession;

        if (templateId) {
          const template = templates.find(t => t.id === templateId);
          if (!template) return;

          newSession = {
            id: uuidv4(),
            name: template.name,
            startTime: Date.now(),
            status: 'active',
            exercises: template.exercises.map(te => ({
              id: uuidv4(),
              name: te.name,
              muscleGroup: te.muscleGroup,
              // Carry over target fields for display
              targetSets: te.targetSets,
              targetReps: te.targetReps,
              restSeconds: te.restSeconds ?? 90,
              // Map isWorkingDefault to isWorking (defaults to true if not specified)
              isWorking: te.isWorkingDefault !== undefined ? te.isWorkingDefault : true,
              // Default to reps mode for templates (can be changed in workout)
              trackingMode: 'reps',
              sets: Array.from({ length: te.targetSets }).map(() => ({
                id: uuidv4(),
                reps: te.targetReps.includes('-') ? te.targetReps.split('-')[0] : te.targetReps,
                weight: '',
                durationSeconds: null,
                completed: false
              }))
            }))
          };
        } else {
          newSession = {
            id: uuidv4(),
            name: 'Empty Workout',
            startTime: Date.now(),
            status: 'active',
            exercises: []
          };
        }
        set({ activeSession: newSession });
      },

      finishWorkout: () => {
        const { activeSession, history } = get();
        if (!activeSession) return { success: false, error: 'No active session' };

        // Validation: check for completed sets with valid data
        const completedSets = activeSession.exercises.flatMap(ex => 
          ex.sets.filter(s => s.completed)
        );

        if (completedSets.length === 0) {
          return { success: false, error: 'Complete at least one set before finishing' };
        }

        // Validate: no negative weights
        const hasInvalidWeight = completedSets.some(s => {
          const weight = Number(s.weight);
          return !isNaN(weight) && weight < 0;
        });

        if (hasInvalidWeight) {
          return { success: false, error: 'Weight cannot be negative' };
        }

        // Validate: completed sets need reps OR durationSeconds (depending on tracking mode)
        const hasInvalidData = activeSession.exercises.some(ex => {
          const completedSetsForEx = ex.sets.filter(s => s.completed);
          return completedSetsForEx.some(s => {
            if (ex.trackingMode === 'time') {
              return !s.durationSeconds || s.durationSeconds <= 0;
            } else {
              const reps = String(s.reps).trim();
              return reps === '' || reps === '0';
            }
          });
        });

        if (hasInvalidData) {
          return { success: false, error: 'Completed sets must have reps or duration' };
        }

        const completedSession: WorkoutSession = {
          ...activeSession,
          endTime: Date.now(),
          status: 'completed'
        };

        set({
          history: [completedSession, ...history],
          activeSession: null
        });

        return { success: true };
      },

      cancelWorkout: () => {
        set({ activeSession: null });
      },

      addExerciseToSession: (name, muscleGroup, category?) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const trackingMode = category === 'cardio' ? 'time' : 'reps';
        const newExercise: Exercise = {
          id: uuidv4(),
          name,
          muscleGroup,
          trackingMode,
          category,
          sets: [{
            id: uuidv4(),
            weight: '',
            reps: trackingMode === 'reps' ? '' : null,
            durationSeconds: trackingMode === 'time' ? null : null,
            completed: false
          }]
        };

        set({
          activeSession: {
            ...activeSession,
            exercises: [...activeSession.exercises, newExercise]
          }
        });
      },

      removeExercise: (exerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return;

        set({
          activeSession: {
            ...activeSession,
            exercises: activeSession.exercises.filter(ex => ex.id !== exerciseId)
          }
        });
      },

      toggleTrackingMode: (exerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const newMode = ex.trackingMode === 'reps' ? 'time' : 'reps';
          return { ...ex, trackingMode: newMode };
        });

        set({ activeSession: { ...activeSession, exercises: updatedExercises } });
      },

      updateSet: (exerciseId, setId, updates) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
          };
        });

        set({ activeSession: { ...activeSession, exercises: updatedExercises } });
      },

      addSet: (exerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const newSet: Set = {
            id: uuidv4(),
            weight: '',
            reps: ex.trackingMode === 'reps' ? '' : null,
            durationSeconds: ex.trackingMode === 'time' ? null : null,
            completed: false
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        });

        set({ activeSession: { ...activeSession, exercises: updatedExercises } });
      },

      copyLastSet: (exerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet: Set = {
            id: uuidv4(),
            weight: lastSet?.weight ?? '',
            reps: lastSet?.reps ?? (ex.trackingMode === 'reps' ? '' : null),
            durationSeconds: lastSet?.durationSeconds ?? (ex.trackingMode === 'time' ? null : null),
            completed: false
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        });

        set({ activeSession: { ...activeSession, exercises: updatedExercises } });
      },

      removeSet: (exerciseId, setId) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
        });

        set({ activeSession: { ...activeSession, exercises: updatedExercises } });
      },

      toggleTheme: () => {
        const { settings } = get();
        const newTheme = settings.theme === 'light' ? 'dark' : 'light';
        set({ settings: { ...settings, theme: newTheme } });
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleUnits: () => {
        const { settings } = get();
        set({ settings: { ...settings, units: settings.units === 'kg' ? 'lb' : 'kg' } });
      },

      deleteHistoryItem: (id) => {
        const { history } = get();
        set({ history: history.filter(h => h.id !== id) });
      },

      // Template CRUD
      createTemplate: (template) => {
        const { templates } = get();
        const id = uuidv4();
        const newTemplate = { ...template, id };
        set({ templates: [...templates, newTemplate] });
        return id;
      },

      updateTemplate: (id, updates) => {
        const { templates } = get();
        set({
          templates: templates.map(t => t.id === id ? { ...t, ...updates } : t)
        });
      },

      deleteTemplate: (id) => {
        const { templates } = get();
        set({ templates: templates.filter(t => t.id !== id) });
      },

      // Duplicate a past workout as a new active session
      duplicateWorkout: (id) => {
        const { history } = get();
        const workout = history.find(h => h.id === id);
        if (!workout) return;

        const newSession: WorkoutSession = {
          id: uuidv4(),
          name: workout.name,
          startTime: Date.now(),
          status: 'active',
          exercises: workout.exercises.map(ex => ({
            id: uuidv4(),
            name: ex.name,
            muscleGroup: ex.muscleGroup,
            notes: ex.notes,
            // Preserve target fields if present
            targetSets: ex.targetSets,
            targetReps: ex.targetReps,
            restSeconds: ex.restSeconds,
            isWorking: ex.isWorking,
            // Preserve tracking mode and category
            trackingMode: ex.trackingMode ?? 'reps',
            category: ex.category,
            sets: ex.sets.map(s => ({
              id: uuidv4(),
              weight: s.weight,
              reps: s.reps,
              durationSeconds: s.durationSeconds ?? null,
              completed: false
            }))
          }))
        };

        set({ activeSession: newSession });
      },

      // Get personal records for each exercise (highest weight with valid reps)
      getPersonalRecords: () => {
        const { history } = get();
        const prs: Record<string, { weight: number; reps: number; date: number }> = {};

        history.forEach(session => {
          session.exercises.forEach(ex => {
            ex.sets.forEach(s => {
              if (!s.completed) return;
              const weight = Number(s.weight) || 0;
              const reps = Number(s.reps) || 0;
              if (weight <= 0 || reps <= 0) return;

              const key = ex.name.toLowerCase();
              if (!prs[key] || weight > prs[key].weight) {
                prs[key] = { weight, reps, date: session.startTime };
              }
            });
          });
        });

        return prs;
      }
    }),
    {
      name: 'liftlog_v1',
      merge: (persistedState, currentState) => {
        // If no persisted state exists yet, use currentState (includes DEFAULT_TEMPLATES)
        const persisted = (persistedState ?? {}) as any;

        // Only seed defaults when the templates key is missing (not when it's an intentional empty array)
        if (persisted.templates === undefined) {
          persisted.templates = currentState.templates;
        }

        // Migrate old data: add trackingMode and durationSeconds to exercises
        if (persisted.history && Array.isArray(persisted.history)) {
          persisted.history = persisted.history.map((session: any) => {
            if (session.exercises && Array.isArray(session.exercises)) {
              session.exercises = session.exercises.map((ex: any) => {
                // Add trackingMode if missing (default to 'reps')
                if (!ex.trackingMode) {
                  ex.trackingMode = 'reps';
                }
                // Add durationSeconds to sets if missing
                if (ex.sets && Array.isArray(ex.sets)) {
                  ex.sets = ex.sets.map((s: any) => {
                    if (s.durationSeconds === undefined) {
                      s.durationSeconds = null;
                    }
                    // Ensure reps and weight can be null
                    if (s.reps === undefined) s.reps = s.reps ?? '';
                    if (s.weight === undefined) s.weight = s.weight ?? '';
                    return s;
                  });
                }
                return ex;
              });
            }
            return session;
          });
        }

        // Migrate activeSession if it exists
        if (persisted.activeSession && persisted.activeSession.exercises) {
          persisted.activeSession.exercises = persisted.activeSession.exercises.map((ex: any) => {
            if (!ex.trackingMode) {
              ex.trackingMode = 'reps';
            }
            if (ex.sets && Array.isArray(ex.sets)) {
              ex.sets = ex.sets.map((s: any) => {
                if (s.durationSeconds === undefined) {
                  s.durationSeconds = null;
                }
                if (s.reps === undefined) s.reps = s.reps ?? '';
                if (s.weight === undefined) s.weight = s.weight ?? '';
                return s;
              });
            }
            return ex;
          });
        }

        return { ...currentState, ...persisted };
      },
      onRehydrateStorage: () => (state) => {
        // Sync theme
        if (state?.settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  )
);
