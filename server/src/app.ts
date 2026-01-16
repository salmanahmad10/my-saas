import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());

// Webhook routes need raw body, so they must come BEFORE express.json()
import paymentRoutes from './routes/paymentRoutes';
app.use('/api/payments', paymentRoutes);

// JSON parser middleware (after webhook routes)
app.use(express.json());


// Base Route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to my-saas API!',
    status: 'Running'
  });
});

// Auth Routes
import authRoutes from './routes/authRoutes';
app.use('/api/auth', authRoutes);


// Database: PostgreSQL (Prisma)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// We will add connection logic here later




// Payment webhook routes already mounted above (before json middleware)

// Email Routes
import emailRoutes from './routes/emailRoutes';
app.use('/api/email', emailRoutes);

// Storage Routes
import storageRoutes from './routes/storageRoutes';
app.use('/api/storage', storageRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Error Handler (should be after all routes/middleware)
app.use(errorHandler);