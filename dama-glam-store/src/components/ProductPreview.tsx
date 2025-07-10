
import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductPreviewProps {
  product: Product;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ product }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300 max-w-sm">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
          disabled
        >
          <Heart className="h-4 w-4" />
        </Button>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">
            Destacado
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          
          <Button size="sm" className="gap-2" disabled>
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </Button>
        </div>
        
        {!product.inStock && (
          <p className="text-destructive text-sm mt-2">Agotado</p>
        )}
      </div>
    </div>
  );
};

export default ProductPreview;
