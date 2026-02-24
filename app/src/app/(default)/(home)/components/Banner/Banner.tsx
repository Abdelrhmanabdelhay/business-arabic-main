"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/button";
import NextLink from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClipboard,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeatureCard = ({
  title,
  desc,
  icon,
  color,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string; // e.g. "bg-purple-600"
}) => {
  return (
    <div className="relative w-full h-full">
      {/* Icon floating */}
      <div className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white rounded-full p-1.5 sm:p-2 shadow-lg">
          <div
            className={`${color} text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center`}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className={`${color} h-24 sm:h-28 flex items-center justify-center px-4 sm:px-6`}>
          <h3 className="text-white font-bold text-lg sm:text-xl text-center leading-snug pt-3 sm:pt-5">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 text-center flex-grow">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Banner = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-indigo-900 min-h-screen sm:min-h-[120vh] py-16 sm:py-24 flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 max-md:hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          initial={{ scale: 1.2, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="b" gradientTransform="rotate(30 .5 .5)">
                <stop offset="0%" stopColor="#4C51BF" />
                <stop offset="100%" stopColor="#3182CE" />
              </linearGradient>
            </defs>
            <path
              d="M0 0v1000h1000V0H0zm467 111c77-2 171 32 238 101 98 101 122 258 60 387s-200 204-339 189-253-129-279-270c-26-142 41-290 168-360 66-36 133-46 152-47z"
              fill="url(#b)"
            />
          </svg>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center">
          <motion.h1
            className="text-xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 leading-tight px-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            نمو أعمالك يبدأ هنا
          </motion.h1>

       <motion.p
  className="text-base sm:text-lg md:text-2xl text-blue-100 mb-20 sm:mb-24 max-w-3xl mx-auto leading-relaxed px-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            اكتشف فرص جديدة، طور مهاراتك، وحقق النجاح في عالم الأعمال العربي
          </motion.p>

          {/* Cards - Responsive Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 mb-12 sm:mb-16 px-2 sm:px-0"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
    

            <FeatureCard
              title="أفضل أفكار المشاريع المميزة في السعودية"
              desc="نقدم لك دراسات جدوى احترافية لأفضل مشاريع واعدة ومميزة في السوق السعودي، تم اختيار أفضل المشاريع بعناية فائقة وذلك بناءً على الفرص الحقيقية وحجم الطلب والنمو المتوقع."
              icon={<FiClipboard size={28} />}
              color="bg-blue-600"
            />
            <FeatureCard
              title="حوّل فكرتك إلى مشروع مربح بخطة مدروسة"
              desc="إذا كانت لديك فكرة مشروع، فنحن في بزنس برو نحوّلها إلى دراسة جدوى احترافية ودقيقة مبنية على بيانات فعلية وتحليل عميق للسوق السعودي، ونعمل معك خطوة بخطوة حتى الفكرة مشروع قابل للتنفيذ."
              icon={<FiTrendingUp size={28} />}
              color="bg-orange-500"
            />
        <FeatureCard
              title="اكتشف فرصًا قبل أن تصبح مزدحمة"
              desc="انضم إلى نادي أفكار المشاريع واحصل على أفكار استثمارية مختارة بعناية من أفضل الأعمال حول العالم. رصد الاتجاهات الجديدة لتكون من أوائل الداخلين للسوق وليس من المتأخرين."
              icon={<FiUsers size={28} />}
              color="bg-purple-600"
            />
          </motion.div>

        </div>
      </div>

{/* Bottom wave */}
<div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none -mb-1">
  <svg
    className="relative block w-[calc(100%+2px)] -ml-[1px]"
    style={{ height: "80px" }}
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,0 C600,120 1000,0 1200,120 L1200,120 L0,120 Z"
      className="fill-white"
    />
  </svg>
</div>
    </div>
  );
};