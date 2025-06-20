"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  MapPin,
  List,
  LogOut,
  BarChart2,
} from "lucide-react";

const stats = [
  {
    title: "Mensagens Enviadas",
    value: "1,234",
    icon: <BarChart2 size={24} className="text-green-400" />,
  },
  {
    title: "Mídias Enviadas",
    value: "567",
    icon: <Image size={24} className="text-green-400" />,
  },
  {
    title: "Localizações Enviadas",
    value: "89",
    icon: <MapPin size={24} className="text-green-400" />,
  },
  {
    title: "Listas Enviadas",
    value: "45",
    icon: <List size={24} className="text-green-400" />,
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0a0f14] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b111a] flex flex-col p-6 border-r border-[#1a202c]">
        <div
          className="mb-10 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold select-none">
            {user.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user}</p>
            <p className="text-xs text-green-400 select-text">@{user.toLowerCase()}</p>
          </div>
        </div>

        <nav className="flex-1">
          <p className="text-xs uppercase text-gray-500 mb-4 tracking-wider">Menu</p>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "bg-green-700 text-green-400 relative"
                    : "text-gray-300 hover:bg-green-900 hover:text-green-400"
                }`}
              >
                <LayoutDashboard size={20} />
                Dashboard
                {location.pathname === "/dashboard" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full" />
                )}
              </button>
            </li>
            {shortcuts.map(({ name, icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <li key={name}>
                  <button
                    onClick={() => navigate(path)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-green-700 text-green-400 relative"
                        : "text-gray-300 hover:bg-green-900 hover:text-green-400"
                    }`}
                  >
                    {icon}
                    {name}
                    {isActive && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-red-400"
              >
                <LogOut size={20} />
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Visão geral das suas atividades e estatísticas</p>
        </header>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map(({ title, value, icon }) => (
            <div
              key={title}
              className="bg-[#12171d] rounded-xl p-6 shadow-md flex items-center gap-4 cursor-default"
            >
              <div className="p-3 bg-green-700 rounded-lg">{icon}</div>
              <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Atalhos */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Atalhos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {shortcuts.map(({ name, icon, path }) => (
              <button
                key={name}
                onClick={() => navigate(path)}
                className="flex flex-col items-center justify-center gap-2 p-6 bg-[#12171d] rounded-xl shadow-md hover:bg-green-700 transition-colors"
              >
                <div className="p-3 bg-green-600 rounded-lg text-white">{icon}</div>
                <span className="text-white font-medium">{name}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;