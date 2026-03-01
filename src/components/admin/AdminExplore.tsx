import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Plus, Trash2, Search, MapPin, Star } from 'lucide-react';
import { categories as baseCategories } from '../../../data/exploreData';
import { extraCategories } from '../../../data/exploreDataExtra';

const ALL_CATEGORIES = [...baseCategories, ...extraCategories];

export default function AdminExplore() {
    const { token } = useAuthStore();
    const [locations, setLocations] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const [newLoc, setNewLoc] = useState({
        name: '',
        address: '',
        category_slug: ALL_CATEGORIES[0].slug,
        rating: 4.0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchLocations = () => {
        fetch('/api/explore-locations')
            .then(res => res.json())
            .then(setLocations);
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleAddLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLoc.name || !newLoc.address) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/explore-locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newLoc)
            });

            if (res.ok) {
                setNewLoc({ ...newLoc, name: '', address: '', rating: 4.0 });
                setIsAddModalOpen(false);
                fetchLocations();
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to add location');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this custom location?')) return;

        try {
            const res = await fetch(`/api/explore-locations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                fetchLocations();
            } else {
                alert('Failed to delete location');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredLocations = locations.filter(loc => {
        const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || loc.category_slug === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Explore Locations</h1>
                    <p className="text-gray-500">Manage dynamically added places for the Explore directory.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#3182CE] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add Location
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search custom locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                    <option value="all">All Categories</option>
                    {ALL_CATEGORIES.map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.title}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Place Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredLocations.map((loc) => {
                            const catConfig = ALL_CATEGORIES.find(c => c.slug === loc.category_slug);
                            return (
                                <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{loc.name}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin size={12} className="text-gray-400" />
                                            <span className="text-xs text-gray-500">{loc.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                            {catConfig?.title || loc.category_slug}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-500" fill="currentColor" />
                                            <span className="font-bold text-sm text-gray-800">{loc.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(loc.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredLocations.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <p className="text-gray-500 text-sm">No custom locations found.</p>
                                    <p className="text-gray-400 text-xs mt-1">Note: This only shows locations added manually through DB, not the hardcoded TS files.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Custom Location</h2>

                        <form onSubmit={handleAddLocation} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Place Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newLoc.name}
                                    onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., New Central Park"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Address</label>
                                <input
                                    type="text"
                                    required
                                    value={newLoc.address}
                                    onChange={(e) => setNewLoc({ ...newLoc, address: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Street, City, District"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                    <select
                                        value={newLoc.category_slug}
                                        onChange={(e) => setNewLoc({ ...newLoc, category_slug: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        {ALL_CATEGORIES.map(cat => (
                                            <option key={cat.slug} value={cat.slug}>{cat.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating (1-5)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        required
                                        value={newLoc.rating}
                                        onChange={(e) => setNewLoc({ ...newLoc, rating: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newLoc.name || !newLoc.address}
                                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-[#3182CE] hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Location'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
