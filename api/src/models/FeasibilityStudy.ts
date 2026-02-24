import mongoose, { Document, Model } from "mongoose";

export interface IFeasibilityStudy extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const feasibilityStudySchema = new mongoose.Schema<IFeasibilityStudy>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true, min: 0 },
   category: { type: String,required: true },
  },
  { timestamps: true }
);

const FeasibilityStudy: Model<IFeasibilityStudy> = mongoose.model<IFeasibilityStudy>(
  "FeasibilityStudy",
  feasibilityStudySchema
);

export default FeasibilityStudy;