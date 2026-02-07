import { Router } from 'express';
import { getCrimeData, getCrimeStats } from '../controllers/crime.controller.js';

const router = Router();

// Legacy endpoint (backward-compatible with AngularJS app)
router.get('/getCrimeData', getCrimeData);

// New endpoints for modernized frontend
router.get('/crimes/stats', getCrimeStats);

export default router;
