import mongoose from 'mongoose';

export interface ITeam {
  _id?: string;
  name: string;
  description?: string;
  members: mongoose.Schema.Types.ObjectId[];
  createdAt?: Date;
}

const teamSchema = new mongoose.Schema<ITeam>(
  {
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>('Team', teamSchema);
