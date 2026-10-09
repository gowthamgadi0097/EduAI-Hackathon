import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import learningRoutes from './routes/learning.js';

const app = express();
const PORT = process.env.PORT || 5000;
const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin, credentials: false }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EduAI API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/learning', learningRoutes);

app.use((err, _req, res, _next) => {
  console.error('API error:', err?.message || err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'Something went wrong. Please try again.' : err.message
  });
});

async function start() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Configure backend/.env.');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured and should be at least 32 characters.');
  }
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY is missing. Configure backend/.env with a valid OpenAI API key.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`EduAI API running at http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});
