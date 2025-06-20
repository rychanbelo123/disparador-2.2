"use client";

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  MapPin,
  List,
  LogOut,
  User,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },
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

interface SidebarProps {
  user: string;
  onLogout: () => void;
}

const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-72 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-lg border-r border-green-700 flex flex-col p-6 text-green-400">
      <div
        className="mb-10 flex items-center gap-4 cursor-pointer select-none"
        onClick={() => navigate("/dashboard")}
      >
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {user.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-white">{user}</p>
          <p className="text-sm text-green-400">@{user.toLowerCase()}</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map(({ name, icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <li key={name}>
                <button
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "bg-green-700 text-white shadow-lg shadow-green-600/50"
                      : "hover:bg-green-800 hover:text-white"
                  }`}
                >
                  <span className="text-green-400">{icon}</span>
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-green-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-green-400 hover:text-red-500 transition-colors duration-300 font-semibold w-full"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;