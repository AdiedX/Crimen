import { Schema, model, type InferSchemaType } from 'mongoose';

export const CRIME_TYPES = [
  'FELONY ASSAULT',
  'GRAND LARCENY',
  'GRAND LARCENY OF MOTOR VEHICLE',
  'BURGLARY',
  'ROBBERY',
  'MURDER',
  'RAPE',
] as const;

export type CrimeType = (typeof CRIME_TYPES)[number];

const crimeSchema = new Schema({
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  crimeType: { type: String, required: true, enum: CRIME_TYPES, index: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true, index: true },
});

// 2dsphere index for geospatial bounding-box / near queries
crimeSchema.index({ location: '2dsphere' });

// Compound index for common query patterns
crimeSchema.index({ crimeType: 1, year: 1 });

// Virtual getters for backward-compatible latitude/longitude access
crimeSchema.virtual('latitude').get(function () {
  return this.location?.coordinates?.[1];
});
crimeSchema.virtual('longitude').get(function () {
  return this.location?.coordinates?.[0];
});

crimeSchema.set('toJSON', { virtuals: true });
crimeSchema.set('toObject', { virtuals: true });

export type ICrime = InferSchemaType<typeof crimeSchema>;
export const Crime = model('Crime', crimeSchema);
