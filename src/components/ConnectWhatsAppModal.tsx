"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ConnectWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const POLL_INTERVAL = 29000; // 29 seconds

const ConnectWhatsAppModal = ({ open, onOpenChange }: ConnectWhatsAppModalProps) => {
  const { toast } = useToast();
  const [instancename, setInstancename] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const BACKEND_URL = "https://aplicativos-n8n.wip173.easypanel.host/webhook/dispradorlogin";

  useEffect(() => {
    if (!open) {
      setInstancename("");
      setLoading(false);
      setConnectionOpen(false);
      setQrBase64(null);
      setCountdown(POLL_INTERVAL / 1000);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (pollRef.current) clearTimeout(pollRef.current);
    }
  }, [open]);

  const fetchConnectionStatus = async () => {
    if (!instancename.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o nome da instância.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: instancename.trim() }),
      });

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].data &&
        typeof data[0].data === "object" &&
        "connectionStatus" in data[0].data &&
        data[0].data.connectionStatus === "open"
      ) {
        setConnectionOpen(true);
        setQrBase64(null);
        toast({
          title: "Conectado",
          description: "WhatsApp já está conectado.",
          variant: "default",
        });
        setLoading(false);
        if (countdownRef.current) clearInterval(countdownRef.current);
        if (pollRef.current) clearTimeout(pollRef.current);
        return;
      }

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].data &&
        typeof data[0].data === "object" &&
        "base64" in data[0].data
      ) {
        setConnectionOpen(false);
        setQrBase64(data[0].data.base64);
        setLoading(false);
        setCountdown(POLL_INTERVAL / 1000);

        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              return POLL_INTERVAL / 1000;
            }
            return prev - 1;
          });
        }, 1000);

        if (pollRef.current) clearTimeout(pollRef.current);
        pollRef.current = setTimeout(() => {
          fetchConnectionStatus();
        }, POLL_INTERVAL);
      } else {
        toast({
          title: "Erro",
          description: "Resposta inesperada do servidor.",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar ao servidor.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConnectionStatus();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-gradient-to-tr from-[#0F172A] via-[#172554] to-[#0F172A] border border-cyan-600 shadow-lg shadow-cyan-900/50">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-semibold tracking-wide">
            Conectar WhatsApp
          </DialogTitle>
          <DialogDescription className="text-cyan-300 mt-1">
            Informe o nome da sua instância para conectar seu WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <Input
            placeholder="Nome da instância"
            value={instancename}
            onChange={(e) => setInstancename(e.target.value)}
            disabled={loading || connectionOpen}
            required
            className="bg-[#172554] border-cyan-500 text-cyan-100 placeholder-cyan-400 focus:ring-cyan-400 focus:border-cyan-400"
          />

          <AnimatePresence>
            {!connectionOpen && qrBase64 && (
              <motion.div
                key="qr-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center space-y-3 mt-4"
              >
                <div className="relative rounded-lg overflow-hidden border-4 border-cyan-600 shadow-lg shadow-cyan-900/60">
                  <img
                    src={`data:image/png;base64,${qrBase64}`}
                    alt="QR Code para conexão WhatsApp"
                    className="w-56 h-56 object-contain bg-black"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-cyan-700/80 text-cyan-100 text-center py-1 font-mono tracking-widest text-lg select-none"
                    key={countdown}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Atualizando em {countdown} segundo{countdown !== 1 ? "s" : ""}
                  </motion.div>
                </div>
                <p className="text-cyan-300 text-center max-w-xs">
                  Escaneie o QR code com seu WhatsApp para conectar a instância.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {connectionOpen && (
            <motion.p
              key="connected-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 font-semibold text-center text-lg mt-6"
            >
              WhatsApp conectado com sucesso!
            </motion.p>
          )}

          <DialogFooter className="flex flex-col gap-3 mt-4">
            <Button
              type="submit"
              disabled={loading || connectionOpen}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
            >
              {loading ? "Conectando..." : connectionOpen ? "Conectado" : "Conectar"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-cyan-400 hover:text-cyan-300"
            >
              Fechar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWhatsAppModal;