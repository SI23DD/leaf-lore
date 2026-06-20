export type Language = 'English' | 'Japanese' | 'Hindi' | 'Marathi' | 'Manga/Anime';
export type Genre = 'Fiction' | 'Non-fiction' | 'Mystery' | 'Romance' | 'Fantasy' | 'Self-help' | "Children's" | 'Manga' | 'Poetry' | 'History';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface DbBook {
  id: string;
  title: string;
  author: string;
  price: number;
  language: Language;
  genre: Genre;
  rating: number;
  description: string;
  cover_color: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface DbOrder {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  book_id: string;
  quantity: number;
  unit_price: number;
  book?: DbBook;
}

export interface Database {
  public: {
    Tables: {
      books: { Row: DbBook; Insert: Omit<DbBook, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<DbBook, 'id' | 'created_at' | 'updated_at'>> };
      users: { Row: DbUser; Insert: Omit<DbUser, 'created_at'>; Update: Partial<Omit<DbUser, 'id' | 'created_at'>> };
      orders: { Row: DbOrder; Insert: Omit<DbOrder, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<DbOrder, 'id' | 'created_at' | 'updated_at'>> };
      order_items: { Row: DbOrderItem; Insert: Omit<DbOrderItem, 'id'>; Update: Partial<Omit<DbOrderItem, 'id'>> };
    };
  };
}
