import { ExerciseDbItem } from '../models/types';

let cachedDb: ExerciseDbItem[] | null = null;

export async function loadExerciseDb(): Promise<ExerciseDbItem[]> {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const response = await fetch('/exercises.db.json');
    if (!response.ok) {
      throw new Error(`Failed to load exercise database: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Exercise database is not an array');
    }

    cachedDb = data;
    return cachedDb;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Exercise database not found. Please run "npm run build:exercise-db" to generate it.'
      );
    }
    throw error;
  }
}
