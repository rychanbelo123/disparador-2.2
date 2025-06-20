"use client";

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  MapPin,
  List,
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

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-[#172554] flex justify-around items-center py-2 z-50">
      {menuItems.map(({ name, icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={name}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center text-xs font-medium transition-colors ${
              isActive
                ? "text-[#DBEAFE]"
                : "text-[#CBD5E1] hover:text-[#DBEAFE]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {icon}
            <span className="mt-1">{name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomMenu;