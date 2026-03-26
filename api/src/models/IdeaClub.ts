import mongoose, { Document, Model } from "mongoose";

export interface IIdeaClub extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
    content: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

const ideaClubSchema = new mongoose.Schema<IIdeaClub>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    content: [{ type: String }],  

    category: { type: String, required: true },
      imageUrl: { type: String },
  },
  { timestamps: true }
);

const IdeaClub: Model<IIdeaClub> = mongoose.model<IIdeaClub>("IdeaClub", ideaClubSchema);

export default IdeaClub;
