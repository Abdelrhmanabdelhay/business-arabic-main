// src/services/blogService.ts
import { CreateBlogDto, UpdateBlogDto, BlogResponseDto, BlogListResponseDto } from "../dtos/blogDto";
import Blog, { IBlog } from "../models/Blog";
import AppError from "../utils/appError";
import { ParsedQs } from "qs";

export class BlogService {
  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogResponseDto> {
    const newBlog = new Blog(createBlogDto);
    await newBlog.save();
    return this.createBlogResponse(newBlog);
  }

  async getBlogs(
    page: number,
    limit: number,
    keyword?: string | string[] | ParsedQs | ParsedQs[]
  ): Promise<BlogListResponseDto> {
    const filter: any = {};

    // Handle keyword filtering
    if (keyword && typeof keyword === "string" && keyword.trim() !== "") {
      const regex = new RegExp(keyword, "i");
      filter.$or = [
        { title: { $regex: regex } },
        { summary: { $regex: regex } },
        { "content.content.text": { $regex: regex } },
      ];
    }

    const total = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
      .sort({ time: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      blogs: blogs.map(this.createBlogResponse),
      total,
      page,
      limit,
    };
  }

  async getBlogById(id: string): Promise<BlogResponseDto> {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new AppError("Blog not found", 400);
    }
    return this.createBlogResponse(blog);
  }

  async updateBlog(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogResponseDto> {
    const blog = await Blog.findByIdAndUpdate(id, updateBlogDto, { new: true });
    if (!blog) {
      throw new AppError("Blog not found", 400);
    }
    return this.createBlogResponse(blog);
  }

  async deleteBlog(id: string): Promise<void> {
    const result = await Blog.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Blog not found", 400);
    }
  }

  private createBlogResponse(blog: IBlog): BlogResponseDto {
    return {
      id: blog._id.toString(),
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      image: blog.image,
    };
  }
}

export default new BlogService();
