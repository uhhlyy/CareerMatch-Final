import React, { useState, useEffect } from 'react';
import NavbarCompany from '../components/NavbarCompany';

/**
 * CompanyLayout - Wrapper component that handles page layout with expandable sidebar
 * This component automatically adjusts the content area when the sidebar expands/collapses
 */
export default function CompanyLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    // Listen for sidebar state changes
    const handleSidebarChange = (event) => {
      setSidebarExpanded(event.detail.isExpanded);
    };

    window.addEventListener('companySidebarStateChange', handleSidebarChange);

    return () => {
      window.removeEventListener('companySidebarStateChange', handleSidebarChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarCompany />
      
      {/* Content area that adjusts based on sidebar state */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarExpanded ? 'md:ml-64' : 'md:ml-20'
        } pt-16 md:pt-0`}
      >
        {children}
      </div>
    </div>
  );
}