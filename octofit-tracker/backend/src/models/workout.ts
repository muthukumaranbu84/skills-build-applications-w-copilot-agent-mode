import mongoose from 'mongoose';

export interface IWorkout {
  _id?: string;
  name: string;
  description: string;
  exercises: string[];
  difficulty: string;
  duration: number;
  createdAt?: Date;
}

const workoutSchema = new mongoose.Schema<IWorkout>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    exercises: [{ type: String }],
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
