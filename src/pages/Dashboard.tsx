"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart2,
  MessageCircle,
  Image,
  MapPin,
  List,
  FileText,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Mensagens Enviadas",
    value: "1,234",
    change: "+12.5%",
    changePositive: true,
    icon: <MessageCircle className="w-5 h-5 text-green-400" />,
  },
  {
    title: "Mídias Enviadas",
    value: "567",
    change: "+8.3%",
    changePositive: true,
    icon: <Image className="w-5 h-5 text-green-400" />,
  },
  {
    title: "Localizações Enviadas",
    value: "89",
    change: "-2.1%",
    changePositive: false,
    icon: <MapPin className="w-5 h-5 text-red-500" />,
  },
  {
    title: "Listas Enviadas",
    value: "45",
    change: "+5.1%",
    changePositive: true,
    icon: <List className="w-5 h-5 text-green-400" />,
  },
];

const menuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/dashboard",
  },
  {
    name: "Enviar Texto",
    icon: <FileText className="w-5 h-5" />,
    path: "/dashboard/send-text",
  },
  {
    name: "Enviar Mídia URL",
    icon: <Image className="w-5 h-5" />,
    path: "/dashboard/send-media-url",
  },
  {
    name: "Enviar Mídia Arquivo",
    icon: <FileText className="w-5 h-5" />,
    path: "/dashboard/send-media-file",
  },
  {
    name: "Enviar Localização",
    icon: <MapPin className="w-5 h-5" />,
    path: "/dashboard/send-location",
  },
  {
    name: "Enviar Lista",
    icon: <List className="w-5 h-5" />,
    path: "/dashboard/send-list",
  },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return null; // ProtectedRoute cuida disso
  }

  return (
    <div className="flex h-screen bg-[#0a0f14] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f141b] flex flex-col p-6 border-r border-[#1a202c]">
        <div className="mb-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
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
            {menuItems.map(({ name, icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <li key={name}>
                  <button
                    onClick={() => navigate(path)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-green-700 text-green-400"
                        : "text-gray-300 hover:bg-green-900 hover:text-green-400"
                    }`}
                  >
                    {icon}
                    {name}
                    {isActive && <span className="ml-auto w-2 h-2 bg-green-400 rounded-full" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-[#1a202c]">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors text-sm font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold select-none">Welcome to Dashboard!</h1>
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search..."
              className="bg-[#1a202c] rounded-md px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md">
              + Deposit
            </Button>
          </div>
        </header>

        {/* Stats cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map(({ title, value, change, changePositive, icon }) => (
            <div
              key={title}
              className="bg-[#1a202c] rounded-xl p-6 shadow-md flex items-center justify-between cursor-default"
            >
              <div>
                <p className="text-xs text-gray-400">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
                <p
                  className={`text-sm mt-1 ${
                    changePositive ? "text-green-400" : "text-red-500"
                  } flex items-center gap-1 select-none`}
                >
                  {changePositive ? (
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 3l5 7H5l5-7z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 17l-5-7h10l-5 7z" />
                    </svg>
                  )}
                  {change}
                </p>
              </div>
              <div className="bg-green-700 p-3 rounded-md">{icon}</div>
            </div>
          ))}
        </section>

        {/* Placeholder for chart and recent activity */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a202c] rounded-xl p-6 shadow-md min-h-[300px]">
            <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
            <div className="flex items-center justify-center h-full text-gray-500 select-none">
              Chart visualization would go here
            </div>
          </div>
          <div className="bg-[#1a202c] rounded-xl p-6 shadow-md min-h-[300px] md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center bg-[#12171d] p-4 rounded-md shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Bought AAPL</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <p className="font-semibold">$500</p>
              </li>
              <li className="flex justify-between items-center bg-[#12171d] p-4 rounded-md shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center text-white">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Sold TSLA</p>
                    <p className="text-xs text-gray-400">4 hours ago</p>
                  </div>
                </div>
                <p className="font-semibold">$1,200</p>
              </li>
              <li className="flex justify-between items-center bg-[#12171d] p-4 rounded-md shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Dividend received</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
                <p className="font-semibold">$45.67</p>
              </li>
              <li className="flex justify-between items-center bg-[#12171d] p-4 rounded-md shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Bought ETH</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </div>
                <p className="font-semibold">$800</p>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;