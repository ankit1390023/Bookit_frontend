import type { ApiResponse, BookingFormData, Booking } from '../types';
import { axiosInstance } from './config';

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