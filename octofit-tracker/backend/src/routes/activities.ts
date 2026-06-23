import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Activity } from '../models/activity';

const router = Router();

// GET all activities
router.get('/', async (_req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('user').sort({ timestamp: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET activities by user ID
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({ user: req.params.userId as any }).populate('user').sort({ timestamp: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

// POST create activity
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user, type, duration, calories, distance } = req.body;
    if (!user || !type || !duration || calories === undefined) {
      return res.status(400).json({ error: 'User, type, duration, and calories are required' });
    }
    const activity = new Activity({ user, type, duration, calories, distance });
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// PUT update activity
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user');
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// DELETE activity
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;
