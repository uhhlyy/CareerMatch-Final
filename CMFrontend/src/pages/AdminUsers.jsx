import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';
import { Search, Trash2, Briefcase, FileText, AlertCircle, RefreshCw, Eye, CheckCircle, Database, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // Removed deleteLoading state as it's no longer used
  // const [deleteLoading, setDeleteLoading] = useState(null); 
  const [activeTab, setActiveTab] = useState('all'); // all, jobs, resumes

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_admin_stats.php`);
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.jobs || []);
        setResumes(data.resumes || []);
      } else {
        console.error("Backend reported error:", data.error);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Removed handleDeleteContent function as it's no longer used
  // const handleDeleteContent = async (id, type) => {
  //   if (window.confirm(`Are you sure you want to permanently delete this ${type}?\n\nID: #${id}\n\nThis action cannot be undone.`)) {
  //     setDeleteLoading(`${type}-${id}`);
  //     try {
  //       const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/delete_content.php`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ id, type })
  //       });
  //       const data = await response.json();
  //       if (data.success) {
  //         if (type === 'job') setJobs(prev => prev.filter(j => j.id !== id));
  //         if (type === 'resume') setResumes(prev => prev.filter(r => r.id !== id));
  //       } else {
  //         alert("Delete failed: " + data.error);
  //       }
  //     } catch (error) {
  //       alert("Server connection failed");
  //     } finally {
  //       setDeleteLoading(null);
  //     }
  //   }
  // };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredResumes = resumes.filter(resume =>
    resume.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    resume.Skills?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayJobs = activeTab === 'jobs' || activeTab === 'all';
  const displayResumes = activeTab === 'resumes' || activeTab === 'all';

  const stats = [
    {
      title: "Total Content",
      value: jobs.length + resumes.length,
      icon: Database,
      color: "from-slate-600 to-slate-700",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700"
    },
    {
      title: "Job Postings",
      value: jobs.length,
      icon: Briefcase,
      color: "from-green-600 to-green-700",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Resumes",
      value: resumes.length,
      icon: FileText,
      color: "from-pink-600 to-pink-700",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700"
    }
  ];

  const ContentTable = ({ title, data, type, accentColor, icon: Icon, badgeColor }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 hover:shadow-md transition-shadow">
      {/* Table Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${badgeColor} flex items-center justify-center`}>
              <Icon size={20} className={accentColor} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">Manage {title.toLowerCase()}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${badgeColor} border ${accentColor.replace('text', 'border').replace('700', '200')}`}>
            <span className={`text-sm font-bold ${accentColor}`}>
              {data.length} {data.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                ID
              </th>
              {type === 'job' && (
                <>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Posted By
                  </th>
                </>
              )}
              {type === 'resume' && (
                <>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Seeker ID
                  </th>
                </>
              )}
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              {/* REMOVED ACTIONS HEADER */}
              {/* <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? data.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono font-semibold text-slate-500">
                    #{String(item.id).padStart(4, '0')}
                  </span>
                </td>

                {/* Job Postings Data */}
                {type === 'job' && (
                  <>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${badgeColor} flex items-center justify-center font-bold ${accentColor} text-sm`}>
                          {item.title?.charAt(0).toUpperCase() || 'J'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            Job Posting
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{item.company}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Employer #{item.employer_id}
                      </span>
                    </td>
                  </>
                )}

                {/* Resumes Data */}
                {type === 'resume' && (
                  <>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${badgeColor} flex items-center justify-center font-bold ${accentColor} text-sm`}>
                          {item.FullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.FullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            Resume Profile
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 truncate max-w-xs">
                        {item.Skills || 'No skills listed'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Seeker #{item.SeekerID}
                      </span>
                    </td>
                  </>
                )}

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle size={12} />
                    Active
                  </span>
                </td>

                {/* MODIFIED: REMOVED ACTIONS COLUMN (Delete/Settings) */}
                {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item.id, type)}
                      disabled={deleteLoading === `${type}-${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all border border-red-200 hover:border-red-600 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title={`Delete ${type}`}
                    >
                      {deleteLoading === `${type}-${item.id}` ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </td> */}
              </tr>
            )) : (
              <tr>
                <td colSpan={type === 'job' ? 5 : 5} className="px-6 py-12"> {/* Changed colspan from 6 to 5 */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                      <AlertCircle size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">No {title} Found</h3>
                    <p className="text-xs text-slate-500">
                      {searchTerm ? 'Try adjusting your search' : `No ${title.toLowerCase()} available yet`}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

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
          <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                      <Database size={24} className="text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Content Management
                      </h1>
                      <p className="text-slate-600 text-sm">
                        Manage job postings and resumes
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={fetchContent}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
            {/* Statistics Overview */}
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
                    placeholder="Search by job title, company, or name..." 
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
                    All Content
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'jobs'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => setActiveTab('resumes')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'resumes'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Resumes
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <RefreshCw size={32} className="text-slate-400 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Content</h3>
                <p className="text-slate-600 text-sm">Fetching database records...</p>
              </div>
            ) : (
              <>
                {/* Job Postings Table */}
                {displayJobs && (
                  <ContentTable 
                    title="Job Postings" 
                    data={filteredJobs} 
                    type="job"
                    accentColor="text-green-700" 
                    badgeColor="bg-green-100"
                    icon={Briefcase}
                  />
                )}

                {/* Resumes Table */}
                {displayResumes && (
                  <ContentTable 
                    title="Resumes" 
                    data={filteredResumes} 
                    type="resume"
                    accentColor="text-pink-700" 
                    badgeColor="bg-pink-100"
                    icon={FileText}
                  />
                )}
              </>
            )}

            {/* Footer Summary */}
            {!loading && (
              <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Content Overview</p>
                      <p className="text-xs text-slate-600">All content is active and monitored</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {filteredJobs.length + filteredResumes.length} / {jobs.length + resumes.length}
                    </p>
                    <p className="text-xs text-slate-600">
                      {searchTerm ? 'Filtered Results' : 'Total Items'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}