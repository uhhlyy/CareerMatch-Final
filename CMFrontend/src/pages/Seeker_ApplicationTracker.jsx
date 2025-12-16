import React, { useState, useEffect } from "react";
import SeekerLayout from "../components/SeekerLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Enhanced Confetti Component
const ConfettiOverlay = () => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            top: '-10px',
            animation: `confetti-fall ${2 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const seekerID = localStorage.getItem('seeker_id');

      if (!seekerID || seekerID === "null") throw new Error('User ID not found.');

      const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_seeker_tracker.php?seekerID=${seekerID}`);
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.error || result.message || 'Failed to fetch applications.');
      }
      setApplications(result.data || []);
    } catch (err) {
      console.error("Tracker Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const stats = {
    accepted: applications.filter(a => a.status?.toLowerCase() === "accepted").length,
    rejected: applications.filter(a => ["rejected", "denied"].includes(a.status?.toLowerCase())).length,
    pending: applications.filter(a => ["pending", "applied", ""].includes(a.status?.toLowerCase())).length,
    total: applications.length
  };

  const filteredApplications = (Array.isArray(applications) ? applications : []).filter((app) =>
    !filterStatus || app.status?.toLowerCase() === filterStatus.toLowerCase()
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied": case "pending": return "bg-blue-50 text-blue-700 border-blue-200";
      case "denied": case "rejected": return "bg-red-50 text-red-700 border-red-200";
      case "accepted": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "✓";
      case "denied": case "rejected": return "✕";
      case "applied": case "pending": return "⏱";
      default: return "•";
    }
  };

  return (
    <SeekerLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * {
          font-family: 'Inter', sans-serif !important;
        }
        .heading-font {
          font-family: 'Inter', sans-serif !important;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-slide-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-gentle-bounce {
          animation: gentle-bounce 2s ease-in-out infinite;
        }
        
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .app-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .app-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }
        
        .filter-btn {
          transition: all 0.2s ease;
        }
        
        .modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
        
        .modal-content {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="heading-font text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  Application Tracker
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  Monitor the status of your job applications
                </p>
              </div>
              <button 
                onClick={fetchApplications}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm self-start sm:self-auto"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="stat-card bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Total
                  </p>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>

              <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide">
                    Accepted
                  </p>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats.accepted}</p>
              </div>

              <div className="stat-card bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl shadow-sm border border-red-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-red-700 uppercase tracking-wide">
                    Rejected
                  </p>
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-red-900">{stats.rejected}</p>
              </div>

              <div className="stat-card bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    Pending
                  </p>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-6 sm:mb-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Filter:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus("")}
                  className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === ""
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All Applications
                </button>
                <button
                  onClick={() => setFilterStatus("Accepted")}
                  className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "Accepted"
                      ? "bg-green-600 text-white"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  Accepted
                </button>
                <button
                  onClick={() => setFilterStatus("Rejected")}
                  className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "Rejected"
                      ? "bg-red-600 text-white"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  Rejected
                </button>
                <button
                  onClick={() => setFilterStatus("Pending")}
                  className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "Pending"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900 mb-4"></div>
              <p className="text-slate-600 font-medium">Loading your applications...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Applications</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app, index) => {
                  const isAccepted = app.status?.toLowerCase() === "accepted";
                  return (
                    <div 
                      key={index} 
                      className={`app-card relative bg-white rounded-2xl shadow-sm border p-4 sm:p-6 ${
                        isAccepted 
                          ? 'border-green-200 ring-2 ring-green-100' 
                          : 'border-slate-200 hover:border-blue-200'
                      }`}
                      style={{ 
                        animationDelay: `${index * 0.05}s`,
                        animation: 'slideInUp 0.5s ease-out forwards'
                      }}
                    >
                      {isAccepted && <ConfettiOverlay />}

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                                {app.JobTitle?.charAt(0) || "J"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate flex items-center gap-2">
                                  {app.JobTitle}
                                  {isAccepted && <span className="animate-gentle-bounce">🎉</span>}
                                </h3>
                                <p className="text-blue-600 font-semibold text-sm truncate">
                                  {app.EmployerName}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(app.status)} whitespace-nowrap`}>
                            <span className="text-base">{getStatusIcon(app.status)}</span>
                            {app.status || "Applied"}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{app.JobLocation || 'Location not specified'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Applied {app.date_applied ? new Date(app.date_applied).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                          <button 
                            onClick={() => setSelectedResume(app)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Review Submission
                          </button>

                          {isAccepted && (
                            <button 
                              onClick={() => setContactInfo(app)}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold text-sm transition-all shadow-lg "
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Get Contact Info
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Found</h3>
                  <p className="text-slate-600 text-sm">
                    {filterStatus ? `No ${filterStatus.toLowerCase()} applications` : 'Start applying to jobs to see them here'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Information Modal */}
      {contactInfo && (
        <div className="modal-overlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="modal-content bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-t sm:border border-slate-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🎉
              </div>
              <h2 className="heading-font text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Congratulations!
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                You've been accepted for <strong className="text-slate-900">{contactInfo.JobTitle}</strong> at{' '}
                <strong className="text-slate-900">{contactInfo.EmployerName}</strong>
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-200">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Employer Contact
              </label>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-900 font-semibold break-all">
                  {contactInfo.EmployerEmail || "No email available"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href={`mailto:${contactInfo.EmployerEmail}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
              <button 
                onClick={() => setContactInfo(null)}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Review Modal */}
      {selectedResume && (
        <div className="modal-overlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="modal-content bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border-t sm:border border-slate-200">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="heading-font text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                    Application Details
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Submitted to <span className="font-semibold text-slate-900">{selectedResume.EmployerName}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedResume(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto bg-slate-50 space-y-6" style={{maxHeight: 'calc(90vh - 180px)'}}>
              <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 sm:p-6 border border-blue-200">
                <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
                  Professional Summary
                </h3>
                <p className="text-blue-900 leading-relaxed text-sm sm:text-base">
                  {selectedResume.Summary || "No summary provided."}
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <section className="bg-white rounded-xl p-5 border border-slate-200">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Skills
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {selectedResume.Skills || "Not specified"}
                  </p>
                </section>

                <section className="bg-white rounded-xl p-5 border border-slate-200">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Experience
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {selectedResume.Experience || "Not specified"}
                  </p>
                </section>
              </div>

              <section className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Education
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {selectedResume.Education || "Not specified"}
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 sm:p-8 bg-white border-t border-slate-200">
              <button 
                onClick={() => setSelectedResume(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </SeekerLayout>
  );
}