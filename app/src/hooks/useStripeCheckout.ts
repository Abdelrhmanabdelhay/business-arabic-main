import { axiosInstance } from "@/lib/axios";
import { useState } from "react";

interface CheckoutSessionParams {
  serviceId: string;
  serviceType: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (params: CheckoutSessionParams) => {
    setLoading(true);
    setError(null);

    console.log("Sending checkout params:", params);

    try {
      const response = await axiosInstance.post(
        "/stripe/create-subscription-checkout-session",
        params
      );

      const { url } = response.data;

      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create checkout session";
      setError(errorMessage);
      console.error("Stripe checkout error response:", err.response?.data);
      console.error("Stripe checkout error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refundPayment = async (paymentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/stripe/refund/${paymentId}`
      );

      console.log("Refund successful:", response.data);

      // Sync the payment status immediately to update UI
      await syncPaymentStatus(paymentId);

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to refund payment";
      setError(errorMessage);
      console.error("Refund error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncPaymentStatus = async (paymentId: string) => {
    try {
      const response = await axiosInstance.post(
        `/stripe/sync/${paymentId}`
      );

      console.log("Payment status synced:", response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to sync payment status";
      console.error("Sync error:", err);
      throw err;
    }
  };

  return {
    createCheckoutSession,
    refundPayment,
    syncPaymentStatus,
    loading,
    error,
  };
};
