import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { promoApi } from '../api/promoApi';
import type { Experience, Slot, PromoCodeValidation } from '../types';
import { formatCurrency, formatTime } from '../utils/formatters';
import { validateBookingForm } from '../utils/validators';
import type { ValidationErrors } from '../utils/validators';

interface CheckoutState {
    experience: Experience;
    slot: Slot;
    date: string;
    quantity: number;
}

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as CheckoutState;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<PromoCodeValidation | null>(null);
    const [promoError, setPromoError] = useState('');
    const [applyingPromo, setApplyingPromo] = useState(false);
 

    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!state?.experience) {
            navigate('/');
        }
    }, [state, navigate]);

    if (!state?.experience) {
        return null;
    }

    const { experience, slot, date, quantity } = state;

    const subtotal = experience.price * quantity;
    const taxes = subtotal * 0.06;
    const discountAmount = appliedPromo?.data?.discount_amount || 0;
    const total = subtotal + taxes - discountAmount;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        try {
            setApplyingPromo(true);
            setPromoError('');

            const promoValidation = await promoApi.validatePromoCode({
                code: promoCode.toUpperCase(),
                amount: subtotal,
            });
            console.log("promoValidation", promoValidation);
            if (promoValidation) {
                setAppliedPromo(promoValidation);
                setPromoError('');
            }
        } catch (error: any) {
            setPromoError(
                error.response?.data?.message || 'Invalid or expired promo code'
            );
            setAppliedPromo(null);
        } finally {
            setApplyingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
        setPromoError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateBookingForm({
            ...formData,
            number_of_people: quantity,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!agreeToTerms) {
            alert('Please agree to the terms and safety policy');
            return;
        }

        try {
            setLoading(true);

            const bookingData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                experience_id: experience.id,
                slot_id: slot.id,
                number_of_people: quantity,
                promo_code: appliedPromo?.data?.code || undefined,
            };

            const response = await bookingApi.createBooking(bookingData);
            console.log("response received from booking during checkout", response);
            if (response.success && response.data) {
                navigate('/success', {
                    state: { booking: response.data },
                });
            }
        } catch (error: any) {
            console.error('Booking error:', error);
            alert(
                error.response?.data?.message ||
                'Booking failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="container-custom py-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span className="font-medium">Checkout</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className={`w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : ''
                                                }`}
                                        />

                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="test@test.com"
                                            className={`w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 8291828855"
                                        className={`w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Promo Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Promo code
                                    </label>
                                    {appliedPromo ? (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-black-800">
                                                            {appliedPromo?.data?.code}
                                                        </p>
                                                        <p className="text-sm text-black-600">
                                                            {appliedPromo?.data?.description}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemovePromo}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                placeholder="Enter promo code"
                                                className="flex-1 w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyPromo}
                                                disabled={!promoCode.trim() || applyingPromo}
                                                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {applyingPromo ? 'Applying...' : 'Apply'}
                                            </button>
                                        </div>
                                    )}
                                    {promoError && (
                                        <p className="text-red-500 text-xs mt-1">{promoError}</p>
                                    )}
                                </div>

                                {/* Terms Checkbox */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-700">
                                        I agree to the terms and safety policy
                                    </label>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50  rounded-xl p-6 border border-gray-200 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Booking Summary
                            </h2>

                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Experience</span>
                                    <span className="font-medium text-right">
                                        {experience.title}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-medium">{date}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time</span>
                                    <span className="font-medium">{formatTime(slot.time)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Qty</span>
                                    <span className="font-medium">{quantity}</span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Taxes</span>
                                        <span className="font-medium">{formatCurrency(taxes)}</span>
                                    </div>

                                    {appliedPromo && (
                                        <div className="flex justify-between mb-2 text-green-600">
                                            <span>Discount</span>
                                            <span className="font-medium">
                                                -{formatCurrency(discountAmount)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading || !agreeToTerms}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-black font-medium py-3 rounded-lg transition-colors"
                            >
                                {loading ? 'Processing...' : 'Pay and Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;