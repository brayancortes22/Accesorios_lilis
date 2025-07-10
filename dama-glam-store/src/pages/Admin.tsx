import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit, Plus, UserPlus, Users } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import ProductPreview from '@/components/ProductPreview';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { toast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  image: z.string().url('Debe ser una URL válida'),
  category: z.enum(['earrings', 'necklaces', 'bracelets', 'rings', 'bags', 'watches', 'sunglasses']),
  description: z.string().min(1, 'La descripción es requerida'),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
});

const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  country: z.string().min(1, 'El país es requerido'),
  city: z.string().min(1, 'La ciudad es requerida'),
  role: z.enum(['admin', 'user']),
});

type ProductFormData = z.infer<typeof productSchema>;
type UserFormData = z.infer<typeof userSchema>;

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { createUser } = useAuth();
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = React.useState<Product | null>(null);

  const categories = [
    { value: 'earrings', label: 'Aretes' },
    { value: 'necklaces', label: 'Collares' },
    { value: 'bracelets', label: 'Pulseras' },
    { value: 'rings', label: 'Anillos' },
    { value: 'bags', label: 'Bolsos' },
    { value: 'watches', label: 'Relojes' },
    { value: 'sunglasses', label: 'Gafas' },
  ];

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      image: '',
      category: 'earrings',
      description: '',
      inStock: true,
      featured: false,
    },
  });

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      country: '',
      city: '',
      role: 'user',
    },
  });

  const watchedValues = form.watch();

  React.useEffect(() => {
    // Solo crear la vista previa si todos los campos requeridos están presentes y válidos
    if (watchedValues.name && 
        watchedValues.name.trim() !== '' && 
        watchedValues.price > 0 && 
        watchedValues.image && 
        watchedValues.image.trim() !== '' && 
        watchedValues.description && 
        watchedValues.description.trim() !== '') {
      setPreviewProduct({
        id: 'preview',
        name: watchedValues.name,
        price: watchedValues.price,
        image: watchedValues.image,
        category: watchedValues.category,
        description: watchedValues.description,
        inStock: watchedValues.inStock,
        featured: watchedValues.featured,
      });
    } else {
      setPreviewProduct(null);
    }
  }, [watchedValues]);

  const onSubmit = (data: ProductFormData) => {
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, data);
        toast({
          title: "Producto actualizado",
          description: "El producto se actualizó correctamente",
        });
        setEditingProduct(null);
      } else {
        const newProduct: Product = {
          id: Date.now().toString(),
          name: data.name,
          price: data.price,
          image: data.image,
          category: data.category,
          description: data.description,
          inStock: data.inStock,
          featured: data.featured,
        };
        addProduct(newProduct);
        toast({
          title: "Producto agregado",
          description: "El producto se agregó correctamente",
        });
      }
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el producto",
        variant: "destructive",
      });
    }
  };

  const onUserSubmit = async (data: UserFormData) => {
    try {
      const success = await createUser(data as Required<UserFormData>);
      if (success) {
        toast({
          title: "Usuario creado",
          description: `El ${data.role === 'admin' ? 'administrador' : 'usuario'} se creó correctamente`,
        });
        userForm.reset();
      } else {
        toast({
          title: "Error",
          description: "No se pudo crear el usuario",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el usuario",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset(product);
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
    toast({
      title: "Producto eliminado",
      description: "El producto se eliminó correctamente",
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900/20 pt-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-gray-300">Gestiona productos y usuarios de tu tienda</p>
        </div>

        <ConnectionStatus />

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Gestión de Productos
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Gestión de Usuarios
            </TabsTrigger>
          </TabsList>

          {/* Tab de Productos */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Formulario de Productos */}
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/10 border-primary/30 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Precio</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                className="bg-white/10 border-primary/30 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">URL de la Imagen</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/10 border-primary/30 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Categoría</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-primary/30 text-white">
                                  <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Descripción</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="bg-white/10 border-primary/30 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name="inStock"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-primary/30 p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base text-white">En Stock</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-primary/30 p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base text-white">Destacado</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          {editingProduct ? 'Actualizar' : 'Agregar'} Producto
                        </Button>
                        {editingProduct && (
                          <Button type="button" variant="outline" onClick={cancelEdit}>
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Vista Previa del Producto */}
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white">Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                  {previewProduct ? (
                    <ProductPreview product={previewProduct} />
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      Completa los campos del formulario para ver la vista previa
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lista de Productos */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-white">Productos Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white/5 rounded-lg p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-gray-400">${product.price.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">{product.category}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Usuarios */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario de Usuarios */}
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Crear Nuevo Usuario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                      <FormField
                        control={userForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Nombre Completo</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/10 border-primary/30 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="bg-white/10 border-primary/30 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Contraseña</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" className="bg-white/10 border-primary/30 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Teléfono</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/10 border-primary/30 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Dirección</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/10 border-primary/30 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={userForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">País</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/10 border-primary/30 text-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={userForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Ciudad</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/10 border-primary/30 text-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={userForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Tipo de Usuario</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-primary/30 text-white">
                                  <SelectValue placeholder="Selecciona el tipo de usuario" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="user">Usuario Normal</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Crear Usuario
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Información sobre la gestión de usuarios */}
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white">Información de Gestión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <h3 className="text-blue-300 font-medium mb-2">Usuarios Normales</h3>
                    <p className="text-gray-300 text-sm">
                      Pueden navegar por la tienda, agregar productos al carrito y realizar compras.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <h3 className="text-purple-300 font-medium mb-2">Administradores</h3>
                    <p className="text-gray-300 text-sm">
                      Tienen acceso completo al panel de administración, pueden gestionar productos y crear nuevos usuarios.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <h3 className="text-yellow-300 font-medium mb-2">⚠️ Importante</h3>
                    <p className="text-gray-300 text-sm">
                      Solo los administradores pueden crear nuevos usuarios. Asegúrate de asignar el rol correcto.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
