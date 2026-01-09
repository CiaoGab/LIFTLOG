import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, 'source', 'free-exercise-db', 'dist', 'exercises.json');
const outputPath = join(__dirname, '..', 'public', 'exercises.db.json');

try {
  console.log('Reading exercises from:', inputPath);
  const rawData = readFileSync(inputPath, 'utf-8');
  const exercises = JSON.parse(rawData);

  if (!Array.isArray(exercises)) {
    throw new Error('Expected exercises.json to be an array');
  }

  console.log(`Processing ${exercises.length} exercises...`);

  const cleaned = exercises.map(ex => {
    // Normalize fields
    const category = ex.category || 'unknown';
    const equipment = ex.equipment || null;
    const primaryMuscles = Array.isArray(ex.primaryMuscles) ? ex.primaryMuscles : [];
    const secondaryMuscles = Array.isArray(ex.secondaryMuscles) ? ex.secondaryMuscles : [];

    return {
      id: ex.id || null,
      name: ex.name || '',
      category: category,
      equipment: equipment,
      primaryMuscles: primaryMuscles,
      secondaryMuscles: secondaryMuscles,
      level: ex.level || null,
      force: ex.force || null,
      mechanic: ex.mechanic || null
    };
  }).filter(ex => ex.name); // Remove exercises without names

  // Ensure output directory exists
  const outputDir = dirname(outputPath);
  mkdirSync(outputDir, { recursive: true });

  // Write output
  writeFileSync(outputPath, JSON.stringify(cleaned, null, 2), 'utf-8');

  console.log(`✓ Successfully wrote ${cleaned.length} exercises to: ${outputPath}`);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Error: Input file not found.');
    console.error(`Expected location: ${inputPath}`);
    console.error('\nPlease:');
    console.error('1. Clone or download https://github.com/yuhonas/free-exercise-db');
    console.error('2. Place exercises.json at:', inputPath);
    console.error('3. Run this script again.');
    process.exit(1);
  }
  console.error('Error processing exercises:', error.message);
  process.exit(1);
}
