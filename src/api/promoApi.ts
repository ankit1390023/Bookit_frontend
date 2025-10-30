import type { PromoCodeRequest, PromoCodeValidation } from '../types';
import { axiosInstance } from './config';

export const promoApi = {
  // Validate a promo code
  validatePromoCode: async (data: PromoCodeRequest): Promise<PromoCodeValidation> => {
    try {
      const response = await axiosInstance.post<PromoCodeValidation>('/promo/validate', data);
      return response.data;
    } catch (error) {
      console.error('Error validating promo code:', error);
      throw error;
    }
  },

  // Apply a promo code to a booking
  applyPromoCode: async (
    bookingId: string, 
    promoCode: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(
        `/bookings/${bookingId}/apply-promo`,
        { code: promoCode }
      );
      return response.data;
    } catch (error) {
      console.error('Error applying promo code:', error);
      throw error;
    }
  }
};

export default promoApi;