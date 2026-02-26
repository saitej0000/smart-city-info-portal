import React from 'react';
import { Shield, Flame, Ambulance, Siren, Phone, MapPin, AlertTriangle } from 'lucide-react';

export default function EmergencyServices() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emergency Services & Safety</h1>
        <p className="text-gray-500">Quick access to critical services and safety information.</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Police */}
        <div className="bg-[#1A202C] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={100} />
          </div>
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
            <Shield size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Police</h3>
          <p className="text-gray-400 mb-6 text-sm">
            Direct access to police services with station locations, contact information, and emergency response coordination.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Phone size={18} /> Call 911
            </button>
            <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <MapPin size={24} />
            </button>
          </div>
        </div>

        {/* Fire */}
        <div className="bg-[#1A202C] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame size={100} />
          </div>
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-900/50">
            <Flame size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Fire Department</h3>
          <p className="text-gray-400 mb-6 text-sm">
            Locate nearest fire stations and receive critical fire safety alerts for your area.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Phone size={18} /> Call 912
            </button>
            <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <MapPin size={24} />
            </button>
          </div>
        </div>

        {/* Medical */}
        <div className="bg-[#1A202C] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Ambulance size={100} />
          </div>
          <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-900/50">
            <Ambulance size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Medical Emergency</h3>
          <p className="text-gray-400 mb-6 text-sm">
            Fast ambulance dispatch with real-time tracking and nearest hospital emergency room information.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Phone size={18} /> Call 913
            </button>
            <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <MapPin size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Disaster Alerts */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6">
        <div className="p-4 bg-red-100 text-red-600 rounded-2xl shrink-0">
          <Siren size={40} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Disaster Alerts</h3>
          <p className="text-gray-600 mb-4">
            Receive instant notifications about natural disasters, severe weather, or public safety emergencies with evacuation routes and shelter locations.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
              <AlertTriangle size={12} /> Severe Weather
            </span>
            <span className="px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
              <AlertTriangle size={12} /> Floods
            </span>
            <span className="px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
              <AlertTriangle size={12} /> Public Safety
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
