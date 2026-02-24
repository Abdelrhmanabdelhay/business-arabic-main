// components/ProjectIdea/Overview.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody } from '@nextui-org/card';
import { FiCheckCircle, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { ProjectIdea } from '@/types/project.type';


interface OverviewProps {
  idea: ProjectIdea;
}

export const Overview: React.FC<OverviewProps> = ({ idea }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Opportunities Section */}
        <Card className="backdrop-blur-lg border border-gray-200">
          <CardBody>
            <h3 className="text-xl font-bold text-primary-800 mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-success" />
              الفرص
            </h3>
            <div className="space-y-4">
              {idea.opportunities?.map((opportunity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-success-50 rounded-lg backdrop-blur-lg hover:bg-success-100 transition-colors duration-300"
                >
                  <FiArrowRight className="text-success flex-shrink-0" />
                  <span className="text-gray-700">{opportunity}</span>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Challenges Section */}
        <Card className="backdrop-blur-lg border border-gray-200">
          <CardBody>
            <h3 className="text-xl font-bold text-primary-800 mb-4 flex items-center gap-2">
              <FiAlertTriangle className="text-warning" />
              التحديات
            </h3>
            <div className="space-y-4">
              {idea.challenges?.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-warning-50 rounded-lg backdrop-blur-lg hover:bg-warning-100 transition-colors duration-300"
                >
                  <FiAlertTriangle className="text-warning flex-shrink-0" />
                  <span className="text-gray-700">{challenge}</span>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default Overview;