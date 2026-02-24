// src/services/postService.ts

import { CreatePostDto, UpdatePostDto, PostResponseDto, PostListResponseDto } from "../dtos/postDto";
import Post, { IPost } from "../models/Post";
import { calculateSEOScore } from "../utils/seoUtils";

export class PostService {
  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const { title, content, image } = createPostDto;


    const newPost = new Post({
      title,
      content,
      image,
    });

    await newPost.save();

    return this.createPostResponse(newPost);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto, authorId: string): Promise<PostResponseDto> {
    const post = await Post.findOne({ _id: id, author: authorId });
    if (!post) {
      throw new Error("Post not found or you're not authorized to update it");
    }

    Object.assign(post, updatePostDto);
    await post.save();

    return this.createPostResponse(post);
  }
  async getPosts(page: number, limit: number): Promise<PostListResponseDto> {
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate("author", "fullName")
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      posts: posts.map(this.createPostResponse),
      total,
      page,
      limit,
    };
  }

  async getPostById(id: string): Promise<PostResponseDto> {
    const post = await Post.findById(id).populate("author", "fullName");
    if (!post) {
      throw new Error("Post not found");
    }

    return this.createPostResponse(post);
  }

  async deletePost(id: string, authorId: string): Promise<void> {
    const result = await Post.findOneAndDelete({ _id: id, author: authorId });
    if (!result) {
      throw new Error("Post not found or you're not authorized to delete it");
    }
  }

  private createPostResponse(post: IPost): PostResponseDto {
    return {
      id: post._id?.toString(),
      title: post.title,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}

export default new PostService();
