import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Idea } from "../types";

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  // Extract potential from content if available
  const potential = idea.content?.potential || "متوسط";

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden perspective-1000">
      <div className="p-4 text-gray-800">
        <h3 className="text-xl font-semibold mb-2">{idea.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{idea.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="bg-primary-800 text-white px-2 py-1 rounded-full text-xs">
            {idea.category}
          </span>
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
            الإمكانات: {potential}
          </span>
        </div>
      </div>
      <div className="bg-gray-100 p-4">
        <Link href={`/project-ideas-club/${idea.id}`} passHref>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-primary-800 text-white font-bold py-2 px-4 rounded-full shadow-lg">
            استكشف الفكرة
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};
