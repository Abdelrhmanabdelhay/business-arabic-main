import mongoose, { Document, Schema } from "mongoose";

export interface IPlan extends Document {
  _id: mongoose.Types.ObjectId;
   title: string;  //(مثلاً: Basic, Pro, Premium)
  description?: string; 
  price: number; 
  ideas: string[]; 
  image?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    ideas: [{ type: String, required: true }],
    image: { type: String },
  },
  { timestamps: true }
);

// {
//   "title": "Premium Plan",
//   "description": "أفضل خطة للمحترفين",
//   "price": 49.99,
//   "ideas": [
//     "إنشاء مقالات",
//     "توليد صور AI",
//     "تحليل بيانات متقدم"
//   ],
//   "image": "https://example.com/premium.png"
// }

const Plan = mongoose.model<IPlan>("Plan", planSchema);

export default Plan;
