import React, { useState } from 'react';
import { ExternalLink, Search, Globe, Building2, Heart, Shield, Lightbulb, GraduationCap, Coins, Sprout, Droplets, Star, BookOpen } from 'lucide-react';

type Category = 'All' | 'Agriculture' | 'Culture' | 'Education' | 'Emergency' | 'Finance' | 'General' | 'Governance';

const services = [
    // Agriculture
    { name: 'Agriculture Dept', url: 'https://agri.telangana.gov.in', icon: Sprout, desc: 'Official portal of the Telangana Agriculture Department providing...', category: 'Agriculture', popular: true },
    { name: 'Agri Licence (OLMS)', url: 'https://agriolms.telangana.gov.in', icon: BookOpen, desc: 'Online Licence Management System for Agriculture fertilizers and...', category: 'Agriculture' },
    { name: 'Rythu Bandhu (Agri)', url: 'https://agriolms.telangana.gov.in', icon: Coins, desc: 'Investment support scheme for farmers to purchase inputs.', category: 'Agriculture' },
    // Culture
    { name: 'Telangana Tourism', url: 'https://www.telanganatourism.gov.in', icon: Building2, desc: 'Explore the heritage, culture and tourism destinations of Telangana.', category: 'Culture' },
    // Education
    { name: 'School Education', url: 'https://schooledu.telangana.gov.in', icon: GraduationCap, desc: 'Primary and secondary education resources and information.', category: 'Education' },
    { name: 'Higher Education Council', url: 'https://www.tgche.ac.in', icon: GraduationCap, desc: 'Higher education planning, coordination, and institutional info.', category: 'Education' },
    { name: 'Technical Education', url: 'https://dte.telangana.gov.in', icon: GraduationCap, desc: 'Polytechnic and technical course information for students.', category: 'Education' },
    // Emergency
    { name: 'Telangana State Police', url: 'https://www.tspolice.gov.in', icon: Shield, desc: 'Law enforcement, safety tips, and complaint reporting.', category: 'Emergency' },
    { name: 'Hyderabad Police', url: 'https://hyderabadpolice.gov.in', icon: Shield, desc: 'Official portal for citizen safety, FIR status, and police services.', category: 'Emergency', popular: true },
    // Finance
    { name: 'Finance Department', url: 'https://finance.telangana.gov.in', icon: Coins, desc: 'Budget, expenditure, and financial policies of Telangana.', category: 'Finance' },
    { name: 'Commercial Taxes', url: 'https://www.tgct.gov.in/tgportal', icon: Coins, desc: 'GST and commercial tax administration portal.', category: 'Finance' },
    // General
    { name: 'MeeSeva Portal', url: 'https://ts.meeseva.telangana.gov.in', icon: Globe, desc: 'Universal gateway for all Telangana citizen services an...', category: 'General', popular: true },
    { name: 'TS-bPASS', url: 'https://tsbpass.cgg.gov.in', icon: Building2, desc: 'Single window system for building permissions and layo...', category: 'General', popular: true },
    { name: 'Dharani Portal', url: 'https://dharani.telangana.gov.in', icon: BookOpen, desc: 'Integrated Land Records Management System for...', category: 'General', popular: true },
    { name: 'Registration & Stamps', url: 'https://registration.telangana.gov.in', icon: BookOpen, desc: 'Property registration, encumbrance certificates, and deeds.', category: 'General' },
    // Governance
    { name: "Chief Minister's Office", url: 'https://cm.telangana.gov.in', icon: Building2, desc: 'Official website of the CM, press releases, and initiatives.', category: 'Governance' },
    { name: 'GHMC', url: 'https://www.ghmc.gov.in', icon: Building2, desc: 'Greater Hyderabad Municipal Corporation services and info.', category: 'Governance' },
    { name: 'Election Commission', url: 'https://ceotelangana.nic.in', icon: Globe, desc: 'Voter registration, electoral rolls, and election info.', category: 'Governance' },
    // Health
    { name: 'Aarogyasri', url: 'https://rajivaarogyasri.telangana.gov.in', icon: Heart, desc: 'Health insurance scheme for below poverty line families.', category: 'General' },
    // Utilities
    { name: 'TS GENCO', url: 'https://www.tggenco.co.in', icon: Lightbulb, desc: 'Power generation and electricity information.', category: 'General' },
    { name: 'Mission Bhagiratha', url: 'https://missionbhagiratha.telangana.gov.in', icon: Droplets, desc: 'Safe drinking water project details.', category: 'General' },
];

const categories: Category[] = ['All', 'Agriculture', 'Culture', 'Education', 'Emergency', 'Finance', 'General', 'Governance'];

export default function GovServices() {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = services.filter(s => {
        const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
        const matchesSearch = !searchTerm ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Group by category
    const grouped = filtered.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s);
        return acc;
    }, {} as Record<string, typeof services>);

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#3182CE] to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-20">
                    <div className="grid grid-cols-2 gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-8 h-8 border-2 border-white/40 rounded-lg"></div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Globe size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">Services Directory</h1>
                </div>
                <p className="text-blue-100 mb-6 max-w-xl">
                    Grouped access to all Telangana government departments, innovation hubs, and citizen welfare portals.
                </p>
                <div className="relative max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for services like 'Tax', 'DL', 'Health', or 'Dharani'..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur text-white placeholder-blue-200 border border-white/20 focus:bg-white/20 focus:border-white/40 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
                <span className="text-sm font-semibold text-gray-500 flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-400">≡</span> FILTER
                </span>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                ? 'bg-[#3182CE] text-white shadow'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grouped Services */}
            <div className="space-y-8">
                {Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{category}</h2>
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                                {items.length} Service{items.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((service, idx) => (
                                <a
                                    key={idx}
                                    href={service.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group relative"
                                >
                                    {service.popular && (
                                        <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-orange-500">
                                            <Star size={10} fill="currentColor" /> POPULAR
                                        </span>
                                    )}
                                    <div className="p-2.5 bg-blue-50 text-[#3182CE] rounded-xl w-fit mb-3 group-hover:bg-[#3182CE] group-hover:text-white transition-colors">
                                        <service.icon size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-3">{service.desc}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{service.category}</span>
                                        <span className="text-sm font-semibold text-[#3182CE] group-hover:underline flex items-center gap-1">
                                            Visit Portal <ExternalLink size={12} />
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
