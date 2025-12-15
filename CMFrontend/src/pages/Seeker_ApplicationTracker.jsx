import React, { useState, useEffect } from "react";
import NavbarSeeker from "../components/NavbarSeeker";

// --- CSS CONFETTI COMPONENT (Internal Alternative) ---
const ConfettiOverlay = () => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0">
      {[...Array(15)].map((_, i) => (
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
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [contactInfo, setContactInfo] = useState(null); // State for the contact modal

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

  // PERSISTED STATS LOGIC
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
      case "applied": case "pending": return "text-blue-600 bg-blue-100";
      case "denied": case "rejected": return "text-red-600 bg-red-100";
      case "accepted": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative font-[Poppins]">
      <NavbarSeeker />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 animate-fade-up opacity-0 active">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Application Tracker</h1>
          <button onClick={fetchApplications} className="px-4 py-2 bg-white border rounded-xl hover:bg-gray-50 transition shadow-sm text-sm">
            {loading ? "Refreshing..." : "↻ Refresh List"}
          </button>
        </div>

        {/* STATS CARDS - ALL STATUSES KEPT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up opacity-0 active delay-100">
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Sent</p>
            <p className="text-3xl font-black text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm border-l-4 border-l-green-500">
            <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Accepted</p>
            <p className="text-3xl font-black text-gray-800">{stats.accepted}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm border-l-4 border-l-red-500">
            <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Rejected</p>
            <p className="text-3xl font-black text-gray-800">{stats.rejected}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm border-l-4 border-l-blue-500">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-3xl font-black text-gray-800">{stats.pending}</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex items-center gap-3 animate-fade-up opacity-0 active delay-200">
          <label className="text-sm font-bold text-gray-500">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm font-semibold text-sm outline-none"
          >
            <option value="">All Applications</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending/Applied</option>
          </select>
        </div>

        {/* Application List */}
        {loading ? (
          <div className="text-center py-20 animate-pulse font-bold text-gray-400">Loading your applications...</div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app, index) => {
                const isAccepted = app.status?.toLowerCase() === "accepted";
                return (
                  <div 
                    key={index} 
                    className={`relative animate-fade-up opacity-0 active bg-white shadow-sm rounded-2xl p-6 border transition-all group ${isAccepted ? 'border-green-300 ring-2 ring-green-50' : 'border-gray-100 hover:border-blue-200'}`}
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    {/* CONFETTI TRIGGER */}
                    {isAccepted && <ConfettiOverlay />}

                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">
                          {app.JobTitle} {isAccepted && "🎉"}
                        </h2>
                        <p className="text-blue-600 font-bold text-sm">at {app.EmployerName}</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                          <p>📍 {app.JobLocation || 'N/A'}</p>
                          <p>📅 Applied: {app.date_applied ? new Date(app.date_applied).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(app.status)}`}>
                        {app.status || "Applied"}
                      </span>
                    </div>

                    <div className="relative z-10 mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                      <button onClick={() => setSelectedResume(app)} className="text-gray-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                        Review My Submission <span className="text-lg">→</span>
                      </button>

                      {/* CONTACT BUTTON: ONLY FOR ACCEPTED */}
                      {isAccepted && (
                        <button 
                          onClick={() => setContactInfo(app)}
                          className="bg-green-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100 animate-bounce-short flex items-center gap-2"
                        >
                          📞 Get Contact Info
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No applications found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: CONTACT INFORMATION (TRIGGERED BY ACCEPTED STATUS) */}
      {contactInfo && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl text-center animate-fade-up active">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎉</div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">You're Hired!</h2>
            <p className="text-gray-500 text-sm mb-6 font-medium">Reach out to <strong>{contactInfo.EmployerName}</strong> to discuss the next steps for <strong>{contactInfo.JobTitle}</strong>.</p>
            
            <div className="bg-gray-50 p-5 rounded-2xl mb-6 text-left border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Employer Email</p>
              <p className="text-gray-800 font-bold break-all">{contactInfo.EmployerEmail || "No email available"}</p>
            </div>

            <div className="flex gap-3">
              <a 
                href={`mailto:${contactInfo.EmployerEmail}`}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-lg text-center"
              >
                Send Email
              </a>
              <button onClick={() => setContactInfo(null)} className="px-6 bg-gray-100 text-gray-500 py-4 rounded-xl font-black text-xs uppercase hover:bg-gray-200 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESUME REVIEW (EXISTING) */}
      {selectedResume && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="animate-fade-up active bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Review Application</h2>
                <p className="text-sm font-bold text-gray-400">To: {selectedResume.EmployerName}</p>
              </div>
              <button onClick={() => setSelectedResume(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition text-2xl">&times;</button>
            </div>
            
            <div className="space-y-6">
              <section className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Professional Summary</label>
                <p className="text-blue-900 font-medium leading-relaxed">{selectedResume.Summary || "No summary provided."}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Skills</label>
                  <p className="text-gray-700 font-bold text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedResume.Skills || "N/A"}</p>
                </section>
                <section>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Experience</label>
                  <p className="text-gray-700 font-bold text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedResume.Experience || "N/A"}</p>
                </section>
              </div>
            </div>

            <button 
              onClick={() => setSelectedResume(null)}
              className="mt-8 w-full bg-gray-900 text-white py-4 rounded-2xl hover:bg-black transition font-black text-xs uppercase tracking-[0.2em]"
            >
              Back to Tracker
            </button>
          </div>
        </div>
      )}

      <footer className="bg-white border-t p-8 text-gray-400 text-center text-[10px] font-black uppercase tracking-[0.3em] animate-fade-up opacity-0 active">
        CareerMatch Matching Engine © 2025
      </footer>
    </div>
  );
}