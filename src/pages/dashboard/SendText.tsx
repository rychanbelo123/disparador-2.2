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
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 p-8 text-white flex flex-col max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8 select-none">Enviar Mensagem de Texto</h1>
      <form onSubmit={handleSend} className="space-y-6 bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700">
        <div>
          <Label htmlFor="number" className="text-gray-300">Número (ex: 5511999999999)</Label>
          <Input
            id="number"
            type="text"
            placeholder="Número do destinatário"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="bg-gray-900 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="text" className="text-gray-300">Texto</Label>
          <Input
            id="text"
            type="text"
            placeholder="Mensagem de texto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-gray-900 text-white"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 shadow-lg"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default SendText;