"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const { toast } = useToast();

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
        // Aqui pode redirecionar ou atualizar estado
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f14]">
      <div className="w-full max-w-md bg-[#12171d] rounded-xl p-8 shadow-lg border border-[#1a202c]">
        <h1 className="text-3xl font-bold text-white mb-6 select-none">Welcome Back</h1>
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-[#0f141a] text-white placeholder-gray-500 focus:ring-green-500 focus:border-green-500 rounded-md"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-gray-400 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                id="senha"
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="pl-10 bg-[#0f141a] text-white placeholder-gray-500 focus:ring-green-500 focus:border-green-500 rounded-md"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;