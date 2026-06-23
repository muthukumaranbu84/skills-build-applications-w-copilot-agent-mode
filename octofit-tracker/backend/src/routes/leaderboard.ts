import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Activity } from '../models/activity';
import { User } from '../models/user';

const router = Router();

// GET global leaderboard by total calories burned
router.get('/', async (_req: Request, res: Response) => {
  try {
    const leaderboard = await Activity.aggregate([
      {
        $group: {
          _id: '$user',
          totalCalories: { $sum: '$calories' },
          totalActivities: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $sort: { totalCalories: -1 } },
      { $limit: 100 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET team leaderboard by team ID
router.get('/team/:teamId', async (req: Request, res: Response) => {
  try {
    const teamMembers = await User.find({ team: req.params.teamId as any }).select('_id');
    const memberIds = teamMembers.map((m) => m._id);

    const leaderboard = await Activity.aggregate([
      { $match: { user: { $in: memberIds } } },
      {
        $group: {
          _id: '$user',
          totalCalories: { $sum: '$calories' },
          totalActivities: { $sum: 1 },
        },
      },
      { $sort: { totalCalories: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team leaderboard' });
  }
});

export default router;
