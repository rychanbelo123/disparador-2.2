import { Router } from "express";
import Stripe from "stripe";

const router = Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2022-11-15",
});

router.post("/check-subscription", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Find customer by email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.json({ hasActiveSubscription: false });
    }

    const customer = customers.data[0];

    // List subscriptions for customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 10,
    });

    // Check if any subscription is active or trialing
    const hasActiveSubscription = subscriptions.data.some(
      (sub) =>
        sub.status === "active" ||
        sub.status === "trialing" ||
        sub.status === "past_due"
    );

    return res.json({ hasActiveSubscription });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;