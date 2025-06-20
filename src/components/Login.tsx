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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#121828] to-[#1e293b] px-4">
      <div className="w-full max-w-md bg-[#111827] rounded-xl p-8 shadow-lg border border-gray-700">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-200 mb-6 text-sm flex items-center gap-1"
          onClick={() => window.history.back()}
          aria-label="Voltar"
        >
          ← Voltar
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg">
            <div className="w-8 h-8 bg-purple-300 rounded-full opacity-80" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-1 select-none">
            Yoo, bem-vindo de volta!
          </h1>
          <p className="text-gray-400 text-sm select-none">
            Primeiro acesso?{" "}
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-600 underline"
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
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="senha"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pl-12 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 hover:from-purple-700 hover:via-pink-600 hover:to-pink-700 shadow-lg rounded-full font-semibold text-white transition-transform active:scale-95 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
            Entrar
          </Button>

          <Button
            type="button"
            className="w-full bg-green-900 hover:bg-green-800 shadow-lg rounded-full font-semibold text-white transition-transform active:scale-95"
            onClick={() => {
              /* Aqui você pode implementar a ação de criar conta */
            }}
          >
            Criar Conta
          </Button>
        </form>

        <p className="mt-6 text-xs text-gray-400 select-none text-center">
          Você reconhece que leu e concorda com nossos{" "}
          <a href="#" className="underline hover:text-gray-300">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="underline hover:text-gray-300">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;