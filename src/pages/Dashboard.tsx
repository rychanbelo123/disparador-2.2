"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-sidebar-background text-sidebar-foreground">
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Dashboard</h1>
        <p>Conteúdo disponível para todos os usuários.</p>
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