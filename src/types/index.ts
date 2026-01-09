export interface Flower {
  id: number;
  name: string;
  price: number;
  image: string;
  available: number;
}

export interface Bouquet {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  status: 'pending' | 'assembling' | 'ready' | 'delivering' | 'completed';
  items: CartItem[];
  total: number;
  createdAt: Date;
  readyAt?: Date;
}
