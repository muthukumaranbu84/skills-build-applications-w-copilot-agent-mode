import mongoose from 'mongoose';

export interface IActivity {
  _id?: string;
  user: mongoose.Schema.Types.ObjectId;
  type: string;
  duration: number;
  calories: number;
  distance?: number;
  timestamp?: Date;
  createdAt?: Date;
}

const activitySchema = new mongoose.Schema<IActivity>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    calories: { type: Number, required: true },
    distance: { type: Number },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
