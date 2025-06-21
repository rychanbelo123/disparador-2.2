"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { MessageCircle, Smartphone, Lock, ArrowRight, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
  type?: string;
}

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}

const Login = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  // States for login logic
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // States for UI steps and effects
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Submit phone number: here we use email and senha login logic instead
  const handlePhoneSubmit = async (e: React.FormEvent) => {
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

  // Verification submit placeholder (not used in current logic)
  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Could implement verification logic here if needed
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-black to-green-800/20" />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[120vh] h-[60vh] rounded-full bg-green-300/5 blur-[80px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      </div>

      {/* Floating WhatsApp icons */}
      <motion.div
        className="absolute top-20 left-20 text-green-500/20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <MessageCircle size={40} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 text-green-400/20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Smartphone size={35} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Card glow effect */}
            <motion.div
              className="absolute -inset-[2px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  "0 0 20px 4px rgba(34, 197, 94, 0.1)",
                  "0 0 30px 8px rgba(34, 197, 94, 0.2)",
                  "0 0 20px 4px rgba(34, 197, 94, 0.1)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
            />

            {/* Traveling light beam effect */}
            <div className="absolute -inset-[1px] rounded-3xl overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-green-400 to-transparent"
                animate={{
                  left: ["-40%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  left: {
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 2,
                  },
                  opacity: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }}
              />

              <motion.div
                className="absolute top-0 right-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-green-400 to-transparent"
                animate={{
                  top: ["-40%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  top: {
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: 0.75,
                  },
                  opacity: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.75,
                  },
                }}
              />

              <motion.div
                className="absolute bottom-0 right-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-green-400 to-transparent"
                animate={{
                  right: ["-40%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  right: {
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: 1.5,
                  },
                  opacity: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.5,
                  },
                }}
              />

              <motion.div
                className="absolute bottom-0 left-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-green-400 to-transparent"
                animate={{
                  bottom: ["-40%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  bottom: {
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: 2.25,
                  },
                  opacity: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 2.25,
                  },
                }}
              />
            </div>

            {/* Glass card background */}
            <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-400/5 rounded-3xl" />

              {/* WhatsApp logo and header */}
              <div className="text-center space-y-4 mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-16 h-16 rounded-full bg-green-500 flex items-center justify-center relative overflow-hidden shadow-lg shadow-green-500/30"
                >
                  <MessageCircle className="text-white" size={32} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                >
                  WhatsApp
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-sm"
                >
                  {step === "phone"
                    ? "Por favor, preencha email e senha para entrar."
                    : "Enter the verification code"}
                </motion.p>
              </div>

              <AnimatePresence mode="wait">
                {step === "phone" ? (
                  <motion.form
                    key="phone-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handlePhoneSubmit}
                    className="space-y-6"
                  >
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <Smartphone className="text-white/60" size={18} />
                        <span className="text-white/60 text-sm">Email</span>
                      </div>

                      <Input
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="pl-16"
                        required
                        autoComplete="email"
                      />

                      {focusedInput === "email" && (
                        <motion.div
                          layoutId="input-highlight"
                          className="absolute inset-0 bg-green-500/10 rounded-xl -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>

                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <Lock className="text-white/60" size={18} />
                        <span className="text-white/60 text-sm">Senha</span>
                      </div>

                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        onFocus={() => setFocusedInput("senha")}
                        onBlur={() => setFocusedInput(null)}
                        className="pl-16"
                        required
                        autoComplete="current-password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>

                      {focusedInput === "senha" && (
                        <motion.div
                          layoutId="input-highlight"
                          className="absolute inset-0 bg-green-500/10 rounded-xl -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full relative group/button"
                    >
                      <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />

                      <div className="relative overflow-hidden bg-green-500 hover:bg-green-600 text-white font-medium h-12 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Entrar
                            <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="verification-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleVerificationSubmit}
                    className="space-y-6"
                  >
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Lock className="text-white/60" size={18} />
                      </div>

                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        onFocus={() => setFocusedInput("code")}
                        onBlur={() => setFocusedInput(null)}
                        className="pl-12 text-center tracking-widest"
                        maxLength={6}
                        required
                      />

                      {focusedInput === "code" && (
                        <motion.div
                          layoutId="input-highlight"
                          className="absolute inset-0 bg-green-500/10 rounded-xl -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>

                    <div className="text-center">
                      <p className="text-white/60 text-sm mb-2">
                        Code sent to {email}
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep("phone")}
                        className="text-green-400 hover:text-green-300 text-sm transition-colors"
                      >
                        Change email
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full relative group/button"
                    >
                      <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />

                      <div className="relative overflow-hidden bg-green-500 hover:bg-green-600 text-white font-medium h-12 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Verify & Continue
                            <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="relative mt-8 mb-6 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-4 text-xs text-white/40">or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* QR Code option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full relative group/qr"
              >
                <div className="relative overflow-hidden bg-white/5 hover:bg-white/10 text-white font-medium h-12 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3">
                  <QrCode className="w-5 h-5 text-white/80 group-hover/qr:text-white transition-colors duration-300" />
                  <span className="text-white/80 group-hover/qr:text-white transition-colors text-sm">
                    Login with QR Code
                  </span>
                </div>
              </motion.button>

              {/* Footer */}
              <motion.p
                className="text-center text-xs text-white/50 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                By continuing, you agree to WhatsApp's{" "}
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                  Privacy Policy
                </a>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;