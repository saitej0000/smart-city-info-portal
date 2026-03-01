import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories as baseCategories } from '../data/exploreData';
import { extraCategories } from '../data/exploreDataExtra';
import { MapPin, Star, ChevronRight, Search } from 'lucide-react';

const categories = [...baseCategories, ...extraCategories];

export default function Explore() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.map(cat => ({
        ...cat,
        places: cat.places.filter(p =>
            !searchTerm ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.address.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    })).filter(cat => cat.places.length > 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Explore Your City</h1>
                    <p className="text-gray-500 text-sm">Discover everything Telangana has to offer with our comprehensive directory.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search places..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((cat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
                        {/* Category Header */}
                        <div className="mb-4">
                            <div className={`inline-flex p-2.5 rounded-xl ${cat.iconBg} mb-3`}>
                                <cat.icon size={22} className={cat.iconColor} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{cat.title}</h2>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{cat.description}</p>
                        </div>

                        {/* Top 3 Places */}
                        <div className="flex-1 space-y-0 divide-y divide-gray-50">
                            {cat.places.slice(0, 3).map((place, pIdx) => (
                                <div key={pIdx} className="py-3 flex items-center justify-between group cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{place.name}</h3>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin size={11} className="text-gray-400" />
                                            <span className="text-xs text-gray-400">{place.address}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Star size={12} className="text-yellow-500" fill="currentColor" />
                                        <span className="text-sm font-bold text-gray-700">{place.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All Link */}
                        <Link
                            to={`/explore/${cat.slug}`}
                            className="mt-4 pt-3 border-t border-gray-50 text-sm font-semibold text-[#3182CE] hover:underline flex items-center justify-center gap-1 w-full"
                        >
                            View All {cat.title} <ChevronRight size={14} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
