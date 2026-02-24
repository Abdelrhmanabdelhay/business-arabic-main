import { motion } from 'framer-motion';
import { Button } from '@nextui-org/button';
import { FiArrowRight } from 'react-icons/fi';

export const CallToAction: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 text-center"
    >
      <Button
        size="lg"
        color="primary"
        className="font-bold text-lg px-12 py-6 bg-gradient-to-r from-primary-800 to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
        endContent={<FiArrowRight />}
      >
        ابدأ تنفيذ المشروع الآن
      </Button>
    </motion.div>
  );
};