import { Router } from 'express';
import {
  getCrimeData,
  getCrimes,
  getCrimeStats,
  getYearlyTotals,
} from '../controllers/crime.controller.js';

const router = Router();

// Legacy endpoint (backward-compatible with AngularJS app)
router.get('/getCrimeData', getCrimeData);

// Modern endpoints
router.get('/crimes', getCrimes);
router.get('/crimes/stats', getCrimeStats);
router.get('/crimes/yearly-totals', getYearlyTotals);

export default router;
