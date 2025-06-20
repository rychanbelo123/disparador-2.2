"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const SendList = () => {
  const { toast } = useToast();

  const [number, setNumber] = useState("");
  const [listText, setListText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!number || !listText) {
      toast({
        title: "Erro",
        description: "Número e texto da lista são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/message/sendList/instance-id-placeholder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number,
            listText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar lista");
      }

      toast({
        title: "Sucesso",
        description: "Lista enviada com sucesso.",
        variant: "default",
      });

      setNumber("");
      setListText("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar lista.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8 select-none drop-shadow-lg">Enviar Lista</h1>
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
          <Label htmlFor="listText" className="text-[#CBD5E1]">
            Texto da Lista
          </Label>
          <Input
            id="listText"
            type="text"
            placeholder="Itens da lista separados por vírgula"
            value={listText}
            onChange={(e) => setListText(e.target.value)}
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

export default SendList;