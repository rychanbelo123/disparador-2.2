"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Image,
  FileText,
  List,
  MapPin,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ConnectWhatsAppModal from "@/components/ConnectWhatsAppModal";

const quickActions = [
  { label: "Importar Contatos", icon: <List size={20} />, path: "/dashboard" },
  { label: "Agendar Mensagem", icon: <MessageSquare size={20} />, path: "/dashboard/send-text" },
  { label: "Enviar Mídia URL", icon: <Image size={20} />, path: "/dashboard/send-media-url" },
  { label: "Enviar Mídia Arquivo", icon: <FileText size={20} />, path: "/dashboard/send-media-file" },
  { label: "Enviar Localização", icon: <MapPin size={20} />, path: "/dashboard/send-location" },
  { label: "Enviar Lista", icon: <List size={20} />, path: "/dashboard/send-list" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white select-none drop-shadow-lg flex-grow"
        >
          Bem-vindo ao Painel
        </motion.h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Placeholder para pesquisa */}
          <input
            type="search"
            placeholder="Pesquisar..."
            className="px-3 py-2 rounded-md border border-white/20 bg-black/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Conectar WhatsApp
          </Button>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </header>

      <ConnectWhatsAppModal open={modalOpen} onOpenChange={setModalOpen} />

      <p className="text-gray-300 mb-8">
        Aqui você pode gerenciar suas campanhas de automação do WhatsApp.
      </p>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Mensagens Enviadas", value: "12.847", change: "+12%" },
          { label: "Contatos Ativos", value: "3.429", change: "+8%" },
          { label: "Taxa de Sucesso", value: "98,2%", change: "+2%" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08]"
          >
            <p className="text-white/60 text-sm mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ações rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] mb-8"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          {[
            "Importar Contatos",
            "Agendar Mensagem",
            "Ver Análises",
            "Exportar Dados",
          ].map((action, index) => (
            <motion.button
              key={action}
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center gap-4 p-6 rounded-2xl shadow-lg text-white transition"
              style={{ backgroundColor: "#0B0D12" }}
            >
              <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
                <MessageSquare size={20} />
              </div>
              <span className="font-semibold text-lg">{action}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Blocos de atalho modernos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {quickActions.map(({ label, icon, path }) => (
          <motion.button
            key={label}
            onClick={() => navigate(path)}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-4 p-6 rounded-2xl shadow-lg text-white transition"
            style={{ backgroundColor: "#0B0D12" }}
          >
            <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
              {icon}
            </div>
            <span className="font-semibold text-lg">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;