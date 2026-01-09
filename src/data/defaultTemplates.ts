import { Template } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Helper to infer muscle group from exercise name
const inferMuscleGroup = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('chest') || lower.includes('press') || lower.includes('fly') || lower.includes('push')) return 'Chest';
  if (lower.includes('row') || lower.includes('pull') || lower.includes('lat') || lower.includes('back')) return 'Back';
  if (lower.includes('shoulder') || lower.includes('delt') || lower.includes('lateral') || lower.includes('rear')) return 'Shoulders';
  if (lower.includes('curl') || lower.includes('bicep')) return 'Biceps';
  if (lower.includes('tricep') || lower.includes('extension') || lower.includes('pressdown')) return 'Triceps';
  if (lower.includes('squat') || lower.includes('leg press') || lower.includes('quad')) return 'Legs';
  if (lower.includes('deadlift') || lower.includes('rdl') || lower.includes('hip thrust') || lower.includes('glute') || lower.includes('hamstring')) return 'Legs';
  if (lower.includes('calf') || lower.includes('tib')) return 'Legs';
  if (lower.includes('core') || lower.includes('plank') || lower.includes('bug') || lower.includes('pallof')) return 'Core';
  if (lower.includes('elliptical') || lower.includes('sled') || lower.includes('prowler') || lower.includes('treadmill')) return 'Cardio';
  return 'Other';
};

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'upper-a',
    name: 'Upper A',
    description: 'Incline push + vertical pull + row. Low shoulder irritation volume.',
    exercises: [
      { id: uuidv4(), name: 'Plate-Loaded Incline Chest Press', muscleGroup: 'Chest', targetSets: 4, targetReps: '6-10', restSeconds: 120, isWorkingDefault: true },
      { id: uuidv4(), name: 'Lat Pulldown (Neutral or Supinated)', muscleGroup: 'Back', targetSets: 4, targetReps: '8-12', restSeconds: 90, isWorkingDefault: true },
      { id: uuidv4(), name: 'Chest-Supported Row (Machine or DB)', muscleGroup: 'Back', targetSets: 3, targetReps: '8-12', restSeconds: 90, isWorkingDefault: true },
      { id: uuidv4(), name: 'Cable Lateral Raise (Lean-away optional)', muscleGroup: 'Shoulders', targetSets: 2, targetReps: '12-20', restSeconds: 60, isWorkingDefault: true },
      { id: uuidv4(), name: 'Cable Triceps Pressdown (Rope)', muscleGroup: 'Triceps', targetSets: 3, targetReps: '10-15', restSeconds: 60, isWorkingDefault: true },
      { id: uuidv4(), name: 'Cable Curl (Straight or Rope)', muscleGroup: 'Biceps', targetSets: 3, targetReps: '10-15', restSeconds: 60, isWorkingDefault: true },
    ],
  },
  {
    id: 'lower-a',
    name: 'Lower A',
    description: 'Glute/hinge dominant + tib/calf + optional sled (knee-friendly).',
    exercises: [
      { id: uuidv4(), name: 'Hip Thrust (Barbell or Machine)', muscleGroup: 'Legs', targetSets: 4, targetReps: '8-12', restSeconds: 120, isWorkingDefault: true },
      { id: uuidv4(), name: 'Romanian Deadlift (DB or Barbell)', muscleGroup: 'Legs', targetSets: 4, targetReps: '6-10', restSeconds: 120, isWorkingDefault: true },
      { id: uuidv4(), name: 'Hamstring Curl (Seated/Lying) OR BOSU Ham Curl', muscleGroup: 'Legs', targetSets: 3, targetReps: '10-15', restSeconds: 75, isWorkingDefault: true },
      { id: uuidv4(), name: 'Standing Calf Raise (Machine or DB)', muscleGroup: 'Legs', targetSets: 4, targetReps: '10-15', restSeconds: 60, isWorkingDefault: true },
      { id: uuidv4(), name: 'Wall Tib Raises (or Tib Bar)', muscleGroup: 'Legs', targetSets: 3, targetReps: '15-25', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Sled Drags / Prowler Push (or Incline Treadmill Walk)', muscleGroup: 'Cardio', targetSets: 6, targetReps: '20-40m or 30-60s', restSeconds: 60, isWorkingDefault: true },
    ],
  },
  {
    id: 'conditioning',
    name: 'Conditioning',
    description: 'Zone 2 elliptical + core/mobility. Keep it easy/moderate.',
    exercises: [
      { id: uuidv4(), name: 'Elliptical Zone 2', muscleGroup: 'Cardio', targetSets: 1, targetReps: '30-45 min', restSeconds: 0, isWorkingDefault: true },
      { id: uuidv4(), name: 'Dead Bug', muscleGroup: 'Core', targetSets: 3, targetReps: '8-12/side', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Pallof Press (Cable)', muscleGroup: 'Core', targetSets: 3, targetReps: '10-12/side', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Side Plank', muscleGroup: 'Core', targetSets: 2, targetReps: '30-45s/side', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Hip Flexor + Calf Mobility (quick flow)', muscleGroup: 'Other', targetSets: 1, targetReps: '5-8 min', restSeconds: 0, isWorkingDefault: true },
    ],
  },
  {
    id: 'upper-b',
    name: 'Upper B',
    description: 'Flat push + row emphasis + rear delts. No extra shoulder pressing.',
    exercises: [
      { id: uuidv4(), name: 'Plate-Loaded Chest Press (Flat/Neutral Grip)', muscleGroup: 'Chest', targetSets: 4, targetReps: '6-10', restSeconds: 120, isWorkingDefault: true },
      { id: uuidv4(), name: 'Seated Cable Row (Neutral)', muscleGroup: 'Back', targetSets: 4, targetReps: '8-12', restSeconds: 90, isWorkingDefault: true },
      { id: uuidv4(), name: 'Assisted Pull-Up OR Pulldown (Wide/Neutral)', muscleGroup: 'Back', targetSets: 3, targetReps: '6-10', restSeconds: 120, isWorkingDefault: true },
      { id: uuidv4(), name: 'Cable Rear Delt Fly (Reverse Fly)', muscleGroup: 'Shoulders', targetSets: 3, targetReps: '12-20', restSeconds: 60, isWorkingDefault: true },
      { id: uuidv4(), name: 'Incline DB Curl (or Cable Curl)', muscleGroup: 'Biceps', targetSets: 3, targetReps: '10-15', restSeconds: 60, isWorkingDefault: true },
      { id: uuidv4(), name: 'Overhead Triceps Extension (Cable, light)', muscleGroup: 'Triceps', targetSets: 2, targetReps: '12-15', restSeconds: 60, isWorkingDefault: true },
    ],
  },
  {
    id: 'lower-b',
    name: 'Lower B',
    description: 'Hinge + controlled quad pattern (pain-free range) + calves/tibs.',
    exercises: [
      { id: uuidv4(), name: 'Cable Pull-Through', muscleGroup: 'Legs', targetSets: 4, targetReps: '10-15', restSeconds: 90, isWorkingDefault: true },
      { id: uuidv4(), name: 'Leg Press (Feet High, Pain-Free ROM)', muscleGroup: 'Legs', targetSets: 3, targetReps: '8-12', restSeconds: 120, isWorkingDefault: true },
      { id: uuidv4(), name: 'Single-Leg RDL (DB, supported)', muscleGroup: 'Legs', targetSets: 3, targetReps: '8-10/side', restSeconds: 90, isWorkingDefault: true },
      { id: uuidv4(), name: 'Hamstring Curl (Seated/Lying) OR BOSU Ham Curl', muscleGroup: 'Legs', targetSets: 3, targetReps: '10-15', restSeconds: 75, isWorkingDefault: true },
      { id: uuidv4(), name: 'Standing Calf Raise (Machine or DB)', muscleGroup: 'Legs', targetSets: 4, targetReps: '10-15', restSeconds: 60, isWorkingDefault: true },
      { id: uuidv4(), name: 'Wall Tib Raises (or Tib Bar)', muscleGroup: 'Legs', targetSets: 3, targetReps: '15-25', restSeconds: 45, isWorkingDefault: true },
    ],
  },
  {
    id: 'pump-hiit',
    name: 'Pump + HIIT',
    description: 'Short pump work + elliptical intervals. Keep joint-friendly.',
    exercises: [
      { id: uuidv4(), name: 'Cable Row (Pump)', muscleGroup: 'Back', targetSets: 3, targetReps: '12-15', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Cable Chest Fly (Low-to-High or Pec Deck)', muscleGroup: 'Chest', targetSets: 3, targetReps: '12-15', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Rope Triceps Pressdown (Pump)', muscleGroup: 'Triceps', targetSets: 3, targetReps: '12-20', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Cable Curl (Pump)', muscleGroup: 'Biceps', targetSets: 3, targetReps: '12-20', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Leg Curl (Pump) OR Glute Bridge (Machine/DB)', muscleGroup: 'Legs', targetSets: 3, targetReps: '12-20', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Calf Raise (Pump)', muscleGroup: 'Legs', targetSets: 3, targetReps: '12-20', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Elliptical HIIT', muscleGroup: 'Cardio', targetSets: 1, targetReps: '10 rounds: 20s hard / 100s easy', restSeconds: 0, isWorkingDefault: true },
    ],
  },
  {
    id: 'home-lower-55',
    name: 'Home Lower (55s)',
    description: 'Home session using 55 lb DBs + BOSU ham curls + warm-up first.',
    exercises: [
      // Warm-up section (isWorkingDefault: false)
      { id: uuidv4(), name: 'Elliptical Warm-up', muscleGroup: 'Cardio', targetSets: 1, targetReps: '3 min', restSeconds: 0, isWorkingDefault: false },
      { id: uuidv4(), name: 'Wall Sit', muscleGroup: 'Legs', targetSets: 2, targetReps: '30-45s', restSeconds: 45, isWorkingDefault: false },
      { id: uuidv4(), name: 'Glute Bridge (Bodyweight)', muscleGroup: 'Legs', targetSets: 2, targetReps: '10', restSeconds: 30, isWorkingDefault: false },
      { id: uuidv4(), name: 'Bodyweight Hip Hinge', muscleGroup: 'Legs', targetSets: 2, targetReps: '10', restSeconds: 30, isWorkingDefault: false },
      { id: uuidv4(), name: 'Single-Leg RDL Reach (Bodyweight)', muscleGroup: 'Legs', targetSets: 1, targetReps: '6/side', restSeconds: 30, isWorkingDefault: false },
      { id: uuidv4(), name: 'Calf Raises (Bodyweight)', muscleGroup: 'Legs', targetSets: 1, targetReps: '15', restSeconds: 30, isWorkingDefault: false },
      { id: uuidv4(), name: 'Wall Tib Raises (Warm-up)', muscleGroup: 'Legs', targetSets: 1, targetReps: '15-20', restSeconds: 30, isWorkingDefault: false },
      { id: uuidv4(), name: 'DB RDL Ramp-up Sets', muscleGroup: 'Legs', targetSets: 3, targetReps: '8 / 6 / 3', restSeconds: 45, isWorkingDefault: false },
      
      // Weighted work (isWorkingDefault: true)
      { id: uuidv4(), name: 'DB Romanian Deadlift (2x55)', muscleGroup: 'Legs', targetSets: 4, targetReps: '8-12', restSeconds: 120, isWorkingDefault: true },
      { id: uuidv4(), name: 'DB Glute Bridge', muscleGroup: 'Legs', targetSets: 4, targetReps: '12-20', restSeconds: 90, isWorkingDefault: true },
      { id: uuidv4(), name: 'BOSU Hamstring Curls', muscleGroup: 'Legs', targetSets: 3, targetReps: '10-15', restSeconds: 75, isWorkingDefault: true },
      { id: uuidv4(), name: 'Standing DB Calf Raise (2x55 or 1x55)', muscleGroup: 'Legs', targetSets: 4, targetReps: '10-15', restSeconds: 60, isWorkingDefault: true },
      { id: uuidv4(), name: 'Wall Tib Raises', muscleGroup: 'Legs', targetSets: 3, targetReps: '15-25', restSeconds: 45, isWorkingDefault: true },
      { id: uuidv4(), name: 'Elliptical Zone 2 (Optional)', muscleGroup: 'Cardio', targetSets: 1, targetReps: '10-20 min', restSeconds: 0, isWorkingDefault: true },
    ],
  },
];

