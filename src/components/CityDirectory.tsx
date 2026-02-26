import React, { useState } from 'react';
import { Utensils, Landmark, Hotel, Stethoscope, GraduationCap, Church, MapPin, Star, Phone, Clock, X, Filter } from 'lucide-react';

const categories = [
  {
    id: 'dining',
    title: "Dining & Entertainment",
    icon: Utensils,
    description: "Find top-rated restaurants, cafes, and entertainment venues.",
    color: "bg-orange-50 text-orange-600",
    items: [
      { name: "Golconda Pavilion", rating: 5.0, type: "Fine Dining", address: "ITC Kohenur, Hitec City", area: "Hitec City" },
      { name: "Dakshin", rating: 4.9, type: "South Indian", address: "ITC Kakatiya, Begumpet", area: "Begumpet" },
      { name: "Jewel of Nizam", rating: 4.5, type: "Hyderabadi", address: "The Golkonda Hotel, Masab Tank", area: "Masab Tank" },
      { name: "Paradise Biryani", rating: 4.3, type: "Biryani", address: "SD Road, Secunderabad", area: "Secunderabad" },
      { name: "Bawarchi", rating: 4.4, type: "Biryani", address: "RTC X Roads, Musheerabad", area: "Musheerabad" },
      { name: "Chutneys", rating: 4.2, type: "South Indian", address: "Jubilee Hills", area: "Jubilee Hills" },
      { name: "Shah Ghouse", rating: 4.1, type: "Hyderabadi", address: "Tolichowki", area: "Tolichowki" }
    ]
  },
  {
    id: 'tourist',
    title: "Tourist Attractions",
    icon: Landmark,
    description: "Explore historical sites, parks, and famous landmarks.",
    color: "bg-blue-50 text-blue-600",
    items: [
      { name: "Golconda Fort", rating: 4.6, type: "Fort", address: "Ibrahim Bagh", area: "Ibrahim Bagh" },
      { name: "Charminar", rating: 4.5, type: "Monument", address: "Char Kaman, Ghansi Bazaar", area: "Old City" },
      { name: "Ramoji Film City", rating: 4.4, type: "Film Studio", address: "Abdullahpurmet", area: "Outskirts" },
      { name: "Hussain Sagar Lake", rating: 4.2, type: "Lake", address: "Tank Bund Road", area: "Tank Bund" },
      { name: "Salar Jung Museum", rating: 4.7, type: "Museum", address: "Darulshifa", area: "Old City" },
      { name: "Chowmahalla Palace", rating: 4.6, type: "Palace", address: "Khilwat", area: "Old City" },
      { name: "Nehru Zoological Park", rating: 4.3, type: "Zoo", address: "Bahadurpura", area: "Bahadurpura" }
    ]
  },
  {
    id: 'accommodations',
    title: "Accommodations",
    icon: Hotel,
    description: "Locate luxury hotels and comfortable stays for visitors.",
    color: "bg-indigo-50 text-indigo-600",
    items: [
      { name: "Taj Falaknuma Palace", rating: 5.0, type: "Heritage Hotel", address: "Engine Bowli, Falaknuma", area: "Falaknuma" },
      { name: "The Park Hyderabad", rating: 4.5, type: "Luxury", address: "Somajiguda", area: "Somajiguda" },
      { name: "Royalton Hotel", rating: 4.0, type: "Business Hotel", address: "Chirag Ali Lane, Abids", area: "Abids" },
      { name: "Novotel", rating: 4.6, type: "Luxury", address: "Hitec City", area: "Hitec City" },
      { name: "Trident", rating: 4.7, type: "Luxury", address: "Hitec City", area: "Hitec City" },
      { name: "ITC Kakatiya", rating: 4.8, type: "Luxury", address: "Begumpet", area: "Begumpet" }
    ]
  },
  {
    id: 'healthcare',
    title: "Healthcare Facilities",
    icon: Stethoscope,
    description: "Access top-tier hospitals and medical centers.",
    color: "bg-red-50 text-red-600",
    items: [
      { name: "Apollo Hospitals", rating: 4.8, type: "Multi-Specialty", address: "Jubilee Hills", area: "Jubilee Hills" },
      { name: "Star Hospitals", rating: 4.7, type: "Cardiology", address: "Financial District, Gachibowli", area: "Gachibowli" },
      { name: "KIMS Hospitals", rating: 4.6, type: "General", address: "Minister Road, Secunderabad", area: "Secunderabad" },
      { name: "Yashoda Hospitals", rating: 4.5, type: "Multi-Specialty", address: "Somajiguda", area: "Somajiguda" },
      { name: "Care Hospitals", rating: 4.4, type: "Multi-Specialty", address: "Banjara Hills", area: "Banjara Hills" }
    ]
  },
  {
    id: 'education',
    title: "Education",
    icon: GraduationCap,
    description: "Find premier universities and educational institutions.",
    color: "bg-green-50 text-green-600",
    items: [
      { name: "Indian School of Business", rating: 4.9, type: "Business School", address: "Gachibowli", area: "Gachibowli" },
      { name: "Osmania University", rating: 4.5, type: "University", address: "Amberpet", area: "Amberpet" },
      { name: "IIT Hyderabad", rating: 4.8, type: "Technology", address: "Kandi, Sangareddy", area: "Outskirts" },
      { name: "BITS Pilani", rating: 4.7, type: "Technology", address: "Shameerpet", area: "Outskirts" },
      { name: "University of Hyderabad", rating: 4.6, type: "University", address: "Gachibowli", area: "Gachibowli" }
    ]
  },
  {
    id: 'worship',
    title: "Places of Worship",
    icon: Church,
    description: "Discover spiritual centers and religious landmarks.",
    color: "bg-purple-50 text-purple-600",
    items: [
      { name: "Birla Mandir", rating: 4.7, type: "Temple", address: "Naubat Pahad", area: "Adarsh Nagar" },
      { name: "Mecca Masjid", rating: 4.6, type: "Mosque", address: "Charminar Rd", area: "Old City" },
      { name: "Chilkur Balaji Temple", rating: 4.8, type: "Temple", address: "Chilkur Village", area: "Outskirts" },
      { name: "Calvary Temple", rating: 4.9, type: "Church", address: "Miyapur", area: "Miyapur" },
      { name: "Peddamma Temple", rating: 4.5, type: "Temple", address: "Jubilee Hills", area: "Jubilee Hills" }
    ]
  }
];

