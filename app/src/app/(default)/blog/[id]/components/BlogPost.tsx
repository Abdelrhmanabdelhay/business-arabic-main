"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { FiClock, FiArrowLeft } from "react-icons/fi";
import type { BlogPost } from "@/types/blog.types";
import { useRouter } from "next/navigation";

const BlogPost: React.FC<{ post: BlogPost }> = ({ post }) => {
  const router = useRouter();
  const renderContent = (content: any) => {
    switch (content.type) {
      case "paragraph":
        return (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-700 leading-relaxed mb-8 text-lg"
          >
            {content.content}
          </motion.p>
        );
      case "heading":
        return (
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-6 mt-12"
          >
            {content.content}
          </motion.h2>
        );
      case "image":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-12"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={content.content.url} 
                alt={content.content.alt} 
                className="w-full transition-transform duration-500 hover:scale-105"
              />
            </div>
            {content.content.caption && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                {content.content.caption}
              </p>
            )}
          </motion.div>
        );
      case "quote":
        return (
          <motion.blockquote 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-12 bg-primary-50/50 border-r-4 border-primary-800 pr-6 py-8 px-8 rounded-lg text-xl text-gray-700 leading-relaxed"
          >
            {content.content}
          </motion.blockquote>
        );
      case "list":
        return (
          <motion.ul 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-8 mt-4 list-none"
          >
            {content.content.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-primary-800 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </motion.ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-black">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 right-8 z-10"
        >
          <Button
            variant="flat"
            className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
            startContent={<FiArrowLeft />}
            onClick={() => router.back()}
          >
            عودة إلى المدونة
          </Button>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-12 md:p-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto space-y-6"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Chip 
                  key={tag} 
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20" 
                  size="sm"
                >
                  {tag}
                </Chip>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 flex items-center gap-2">
                <FiClock />
                {post.readTime} دقائق للقراءة
              </span>
              <span className="text-gray-300">
                {new Date(post.createdAt).toLocaleDateString("ar-SA")}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-3xl p-8 md:p-12 -mt-32 relative z-10 border border-gray-100"
        >
          <div className="prose prose-lg max-w-none">
            {post.content.map((section, index) => renderContent(section))}
          </div>

          {/* Tags Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 pt-8 border-t"
          >
            <h3 className="text-lg font-semibold mb-4">الوسوم</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  className="bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-primary-800"
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </motion.div>

          {/* Related Articles */}
          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 pt-8 border-t"
          >
            <h3 className="text-2xl font-bold mb-8">مقالات ذات صلة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={`/api/placeholder/800/450`}
                      alt="Related article"
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-xl group-hover:text-primary-800 transition-colors line-clamp-2 mb-2">
                      عنوان المقال المرتبط {index}
                    </h4>
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <FiClock />
                      5 دقائق للقراءة
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div> */}
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPost;