import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { experienceApi } from '../api/experienceApi';
import type { ExperienceDetails, Slot } from '../types';
import { formatCurrency, formatDateShort, formatTime } from '../utils/formatters';
import Loader from '../components/layout/Loader';

const DetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [details, setDetails] = useState<ExperienceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            fetchExperienceDetails();
        }
    }, [id]);

    const fetchExperienceDetails = async () => {
        try {
            setLoading(true);
            const response = await experienceApi.getExperienceById(Number(id));

            if (response.success && response.data) {
                setDetails(response.data);

                // Auto-select first available date
                const dates = Object.keys(response.data.availableSlots);
                if (dates.length > 0) {
                    setSelectedDate(dates[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching experience details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (!selectedSlot || !details) return;

        navigate('/checkout', {
            state: {
                experience: details.experience,
                slot: selectedSlot,
                date: selectedDate,
                quantity,
            },
        });
    };

    if (loading) {
        return <Loader />;
    }

    if (!details) {
        return <div className="container mx-auto px-4 py-8">Experience not found</div>;
    }

    const { experience, availableSlots } = details;
    const availableDates = Object.keys(availableSlots);
    const slotsForSelectedDate = selectedDate ? availableSlots[selectedDate] : [];

    const subtotal = experience.price * quantity;
    const taxes = subtotal * 0.06; // 6% tax
    const total = subtotal + taxes;

    return (
        <div className="bg-white min-h-screen">
            <div className="container-custom py-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">Details</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2">
                        {/* Image */}
                        <div className="rounded-xl overflow-hidden mb-6">
                            <img
                                src={experience.image_url}
                                alt={experience.title}
                                className="w-full h-80 object-cover"
                            />
                        </div>

                        {/* Title and Description */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {experience.title}
                        </h1>
                        <p className="text-gray-600 mb-6">{experience.description}</p>

                        {/* Choose Date */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Choose date
                            </h2>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {availableDates.slice(0, 5).map((date) => (
                                    <button
                                        key={date}
                                        onClick={() => {
                                            setSelectedDate(date);
                                            setSelectedSlot(null);
                                        }}
                                        className={`px-4 py-2 rounded-lg border flex-shrink-0 font-medium transition-colors ${selectedDate === date
                                            ? 'bg-yellow-400 border-yellow-400 text-black'
                                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                    >
                                        {formatDateShort(date)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Choose Time */}
                        {selectedDate && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                    Choose time
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {slotsForSelectedDate.map((slot) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => setSelectedSlot(slot)}
                                            disabled={!slot.is_available || slot.available_spots < quantity}
                                            className={`p-3 rounded-lg border text-center transition-colors ${selectedSlot?.id === slot.id
                                                ? 'bg-yellow-400 border-yellow-400 text-black'
                                                : slot.is_available && slot.available_spots >= quantity
                                                    ? 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="font-medium">{formatTime(slot.time)}</div>
                                            <div className="text-sm mt-1 text-red-500">
                                                {slot.is_available
                                                    ? `${slot.available_spots} left`
                                                    : 'Sold out'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    All times are in IST (GMT +5:30)
                                </p>
                            </div>
                        )}

                        {/* About */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                            <div className="bg-gray-100 rounded-lg p-4">
                                <p className="text-gray-700">{experience.highlights[0]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-24">
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Experience</span>
                                    <span className="font-semibold">{experience.title}</span>
                                </div>

                                {selectedDate && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Date</span>
                                        <span className="font-semibold">{selectedDate}</span>
                                    </div>
                                )}

                                {selectedSlot && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Time</span>
                                        <span className="font-semibold">
                                            {formatTime(selectedSlot.time)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Quantity</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                                        >
                                            −
                                        </button>
                                        <span className="font-semibold w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        selectedSlot?.available_spots || 10,
                                                        quantity + 1
                                                    )
                                                )
                                            }
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Starts at</span>
                                        <span className="font-semibold">
                                            {formatCurrency(experience.price)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">{formatCurrency(subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between text-sm mb-4">
                                        <span className="text-gray-600">Taxes</span>
                                        <span className="font-semibold">{formatCurrency(taxes)}</span>
                                    </div>

                                    <div className="flex justify-between text-lg font-bold border-t pt-4">
                                        <span>Total</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={!selectedSlot}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-black font-medium py-3 rounded-lg transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;