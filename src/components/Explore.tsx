import React, { useState } from 'react';
import { MapPin, Star, ChevronRight, UtensilsCrossed, Landmark, Hotel, HeartPulse, GraduationCap, Church, Search } from 'lucide-react';

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
            { name: 'Golconda Pavilion', address: 'ITC Kohenur, Hitec City, Hyderabad', rating: 5 },
            { name: 'Dakshin', address: 'ITC Kakatiya, Begumpet, Hyderabad', rating: 4.9 },
            { name: 'Jewel of Nizam', address: 'The Golconda Hotel, Masab Tank, Hyderabad', rating: 4.5 },
            { name: 'Paradise Biryani', address: 'MG Road, Secunderabad', rating: 4.7 },
            { name: 'Bawarchi Restaurant', address: 'RTC Cross Roads, Hyderabad', rating: 4.6 },
            { name: 'Shah Ghouse', address: 'Tolichowki, Hyderabad', rating: 4.5 },
            { name: 'Mehfil Restaurant', address: 'Hanamkonda, Warangal', rating: 4.3 },
            { name: 'Hotel Suprabhat', address: 'Karimnagar Main Road', rating: 4.2 },
            { name: 'Cream Stone', address: 'Banjara Hills, Hyderabad', rating: 4.4 },
            { name: 'AB\'s - Absolute Barbecues', address: 'Jubilee Hills, Hyderabad', rating: 4.6 },
            { name: 'Pista House', address: 'Charminar Road, Hyderabad', rating: 4.5 },
            { name: 'Ohri\'s Jiva Imperia', address: 'Banjara Hills, Hyderabad', rating: 4.3 },
        ],
    },
    {
        title: 'Tourist Attractions',
        description: 'Explore historical sites, parks, and famous landmarks across Telangana.',
        icon: Landmark,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        places: [
            { name: 'Golconda Fort', address: 'Ibrahim Bagh, Hyderabad', rating: 4.6 },
            { name: 'Charminar', address: 'Char Kaman, Ghansi Bazaar, Hyderabad', rating: 4.5 },
            { name: 'Ramoji Film City', address: 'Abdullapurmet, Hyderabad', rating: 4.4 },
            { name: 'Hussain Sagar Lake', address: 'Tank Bund, Hyderabad', rating: 4.5 },
            { name: 'Salar Jung Museum', address: 'Dar-ul-Shifa, Hyderabad', rating: 4.7 },
            { name: 'Chowmahalla Palace', address: 'Motigalli, Hyderabad', rating: 4.6 },
            { name: 'Warangal Fort', address: 'Warangal City, Warangal', rating: 4.3 },
            { name: 'Thousand Pillar Temple', address: 'Hanamkonda, Warangal', rating: 4.5 },
            { name: 'Nagarjuna Sagar Dam', address: 'Nalgonda District', rating: 4.4 },
            { name: 'Pochampally Village', address: 'Yadadri Bhuvanagiri District', rating: 4.2 },
            { name: 'Medak Cathedral', address: 'Medak Town, Medak', rating: 4.6 },
            { name: 'Pakhal Lake', address: 'Pakhal, Warangal', rating: 4.1 },
            { name: 'Bhongir Fort', address: 'Bhongir, Yadadri Bhuvanagiri', rating: 4.3 },
            { name: 'KBR National Park', address: 'Jubilee Hills, Hyderabad', rating: 4.4 },
            { name: 'Nehru Zoological Park', address: 'Bahadurpura, Hyderabad', rating: 4.3 },
        ],
    },
    {
        title: 'Accommodations',
        description: 'Locate luxury hotels and comfortable stays across Telangana.',
        icon: Hotel,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        places: [
            { name: 'Taj Falaknuma Palace', address: 'Engine Bowli, Falaknuma, Hyderabad', rating: 5 },
            { name: 'The Park Hyderabad', address: 'Somajiguda, Hyderabad', rating: 4.5 },
            { name: 'Royalton Hotel', address: 'Chirag Ali Lane, Abids, Hyderabad', rating: 4 },
            { name: 'ITC Kohenur', address: 'Hitec City, Hyderabad', rating: 4.8 },
            { name: 'Novotel Hyderabad', address: 'Convention Centre Road, Hitec City', rating: 4.5 },
            { name: 'Trident Hyderabad', address: 'Hitec City, Madhapur, Hyderabad', rating: 4.6 },
            { name: 'Radisson Blu Plaza', address: 'Banjara Hills, Hyderabad', rating: 4.4 },
            { name: 'Marriott Hotel & Convention', address: 'Tank Bund Road, Hyderabad', rating: 4.7 },
            { name: 'Lemon Tree Premier', address: 'Hitec City, Hyderabad', rating: 4.3 },
            { name: 'Haritha Hotel Warangal', address: 'Kazipet, Warangal', rating: 3.8 },
            { name: 'Taj Deccan', address: 'Banjara Hills, Hyderabad', rating: 4.5 },
            { name: 'Hotel Minerva Grand', address: 'Secunderabad', rating: 4.1 },
        ],
    },
    {
        title: 'Healthcare Facilities',
        description: 'Access top-tier hospitals and medical centers in Telangana.',
        icon: HeartPulse,
        iconColor: 'text-rose-500',
        iconBg: 'bg-rose-50',
        places: [
            { name: 'Apollo Hospitals', address: 'Jubilee Hills, Hyderabad', rating: 4.8 },
            { name: 'Star Hospitals', address: 'Financial District, Gachibowli, Hyderabad', rating: 4.7 },
            { name: 'KIMS Hospitals', address: 'Minister Road, Secunderabad', rating: 4.6 },
            { name: 'Yashoda Hospitals', address: 'Somajiguda, Hyderabad', rating: 4.5 },
            { name: 'Care Hospitals', address: 'Banjara Hills, Hyderabad', rating: 4.6 },
            { name: 'Continental Hospitals', address: 'Gachibowli, Hyderabad', rating: 4.4 },
            { name: 'NIMS', address: 'Panjagutta, Hyderabad', rating: 4.3 },
            { name: 'Osmania General Hospital', address: 'Afzalgunj, Hyderabad', rating: 4.0 },
            { name: 'Gandhi Hospital', address: 'Musheerabad, Hyderabad', rating: 4.1 },
            { name: 'MGM Hospital', address: 'Warangal', rating: 4.2 },
            { name: 'Global Hospitals', address: 'Lakdikapul, Hyderabad', rating: 4.5 },
            { name: 'Sunshine Hospitals', address: 'Secunderabad', rating: 4.4 },
        ],
    },
    {
        title: 'Education',
        description: 'Find premier universities and educational institutions in Telangana.',
        icon: GraduationCap,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-50',
        places: [
            { name: 'Indian School of Business', address: 'Gachibowli, Hyderabad', rating: 4.9 },
            { name: 'Osmania University', address: 'Amberpet, Hyderabad', rating: 4.5 },
            { name: 'IIT Hyderabad', address: 'Kandi, Sangareddy', rating: 4.8 },
            { name: 'University of Hyderabad', address: 'Gachibowli, Hyderabad', rating: 4.7 },
            { name: 'IIIT Hyderabad', address: 'Gachibowli, Hyderabad', rating: 4.8 },
            { name: 'JNTU Hyderabad', address: 'Kukatpally, Hyderabad', rating: 4.3 },
            { name: 'BITS Pilani Hyderabad', address: 'Jawahar Nagar, Shamirpet', rating: 4.6 },
            { name: 'NIT Warangal', address: 'Warangal', rating: 4.7 },
            { name: 'NALSAR University of Law', address: 'Shamirpet, Hyderabad', rating: 4.6 },
            { name: 'English & Foreign Languages University', address: 'Tarnaka, Hyderabad', rating: 4.4 },
            { name: 'Kakatiya University', address: 'Warangal', rating: 4.2 },
            { name: 'Maulana Azad National Urdu University', address: 'Gachibowli, Hyderabad', rating: 4.3 },
        ],
    },
    {
        title: 'Places of Worship',
        description: 'Discover spiritual centers and religious landmarks in Telangana.',
        icon: Church,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50',
        places: [
            { name: 'Birla Mandir', address: 'Naubat Pahad, Hyderabad', rating: 4.7 },
            { name: 'Mecca Masjid', address: 'Charminar Rd, Hyderabad', rating: 4.6 },
            { name: 'Chilkur Balaji Temple', address: 'Chilkur Village, Hyderabad', rating: 4.8 },
            { name: 'Jagannath Temple', address: 'Banjara Hills, Hyderabad', rating: 4.5 },
            { name: 'Sanghi Temple', address: 'Sanghi Nagar, Hyderabad', rating: 4.4 },
            { name: 'Peddamma Gudi', address: 'Jubilee Hills, Hyderabad', rating: 4.3 },
            { name: 'Yadadri Lakshmi Narasimha Temple', address: 'Yadagirigutta, Yadadri Bhuvanagiri', rating: 4.8 },
            { name: 'Bhadrakali Temple', address: 'Warangal', rating: 4.5 },
            { name: 'Keesaragutta Temple', address: 'Keesara, Medchal', rating: 4.3 },
            { name: 'Sri Rama Chandra Swamy Temple', address: 'Ammapalle, Shamshabad', rating: 4.2 },
            { name: 'Medak Church', address: 'Medak Town', rating: 4.6 },
            { name: 'St. Joseph\'s Cathedral', address: 'Gunfoundry, Hyderabad', rating: 4.4 },
        ],
    },
];

export default function Explore() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCat, setExpandedCat] = useState<string | null>(null);

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
                {filteredCategories.map((cat, idx) => {
                    const isExpanded = expandedCat === cat.title;
                    const visiblePlaces = isExpanded ? cat.places : cat.places.slice(0, 3);
                    return (
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
                                {visiblePlaces.map((place, pIdx) => (
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

                            {/* View All / Show Less */}
                            <button
                                onClick={() => setExpandedCat(isExpanded ? null : cat.title)}
                                className="mt-4 pt-3 border-t border-gray-50 text-sm font-semibold text-[#3182CE] hover:underline flex items-center justify-center gap-1 w-full"
                            >
                                {isExpanded ? 'Show Less' : `View All ${cat.title}`} <ChevronRight size={14} className={isExpanded ? 'rotate-90' : ''} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
