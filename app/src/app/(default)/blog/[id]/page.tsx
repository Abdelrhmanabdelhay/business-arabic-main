'use client'
import React from "react";
import BlogPost from "./components/BlogPost";
import { GetPost } from "@/lib/actions/posts.actions";


interface BlogPageProps {
  params: { id: string };
}

const Page = ({ params }: BlogPageProps) => {
  const { id } = params;
  const { data: post, isPending, isError } = GetPost({ id });

  if (isPending) {
    return <div className="text-center py-20">جاري تحميل المقال...</div>;
  }

  if (isError || !post) {
    return <div className="text-center py-20 text-red-600">تعذر تحميل المقال.</div>;
  }

  // Transform the structured content into readable format for BlogPost
 const parsedContent = (post.content || []).map((block: any) => {
  switch (block.type) {
    case "paragraph":
      return {
        type: "paragraph",
        content: block.value || "",
      };

    case "heading":
      return {
        type: "heading",
        content: block.value || "",
      };

    case "list":
      return {
        type: "list",
        content: block.items || [],
      };

    case "image":
      return {
        type: "image",
        content: {
          url: block.url || "",
          alt: block.alt || "",
        },
      };

    default:
      return {
        type: "paragraph",
        content: block.value || "",
      };
  }
});


  const formattedPost = {
    ...post,
    content: parsedContent,
    readTime: post.readTime ?? 5,
    tags: post.tags ?? [],
    createdAt: post.createdAt ?? new Date().toISOString(),
    author: post.author ?? {
      name: "غير معروف",
      role: "",
      avatar: "",
    },
  };

  // @ts-ignore
  return <BlogPost post={formattedPost} />;
};

export default Page;
