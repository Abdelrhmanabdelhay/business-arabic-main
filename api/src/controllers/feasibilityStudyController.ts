import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";

import feasibilityStudyService from "../services/feasibilityStudyService";
import AppError from "../utils/appError";
import uploadFile from "../middlewares/uploadFile";

// Define DTOs inline to avoid import issues
interface CreateFeasibilityStudyDto {
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
}

interface UpdateFeasibilityStudyDto {
  name?: string;
  description?: string;
  image?: string;
  price?: string;
  category?: string;
}

export class FeasibilityStudyController {
  // Get all feasibility studies
async getAllFeasibilityStudies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword?.toString();
    const fields = req.query.fields?.toString();

    const { data, total } = await feasibilityStudyService.getAllFeasibilityStudies(
      limit,
      page,
      keyword,
      fields
    );

    res.status(200).json({
      status: "success",
      results: data.length,
      page,
      limit,
      total,
      data,
    });
  } catch (error) {
    next(error);
  }
}


  // Get feasibility study by ID
  async getFeasibilityStudyById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const study = await feasibilityStudyService.getFeasibilityStudyById(id);
      res.status(200).json({
        status: "success",
        data: study
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new feasibility study
async createFeasibilityStudy(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    // ✅ تأكد إن الصورة موجودة
    if (!req.file) {
      return next(new AppError("Image is required", 400));
    }

    // ✅ ارفع الصورة على Cloudinary
    const uploadedImage = await uploadFile(req.file, "feasibility-studies");

    const data: CreateFeasibilityStudyDto = {
      name: req.body.name,
      description: req.body.description,
      image: uploadedImage.secure_url, 
      price: req.body.price,
      category: req.body.category?.trim(),
    };

    const study = await feasibilityStudyService.createFeasibilityStudy({
      ...data,
      price: Number(data.price),
    } as any);

    res.status(201).json({
      status: "success",
      message: "Feasibility study created successfully",
      data: study,
    });
  } catch (error) {
    next(error);
  }
}

  // Update feasibility study
async updateFeasibilityStudy(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const data: any = {
      ...req.body,
      category: req.body.category?.trim(),
    };

    if (req.file) {
      const uploadedImage = await uploadFile(
        req.file,
        "feasibility-studies"
      );

      data.image = uploadedImage.secure_url;
    }

    if (data.price) {
      data.price = Number(data.price);
    }

    const study = await feasibilityStudyService.updateFeasibilityStudy(
      id,
      data
    );

    res.status(200).json({
      status: "success",
      message: "Feasibility study updated successfully",
      data: study,
    });
  } catch (error) {
    next(error);
  }
}

  // Delete feasibility study
  async deleteFeasibilityStudy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await feasibilityStudyService.deleteFeasibilityStudy(id);
      res.status(200).json({
        status: "success",
        message: "Feasibility study deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  // Get feasibility studies by category
  async getFeasibilityStudiesByCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const studies = await feasibilityStudyService.getFeasibilityStudiesByCategory(category);
      res.status(200).json({
        status: "success",
        results: studies.length,
        data: studies
      });
    } catch (error) {
      next(error);
    }
  }

  // Search feasibility studies
  async searchFeasibilityStudies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          status: "error",
          message: "Search query is required"
        });
      }
      
      const studies = await feasibilityStudyService.searchFeasibilityStudies(q);
      res.status(200).json({
        status: "success",
        results: studies.length,
        data: studies
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeasibilityStudiesByBuyers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: User not found"
        });
      }

      const serviceId = req.params.id;
      const buyers = await feasibilityStudyService.getBuyersOfFeasibilityStudy(serviceId);
      res.status(200).json({
        status: "success",
        results: buyers.length,
        data: buyers
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FeasibilityStudyController();
