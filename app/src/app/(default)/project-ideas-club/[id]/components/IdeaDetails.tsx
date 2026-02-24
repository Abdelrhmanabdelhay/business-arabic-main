"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { FaCalendar, FaTag } from "react-icons/fa";
import TextEditor from "@/components/PagesComponents/TextEditor/TextEditor";
import { useIdeaDetails } from "../api/queries";
import { formatDate } from "@/utils/general";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-xl mb-8" />
    <div className="max-w-7xl mx-auto px-4">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const ProjectIdeaPage = () => {
  const { id } = useParams();
  const { data: idea, isPending, isError } = useIdeaDetails(id as string);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError || !idea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-2xl font-bold text-red-600">عذراً، حدث خطأ في تحميل تفاصيل الفكرة</h1>
          <p className="mt-2 text-gray-600">يرجى المحاولة مرة أخرى في وقت لاحق</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 px-4">
        <motion.div 
          className="max-w-5xl mx-auto text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-6">{idea.name}</h1>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">{idea.description}</p>
          <div className="flex flex-wrap gap-4">
            <Chip
              startContent={<FaTag className="ml-2" />}
              variant="flat"
              color="warning"
              className="text-white text-lg py-3"
            >
              {idea.category}
            </Chip>
            <Chip
              startContent={<FaCalendar className="ml-2" />}
              variant="flat"
              color="warning"
              className="text-white text-lg py-3"
            >
              {formatDate(idea.createdAt)}
            </Chip>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl">
            <CardBody className="p-8">
              <TextEditor
                // @ts-ignore
                blocks={idea.content}
                editable={false}
              />
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectIdeaPage;
