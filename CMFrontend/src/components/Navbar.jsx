import React, { useState, useEffect } from 'react';
import { Menu, X, Briefcase } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-menu-enter {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-blue-900/80 shadow-lg py-3' 
            : 'bg-white/90 backdrop-blur-md shadow-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center ${isScrolled ? 'text-white' : 'text-inherit'}`}> 
            {/* Logo */}
            <a 
              href="/" 
              className="flex items-center gap-2 group transition-transform hover:scale-105"
            >
              <div className={`w-10 h-10 ${isScrolled ? 'bg-blue-800/80' : 'bg-linear-to-br from-blue-600 to-blue-700'} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isScrolled ? '' : 'bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent'}`} style={isScrolled ? {color: 'white'} : {}}>
                CareerMatch
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative font-medium transition-colors group ${isScrolled ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isScrolled ? 'bg-white' : 'bg-blue-600'} transition-all duration-300 group-hover:w-full`}></span>
                </a>
              ))}
              
              <a href="/roleselection">
                <button className={`px-6 py-2.5 rounded-xl font-semibold ${isScrolled ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-linear-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5'} transition-all duration-200 active:scale-95`}>
                  Login
                </button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
              style={{ top: isScrolled ? '64px' : '72px' }}
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Menu Content */}
            <div 
              className="md:hidden mobile-menu-enter bg-white border-t border-gray-100 shadow-xl"
              style={{ 
                position: 'fixed',
                top: isScrolled ? '64px' : '72px',
                left: 0,
                right: 0,
                maxHeight: 'calc(100vh - 72px)',
                overflowY: 'auto'
              }}
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                
                <a 
                  href="/roleselection"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="w-full px-6 py-3 rounded-xl text-white font-semibold bg-linear-to-r from-blue-600 to-blue-700 hover:shadow-lg transition-all">
                    Get Started
                  </button>
                </a>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className={isScrolled ? 'h-16' : 'h-20'}></div>
    </>
  );
}