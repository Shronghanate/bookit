export interface Experience {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  location: string;
}

export interface Slot {
  date: string;
  slot: string;
  capacity: number;
  booked: number;
}

export interface ExperienceDetails extends Experience {
  slots: Slot[];
}

export interface UserInfo {
  name: string;
  email: string;
}

export interface Booking {
  experience: Experience;
  date: Date;
  slot: Slot;
  guests: number;
  subtotal: number;
  taxes: number;
  totalPrice: number;
  discount: number;
  userInfo?: UserInfo;
  promoCode?: string;
}

export interface BookingResult {
  success: boolean;
  message: string;
  bookingId?: string;
  bookingDetails?: Booking;
}

export enum Page {
  HOME,
  DETAILS,
  CHECKOUT,
  RESULT,
}
