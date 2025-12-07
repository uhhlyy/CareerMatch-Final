import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, LogOut, Files, Menu, X } from 'lucide-react';

export default function NavbarSeeker() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true, path: '/SeekerMainPage' },
    { icon: User, label: 'Profile' },
    { icon: Files, label: 'Resume Builder', path: '/ResumeBuilder' },
    { icon: LogOut, label: 'Sign Out', path: '/' },
  ];

  // Responsive layout
  return (
    <>
{/* Topbar for mobile/tablet */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center">
          <button onClick={() => setMobileOpen(true)} className="text-white focus:outline-none">
            <Menu className="w-7 h-7" />
          </button>
          <span className="ml-4 text-white font-bold text-lg">CareerMatch</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">JD</div>
        </div>
      </div>

{/* Sidebar for desktop */}
      <div
        className={`hidden md:block fixed top-0 left-0 h-full z-30 ${isExpanded ? 'w-60' : 'w-18'} bg-gradient-to-b from-slate-900 to-slate-800 transition-all duration-300 ease-in-out shadow-2xl`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
{/* Logo/Header */}
        <div className="flex items-center h-20 px-6 border-b border-slate-700">
          <Menu className="text-white w-6 h-6 min-w-6" />
          <span
className={`ml-4 text-white font-bold text-xl whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
          >
            CareerMatch
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`flex items-center w-full px-3 py-3 mb-2 rounded-lg transition-all duration-200 group ${item.active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                onClick={() => item.path && navigate(item.path)}
              >
                <Icon className="w-6 h-6 min-w-6" />
                <span className={`ml-4 font-medium whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

{/* User Profile */}
        <div className="absolute bottom-0 w-full border-t border-slate-700">
          <div className="flex items-center px-6 py-4">
            <div className="w-10 h-10 rounded-full left-2 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold min-w-10">JD</div>
            <div className={`ml-3 transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden`}>
              <p className="text-white font-medium text-sm whitespace-nowrap">John Doe</p>
              <p className="text-slate-400 text-xs whitespace-nowrap">john@example.com</p>
            </div>
          </div>
        </div>
      </div>

{/* Mobile sidebar drawer */}
{/* Smooth hamburger sidebar animation */}
      <div className={`fixed inset-0 z-50 md:hidden pointer-events-none`}>
{/* Overlay fade in/out */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileOpen(false)}
        ></div>
{/* Sidebar slide in/out */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}
        >
          <div className="flex items-center h-20 px-6 border-b border-slate-700">
            <button onClick={() => setMobileOpen(false)} className="text-white mr-2">
              <X className="w-6 h-6" />
            </button>
            <span className="text-white font-bold text-xl">CareerMatch</span>
          </div>
          <nav className="mt-8 px-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`flex items-center w-full px-3 py-3 mb-2 rounded-lg transition-all duration-200 group ${item.active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                      setMobileOpen(false);
                    }
                  }}
                >
                  <Icon className="w-6 h-6 min-w-6" />
                  <span className="ml-4 font-medium whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-0 w-full border-t border-slate-700">
            <div className="flex items-center px-6 py-4">
              <div className="w-10 h-10 rounded-full left-2 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold min-w-10">JD</div>
              <div className="ml-3">
                <p className="text-white font-medium text-sm whitespace-nowrap">John Doe</p>
                <p className="text-slate-400 text-xs whitespace-nowrap">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
