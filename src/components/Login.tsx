"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const { toast } = useToast();

  const [isRegistering, setIsRegistering] = useState(false);

  // Login states
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Register states
  const [regEmail, setRegEmail] = useState("");
  const [regSenha, setRegSenha] = useState("");
  const [regLoading, setRegLoading] = useState(false);

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regEmail || !regSenha) {
      toast({
        title: "Erro",
        description: "Por favor, preencha email e senha para criar conta.",
        variant: "destructive",
      });
      return;
    }

    setRegLoading(true);

    try {
      const response = await fetch(
        "https://aplicativos-n8n.wip173.easypanel.host/webhook/cadastrar-conta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: regEmail, senha: regSenha }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      toast({
        title: "Conta criada",
        description: "Cadastro realizado com sucesso. Faça login agora.",
        variant: "default",
      });

      setIsRegistering(false);
      setRegEmail("");
      setRegSenha("");
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-lg bg-black/70 backdrop-blur-md rounded-2xl p-10 shadow-lg border border-gray-700 flex flex-col items-center">
        <button
          type="button"
          className="self-start text-gray-400 hover:text-gray-200 mb-6 text-sm"
          onClick={() => window.history.back()}
          aria-label="Voltar"
        >
          ← Voltar
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
            <div className="w-10 h-10 bg-white rounded-full opacity-80" />
          </div>
          <h1 className="text-white text-3xl font-semibold mb-1 select-none">
            {isRegistering ? "Crie sua conta" : "Yooo, bem-vindo de volta!"}
          </h1>
          {!isRegistering ? (
            <p className="text-gray-400 text-sm select-none">
              Primeiro acesso?{" "}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-600 underline"
                onClick={() => setIsRegistering(true)}
              >
                Crie uma conta
              </button>
            </p>
          ) : (
            <p className="text-gray-400 text-sm select-none">
              Já tem conta?{" "}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-600 underline"
                onClick={() => setIsRegistering(false)}
              >
                Entre aqui
              </button>
            </p>
          )}
        </div>

        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} className="w-full max-w-sm space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-gray-900 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="pl-10 bg-gray-900 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Entrar
            </Button>

            <Button
              type="button"
              className="w-full mt-4 rounded-full bg-gray-800 hover:bg-gray-700 text-sm font-medium shadow-inner"
              onClick={() => setIsRegistering(true)}
            >
              Criar Conta
            </Button>

            <p className="mt-6 text-xs text-gray-500 select-none text-center px-4">
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
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="w-full max-w-sm space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                placeholder="Seu email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="pl-10 bg-gray-900 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                placeholder="Senha"
                value={regSenha}
                onChange={(e) => setRegSenha(e.target.value)}
                className="pl-10 bg-gray-900 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                required
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 shadow-lg"
              disabled={regLoading}
            >
              {regLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Criar Conta
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;