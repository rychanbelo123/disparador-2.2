"use client";

import React from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white mb-6 select-none drop-shadow-lg"
      >
        Bem-vindo ao Dashboard
      </motion.h1>

      <p className="text-gray-300 mb-8">
        Aqui você pode gerenciar suas campanhas de automação WhatsApp.
      </p>

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

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08]"
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
    </div>
  );
};

export default Dashboard;