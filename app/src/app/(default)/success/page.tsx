"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardBody className="text-center p-8 space-y-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">
                شكراً لك!
              </h1>
              <p className="text-gray-600">
                تم استلام دفعتك بنجاح. سيتم معالجتها قريباً
              </p>
            </div>

            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
                <p>معرّف الجلسة: {sessionId}</p>
              </div>
            )}

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
              <Link href="/my-orders" className="w-full block">
                <Button
                  size="lg"
                  variant="bordered"
                  className="w-full font-bold"
                >
                  عرض طلباتي
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              ستتلقى تأكيد الدفع عبر بريدك الإلكتروني قريباً
            </p>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
