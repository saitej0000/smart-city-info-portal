import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { User, Mail, Shield, Building2, Phone, Calendar, FileText, Briefcase, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function Profile() {
    const { user, token } = useAuthStore();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const [complaintsRes, appsRes] = await Promise.all([
                    fetch('/api/complaints', { headers }).then(r => r.json()).catch(() => []),
                    user?.role === 'CITIZEN'
                        ? fetch('/api/jobs/applications/mine', { headers }).then(r => r.json()).catch(() => [])
                        : Promise.resolve([]),
                ]);
                setComplaints(complaintsRes);
                setApplications(appsRes);
            } catch { } finally { setLoading(false); }
        };
        fetchData();
    }, [token, user?.role]);

    const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
    const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#3182CE] to-blue-600 h-32 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-[#3182CE]">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
                <div className="pt-16 px-8 pb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500 text-sm capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
                </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h3 className="font-bold text-gray-900 text-lg">Account Details</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-50 rounded-lg"><User size={20} className="text-[#3182CE]" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Full Name</p>
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-50 rounded-lg"><Mail size={20} className="text-[#3182CE]" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Email Address</p>
                            <p className="text-sm font-semibold text-gray-900">{user?.email || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-50 rounded-lg"><Shield size={20} className="text-[#3182CE]" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Role</p>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-50 rounded-lg"><Calendar size={20} className="text-[#3182CE]" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">User ID</p>
                            <p className="text-sm font-semibold text-gray-900">#{user?.id}</p>
                        </div>
                    </div>
                    {user?.deptId && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="p-2 bg-blue-50 rounded-lg"><Building2 size={20} className="text-[#3182CE]" /></div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Department ID</p>
                                <p className="text-sm font-semibold text-gray-900">#{user.deptId}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Stats */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                </div>
            ) : (
                <>
                    {/* Complaints Stats */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <FileText size={18} className="text-[#3182CE]" /> Complaint Activity
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl text-center">
                                <p className="text-2xl font-bold text-[#3182CE]">{complaints.length}</p>
                                <p className="text-xs text-gray-500 font-medium mt-1">Total Filed</p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-xl text-center">
                                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                                <p className="text-xs text-gray-500 font-medium mt-1">Pending</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-xl text-center">
                                <p className="text-2xl font-bold text-orange-600">{inProgressCount}</p>
                                <p className="text-xs text-gray-500 font-medium mt-1">In Progress</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl text-center">
                                <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
                                <p className="text-xs text-gray-500 font-medium mt-1">Resolved</p>
                            </div>
                        </div>
                        {/* Recent complaints list */}
                        {complaints.length > 0 && (
                            <div className="mt-2 space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Complaints</p>
                                {complaints.slice(0, 5).map((c) => (
                                    <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-600' :
                                                    c.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {c.status === 'RESOLVED' ? <CheckCircle2 size={14} /> :
                                                    c.status === 'IN_PROGRESS' ? <Clock size={14} /> :
                                                        <AlertCircle size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">{c.description}</p>
                                                <p className="text-[10px] text-gray-400">{c.category} · {new Date(c.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                                c.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {c.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Job Applications (Citizens only) */}
                    {user?.role === 'CITIZEN' && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <Briefcase size={18} className="text-[#3182CE]" /> Job Applications
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-[#3182CE]">{applications.length}</p>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Total Applied</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {applications.filter((a: any) => a.status === 'ACCEPTED').length}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Accepted</p>
                                </div>
                            </div>
                            {applications.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Applications</p>
                                    {applications.slice(0, 5).map((a: any) => (
                                        <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                                                    <Briefcase size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Job #{a.job_id}</p>
                                                    <p className="text-[10px] text-gray-400">Applied {new Date(a.applied_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${a.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                    a.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {a.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
