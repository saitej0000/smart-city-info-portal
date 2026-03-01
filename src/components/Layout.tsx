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
  Building2,
  Users,
  Globe,
  User
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const pageTitle: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/gov-services': 'Gov Services',
  '/complaints': 'Complaints',
  '/complaints/new': 'Complaints',
  '/map': 'City Map',
  '/jobs': 'Jobs',
  '/profile': 'Profile',
  '/admin/departments': 'Departments',
  '/admin/users': 'Users',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentTitle = pageTitle[location.pathname] || 'Dashboard';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Gov Services', path: '/gov-services', icon: Globe, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Complaints', path: '/complaints', icon: FileText, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'City Map', path: '/map', icon: Map, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Jobs', path: '/jobs', icon: Briefcase, roles: ['CITIZEN', 'SUPER_ADMIN'] },
    { name: 'Profile', path: '/profile', icon: User, roles: ['CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN'] },
    { name: 'Departments', path: '/admin/departments', icon: Building2, roles: ['SUPER_ADMIN'] },
    { name: 'Users', path: '/admin/users', icon: Users, roles: ['SUPER_ADMIN'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="h-screen overflow-hidden bg-[#F7FAFC] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-100 flex-col flex-shrink-0">
        <div className="p-5 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-[#3182CE] rounded-lg flex items-center justify-center">
            <Building2 className="text-white" size={18} />
          </div>
          <span className="font-bold text-base text-gray-900 tracking-tight">Telangana One</span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm",
                  isActive
                    ? "bg-blue-50 text-[#3182CE] font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                <item.icon size={18} className={cn(isActive ? "text-[#3182CE]" : "text-gray-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#3182CE] flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3182CE] rounded-lg flex items-center justify-center">
            <Building2 className="text-white" size={16} />
          </div>
          <span className="font-bold text-sm text-gray-900">Telangana One</span>
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
            className="fixed inset-0 z-40 bg-white md:hidden pt-20 px-6"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 text-base py-3 px-3 rounded-lg",
                    location.pathname === item.path ? "bg-blue-50 text-[#3182CE] font-semibold" : "text-gray-500"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 text-base py-3 px-3 text-red-500 w-full"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">{currentTitle}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              SECURE PORTAL ACTIVE
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">3</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <User size={20} />
            </button>
          </div>
        </header>

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
    </div>
  );
}
