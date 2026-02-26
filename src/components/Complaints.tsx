import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function Complaints() {
  const { user, token } = useAuthStore();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setComplaints(data);
    } catch (e) {
      console.error('Failed to fetch complaints');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(c => 
    filter === 'ALL' || c.status === filter
  );

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status, resolution_notes: 'Updated by admin' })
      });
      await fetchComplaints();
    } catch (e) {
      console.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-500">Track and manage city issues.</p>
        </div>
        {user?.role === 'CITIZEN' && (
          <Link 
            to="/complaints/new" 
            className="bg-[#3182CE] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-center"
          >
            New Complaint
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            placeholder="Search complaints..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all",
                filter === s 
                  ? "bg-[#3182CE] text-white shadow-md" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              )}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading complaints...</div>
        ) : filteredComplaints.length > 0 ? (
          filteredComplaints.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-blue-200 transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "p-2 rounded-lg",
                      c.status === 'RESOLVED' ? "bg-green-50 text-green-600" :
                      c.status === 'IN_PROGRESS' ? "bg-orange-50 text-orange-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {c.status === 'RESOLVED' ? <CheckCircle2 size={20} /> :
                       c.status === 'IN_PROGRESS' ? <Clock size={20} /> :
                       <AlertCircle size={20} />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{c.category}</span>
                      <h3 className="font-bold text-gray-900">{c.description}</h3>
                    </div>
                  </div>
                  {user?.role !== 'CITIZEN' && (
                    <div className="flex items-center gap-2">
                      {updatingId === c.id && <Loader2 className="animate-spin text-blue-600" size={16} />}
                      <select 
                        value={c.status}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                        disabled={updatingId === c.id}
                        className={clsx(
                          "text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none transition-opacity",
                          updatingId === c.id && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className={c.latitude ? "text-blue-500" : "text-gray-400"} />
                    {c.latitude && c.longitude ? (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View Location
                      </a>
                    ) : (
                      <span>No Location</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-gray-400" />
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  {user?.role !== 'CITIZEN' && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                        {c.citizen_name?.charAt(0)}
                      </div>
                      <span>{c.citizen_name}</span>
                    </div>
                  )}
                </div>

                {/* Show image and resolution notes for everyone if they exist */}
                {c.image_url && (
                  <div className="mt-4 rounded-xl overflow-hidden h-64 w-full md:w-96 border border-gray-100 shadow-sm">
                    <img src={c.image_url} alt="Complaint evidence" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                )}

                {c.resolution_notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-100">
                    <span className="font-bold block mb-1">Resolution Notes:</span>
                    {c.resolution_notes}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-500">
            No complaints found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
