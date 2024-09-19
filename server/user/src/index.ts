import dotenv from 'dotenv';
dotenv.config(); // Load env variables early

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import { connectDB, closeDB } from './config/database';

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/userdb";

  // Pass MONGODB_URI to connectDB
  await connectDB(MONGODB_URI);

  const server = app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}.`);
  });

  const gracefulShutdown = async () => {
    console.log('Gracefully shutting down');

    server.close(async () => {
      console.log('HTTP server closed');
      await closeDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

startServer();
