import mongoose from 'mongoose';

export interface ILeaderboard {
  _id?: string;
  user: mongoose.Schema.Types.ObjectId;
  totalCalories: number;
  totalActivities: number;
  period?: string;
  createdAt?: Date;
}

const leaderboardSchema = new mongoose.Schema<ILeaderboard>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalCalories: { type: Number, required: true },
    totalActivities: { type: Number, required: true },
    period: { type: String },
  },
  { timestamps: true }
);

export const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);
