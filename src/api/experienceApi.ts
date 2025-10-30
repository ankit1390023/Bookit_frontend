
import axios from 'axios';
import type {
  Experience,
  ExperienceDetails,
  ApiResponse,
} from '../types';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const experienceApi = {
  // Get all experiences with optional filters
  getAllExperiences: async (params: {
    search?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());

    const url = `http://localhost:5000/api/experiences${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await axios.get<ApiResponse<Experience[]>>(url);

    // Transform the response to ensure proper data types
    if (response.data && response.data.data) {
      response.data.data = response.data.data.map(exp => ({
        ...exp,
        rating: Number(exp.rating),
        price: Number(exp.price),
        reviews_count: Number(exp.reviews_count),
        id: Number(exp.id),
        highlights: exp.highlights || [],
        included: exp.included || [],
        not_included: exp.not_included || []
      }));
    }

    console.log("Processed response:", response.data);
    return response.data;
  },

  // Get single experience by ID
  getExperienceById: async (id: number)=> {
    const response = await axios.get<ApiResponse<ExperienceDetails>>(
      `http://localhost:5000/api/experiences/${id}`
    );
    return response.data;
  },

  // Get available dates for an experience
  getAvailableDates: async (id: number)=> {
    const response = await axios.get<ApiResponse<string[]>>(
      `http://localhost:5000/api/experiences/${id}`
    );
    return response.data;
  },
};