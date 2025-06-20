"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, MessageCircle, Image, MapPin, List, FileText } from "lucide-react";

const stats = [
  { title: "Mensagens Enviadas", value: "1,234", icon: <MessageCircle className="w-6 h-6 text-indigo-500" /> },
  { title: "Mídias Enviadas", value: "567", icon: <Image className="w-6 h-6 text-pink-500" /> },
  { title: "Localizações Enviadas", value: "89", icon: <MapPin className="w-6 h-6 text-green-500" /> },
  { title: "Listas Enviadas", value: "45", icon: <List className="w-6 h-6 text-yellow-500" /> },
];

const shortcuts = [
  { name: "Enviar Texto", icon: <FileText className="w-8 h-8" />, path: "/dashboard/send-text" },
  { name: "Enviar Mídia URL", icon: <Image className="w-8 h-8" />, path: "/dashboard/send-media-url" },
  { name: "Enviar Mídia Arquivo", icon: <FileText className="w-8 h-8" />, path: "/dashboard/send-media-file" },
  { name: "Enviar Localização", icon: <MapPin className="w-8 h-8" />, path: "/dashboard/send-location" },
  { name: "Enviar Lista", icon: <List className="w-8 h-8" />, path: "/dashboard/send-list" },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // ProtectedRoute já cuida disso
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg select-none">
          Dashboard
        </h1>
        <div>
          <span className="mr-4 text-lg opacity-80 select-none">Olá, {user}</span>
          <Button
            variant="destructive"
            onClick={logout}
            className="shadow-lg"
          >
            Sair
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map(({ title, value, icon }) => (
          <Card
            key={title}
            className="bg-gray-800 bg-opacity-40 backdrop-blur-md border border-gray-700 shadow-lg hover:shadow-indigo-600 transition-shadow rounded-xl p-4 flex items-center gap-4 cursor-default"
          >
            <div className="p-3 bg-indigo-700 bg-opacity-70 rounded-lg glow-effect">
              {icon}
            </div>
            <div>
              <p className="text-sm opacity-70">{title}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 select-none">Atalhos de Disparo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {shortcuts.map(({ name, icon, path }) => (
            <Card
              key={name}
              onClick={() => navigate(path)}
              className="bg-gray-800 bg-opacity-30 backdrop-blur-md border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-indigo-500 transition-shadow glow-effect"
            >
              <div className="mb-4 text-indigo-400">{icon}</div>
              <p className="text-lg font-semibold text-center">{name}</p>
            </Card>
          ))}
        </div>
      </section>

      <style>{`
        .glow-effect {
          box-shadow: 0 0 8px 2px rgba(99, 102, 241, 0.7);
          transition: box-shadow 0.3s ease;
        }
        .glow-effect:hover {
          box-shadow: 0 0 12px 4px rgba(99, 102, 241, 1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;