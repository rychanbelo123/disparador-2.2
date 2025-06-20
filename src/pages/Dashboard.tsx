"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  MapPin,
  List,
  BarChart2,
} from "lucide-react";
import BottomMenu from "@/components/BottomMenu";

const stats = [
  {
    title: "Mensagens Enviadas",
    value: "1,234",
    icon: <BarChart2 size={24} className="text-[#DBEAFE]" />,
  },
  {
    title: "Mídias Enviadas",
    value: "567",
    icon: <Image size={24} className="text-[#DBEAFE]" />,
  },
  {
    title: "Localizações Enviadas",
    value: "89",
    icon: <MapPin size={24} className="text-[#DBEAFE]" />,
  },
  {
    title: "Listas Enviadas",
    value: "45",
    icon: <List size={24} className="text-[#DBEAFE]" />,
  },
];

const shortcuts = [
  {
    name: "Enviar Texto",
    icon: <FileText size={20} />,
    path: "/dashboard/send-text",
  },
  {
    name: "Enviar Mídia URL",
    icon: <Image size={20} />,
    path: "/dashboard/send-media-url",
  },
  {
    name: "Enviar Mídia Arquivo",
    icon: <FileText size={20} />,
    path: "/dashboard/send-media-file",
  },
  {
    name: "Enviar Localização",
    icon: <MapPin size={20} />,
    path: "/dashboard/send-location",
  },
  {
    name: "Enviar Lista",
    icon: <List size={20} />,
    path: "/dashboard/send-list",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0F1729] text-[#CBD5E1] font-sans pb-16">
      <main className="flex-1 p-6 overflow-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[#DBEAFE]">Dashboard</h1>
          <p className="text-[#CBD5E1]">Visão geral das suas atividades e estatísticas</p>
        </header>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map(({ title, value, icon }) => (
            <div
              key={title}
              className="bg-[#0F172A] rounded-xl p-6 shadow-md flex items-center gap-4 cursor-default border border-[#172554]"
            >
              <div className="p-3 bg-[#172554] rounded-lg">{icon}</div>
              <div>
                <p className="text-sm text-[#CBD5E1]">{title}</p>
                <p className="text-2xl font-semibold text-[#DBEAFE]">{value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Atalhos */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#DBEAFE]">Atalhos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {shortcuts.map(({ name, icon, path }) => (
              <button
                key={name}
                onClick={() => navigate(path)}
                className="flex flex-col items-center justify-center gap-2 p-6 bg-[#0F172A] rounded-xl shadow-md hover:bg-[#172554] transition-colors border border-[#172554]"
              >
                <div className="p-3 bg-[#172554] rounded-lg text-[#DBEAFE]">{icon}</div>
                <span className="text-[#CBD5E1] font-medium">{name}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
      <BottomMenu />
    </div>
  );
};

export default Dashboard;