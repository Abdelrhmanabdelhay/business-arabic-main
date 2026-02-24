// src/models/Blog.ts
import mongoose, { Document, Model } from "mongoose";

export interface IBlog extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  summary: string;
  content: Map<object, any>[];
  image?: string;
}

const blogSchema = new mongoose.Schema<IBlog>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: [
      {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
    ],
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
