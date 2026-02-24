"use client";
import React, { useEffect, useState } from "react";

import { useDeleteProjectMutation, GetProjects } from "@/lib/actions/projects.actions";

import { Spinner } from "@nextui-org/spinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ProjectsComponent from "./components/ProjectsComponent/ProjectsComponent";

function Page() {
  const [selectedId, setSelectedId] = useState<string>("");

  // Get Projects Query
  const {
    data: projectsData,
    error: fetchError,
    isError: isFetchError,
    isPending: isFetching,
    isSuccess: isFetchSuccess,
  } = GetProjects({ limit: 10, page: 1 });

  // Delete Mutation
const {
  mutate: deleteProject,
  isPending: isDeleting,
  error: deleteError,
  isError: isDeleteError,
  isSuccess: isDeleteSuccess,
} = useDeleteProjectMutation(selectedId);


  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      setSelectedId(id);
      await deleteProject({ id });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء حذف الفكرة");
    } finally {
      setSelectedId("");
    }
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("تم حذف الفكرة بنجاح");
      setSelectedId("");
    }
  }, [isDeleteSuccess]);

  // Loading state
  if (isFetching) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center">
          <Spinner size="lg" color="primary" className="mb-4" />
          <p className="text-default-500 animate-pulse">جاري تحميل دراسات الجدوي...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (isFetchError) {
    const errorMessage = fetchError?.message || "حدث خطأ أثناء تحميل الأفكار";

    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-danger mb-4 text-xl">
            <span className="block text-4xl mb-2">⚠️</span>
            {errorMessage}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-800 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            إعادة المحاولة
          </button>
        </motion.div>
      </div>
    );
  }
  // Success state
  if (isFetchSuccess && projectsData) {

    return (
      <ProjectsComponent
        projects={projectsData.projects || []}
        onDelete={handleDelete} 
        isDeleting={isDeleting}
        selectedId={selectedId}
        isDeleted={isDeleteSuccess}
      />
    );
  }

  // Fallback for unexpected state
  return null;
}

export default Page;
