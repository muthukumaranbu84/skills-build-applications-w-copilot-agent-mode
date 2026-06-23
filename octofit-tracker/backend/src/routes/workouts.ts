import { Router, Request, Response } from 'express';
import { Workout } from '../models/workout';

const router = Router();

// GET all workouts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// GET workout by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

// GET workouts by difficulty
router.get('/difficulty/:level', async (req: Request, res: Response) => {
  try {
    const workouts = await Workout.find({ difficulty: req.params.level });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts by difficulty' });
  }
});

// POST create workout
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, exercises, difficulty, duration } = req.body;
    if (!name || !description || !difficulty || !duration) {
      return res.status(400).json({ error: 'Name, description, difficulty, and duration are required' });
    }
    const workout = new Workout({ name, description, exercises: exercises || [], difficulty, duration });
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// PUT update workout
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// DELETE workout
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

export default router;
