import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

interface FeatureCardProps {
  feature: string;
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 bg-primary-800/5 rounded-xl backdrop-blur-lg hover:bg-primary-800/10 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary-800 rounded-full p-2 text-white">
          <FiCheckCircle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-primary-800 mb-2">ميزة رئيسية</h4>
          <p className="text-gray-600">{feature}</p>
        </div>
      </div>
    </motion.div>
  );
};