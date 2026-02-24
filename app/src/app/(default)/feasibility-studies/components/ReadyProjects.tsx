"use client";
import { useEffect, useState, useMemo } from "react";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { FiArrowLeft } from "react-icons/fi";
import { GetProjects } from "@/lib/actions/projects.actions";
import { motion } from "framer-motion";
import { Project } from "@/types/project.type";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

export default function ReadyProjects() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  const rowsPerPage = 12;

  const {
    data: projectsData,
    isPending: isLoading,
    refetch,
  } = GetProjects({
    limit: rowsPerPage,
    page,
    keyword: search,
  });

  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    setSearch(searchParam);
    refetch();
  }, [searchParams, refetch]);

  const categories = useMemo(() => {
    const cats =
      projectsData?.projects?.map((p: Project) => p.category || "عام") || [];
    return ["الكل", ...Array.from(new Set(cats))];
  }, [projectsData]);

  const filteredProjects = useMemo(() => {
    if (!projectsData?.projects) return [];
    if (selectedCategory === "الكل") return projectsData.projects;
    return projectsData.projects.filter(
      (p: Project) => (p.category || "عام") === selectedCategory
    );
  }, [projectsData, selectedCategory]);

  if (isLoading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
<div className="text-center mb-12 px-4">
  <h1 className="text-4xl font-bold mb-4">دراسات جدوى</h1>

  {/* Description + Dropdown Row */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-6 
                      max-w-4xl mx-auto">

    {/* Description Text */}
    <p className="text-default-700 text-lg text-right md:text-right flex-1">
      اكتشف دراسات جدوى احترافية تساعدك على اتخاذ قرارك الاستثماري
    </p>

    {/* Dropdown */}
    <div className="flex-shrink-0">
      <Dropdown>
        <DropdownTrigger>
<Button
  radius="full"
  className="
    px-8 py-2
    bg-gradient-to-r from-primary to-purple-500
    text-white font-semibold
    shadow-lg shadow-primary/40
    hover:scale-105 hover:shadow-xl hover:shadow-primary/50
    transition-all duration-300
    border border-white/20
    backdrop-blur-md
  "
>
  <span className="flex items-center gap-2 text-black">
    {selectedCategory}
    <span className="text-sm opacity-80">▼</span>
  </span>
</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Categories"
          onAction={(key) => setSelectedCategory(String(key))}
        >
          {categories.map((cat) => (
            <DropdownItem key={cat}>{cat}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>

  </div>
</div>


      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredProjects && filteredProjects.length > 0 ? (
          filteredProjects.map((project: Project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Card
                className="bg-white/80 backdrop-blur-md border border-white/20 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-1"
                radius="lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    alt={project.name}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                    src={project.image}
                    removeWrapper
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      color="primary"
                      variant="shadow"
                      size="lg"
                      radius="full"
                      className="font-medium text-black hover:translate-y-1 transition-transform duration-300 z-50"
                      endContent={<FiArrowLeft className="text-xl" />}
                      onPress={() =>
                        router.push(`/feasibility-studies/${project.id}`)
                      }
                    >
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                        {project.category || "عام"}
                      </div>
                      <h3 className="text-xl font-bold line-clamp-1 mb-2 text-default-900">
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-default-600 line-clamp-2 text-sm mb-4">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-default-200">
                    <div>
                      <span className="text-2xl font-bold text-default-900">
                        {Number(project.price).toLocaleString("ar-SA")}
                      </span>
                      <span className="text-default-500 text-sm mr-1">ريال</span>
                    </div>
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      radius="full"
                      className="font-medium"
                    >
                      طلب دراسة الجدوى
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold text-default-600">
              لم يتم العثور على دراسات جدوى
            </h3>
            <p className="text-default-400 mt-2">
              جرب تغيير التصنيف أو البحث بكلمات مختلفة
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
