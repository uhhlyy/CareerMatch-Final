import React from 'react';
import NavbarAdmin from '../components/NavbarAdmin';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <NavbarAdmin /> {/* This handles the sidebar and mobile topbar */}

      {/* Adjust margin-left for desktop to accommodate the sidebar (approx 72px when closed) */}
      <div className="flex-1 md:ml-[72px] p-10 pt-24 md:pt-10 overflow-y-auto">
        {/* Your Main Content (Header, Stats, Table) goes here */}
        <header>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Dashboard</h2>
            {/* ... rest of your dashboard content ... */}
        </header>
      </div>
    </div>
  );
}