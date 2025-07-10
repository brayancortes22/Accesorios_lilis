
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
