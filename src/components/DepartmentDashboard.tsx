import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import {
    ArrowLeft, ArrowRight, Plus, Clock, CheckCircle2, AlertCircle, Loader2,
    Trash2, Bus, Zap, Droplets, Building2, Shield, Phone, Mail, MapPin, ExternalLink
} from 'lucide-react';

const DEPT_META: Record<string, {
    icon: any; color: string; iconBg: string; gradient: string;
    helpline: string; email: string; address: string;
    govLinks: { name: string; url: string; desc: string }[];
}> = {
    'Waste Management': {
        icon: Trash2, color: 'text-gray-600', iconBg: 'bg-gray-100', gradient: 'from-gray-700 to-gray-900',
        helpline: '1800-123-4567', email: 'waste@smartcity.gov.in', address: 'Municipal Complex, Abids, Hyderabad',
        govLinks: [
            { name: 'GHMC Waste Portal', url: 'https://www.ghmc.gov.in', desc: 'Solid waste management and recycling programs.' },
            { name: 'Swachh Bharat', url: 'https://swachhbharatmission.ddws.gov.in', desc: 'National cleanliness mission portal.' },
        ]
    },
    'Transport': {
        icon: Bus, color: 'text-blue-600', iconBg: 'bg-blue-50', gradient: 'from-blue-600 to-blue-800',
        helpline: '1800-123-5678', email: 'transport@smartcity.gov.in', address: 'Transport Bhavan, Tank Bund, Hyderabad',
        govLinks: [
            { name: 'TSRTC', url: 'https://www.tsrtc.telangana.gov.in', desc: 'Telangana State Road Transport Corporation.' },
            { name: 'Hyderabad Metro', url: 'https://www.ltmetro.com', desc: 'Metro rail routes, fares, and timings.' },
        ]
    },
    'Water & Power': {
        icon: Droplets, color: 'text-cyan-600', iconBg: 'bg-cyan-50', gradient: 'from-cyan-600 to-teal-800',
        helpline: '1800-123-6789', email: 'utilities@smartcity.gov.in', address: 'Vidyut Soudha, Khairatabad, Hyderabad',
        govLinks: [
            { name: 'Mission Bhagiratha', url: 'https://missionbhagiratha.telangana.gov.in', desc: 'Safe drinking water project details.' },
            { name: 'TS GENCO', url: 'https://www.tggenco.co.in', desc: 'Power generation and electricity information.' },
        ]
    },
    'Public Safety': {
        icon: Shield, color: 'text-red-600', iconBg: 'bg-red-50', gradient: 'from-red-600 to-red-800',
        helpline: '100 / 112', email: 'safety@smartcity.gov.in', address: 'Police Commissioner Office, Basheerbagh, Hyderabad',
        govLinks: [
            { name: 'Hyderabad Police', url: 'https://hyderabadpolice.gov.in', desc: 'Citizen safety, FIR status, and police services.' },
            { name: 'TS Fire Services', url: 'https://tsfs.telangana.gov.in', desc: 'Fire and emergency response services.' },
        ]
    },
};

// Fallback meta for departments not in the map
const DEFAULT_META = {
    icon: Building2, color: 'text-purple-600', iconBg: 'bg-purple-50', gradient: 'from-purple-600 to-purple-800',
    helpline: '1800-123-0000', email: 'info@smartcity.gov.in', address: 'Smart City HQ, Hyderabad',
    govLinks: []
};

export default function DepartmentDashboard() {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/departments/${id}/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to load department');
                const json = await res.json();
                setData(json);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [id, token]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <p className="text-gray-500 font-medium">Loading department...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="text-center py-20">
                <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">{error || 'Department not found'}</p>
                <Link to="/dashboard" className="text-blue-600 hover:underline text-sm mt-2 inline-block">← Back to Dashboard</Link>
            </div>
        );
    }

    const { department, stats, recentComplaints } = data;
    const meta = DEPT_META[department.name] || DEFAULT_META;
    const Icon = meta.icon;

    const statusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'RESOLVED': return 'bg-green-50 text-green-700 border border-green-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const resolvedPercent = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            {/* Hero Header */}
            <div className={`bg-gradient-to-br ${meta.gradient} rounded-2xl p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Icon size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{department.name}</h1>
                            <p className="text-white/70 text-sm">{department.description || 'City department services and operations'}</p>
                        </div>
                    </div>

                    {/* Quick Stats in Hero */}
                    <div className="flex items-center gap-6 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Total Issues</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Resolved</p>
                            <p className="text-2xl font-bold">{resolvedPercent}%</p>
                        </div>
                        <Link
                            to={`/complaints/new?dept=${id}`}
                            className="ml-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <Plus size={16} /> Report Issue
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Complaints', value: stats.total, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'In Progress', value: stats.in_progress, icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 ${stat.bg} rounded-xl`}>
                                <stat.icon size={18} className={stat.color} />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{String(stat.value).padStart(2, '0')}</p>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Complaints */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">Recent Complaints</h2>
                            <Link to="/complaints" className="text-sm font-semibold text-[#3182CE] hover:underline">View All</Link>
                        </div>
                        {recentComplaints.length > 0 ? (
                            <div className="space-y-3">
                                {recentComplaints.map((c: any) => (
                                    <Link
                                        key={c.id}
                                        to={`/complaints/${c.id}`}
                                        className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                                                {c.description}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-gray-400 font-mono">COMP-{c.id}</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </span>
                                                {c.citizen_name && (
                                                    <span className="text-[10px] text-gray-400">by {c.citizen_name}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusBadge(c.status)}`}>
                                                {c.status.replace('_', ' ')}
                                            </span>
                                            <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <CheckCircle2 size={40} className="text-green-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">No complaints for this department. Great job!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Contact + Gov Links */}
                <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Contact Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Phone size={14} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Helpline</p>
                                    <p className="text-sm font-semibold text-gray-900">{meta.helpline}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Mail size={14} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                                    <p className="text-sm font-semibold text-gray-900">{meta.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <MapPin size={14} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Office</p>
                                    <p className="text-sm font-semibold text-gray-900">{meta.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Government Links */}
                    {meta.govLinks.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Related Services</h2>
                            <div className="space-y-3">
                                {meta.govLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 rounded-xl border border-gray-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{link.name}</h3>
                                            <ExternalLink size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{link.desc}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
