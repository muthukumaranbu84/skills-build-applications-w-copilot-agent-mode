import { Router, Request, Response } from 'express';
import { Team } from '../models/team';

const router = Router();

// GET all teams
router.get('/', async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find().populate('members');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// GET team by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id).populate('members');
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// POST create team
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, members } = req.body;
    if (!name) return res.status(400).json({ error: 'Team name is required' });
    const team = new Team({ name, description, members: members || [] });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// PUT update team
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('members');
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// DELETE team
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

export default router;
