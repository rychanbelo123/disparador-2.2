"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe("pk_live_51Mm28LH7naMM49lDL1qykcEFwpRmkG608IXvKXauT4o3q7KZvwNyPHcVpvuAOODI2lOj1zeX0G6W36c7Et9wiXh00CXz9Kp34");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#000",
      "::placeholder": {
        color: "#a0aec0",
      },
      padding: "12px 14px",
      height: "48px",
      boxSizing: "border-box",
      width: "100%",
    },
    invalid: {
      color: "#e53e3e",
    },
  },
  hidePostalCode: true,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar pagamento");
      }

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        setError(result.error.message || "Erro no pagamento");
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full mx-auto p-4 bg-white rounded-md shadow-md">
      <div className="border rounded-md p-2 w-full">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Pagamento realizado com sucesso!</p>}
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Processando..." : "Pagar R$10,00"}
      </Button>
    </form>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Payment;