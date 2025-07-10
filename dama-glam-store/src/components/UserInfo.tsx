import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { User, Shield, Clock } from 'lucide-react';

const UserInfo: React.FC = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No hay usuario autenticado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5" />
          Información del Usuario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Nombre:</span>
          <span className="text-sm text-white">{user.name}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Email:</span>
          <span className="text-sm text-white">{user.email}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Rol:</span>
          <Badge variant={isAdmin ? "default" : "secondary"} className="gap-1">
            <Shield className="h-3 w-3" />
            {isAdmin ? 'Administrador' : 'Cliente'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Teléfono:</span>
          <span className="text-sm text-white">{user.phone || 'No especificado'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Dirección:</span>
          <span className="text-sm text-white">{user.address || 'No especificada'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Registro:</span>
          <span className="text-sm text-white flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {user.createdAt.toLocaleDateString()}
          </span>
        </div>

        {isAdmin && (
          <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
            <p className="text-green-300 text-sm flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Tienes acceso al panel de administración
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserInfo;
