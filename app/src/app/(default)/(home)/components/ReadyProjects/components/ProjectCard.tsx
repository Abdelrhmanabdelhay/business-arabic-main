import React, { useState, useEffect } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      controls.start("hover");
    } else {
      controls.start("rest");
    }
  }, [isHovered, controls]);

  const cardVariants: Variants = {
    rest: { scale: 1, rotateY: 0 },
    hover: { scale: 1.05, rotateY: 5 },
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden perspective-1000"
      variants={cardVariants}
      initial="rest"
      animate={controls}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}>
      <div className="relative h-48">
        <Image
          src={project.image}
          alt={project.name}
          fill={true}
          className="rounded-t-2xl object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-primary-800 bg-opacity-50 flex items-center justify-center">
          <Link href={`/feasibility-studies/${project.id}`} passHref>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white text-primary-800 font-bold py-2 px-4 rounded-full shadow-lg">
              عرض التفاصيل
            </motion.button>
          </Link>
        </motion.div>
      </div>
      <div className="p-4 text-gray-800">
        <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{project.description}</p>
        <p className="text-primary-800 font-bold">{project.price} ريال</p>
      </div>
    </motion.div>
  );
};
