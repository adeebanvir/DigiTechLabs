export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  specs: Record<string, string>;
  isNew?: boolean;
  isBestSeller?: boolean;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}
