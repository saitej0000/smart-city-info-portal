import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2,
  User,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [complaint, setComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await fetch(`/api/complaints/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Complaint not found or access denied');
        const data = await res.json();
        setComplaint(data);
      } catch (e) {
        setError('Failed to load complaint details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaint();
  }, [id, token]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status, resolution_notes: 'Updated from details page' })
      });
      setComplaint({ ...complaint, status });
    } catch (e) {
      console.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading details...</div>;
  if (error || !complaint) return (
    <div className="p-12 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <Link to="/complaints" className="text-blue-600 hover:underline">Back to Complaints</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                  {complaint.category}
                </span>
                <div className={clsx(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                  complaint.status === 'RESOLVED' ? "bg-green-100 text-green-700" :
                  complaint.status === 'IN_PROGRESS' ? "bg-orange-100 text-orange-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {complaint.status === 'RESOLVED' ? <CheckCircle2 size={14} /> :
                   complaint.status === 'IN_PROGRESS' ? <Clock size={14} /> :
                   <AlertCircle size={14} />}
                  {complaint.status.replace('_', ' ')}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{complaint.description}</h1>
            </div>

            {user?.role !== 'CITIZEN' && (
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                {updating && <Loader2 className="animate-spin text-blue-600" size={16} />}
                <select 
                  value={complaint.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                  className="bg-transparent text-sm font-bold outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Building2 className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Department</p>
                <p className="font-medium">{complaint.dept_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Date Reported</p>
                <p className="font-medium">{new Date(complaint.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                {complaint.latitude ? (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${complaint.latitude},${complaint.longitude}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View on Map
                  </a>
                ) : (
                  <p className="text-gray-400 italic">No location tagged</p>
                )}
              </div>
            </div>
            {user?.role !== 'CITIZEN' && (
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Submitted By</p>
                  <p className="font-medium">{complaint.citizen_name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {complaint.image_url && (
          <div className="border-b border-gray-100">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Evidence Photo</h3>
            </div>
            <div className="p-6 flex justify-center bg-gray-50/50">
              <img 
                src={complaint.image_url} 
                alt="Complaint Evidence" 
                className="max-h-[500px] rounded-xl shadow-sm border border-gray-200"
              />
            </div>
          </div>
        )}

        {complaint.resolution_notes && (
          <div className="p-6 bg-blue-50/30">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={18} />
              Resolution Notes
            </h3>
            <p className="text-gray-700 leading-relaxed">{complaint.resolution_notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
