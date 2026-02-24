"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { FaTimesCircle } from "react-icons/fa";
import Link from "next/link";

export default function CanceledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardBody className="text-center p-8 space-y-6">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto" />

            <div>
              <h1 className="text-3xl font-bold text-red-600 mb-2">
                تم إلغاء الدفع
              </h1>
              <p className="text-gray-600">
                لم تكتمل عملية الدفع. إذا كانت لديك أي مشاكل، يرجى المحاولة مرة أخرى أو الاتصال بنا
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/" className="w-full block">
                <Button
                  size="lg"
                  color="primary"
                  className="w-full font-bold"
                >
                  العودة إلى الصفحة الرئيسية
                </Button>
              </Link>
              <Link href="/feasibility-studies" className="w-full block">
                <Button
                  size="lg"
                  variant="bordered"
                  className="w-full font-bold"
                >
                  استعرض دراسات الجدوى
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              إذا واجهت أي مشاكل، يرجى التواصل مع فريق الدعم
            </p>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
