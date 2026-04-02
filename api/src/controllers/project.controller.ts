import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import User from "../models/User";
import FeasibilityStudy from "../models/FeasibilityStudy"; // import your model
import cloudinary from '../config/cloudinaryConfig';

export const downloadProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      user.downloadsLimit !== -1 &&
      user.downloadsUsed >= user.downloadsLimit
    ) {
      return res.status(403).json({
        message: "وصلت للحد الأقصى للتحميل",
      });
    }

    // ─── Get the study to find the PDF URL ───────────────────────────────
    const study = await FeasibilityStudy.findById(req.params.projectId);

    if (!study) {
      return res.status(404).json({ message: "الدراسة غير موجودة" });
    }

    if (!study.pdf) {
      return res.status(404).json({ message: "ملف PDF غير متاح" });
    }


const signedUrl = cloudinary.utils.private_download_url(
  study.pdf_public_id,
  "pdf",
  {
    resource_type: "raw",
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + 60,
  }
);
    // ─── Count the download only after successful fetch ───────────────────
    user.downloadsUsed += 1;
    await user.save();
return res.redirect(signedUrl);


  } catch (err) {
    next(err);
  }
};