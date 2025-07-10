export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'earrings' | 'necklaces' | 'bracelets' | 'rings' | 'bags' | 'watches' | 'sunglasses';
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  createUser: (userData: RegisterData & { role: 'admin' | 'user' }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  role?: 'admin' | 'user';
}

export interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  isLoading: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ProductDetail: { product: Product };
  Profile: undefined;
  Admin: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Catalog: undefined;
  Cart: undefined;
  Profile: undefined;
};

export const CATEGORIES = [
  { value: 'earrings', label: 'Aretes', icon: '💎' },
  { value: 'necklaces', label: 'Collares', icon: '📿' },
  { value: 'bracelets', label: 'Pulseras', icon: '🔗' },
  { value: 'rings', label: 'Anillos', icon: '💍' },
  { value: 'bags', label: 'Bolsos', icon: '👜' },
  { value: 'watches', label: 'Relojes', icon: '⌚' },
  { value: 'sunglasses', label: 'Gafas', icon: '🕶️' },
] as const;
