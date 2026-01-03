// src/types/index.ts

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

/* 🔹 Used when READING event */
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  time: string;
  location: string;
  price: number;
  capacity: number;
  bookedSeats: number;
  imageUrl: string;
  organizerId: string;
  createdAt: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}


export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}
