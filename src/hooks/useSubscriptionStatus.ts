"use client";

import { useQuery } from "@tanstack/react-query";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

async function fetchSubscriptionStatus(email: string) {
  const response = await fetch(`${BACKEND_URL}/api/check-subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription status");
  }

  const data = await response.json();
  return data.hasActiveSubscription as boolean;
}

export function useSubscriptionStatus(email: string | null) {
  return useQuery({
    queryKey: ["subscriptionStatus", email],
    queryFn: () => {
      if (!email) {
        return Promise.resolve(false);
      }
      return fetchSubscriptionStatus(email);
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}