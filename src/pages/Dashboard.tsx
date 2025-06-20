"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Utility function
const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// Card component
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  delay?: number;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* Glassmorphism container */}
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] shadow-2xl">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56, 189, 248, 0.15) 0%, transparent 50%)`,
          }}
        />
        
        {/* Neon border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.3), inset 0 0 20px rgba(56, 189, 248, 0.1)',
          }}
        />

        {/* Card content */}
        <div className="relative z-10 p-8 h-full flex flex-col">
          {/* Icon */}
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-cyan-400 w-8 h-8">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed flex-grow">
            {description}
          </p>

          {/* Hover arrow */}
          <motion.div
            className="mt-6 flex items-center text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100"
            initial={{ x: -10 }}
            animate={{ x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <span>Get Started</span>
            <motion.div
              className="ml-2"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Sidebar component
const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const sidebarItems = [
    { icon: <Home size={20} />, label: 'Dashboard', active: true },
    { icon: <MessageSquare size={20} />, label: 'Messages' },
    { icon: <User size={20} />, label: 'Contacts' },
    { icon: <Bell size={20} />, label: 'Notifications' },
    { icon: <Settings size={20} />, label: 'Settings' },
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
                {sidebarItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200",
                      item.active
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3 font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main dashboard component
const WhatsAppSenderDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const actionCards = [
    {
      icon: <MessageSquare size={32} />,
      title: "Send Text",
      description: "Send text messages to your contacts with advanced formatting and emoji support.",
      path: "/dashboard/send-text",
    },
    {
      icon: <Image size={32} />,
      title: "Send Image",
      description: "Share images with your contacts including photos, graphics, and visual content.",
      path: "/dashboard/send-media-url",
    },
    {
      icon: <Video size={32} />,
      title: "Send Video",
      description: "Send video files to your contacts with support for various formats and sizes.",
      path: "/dashboard/send-media-file",
    },
    {
      icon: <FileText size={32} />,
      title: "Send Document",
      description: "Share documents, PDFs, and files with your contacts securely and efficiently.",
      path: "/dashboard/send-media-file",
    },
    {
      icon: <List size={32} />,
      title: "Send List",
      description: "Create and send interactive lists with multiple options for better engagement.",
      path: "/dashboard/send-list",
    },
    {
      icon: <MousePointer size={32} />,
      title: "Send Buttons",
      description: "Send messages with interactive buttons for enhanced user interaction and responses.",
      path: "/dashboard/send-buttons", // Assuming this page exists or will be created
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>

        {/* Mobile sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <header className="p-6 border-b border-white/[0.08] backdrop-blur-xl bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-4 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white"
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
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white transition-colors">
                  <Search size={20} />
                </button>
                <button className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white transition-colors">
                  <Bell size={20} />
                </button>
              </div>
            </div>
          </header>

          {/* Main dashboard content */}
          <main className="p-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Messages Sent", value: "12,847", change: "+12%" },
                { label: "Active Contacts", value: "3,429", change: "+8%" },
                { label: "Success Rate", value: "98.2%", change: "+2%" },
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

            {/* Action cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actionCards.map((card, index) => (
                <ActionCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  onClick={() => handleCardClick(card.path)}
                  delay={index * 0.1}
                />
              ))}
            </div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-6 rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08]"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Import Contacts",
                  "Schedule Message",
                  "View Analytics",
                  "Export Data",
                ].map((action, index) => (
                  <motion.button
                    key={action}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200 text-sm font-medium"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSenderDashboard;