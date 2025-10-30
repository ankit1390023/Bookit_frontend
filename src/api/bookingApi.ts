
import type { Booking, BookingFormData, ApiResponse } from '../types';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingApi = {
  // Create a new booking
  createBooking: async (
    bookingData: BookingFormData
  ): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.post<ApiResponse<Booking>>(
      '/bookings',
      bookingData
    );
    return response.data;
  },

  // Get booking by reference
  getBookingByReference: async (
    reference: string
  ): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.get<ApiResponse<Booking>>(
      `/bookings/reference/${reference}`
    );
    return response.data;
  },

  // Get user bookings by email
  getUserBookings: async (email: string): Promise<ApiResponse<Booking[]>> => {
    const response = await axiosInstance.get<ApiResponse<Booking[]>>(
      `/bookings/user?email=${email}`
    );
    return response.data;
  },
};