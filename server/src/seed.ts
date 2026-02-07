import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config/env.js';
import { Crime } from './models/crime.model.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function seed(): Promise<void> {
  await mongoose.connect(config.mongo.uri);
  console.log('Connected to MongoDB');

  const dataPath = resolve(__dirname, '../../mongoexports/crimes.json');
  const raw = readFileSync(dataPath, 'utf-8');

  // The file is newline-delimited JSON (one document per line)
  const docs = raw
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const obj = JSON.parse(line);
      return {
        longitude: obj.longitude,
        latitude: obj.latitude,
        type: obj.type,
        month: obj.month,
        year: obj.year,
      };
    });

  console.log(`Parsed ${docs.length} crime records`);

  await Crime.deleteMany({});
  console.log('Cleared existing crime data');

  await Crime.insertMany(docs);
  console.log(`Inserted ${docs.length} records`);

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
