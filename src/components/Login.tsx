"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2, Smile } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0a0f14] via-[#12171d] to-[#0a0f14] relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md bg-black/60 backdrop-blur-lg rounded-2xl p-10 shadow-xl border border-green-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center mb-4 shadow-lg">
            <Smile size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 select-none">
            Bem-vindo de volta!
          </h1>
          <p className="text-green-300 text-sm select-none">
            Faça login para continuar e aproveitar nossos recursos.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-green-300 mb-2 font-semibold">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <Input
                id="email"
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-black/40 text-white placeholder-green-500 focus:ring-green-500 focus:border-green-500 rounded-lg transition"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-green-300 mb-2 font-semibold">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <Input
                id="senha"
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="pl-10 bg-black/40 text-white placeholder-green-500 focus:ring-green-500 focus:border-green-500 rounded-lg transition"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 shadow-lg rounded-lg font-semibold text-white transition-transform active:scale-95 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Smile className="h-5 w-5" />}
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;