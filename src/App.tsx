import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Complaints from './components/Complaints';
import ComplaintDetails from './components/ComplaintDetails';
import NewComplaint from './components/NewComplaint';
import Jobs from './components/Jobs';
import GovernmentLinks from './components/GovernmentLinks';
import CityMap from './components/CityMap';
import CityDirectory from './components/CityDirectory';
import Transportation from './components/Transportation';
import WasteManagement from './components/WasteManagement';
import EmergencyServices from './components/Emergency';
import Departments from './components/admin/Departments';
import Users from './components/admin/Users';

// Placeholder components for other routes
const Alerts = () => <div className="p-8"><h1 className="text-3xl font-bold">City Alerts</h1><p className="text-gray-500 mt-2">Manage and view emergency broadcasts.</p></div>;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
        <Route path="/complaints/new" element={<ProtectedRoute><NewComplaint /></ProtectedRoute>} />
        <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><CityMap /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><CityDirectory /></ProtectedRoute>} />
        <Route path="/transport" element={<ProtectedRoute><Transportation /></ProtectedRoute>} />
        <Route path="/waste" element={<ProtectedRoute><WasteManagement /></ProtectedRoute>} />
        <Route path="/emergency" element={<ProtectedRoute><EmergencyServices /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><GovernmentLinks /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
