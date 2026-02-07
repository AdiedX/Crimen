import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config/env.js';
import { Crime } from './models/crime.model.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BATCH_SIZE = 5000;

async function seed(): Promise<void> {
  await mongoose.connect(config.mongo.uri);
  console.log('Connected to MongoDB');

  const dataPath = resolve(__dirname, '../../mongoexports/crimes.json');
  const raw = readFileSync(dataPath, 'utf-8');

  // File is newline-delimited JSON (one document per line)
  const docs = raw
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const obj = JSON.parse(line);
      return {
        location: {
          type: 'Point' as const,
          coordinates: [obj.longitude, obj.latitude], // GeoJSON: [lng, lat]
        },
        crimeType: obj.type,
        month: obj.month,
        year: obj.year,
      };
    });

  console.log(`Parsed ${docs.length} crime records`);

  await Crime.deleteMany({});
  console.log('Cleared existing crime data');

  // Insert in batches to avoid memory pressure on large datasets
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    await Crime.insertMany(batch);
    console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${Math.min(i + BATCH_SIZE, docs.length)}/${docs.length})`);
  }

  // Ensure indexes are built
  await Crime.ensureIndexes();
  console.log('Indexes built');

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
