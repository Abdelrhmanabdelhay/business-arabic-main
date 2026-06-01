import { createCheckoutSession, createTestCheckoutSession, createSubscriptionCheckoutSession, getUserOrders, refundPayment, syncPaymentStatus,renewCheckoutSession } from '../utils/stripe';
import { Request, Response } from 'express';

export const handleCreateCheckoutSession = (req: Request, res: Response) => {
  return createCheckoutSession(req, res);
};

export const handleRenewCheckoutSession = (req: Request, res: Response) => {
  return renewCheckoutSession(req, res);
};

export const handleCreateTestCheckoutSession = (req: Request, res: Response) => {
  return createTestCheckoutSession(req, res);
};

export const handleCreateSubscriptionCheckoutSession = (req: Request, res: Response) => {
  return createSubscriptionCheckoutSession(req, res);
};

export const handleGetUserOrders = (req: Request, res: Response) => {
  return getUserOrders(req, res);
};

export const handleRefundPayment = (req: Request, res: Response) => {
  return refundPayment(req, res);
};

export const handleSyncPaymentStatus = (req: Request, res: Response) => {
  return syncPaymentStatus(req, res);
};

