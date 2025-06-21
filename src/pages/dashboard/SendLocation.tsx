"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const SendLocation = () => {
  const { toast } = useToast();

  const [numbers, setNumbers] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [delay, setDelay] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numbers.trim() || !latitude.trim() || !longitude.trim()) {
      toast({
        title: "Erro",
        description: "Números, latitude e longitude são obrigatórios.",
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
        `${BACKEND_URL}/message/sendLocation/instance-id-placeholder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numbers: numberList,
            latitude,
            longitude,
            delay: delaySeconds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar localização");
      }

      toast({
        title: "Sucesso",
        description: "Localização enviada com sucesso.",
        variant: "default",
      });

      setNumbers("");
      setLatitude("");
      setLongitude("");
      setDelay("0");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar localização.",
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
        <h1 className="text-3xl font-bold mb-8 select-none drop-shadow-lg text-center">Enviar Localização</h1>
        <div className="mb-6">
          <Label htmlFor="numbers" className="text-[#CBD5E1]">
            Números (separados por vírgula)
          </Label>
          <Input
            id="numbers"
            type="text"
            placeholder="Ex: 5511999999999, 5511988888888"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
            required
            spellCheck={false}
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="latitude" className="text-[#CBD5E1]">
            Latitude
          </Label>
          <Input
            id="latitude"
            type="text"
            placeholder="-23.55052"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="longitude" className="text-[#CBD5E1]">
            Longitude
          </Label>
          <Input
            id="longitude"
            type="text"
            placeholder="-46.633308"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="delay" className="text-[#CBD5E1]">
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
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
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

export default SendLocation;