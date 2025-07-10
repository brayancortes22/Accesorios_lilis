
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Settings, Heart, ShoppingBag, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const { items, totalPrice } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900/20 pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-lg p-8 max-w-md mx-auto">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Inicia Sesión</h2>
              <p className="text-gray-400 mb-6">
                Necesitas iniciar sesión para ver tu perfil
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Productos en Carrito',
      value: items.length,
      icon: ShoppingBag,
      color: 'text-blue-400'
    },
    {
      label: 'Total del Carrito',
      value: `$${totalPrice.toFixed(2)}`,
      icon: Star,
      color: 'text-green-400'
    },
    {
      label: 'Productos Favoritos',
      value: '0',
      icon: Heart,
      color: 'text-pink-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900/20 pt-20 pb-24">
      <div className="container mx-auto px-4">
        {/* Header del Perfil */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary to-pink-500 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
          <p className="text-gray-300">Miembro desde {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Personal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Teléfono</p>
                      <p className="text-white">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Dirección</p>
                      <p className="text-white">{user.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">País - Ciudad</p>
                      <p className="text-white">{user.country} - {user.city}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button variant="destructive" onClick={logout}>
                    Cerrar Sesión
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Carrito Actual */}
            {items.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Tu Carrito Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.product.name}</p>
                          <p className="text-gray-400 text-sm">
                            Cantidad: {item.quantity} × ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-primary font-bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-gray-400 text-center">
                        y {items.length - 3} producto{items.length - 3 !== 1 ? 's' : ''} más...
                      </p>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-primary/20">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-primary font-bold text-lg">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/cart">Ver Carrito Completo</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Estadísticas */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{stat.value}</p>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enlaces Rápidos */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-white">Enlaces Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                  <Link to="/">
                    <User className="h-4 w-4 mr-2" />
                    Inicio
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                  <Link to="/catalog">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Catálogo
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                  <Link to="/cart">
                    <Star className="h-4 w-4 mr-2" />
                    Mi Carrito
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Badge de Usuario */}
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                ⭐ Usuario Premium
              </Badge>
              <p className="text-gray-400 text-sm mt-2">
                Disfruta de beneficios exclusivos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
