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
import DashboardLayout from "@/components/DashboardLayout";

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
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="send-text" element={<SendText />} />
                      <Route path="send-media-url" element={<SendMediaUrl />} />
                      <Route path="send-media-file" element={<SendMediaFile />} />
                      <Route path="send-location" element={<SendLocation />} />
                      <Route path="send-list" element={<SendList />} />
                    </Routes>
                  </DashboardLayout>
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