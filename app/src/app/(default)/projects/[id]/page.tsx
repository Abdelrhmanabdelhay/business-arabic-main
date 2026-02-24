"use client";
import React from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  FaShoppingCart,
  FaCalendar,
  FaTag,
  FaInfoCircle,
} from "react-icons/fa";
import Image from "next/image";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { useProjectDetails } from "./api/queries";
import { formatDate } from "@/utils/general";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-[500px] rounded-t-xl"></div>
    <div className="p-8 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

function Project() {
  const { id } = useParams();
  const { data: project, isPending, isError } = useProjectDetails(id as string);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="w-full shadow-2xl overflow-hidden bg-white">
            <CardBody className="p-0">
              <LoadingSkeleton />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">
            عذراً، حدث خطأ في تحميل تفاصيل المشروع
          </h1>
          <p className="mt-2 text-gray-600">
            يرجى المحاولة مرة أخرى في وقت لاحق
          </p>
        </div>
      </div>
    );
  }

  const descriptionLines = project.description.split('\r\n').filter(line => line.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full shadow-2xl overflow-hidden bg-white">
          <CardBody className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Section */}
              <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Content Section */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Chip
                      startContent={<FaTag className="ml-1" />}
                      variant="flat"
                      color="primary"
                    >
                      {project.category}
                    </Chip>
                    <Chip
                      startContent={<FaCalendar className="ml-1" />}
                      variant="flat"
                      color="secondary"
                    >
                      {formatDate(project.createdAt)}
                    </Chip>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FaInfoCircle className="ml-2" />
                    تفاصيل دراسة الجدوى
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    {descriptionLines.map((line, index) => (
                      <p key={index} className="leading-relaxed">
                        {line.startsWith('-') ? (
                          <span className="flex items-start">
                            <span className="text-primary-600 ml-2">•</span>
                            {line.substring(1)}
                          </span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">سعر دراسة الجدوى</h2>
                      <p className="text-4xl font-extrabold">
                        {project.price} ريال
                      </p>
                    </div>
                    <Button
                      size="lg"
                      color="warning"
                      className="font-bold text-lg px-8 py-6 bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300"
                      endContent={<FaShoppingCart size={20} />}
                    >
                      اشتري الآن
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

export default Project;
