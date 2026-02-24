"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { y: -30, opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-16 relative">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-800 rounded-full opacity-20 animate-pulse" />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-800 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              عن الشركة
            </h3>
            <p className="text-blue-200 leading-relaxed">
              نحن نساعد رواد الأعمال على بناء وتنمية أعمالهم في العالم العربي من
              خلال حلول مبتكرة وتقنيات متطورة.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {["من نحن", "خدماتنا", "مشاريعنا", "اتصل بنا"].map(
                (item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={`/${item.replace(" ", "-")}`}
                      className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-2 text-indigo-400">›</span> {item}
                    </Link>
                  </motion.li>
                ),
              )}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              تواصل معنا
            </h3>
            <p className="text-blue-200">البريد الإلكتروني: info@example.com</p>
            <p className="text-blue-200">الهاتف: +1234567890</p>
            <div className="flex space-x-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="text-blue-200 hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                ),
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mt-16 pt-8 border-t border-blue-800 text-center"
        >
          <p className="text-blue-300">
            &copy; {new Date().getFullYear()} اسم شركتك. جميع الحقوق محفوظة.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
