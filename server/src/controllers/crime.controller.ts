import type { Request, Response } from 'express';
import type { FilterQuery } from 'mongoose';
import { Crime } from '../models/crime.model.js';
import {
  crimesQuerySchema,
  statsQuerySchema,
} from '../validation/crime.validation.js';

// ---------------------------------------------------------------------------
// Historical yearly totals (2000-2013) — pre-compiled reference data.
// The MongoDB collection holds individual 2014 incident records.
// This data came from the original AngularJS CrimeCtrl and is served from the
// backend so the client doesn't need to hardcode it.
// ---------------------------------------------------------------------------
const YEARLY_TOTALS: Record<
  string,
  { title: string; name: string; data: number[] }
> = {
  BURGLARY: {
    title: 'Burglaries (2000 - 2013)',
    name: 'BURGLARIES',
    data: [38352, 32763, 31275, 29110, 26976, 24117, 23143, 21762, 20725, 19430, 18600, 18720, 19168, 17429],
  },
  MURDER: {
    title: 'Murders (2000 - 2013)',
    name: 'MURDERS',
    data: [673, 649, 587, 597, 570, 539, 596, 496, 523, 471, 536, 515, 419, 335],
  },
  'FELONY ASSAULT': {
    title: 'Felony Assaults (2000 - 2013)',
    name: 'FELONY ASSAULTS',
    data: [25924, 23453, 21147, 19139, 18622, 17750, 17309, 17493, 16284, 16773, 16956, 18482, 19381, 20297],
  },
  RAPE: {
    title: 'Rapes (2000 - 2013)',
    name: 'RAPES',
    data: [2068, 1981, 2144, 2070, 1905, 1858, 1525, 1351, 1299, 1205, 1373, 1420, 1445, 1378],
  },
  ROBBERY: {
    title: 'Robberies (2000 - 2013)',
    name: 'ROBBERIES',
    data: [32562, 28202, 27229, 25989, 24373, 24722, 23739, 21809, 22401, 18601, 19486, 19717, 20144, 19128],
  },
  'GRAND LARCENY': {
    title: 'Grand Larcenies (2000 - 2013)',
    name: 'GRAND LARCENIES',
    data: [49631, 46329, 45771, 46751, 48763, 48243, 46625, 44924, 44242, 39580, 37835, 38501, 42497, 45368],
  },
  'GRAND LARCENY OF MOTOR VEHICLE': {
    title: 'Grand Larcenies of Motor Vehicles (2000 - 2013)',
    name: 'GRAND LARCENIES OF MOTOR VEHICLES',
    data: [35442, 29531, 26656, 23413, 20884, 18246, 15745, 13174, 12482, 10670, 10329, 9314, 8093, 7400],
  },
};

const YEARLY_TOTALS_YEARS = Array.from({ length: 14 }, (_, i) => 2000 + i);

// ---------------------------------------------------------------------------
// GET /api/getCrimeData  (legacy — backward-compatible with AngularJS app)
// ---------------------------------------------------------------------------
export async function getCrimeData(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const crimes = await Crime.find().limit(2000).lean({ virtuals: true });
    const output = crimes.map((c) => ({
      id: c._id,
      latitude: c.location!.coordinates[1],
      longitude: c.location!.coordinates[0],
      type: c.crimeType,
      month: c.month,
      year: c.year,
    }));
    res.json(output);
  } catch (err) {
    console.error('Error fetching crime data:', err);
    res.status(500).json({ error: 'Failed to fetch crime data' });
  }
}

// ---------------------------------------------------------------------------
// GET /api/crimes  — paginated, filterable, bounding-box–aware
// ---------------------------------------------------------------------------
export async function getCrimes(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = crimesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid query parameters',
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { page, limit, swLat, swLng, neLat, neLng, type, year, month } =
    parsed.data;

  try {
    const filter: FilterQuery<typeof Crime> = {};

    // Bounding-box filter via $geoWithin
    if (
      swLat !== undefined &&
      swLng !== undefined &&
      neLat !== undefined &&
      neLng !== undefined
    ) {
      filter.location = {
        $geoWithin: {
          $box: [
            [swLng, swLat], // bottom-left  [lng, lat]
            [neLng, neLat], // top-right    [lng, lat]
          ],
        },
      };
    }

    if (type) filter.crimeType = type;
    if (year) filter.year = year;
    if (month) filter.month = month;

    const skip = (page - 1) * limit;

    const [crimes, total] = await Promise.all([
      Crime.find(filter).skip(skip).limit(limit).lean({ virtuals: true }),
      Crime.countDocuments(filter),
    ]);

    const items = crimes.map((c) => ({
      id: c._id,
      latitude: c.location!.coordinates[1],
      longitude: c.location!.coordinates[0],
      type: c.crimeType,
      month: c.month,
      year: c.year,
    }));

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching crimes:', err);
    res.status(500).json({ error: 'Failed to fetch crimes' });
  }
}

// ---------------------------------------------------------------------------
// GET /api/crimes/stats  — aggregate counts from the DB (per type + year)
// ---------------------------------------------------------------------------
export async function getCrimeStats(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = statsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid query parameters',
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const matchStage: Record<string, unknown> = {};
    if (parsed.data.type) matchStage.crimeType = parsed.data.type;

    const pipeline = [
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: { type: '$crimeType', year: '$year' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.type': 1 as const, '_id.year': 1 as const } },
    ];

    const stats = await Crime.aggregate(pipeline);

    // Reshape into { type, title, name, data: [{ year, count }] }
    const grouped: Record<string, { year: number; count: number }[]> = {};
    for (const row of stats) {
      const t = row._id.type as string;
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push({ year: row._id.year, count: row.count });
    }

    const result = Object.entries(grouped).map(([t, data]) => {
      const sorted = data.sort((a, b) => a.year - b.year);
      return {
        type: t,
        name: t,
        title: `${t} (${sorted[0]?.year} - ${sorted[sorted.length - 1]?.year})`,
        data: sorted,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching crime stats:', err);
    res.status(500).json({ error: 'Failed to fetch crime stats' });
  }
}

// ---------------------------------------------------------------------------
// GET /api/crimes/yearly-totals  — pre-compiled historical data (2000-2013)
// Serves the data that was previously hardcoded in the AngularJS CrimeCtrl.
// ---------------------------------------------------------------------------
export function getYearlyTotals(
  _req: Request,
  res: Response,
): void {
  const result = Object.entries(YEARLY_TOTALS).map(([type, entry]) => ({
    type,
    name: entry.name,
    title: entry.title,
    years: YEARLY_TOTALS_YEARS,
    data: entry.data,
  }));
  res.json(result);
}
