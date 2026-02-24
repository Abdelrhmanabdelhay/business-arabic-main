import {
  CreateIdeaClubDto,
  UpdateIdeaClubDto,
  IdeaClubResponseDto,
  IdeaClubListResponseDto,
} from "../dtos/ideaClubDto";
import IdeaClub, { IIdeaClub } from "../models/IdeaClub";
import AppError from "../utils/appError";
import { ParsedQs } from "qs";

export class IdeaClubService {
  async createIdeaClub(createIdeaClubDto: CreateIdeaClubDto): Promise<IdeaClubResponseDto> {
    const newIdea = new IdeaClub(createIdeaClubDto);
    await newIdea.save();
    return this.createIdeaClubResponse(newIdea);
  }

  async getIdeaClubs(
    page: number,
    limit: number,
    category?: string | string[] | ParsedQs | ParsedQs[],
    keyword?: string | string[] | ParsedQs | ParsedQs[]
  ): Promise<IdeaClubListResponseDto> {
    // Build dynamic filter
    const filter: any = {};

    if (category && typeof category === "string" && category !== "all") {
      filter.category = category;
    }

    if (keyword && typeof keyword === "string" && keyword.trim() !== "") {
      const regex = new RegExp(keyword, "i");
      filter.$or = [{ name: { $regex: regex } }, { description: { $regex: regex } }];
    }

    const categories = await IdeaClub.distinct("category");

    const total = await IdeaClub.countDocuments(filter);
    const ideas = await IdeaClub.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      ideas: ideas.map(this.createIdeaClubResponse),
      categories,
      total,
      page,
      limit,
    };
  }

  async getIdeaClubById(id: string): Promise<IdeaClubResponseDto> {
    const idea = await IdeaClub.findById(id);
    if (!idea) {
      throw new AppError("Idea not found", 400);
    }
    return this.createIdeaClubResponse(idea);
  }

  async updateIdeaClub(id: string, updateIdeaClubDto: UpdateIdeaClubDto): Promise<IdeaClubResponseDto> {
    console.log({ updateIdeaClubDto });
    const idea = await IdeaClub.findByIdAndUpdate(id, updateIdeaClubDto, { new: true });
    if (!idea) {
      throw new AppError("Idea not found", 400);
    }
    await idea.save({ validateModifiedOnly: true });
    return this.createIdeaClubResponse(idea);
  }

  async deleteIdeaClub(id: string): Promise<IdeaClubResponseDto> {
    const ideas = await IdeaClub.findByIdAndDelete(id);
    if (!ideas) {
      throw new AppError("Idea not found", 400);
    }
    return this.createIdeaClubResponse(ideas);
  }

  private createIdeaClubResponse(idea: IIdeaClub): IdeaClubResponseDto {
    return {
      id: idea._id.toString(),
      name: idea.name,
      description: idea.description,
      category: idea.category,
      content: idea.content,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
    };
  }
}

export default new IdeaClubService();
