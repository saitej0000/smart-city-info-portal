import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { User, Shield, Building2, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function UserPublicProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token, user: currentUser } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // If viewing own profile, redirect to the private profile page
        if (currentUser?.id === parseInt(id || '0')) {
            navigate('/profile', { replace: true });
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/users/${id}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to load user profile');
                const data = await res.json();
                setProfile(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProfile();
    }, [id, token, currentUser, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="p-12 text-center">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <p className="text-red-500 mb-4">{error || 'User not found'}</p>
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
            </div>
        );
    }

    const roleLabels: Record<string, string> = {
        'CITIZEN': 'Citizen',
        'DEPT_ADMIN': 'Department Official',
        'SUPER_ADMIN': 'System Administrator'
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'RESOLVED': return 'bg-green-50 text-green-700 border border-green-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={16} /> Back
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                    {profile.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                        <User size={14} />
                        {roleLabels[profile.role] || profile.role}
                    </span>

                    {profile.dept_name && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                            <Building2 size={14} />
                            {profile.dept_name}
                        </span>
                    )}

                    {profile.role === 'SUPER_ADMIN' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                            <Shield size={14} />
                            Admin
                        </span>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="text-blue-600" size={20} />
                    Recent Complaints Activity
                </h2>

                {profile.recent_complaints && profile.recent_complaints.length > 0 ? (
                    <div className="space-y-3">
                        {profile.recent_complaints.map((c: any) => (
                            <Link
                                key={c.id}
                                to={`/complaints/${c.id}`}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                            {c.category}
                                        </span>
                                        {c.dept_name && (
                                            <span className="text-xs text-gray-500 font-medium">
                                                • {c.dept_name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                                        {c.description}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </p>
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
                    <div className="text-center py-8">
                        <CheckCircle2 size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No recent public complaints reported.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
