import mongoose, { Document, Model } from "mongoose";

export interface ISuccessStory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  company: string;
  revenue: string;
  quote: string;
  avatar?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

const successStorySchema = new mongoose.Schema<ISuccessStory>(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    revenue: { type: String, required: true },
    quote: { type: String, required: true },
    avatar: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

const SuccessStory: Model<ISuccessStory> = mongoose.model<ISuccessStory>(
  "SuccessStory",
  successStorySchema
);

export default SuccessStory;