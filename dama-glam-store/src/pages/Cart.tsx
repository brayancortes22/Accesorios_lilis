
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!user) return '';
    
    let message = `¡Hola! Me gustaría realizar el siguiente pedido:\n\n`;
    message += `*Cliente:* ${user.name}\n`;
    message += `*Email:* ${user.email}\n`;
    message += `*Teléfono:* ${user.phone}\n`;
    message += `*Dirección:* ${user.address}, ${user.city}, ${user.country}\n\n`;
    message += `*PRODUCTOS:*\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio unitario: $${item.product.price.toFixed(2)}\n`;
      message += `   Subtotal: $${(item.product.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `*TOTAL: $${totalPrice.toFixed(2)}*\n\n`;
    message += `¡Gracias por elegir GlamStore! 💎✨`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para realizar un pedido",
        variant: "destructive",
      });
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappNumber = "1234567890"; // Cambia por tu número de WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Pedido enviado",
      description: "Tu pedido se ha enviado por WhatsApp. Te contactaremos pronto.",
    });
    
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-8">
            ¡Descubre nuestros hermosos productos y encuentra algo perfecto para ti!
          </p>
          <Button asChild>
            <Link to="/catalog">Explorar Productos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <h1 className="text-3xl font-bold mb-8">Mi Carrito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-card p-6 rounded-lg border">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-muted-foreground">{item.product.description}</p>
                  <p className="text-xl font-bold text-primary mt-2">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg border sticky top-24">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {user ? (
              <Button 
                onClick={handleWhatsAppOrder} 
                className="w-full gap-2"
                size="lg"
              >
                <MessageCircle className="h-5 w-5" />
                Finalizar por WhatsApp
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Inicia sesión para finalizar tu compra
                </p>
                <Button asChild className="w-full">
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="w-full mt-3"
            >
              Vaciar Carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
