"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Image,
  Video,
  FileText,
  List,
  MousePointer,
  Home,
  Settings,
  User,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <MessageSquare size={20} />, label: "Enviar Texto", path: "/dashboard/send-text" },
    { icon: <Image size={20} />, label: "Enviar Mídia URL", path: "/dashboard/send-media-url" },
    { icon: <FileText size={20} />, label: "Enviar Mídia Arquivo", path: "/dashboard/send-media-file" },
    { icon: <User size={20} />, label: "Enviar Lista", path: "/dashboard/send-list" },
    { icon: <Bell size={20} />, label: "Enviar Localização", path: "/dashboard/send-location" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-black/20 backdrop-blur-xl border-r border-white/[0.08] z-50 lg:relative lg:translate-x-0"
          >
            <div className="p-6">
              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 text-white/60 hover:text-white"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>

              {/* Logo */}
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mr-3">
                  <MessageSquare className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold text-white">WhatsApp Pro</h1>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {sidebarItems.map(({ icon, label, path }, index) => {
                  const isActive = location.pathname === path;
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        navigate(path);
                        onClose();
                      }}
                      className={cn(
                        "w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200",
                        isActive
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                      )}
                      type="button"
                    >
                      {icon}
                      <span className="ml-3 font-medium">{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden flex">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 border-b border-white/[0.08] backdrop-blur-xl bg-black/20 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Message Control Center
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Manage your WhatsApp automation campaigns
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;