"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { data: hasSubscription, isLoading, isError } = useSubscriptionStatus(user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (isError || !hasSubscription) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Acesso Negado</h1>
        <p className="mb-6">
          Sua conta não possui uma assinatura ativa. Por favor, realize a assinatura para acessar o dashboard.
        </p>
        <Button onClick={logout} className="mb-4">
          Sair
        </Button>
        <p>
          Entre em contato com o suporte para mais informações.
        </p>
      </div>
    );
  }

  // Aqui você pode manter o conteúdo atual do dashboard
  return (
    <div className="min-h-screen flex bg-sidebar-background text-sidebar-foreground">
      {/* Conteúdo do dashboard original */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Dashboard</h1>
        <p>Conteúdo protegido para assinantes ativos.</p>
      </main>
    </div>
  );
};

export default Dashboard;