export default function CityDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('All');

  const openCategory = (category: typeof categories[0]) => {
    setSelectedCategory(category);
    setSelectedArea('All');
  };

  const closeCategory = () => {
    setSelectedCategory(null);
    setSelectedArea('All');
  };

  const getUniqueAreas = (items: typeof categories[0]['items']) => {
    const areas = new Set(items.map(item => item.area));
    return ['All', ...Array.from(areas).sort()];
  };

  const filteredItems = selectedCategory
    ? selectedCategory.items.filter(item => selectedArea === 'All' || item.area === selectedArea)
    : [];

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Explore Your City</h1>
        <p className="text-gray-500">Discover everything Hyderabad has to offer with our comprehensive directory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="p-6 flex-1">
              <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                <category.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-500 text-sm mb-6">{category.description}</p>
              
              <div className="space-y-3">
                {category.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name}, ${item.address}, Hyderabad`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 flex items-center gap-1 mt-1 hover:text-blue-600 hover:underline group/link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MapPin size={10} className="group-hover/link:text-blue-600" /> {item.address}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
              <button 
                onClick={() => openCategory(category)}
                className="text-blue-600 text-sm font-bold hover:underline w-full text-center"
              >
                View All {category.title}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full View Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${selectedCategory.color} rounded-xl flex items-center justify-center`}>
                  <selectedCategory.icon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.title}</h2>
                  <p className="text-gray-500 text-sm">Found {selectedCategory.items.length} locations</p>
                </div>
              </div>
              <button 
                onClick={closeCategory}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 overflow-x-auto no-scrollbar">
              <Filter size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-gray-700 shrink-0">Filter by Area:</span>
              <div className="flex gap-2">
                {getUniqueAreas(selectedCategory.items).map(area => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                      selectedArea === area 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
                          {item.type}
                        </span>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name}, ${item.address}, Hyderabad`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 flex items-center gap-1.5 mb-2 hover:text-blue-600 hover:underline group/link"
                      >
                        <MapPin size={14} className="text-blue-500 group-hover/link:text-blue-600" /> {item.address}
                      </a>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Clock size={12} /> Open Now</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> +91 40 1234 5678</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                        <Star size={14} className="text-green-600 fill-green-600" />
                        <span className="text-sm font-bold text-green-700">{item.rating}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                        {item.area}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-400">
                  No locations found in {selectedArea}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
