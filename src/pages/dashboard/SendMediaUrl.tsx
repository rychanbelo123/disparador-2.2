"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const SendMediaUrl = () => {
  const { toast } = useToast();

  const [number, setNumber] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!number || !mediaUrl) {
      toast({
        title: "Erro",
        description: "Número e URL da mídia são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/message/sendMediaUrl/instance-id-placeholder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number,
            mediaUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar mídia");
      }

      toast({
        title: "Sucesso",
        description: "Mídia enviada com sucesso.",
        variant: "default",
      });

      setNumber("");
      setMediaUrl("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mídia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8 select-none drop-shadow-lg">Enviar Mídia via URL</h1>
      <form
        onSubmit={handleSend}
        className="max-w-lg bg-white/5 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/10 mx-auto"
      >
        <div className="mb-6">
          <Label htmlFor="number" className="text-[#CBD5E1]">
            Número (ex: 5511999999999)
          </Label>
          <Input
            id="number"
            type="text"
            placeholder="Número do destinatário"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="mediaUrl" className="text-[#CBD5E1]">
            URL da Mídia
          </Label>
          <Input
            id="mediaUrl"
            type="url"
            placeholder="https://exemplo.com/midia.jpg"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#172554] via-[#0F172A] to-[#172554] hover:from-[#0F172A] hover:via-[#172554] hover:to-[#0F172A] shadow-lg rounded-full font-semibold text-[#CBD5E1]"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default SendMediaUrl;