import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 left-0.5">
          CareerMatch
        </div>

        {/* Navigation Links */}
        <div className="flex gap-8 items-center">
          <a href="/" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors">
            Home
          </a>
          <a href="/about" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors">
            About
          </a>
          <a href="/roleselection">
            <button className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-blue-700 to-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Register
            </button>
          </a>
        </div>
      </div>
    </nav>
  );
}
