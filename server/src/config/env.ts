import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  ip: process.env.IP || '0.0.0.0',
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crimespace',
  },
} as const;
