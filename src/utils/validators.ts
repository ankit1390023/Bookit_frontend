// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic validation)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Validate name
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Form validation
export interface ValidationErrors {
  [key: string]: string;
}

export const validateBookingForm = (data: {
  name: string;
  email: string;
  phone: string;
  number_of_people: number;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!isValidName(data.name)) {
    errors.name = 'Please enter a valid name (at least 2 characters)';
  }

  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (data.number_of_people < 1) {
    errors.number_of_people = 'Number of people must be at least 1';
  }

  return errors;
};