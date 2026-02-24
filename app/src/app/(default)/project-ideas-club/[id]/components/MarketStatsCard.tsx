import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { useState } from 'react';
import { MarketStats } from '@/types/project.type';

interface MarketStatsCardProps {
  stats: MarketStats;
}

export const MarketStatsCard: React.FC<MarketStatsCardProps> = ({ stats }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden backdrop-blur-lg border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-primary-800/10 to-blue-900/10 pb-8">
          <h3 className="text-2xl font-bold text-primary-800">إحصائيات السوق</h3>
        </CardHeader>
        <CardBody className="relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary-800/5 to-transparent"
            animate={{
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          />
          <div className="space-y-8 relative z-10">
            {Object.entries(stats).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-bold text-primary-800">{value}%</span>
                </div>
                <Progress 
                  value={value}
                  color="primary"
                  className="h-2"
                  classNames={{
                    indicator: "bg-gradient-to-r from-primary-800 to-blue-600"
                  }}
                />
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};