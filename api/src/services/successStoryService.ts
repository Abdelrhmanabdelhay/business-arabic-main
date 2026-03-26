import { CreateSuccessStoryDto, UpdateSuccessStoryDto, SuccessStoryResponseDto, SuccessStoryListResponseDto } from "../dtos/successStoryDto";
import SuccessStory, { ISuccessStory } from "../models/SuccessStory";
import AppError from "../utils/appError";
import { ParsedQs } from "qs";

export class SuccessStoryService {
  async createSuccessStory(createSuccessStoryDto: CreateSuccessStoryDto): Promise<SuccessStoryResponseDto> {
    const newStory = new SuccessStory(createSuccessStoryDto);
    await newStory.save();
    return this.createSuccessStoryResponse(newStory);
  }

  async getSuccessStories(
    page: number,
    limit: number,
keyword?: string | ParsedQs | (string | ParsedQs)[]
  ): Promise<SuccessStoryListResponseDto> {
    const filter: any = {};

    if (keyword && typeof keyword === "string" && keyword.trim() !== "") {
      const regex = new RegExp(keyword, "i");
      filter.$or = [
        { name: { $regex: regex } },
        { company: { $regex: regex } },
        { quote: { $regex: regex } },
      ];
    }

    const total = await SuccessStory.countDocuments(filter);

    const stories = await SuccessStory.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      stories: stories.map(this.createSuccessStoryResponse),
      total,
      page,
      limit,
    };
  }

  async getSuccessStoryById(id: string): Promise<SuccessStoryResponseDto> {
    const story = await SuccessStory.findById(id);
    if (!story) {
      throw new AppError("Success story not found", 404);
    }
    return this.createSuccessStoryResponse(story);
  }

  async updateSuccessStory(id: string, updateSuccessStoryDto: UpdateSuccessStoryDto): Promise<SuccessStoryResponseDto> {
    const story = await SuccessStory.findByIdAndUpdate(id, updateSuccessStoryDto, { new: true });
    if (!story) {
      throw new AppError("Success story not found", 404);
    }
    return this.createSuccessStoryResponse(story);
  }

  async deleteSuccessStory(id: string): Promise<void> {
    const result = await SuccessStory.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Success story not found", 404);
    }
  }

  private createSuccessStoryResponse(story: ISuccessStory): SuccessStoryResponseDto {
    return {
      id: story._id.toString(),
      name: story.name,
      company: story.company,
      revenue: story.revenue,
      quote: story.quote,
      avatar: story.avatar,
      color: story.color,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    };
  }
}

export default new SuccessStoryService();