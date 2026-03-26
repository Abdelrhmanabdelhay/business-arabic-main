
import { CreateGrowthServiceDto, UpdateGrowthServiceDto, GrowthServiceResponseDto, GrowthServiceListResponseDto } from "../dtos/growthServiceDto";
import GrowthService, { IGrowthService } from "../models/GrowthServices";
import AppError from "../utils/appError";

export class GrowthServiceService {
  async createGrowthService(createGrowthServiceDto: CreateGrowthServiceDto): Promise<GrowthServiceResponseDto> {
    const newService = new GrowthService(createGrowthServiceDto);
    await newService.save();
    return this.createGrowthServiceResponse(newService);
  }

  async getGrowthServices(): Promise<GrowthServiceListResponseDto> {
    const total = await GrowthService.countDocuments();
    const services = await GrowthService.find().sort({ createdAt: -1 });

    return {
      services: services.map(this.createGrowthServiceResponse),
      total,
    };
  }

  async getGrowthServiceById(id: string): Promise<GrowthServiceResponseDto> {
    const service = await GrowthService.findById(id);
    if (!service) {
      throw new AppError("Growth service not found", 404);
    }
    return this.createGrowthServiceResponse(service);
  }

  async updateGrowthService(id: string, updateGrowthServiceDto: UpdateGrowthServiceDto): Promise<GrowthServiceResponseDto> {
    const service = await GrowthService.findByIdAndUpdate(id, updateGrowthServiceDto, { new: true });
    if (!service) {
      throw new AppError("Growth service not found", 404);
    }
    return this.createGrowthServiceResponse(service);
  }

  async deleteGrowthService(id: string): Promise<void> {
    const result = await GrowthService.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Growth service not found", 404);
    }
  }

  private createGrowthServiceResponse(service: IGrowthService): GrowthServiceResponseDto {
    return {
      id: service._id.toString(),
      icon: service.icon,
      title: service.title,
      description: service.description,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}

export default new GrowthServiceService();