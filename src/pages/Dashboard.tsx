"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  MessageCircle,
  Image,
  MapPin,
  List,
  FileText,
  LogOut,
} from "lucide-react";

const stats = [
  {
    title: "Total Balance",
    value: "$24,567.89",
    change: "+12.5%",
    icon: (
      <svg
        className="w-6 h-6 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1v22M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" />
      </svg>
    ),
  },
  {
    title: "Active Investments",
    value: "8",
    change: "+2",
    icon: (
      <svg
        className="w-6 h-6 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 6 12 10 8 6" />
        <polyline points="16 12 12 16 8 12" />
      </svg>
    ),
  },
  {
    title: "Monthly Return",
    value: "$1,234.56",
    change: "-2.3%",
    icon: (
      <svg
        className="w-6 h-6 text-red-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1v22M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" />
      </svg>
    ),
  },
  {
    title: "Portfolio Growth",
    value: "23.4%",
    change: "+5.1%",
    icon: (
      <svg
        className="w-6 h-6 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 6 12 10 8 6" />
        <polyline points="16 12 12 16 8 12" />
      </svg>
    ),
  },
];

const menuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },
  {
    name: "Portfolio",
    icon: <BarChart2 size={20} />,
    path: "/dashboard/portfolio",
  },
  {
    name: "Profile",
    icon: <MessageCircle size={20} />,
    path: "/dashboard/profile",
  },
  {
    name: "Settings",
    icon: <FileText size={20} />,
    path: "/dashboard/settings",
  },
];

const recentActivity = [
  {
    title: "Bought AAPL",
    time: "2 hours ago",
    amount: "$500",
    color: "bg-green-700",
    icon: <BarChart2 size={16} className="text-green-400" />,
  },
  {
    title: "Sold TSLA",
    time: "4 hours ago",
    amount: "$1,200",
    color: "bg-red-700",
    icon: <BarChart2 size={16} className="text-red-400" />,
  },
  {
    title: "Dividend received",
    time: "1 day ago",
    amount: "$45.67",
    color: "bg-blue-700",
    icon: <BarChart2 size={16} className="text-blue-400" />,
  },
  {
    title: "Bought ETH",
    time: "2 days ago",
    amount: "$800",
    color: "bg-green-700",
    icon: <BarChart2 size={16} className="text-green-400" />,
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
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Welcome to Portfolio!</h1>
          <p className="text-gray-400">Track your investments and manage your portfolio</p>
        </header>

        {/* Stats cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map(({ title, value, change, icon }) => (
            <div
              key={title}
              className="bg-[#12171d] rounded-xl p-6 shadow-md flex items-center justify-between cursor-default"
            >
              <div>
                <p className="text-xs text-gray-400">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
                <p
                  className={`text-sm mt-1 flex items-center gap-1 select-none ${
                    change.startsWith("+") ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {change.startsWith("+") ? (
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

        {/* Portfolio Performance and Recent Activity */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#12171d] rounded-xl p-6 shadow-md min-h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Portfolio Performance</h2>
              <div className="flex gap-2 text-green-400 text-xs font-semibold">
                <button className="px-2 py-1 rounded bg-[#1f292f] hover:bg-green-600 transition">1D</button>
                <button className="px-2 py-1 rounded bg-[#1f292f] hover:bg-green-600 transition">1W</button>
                <button className="px-2 py-1 rounded bg-[#1f292f] hover:bg-green-600 transition">1M</button>
                <button className="px-2 py-1 rounded bg-[#1f292f] hover:bg-green-600 transition">1Y</button>
              </div>
            </div>
            <div className="flex items-center justify-center h-full text-gray-500 select-none">
              Chart visualization would go here
            </div>
          </div>

          <div className="bg-[#12171d] rounded-xl p-6 shadow-md min-h-[300px] md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              {recentActivity.map(({ title, time, amount, color, icon }, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-[#0f141a] p-4 rounded-md shadow-inner"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${color} rounded-full w-8 h-8 flex items-center justify-center text-white`}>
                      {icon}
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-xs text-gray-400">{time}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{amount}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;