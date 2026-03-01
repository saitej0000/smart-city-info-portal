import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import {
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Zap,
  Droplets,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Complaints() {
  const { user, token } = useAuthStore();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'track' | 'new'>('track');
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetchComplaints();
    fetch('/api/departments').then(r => r.json()).then(setDepartments).catch(() => { });
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

  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = filter === 'ALL' || c.status === filter;
    const matchesDept = deptFilter === 'All' || c.dept_name === deptFilter;
    const matchesSearch = !searchTerm ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDept && matchesSearch;
  });

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

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('garbage') || cat.includes('waste')) return <Trash2 size={20} />;
    if (cat.includes('power') || cat.includes('electric')) return <Zap size={20} />;
    if (cat.includes('water')) return <Droplets size={20} />;
    return <AlertCircle size={20} />;
  };

  const getCategoryIconBg = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('garbage') || cat.includes('waste')) return 'bg-gray-100 text-gray-600';
    if (cat.includes('power') || cat.includes('electric')) return 'bg-yellow-50 text-yellow-600';
    if (cat.includes('water')) return 'bg-cyan-50 text-cyan-600';
    return 'bg-blue-50 text-blue-600';
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'RESOLVED': return 'bg-green-50 text-green-700 border border-green-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const deptNames = ['All', ...Array.from(new Set(complaints.map(c => c.dept_name).filter(Boolean)))];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTab('track')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === 'track' ? 'bg-[#3182CE] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}
        >
          <Clock size={16} /> Track Issues
        </button>
        {user?.role === 'CITIZEN' && (
          <Link
            to="/complaints/new"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all bg-white text-gray-600 border border-gray-200 hover:border-blue-300`}
          >
            <Plus size={16} /> Report New
          </Link>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            placeholder="Search by ID or Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-sm text-gray-400 flex items-center gap-1 flex-shrink-0">≡ Filter</span>
          {deptNames.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${deptFilter === dept
                  ? 'bg-[#3182CE] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Complaint Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group">
              {/* Top: Icon + Status */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${getCategoryIconBg(c.category)}`}>
                  {getCategoryIcon(c.category)}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusBadge(c.status)}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                  {user?.role !== 'CITIZEN' && (
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      disabled={updatingId === c.id}
                      className="text-[10px] font-bold bg-gray-50 border border-gray-200 rounded-lg px-1.5 py-0.5 outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                {c.description}
              </h3>

              {/* Meta */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin size={12} className="text-gray-400" />
                  {c.latitude && c.longitude ? (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`}
                      target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline uppercase font-medium">
                      View Location
                    </a>
                  ) : (
                    <span className="uppercase font-medium">{c.dept_name || 'Unknown Location'}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={12} className="text-gray-400" />
                  <span>REPORTED {new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-[10px] text-gray-400 font-mono">ID: COMP-{c.id}</span>
                <Link
                  to={`/complaints/${c.id}`}
                  className="text-sm font-semibold text-[#3182CE] flex items-center gap-1 hover:underline"
                >
                  {c.status === 'RESOLVED' ? 'View Report' : 'View Details'} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-500">
          No complaints found for this filter.
        </div>
      )}
    </div>
  );
}
