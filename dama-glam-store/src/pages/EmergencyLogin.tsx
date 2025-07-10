import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const EmergencyLogin: React.FC = () => {
  const { setUser } = useAuth() as any; // Acceso directo para emergencia
  const [loading, setLoading] = useState(false);

  const createEmergencyAdmin = () => {
    setLoading(true);
    
    // Crear usuario admin localmente
    const adminUser = {
      id: '999',
      name: 'Admin Emergencia',
      email: 'admin@emergency.com',
      phone: '123-456-7890',
      address: 'Dirección Admin',
      country: 'Colombia',
      city: 'Bogotá',
      role: 'admin' as const,
      createdAt: new Date(),
    };

    // Establecer usuario directamente
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));

    toast({
      title: "Login de Emergencia",
      description: "Usuario admin creado temporalmente",
    });

    setLoading(false);
  };

  const createEmergencyClient = () => {
    setLoading(true);
    
    // Crear usuario cliente localmente
    const clientUser = {
      id: '888',
      name: 'Cliente Emergencia',
      email: 'cliente@emergency.com',
      phone: '123-456-7890',
      address: 'Dirección Cliente',
      country: 'Colombia',
      city: 'Bogotá',
      role: 'user' as const,
      createdAt: new Date(),
    };

    // Establecer usuario directamente
    setUser(clientUser);
    localStorage.setItem('user', JSON.stringify(clientUser));

    toast({
      title: "Login de Emergencia",
      description: "Usuario cliente creado temporalmente",
    });

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="bg-card/80 backdrop-blur-sm border-destructive/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Login de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Usa esto solo si hay problemas con el login normal del backend.
              Este método crea usuarios temporales solo en el frontend.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-400" />
                    <div>
                      <h3 className="text-white font-medium">Acceso de Administrador</h3>
                      <p className="text-gray-400 text-sm">Acceso completo al panel de admin</p>
                    </div>
                  </div>
                  <Button 
                    onClick={createEmergencyAdmin}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Login Admin
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-blue-400" />
                    <div>
                      <h3 className="text-white font-medium">Acceso de Cliente</h3>
                      <p className="text-gray-400 text-sm">Acceso básico sin panel de admin</p>
                    </div>
                  </div>
                  <Button 
                    onClick={createEmergencyClient}
                    disabled={loading}
                    variant="outline"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login Cliente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Después del login de emergencia:</strong>
              <br />• Ve a `/profile` para verificar tu rol
              <br />• Los admins verán el icono de configuración ⚙️
              <br />• Los clientes no tendrán acceso al panel de admin
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              💡 Una vez que el backend esté funcionando correctamente, usa el login normal
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyLogin;
