import { motion } from 'framer-motion';
import { Button } from '@nextui-org/button';
import { FiShare2 } from 'react-icons/fi';

interface NavigationBarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  navigationItems: Array<{ id: string; label: string; }>;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeSection,
  setActiveSection,
  navigationItems,
}) => {
  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex gap-8">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                className={`relative py-2 ${
                  activeSection === item.id ? 'text-primary-800 font-bold' : 'text-gray-600'
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-800"
                  />
                )}
              </motion.button>
            ))}
          </div>
          <Button
            isIconOnly
            variant="light"
            aria-label="Share"
            startContent={<FiShare2 className="text-gray-600" />}
          />
        </div>
      </div>
    </div>
  );
};