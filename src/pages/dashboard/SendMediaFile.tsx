"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const SendMediaFile = () => {
  const { toast } = useToast();

  const [numbers, setNumbers] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [delay, setDelay] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numbers.trim() || !file) {
      toast({
        title: "Erro",
        description: "Números e arquivo são obrigatórios.",
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
      const formData = new FormData();
      formData.append("numbers", JSON.stringify(numberList));
      formData.append("file", file);
      formData.append("delay", delaySeconds.toString());

      const response = await fetch(
        `${BACKEND_URL}/message/sendMediaFile/instance-id-placeholder`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar arquivo");
      }

      toast({
        title: "Sucesso",
        description: "Arquivo enviado com sucesso.",
        variant: "default",
      });

      setNumbers("");
      setFile(null);
      setDelay("0");
      (document.getElementById("fileInput") as HTMLInputElement).value = "";
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar arquivo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-10 flex justify-center">
      <form
        onSubmit={handleSend}
        className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/10"
      >
        <h1 className="text-3xl font-bold mb-8 select-none drop-shadow-lg text-center">Enviar Mídia via Arquivo</h1>
        <div className="mb-6">
          <label htmlFor="numbers" className="block mb-1 text-[#CBD5E1] font-medium">
            Números (separados por vírgula)
          </label>
          <input
            id="numbers"
            type="text"
            placeholder="Ex: 5511999999999, 5511988888888"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            className="w-full bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554] px-3 py-2"
            required
            spellCheck={false}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="fileInput" className="block mb-1 text-[#CBD5E1] font-medium">
            Arquivo de Mídia
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full text-[#CBD5E1]"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="delay" className="block mb-1 text-[#CBD5E1] font-medium">
            Delay entre mensagens (segundos)
          </label>
          <input
            id="delay"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            className="w-full bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554] px-3 py-2"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#172554] via-[#0F172A] to-[#172554] hover:from-[#0F172A] hover:via-[#172554] hover:to-[#172554] shadow-lg rounded-full font-semibold text-[#CBD5E1]"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default SendMediaFile;