"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';

// Types
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeUnitProps {
  value: number;
  label: string;
}

interface SocialLink {
  icon: React.ComponentType<{ size: number }>;
  href: string;
  label: string;
}

// Constants
const LAUNCH_DATE = '2024-10-25';

const SOCIAL_LINKS: SocialLink[] = [
  { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' }
];

// Custom Hook
const useCountdown = (targetDate: string): TimeLeft => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// Sub-components
const TimeUnit: React.FC<TimeUnitProps> = ({ value, label }) => (
  <motion.div 
    className="flex flex-col items-center"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 w-24 h-24 flex items-center justify-center mb-2">
      <span className="text-4xl font-bold bg-gradient-to-l from-blue-400 to-indigo-400 bg-clip-text text-transparent">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="text-blue-200 text-sm">{label}</span>
  </motion.div>
);

const ComingSoon: React.FC = () => {
  const timeLeft = useCountdown(LAUNCH_DATE);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (err) {
      setError('حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden" 
      dir="rtl"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[1, 2].map((index) => (
          <motion.div
            key={index}
            className={`absolute ${
              index === 1 ? 'top-1/4 left-1/4' : 'bottom-1/4 right-1/4'
            } w-72 h-72 bg-${index === 1 ? 'blue' : 'indigo'}-500 rounded-full mix-blend-multiply filter blur-xl opacity-20`}
            animate={{
              scale: [1, index === 1 ? 1.2 : 1, 1],
              rotate: [0, index === 1 ? 90 : -90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            قريباً
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-2xl mx-auto">
            نعمل على تطوير منصة مبتكرة لمساعدة رواد الأعمال في العالم العربي
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TimeUnit value={timeLeft.days} label="يوم" />
          <TimeUnit value={timeLeft.hours} label="ساعة" />
          <TimeUnit value={timeLeft.minutes} label="دقيقة" />
          <TimeUnit value={timeLeft.seconds} label="ثانية" />
        </motion.div>

        {/* Newsletter Form */}
        <motion.div
          className="max-w-md mx-auto mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              className="w-full bg-white/10 backdrop-blur-lg text-white px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={isSubmitting}
              required
            />
            <AnimatePresence>
              {!isSubscribed && !error && (
                <motion.button
                  type="submit"
                  className="absolute left-2 top-2 bottom-2 bg-gradient-to-l from-blue-500 to-indigo-500 text-white px-6 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? 'جارِ التسجيل...' : 'إخطاري عند الإطلاق'}
                </motion.button>
              )}
              {isSubscribed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute left-2 top-2 bottom-2 bg-green-500 text-white px-6 rounded-full flex items-center justify-center"
                >
                  تم التسجيل بنجاح!
                </motion.div>
              )}
            </AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </form>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }, index) => (
            <motion.a
              key={index}
              href={href}
              aria-label={label}
              className="text-blue-200 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={24} />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;