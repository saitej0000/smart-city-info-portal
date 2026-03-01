import React, { useState } from 'react';
import { Bus, Map, Car, Zap, Clock, Navigation, BatteryCharging, ParkingCircle, X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons by importing from standard unpkg/leaflet CDNs or just raw
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Using raw URLs since CRA / Vite sometimes fails resolving dist images
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, label, color }: any) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>{label}</Popup>
    </Marker>
  );
}

function RoutePlanner({ onClose }: { onClose: () => void }) {
  const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<L.LatLng | null>(null);
  const [step, setStep] = useState<'start' | 'end' | 'route'>('start');

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (step === 'start') {
      setStartPoint(e.latlng);
      setStep('end');
    } else if (step === 'end') {
      setEndPoint(e.latlng);
      setStep('route');
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const resetRoute = () => {
    setStartPoint(null);
    setEndPoint(null);
    setStep('start');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Navigation className="text-blue-600" /> Plan Your Journey
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 relative">
          <MapContainer center={[17.3850, 78.4867]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents />
            {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
            {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
            {startPoint && endPoint && (
              <Polyline positions={[startPoint, endPoint]} color="blue" dashArray="10, 10" />
            )}
          </MapContainer>

          <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-xl shadow-lg z-[1000]">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">From</label>
                <div className={`p-3 rounded-lg border ${step === 'start' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-gray-50'}`}>
                  {startPoint ? `Lat: ${startPoint.lat.toFixed(4)}, Lng: ${startPoint.lng.toFixed(4)}` : 'Click on map to set start'}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">To</label>
                <div className={`p-3 rounded-lg border ${step === 'end' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-gray-50'}`}>
                  {endPoint ? `Lat: ${endPoint.lat.toFixed(4)}, Lng: ${endPoint.lng.toFixed(4)}` : 'Click on map to set destination'}
                </div>
              </div>

              {step === 'route' && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <Bus size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Recommended Route</p>
                      <p className="text-xs text-gray-500">Fastest via Public Transit</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-bold text-gray-900">24 min</p>
                      <p className="text-xs text-green-600 font-bold">$1.50</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 pl-4 border-l-2 border-blue-100 ml-5">
                    <p>• Walk 5 mins to Station A</p>
                    <p>• Take Bus 101 (15 mins)</p>
                    <p>• Walk 4 mins to Destination</p>
                  </div>
                  <button onClick={resetRoute} className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors">
                    Plan New Route
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Transportation() {
  const [showPlanner, setShowPlanner] = useState(false);

  return (
    <div className="space-y-8">
      {showPlanner && <RoutePlanner onClose={() => setShowPlanner(false)} />}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transportation</h1>
        <p className="text-gray-500">Smart mobility solutions at your fingertips.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multi-Modal Routes */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Map size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Modal Routes</h3>
          <p className="text-gray-500 mb-6 flex-1">
            Access bus, metro, and train schedules with integrated route planning across all transportation modes.
          </p>
          <button
            onClick={() => setShowPlanner(true)}
            className="bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Navigation size={18} /> Plan Your Journey
          </button>
        </div>

        {/* Live Vehicle Tracking */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
            <Bus size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Live Vehicle Tracking</h3>
          <p className="text-gray-500 mb-6 flex-1">
            Track buses and trains in real-time to plan your journey with precision and minimize wait times.
          </p>
          <button className="bg-green-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Clock size={18} /> Track Now
          </button>
        </div>

        {/* Parking Availability */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
            <ParkingCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Parking Availability</h3>
          <p className="text-gray-500 mb-6 flex-1">
            Find open parking spots instantly with live occupancy data from parking facilities citywide.
          </p>
          <button className="bg-orange-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
            <Car size={18} /> Find Parking
          </button>
        </div>

        {/* EV Charging Stations */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">EV Charging Stations</h3>
          <p className="text-gray-500 mb-6 flex-1">
            Locate nearby charging stations with availability status and connector type information.
          </p>
          <button className="bg-yellow-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
            <BatteryCharging size={18} /> Locate Stations
          </button>
        </div>
      </div>
    </div>
  );
}
