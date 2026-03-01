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
  FileText,
  ExternalLink,
  Trash2,
  Bus,
  Zap,
  Droplets,
  Shield,
  Star
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
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeCount = recentComplaints.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS').length;
  const resolvedCount = recentComplaints.filter(c => c.status === 'RESOLVED').length;

  const govSites = [
    { name: 'MeeSeva Portal', category: 'GENERAL', url: 'https://ts.meeseva.telangana.gov.in', desc: 'Universal gateway for all Telangana citizen services an...' },
    { name: 'TS-bPASS', category: 'MUNICIPAL', url: 'https://tsbpass.cgg.gov.in', desc: 'Single window system for building permissions and layo...' },
    { name: 'Dharani Portal', category: 'REVENUE', url: 'https://dharani.telangana.gov.in', desc: 'Integrated Land Records Management System for...' },
    { name: 'Hyderabad Police', category: 'EMERGENCY', url: 'https://hyderabadpolice.gov.in', desc: 'Official portal for citizen safety, FIR status, and police services.' },
  ];

  const categoryBadgeColor: Record<string, string> = {
    GENERAL: 'bg-blue-500',
    MUNICIPAL: 'bg-green-500',
    REVENUE: 'bg-red-500',
    EMERGENCY: 'bg-red-600',
  };

  const departments = [
    { name: 'WASTE MGMT', icon: Trash2, color: 'text-gray-600 bg-gray-50' },
    { name: 'TRANSPORT', icon: Bus, color: 'text-blue-600 bg-blue-50' },
    { name: 'ELECTRICITY', icon: Zap, color: 'text-yellow-600 bg-yellow-50' },
    { name: 'WATER SUPPLY', icon: Droplets, color: 'text-cyan-600 bg-cyan-50' },
    { name: 'MUNICIPAL', icon: Building2, color: 'text-purple-600 bg-purple-50' },
    { name: 'PUBLIC HEALTH', icon: Shield, color: 'text-red-600 bg-red-50' },
  ];

  const alertTypeColor: Record<string, string> = {
    WEATHER: 'border-blue-500 bg-blue-50',
    TRAFFIC: 'border-yellow-500 bg-yellow-50',
    EMERGENCY: 'border-red-500 bg-red-50',
    HEALTH: 'border-green-500 bg-green-50',
  };

  const alertBadgeColor: Record<string, string> = {
    WEATHER: 'bg-red-500 text-white',
    TRAFFIC: 'bg-yellow-500 text-white',
    EMERGENCY: 'bg-red-600 text-white',
    HEALTH: 'bg-green-500 text-white',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citizen Command Centre</h1>
          <p className="text-gray-500 text-sm">Unified access to your city's digital infrastructure.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/complaints/new" className="bg-[#3182CE] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
            <Plus size={16} /> Report Issue
          </Link>
          <Link to="/map" className="bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border border-gray-200 hover:border-gray-300 transition-colors">
            <MapPin size={16} /> Local Guide
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Clock size={18} className="text-[#3182CE]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Active Tickets</p>
          <p className="text-3xl font-bold text-gray-900">{String(activeCount).padStart(2, '0')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Resolved Issues</p>
          <p className="text-3xl font-bold text-gray-900">{String(resolvedCount).padStart(2, '0')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Live Alerts</p>
          <p className="text-3xl font-bold text-gray-900">{String(alerts.length).padStart(2, '0')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <TrendingUp size={18} className="text-[#3182CE]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">City Score</p>
          <p className="text-3xl font-bold text-gray-900">450</p>
        </div>
      </div>

      {/* Featured Government Sites */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Featured Government Sites</h2>
            <p className="text-xs text-gray-500">Most accessed digital services in your region.</p>
          </div>
          <Link to="/gov-services" className="text-sm font-semibold text-[#3182CE] hover:underline flex items-center gap-1">
            Directory <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {govSites.map((site, i) => (
            <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
              className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded text-white ${categoryBadgeColor[site.category]}`}>
                  {site.category}
                </span>
                <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1">
                {site.name} <Star size={10} className="text-yellow-500" fill="currentColor" />
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{site.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Alerts & Departments */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Emergency Alerts */}
        <div className="lg:col-span-3">
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="text-red-500">🚨</span> Emergency Alerts
              </h2>
              <Link to="/gov-services" className="text-sm font-semibold text-[#3182CE] hover:underline">Full Feed</Link>
            </div>
            <div className="space-y-3">
              {alerts.length > 0 ? alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${alertTypeColor[alert.type] || 'border-gray-300 bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${alertBadgeColor[alert.type] || 'bg-gray-500 text-white'}`}>
                      {alert.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      Today, {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{alert.message}</p>
                </div>
              )) : (
                <p className="text-center text-gray-400 text-sm py-6">No active alerts.</p>
              )}
            </div>
          </div>
        </div>

        {/* Service Departments */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">Service Departments</h2>
            <div className="grid grid-cols-2 gap-4">
              {departments.map((dept, i) => (
                <div key={i} className="flex flex-col items-center gap-2 py-3">
                  <div className={`p-3 rounded-xl ${dept.color}`}>
                    <dept.icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Chart */}
      {user?.role === 'SUPER_ADMIN' && stats && (
        <section className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Citizen Participation Index
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byDept}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#718096' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#718096' }} />
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
    </div>
  );
}
