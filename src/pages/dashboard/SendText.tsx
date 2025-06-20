"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const SendText = () => {
  const { toast } = useToast();

  const [numbers, setNumbers] = useState("");
  const [text, setText] = useState("");
  const [delay, setDelay] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numbers.trim() || !text.trim()) {
      toast({
        title: "Erro",
        description: "Números e texto são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const delaySeconds = Number(delay);
    if (isNaN(delaySeconds) || delaySeconds < 0) {
      toast({
        title: "Erro",
        description: "Delay deve ser um número positivo ou zero.",
        variant: "destructive",
      });
      return;
    }

    // Process numbers: split by comma, trim spaces, filter empty
    const numberList = numbers
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num.length > 0);

    if (numberList.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira pelo menos um número válido.",
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
            numbers: numberList,
            text,
            delay: delaySeconds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      toast({
        title: "Sucesso",
        description: "Mensagens enviadas com sucesso.",
        variant: "default",
      });

      setNumbers("");
      setText("");
      setDelay("0");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSend}
        className="w-full max-w-xl bg-white/5 backdrop-blur-md rounded-2xl p-10 shadow-lg border border-white/20 flex flex-col gap-6"
      >
        <h1 className="text-4xl font-extrabold select-none drop-shadow-lg text-center">
          Enviar Mensagem de Texto
        </h1>

        <div>
          <Label htmlFor="numbers" className="text-green-300 font-semibold mb-1 block">
            Números (separados por vírgula)
          </Label>
          <Input
            id="numbers"
            type="text"
            placeholder="Ex: 5511999999999, 5511988888888"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            className="bg-black/70 text-green-200 placeholder-green-500 focus:ring-green-500 focus:border-green-500 rounded-md"
            required
            spellCheck={false}
          />
        </div>

        <div>
          <Label htmlFor="text" className="text-green-300 font-semibold mb-1 block">
            Texto da Mensagem
          </Label>
          <textarea
            id="text"
            placeholder="Digite sua mensagem aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[120px] resize-y bg-black/70 text-green-200 placeholder-green-500 focus:ring-green-500 focus:border-green-500 rounded-md p-3 border border-green-600"
            required
            spellCheck={true}
          />
        </div>

        <div>
          <Label htmlFor="delay" className="text-green-300 font-semibold mb-1 block">
            Delay entre mensagens (segundos)
          </Label>
          <Input
            id="delay"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            className="bg-black/70 text-green-200 placeholder-green-500 focus:ring-green-500 focus:border-green-500 rounded-md"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 shadow-lg font-semibold text-white py-3 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default SendText;