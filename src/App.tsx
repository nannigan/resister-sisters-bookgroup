import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TokenGate from "./components/TokenGate";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import Members from "./pages/Members";
import AdminPanel from "./pages/AdminPanel";
import Vote from "./pages/Vote";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app/:token" element={<TokenGate />}>
            <Route index element={<BookList />} />
            <Route path="books/:bookId" element={<BookDetail />} />
            <Route path="members" element={<Members />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
