"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      toast({
        title: "Erro",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://aplicativos-n8n.wip173.easypanel.host/webhook/login-app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].email === email &&
        data[0].senha === senha
      ) {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${email}!`,
          variant: "default",
        });
        login(email);
        navigate("/dashboard");
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha inválidos.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1729] px-4">
      <div className="w-full max-w-md bg-[#0F172A] rounded-xl p-8 shadow-lg border border-[#172554]">
        <button
          type="button"
          className="text-[#CBD5E1] hover:text-[#DBEAFE] mb-6 text-sm flex items-center gap-1"
          onClick={() => window.history.back()}
          aria-label="Voltar"
        >
          ← Voltar
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#172554] to-[#0F172A] flex items-center justify-center mb-4 shadow-lg">
            <div className="w-8 h-8 bg-[#CBD5E1] rounded-full opacity-80" />
          </div>
          <h1 className="text-[#CBD5E1] text-2xl font-bold mb-1 select-none">
            Yoo, bem-vindo de volta!
          </h1>
          <p className="text-[#CBD5E1] text-sm select-none">
            Primeiro acesso?{" "}
            <button
              type="button"
              className="text-[#DBEAFE] hover:text-[#CBD5E1] underline"
              onClick={() => {
                /* Aqui você pode implementar a troca para registro */
              }}
            >
              Crie uma conta
            </button>
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
            <Input
              id="email"
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 bg-[#020617] border border-[#172554] rounded-lg text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-2 focus:ring-[#172554] focus:border-transparent transition"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
            <Input
              id="senha"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pl-12 bg-[#020617] border border-[#172554] rounded-lg text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-2 focus:ring-[#172554] focus:border-transparent transition"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#172554] via-[#0F172A] to-[#172554] hover:from-[#0F172A] hover:via-[#172554] hover:to-[#0F172A] shadow-lg rounded-full font-semibold text-[#CBD5E1] transition-transform active:scale-95 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 text-[#CBD5E1]" /> : null}
            Entrar
          </Button>

          <Button
            type="button"
            className="w-full bg-[#172554] hover:bg-[#0F172A] shadow-lg rounded-full font-semibold text-[#CBD5E1] transition-transform active:scale-95"
            onClick={() => {
              /* Aqui você pode implementar a ação de criar conta */
            }}
          >
            Criar Conta
          </Button>
        </form>

        <p className="mt-6 text-xs text-[#CBD5E1] select-none text-center">
          Você reconhece que leu e concorda com nossos{" "}
          <a href="#" className="underline hover:text-[#DBEAFE]">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="underline hover:text-[#DBEAFE]">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;