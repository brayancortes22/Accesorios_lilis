import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Database, Server, Wifi } from 'lucide-react';
import config from '@/config';

interface SystemStatus {
  backend: boolean;
  database: boolean;
  api: boolean;
  products: number;
  errors: string[];
}

const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    backend: false,
    database: false,
    api: false,
    products: 0,
    errors: []
  });
  const [loading, setLoading] = useState(false);

  const checkSystemStatus = async () => {
    setLoading(true);
    const newStatus: SystemStatus = {
      backend: false,
      database: false,
      api: false,
      products: 0,
      errors: []
    };

    try {
      // Test backend connection
      const healthResponse = await fetch(`${config.API_BASE_URL}/health`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (healthResponse.ok) {
        newStatus.backend = true;
        newStatus.api = true;
      }
    } catch (error) {
      newStatus.errors.push('Backend no responde - Verificar que esté corriendo en puerto 7147');
    }

    try {
      // Test products endpoint
      const productsResponse = await fetch(`${config.API_BASE_URL}/Producto`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        newStatus.products = Array.isArray(products) ? products.length : 0;
        newStatus.database = true;
        if (!newStatus.backend) newStatus.backend = true;
        if (!newStatus.api) newStatus.api = true;
      }
    } catch (error) {
      newStatus.errors.push('No se pueden cargar productos - Verificar base de datos');
    }

    setStatus(newStatus);
    setLoading(false);
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Estado del Sistema</h1>
          <p className="text-muted-foreground">Diagnóstico de Dama Glam Store</p>
        </div>
        <Button 
          onClick={checkSystemStatus} 
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Backend Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backend</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status.backend ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <Badge variant={status.backend ? "default" : "destructive"}>
                {status.backend ? "Conectado" : "Desconectado"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {config.API_BASE_URL}
            </p>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de Datos</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status.database ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <Badge variant={status.database ? "default" : "destructive"}>
                {status.database ? "Activa" : "Inactiva"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {status.products} productos cargados
            </p>
          </CardContent>
        </Card>

        {/* API Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status.api ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <Badge variant={status.api ? "default" : "destructive"}>
                {status.api ? "Funcionando" : "Error"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Endpoints REST
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Errors */}
      {status.errors.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Problemas Detectados
          </h2>
          {status.errors.map((error, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Actual</CardTitle>
          <CardDescription>
            Información de configuración del frontend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">URL del Backend:</span>
            <span className="text-sm font-mono">{config.API_BASE_URL}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Modo:</span>
            <span className="text-sm">{config.isDevelopment ? 'Desarrollo' : 'Producción'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Versión:</span>
            <span className="text-sm">{config.APP_VERSION}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Si el Backend no está conectado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Ve a la carpeta del backend: <code className="bg-muted px-1 rounded">back_accesorios/Accesorios</code></p>
              <p>2. Ejecuta: <code className="bg-muted px-1 rounded">dotnet run --project Web</code></p>
              <p>3. Verifica que esté en puerto 7147</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Si la Base de Datos falla</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Verificar connection string en appsettings.json</p>
              <p>2. Ejecutar migraciones: <code className="bg-muted px-1 rounded">dotnet ef database update</code></p>
              <p>3. Verificar que SQL Server esté corriendo</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
