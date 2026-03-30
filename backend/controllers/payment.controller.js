import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ================= CREATE PAYMENT INTENT =================
export const createPaymentIntent = async ({ orderId }) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  // 🧠 Fetch Order from DB
  const Order = Parse.Object.extend("Order");
  const query = new Parse.Query(Order);

  const order = await query.get(orderId, { useMasterKey: true });

  if (!order) {
    throw new Error("Order not found");
  }

  const amount = order.get("total") || order.get("totalAmount");
  const customerEmail = order.get("customerEmail");
  const customerName = order.get("customerName");

  if (!amount || amount <= 0) {
    throw new Error("Invalid order amount");
  }

  const amountInSmallestUnit = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInSmallestUnit,
    currency: "pkr",
    metadata: {
      orderId: order.id,
    },
    // ✅ FIX EMAIL ERROR
    receipt_email: customerEmail || undefined,
    description: `Payment for Order #${order.id}`,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount,
  };
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async ({ paymentIntentId }) => {
  if (!paymentIntentId) {
    throw new Error("Payment intent ID is required");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    const orderId = paymentIntent.metadata.orderId;

    // 🧠 Update Order
    const Order = Parse.Object.extend("Order");
    const query = new Parse.Query(Order);
    

    const order = await query.get(orderId, { useMasterKey: true });

    order.set("isPaid", true);
    order.set("status", "processing");
    order.set("paymentIntentId", paymentIntentId);

    await order.save(null, { useMasterKey: true });

    return {
      success: true,
      message: "Payment successful",
    };
  }

  return {
    success: false,
    message: `Payment status: ${paymentIntent.status}`,
  };
};