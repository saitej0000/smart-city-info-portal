import React from 'react';
import { useAuthStore } from '../store';
import { User, Mail, Shield, Building2, Calendar } from 'lucide-react';

export default function Profile() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#3182CE] to-blue-600 h-32 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-[#3182CE]">
                            {user?.name.charAt(0)}
                        </div>
                    </div>
                </div>
                <div className="pt-16 px-8 pb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500 text-sm capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
                </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h3 className="font-bold text-gray-900 text-lg">Account Details</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User size={20} className="text-[#3182CE]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Full Name</p>
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Shield size={20} className="text-[#3182CE]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Role</p>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
                        </div>
                    </div>
                    {user?.deptId && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Building2 size={20} className="text-[#3182CE]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Department ID</p>
                                <p className="text-sm font-semibold text-gray-900">{user.deptId}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
