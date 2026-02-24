import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ProjectCard } from "./components/ProjectCard";
import { IdeaCard } from "./components/IdeaCard";
import { useParticleEffect } from "./hooks/useParticleEffect";
import { useHomeProjects } from "./api/queries";
import { Project, Idea } from "./types";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-2xl" />
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

export const ProjectSections: React.FC = () => {
  useParticleEffect();

  const { data: projectsData, isPending: isProjectsLoading, isError: isProjectsError } = useHomeProjects();

  // const { data: ideasData, isPending: isIdeasLoading, isError: isIdeasError } = useHomeIdeas();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((key) => (
        <motion.div key={key} variants={itemVariants}>
          <LoadingSkeleton />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-white py-16 overflow-hidden">
      <canvas id="particle-canvas" className="absolute inset-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section initial="hidden" animate="visible" variants={containerVariants} className="mb-16">
          <motion.h2 variants={itemVariants} className="text-5xl font-bold text-center mb-12 text-primary-800">
دراسات جدوى     
          </motion.h2>

          {isProjectsError ? (
            <div className="text-center text-red-500">عذراً، حدث خطأ في تحميل دراسات الجدوى. يرجى المحاولة مرة أخرى.</div>
          ) : isProjectsLoading ? (
            renderLoadingSkeletons()
          ) : (
            <>
              <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projectsData?.projects.map((project: Project) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={itemVariants} className="text-center mt-12">
                <Link href="/feasibility-studies" passHref>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(62, 125, 227, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-800 text-white font-bold py-3 px-8 rounded-full shadow-lg">
                    عرض جميع دراسات الجدوي
                  </motion.button>
                </Link>
              </motion.div>
            </>
          )}
        </motion.section>

        {/* <motion.section initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 variants={itemVariants} className="text-5xl font-bold text-center mb-12 text-primary-800">
            نماذج من نادي أفكار المشاريع
          </motion.h2>

          {isIdeasError ? (
            <div className="text-center text-red-500">عذراً، حدث خطأ في تحميل الأفكار. يرجى المحاولة مرة أخرى.</div>
          ) : isIdeasLoading ? (
            renderLoadingSkeletons()
          ) : (
            <>
              <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {ideasData?.ideas.map((idea: Idea) => (
                  <motion.div key={idea.id} variants={itemVariants}>
                    <IdeaCard idea={idea} />
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={itemVariants} className="text-center mt-12">
                <Link href="/ideas-club" passHref>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-800 text-white font-bold py-3 px-8 rounded-full shadow-lg">
                    الانضمام إلى نادي الأفكار
                  </motion.button>
                </Link>
              </motion.div>
            </>
          )}
        </motion.section> */}
      </div>
    </div>
  );
};

export default ProjectSections;
