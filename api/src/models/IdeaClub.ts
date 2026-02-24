import mongoose, { Document, Model } from "mongoose";

export interface IIdeaClub extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  content: Map<object, any>[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

const ideaClubSchema = new mongoose.Schema<IIdeaClub>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    content: [
      {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
    ],
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const IdeaClub: Model<IIdeaClub> = mongoose.model<IIdeaClub>("IdeaClub", ideaClubSchema);

export default IdeaClub;
