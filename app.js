import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: './secret.env' });

import allEvaluationRouter from './routes/AllEvaluationRouter.js';
import ratingRouter from './routes/ratingRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middlewares
import { xss } from 'express-xss-sanitizer';
app.use(xss());

import mongoSanitize from '@exortek/express-mongo-sanitize';
app.use(mongoSanitize());

import helmet from 'helmet';
app.use(helmet());

app.disable('x-powered-by');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Global connection cache للـ Vercel
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;

  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000, // 8 ثواني
      connectTimeoutMS: 8000,
      socketTimeoutMS: 10000,
      maxPoolSize: 1, // مهم لـ Vercel Hobby
    };

    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res
      .status(500)
      .json({ error: 'Database connection failed. Please try again.' });
  }
});

// Routes
app.use('/', ratingRouter);
app.use('/', allEvaluationRouter);

app.get('/', async (req, res) => {
  res.redirect('/rating');
});


export default app;
