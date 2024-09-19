import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: Missing MONGODB_URI in environment variables.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}.`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      }).catch((err) => {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      });
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      }).catch((err) => {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      });
    });
  });

};

connectDB().then(startServer);
