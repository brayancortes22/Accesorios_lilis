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
import { Trash2, Edit, Plus } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
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

type ProductFormData = z.infer<typeof productSchema>;

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
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
          ...data,
          id: Date.now().toString(),
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

  const handleCancelEdit = () => {
    setEditingProduct(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900/20 pt-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-gray-300">Gestiona los productos de tu tienda</p>
        </div>

        <ConnectionStatus />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Formulario */}
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-primary/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-primary/30 p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">En Stock</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-primary/30 p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">Destacado</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Vista Previa */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Vista Previa</h3>
            {previewProduct ? (
              <ProductPreview product={previewProduct} />
            ) : (
              <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-8 text-center">
                <p className="text-gray-400">Completa el formulario para ver la vista previa</p>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Productos Existentes */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-white">Productos Existentes ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white/5 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="text-white font-semibold mb-1">{product.name}</h4>
                  <p className="text-gray-300 text-sm mb-2">${product.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
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
      </div>
    </div>
  );
};

export default Admin;
