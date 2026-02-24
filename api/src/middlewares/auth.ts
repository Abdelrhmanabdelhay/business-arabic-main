// src/middlewares/auth.ts

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}


export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.warn("authenticate: missing Authorization header");
      throw new Error("Please authenticate.");
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.warn("authenticate: token verification failed or token expired");
    }
    const user = await User.findById(decoded?.userId);

    if (!user) {
      console.warn("authenticate: user not found for id:", decoded?.userId);
      throw new Error("Please authenticate.");
    }

    req.user = { id: user._id.toString(), role: user.role };
    // يمكنك الآن الحصول على userId من req.user.id في أي ميدل وير لاحق
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).send({ error: "Please authenticate." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ error: "Not authorized to access this resource." });
    }

    next();
  };
};
