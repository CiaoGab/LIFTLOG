import { WorkoutSession, BodyWeightEntry } from '../models/types';

// Get date as YYYY-MM-DD
const toDateISO = (timestamp: number): string => {
  return new Date(timestamp).toISOString().split('T')[0];
};

// Get start of week (Monday) for a given date
const getWeekStart = (dateISO: string): string => {
  const date = new Date(dateISO + 'T00:00:00');
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Summary stats for last N weeks
export interface SummaryStats {
  workoutsCompleted: number;
  totalSetsCompleted: number;
  totalVolume: number;
  avgWorkoutsPerWeek: number;
}

export const computeSummaryStats = (
  history: WorkoutSession[],
  weeks: number = 4
): SummaryStats => {
  const now = Date.now();
  const cutoff = now - weeks * 7 * 24 * 60 * 60 * 1000;

  const recentWorkouts = history.filter(s => s.startTime >= cutoff && s.status === 'completed');
  
  let totalSetsCompleted = 0;
  let totalVolume = 0;

  recentWorkouts.forEach(session => {
    session.exercises.forEach(ex => {
      // Only count reps-based sets
      if (ex.trackingMode === 'time') return;
      
      ex.sets.forEach(set => {
        if (set.completed) {
          totalSetsCompleted++;
          const weight = Number(set.weight) || 0;
          const reps = Number(set.reps) || 0;
          if (weight > 0 && reps > 0) {
            totalVolume += weight * reps;
          }
        }
      });
    });
  });

  const workoutsCompleted = recentWorkouts.length;
  const avgWorkoutsPerWeek = weeks > 0 ? workoutsCompleted / weeks : 0;

  return {
    workoutsCompleted,
    totalSetsCompleted,
    totalVolume,
    avgWorkoutsPerWeek,
  };
};

// Weekly volume trend
export interface WeeklyVolumeData {
  weekStartISO: string;
  volume: number;
}

export const computeWeeklyVolumeTrend = (
  history: WorkoutSession[],
  weeks: number = 12
): WeeklyVolumeData[] => {
  const now = Date.now();
  const cutoff = now - weeks * 7 * 24 * 60 * 60 * 1000;

  const recentWorkouts = history.filter(
    s => s.startTime >= cutoff && s.status === 'completed'
  );

  // Group by week
  const weekMap = new Map<string, number>();

  recentWorkouts.forEach(session => {
    const dateISO = toDateISO(session.startTime);
    const weekStart = getWeekStart(dateISO);
    
    session.exercises.forEach(ex => {
      // Only count reps-based sets
      if (ex.trackingMode === 'time') return;
      
      ex.sets.forEach(set => {
        if (set.completed) {
          const weight = Number(set.weight) || 0;
          const reps = Number(set.reps) || 0;
          if (weight > 0 && reps > 0) {
            const current = weekMap.get(weekStart) || 0;
            weekMap.set(weekStart, current + weight * reps);
          }
        }
      });
    });
  });

  // Convert to array and sort
  return Array.from(weekMap.entries())
    .map(([weekStartISO, volume]) => ({ weekStartISO, volume }))
    .sort((a, b) => a.weekStartISO.localeCompare(b.weekStartISO));
};

// Bodyweight trend
export interface BodyweightData {
  dateISO: string;
  weight: number;
}

export const computeBodyweightTrend = (
  bodyweight: BodyWeightEntry[],
  weeks: number = 12
): BodyweightData[] => {
  if (weeks === 0) {
    // Return all entries
    return bodyweight
      .map(entry => ({ dateISO: entry.dateISO, weight: entry.weight }))
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  }

  const now = Date.now();
  const cutoff = now - weeks * 7 * 24 * 60 * 60 * 1000;
  const cutoffISO = toDateISO(cutoff);

  return bodyweight
    .filter(entry => entry.dateISO >= cutoffISO)
    .map(entry => ({ dateISO: entry.dateISO, weight: entry.weight }))
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
};

// Exercise performance trend
export interface ExercisePerformanceData {
  dateISO: string;
  topSetWeight: number;
}

export const computeExercisePerformance = (
  history: WorkoutSession[],
  exerciseName: string
): ExercisePerformanceData[] => {
  const completedWorkouts = history.filter(s => s.status === 'completed');
  
  // Group by date
  const dateMap = new Map<string, number>();

  completedWorkouts.forEach(session => {
    const dateISO = toDateISO(session.startTime);
    
    session.exercises.forEach(ex => {
      if (ex.name.toLowerCase() !== exerciseName.toLowerCase()) return;
      // Only count reps-based sets
      if (ex.trackingMode === 'time') return;

      let maxWeight = 0;
      ex.sets.forEach(set => {
        if (set.completed) {
          const weight = Number(set.weight) || 0;
          const reps = Number(set.reps) || 0;
          if (weight > 0 && reps > 0) {
            maxWeight = Math.max(maxWeight, weight);
          }
        }
      });

      if (maxWeight > 0) {
        const current = dateMap.get(dateISO) || 0;
        dateMap.set(dateISO, Math.max(current, maxWeight));
      }
    });
  });

  return Array.from(dateMap.entries())
    .map(([dateISO, topSetWeight]) => ({ dateISO, topSetWeight }))
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
};

// Get unique exercise names from history
export const getUniqueExerciseNames = (history: WorkoutSession[]): string[] => {
  const names = new Set<string>();
  
  history.forEach(session => {
    if (session.status !== 'completed') return;
    session.exercises.forEach(ex => {
      // Only include reps-based exercises
      if (ex.trackingMode === 'reps') {
        names.add(ex.name);
      }
    });
  });

  return Array.from(names).sort();
};
