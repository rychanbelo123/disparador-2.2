"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { BarChart2, MessageCircle, Image, MapPin, List } from "lucide-react";

const stats = [
  {
    title: "Mensagens Enviadas",
    value: "1,234",
    icon: <MessageCircle className="w-6 h-6 text-green-400" />,
  },
  {
    title: "Mídias Enviadas",
    value: "567",
    icon: <Image className="w-6 h-6 text-pink-400" />,
  },
  {
    title: "Localizações Enviadas",
    value: "89",
    icon: <MapPin className="w-6 h-6 text-blue-400" />,
  },
  {
    title: "Listas Enviadas",
    value: "45",
    icon: <List className="w-6 h-6 text-yellow-400" />,
  },
];

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white">
      <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 p-10 overflow-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide select-none drop-shadow-lg">
            Dashboard
          </h1>
          <input
            type="search"
            placeholder="Buscar..."
            className="bg-black/40 rounded-lg px-4 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map(({ title, value, icon }) => (
            <div
              key={title}
              className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-lg flex items-center gap-4 cursor-default hover:shadow-green-600/50 transition-shadow"
            >
              <div className="p-3 bg-green-700 bg-opacity-30 rounded-lg">
                {icon}
              </div>
              <div>
                <p className="text-sm text-green-300">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-black/30 backdrop-blur-md rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 select-none">Atalhos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
            <button
              onClick={() => window.location.assign("/dashboard/send-text")}
              className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 rounded-lg p-6 flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle size={32} />
              <span className="text-lg font-semibold">Enviar Texto</span>
            </button>
            <button
              onClick={() => window.location.assign("/dashboard/send-media-url")}
              className="bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 rounded-lg p-6 flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105"
            >
              <Image size={32} />
              <span className="text-lg font-semibold">Enviar Mídia URL</span>
            </button>
            <button
              onClick={() => window.location.assign("/dashboard/send-media-file")}
              className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 rounded-lg p-6 flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105"
            >
              <FileText size={32} />
              <span className="text-lg font-semibold">Enviar Mídia Arquivo</span>
            </button>
            <button
              onClick={() => window.location.assign("/dashboard/send-location")}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 rounded-lg p-6 flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105"
            >
              <MapPin size={32} />
              <span className="text-lg font-semibold">Enviar Localização</span>
            </button>
            <button
              onClick={() => window.location.assign("/dashboard/send-list")}
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 rounded-lg p-6 flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105"
            >
              <List size={32} />
              <span className="text-lg font-semibold">Enviar Lista</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;