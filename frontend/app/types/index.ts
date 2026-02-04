export interface Product {
    _id: string;
    sku: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    images: string[];
    stock: number;
    rating: number;
    reviewCount: number;
    specifications: Record<string, any>;
    featured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    originalPrice?: number;
    features?: string[];
}

export interface User {
    _id: string;
    email: string;
    profile: {
        name: string;
        avatar?: string;
        phone?: string;
    };
    role: 'user' | 'admin';
    subscription?: {
        plan: 'basic' | 'pro' | 'elite' | null;
        status: 'active' | 'cancelled' | 'expired';
        startDate?: Date;
        endDate?: Date;
    };
    preferences: {
        categories: string[];
        brands: string[];
    };
}

export interface Order {
    _id: string;
    user: string;
    items: {
        product: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    createdAt: Date;
}

export interface CoachingPlan {
    _id: string;
    user: string;
    planType: 'basic' | 'pro' | 'elite';
    goals: string[];
    workouts: {
        day: string;
        exercises: {
            name: string;
            sets: number;
            reps: string;
            notes?: string;
        }[];
    }[];
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
        meals: string[];
    };
    progress: {
        date: Date;
        weight?: number;
        measurements?: Record<string, number>;
        notes?: string;
    }[];
    assignedCoach?: string;
}

export interface CustomerSegmentStats {
  _id: number; // cluster id
  count: number;
  avgSales: number;
  avgFrequency: number;
  avgRecency: number;
  lastUpdate: string;
}
