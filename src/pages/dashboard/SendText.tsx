"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const SendText = () => {
  const { toast } = useToast();

  const [number, setNumber] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!number || !text) {
      toast({
        title: "Erro",
        description: "Número e texto são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/message/sendText/instance-id-placeholder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number,
            text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      toast({
        title: "Sucesso",
        description: "Mensagem enviada com sucesso.",
        variant: "default",
      });

      setNumber("");
      setText("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-10">
      <h1 className="text-4xl font-extrabold mb-8 select-none drop-shadow-lg">Enviar Mensagem de Texto</h1>
      <form
        onSubmit={handleSend}
        className="max-w-lg bg-white/5 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/10 mx-auto"
      >
        <div className="mb-6">
          <Label htmlFor="number" className="text-green-300">
            Número (ex: 5511999999999)
          </Label>
          <Input
            id="number"
            type="text"
            placeholder="Número do destinatário"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="bg-black/70 text-green-200 placeholder-green-500 focus:ring-green-500 focus:border-green-500 rounded-md"
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="text" className="text-green-300">
            Texto
          </Label>
          <Input
            id="text"
            type="text"
            placeholder="Mensagem de texto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-black/70 text-green-200 placeholder-green-500 focus:ring-green-500 focus:border-green-500 rounded-md"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 shadow-lg"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default SendText;