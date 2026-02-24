// components/ProjectIdea/Analysis.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { Chip } from '@nextui-org/chip';
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiUsers, 
  FiDollarSign,
  FiActivity,
  FiPieChart
} from 'react-icons/fi';
import { ProjectIdea } from '@/types/project.type';

interface AnalysisProps {
  idea: ProjectIdea;
}

interface MarketTrend {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface CompetitorAnalysis {
  name: string;
  marketShare: number;
  strengthLevel: 'high' | 'medium' | 'low';
}

interface FinancialMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

const Analysis: React.FC<AnalysisProps> = ({ idea }) => {
  // Example data - in a real app, this would come from props or API
  const marketTrends: MarketTrend[] = [
    { 
      label: "نمو السوق السنوي",
      value: "23%",
      change: 5.2,
      icon: <FiTrendingUp />
    },
    {
      label: "حجم السوق المستهدف",
      value: "2.5M",
      change: 12.8,
      icon: <FiPieChart />
    },
    {
      label: "عدد العملاء المحتملين",
      value: "850K",
      change: 8.4,
      icon: <FiUsers />
    }
  ];

  const competitors: CompetitorAnalysis[] = [
    { name: "المنافس الأول", marketShare: 35, strengthLevel: 'high' },
    { name: "المنافس الثاني", marketShare: 25, strengthLevel: 'medium' },
    { name: "المنافس الثالث", marketShare: 15, strengthLevel: 'low' }
  ];

  const financialMetrics: FinancialMetric[] = [
    { label: "متوسط العائد المتوقع", value: "45,000 ريال", trend: 'up' },
    { label: "تكلفة الاستحواذ على العميل", value: "250 ريال", trend: 'down' },
    { label: "هامش الربح المتوقع", value: "32%", trend: 'stable' }
  ];

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-primary';
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* Market Trends Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketTrends.map((trend, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-lg border border-gray-200">
                <CardBody className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-800/10 rounded-lg">
                      <span className="text-primary-800 text-xl">
                        {trend.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{trend.label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary-800">
                          {trend.value}
                        </span>
                        <Chip
                          size="sm"
                          className={`${trend.change > 0 ? 'bg-success-50 text-success' : 'bg-danger-50 text-danger'}`}
                        >
                          {trend.change > 0 ? '+' : ''}{trend.change}%
                        </Chip>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Market Share & Competition Analysis */}
        <Card className="backdrop-blur-lg border border-gray-200">
          <CardHeader>
            <h3 className="text-xl font-bold text-primary-800 flex items-center gap-2">
              <FiBarChart2 />
              تحليل المنافسة
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {competitors.map((competitor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{competitor.name}</span>
                    <Chip
                      size="sm"
                      className={`${getStrengthColor(competitor.strengthLevel)}`}
                    >
                      {competitor.marketShare}% حصة سوقية
                    </Chip>
                  </div>
                  <Progress 
                    value={competitor.marketShare}
                    className="h-2"
                    color={competitor.strengthLevel === 'high' ? 'danger' : 
                           competitor.strengthLevel === 'medium' ? 'warning' : 'success'}
                  />
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Financial Metrics */}
        <Card className="backdrop-blur-lg border border-gray-200">
          <CardHeader>
            <h3 className="text-xl font-bold text-primary-800 flex items-center gap-2">
              <FiDollarSign />
              المؤشرات المالية
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {financialMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary-800">
                        {metric.value}
                      </span>
                      <FiActivity className={`
                        ${metric.trend === 'up' ? 'text-success' : 
                          metric.trend === 'down' ? 'text-danger' : 'text-warning'}
                      `} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Market Potential Summary */}
        <Card className="backdrop-blur-lg border border-gray-200">
          <CardBody className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-primary-800 mb-2">نظرة عامة على إمكانات السوق</h3>
                <p className="text-gray-600">{idea.description}</p>
              </div>
              <Chip
                size="lg"
                className="bg-primary-800 text-white"
              >
                {idea.potential} الإمكانات
              </Chip>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default Analysis;