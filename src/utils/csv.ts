import { WorkoutSession } from '../models/types';

// Escape CSV field (handle commas, quotes, newlines)
const escapeField = (value: string | number | boolean | undefined): string => {
  if (value === undefined || value === null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Convert array of objects to CSV string
const toCSV = (headers: string[], rows: (string | number | boolean | undefined)[][]): string => {
  const headerLine = headers.map(escapeField).join(',');
  const dataLines = rows.map(row => row.map(escapeField).join(','));
  return [headerLine, ...dataLines].join('\n');
};

// Download a string as a file
const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Filter history by date range
export const filterByDateRange = (
  history: WorkoutSession[],
  startDate?: Date,
  endDate?: Date
): WorkoutSession[] => {
  return history.filter(session => {
    const sessionDate = new Date(session.startTime);
    if (startDate && sessionDate < startDate) return false;
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (sessionDate > endOfDay) return false;
    }
    return true;
  });
};

// Generate workouts.csv
export const generateWorkoutsCSV = (history: WorkoutSession[]): string => {
  const headers = ['workout_id', 'name', 'date', 'start_time', 'end_time', 'duration_min', 'exercise_count', 'total_sets', 'total_volume'];
  
  const rows = history.map(session => {
    const duration = session.endTime 
      ? Math.round((session.endTime - session.startTime) / 60000) 
      : 0;
    const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
    const totalVolume = session.exercises.reduce(
      (acc, ex) =>
        acc +
        ex.sets.reduce(
          (sAcc, s) => {
            if (!s.completed) return sAcc;
            // For time-based sets, skip volume calculation
            if (ex.trackingMode === 'time') return sAcc;
            return sAcc + (Number(s.weight) * Number(s.reps) || 0);
          },
          0
        ),
      0
    );

    return [
      session.id,
      session.name,
      new Date(session.startTime).toISOString().split('T')[0],
      new Date(session.startTime).toISOString(),
      session.endTime ? new Date(session.endTime).toISOString() : '',
      duration,
      session.exercises.length,
      totalSets,
      totalVolume
    ];
  });

  return toCSV(headers, rows);
};

// Generate exercises.csv
export const generateExercisesCSV = (history: WorkoutSession[]): string => {
  const headers = ['exercise_id', 'workout_id', 'workout_date', 'name', 'muscle_group', 'set_count', 'completed_sets', 'volume', 'notes'];
  
  const rows: (string | number | boolean | undefined)[][] = [];
  
  history.forEach(session => {
    const workoutDate = new Date(session.startTime).toISOString().split('T')[0];
    
    session.exercises.forEach(ex => {
      const completedSets = ex.sets.filter(s => s.completed).length;
      const volume = ex.sets.reduce(
        (acc, s) => {
          if (!s.completed) return acc;
          // For time-based sets, skip volume calculation
          if (ex.trackingMode === 'time') return acc;
          return acc + (Number(s.weight) * Number(s.reps) || 0);
        },
        0
      );
      
      rows.push([
        ex.id,
        session.id,
        workoutDate,
        ex.name,
        ex.muscleGroup,
        ex.sets.length,
        completedSets,
        volume,
        ex.notes || ''
      ]);
    });
  });

  return toCSV(headers, rows);
};

// Generate sets.csv
export const generateSetsCSV = (history: WorkoutSession[]): string => {
  const headers = ['set_id', 'exercise_id', 'workout_id', 'workout_date', 'exercise_name', 'set_number', 'weight', 'reps', 'duration_seconds', 'rpe', 'completed'];
  
  const rows: (string | number | boolean | undefined)[][] = [];
  
  history.forEach(session => {
    const workoutDate = new Date(session.startTime).toISOString().split('T')[0];
    
    session.exercises.forEach(ex => {
      ex.sets.forEach((set, idx) => {
        rows.push([
          set.id,
          ex.id,
          session.id,
          workoutDate,
          ex.name,
          idx + 1,
          set.weight,
          set.reps,
          set.durationSeconds ?? '',
          set.rpe || '',
          set.completed
        ]);
      });
    });
  });

  return toCSV(headers, rows);
};

// Download individual file
export const downloadWorkoutsCSV = (history: WorkoutSession[]) => {
  if (history.length === 0) {
    // No workouts to export - silent fail (Export page shows stats)
    return;
  }
  downloadFile(generateWorkoutsCSV(history), 'workouts.csv');
};

export const downloadExercisesCSV = (history: WorkoutSession[]) => {
  if (history.length === 0) {
    // No workouts to export - silent fail
    return;
  }
  downloadFile(generateExercisesCSV(history), 'exercises.csv');
};

export const downloadSetsCSV = (history: WorkoutSession[]) => {
  if (history.length === 0) {
    // No workouts to export - silent fail
    return;
  }
  downloadFile(generateSetsCSV(history), 'sets.csv');
};

// Download all files
export const downloadAllCSV = (history: WorkoutSession[]) => {
  if (history.length === 0) {
    // No workouts to export - silent fail
    return;
  }
  
  // Download with slight delays to ensure browser handles multiple downloads
  downloadFile(generateWorkoutsCSV(history), 'workouts.csv');
  setTimeout(() => downloadFile(generateExercisesCSV(history), 'exercises.csv'), 100);
  setTimeout(() => downloadFile(generateSetsCSV(history), 'sets.csv'), 200);
};

// Legacy single-file export (kept for compatibility)
export const generateCSV = (history: WorkoutSession[]) => {
  downloadAllCSV(history);
};
