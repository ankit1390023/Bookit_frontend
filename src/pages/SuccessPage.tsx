import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { Booking } from '../types';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

interface SuccessState {
    booking: Booking;
}

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as SuccessState;

    useEffect(() => {
        if (!state?.booking) {
            navigate('/');
        }
    }, [state, navigate]);

    if (!state?.booking) {
        return null;
    }

    const { booking } = state;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container-custom py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Booking Confirmed
                        </h1>

                        {/* Booking Reference */}
                        <p className="text-gray-600 mb-8">
                            Ref ID: <span className="font-semibold">{booking.booking_reference}</span>
                        </p>

                        {/* Booking Details Card */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Booking Details
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Experience</span>
                                    <span className="font-medium text-right">
                                        {booking.experience.title}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Location</span>
                                    <span className="font-medium">{booking.experience.location}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-medium">
                                        {booking.slot?.date ? formatDate(booking.slot.date) : 'Date not available'}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time</span>
                                    <span className="font-medium">
                                        {booking.slot?.time ? formatTime(booking.slot.time) : 'Time not available'}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Guests</span>
                                    <span className="font-medium">{booking.number_of_people}</span>
                                </div>

                                <div className="border-t pt-3 flex justify-between font-bold text-base">
                                    <span>Total Paid</span>
                                    <span>{formatCurrency(booking.total_price)}</span>
                                </div>
                            </div>
                        </div>


                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link
                                to="/"
                                className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg transition-colors"
                            >
                                Back to Home
                            </Link>

                            <button
                                onClick={() => window.print()}
                                className="block w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                            >
                                Print Confirmation
                            </button>
                        </div>

                       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;