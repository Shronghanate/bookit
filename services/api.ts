import axios from "axios";
import { Experience, ExperienceDetails, Booking, BookingResult } from "../types";

/** 
 * ✅ Backend Base URL
 * Uses environment variable on Vercel for production,
 * and falls back to localhost when running locally.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  /** 🔹 Fetch list of experiences (Home Page) */
  fetchExperiences: async (): Promise<Experience[]> => {
    const res = await axios.get(`${API_BASE_URL}/experiences`);
    return res.data;
  },

  /** 🔹 Fetch detailed experience data (Details Page) */
  fetchExperienceDetails: async (
    id: string
  ): Promise<ExperienceDetails | null> => {
    const res = await axios.get(`${API_BASE_URL}/experiences/${id}`);
    const exp = res.data;

    // ✅ Convert backend 'slots' array into 'availability' map
    const availability: Record<string, any[]> = {};
    exp.slots.forEach((slot: any) => {
      if (!availability[slot.date]) availability[slot.date] = [];
      availability[slot.date].push({
        time: slot.slot,
        available: slot.booked < slot.capacity,
        spotsLeft: slot.capacity - slot.booked,
      });
    });

    return { ...exp, availability };
  },

  /** 🔹 Create a booking (Checkout Page → Result Page) */
  createBooking: async (bookingData: Booking): Promise<BookingResult> => {
    const res = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return res.data;
  },

  /** 🔹 Validate promo code */
  validatePromoCode: async (
    code: string
  ): Promise<{ discount: number; message: string }> => {
    const res = await axios.post(`${API_BASE_URL}/promo/validate`, { code });
    return res.data;
  },

  /** 🔹 Get taxes (used in DetailsPage + CheckoutPage) */
  getTaxes: async (): Promise<number> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/taxes`);
      return typeof res.data.tax === "number" ? res.data.tax : 59; // fallback
    } catch {
      return 59; // ✅ default fallback if /taxes not found
    }
  },
};
