import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductsContextType, Product } from '../types';
import { productService } from '../services/api';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Usar productos de ejemplo si no se pueden cargar del backend
      setProducts(getExampleProducts());
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Product) => {
    try {
      const newProduct = await productService.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      // Agregar localmente si falla el backend
      setProducts(prev => [...prev, product]);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev => 
        prev.map(p => p.id === id ? updatedProduct : p)
      );
    } catch (error) {
      console.error('Error updating product:', error);
      // Actualizar localmente si falla el backend
      setProducts(prev => 
        prev.map(p => p.id === id ? { ...p, ...productData } : p)
      );
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      // Eliminar localmente si falla el backend
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
  };

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsByCategory,
      isLoading
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

// Productos de ejemplo para desarrollo
const getExampleProducts = (): Product[] => [
  {
    id: '1',
    name: 'Aretes Elegantes',
    price: 25.99,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    category: 'earrings',
    description: 'Hermosos aretes elegantes perfectos para cualquier ocasión especial.',
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Collar Dorado',
    price: 45.50,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
    category: 'necklaces',
    description: 'Collar dorado con detalles únicos que complementa cualquier outfit.',
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Pulsera de Perlas',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    category: 'bracelets',
    description: 'Elegante pulsera con perlas naturales de alta calidad.',
    inStock: true,
    featured: false,
  },
  {
    id: '4',
    name: 'Anillo de Diamante',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    category: 'rings',
    description: 'Anillo con diamante sintético de corte brillante.',
    inStock: true,
    featured: true,
  },
  {
    id: '5',
    name: 'Bolso Elegante',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'bags',
    description: 'Bolso elegante de cuero genuino con acabados de lujo.',
    inStock: true,
    featured: false,
  },
  {
    id: '6',
    name: 'Reloj Clásico',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    category: 'watches',
    description: 'Reloj clásico con mecanismo de precisión y diseño atemporal.',
    inStock: true,
    featured: true,
  },
  {
    id: '7',
    name: 'Gafas de Sol',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    category: 'sunglasses',
    description: 'Gafas de sol con protección UV y diseño moderno.',
    inStock: true,
    featured: false,
  },
  {
    id: '8',
    name: 'Conjunto de Aretes',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop',
    category: 'earrings',
    description: 'Set de aretes pequeños perfectos para uso diario.',
    inStock: true,
    featured: false,
  },
];
