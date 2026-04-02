import mongoose, { Document, Model } from "mongoose";

export interface IFeasibilityStudy extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  price: Number;
    pdf: string; 
  category: string;
  createdAt: Date;
  updatedAt: Date;
    image_public_id: string; // 👈 أضف ده
  pdf_public_id: string;   // 👈 أضف ده
}

const feasibilityStudySchema = new mongoose.Schema<IFeasibilityStudy>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
price: { type: Number, required: true },
   category: { type: String,required: true },
    pdf: { type: String, required: true },
    image_public_id: { type: String, required: true }, // 👈 جدي
    pdf_public_id: { type: String, required: true },   // 👈 جدي
  },
  { timestamps: true }
);

const FeasibilityStudy: Model<IFeasibilityStudy> = mongoose.model<IFeasibilityStudy>(
  "FeasibilityStudy",
  feasibilityStudySchema
);

export default FeasibilityStudy;