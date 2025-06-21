"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: string | null;
  login: (email: string) => void;
  logout: () => void;
  connectedInstance: string | null;
  setConnectedInstance: (instance: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [connectedInstance, setConnectedInstance] = useState<string | null>(null);

  const login = (email: string) => {
    setUser(email);
  };

  const logout = () => {
    setUser(null);
    setConnectedInstance(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, connectedInstance, setConnectedInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};