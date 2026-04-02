import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AuthenticatedRequest } from "../middlewares/auth";

import AppError from "../utils/appError";
export const checkSubscription = async (
  req: AuthenticatedRequest, // <--- here
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError("Unauthorized: User not authenticated", 401));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!user.plan) {
      return next(new AppError("يجب الاشتراك أولاً", 403));
    }

    if (user.planExpiresAt && new Date() > user.planExpiresAt) {
      return next(new AppError("انتهت صلاحية الباقة", 403));
    }

    if (user.downloadsLimit !== -1 && user.downloadsUsed >= user.downloadsLimit) {
      return next(new AppError("وصلت للحد الأقصى للتحميل", 403));
    }

    req.userData = user; 

    next();
  } catch (err) {
    next(err);
  }
};