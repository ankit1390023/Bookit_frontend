const Loader = () => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 font-medium mt-3">Loading...</p>
            </div>
        </div>
    );
};

export default Loader;