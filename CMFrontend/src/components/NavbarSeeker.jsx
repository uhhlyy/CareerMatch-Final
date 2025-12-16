import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LogOut, Files, Menu, X, ClipboardList } from 'lucide-react';

export default function NavbarSeeker() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: 'John Doe', email: 'john@example.com' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user info from localStorage
    const seekerName = localStorage.getItem('seeker_name') || localStorage.getItem('fullname');
    const seekerEmail = localStorage.getItem('seekerEmail') || localStorage.getItem('email');
    
    if (seekerName) setUserInfo(prev => ({ ...prev, name: seekerName }));
    if (seekerEmail) setUserInfo(prev => ({ ...prev, email: seekerEmail }));
  }, []);

  // Notify parent components about sidebar state
  useEffect(() => {
    // Dispatch custom event when sidebar state changes
    window.dispatchEvent(new CustomEvent('sidebarStateChange', { 
      detail: { isExpanded } 
    }));
  }, [isExpanded]);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/SeekerMainPage' },
    { icon: ClipboardList, label: 'Application Tracker', path: '/Seeker_ApplicationTracker' },
    { icon: User, label: 'Profile', path: '/SeekerProfile' },
    { icon: Files, label: 'Resume Builder', path: '/ResumeBuilder' },
    { icon: LogOut, label: 'Sign Out', action: handleLogout },
  ];

  const isActive = (path) => location.pathname === path;

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        .sidebar-enter {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Topbar for mobile/tablet */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center">
          <button 
            onClick={() => setMobileOpen(true)} 
            className="text-white focus:outline-none hover:bg-slate-700 p-2 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 text-white font-bold text-lg tracking-tight">CareerMatch</span>
        </div>
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {getInitials(userInfo.name)}
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div
        className={`hidden md:block fixed top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out shadow-2xl ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Logo/Header */}
          <div className="flex items-center h-20 px-5 border-b border-slate-700/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span
              className={`ml-3 text-white font-bold text-xl whitespace-nowrap transition-all duration-300 ${
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              } overflow-hidden`}
            >
              CareerMatch
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={index}
                    className={`flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                    onClick={() => {
                      if (item.action) item.action();
                      else if (item.path) navigate(item.path);
                    }}
                  >
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <span
                      className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${
                        isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                      } overflow-hidden text-sm`}
                    >
                      {item.label}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {!isExpanded && (
                      <div className="absolute left-full ml-6 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-lg z-50">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-800"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="border-t border-slate-700/50 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                {getInitials(userInfo.name)}
              </div>
              <div
                className={`ml-3 transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                } overflow-hidden`}
              >
                <p className="text-white font-semibold text-sm whitespace-nowrap truncate max-w-[160px]">
                  {userInfo.name}
                </p>
                <p className="text-slate-400 text-xs whitespace-nowrap truncate max-w-[160px]">
                  {userInfo.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            mobileOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        ></div>
        
        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center h-20 px-5 border-b border-slate-700/50">
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white mr-3 hover:bg-slate-700 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="ml-3 text-white font-bold text-xl">CareerMatch</span>
          </div>

          {/* Navigation */}
          <nav className="px-3 py-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={index}
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                        setMobileOpen(false);
                      } else if (item.path) {
                        navigate(item.path);
                        setMobileOpen(false);
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3 font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 p-4 bg-slate-900/50">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {getInitials(userInfo.name)}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{userInfo.name}</p>
                <p className="text-slate-400 text-xs truncate">{userInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}