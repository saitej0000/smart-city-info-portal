import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Map, 
  Briefcase, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  Building2,
  Users,
  Globe,
  Compass,
  Bus,
  Trash2,
  Siren
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Complaints', path: '/complaints', icon: FileText, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'City Map', path: '/map', icon: Map, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Explore', path: '/explore', icon: Compass, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Transportation', path: '/transport', icon: Bus, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Waste Mgmt', path: '/waste', icon: Trash2, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Emergency', path: '/emergency', icon: Siren, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Jobs', path: '/jobs', icon: Briefcase, roles: ['CITIZEN', 'SUPER_ADMIN'] },
    { name: 'Alerts', path: '/alerts', icon: Bell, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Resources', path: '/resources', icon: Globe, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Departments', path: '/admin/departments', icon: Building2, roles: ['SUPER_ADMIN'] },
    { name: 'Users', path: '/admin/users', icon: Users, roles: ['SUPER_ADMIN'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="h-screen overflow-hidden bg-[#F7FAFC] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-[#1A202C] text-white flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-[#3182CE] rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">CivicPulse</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-[#3182CE] text-white shadow-md shadow-blue-900/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#1A202C] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#3182CE]" />
          <span className="font-bold text-lg">CivicPulse</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-40 bg-[#1A202C] md:hidden pt-20 px-6"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 text-xl py-2",
                    location.pathname === item.path ? "text-[#3182CE]" : "text-gray-400"
                  )}
                >
                  <item.icon size={24} />
                  <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 text-xl py-2 text-red-400"
              >
                <LogOut size={24} />
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
