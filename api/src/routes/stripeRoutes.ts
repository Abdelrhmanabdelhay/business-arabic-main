
import express ,{ Router } from 'express';
import { handleCreateCheckoutSession, handleCreateSubscriptionCheckoutSession, handleCreateTestCheckoutSession, handleGetUserOrders, handleRefundPayment, handleSyncPaymentStatus } from '../controllers/stripeController';
import { authenticate } from '../middlewares/auth';
import { stripeWebHook } from '../utils/stripe';

const router = Router();
/**
 * @swagger
 * /api/stripe/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     description: Receives Stripe event notifications (e.g., payment completed, payment failed)
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Stripe event payload
 *     responses:
 *       200:
 *         description: Webhook received and processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Webhook error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Webhook Error - Invalid signature
 */
// Post webhook for Stripe events
router.post("/webhook",
  stripeWebHook
);

// POST /create-checkout-session
/**
 * @swagger
 * /api/stripe/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout session
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priceId:
 *                 type: string
 *                 example: price_1234
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://checkout.stripe.com/pay/cs_test_123
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 * /api/stripe/create-subscription-checkout-session:
 *   post:
 *     summary: Create a Stripe Subscription Checkout session
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: string
 *                 example: "abc123"
 *               serviceType:
 *                 type: string
 *                 example: "membership"
 *               name:
 *                 type: string
 *                 example: "Pro Membership"
 *               description:
 *                 type: string
 *                 example: "Monthly subscription for Pro features"
 *               image:
 *                 type: string
 *                 example: "https://picsum.photos/200/300"
 *               price:
 *                 type: integer
 *                 example: 1500
 *               category:
 *                 type: string
 *                 example: "premium"
 *     responses:
 *       200:
 *         description: Subscription checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://checkout.stripe.com/pay/cs_test_sub_789
 *                 id:
 *                   type: string
 *                   example: cs_test_sub_789
 *                 message:
 *                   type: string
 *                   example: Subscription checkout session created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 * /api/stripe/create-test-checkout-session:
 *   post:
 *     summary: Create a Stripe test Checkout session for different scenarios
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testScenario:
 *                 type: string
 *                 enum: [success, card_decline, insufficient_funds, processing_error]
 *                 example: success
 *     responses:
 *       200:
 *         description: Test checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://checkout.stripe.com/pay/cs_test_456
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

router.post('/create-checkout-session', authenticate, handleCreateCheckoutSession);

// POST /create-test-checkout-session
router.post('/create-test-checkout-session', authenticate, handleCreateTestCheckoutSession);

// POST /create-subscription-checkout-session
router.post('/create-subscription-checkout-session', authenticate, handleCreateSubscriptionCheckoutSession);

// GET /my-orders
/**
 * @swagger
 * /api/stripe/my-orders:
 *   get:
 *     summary: Get user's orders
 *     description: Retrieve all orders/payments for the authenticated user
 *     tags: [Stripe]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       payNumber:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       serviceId:
 *                         type: string
 *                       serviceType:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [pending, paid, failed, cancelled]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 count:
 *                   type: number
 *       401:
 *         description: Unauthorized - user not authenticated
 */
router.get("/my-orders", authenticate, handleGetUserOrders);

// POST /refund/:paymentId
/**
 * @swagger
 * /api/stripe/refund/{paymentId}:
 *   post:
 *     summary: Refund a payment
 *     description: Process a refund for a completed payment
 *     tags: [Stripe]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to refund
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Refund processed successfully"
 *                 refundId:
 *                   type: string
 *                 amount:
 *                   type: number
 *                   description: "Refunded amount in SAR"
 *       400:
 *         description: Bad request or cannot refund this payment
 *       401:
 *         description: Unauthorized - user not authenticated
 *       403:
 *         description: Forbidden - not authorized to refund this payment
 *       404:
 *         description: Payment not found
 */
router.post("/refund/:paymentId", authenticate, handleRefundPayment);

// POST /sync/:paymentId
/**
 * @swagger
 * /api/stripe/sync/{paymentId}:
 *   post:
 *     summary: Sync payment status with Stripe
 *     description: Check if payment status has changed in Stripe (e.g., refunded from dashboard)
 *     tags: [Stripe]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to sync
 *     responses:
 *       200:
 *         description: Payment status synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment status synced"
 *                 payment:
 *                   type: object
 */
router.post("/sync/:paymentId", authenticate, handleSyncPaymentStatus);

export default router;
