"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const { data: hasActiveSubscription, isLoading, isError } = useSubscriptionStatus(user);

  if (isLoading) {
    return null;
  }

  if (isError || !hasActiveSubscription) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-800 p-8">
        <h1 className="text-4xl font-bold mb-4">Acesso Negado</h1>
        <p className="mb-6 max-w-md text-center">
          Sua conta não possui uma assinatura ativa. Para acessar o dashboard, por favor realize a assinatura.
        </p>
        <button
          onClick={logout}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-sidebar-background text-sidebar-foreground">
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Dashboard</h1>
        <p>Conteúdo disponível para usuários com assinatura ativa.</p>
        <button
          onClick={logout}
          className="mt-6 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
        >
          Sair
        </button>
      </main>
    </div>
  );
};

export default Dashboard;