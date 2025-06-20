import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import SendText from "./pages/dashboard/SendText";
import SendMediaUrl from "./pages/dashboard/SendMediaUrl";
import SendMediaFile from "./pages/dashboard/SendMediaFile";
import SendLocation from "./pages/dashboard/SendLocation";
import SendList from "./pages/dashboard/SendList";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/send-text"
              element={
                <ProtectedRoute>
                  <SendText />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/send-media-url"
              element={
                <ProtectedRoute>
                  <SendMediaUrl />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/send-media-file"
              element={
                <ProtectedRoute>
                  <SendMediaFile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/send-location"
              element={
                <ProtectedRoute>
                  <SendLocation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/send-list"
              element={
                <ProtectedRoute>
                  <SendList />
                </ProtectedRoute>
              }
            />
            {/* Outras rotas de disparo podem ser adicionadas aqui */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;