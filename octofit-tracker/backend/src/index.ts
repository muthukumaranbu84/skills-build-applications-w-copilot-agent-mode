import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import teamsRouter from './routes/teams';
import activitiesRouter from './routes/activities';
import workoutsRouter from './routes/workouts';
import leaderboardRouter from './routes/leaderboard';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit_db';

const app = express();
app.use(express.json());

// Generate API URL based on environment (Codespaces-aware)
function getApiUrl(): string {
  if (process.env.CODESPACE_NAME) {
    return `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`;
  }
  return `http://localhost:${PORT}`;
}

// Health check and API info endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'OctoFit Tracker backend running',
    apiUrl: getApiUrl(),
    version: '0.0.0',
  });
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/leaderboard', leaderboardRouter);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB:', MONGO_URI);

    app.listen(PORT, () => {
      const apiUrl = getApiUrl();
      console.log(`Server listening on ${apiUrl}`);
      console.log(`API Documentation:`);
      console.log(`  - Users: ${apiUrl}/api/users`);
      console.log(`  - Teams: ${apiUrl}/api/teams`);
      console.log(`  - Activities: ${apiUrl}/api/activities`);
      console.log(`  - Workouts: ${apiUrl}/api/workouts`);
      console.log(`  - Leaderboard: ${apiUrl}/api/leaderboard`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
