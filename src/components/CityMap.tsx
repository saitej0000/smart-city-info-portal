import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { useAuthStore } from '../store';
import { Loader2, Search, Star, Sparkles, Wifi, Radio, Bot, MapPin } from 'lucide-react';
import L from 'leaflet';

const userLocationIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="position:relative;width:20px;height:20px;">
    <div style="position:absolute;inset:0;background:#3B82F6;border-radius:50%;opacity:0.3;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
    <div style="position:absolute;inset:4px;background:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
  </div>
  <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12]
});

const createCustomIcon = (status: string, isSelected: boolean) => {
  let colorClass = 'bg-blue-500';
  if (status === 'IN_PROGRESS') colorClass = 'bg-orange-500';
  if (status === 'RESOLVED') colorClass = 'bg-green-500';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="${colorClass} w-4 h-4 rounded-full border-2 border-white shadow-md ${isSelected ? 'scale-150 ring-4 ring-blue-200' : ''}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
  });
};

function RecenterMap({ location, target }: { location: [number, number] | null, target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 16, { duration: 1.5 });
    else if (location) map.flyTo(location, 13);
  }, [location, target, map]);
  return null;
}

type InfraCategory = 'All' | 'Hospital' | 'EV Charger' | 'Tourism' | 'ATM';

const localInfra = [
  { name: 'NIMS Hospital', address: 'Panjagutta, Hyderabad', rating: 4.5, category: 'Hospital', lat: 17.3947, lng: 78.4753 },
  { name: 'JNTU EV Station', address: 'Kukatpally, Hyderabad', rating: 4.8, category: 'EV Charger', lat: 17.4937, lng: 78.3916 },
  { name: 'Tank Bund Heritage', address: 'Hussain Sagar, Hyderabad', rating: 4.7, category: 'Tourism', lat: 17.4239, lng: 78.4738 },
  { name: 'GHMC Central Office', address: 'Tank Bund Rd, Hyderabad', rating: 4.2, category: 'Tourism', lat: 17.4156, lng: 78.4747 },
  { name: 'Banjara Hills ATM', address: 'Road No. 1, Banjara Hills', rating: 4.0, category: 'ATM', lat: 17.4138, lng: 78.4462 },
];

const infraCategories: InfraCategory[] = ['All', 'Hospital', 'EV Charger', 'Tourism', 'ATM'];

export default function CityMap() {
  const { token } = useAuthStore();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [infraCategory, setInfraCategory] = useState<InfraCategory>('All');

  const defaultCenter: [number, number] = [17.3850, 78.4867];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        () => console.log('Location access denied')
      );
    }
    const fetchComplaints = async () => {
      try {
        const res = await fetch('/api/complaints/public', { headers: { Authorization: `Bearer ${token}` } });
        setComplaints(await res.json());
      } catch { } finally { setLoading(false); }
    };
    fetchComplaints();
  }, [token]);

  const filteredInfra = localInfra.filter(i =>
    (infraCategory === 'All' || i.category === infraCategory) &&
    (!searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-gray-100 relative">
      {/* Left Panel */}
      <div className="w-96 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 overflow-hidden">
        {/* Smart AI Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#3182CE]" />
            <span className="text-xs font-bold text-[#3182CE] uppercase tracking-wider">Smart AI Search</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search or ask AI for places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#3182CE] rounded-lg text-white hover:bg-blue-700 transition-colors">
              <Bot size={14} />
            </button>
          </div>
          {/* Category Chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {infraCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setInfraCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${infraCategory === cat
                  ? 'bg-[#3182CE] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
              >
                {cat === 'All' ? 'All' : cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Local Infrastructure List */}
        <div className="flex-1 overflow-y-auto">
          <p className="px-4 pt-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Local Infrastructure</p>
          <div className="px-3 space-y-1">
            {filteredInfra.map((item, i) => (
              <button
                key={i}
                onClick={() => setTargetLocation([item.lat, item.lng])}
                className="w-full text-left p-3 rounded-xl hover:bg-blue-50 transition-all group flex items-center gap-3"
              >
                <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-blue-100 group-hover:text-[#3182CE] transition-colors flex-shrink-0">
                  <Building2Icon category={item.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#3182CE] transition-colors">{item.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{item.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-xs font-bold text-red-500">
                      <Star size={10} fill="currentColor" /> {item.rating}
                    </span>
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">FUNCTIONAL</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Top Status Bar */}
        <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center gap-3">
          <div className="bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-bold text-gray-700">SMART NODES</span>
              <span className="text-gray-400">CONNECTED</span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-bold text-gray-700">TRAFFIC SENSOR</span>
              <span className="text-gray-400">LIVE</span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-xs">
              <Bot size={12} className="text-gray-500" />
              <span className="font-bold text-gray-700">AI AGENT</span>
              <span className="text-gray-400">MONITORING</span>
            </div>
          </div>
        </div>

        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <RecenterMap location={userLocation} target={targetLocation} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup><div className="font-bold text-blue-600">You are here</div></Popup>
            </Marker>
          )}
          {complaints.map((c) => {
            if (!c.latitude || !c.longitude) return null;
            return (
              <Marker
                key={c.id}
                position={[c.latitude, c.longitude]}
                icon={createCustomIcon(c.status, selectedId === c.id)}
                eventHandlers={{
                  click: () => {
                    setSelectedId(c.id);
                    setTargetLocation([c.latitude, c.longitude]);
                  }
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                        c.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{c.status.replace('_', ' ')}</span>
                      <span className="text-xs text-gray-500 font-bold">{c.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{c.description.substring(0, 50)}...</h3>
                    <Link to={`/complaints/${c.id}`} className="text-blue-600 text-xs font-bold hover:underline block text-right">
                      View Details &rarr;
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Bottom Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900 text-white rounded-xl px-6 py-3 flex items-center gap-6 shadow-xl">
          <div className="text-xs">
            <span className="text-gray-400">CURRENT SECTOR</span>
            <p className="font-bold">Hyderabad Central Zone</p>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="text-xs">
            <span className="text-gray-400">VISIBILITY</span>
            <p className="font-bold">12km Clear</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Building2Icon({ category }: { category: string }) {
  switch (category) {
    case 'Hospital': return <span className="text-sm">🏥</span>;
    case 'EV Charger': return <span className="text-sm">⚡</span>;
    case 'Tourism': return <span className="text-sm">🏛️</span>;
    case 'ATM': return <span className="text-sm">🏧</span>;
    default: return <MapPin size={16} />;
  }
}
