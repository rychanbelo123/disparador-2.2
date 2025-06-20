import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not set in environment variables");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2022-11-15",
});

app.use(cors());
app.use(express.json());

app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== "number") {
    return res.status(400).json({ error: "Amount is required and must be a number" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stripe backend server running on port ${PORT}`);
});