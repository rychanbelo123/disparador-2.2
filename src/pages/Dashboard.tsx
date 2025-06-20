"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";

const PAYMENT_LINK = "https://buy.stripe.com/14A28rdAc2zFc85fjr4ko00";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { data: hasSubscription, isLoading, isError } = useSubscriptionStatus(user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );
  }

  if (isError || !hasSubscription) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg mx-auto">
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
        <h1 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Acesso Negado
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Sua conta não possui uma assinatura ativa. Para acessar o dashboard, por favor realize a assinatura.
        </p>
        <Button
          variant="default"
          size="lg"
          className="mb-4 flex items-center justify-center gap-2"
          onClick={() => window.open(PAYMENT_LINK, "_blank", "noopener,noreferrer")}
        >
          <CreditCard className="h-5 w-5" />
          Realizar Assinatura
        </Button>
        <Button variant="outline" size="lg" onClick={logout}>
          Sair
        </Button>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Em caso de dúvidas, entre em contato com o suporte.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-sidebar-background text-sidebar-foreground">
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Dashboard</h1>
        <p>Conteúdo protegido para assinantes ativos.</p>
      </main>
    </div>
  );
};

export default Dashboard;