import React, { useState } from 'react';
import { MapPin, Star, ChevronRight, UtensilsCrossed, Landmark, Hotel, HeartPulse, GraduationCap, Church } from 'lucide-react';

interface Place {
    name: string;
    address: string;
    rating: number;
}

interface Category {
    title: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    places: Place[];
}

const categories: Category[] = [
    {
        title: 'Dining & Entertainment',
        description: 'Find top-rated restaurants, cafes, and entertainment venues.',
        icon: UtensilsCrossed,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-50',
        places: [
            { name: 'Golconda Pavilion', address: 'ITC Kohenur, Hitec City', rating: 5 },
            { name: 'Dakshin', address: 'ITC Kakatiya, Begumpet', rating: 4.9 },
            { name: 'Jewel of Nizam', address: 'The Golconda Hotel, Masab Tank', rating: 4.5 },
        ],
    },
    {
        title: 'Tourist Attractions',
        description: 'Explore historical sites, parks, and famous landmarks.',
        icon: Landmark,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        places: [
            { name: 'Golconda Fort', address: 'Ibrahim Bagh', rating: 4.6 },
            { name: 'Charminar', address: 'Char Kaman, Ghansi Bazaar', rating: 4.5 },
            { name: 'Ramoji Film City', address: 'Abdullapurmet', rating: 4.4 },
        ],
    },
    {
        title: 'Accommodations',
        description: 'Locate luxury hotels and comfortable stays for visitors.',
        icon: Hotel,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        places: [
            { name: 'Taj Falaknuma Palace', address: 'Engine Bowli, Falaknuma', rating: 5 },
            { name: 'The Park Hyderabad', address: 'Somajiguda', rating: 4.5 },
            { name: 'Royalton Hotel', address: 'Chirag Ali Lane, Abids', rating: 4 },
        ],
    },
    {
        title: 'Healthcare Facilities',
        description: 'Access top-tier hospitals and medical centers.',
        icon: HeartPulse,
        iconColor: 'text-rose-500',
        iconBg: 'bg-rose-50',
        places: [
            { name: 'Apollo Hospitals', address: 'Jubilee Hills', rating: 4.8 },
            { name: 'Star Hospitals', address: 'Financial District, Gachibowli', rating: 4.7 },
            { name: 'KIMS Hospitals', address: 'Minister Road, Secunderabad', rating: 4.6 },
        ],
    },
    {
        title: 'Education',
        description: 'Find premier universities and educational institutions.',
        icon: GraduationCap,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-50',
        places: [
            { name: 'Indian School of Business', address: 'Gachibowli', rating: 4.9 },
            { name: 'Osmania University', address: 'Amberpet', rating: 4.5 },
            { name: 'IIT Hyderabad', address: 'Kandi, Sangareddy', rating: 4.8 },
        ],
    },
    {
        title: 'Places of Worship',
        description: 'Discover spiritual centers and religious landmarks.',
        icon: Church,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50',
        places: [
            { name: 'Birla Mandir', address: 'Naubat Pahad', rating: 4.7 },
            { name: 'Mecca Masjid', address: 'Charminar Rd', rating: 4.6 },
            { name: 'Chilkur Balaji Temple', address: 'Chilkur Village', rating: 4.8 },
        ],
    },
];

export default function Explore() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Explore Your City</h1>
                <p className="text-gray-500 text-sm">Discover everything Hyderabad has to offer with our comprehensive directory.</p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
                        {/* Category Header */}
                        <div className="mb-4">
                            <div className={`inline-flex p-2.5 rounded-xl ${cat.iconBg} mb-3`}>
                                <cat.icon size={22} className={cat.iconColor} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{cat.title}</h2>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{cat.description}</p>
                        </div>

                        {/* Places List */}
                        <div className="flex-1 space-y-0 divide-y divide-gray-50">
                            {cat.places.map((place, pIdx) => (
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
                        <button className="mt-4 pt-3 border-t border-gray-50 text-sm font-semibold text-[#3182CE] hover:underline flex items-center justify-center gap-1 w-full">
                            View All {cat.title} <ChevronRight size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
