// src/models/User.ts

import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
resetPasswordExpires?: Date;
  plan?: "monthly" | "quarterly" | "yearly";
  downloadsUsed: number;
  downloadsLimit: number;
  planExpiresAt?: Date;  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  plan: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: null,
    },

    downloadsUsed: {
      type: Number,
      default: 0,
    },

    downloadsLimit: {
      type: Number,
      default: 0,
    },

    planExpiresAt: {
      type: Date,
    },  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
