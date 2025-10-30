import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container-custom py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 w-full sm:w-auto mb-2 sm:mb-0">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold leading-none">highway</span>
                                <span className="text-sm font-semibold leading-none">delite</span>
                            </div>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full sm:flex-1 sm:max-w-md">
                        <div className='flex items-center gap-2 w-full'>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search experiences"
                                className="flex-1 min-w-0 px-3 sm:px-4 py-2 pr-20 sm:pr-24 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 sm:px-6 py-1.5 text-sm sm:text-base rounded-md transition-colors whitespace-nowrap"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </header>
    );
};

export default Header;