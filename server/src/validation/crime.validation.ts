import { z } from 'zod';
import { CRIME_TYPES } from '../models/crime.model.js';

/**
 * GET /api/crimes query parameters
 */
export const crimesQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(100),

  // Bounding box (all four required together, or none)
  swLat: z.coerce.number().min(-90).max(90).optional(),
  swLng: z.coerce.number().min(-180).max(180).optional(),
  neLat: z.coerce.number().min(-90).max(90).optional(),
  neLng: z.coerce.number().min(-180).max(180).optional(),

  // Filters
  type: z.enum(CRIME_TYPES).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
}).refine(
  (data) => {
    const bbox = [data.swLat, data.swLng, data.neLat, data.neLng];
    const provided = bbox.filter((v) => v !== undefined).length;
    return provided === 0 || provided === 4;
  },
  { message: 'Bounding box requires all four params: swLat, swLng, neLat, neLng' }
);

export type CrimesQuery = z.infer<typeof crimesQuerySchema>;

/**
 * GET /api/crimes/stats query parameters
 */
export const statsQuerySchema = z.object({
  type: z.enum(CRIME_TYPES).optional(),
});

export type StatsQuery = z.infer<typeof statsQuerySchema>;
