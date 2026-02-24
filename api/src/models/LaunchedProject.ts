import mongoose, { Document, Model } from "mongoose";

export interface ILaunchedProject extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
  createdAt: Date;
}

const launchedProjectSchema = new mongoose.Schema<ILaunchedProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true, min: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const LaunchedProject: Model<ILaunchedProject> = mongoose.model<ILaunchedProject>(
  "LaunchedProject",
  launchedProjectSchema
);

export default LaunchedProject;
