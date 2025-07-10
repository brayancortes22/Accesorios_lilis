
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingBag, User, Settings } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/catalog', icon: Grid3X3, label: 'Catálogo' },
    { path: '/cart', icon: ShoppingBag, label: 'Carrito', badge: totalItems },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  // Agregar opción de admin si el usuario es admin
  if (isAdmin) {
    navItems.splice(3, 0, { path: '/admin', icon: Settings, label: 'Admin' });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center py-2 px-4 relative ${
              isActive(path)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1">{label}</span>
            {badge && badge > 0 && (
              <span className="absolute -top-1 right-2 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
