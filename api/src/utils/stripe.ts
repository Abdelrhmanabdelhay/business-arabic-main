import { config } from "../config/environment";
const stripe = require("stripe")(config.stripe.SECRET_KEY);
import { Request, Response } from "express";
import payment from "../models/payment";
import { sendContactEmail } from "./nodemailer";

import Stripe from "stripe";
/**
 * Creates a Stripe Checkout session for a one-time payment.
 * @param {Request} req - The request object containing product details.
 * @param {Response} res - The response object to send the session URL.
 * @returns {Promise<void>}
 */

//create stripe web hook

import { AuthenticatedRequest } from "../middlewares/auth";
import createPaymentNumber from "./createPayNamber";

const createCheckoutSession = async (req: AuthenticatedRequest, res: Response) => {
  const domain = req.headers.origin;
  const userId = req.params?.id || req?.user?.id;
  const { serviceId, serviceType, name, description, image, price } =
    req.body;

  if (!serviceId || !serviceType) {
    return res
      .status(400)
      .json({ error: "serviceId and serviceType required" });
  }

  // Price is expected as SAR (original amount), not cents
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({ error: "price must be a valid positive number" });
  }

  const line_items = [
    {
      price_data: {
        currency: "sar",
        product_data: {
          name,
          description,
          images: [image],
        },
        unit_amount: Math.round(numPrice * 100), // Convert SAR to fils (cents)
      },

      quantity: 1,
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      line_items,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/canceled`,
    });

    if (!userId || !serviceId) {
      return res.status(400).json({ error: "userId and serviceId are required for payment creation" });
    }
    if (typeof userId !== "string" || typeof serviceId !== "string") {
      return res.status(400).json({ error: "userId and serviceId must be valid strings for payment creation" });
    }
    
    // Store original SAR price, not cents
    await payment.create({
      payNumber: createPaymentNumber(userId, serviceId),
      userId,
      serviceId,
      serviceType,
      amount: Math.round(numPrice), 
      stripeSessionId: session.id,
      status: "pending",
    });

    // Return the session URL instead of redirecting
    res.status(200).json({
      url: session.url,
      id: session.id,
      message: "Checkout session created successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error, message: "Failed to create checkout session" });
  }
};

const stripeWebHook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = config.stripe.WEBHOOK_SECRET;

  console.log("🔔 WEBHOOK CALLED");
  console.log("Signature present:", !!sig);
  console.log("Secret configured:", !!endpointSecret);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
    console.log("✅ Event verified:", event.type);
  } catch (err: any) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log("📤 Processing event:", event.type);

    switch (event.type) {
      // ✅ PAYMENT SUCCESS
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        await payment.findOneAndUpdate(
          { stripeSessionId: session.id },
          {
            status: "paid",
            stripePaymentIntentId: session.payment_intent,
          }
        );
        console.log("✅ Payment completed:", session.id);
        break;
      }

      // ❌ PAYMENT FAILED
      case "checkout.session.async_payment_failed": {
        const failedSession = event.data.object as Stripe.Checkout.Session;

        await payment.findOneAndUpdate(
          { stripeSessionId: failedSession.id },
          { status: "failed" }
        );
        console.log("❌ Payment failed:", failedSession.id);
        break;
      }

      // 💰 REFUND EVENTS - Handle both
      case "charge.refunded":
      case "charge.refund.updated": {
        const charge = event.data.object as Stripe.Charge;

        console.log("💰 Refund event received:", event.type);
        console.log("Charge ID:", charge.id);
        console.log("Payment Intent:", charge.payment_intent);
        console.log("Refunded:", charge.refunded);

        // Only process if actually refunded
        if (!charge.refunded) {
          console.log("⏭️ Charge not refunded yet, skipping");
          break;
        }

        // Try to find payment by stripePaymentIntentId
        let paymentRecord = await payment.findOne({
          stripePaymentIntentId: charge.payment_intent,
        });

        console.log("Payment found by stripePaymentIntentId:", !!paymentRecord);

        if (!paymentRecord && charge.payment_intent) {
          paymentRecord = await payment.findOne({
            $or: [
              { stripePaymentIntentId: charge.payment_intent },
              { stripeSessionId: { $regex: charge.payment_intent } },
            ],
          });
          console.log("Payment found by alternative lookup:", !!paymentRecord);
        }

        // Last resort: find most recent paid/refund_pending payment
        if (!paymentRecord) {
          console.warn("⚠️ Payment not found by normal queries, checking recent payments");
          const recentPayments = await payment
            .find({ 
              status: { $in: ["paid", "refund_pending", "refund_requested"] } 
            })
            .limit(5)
            .sort({ createdAt: -1 });
          
          if (recentPayments.length > 0) {
            // Try to match by checking Stripe for each
            for (const p of recentPayments) {
              try {
                const session = await stripe.checkout.sessions.retrieve(p.stripeSessionId);
                if (session.payment_intent === charge.payment_intent) {
                  paymentRecord = p;
                  console.log("✅ Found payment by session lookup:", p._id);
                  break;
                }
              } catch (err) {
                console.error("Error checking session:", err);
              }
            }
          }
        }

        if (!paymentRecord) {
          console.error("❌ Payment not found for refund event");
          break;
        }

        // Only update if not already cancelled
        if (paymentRecord.status !== "cancelled") {
          await payment.findByIdAndUpdate(paymentRecord._id, {
            status: "cancelled",
            refundedAt: new Date(charge.created * 1000),
            refundId: charge.refunds?.data?.[0]?.id || null,
          });
          console.log("✅ Refund completed for payment:", paymentRecord._id);
        } else {
          console.log("⏭️ Payment already cancelled, skipping");
        }

        break;
      }

      // 🔄 REFUND STATUS UPDATE
      case "refund.updated": {
        const refund = event.data.object as Stripe.Refund;

        console.log("🔄 Refund status update:", refund.status);

        if (refund.status === "failed") {
          await payment.findOneAndUpdate(
            { refundId: refund.id },
            { status: "paid" }
          );
          console.log("❌ Refund failed, restored to paid");
        }

        if (refund.status === "succeeded") {
          await payment.findOneAndUpdate(
            { refundId: refund.id },
            {
              status: "cancelled",
              refundedAt: new Date(refund.created * 1000),
            }
          );
          console.log("✅ Refund succeeded");
        }

        break;
      }

      default:
        console.log("ℹ️ Unhandled event type:", event.type);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    return res.status(500).send("Server error");
  }
};

// Test specific endpoint to simulate different payment scenarios
const createTestCheckoutSession = async (req: Request, res: Response) => {
  const domain = req.headers.origin;
  const { testScenario } = req.body;

  // Amount to simulate different test scenarios
  let amount = 2000; // Default $20.00

  // Use test amounts to simulate specific scenarios
  // See: https://docs.stripe.com/terminal/references/testing#physical-test-cards
  switch (testScenario) {
    case "card_decline":
      amount = 2000.02; // Test card decline
      break;
    case "insufficient_funds":
      amount = 2000.03; // Test insufficient funds
      break;
    case "processing_error":
      amount = 2000.05; // Test processing error
      break;
    default:
      amount = 2000; // Successful payment
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
              images: ["https://picsum.photos/200/300"],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/canceled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};



const createSubscriptionCheckoutSession = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const domain = req.headers.origin;
  const userId = req?.user?.id;
  const { serviceId, serviceType, name, description, image, price, category } = req.body;

  console.log("createSubscriptionCheckoutSession: incoming request", {
    path: req.path,
    method: req.method,
    userId,
    body: req.body,
    headers: {
      authorization: req.header("Authorization")
        ? "<present>"
        : "<missing>",
    },
  });

  // Detailed validation with specific error messages
  if (!serviceId) {
    return res.status(400).json({ error: "serviceId is required" });
  }
  if (!serviceType) {
    return res.status(400).json({ error: "serviceType is required" });
  }
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  if (!description) {
    return res.status(400).json({ error: "description is required" });
  }
  if (!image) {
    return res.status(400).json({ error: "image is required" });
  }
  if (!price) {
    return res.status(400).json({ error: "price is required" });
  }
  if (!category) {
    return res.status(400).json({ error: "category is required" });
  }

  // Validate price is a number
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({ error: "price must be a valid positive number" });
  }

  const line_items = [
    {
      price_data: {
        currency: "sar",
        product_data: {
          name,
          description,
          images: [image],
          metadata: {
            category,
          },
        },
        unit_amount: Math.round(numPrice * 100), // Convert SAR to fils (cents)
      },
      quantity: 1,
    },
  ];

  try {
    // Create a one-time payment (mode: "payment") instead of subscription
    const session = await stripe.checkout.sessions.create({
      line_items,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/canceled`,
    });

    if (typeof userId !== "string" || typeof serviceId !== "string") {
      return res.status(400).json({ error: "userId and serviceId must be valid strings for payment creation" });
    }
    // احفظ session في DB كـ pending
    await payment.create({
      payNumber: createPaymentNumber(userId, serviceId),
      userId,
      serviceId,
      serviceType,
      amount: Math.round(numPrice), // Store original SAR price, not cents
      stripeSessionId: session.id,
      status: "pending",
    });

    res.status(200).json({
      url: session.url,
      id: session.id,
      message: "Subscription checkout session created successfully",
    });
  } catch (error) {
    console.error("createSubscriptionCheckoutSession error:", error);
    const errMessage = (error && (error as any).message) || error;
    res.status(400).json({ error: errMessage, message: "Failed to create subscription checkout session" });
  }
};

const getUserOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const orders = await payment
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(400).json({ 
      error: error, 
      message: "Failed to fetch orders" 
    });
  }
};

/**
 * Refund a payment by charging back to the original payment method
 * Updates payment status to "cancelled"
 */
const refundPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req?.user?.id;
    const { name, email, message } = req.body;
    const { paymentId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email, and message are required",
      });
    }

    const paymentRecord = await payment.findById(paymentId);

    if (!paymentRecord) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (paymentRecord.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (paymentRecord.status !== "paid") {
      return res.status(400).json({
        error: `Cannot refund status: ${paymentRecord.status}`,
      });
    }

    await payment.findByIdAndUpdate(paymentId, {
      status: "refund_pending",
      refundRequestedAt: new Date(),
    });

    console.log(
      `[REFUND] Sending refund email | paymentId=${paymentId} | userId=${userId}`
    );

    try {
      await sendContactEmail(name, email, message);

      console.log(
        `[REFUND] Email sent successfully | paymentId=${paymentId}`
      );
    } catch (mailError) {
      console.error(
        `[REFUND] Email sending FAILED | paymentId=${paymentId}`,
        mailError
      );

      return res.status(500).json({
        error: "Refund requested but email notification failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refund request submitted. Admin will process it soon.",
    });
  } catch (error: any) {
    console.error("[REFUND] refundPayment error:", error);

    return res.status(500).json({
      error: error.message,
      message: "Failed to request refund",
    });
  }
};

