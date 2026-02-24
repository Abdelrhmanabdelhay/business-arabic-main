import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: Map<object, any>[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: [
      {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
    ],
    image: { type: String },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
