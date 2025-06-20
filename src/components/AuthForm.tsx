"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AuthForm = () => {
  const { toast } = useToast();

  const [tab, setTab] = useState<"login" | "register">("login");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register states
  const [regEmail, setRegEmail] = useState("");
  const [regSenha, setRegSenha] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginSenha) {
      toast({
        title: "Erro",
        description: "Por favor, preencha email e senha para entrar.",
        variant: "destructive",
      });
      return;
    }

    setLoginLoading(true);

    try {
      const response = await fetch(
        "https://aplicativos-n8n.wip173.easypanel.host/webhook/login-app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: loginEmail, senha: loginSenha }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].email === loginEmail &&
        data[0].senha === loginSenha
      ) {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${loginEmail}!`,
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
      setLoginLoading(false);
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

      setTab("login");
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
      <div className="w-full max-w-md bg-black/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-700">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-200 mb-6 text-sm flex items-center gap-1"
          onClick={() => window.history.back()}
          aria-label="Voltar"
        >
          ← Voltar
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full opacity-80" />
          </div>
          <h1 className="text-white text-3xl font-semibold mb-1 select-none">
            {tab === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
          </h1>
          {tab === "login" ? (
            <p className="text-gray-400 text-sm select-none">
              Primeiro acesso?{" "}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-600 underline"
                onClick={() => setTab("register")}
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
                onClick={() => setTab("login")}
              >
                Entre aqui
              </button>
            </p>
          )}
        </div>

        <form
          onSubmit={tab === "login" ? handleLoginSubmit : handleRegisterSubmit}
          className="space-y-6"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              placeholder="Seu email"
              value={tab === "login" ? loginEmail : regEmail}
              onChange={(e) =>
                tab === "login"
                  ? setLoginEmail(e.target.value)
                  : setRegEmail(e.target.value)
              }
              className="pl-10 bg-gray-900 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="password"
              placeholder="Senha"
              value={tab === "login" ? loginSenha : regSenha}
              onChange={(e) =>
                tab === "login"
                  ? setLoginSenha(e.target.value)
                  : setRegSenha(e.target.value)
              }
              className="pl-10 bg-gray-900 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              required
              autoComplete={tab === "login" ? "current-password" : "new-password"}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 shadow-lg"
            disabled={tab === "login" ? loginLoading : regLoading}
          >
            {(tab === "login" ? loginLoading : regLoading) ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {tab === "login" ? "Entrar" : "Criar Conta"}
          </Button>
        </form>

        {tab === "login" && (
          <button
            type="button"
            className="mt-6 w-full py-2 text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium shadow-inner"
          >
            Single sign-on (SSO)
          </button>
        )}

        <p className="mt-6 text-xs text-gray-500 select-none">
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

export default AuthForm;