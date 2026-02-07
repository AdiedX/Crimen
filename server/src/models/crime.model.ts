import { Schema, model, type InferSchemaType } from 'mongoose';

const CRIME_TYPES = [
  'FELONY ASSAULT',
  'GRAND LARCENY',
  'GRAND LARCENY OF MOTOR VEHICLE',
  'BURGLARY',
  'ROBBERY',
  'MURDER',
  'RAPE',
] as const;

const crimeSchema = new Schema({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  type: { type: String, required: true, enum: CRIME_TYPES, index: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
});

crimeSchema.index({ latitude: 1, longitude: 1 });

export type ICrime = InferSchemaType<typeof crimeSchema>;
export const Crime = model('Crime', crimeSchema);
