import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { useAuthStore } from '../store';
import { Loader2, MapPin, AlertCircle, CheckCircle2, Clock, Search, List, ChevronLeft, ChevronRight } from 'lucide-react';
import L from 'leaflet';

// Custom marker icons using DivIcon for Tailwind styling
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
    if (target) {
      map.flyTo(target, 16, { duration: 1.5 });
    } else if (location) {
      map.flyTo(location, 13);
    }
  }, [location, target, map]);
  
  return null;
}

export default function CityMap() {
  const { token } = useAuthStore();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Default center (Hyderabad, Telangana based on context)
  const defaultCenter: [number, number] = [17.3850, 78.4867];

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log('Location access denied, using default');
        }
      );
    }

    // Fetch complaints with location data
    const fetchComplaints = async () => {
      try {
        const res = await fetch('/api/complaints/public', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setComplaints(data);
      } catch (error) {
        console.error('Failed to fetch map data');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [token]);

  const filteredComplaints = complaints.filter(c => 
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative">
      {/* Sidebar List */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${showSidebar ? 'w-80' : 'w-0 overflow-hidden'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Complaints ({filteredComplaints.length})</h3>
            <button 
              onClick={() => setShowSidebar(false)} 
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              title="Retract Sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredComplaints.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No mapped complaints found.</div>
          ) : (
            filteredComplaints.map(c => (
              <div 
                key={c.id}
                onClick={() => {
                  if (c.latitude && c.longitude) {
                    setTargetLocation([c.latitude, c.longitude]);
                    setSelectedId(c.id);
                  }
                }}
                className={`p-3 rounded-xl border transition-all group ${
                  selectedId === c.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : c.latitude && c.longitude 
                      ? 'border-gray-100 hover:border-blue-300 hover:bg-blue-50 cursor-pointer' 
                      : 'border-gray-100 bg-gray-50 opacity-70 cursor-default'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                    c.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-700">
                  {c.category}
                  {(!c.latitude || !c.longitude) && (
                    <span className="ml-2 text-[10px] text-gray-400 font-normal italic">(No location)</span>
                  )}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {!showSidebar && (
          <button 
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 text-gray-700 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <RecenterMap location={userLocation} target={targetLocation} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="font-bold text-blue-600">You are here</div>
              </Popup>
            </Marker>
          )}

          {/* Complaint Markers */}
          {filteredComplaints.map((c) => {
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
                    if (!showSidebar) setShowSidebar(true);
                  }
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                        c.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 font-bold">{c.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{c.description.substring(0, 50)}...</h3>
                    <p className="text-xs text-gray-500 mb-2">{new Date(c.created_at).toLocaleDateString()}</p>
                    {c.image_url && (
                      <img src={c.image_url} alt="Evidence" className="w-full h-24 object-cover rounded-lg mb-2" />
                    )}
                    <Link to={`/complaints/${c.id}`} className="text-blue-600 text-xs font-bold hover:underline block text-right">
                      View Details &rarr;
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="absolute top-4 right-4 bg-white p-4 rounded-xl shadow-lg z-[1000] max-w-xs hidden md:block">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            Map Legend
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Pending Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