/**
 * Sync payment status with Stripe (check if refunded from dashboard, etc.)
 */
const syncPaymentStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req?.user?.id;
    const { paymentId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!paymentId) {
      return res.status(400).json({ error: "paymentId is required" });
    }

    // Find the payment record
    const paymentRecord = await payment.findById(paymentId);

    if (!paymentRecord) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Verify the payment belongs to the user
    if (paymentRecord.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to check this payment" });
    }

    // Get the Stripe session
    const session = await stripe.checkout.sessions.retrieve(paymentRecord.stripeSessionId);

    // Check if session has been paid
    if (session.payment_status === "paid" && paymentRecord.status !== "paid") {
      await payment.findByIdAndUpdate(paymentId, { status: "paid" });
      console.log(`Payment ${paymentId} synced to paid status`);
    }

    // If payment_intent exists, check for refunds
    if (session.payment_intent) {
      const intent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
      
      // Check if refunded
      if (intent.charges?.data?.length > 0) {
        const charge = intent.charges.data[0];
        if (charge.refunded && paymentRecord.status !== "cancelled") {
          const refund = charge.refunds?.data?.[0];
          await payment.findByIdAndUpdate(paymentId, {
            status: "cancelled",
            refundedAt: new Date(),
            refundId: refund?.id || "manual_refund",
          });
          console.log(`Payment ${paymentId} synced to cancelled (refunded)`);
        }
      }
    }

    // Return updated payment
    const updatedPayment = await payment.findById(paymentId);
    res.status(200).json({
      success: true,
      message: "Payment status synced",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("syncPaymentStatus error:", error);
    const errMessage = (error && (error as any).message) || error;
    res.status(400).json({ error: errMessage, message: "Failed to sync payment status" });
  }
};

export {
  createCheckoutSession,
  createTestCheckoutSession,
  createSubscriptionCheckoutSession,
  stripeWebHook,
  getUserOrders,
  refundPayment,
  syncPaymentStatus,
};

