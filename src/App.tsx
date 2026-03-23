import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import Layout from './components/Layout';
import Auth from './components/Auth';

// Lazy load all page components for code splitting
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Complaints = React.lazy(() => import('./components/Complaints'));
const ComplaintDetails = React.lazy(() => import('./components/ComplaintDetails'));
const NewComplaint = React.lazy(() => import('./components/NewComplaint'));
const Jobs = React.lazy(() => import('./components/Jobs'));
const GovServices = React.lazy(() => import('./components/GovServices'));
const CityMap = React.lazy(() => import('./components/CityMap'));
const Profile = React.lazy(() => import('./components/Profile'));
const UserPublicProfile = React.lazy(() => import('./components/UserPublicProfile'));
const Explore = React.lazy(() => import('./components/Explore'));
const ExploreCategory = React.lazy(() => import('./components/ExploreCategory'));
const Departments = React.lazy(() => import('./components/admin/Departments'));
const Users = React.lazy(() => import('./components/admin/Users'));
const AdminExplore = React.lazy(() => import('./components/admin/AdminExplore'));
const DepartmentDashboard = React.lazy(() => import('./components/DepartmentDashboard'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-200px)]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <p className="text-gray-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><GovServices /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
          <Route path="/complaints/new" element={<ProtectedRoute><NewComplaint /></ProtectedRoute>} />
          <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><CityMap /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/explore/:slug" element={<ProtectedRoute><ExploreCategory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><UserPublicProfile /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/admin/explore" element={<ProtectedRoute><AdminExplore /></ProtectedRoute>} />
          <Route path="/department/:id" element={<ProtectedRoute><DepartmentDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

