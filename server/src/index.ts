import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config/env.js';
import crimeRoutes from './routes/crime.routes.js';

const app = express();

// Security headers
app.use(helmet());

// Request logging
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// CORS — allow Angular dev server
app.use(cors());

// Body parsing
app.use(express.json());

// Routes
app.use('/api', crimeRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: config.env });
});

// 404 for unknown API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Connect to MongoDB and start server
async function start(): Promise<void> {
  try {
    await mongoose.connect(config.mongo.uri);
    console.log('Connected to MongoDB at', config.mongo.uri);

    app.listen(config.port, config.ip, () => {
      console.log(
        `Server listening on ${config.ip}:${config.port} [${config.env}]`,
      );
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

export default app;
