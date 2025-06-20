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

      <p className="text-gray-300">
        Aqui você pode gerenciar suas campanhas de automação WhatsApp.
      </p>

      {/* Conteúdo adicional do dashboard pode ser adicionado aqui */}
    </div>
  );
};

export default Dashboard;