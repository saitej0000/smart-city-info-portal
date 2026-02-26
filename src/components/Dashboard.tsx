import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus,
  TrendingUp,
  MapPin,
  Calendar,
  Bell,
  Building2,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../store';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        const promises = [
          fetch('/api/complaints', { headers }).then(res => res.json()),
          fetch('/api/alerts').then(res => res.json())
        ];

        if (user?.role === 'SUPER_ADMIN') {
          promises.push(fetch('/api/analytics', { headers }).then(res => res.json()));
        }

        const results = await Promise.all(promises);
        
        setRecentComplaints(results[0].slice(0, 5));
        setAlerts(results[1].slice(0, 3));
        
        if (user?.role === 'SUPER_ADMIN') {
          setStats(results[2]);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, user?.role]);

  const COLORS = ['#3182CE', '#ED8936', '#48BB78', '#F56565'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-500">Here's what's happening in your city today.</p>
      </header>

      {/* Quick Stats / Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'CITIZEN' ? (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText size={24} />
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">ACTIVE</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">My Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{recentComplaints.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <Bell size={24} />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">City Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <CheckCircle2 size={24} />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Resolved Issues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentComplaints.filter(c => c.status === 'RESOLVED').length}
                </p>
              </div>
            </div>
            <Link to="/complaints/new" className="bg-[#3182CE] p-6 rounded-2xl shadow-lg shadow-blue-200 text-white flex flex-col justify-between hover:bg-blue-700 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Plus size={24} />
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <p className="font-bold text-lg">Report an Issue</p>
                <p className="text-blue-100 text-sm">Help us improve the city</p>
              </div>
            </Link>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">Total Complaints</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalComplaints?.count || 0}</p>
            </div>
            {stats?.byStatus?.map((s: any) => (
              <div key={s.status} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium capitalize">{s.status.replace('_', ' ')}</p>
                <p className="text-3xl font-bold text-gray-900">{s.count}</p>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {user?.role === 'SUPER_ADMIN' && stats && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-600" />
                Complaints by Department
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byDept}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
                    <Tooltip 
                      cursor={{ fill: '#f7fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {stats.byDept.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Complaints</h2>
              <Link to="/complaints" className="text-blue-600 text-sm font-bold hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentComplaints.length > 0 ? (
                recentComplaints.map((c) => (
                  <div key={c.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{c.category}</span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            c.status === 'RESOLVED' ? "bg-green-100 text-green-700" :
                            c.status === 'IN_PROGRESS' ? "bg-orange-100 text-orange-700" :
                            "bg-blue-100 text-blue-700"
                          )}>
                            {c.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">{c.description.substring(0, 60)}...</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Building2 size={14} /> {c.dept_name}</span>
                          <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Link to={`/complaints/${c.id}`} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
                        <ArrowRight size={18} className="text-gray-400" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  No complaints found.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="text-orange-500" />
              City Alerts
            </h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={cn(
                  "p-4 rounded-xl border-l-4",
                  alert.type === 'EMERGENCY' ? "bg-red-50 border-red-500" :
                  alert.type === 'WEATHER' ? "bg-blue-50 border-blue-500" :
                  "bg-orange-50 border-orange-500"
                )}>
                  <h4 className="font-bold text-gray-900 text-sm">{alert.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{alert.message}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">{new Date(alert.created_at).toLocaleString()}</span>
                </div>
              ))}
              {alerts.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No active alerts.</p>}
            </div>
          </section>

          <section className="bg-[#1A202C] p-6 rounded-2xl shadow-xl text-white">
            <h2 className="text-lg font-bold mb-4">Emergency Contacts</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Police</span>
                <span className="font-mono font-bold text-[#3182CE]">911</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Fire Dept</span>
                <span className="font-mono font-bold text-[#3182CE]">912</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Ambulance</span>
                <span className="font-mono font-bold text-[#3182CE]">913</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
