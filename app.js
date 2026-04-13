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
import Rating from './models/ratingModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// secrets and security middlewares
import { xss } from 'express-xss-sanitizer';
app.use(xss());

import mongoSanitize from '@exortek/express-mongo-sanitize';  // ← الجديد
app.use(mongoSanitize());



import helmet from 'helmet';
app.use(helmet());

app.disable('x-powered-by');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', ratingRouter);
app.use('/', allEvaluationRouter);

app.get('/', async (req, res) => {
   res.redirect('/rating');
});


mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/rating`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


  export default app;
