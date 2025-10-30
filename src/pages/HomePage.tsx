import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard';
import { experienceApi } from '../api/experienceApi';
import type { Experience } from '../types';
import Loader from '../components/layout/Loader';

const HomePage = () => {

    const [searchParams] = useSearchParams();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExperiences();
    }, [searchParams]);

    const fetchExperiences = async () => {
        const search = searchParams.get('search') || undefined;
        const category = searchParams.get('category') || undefined;
        const location = searchParams.get('location') || undefined;
        const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
        try {
            setLoading(true);
            setError(null);

            const response = await experienceApi.getAllExperiences({
                search,
                category,
                location,
                minPrice,
                maxPrice
            });

            if (response.success && response.data) {
                setExperiences(response.data);
            }
        } catch (err) {
            setError('Failed to load experiences. Please try again.');
            console.error('Error fetching experiences:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchExperiences}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            {/* Results count */}
                    {experiences.length > 0 || experiences.length === 0 && (
                <div className="mb-6">
                    <p className="text-gray-600">
                        Found {experiences.length} experience(s)
                    </p>
                </div>
            )}

            {/* Experiences Grid */}
            {experiences.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No experiences found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {experiences.map((experience) => (
                        <ExperienceCard key={experience.id} experience={experience} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;