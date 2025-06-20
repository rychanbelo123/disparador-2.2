import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();

// Substitua pela sua chave secreta do Stripe (começa com sk_live_ ou sk_test_)
const stripe = new Stripe("sk_test_YOUR_SECRET_KEY", {
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