import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';
import { Search, Trash2, Users, Building2, AlertCircle, CheckCircle, XCircle, Filter, Download, RefreshCw, Mail } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, seekers, employers
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
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
    if (window.confirm(`Are you sure you want to permanently delete this ${role} account?\n\nEmail: ${email}\n\nThis action cannot be undone.`)) {
      setDeleteLoading(`${role}-${id}`);
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
          alert("Failed to delete user: " + (data.message || "Unknown error"));
        }
      } catch (error) {
        alert("Server error during deletion");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const filteredData = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seekers = filteredData.filter(u => u.role === 'seeker');
  const employers = filteredData.filter(u => u.role === 'employer');

  const displayData = activeTab === 'seekers' ? seekers : activeTab === 'employers' ? employers : filteredData;

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "from-slate-600 to-slate-700",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700"
    },
    {
      title: "Job Seekers",
      value: users.filter(u => u.role === 'seeker').length,
      icon: Users,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Employers",
      value: users.filter(u => u.role === 'employer').length,
      icon: Building2,
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 flex">
        <NavbarAdmin /> 
        
        <div className="flex-1 md:ml-[72px] overflow-y-auto">
          {/* Header Section */}
          <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                    User Management
                  </h1>
                  <p className="text-slate-600 text-sm">
                    Manage and monitor all registered users on the platform
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={fetchUsers}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  
                
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <IconComponent size={24} className={stat.textColor} strokeWidth={2} />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by email address..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                  />
                </div>

                {/* Tab Filter */}
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setActiveTab('seekers')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'seekers'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Seekers
                  </button>
                  <button
                    onClick={() => setActiveTab('employers')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'employers'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Employers
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {activeTab === 'all' ? 'All Users' : activeTab === 'seekers' ? 'Job Seekers' : 'Employers'}
                    <span className="ml-2 text-slate-500">({displayData.length})</span>
                  </h2>
                </div>
              </div>

              {/* Table Content */}
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-4">
                    <RefreshCw size={24} className="text-slate-400 animate-spin" />
                  </div>
                  <p className="text-slate-600 font-medium">Loading users...</p>
                </div>
              ) : displayData.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <AlertCircle size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
                  <p className="text-slate-600 text-sm">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No users registered yet'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          User Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Email Address
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {displayData.map((user) => (
                        <tr 
                          key={`${user.role}-${user.id}`} 
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-slate-600">
                              #{String(user.id).padStart(4, '0')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'seeker' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {user.role === 'seeker' ? (
                                <>
                                  <Users size={12} />
                                  Job Seeker
                                </>
                              ) : (
                                <>
                                  <Building2 size={12} />
                                  Employer
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                                user.role === 'seeker' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {user.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle size={12} />
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                                title="Send Email"
                              >
                                <Mail size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id, user.email, user.role)}
                                disabled={deleteLoading === `${user.role}-${user.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete User"
                              >
                                {deleteLoading === `${user.role}-${user.id}` ? (
                                  <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Info */}
            {!loading && displayData.length > 0 && (
              <div className="mt-4 text-center text-sm text-slate-500">
                Showing {displayData.length} of {users.length} total users
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}