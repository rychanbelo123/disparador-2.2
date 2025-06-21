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
import { motion, AnimatePresence, useAnimation } from "framer-motion";

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
  const [autoCheckStarted, setAutoCheckStarted] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const progressControls = useAnimation();

  const BACKEND_URL = "https://aplicativos-n8n.wip173.easypanel.host/webhook/dispradorlogin";

  useEffect(() => {
    if (!open) {
      setInstancename("");
      setLoading(false);
      setConnectionOpen(false);
      setQrBase64(null);
      setAutoCheckStarted(false);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (pollRef.current) clearTimeout(pollRef.current);
      progressControls.stop();
    }
  }, [open, progressControls]);

  // Function to start the progress bar animation
  const startProgressAnimation = () => {
    progressControls.set({ width: "100%" });
    progressControls.start({
      width: "0%",
      transition: { duration: POLL_INTERVAL / 1000, ease: "linear" },
    });
  };

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

      // Ajuste para lidar com a estrutura: data[0].data é um array
      const innerData = Array.isArray(data[0]?.data) ? data[0].data[0] : data[0]?.data;

      if (
        innerData &&
        typeof innerData === "object" &&
        "connectionStatus" in innerData &&
        innerData.connectionStatus === "open"
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
        progressControls.stop();
        return;
      }

      if (
        innerData &&
        typeof innerData === "object" &&
        "base64" in innerData
      ) {
        setConnectionOpen(false);
        setQrBase64(innerData.base64);
        setLoading(false);

        // Start progress bar animation
        startProgressAnimation();

        // Clear previous timers if any
        if (countdownRef.current) clearInterval(countdownRef.current);
        if (pollRef.current) clearTimeout(pollRef.current);

        // Set timer to poll again after POLL_INTERVAL
        pollRef.current = setTimeout(() => {
          fetchConnectionStatus();
        }, POLL_INTERVAL);

        // Mark that auto check started after QR code generation
        if (!autoCheckStarted) {
          setAutoCheckStarted(true);
        }
      } else {
        toast({
          title: "Erro",
          description: "Resposta inesperada do servidor.",
          variant: "destructive",
        });
        setLoading(false);
        progressControls.stop();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar ao servidor.",
        variant: "destructive",
      });
      setLoading(false);
      progressControls.stop();
    }
  };

  // Only start auto polling after QR code is generated (autoCheckStarted = true)
  useEffect(() => {
    if (open && instancename.trim() && autoCheckStarted) {
      fetchConnectionStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, instancename, autoCheckStarted]);

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
            onChange={(e) => {
              setInstancename(e.target.value);
              // Reset autoCheckStarted to false to prevent premature polling
              setAutoCheckStarted(false);
              setQrBase64(null);
              setConnectionOpen(false);
              progressControls.stop();
              if (countdownRef.current) clearInterval(countdownRef.current);
              if (pollRef.current) clearTimeout(pollRef.current);
            }}
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

                {/* Barra de progresso animada abaixo do QR code */}
                <div className="w-56 h-2 bg-[#3A3750] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#4ADE80]"
                    initial={{ width: "100%" }}
                    animate={progressControls}
                    transition={{ ease: "linear" }}
                  />
                </div>

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