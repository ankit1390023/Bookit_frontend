// Experience Types
export interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: string;
  category: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  highlights: string[];
  included: string[];
  not_included: string[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Slot Types
export interface Slot {
  id: number;
  time: string;
  start_time: string;
  end_time: string;
  available_spots: number;
  max_capacity: number;
  is_available: boolean;
}

export interface SlotsByDate {
  [date: string]: Slot[];
}

export interface ExperienceDetails {
  experience: Experience;
  availableSlots: SlotsByDate;
}

// Booking Types
export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  experience_id: number;
  slot_id: number;
  number_of_people: number;
  promo_code?: string;
  special_requests?: string;
}

export interface Booking {
  id: number;
  user_id: number;
  experience_id: number;
  slot_id: number;
  booking_reference: string;
  number_of_people: number;
  base_price: number;
  discount_amount: number;
  total_price: number;
  promo_code: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed';
  special_requests: string | null;
  createdAt: string;
  updatedAt: string;
  experience: {
    id: number;
    title: string;
    location: string;
    duration: string;
    image_url: string;
    category: string;
  };
  slot: {
    date: string;
    time: string;
  };
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

// Promo Code Types
export interface PromoCodeData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  original_amount: number;
  final_amount: number;
}

export interface PromoCodeValidation {
  data: PromoCodeData;
  success: boolean;
  message?: string;
}

export interface PromoCodeRequest {
  code: string;
  amount: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// Filter Types
export interface ExperienceFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}