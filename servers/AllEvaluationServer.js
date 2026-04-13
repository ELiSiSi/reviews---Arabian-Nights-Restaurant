import asyncHandler from 'express-async-handler';
import path from 'path';
import { fileURLToPath } from 'url';
import Rating from '../models/ratingModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AllEvaluation = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({}).sort({ createdAt: -1 });
  res.render('AllEvaluation', { ratings });
});

export const deleteAllEvaluations = asyncHandler(async (req, res) => {
  await Rating.deleteMany({});
  res.redirect(
    '/all-evaluation/gfkjgldkfjgfgjfdjgklfdjgojjgoireiojgoijgoidfjglkdfgjdflkgjeroigjeroigjfrfrlkgfdlgjdgoierjgoiergjeroigjeroigjreoigjreoigjreopigjeroijgreojgoerjgoir'
  );
});
