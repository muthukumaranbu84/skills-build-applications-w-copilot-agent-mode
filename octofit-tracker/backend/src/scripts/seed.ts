/*
Seed the octofit_db database with test data
*/

import mongoose from 'mongoose';
import { User } from '../models/user';
import { Team } from '../models/team';
import { Activity } from '../models/activity';
import { Workout } from '../models/workout';
import { Leaderboard } from '../models/leaderboard';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit_db';

async function seed() {
  console.log('Seed the octofit_db database with test data');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to', MONGO_URI);

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    Workout.deleteMany({}),
    Leaderboard.deleteMany({}),
  ]);

  // Create teams
  const teamA = new Team({ name: 'Red Rockets', description: 'Fast and focused' });
  const teamB = new Team({ name: 'Blue Whales', description: 'Endurance specialists' });
  await teamA.save();
  await teamB.save();

  // Create users
  const usersData = [
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', team: teamA._id },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'password123', team: teamA._id },
    { name: 'Carol Lee', email: 'carol@example.com', password: 'password123', team: teamB._id },
    { name: 'Dan Patel', email: 'dan@example.com', password: 'password123', team: teamB._id },
  ];

  const users = await User.insertMany(usersData);

  // Add members to teams
  teamA.members = [users[0]._id, users[1]._id];
  teamB.members = [users[2]._id, users[3]._id];
  await teamA.save();
  await teamB.save();

  // Create workouts
  const workouts = await Workout.insertMany([
    { name: 'Quick Cardio', description: 'Short high intensity routine', exercises: ['jumping jacks', 'burpees'], difficulty: 'beginner', duration: 15 },
    { name: 'Strength Builder', description: 'Full body strength set', exercises: ['push-ups', 'squats'], difficulty: 'intermediate', duration: 40 },
    { name: 'Endurance Run', description: 'Long steady state run', exercises: ['running'], difficulty: 'advanced', duration: 60 },
  ]);

  // Create activities
  const activitiesData = [
    { user: users[0]._id, type: 'run', duration: 30, calories: 300, distance: 5 },
    { user: users[1]._id, type: 'bike', duration: 45, calories: 400, distance: 20 },
    { user: users[2]._id, type: 'swim', duration: 60, calories: 500, distance: 2 },
    { user: users[3]._id, type: 'workout', duration: 50, calories: 450, distance: 0 },
    { user: users[0]._id, type: 'workout', duration: 20, calories: 180, distance: 0 },
  ];

  await Activity.insertMany(activitiesData);

  // Compute leaderboard and save
  const agg = await Activity.aggregate([
    { $group: { _id: '$user', totalCalories: { $sum: '$calories' }, totalActivities: { $sum: 1 } } },
    { $sort: { totalCalories: -1 } },
  ]);

  const lbDocs = agg.map((a: any) => ({ user: a._id, totalCalories: a.totalCalories, totalActivities: a.totalActivities }));
  await Leaderboard.insertMany(lbDocs);

  console.log('Seed complete:');
  console.log('  users:', await User.countDocuments());
  console.log('  teams:', await Team.countDocuments());
  console.log('  activities:', await Activity.countDocuments());
  console.log('  workouts:', await Workout.countDocuments());
  console.log('  leaderboard entries:', await Leaderboard.countDocuments());

  await mongoose.disconnect();
  console.log('Disconnected');
}

seed().catch((err) => {
  console.error('Seed error', err);
  process.exit(1);
});
