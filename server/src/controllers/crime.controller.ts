import type { Request, Response } from 'express';
import { Crime } from '../models/crime.model.js';

/**
 * GET /api/getCrimeData
 * Legacy-compatible endpoint — returns up to 2000 crime records.
 * Phase 1 will add pagination and bounding-box filtering.
 */
export async function getCrimeData(_req: Request, res: Response): Promise<void> {
  try {
    const crimes = await Crime.find().limit(2000).lean();
    const output = crimes.map((c) => ({
      id: c._id,
      latitude: c.latitude,
      longitude: c.longitude,
      type: c.type,
      month: c.month,
      year: c.year,
    }));
    res.json(output);
  } catch (err) {
    console.error('Error fetching crime data:', err);
    res.status(500).json({ error: 'Failed to fetch crime data' });
  }
}

/**
 * GET /api/crimes/stats
 * Aggregated yearly stats — replaces the hardcoded chartObject in the legacy CrimeCtrl.
 * Phase 1 will flesh this out with a proper MongoDB aggregation pipeline.
 */
export async function getCrimeStats(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await Crime.aggregate([
      {
        $group: {
          _id: { type: '$type', year: '$year' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.type': 1, '_id.year': 1 } },
    ]);

    // Reshape into { type, title, name, data: [{ year, count }] }
    const grouped: Record<string, { year: number; count: number }[]> = {};
    for (const row of stats) {
      const type = row._id.type as string;
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push({ year: row._id.year, count: row.count });
    }

    const result = Object.entries(grouped).map(([type, data]) => ({
      type,
      name: type,
      title: `${type} (${data[0]?.year} - ${data[data.length - 1]?.year})`,
      data: data.sort((a, b) => a.year - b.year),
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching crime stats:', err);
    res.status(500).json({ error: 'Failed to fetch crime stats' });
  }
}
