import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

const ASaasApiKey = process.env.ASAAS_API_KEY;
const ASaasBaseUrl = "https://www.asaas.com/api/v3";

if (!ASaasApiKey) {
  throw new Error("ASAAS_API_KEY is not set");
}

router.post("/check-subscription-asaas", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // 1. Buscar customer pelo email
    const customersResponse = await fetch(
      `${ASaasBaseUrl}/customers?email=${encodeURIComponent(email)}`,
      {
        headers: {
          "Content-Type": "application/json",
          access_token: ASaasApiKey,
        },
      }
    );

    if (!customersResponse.ok) {
      const text = await customersResponse.text();
      console.error("Error fetching customers:", text);
      return res.status(500).json({ error: "Failed to fetch customers" });
    }

    const customersData = await customersResponse.json();

    if (!customersData.data || customersData.data.length === 0) {
      return res.json({ hasActiveSubscription: false });
    }

    const customer = customersData.data[0];

    // 2. Buscar assinaturas do customer
    const subsResponse = await fetch(
      `${ASaasBaseUrl}/subscriptions?customer=${customer.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          access_token: ASaasApiKey,
        },
      }
    );

    if (!subsResponse.ok) {
      const text = await subsResponse.text();
      console.error("Error fetching subscriptions:", text);
      return res.status(500).json({ error: "Failed to fetch subscriptions" });
    }

    const subsData = await subsResponse.json();

    if (!subsData.data || subsData.data.length === 0) {
      return res.json({ hasActiveSubscription: false });
    }

    // 3. Verificar se alguma assinatura está ativa
    const hasActiveSubscription = subsData.data.some(
      (sub: { status: string }) => sub.status === "ACTIVE"
    );

    return res.json({ hasActiveSubscription });
  } catch (error) {
    console.error("Error checking subscription via Asaas:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;