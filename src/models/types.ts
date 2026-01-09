export interface Set {
  id: string;
  reps: number | string | null;
  weight: number | string | null;
  durationSeconds: number | null;
  rpe?: number | string;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: Set[];
  notes?: string;
  // Target fields (from template, informational only)
  targetSets?: number;
  targetReps?: string;
  restSeconds?: number;
  isWorking?: boolean; // true = working set, false = warm-up/ramp-up
  // Tracking mode: "reps" for rep-based exercises, "time" for time-based (cardio)
  trackingMode: 'reps' | 'time';
  // Category from exercise database (e.g., "cardio")
  category?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  startTime: number; // timestamp
  endTime?: number; // timestamp
  exercises: Exercise[];
  status: 'active' | 'completed';
}

export interface TemplateExercise {
  id: string;
  name: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: string;
  restSeconds?: number;
  isWorkingDefault?: boolean; // true = working set by default, false = warm-up/ramp-up
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  lastPerformed?: number;
  exercises: TemplateExercise[];
  tags?: string[];
}

export interface Settings {
  theme: 'light' | 'dark';
  units: 'kg' | 'lb';
}

export interface BodyWeightEntry {
  id: string;
  dateISO: string; // "YYYY-MM-DD"
  weight: number;
  unit: 'lb' | 'kg';
  note?: string;
}

export interface ExerciseDbItem {
  id: string | null;
  name: string;
  category: string;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  level: string | null;
  force: string | null;
  mechanic: string | null;
}

export interface AppState {
  activeSession: WorkoutSession | null;
  history: WorkoutSession[];
  templates: Template[];
  settings: Settings;
  bodyweight: BodyWeightEntry[];
  // Workout actions
  startWorkout: (templateId?: string) => void;
  finishWorkout: () => { success: boolean; error?: string };
  cancelWorkout: () => void;
  addExerciseToSession: (name: string, muscleGroup: string, category?: string) => void;
  removeExercise: (exerciseId: string) => void;
  toggleTrackingMode: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<Set>) => void;
  addSet: (exerciseId: string) => void;
  copyLastSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  // Template actions
  createTemplate: (template: Omit<Template, 'id'>) => string;
  updateTemplate: (id: string, updates: Partial<Omit<Template, 'id'>>) => void;
  deleteTemplate: (id: string) => void;
  // Settings actions
  toggleTheme: () => void;
  toggleUnits: () => void;
  // History actions
  deleteHistoryItem: (id: string) => void;
  duplicateWorkout: (id: string) => void;
  getPersonalRecords: () => Record<string, { weight: number; reps: number; date: number }>;
  // Bodyweight actions
  addBodyWeightEntry: (entry: Omit<BodyWeightEntry, 'id'>) => void;
  updateBodyWeightEntry: (id: string, updates: Partial<Omit<BodyWeightEntry, 'id'>>) => void;
  deleteBodyWeightEntry: (id: string) => void;
}
