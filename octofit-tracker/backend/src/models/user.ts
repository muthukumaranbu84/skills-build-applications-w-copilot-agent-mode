import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  team?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
