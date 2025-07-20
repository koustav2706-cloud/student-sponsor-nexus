import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ForStudents from "./pages/ForStudents";
import ForSponsors from "./pages/ForSponsors";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ChatRoom from "./pages/ChatRoom";
import DemoSponsors from "./pages/DemoSponsors";
import DemoEvents from "./pages/DemoEvents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="dark">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/for-students" element={<ForStudents />} />
              <Route path="/for-sponsors" element={<ForSponsors />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/chat/:roomId" element={<ChatRoom />} />
              <Route path="/demo-sponsors" element={<DemoSponsors />} />
              <Route path="/demo-events" element={<DemoEvents />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </div>
  </QueryClientProvider>
);

export default App;
