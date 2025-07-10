
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import Header from "./components/Layout/Header";
import BottomNav from "./components/Layout/BottomNav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Catalog from "./pages/Catalog";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SystemStatus from "./pages/SystemStatus";
import EmergencyLogin from "./pages/EmergencyLogin";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin={true}>
                        <Admin />
                      </ProtectedRoute>
                    } />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/system-status" element={<SystemStatus />} />
                    <Route path="/emergency-login" element={<EmergencyLogin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <BottomNav />
              </div>
            </BrowserRouter>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
