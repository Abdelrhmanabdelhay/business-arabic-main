import { motion } from 'framer-motion';
import { Chip } from '@nextui-org/chip';
import { FiTarget, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { ProjectIdea } from '@/types/project.type';


interface HeroSectionProps {
  idea: ProjectIdea;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ idea }) => {
  return (
    <div className="relative bg-gradient-to-r from-primary-800 to-blue-900 py-20 px-4">
      <div className="absolute inset-0 bg-grid-white/[0.1] mask-fade-out" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {idea.title}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            {idea.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Chip
              className="bg-white/20 backdrop-blur-lg border border-white/30"
              startContent={<FiTarget className="text-white" />}
            >
              {idea.category}
            </Chip>
            <Chip
              className="bg-white/20 backdrop-blur-lg border border-white/30"
              startContent={<FiDollarSign className="text-white" />}
            >
              {idea.marketSize}
            </Chip>
            <Chip
              className="bg-white/20 backdrop-blur-lg border border-white/30"
              startContent={<FiTrendingUp className="text-white" />}
            >
              {idea.potential}
            </Chip>
          </div>
        </motion.div>
      </div>
    </div>
  );
};