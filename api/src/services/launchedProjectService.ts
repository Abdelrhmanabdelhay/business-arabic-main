// src/services/launchedProjectService.ts
import { ParsedQs } from "qs";
import {
  CreateLaunchedProjectDto,
  UpdateLaunchedProjectDto,
  LaunchedProjectResponseDto,
  LaunchedProjectListResponseDto,
} from "../dtos/launchedProjectsDto";
import LaunchedProject, { ILaunchedProject } from "../models/LaunchedProject";
import AppError from "../utils/appError";
import payment from "../models/payment";

export class LaunchedProjectService {
  async createLaunchedProject(createLaunchedProjectDto: CreateLaunchedProjectDto): Promise<LaunchedProjectResponseDto> {
    const newProject = new LaunchedProject(createLaunchedProjectDto);
    await newProject.save();
    return this.createLaunchedProjectResponse(newProject);
  }

  async getLaunchedProjects(
    page: number,
    limit: number,
    keyword: string | string[] | ParsedQs | ParsedQs[]
  ): Promise<LaunchedProjectListResponseDto> {
    const filter: any = {};

    if (keyword && typeof keyword === "string") {
      const regex = new RegExp(keyword, "i");
      filter.$or = [{ name: { $regex: regex } }, { description: { $regex: regex } }];
    }

    const total = await LaunchedProject.countDocuments(filter);

    const projects = await LaunchedProject.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      projects: projects.map(this.createLaunchedProjectResponse),
      total,
      page,
      limit,
    };
  }

  async getLaunchedProjectById(id: string): Promise<LaunchedProjectResponseDto> {
    const project = await LaunchedProject.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    return this.createLaunchedProjectResponse(project);
  }

  async updateLaunchedProject(
    id: string,
    updateLaunchedProjectDto: UpdateLaunchedProjectDto
  ): Promise<LaunchedProjectResponseDto> {
    const project = await LaunchedProject.findByIdAndUpdate(id, updateLaunchedProjectDto, { new: true });
    if (!project) {
      throw new Error("Project not found");
    }
    return this.createLaunchedProjectResponse(project);
  }

  async deleteLaunchedProject(id: string): Promise<void> {
    const result = await LaunchedProject.findByIdAndDelete(id);
    if (!result) {
      throw new Error("Project not found");
    }
  }

  async getLaunchedProjectBuyers(serviceId: string): Promise<any[]> {
    try {
      const payments = await payment.find({ serviceId, serviceType: "LaunchedProject", status: "paid" }).populate("userId");
      return payments.map((p: any) => p.userId);
    } catch (error) {
      throw new AppError("Failed to fetch buyers of launched project", 500);
    }
  }

  private createLaunchedProjectResponse(project: ILaunchedProject): LaunchedProjectResponseDto {
    return {
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      category: project.category,
      image: project.image,
      price: project.price,
      createdAt: project.createdAt,
    };
  }
}

export default new LaunchedProjectService();
