"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ConnectWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WebhookResponseOpen {
  data: {
    connectionStatus: "open";
  }[];
}

interface WebhookResponseQRCode {
  data: {
    base64: string;
  };
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

  // Limpa estados ao abrir/fechar modal
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

  // Função para chamar webhook e processar resposta
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

      // Verifica se conexão está aberta
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

      // Caso retorne QR code base64
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

        // Inicia contador regressivo
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              return POLL_INTERVAL / 1000;
            }
            return prev - 1;
          });
        }, 1000);

        // Agenda nova checagem após 29s
        if (pollRef.current) clearTimeout(pollRef.current);
        pollRef.current = setTimeout(() => {
          fetchConnectionStatus();
        }, POLL_INTERVAL);
      } else {
        // Resposta inesperada
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp</DialogTitle>
          <DialogDescription>
            Informe o nome da sua instância para conectar seu WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            placeholder="Nome da instância"
            value={instancename}
            onChange={(e) => setInstancename(e.target.value)}
            disabled={loading || connectionOpen}
            required
          />

          {!connectionOpen && qrBase64 && (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={`data:image/png;base64,${qrBase64}`}
                alt="QR Code para conexão WhatsApp"
                className="w-48 h-48 object-contain rounded-md border border-gray-300"
              />
              <p className="text-sm text-gray-400">
                Atualizando QR em {countdown} segundo{countdown !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {connectionOpen && (
            <p className="text-green-500 font-semibold text-center">
              WhatsApp conectado com sucesso!
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={loading || connectionOpen} className="w-full">
              {loading ? "Conectando..." : connectionOpen ? "Conectado" : "Conectar"}
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full mt-2">
              Fechar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWhatsAppModal;