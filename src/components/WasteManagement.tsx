import React from 'react';
import { Trash2, Calendar, Bell, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WasteManagement() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Waste Management</h1>
        <p className="text-gray-500">Efficient, clean, and community-focused waste solutions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feature: Scheduled Collections */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 bg-green-50 border-b border-green-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                <Calendar size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Scheduled Collections</h2>
                <p className="text-green-800">Next pickup for your area: <span className="font-bold">Tomorrow, 8:00 AM</span></p>
              </div>
            </div>
            <p className="text-gray-600">
              Never miss collection day with area-specific schedules and automated reminders tailored to your neighborhood's pickup times.
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Upcoming Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                    <span className="text-xs font-bold text-gray-500 uppercase">Feb</span>
                    <span className="text-lg font-bold text-gray-900">26</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">General Waste</h4>
                    <p className="text-xs text-gray-500">Weekly Collection</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Confirmed</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                    <span className="text-xs font-bold text-gray-500 uppercase">Feb</span>
                    <span className="text-lg font-bold text-gray-900">28</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Recycling</h4>
                    <p className="text-xs text-gray-500">Bi-weekly Collection</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Scheduled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Features */}
        <div className="space-y-6">
          {/* Missed Pickup Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4">
              <Bell size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Missed Pickup?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Report missed collections instantly and receive notifications about rescheduled pickups or service delays.
            </p>
            <Link to="/complaints/new?category=WASTE" className="block w-full py-2 bg-red-50 text-red-600 font-bold text-center rounded-lg hover:bg-red-100 transition-colors">
              Report Issue
            </Link>
          </div>

          {/* Community Reporting */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Trash2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Community Reporting</h3>
            <p className="text-sm text-gray-500 mb-4">
              Empower citizens to report waste issues like illegal dumping or overflowing bins directly through the app.
            </p>
            <Link to="/complaints/new?category=WASTE" className="block w-full py-2 bg-blue-600 text-white font-bold text-center rounded-lg hover:bg-blue-700 transition-colors">
              Report Dumping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
