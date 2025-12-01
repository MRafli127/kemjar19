import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import ftpRoutes from './routes/ftp.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow Vercel frontend
const allowedOrigins = [
  'https://kemjar19-10v7ehsvf-rafli127s-projects.vercel.app',
  'http://localhost:4000',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow all vercel.app domains and localhost
    if (origin.includes('vercel.app') || origin.includes('localhost') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production for now
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend API is running on Vercel',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ftp', ftpRoutes);

// Error handling middleware
app.use(errorHandler);

// Export for Vercel serverless
export default app;
