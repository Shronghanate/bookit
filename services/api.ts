import axios from "axios";
import {
  Experience,
  ExperienceDetails,
  Booking,
  BookingResult,
} from "../types";

/**
 * ✅ Backend Base URL
 * - Uses Vercel environment variable in production
 * - Falls back to localhost in development
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://talented-reverence-production.up.railway.app/api"; // fallback to deployed backend

/**
 * ✅ Create a reusable axios instance
 * - Includes timeout and default headers
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  /** 🔹 Fetch list of experiences (Home Page) */
  fetchExperiences: async (): Promise<Experience[]> => {
    try {
      const res = await axiosInstance.get("/experiences");
      return res.data;
    } catch (err) {
      console.error("❌ Error fetching experiences:", err);
      return [];
    }
  },

  /** 🔹 Fetch detailed experience data (Details Page) */
  fetchExperienceDetails: async (
    id: string
  ): Promise<ExperienceDetails | null> => {
    try {
      const res = await axiosInstance.get(`/experiences/${id}`);
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
    } catch (err) {
      console.error(`❌ Error fetching experience ${id}:`, err);
      return null;
    }
  },

  /** 🔹 Create a booking (Checkout Page → Result Page) */
  createBooking: async (bookingData: Booking): Promise<BookingResult> => {
    try {
      const res = await axiosInstance.post("/bookings", bookingData);
      return res.data;
    } catch (err) {
      console.error("❌ Error creating booking:", err);
      throw err;
    }
  },

  /** 🔹 Validate promo code */
  validatePromoCode: async (
    code: string
  ): Promise<{ discount: number; message: string }> => {
    try {
      const res = await axiosInstance.post("/promo/validate", { code });
      return res.data;
    } catch (err) {
      console.error("❌ Error validating promo code:", err);
      return { discount: 0, message: "Invalid promo code" };
    }
  },

  /** 🔹 Get taxes (used in DetailsPage + CheckoutPage) */
  getTaxes: async (): Promise<number> => {
    try {
      const res = await axiosInstance.get("/taxes");
      return typeof res.data.tax === "number" ? res.data.tax : 59; // fallback
    } catch (err) {
      console.warn("⚠️ Using fallback tax rate (59):", err);
      return 59;
    }
  },
};
