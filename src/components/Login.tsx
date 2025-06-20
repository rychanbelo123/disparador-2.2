"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Verifica se o usuário existe e dados batem
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
        // Aqui você pode redirecionar ou atualizar o estado do app
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha inválidos.",
          variant: "destructive",
        });
      }
    } catch (error) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-700">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-200 mb-6 text-sm flex items-center gap-1"
          onClick={() => window.history.back()}
          aria-label="Voltar"
        >
          ← Back
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
            {/* Ícone central */}
            <div className="w-8 h-8 bg-white rounded-full opacity-80" />
          </div>
          <h1 className="text-white text-3xl font-semibold mb-1 select-none">
            Yooo, welcome back!
          </h1>
          <p className="text-gray-400 text-sm select-none">
            First time here?{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-600 underline"
            >
              Sign up for free
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-gray-900 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pl-10 bg-gray-900 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            Sign in
          </Button>
        </form>

        <button
          type="button"
          className="mt-6 w-full py-2 text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium shadow-inner"
        >
          Single sign-on (SSO)
        </button>

        <p className="mt-6 text-xs text-gray-500 select-none">
          You acknowledge that you read, and agree, to our{" "}
          <a href="#" className="underline hover:text-gray-300">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-300">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;