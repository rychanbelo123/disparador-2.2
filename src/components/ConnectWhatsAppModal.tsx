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
      <DialogContent className="max-w-sm rounded-2xl p-8 bg-[#0D0916] border border-[#1E1B2B] shadow-lg shadow-[#1E1B2B]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold text-center mb-1">
            {connectionOpen ? "WhatsApp Conectado" : "Escaneie o QR Code"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center mb-6 px-4">
            {connectionOpen
              ? "Seu WhatsApp está conectado com sucesso."
              : "Abra o WhatsApp no seu celular e escaneie o código para conectar."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            placeholder="Nome da instância"
            value={instancename}
            onChange={(e) => setInstancename(e.target.value)}
            disabled={loading || connectionOpen}
            required
            className="bg-[#1E1B2B] border border-[#3A3750] text-white placeholder-[#6B6883] focus:ring-[#6B6883] focus:border-[#6B6883]"
          />

          <AnimatePresence>
            {!connectionOpen && qrBase64 && (
              <motion.div
                key="qr-container"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex flex-col items-center space-y-4 mt-4"
              >
                <div className="relative rounded-lg overflow-hidden border-4 border-[#3A3750] shadow-md shadow-[#3A3750]">
                  <img
                    src={`data:image/png;base64,${qrBase64}`}
                    alt="QR Code para conexão WhatsApp"
                    className="w-56 h-56 object-contain bg-[#0D0916]"
                  />
                </div>

                {/* Contador animado abaixo do QR code */}
                <motion.div
                  className="flex items-center space-x-2 text-[#4ADE80] font-mono text-lg select-none"
                  key={countdown}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="font-bold"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6 }}
                  >
                    {countdown}
                  </motion.span>
                  <span>segundo{countdown !== 1 ? "s" : ""} para atualizar</span>
                </motion.div>

                <p className="text-[#6B6883] text-center max-w-xs select-none">
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
              className="text-[#4ADE80] font-semibold text-center text-lg mt-6 select-none"
            >
              Seu WhatsApp está conectado com sucesso!
            </motion.p>
          )}

          <DialogFooter className="flex flex-col gap-3 mt-6">
            <Button
              type="submit"
              disabled={loading || connectionOpen}
              className="w-full bg-[#4ADE80] hover:bg-[#3AC162] text-[#0D0916] font-semibold"
            >
              {loading ? "Conectando..." : connectionOpen ? "Conectado" : "Conectar"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-[#6B6883] hover:text-[#A3A0B8]"
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