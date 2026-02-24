"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { useRouter } from "next/navigation";
import { FiSearch, FiClock, FiArrowRight } from "react-icons/fi";
import { BlogPost } from "@/types/blog.types";
import { GetPosts } from "@/lib/actions/posts.actions";

const BlogListPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: postsData,
    refetch,
  } = GetPosts({
    page: currentPage,
    limit: 10,
    keyword: searchQuery.trim() !== "" ? searchQuery : "",
  });

  const posts: BlogPost[] = postsData?.blogs || [];

  useEffect(() => {
    refetch();
  }, [searchQuery]);

  // const categories = [...]; // Commented: Category buttons disabled per request

  const FeaturedPost = () =>
    posts.length > 0 ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-[500px] rounded-[2rem] overflow-hidden mb-16 group">
        <motion.img
          src={posts[0].image || "/placeholder.png"}
          alt="Featured post"
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto space-y-6">
              <Chip className="bg-primary-800/90 backdrop-blur-lg text-white border border-white/20" size="lg">
                المقال المميز
              </Chip>
              <h1 className="text-5xl font-bold mb-6 leading-tight text-white">{posts[0].title}</h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl">{posts[0].summary}</p>
              <div className="flex items-center justify-between pt-6 border-t border-white/20">
                <span className="text-gray-300 flex items-center gap-2">
                  <FiClock />
                  {/* Estimated reading time is optional */}
                  {posts[0].readTime ?? 5} دقائق للقراءة
                </span>
                <Button
                  className="bg-white text-primary-800 font-semibold px-8 h-12 text-lg shadow-lg hover:shadow-xl"
                  endContent={<FiArrowRight />}
                  onClick={() => router.push(`/blog/${posts[0].id}`)}>
                  اقرأ المقال
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    ) : null;

  const BlogCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="h-full">
      <Card className="group h-full hover:shadow-2xl transition-all duration-500 border border-gray-100">
        <CardBody className="p-0 overflow-hidden">
          <div className="relative h-56 overflow-hidden">
            <img
              src={post.image || "/placeholder.png"}
              alt={post.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary-800 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">{post.summary}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <FiClock className="text-primary-500" />
                {post.readTime ?? 5} دقائق للقراءة
              </span>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className="font-semibold"
                endContent={<FiArrowRight />}
                onClick={() => router.push(`/blog/${post.id}`)}>
                اقرأ المزيد
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-blue-900 py-32 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-800/20 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center text-white mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-6">
              المدونة
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-blue-100 max-w-2xl mx-auto font-light">
              مقالات وأفكار ملهمة لرواد الأعمال في العالم العربي
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto">
            <Input
              classNames={{
                input: "text-lg py-8 pl-16 pr-6",
                inputWrapper: "bg-white/95 shadow-xl backdrop-blur-xl rounded-2xl border border-white/20",
              }}
              placeholder="ابحث في المدونة..."
              startContent={<FiSearch className="text-2xl text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        {/* Categories (commented as requested) */}
        {/*
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          {categories.map((category) => (
            <Button
              key={category.id}
              ...
            />
          ))}
        </motion.div>
        */}

        {/* Featured Post */}
        <FeaturedPost />

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {posts.slice(1).map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        <motion.div className="text-center mt-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            size="lg"
            className="bg-white h-14 px-12 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
            onClick={() => setCurrentPage((prev) => prev + 1)}>
            المزيد من المقالات
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogListPage;
