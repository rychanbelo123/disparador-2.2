"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send, Home, MessageCircle, Users, Bell, Settings, Search } from "lucide-react";

const Dashboard = () => {
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [delay, setDelay] = useState(1);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const sendMessages = async () => {
    setError(null);
    const nums = numbers
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (nums.length === 0) {
      setError("Por favor, insira pelo menos um número.");
      return;
    }
    if (!message.trim()) {
      setError("Por favor, insira a mensagem a ser enviada.");
      return;
    }
    if (delay < 0) {
      setError("O delay deve ser zero ou positivo.");
      return;
    }

    setSending(true);
    setProgress({ sent: 0, total: nums.length });
    abortController.current = new AbortController();

    try {
      for (let i = 0; i < nums.length; i++) {
        if (abortController.current.signal.aborted) {
          break;
        }
        const number = nums[i];

        const body = {
          number,
          text: message,
          delay: delay * 1000,
        };

        const response = await fetch(
          "https://your-whatsapp-api-baseurl/message/sendText/your-instance",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: abortController.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao enviar para ${number}`);
        }

        setProgress((prev) => ({ ...prev, sent: prev.sent + 1 }));

        if (i < nums.length - 1) {
          await new Promise((res) => setTimeout(res, delay * 1000));
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Erro desconhecido ao enviar mensagens.");
      }
    } finally {
      setSending(false);
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen flex bg-sidebar-background text-sidebar-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar p-6 flex flex-col gap-6 border-r border-sidebar-border">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg select-none">
            WA
          </div>
          <h1 className="text-xl font-bold">WhatsApp Pro</h1>
        </div>
        <nav className="flex flex-col gap-4 text-sm font-medium">
          <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Home className="h-5 w-5" />
            Dashboard
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <MessageCircle className="h-5 w-5" />
            Mensagens
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Users className="h-5 w-5" />
            Contatos
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Bell className="h-5 w-5" />
            Notificações
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Settings className="h-5 w-5" />
            Configurações
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-blue-400">Message Control Center</h2>
            <p className="text-sm text-muted-foreground">Gerencie suas campanhas de automação WhatsApp</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Buscar"
              className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
            >
              <Search className="h-6 w-6 text-muted-foreground" />
            </button>
            <button
              aria-label="Notificações"
              className="p-2 rounded-md hover:bg-sidebar-accent transition-colors relative"
            >
              <Bell className="h-6 w-6 text-muted-foreground" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-black" />
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-sidebar p-6 rounded-lg shadow-md flex flex-col">
            <span className="text-sm text-muted-foreground mb-2">Mensagens Enviadas</span>
            <span className="text-2xl font-bold">12,847</span>
            <span className="text-green-500 text-sm mt-auto">+12%</span>
          </div>
          <div className="bg-sidebar p-6 rounded-lg shadow-md flex flex-col">
            <span className="text-sm text-muted-foreground mb-2">Contatos Ativos</span>
            <span className="text-2xl font-bold">3,429</span>
            <span className="text-green-500 text-sm mt-auto">+8%</span>
          </div>
          <div className="bg-sidebar p-6 rounded-lg shadow-md flex flex-col">
            <span className="text-sm text-muted-foreground mb-2">Taxa de Sucesso</span>
            <span className="text-2xl font-bold">98.2%</span>
            <span className="text-green-500 text-sm mt-auto">+2%</span>
          </div>
        </section>

        {/* Send Text Card */}
        <section className="bg-sidebar p-6 rounded-lg shadow-md max-w-3xl">
          <div className="flex items-center mb-4 gap-4">
            <div className="p-3 rounded-lg bg-blue-700 text-blue-300">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Disparo por Texto</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Envie mensagens de texto para seus contatos com suporte a múltiplos números e delay configurável.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              sendMessages();
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <Label htmlFor="numbers" className="mb-1 block text-sm font-medium">
                Números (separados por vírgula ou nova linha)
              </Label>
              <Textarea
                id="numbers"
                rows={4}
                placeholder="Ex: 5511999999999, 5511888888888"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                className="bg-gray-900 text-white placeholder-gray-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="message" className="mb-1 block text-sm font-medium">
                Mensagem
              </Label>
              <Textarea
                id="message"
                rows={3}
                placeholder="Digite a mensagem a ser enviada"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-gray-900 text-white placeholder-gray-500"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="delay" className="mb-1 block text-sm font-medium">
                  Delay entre mensagens (segundos)
                </Label>
                <Input
                  id="delay"
                  type="number"
                  min={0}
                  step={1}
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="bg-gray-900 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <div className="text-sm text-muted-foreground">
                  Progresso: {progress.sent} / {progress.total}
                </div>
                {sending && (
                  <progress
                    className="w-full h-3 rounded-md overflow-hidden mt-1"
                    value={progress.sent}
                    max={progress.total}
                  />
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2"
              >
                {sending && <Loader2 className="animate-spin h-5 w-5" />}
                Enviar Mensagens
              </Button>
              {sending && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;