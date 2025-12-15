import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_admin_users.php`);
      const data = await response.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, email, role) => {
    if (window.confirm(`Permanently delete ${role}: ${email}?`)) {
      try {
        const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/delete_user.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, role })
        });
        const data = await response.json();
        if (data.success) {
          setUsers(prev => prev.filter(u => !(u.id === id && u.role === role)));
        } else {
          alert("Delete failed: " + data.error);
        }
      } catch (error) {
        alert("Server connection failed");
      }
    }
  };

  const filteredData = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seekers = filteredData.filter(u => u.role === 'seeker');
  const employers = filteredData.filter(u => u.role === 'employer');

  const UserTable = ({ title, data, accentColor }) => (
    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden mb-10">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <h3 className={`font-black uppercase tracking-widest text-xs ${accentColor}`}>{title}</h3>
        <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">
          {data.length} Total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? data.map((user) => (
              <tr key={`${user.role}-${user.id}`} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6 text-sm font-bold text-slate-400">#{user.id}</td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${accentColor.replace('text', 'bg').replace('600', '100')}`}>👤</div>
                    <span className="font-bold text-slate-700">{user.email}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  {/* CLEANED ACTIONS: Only Delete icon remains, centered */}
                  <button 
                    onClick={() => handleDelete(user.id, user.email, user.role)}
                    className="p-2.5 hover:bg-red-50 rounded-xl transition text-slate-300 hover:text-red-600 border border-transparent hover:border-red-100"
                    title="Delete Account"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="p-10 text-center text-slate-300 italic text-sm">No {title} found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-[Poppins]">
      <NavbarAdmin /> 
      <div className="flex-1 md:ml-[72px] p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h2>
            <p className="text-slate-500 font-medium italic text-sm">Managing jobseekers and employers tables</p>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search by email..." 
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Fetching Database...</div>
        ) : (
          <>
            <UserTable title="Job Seekers" data={seekers} accentColor="text-indigo-600" />
            <UserTable title="Job Employers" data={employers} accentColor="text-blue-600" />
          </>
        )}
      </div>
    </div>
  );
}