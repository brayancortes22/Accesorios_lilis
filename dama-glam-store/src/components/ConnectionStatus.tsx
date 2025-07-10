import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import config from '@/config';

interface DatabaseStatus {
  roles: number;
  secciones: number;
  productos: number;
  usuarios: number;
}

interface ConnectionStatus {
  isConnected: boolean;
  status: DatabaseStatus | null;
  error: string | null;
}

export const ConnectionStatus: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    status: null,
    error: null
  });
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/Seed/status`);
      
      if (response.ok) {
        const status = await response.json();
        setConnectionStatus({
          isConnected: true,
          status,
          error: null
        });
      } else {
        setConnectionStatus({
          isConnected: false,
          status: null,
          error: `Error del servidor: ${response.status}`
        });
      }
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        status: null,
        error: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/Seed/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await checkConnection(); // Refrescar estado después de inicializar
      } else {
        const errorData = await response.json();
        setConnectionStatus(prev => ({
          ...prev,
          error: `Error al inicializar: ${errorData.message || 'Error desconocido'}`
        }));
      }
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        error: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (connectionStatus.isConnected) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = () => {
    if (connectionStatus.isConnected) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Conectado</Badge>;
    }
    return <Badge variant="destructive">Desconectado</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Estado de Conexión Backend
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Estado de la conexión con la API y base de datos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={checkConnection} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Verificar Conexión
          </Button>
          
          <Button 
            onClick={initializeDatabase} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Inicializar BD
          </Button>
        </div>

        {connectionStatus.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{connectionStatus.error}</p>
          </div>
        )}

        {connectionStatus.status && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {connectionStatus.status.roles}
              </div>
              <div className="text-sm text-blue-800">Roles</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {connectionStatus.status.secciones}
              </div>
              <div className="text-sm text-green-800">Secciones</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {connectionStatus.status.productos}
              </div>
              <div className="text-sm text-purple-800">Productos</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {connectionStatus.status.usuarios}
              </div>
              <div className="text-sm text-orange-800">Usuarios</div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>API URL:</strong> {config.API_BASE_URL}</p>
          <p><strong>Entorno:</strong> {config.isDevelopment ? 'Desarrollo' : 'Producción'}</p>
        </div>
      </CardContent>
    </Card>
  );
};
