import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, ShoppingCart, User, Settings, LogOut, Shield, Bot } from 'lucide-react';
import clsx from 'clsx';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Bot, label: 'AI Assistant', path: '/ai-assistant' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: ShoppingCart, label: 'Store', path: '/store' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  // Additional items for all users or just special links
  // But typically "IIC Gallery" and "Rules" might be in a sidebar or footer.
  // Let's add them to sidebar for visibility as per prompt imply importance.
  const secondaryItems = [
     { label: 'IIC Gallery', path: '/gallery' },
     { label: 'Rules', path: '/rules' }
  ];

  if (user?.role === 'ADMIN') {
    navItems.unshift({ icon: Shield, label: 'Admin', path: '/admin' });
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-blue-600">Gemini Apps</h1>
          <p className="text-xs text-gray-500">NST AI Powered</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-100">
             <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Other</p>
             {secondaryItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={clsx(
                    "w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm",
                    location.pathname === item.path 
                      ? "text-blue-600 font-medium" 
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <span className="w-5" /> {/* Spacer for icon alignment */}
                  <span>{item.label}</span>
                </button>
             ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
