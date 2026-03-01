import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories as baseCategories } from '../data/exploreData';
import { extraCategories } from '../data/exploreDataExtra';
import { massiveDataInjection } from '../data/exploreDataMassive';

const STATIC_CATEGORIES = [...baseCategories, ...extraCategories].map(cat => ({
    ...cat,
    places: [...cat.places, ...(massiveDataInjection[cat.slug] || [])]
}));
import { MapPin, Star, Search, ArrowLeft } from 'lucide-react';

export default function ExploreCategory() {
    const { slug } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [dynamicLocations, setDynamicLocations] = useState<any[]>([]);

    useEffect(() => {
        if (slug) {
            fetch(`/api/explore-locations/${slug}`)
                .then(res => res.json())
                .then(setDynamicLocations)
                .catch(err => console.error(err));
        }
    }, [slug]);

    const baseCategory = STATIC_CATEGORIES.find(c => c.slug === slug);

    if (!baseCategory) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Category not found.</p>
                <Link to="/explore" className="text-[#3182CE] font-semibold mt-4 inline-block hover:underline">← Back to Explore</Link>
            </div>
        );
    }

    // Merge static and dynamic locations
    const category = {
        ...baseCategory,
        places: [
            ...dynamicLocations.map(loc => ({
                name: loc.name,
                address: loc.address,
                rating: loc.rating
            })),
            ...baseCategory.places
        ]
    };

    const Icon = category.icon;

    const filteredPlaces = category.places
        .filter(p =>
            !searchTerm ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            sortBy === 'rating' ? b.rating - a.rating : a.name.localeCompare(b.name)
        );

    // Pagination logic
    const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
    const paginatedPlaces = filteredPlaces.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when search or sort changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Back Link */}
            <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#3182CE] transition-colors font-medium">
                <ArrowLeft size={16} /> Back to Explore
            </Link>

            {/* Hero */}
            <div className={`${category.iconBg} rounded-2xl p-8`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Icon size={28} className={category.iconColor} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{category.title}</h1>
                        <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-400 font-medium">{category.places.length} locations listed</p>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder={`Search in ${category.title}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1 flex-shrink-0">
                    <button
                        onClick={() => setSortBy('rating')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'rating' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                            }`}
                    >
                        ★ Top Rated
                    </button>
                    <button
                        onClick={() => setSortBy('name')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'name' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                            }`}
                    >
                        A → Z
                    </button>
                </div>
            </div>

            {/* Places Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedPlaces.map((place, idx) => (
                    <a
                        key={idx}
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', ' + place.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group cursor-pointer block"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-[#3182CE] transition-colors">{place.name}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <MapPin size={12} className="text-gray-400" />
                                    <span className="text-xs text-gray-500">{place.address}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg flex-shrink-0">
                                <Star size={14} className="text-yellow-500" fill="currentColor" />
                                <span className="font-bold text-sm text-gray-800">{place.rating}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            {filteredPlaces.length === 0 && (
                <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-500">
                    No places match your search.
                </div>
            )}
        </div>
    );
}
