import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Places from "./pages/Places";
import PlaceDetail from "./pages/PlaceDetail";
import CreatePlace from "./pages/CreatePlace";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import CreateBlogPost from "./pages/CreateBlogPost";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/create" element={<CreatePlace />} />
            <Route path="/places/:id" element={<PlaceDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/create" element={<CreateBlogPost />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
