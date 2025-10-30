import type { Experience } from '../types';
import { Link } from 'react-router-dom';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative">
        <img
          src={experience.image_url || '/placeholder-experience.jpg'}
          alt={experience.title}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Location */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {experience.title}
          </h3>
          <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-md">
            {experience.location}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-snug">
          Curated small-group experience. Certified guide. Safety first with gear included.
        </p>

        {/* Price + Button */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-gray-900 text-lg font-bold">
            <span className="text-gray-800 text-base font-medium">From </span>₹{Math.ceil(experience.price)}
          </p>
          <Link
            to={`/experience/${experience.id}`}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-md transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
