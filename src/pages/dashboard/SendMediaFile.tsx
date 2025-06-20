"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import BottomMenu from "@/components/BottomMenu";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const SendMediaFile = () => {
  const { toast } = useToast();

  const [number, setNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!number || !file) {
      toast({
        title: "Erro",
        description: "Número e arquivo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("number", number);
      formData.append("file", file);

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

      setNumber("");
      setFile(null);
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
    <div className="flex flex-col min-h-screen bg-[#0F1729] text-[#CBD5E1] px-6 pt-6 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-[#DBEAFE] select-none">Enviar Mídia via Arquivo</h1>
      <form
        onSubmit={handleSend}
        className="max-w-lg bg-[#0F172A] rounded-xl p-8 shadow-lg border border-[#172554] mx-auto"
      >
        <div className="mb-6">
          <label htmlFor="number" className="block mb-1 text-[#CBD5E1] font-medium">
            Número (ex: 5511999999999)
          </label>
          <input
            id="number"
            type="text"
            placeholder="Número do destinatário"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full bg-[#020617] text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554] px-3 py-2"
            required
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
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#172554] via-[#0F172A] to-[#172554] hover:from-[#0F172A] hover:via-[#172554] hover:to-[#0F172A] shadow-lg rounded-full font-semibold text-[#CBD5E1]"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
      <BottomMenu />
    </div>
  );
};

export default SendMediaFile;