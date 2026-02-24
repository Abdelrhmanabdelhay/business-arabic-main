"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  FaShoppingCart,
  FaCalendar,
  FaTag,
  FaInfoCircle,
} from "react-icons/fa";
import Image from "next/image";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { useFeasibilityDetails } from "./api/queries";
import { formatDate } from "@/utils/general";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-[500px] rounded-t-xl"></div>
    <div className="p-8 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

function FeasibilityDetail() {
  const { id } = useParams();
  const { data: project, isPending, isError } = useFeasibilityDetails(id as string);
  const { createCheckoutSession, loading } = useStripeCheckout();
  const [error, setError] = useState<string | null>(null);

  const handleBuyNow = async () => {
    if (!project) return;

    setError(null);

    try {
      await createCheckoutSession({
        serviceId: project.id,
        serviceType: "FeasibilityStudy",
        name: project.name,
        description: project.description || "",
        image: project.image,
        price: Math.round(parseFloat(String(project.price))), // Convert to cents for Stripe
        category: project.category,
      });
    } catch (err) {
      setError("حدث خطأ أثناء بدء عملية الدفع. يرجى المحاولة مرة أخرى");
    }
  };

  if (isPending) return <LoadingSkeleton />;

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">عذراً، حدث خطأ في تحميل تفاصيل دراسة الجدوي</h1>
          <p className="mt-2 text-gray-600">يرجى المحاولة مرة أخرى في وقت لاحق</p>
        </div>
      </div>
    );
  }

  const descriptionLines = (project.description || "").split('\r\n').filter(line => line.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full shadow-2xl overflow-hidden bg-white">
          <CardBody className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Chip
                      startContent={<FaTag className="ml-1" />}
                      variant="flat"
                      color="primary"
                    >
                      {project.category}
                    </Chip>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FaInfoCircle className="ml-2" />
                    تفاصيل دراسة الجدوى
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    {descriptionLines.map((line, index) => (
                      <p key={index} className="leading-relaxed">
                        {line.startsWith('-') ? (
                          <span className="flex items-start">
                            <span className="text-primary-600 ml-2">•</span>
                            {line.substring(1)}
                          </span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">سعر دراسة الجدوى</h2>
                      <p className="text-4xl font-extrabold">{project.price} ريال</p>
                    </div>
                    <Button
                      size="lg"
                      color="warning"
                      className="font-bold text-lg px-8 py-6 bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300"
                      endContent={<FaShoppingCart size={20} />}
                      onClick={handleBuyNow}
                      isLoading={loading}
                      disabled={loading}
                    >
                      اشتري الآن
                    </Button>
                  </div>
                  {error && (
                    <p className="text-red-200 text-sm mt-4">{error}</p>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

export default FeasibilityDetail;
