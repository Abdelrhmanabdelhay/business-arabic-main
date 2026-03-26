import mongoose, { Document, Model } from "mongoose";

export interface IGrowthService extends Document {
  _id: mongoose.Types.ObjectId;
  icon: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const growthServiceSchema = new mongoose.Schema<IGrowthService>(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const GrowthService: Model<IGrowthService> = mongoose.model<IGrowthService>(
  "GrowthService",
  growthServiceSchema
);

export default GrowthService;