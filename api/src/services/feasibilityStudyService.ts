import FeasibilityStudy, { IFeasibilityStudy } from "../models/FeasibilityStudy";
import payment from "../models/payment";
import AppError from "../utils/appError";

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

export class FeasibilityStudyService {
  // Get all feasibility studies
 async getAllFeasibilityStudies(
  limit: number = 10,
  page: number = 1,
  keyword?: string,
  fields?: string
): Promise<{ data: IFeasibilityStudy[]; total: number }> {
  try {
    const query: any = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const mongooseQuery = FeasibilityStudy.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (fields) {
      mongooseQuery.select(fields.split(",").join(" "));
    }

    const [data, total] = await Promise.all([
      mongooseQuery.exec(),
      FeasibilityStudy.countDocuments(query),
    ]);

    return { data, total };
  } catch (error) {
    throw new AppError("Failed to fetch feasibility studies", 500);
  }
}


  // Get feasibility study by ID
  async getFeasibilityStudyById(id: string): Promise<IFeasibilityStudy> {
    try {
      const study = await FeasibilityStudy.findById(id);
      if (!study) {
        throw new AppError("Feasibility study not found", 404);
      }
      return study;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to fetch feasibility study", 500);
    }
  }

  // Create new feasibility study
  async createFeasibilityStudy(data: CreateFeasibilityStudyDto): Promise<IFeasibilityStudy> {
    try {
      const study = new FeasibilityStudy(data);
      await study.save();
      return study;
    } catch (error) {
        console.error("CREATE ERROR:", error);

      throw new AppError("Failed to create feasibility study", 500);
    }
  }

  // Update feasibility study
  async updateFeasibilityStudy(id: string, data: UpdateFeasibilityStudyDto): Promise<IFeasibilityStudy> {
    try {
      const study = await FeasibilityStudy.findByIdAndUpdate(
        id,
        { ...data },
        { new: true, runValidators: true }
      );
      
      if (!study) {
        throw new AppError("Feasibility study not found", 404);
      }
      
      return study;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update feasibility study", 500);
    }
  }

  // Delete feasibility study
  async deleteFeasibilityStudy(id: string): Promise<void> {
    try {
      const study = await FeasibilityStudy.findByIdAndDelete(id);
      if (!study) {
        throw new AppError("Feasibility study not found", 404);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to delete feasibility study", 500);
    }
  }

  // Get feasibility studies by category
  async getFeasibilityStudiesByCategory(category: string): Promise<IFeasibilityStudy[]> {
    try {
      const studies = await FeasibilityStudy.find({ category }).sort({ createdAt: -1 });
      return studies;
    } catch (error) {
      throw new AppError("Failed to fetch feasibility studies by category", 500);
    }
  }

  // Search feasibility studies
  async searchFeasibilityStudies(query: string): Promise<IFeasibilityStudy[]> {
    try {
      const studies = await FeasibilityStudy.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } }
        ]
      }).sort({ createdAt: -1 });
      
      return studies;
    } catch (error) {
      throw new AppError("Failed to search feasibility studies", 500);
    }
  }

  // Get buyers of a specific feasibility study service
  async getBuyersOfFeasibilityStudy(serviceId: string): Promise<any[]> {
    try {
      const payments = await payment.find({
        serviceId,
        serviceType: "FeasibilityStudy",
        status: "paid"
      }).populate("userId");
      // Return array of users who bought the service
      return payments.map((p: any) => p.userId);
    } catch (error) {
      throw new AppError("Failed to fetch buyers of feasibility study", 500);
    }
  }

}

export default new FeasibilityStudyService();
