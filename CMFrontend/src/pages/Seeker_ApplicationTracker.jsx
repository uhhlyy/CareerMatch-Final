import React, { useState, useEffect } from "react";
import NavbarSeeker from "../components/NavbarSeeker";

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. AUTHENTICATION CHECK
      const token = localStorage.getItem('authToken');
      
      // 2. ID CHECK
      const seekerID = localStorage.getItem('seeker_id');
      
      console.log("Token Found:", !!token);
      console.log("Seeker ID Found:", seekerID);

      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      if (!seekerID || seekerID === "null") {
        throw new Error('User ID not found. Try logging in again.');
      }

      // 3. FETCH DATA
      // Note: Make sure your PHP query includes 'JobPreferences' in the SELECT statement
      const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_seeker_tracker.php?seekerID=${seekerID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

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

  const handleViewDetails = (app) => {
    setSelectedResume(app);
  };

  const filteredApplications = (Array.isArray(applications) ? applications : []).filter((app) =>
    !filterStatus || app.status?.toLowerCase() === filterStatus.toLowerCase()
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied": return "text-blue-600 bg-blue-100";
      case "denied": 
      case "rejected": return "text-red-600 bg-red-100";
      case "accepted": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <NavbarSeeker />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Application Tracker</h1>
            <button 
              onClick={fetchApplications} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh List"}
            </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="Accepted">Accepted</option>
            <option value="Denied">Denied</option>
            <option value="Applied">Applied</option>
          </select>
        </div>

        {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                <strong>Error:</strong> {error}
            </div>
        )}

        {loading ? (
            <div className="text-center py-10 text-gray-500">Loading applications...</div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.length > 0 ? (
                filteredApplications.map((app, index) => (
                    <div key={index} className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:border-blue-200 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{app.LastName || "Employer"}</h2>
                          
                          {/* SHOWING JOB PREFERENCES HERE */}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Target Roles:</span>
                            <p className="text-blue-600 font-semibold">{app.JobPreferences || "General"}</p>
                          </div>

                          <p className="text-sm text-gray-500 mt-2 italic">
                            Applied on: {app.date_applied ? new Date(app.date_applied).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 border-t pt-4">
                        <button 
                          onClick={() => handleViewDetails(app)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1"
                        >
                          View Full Application Details <span>→</span>
                        </button>
                      </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 italic">No applications match your current filter.</p>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedResume && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Review Application</h2>
                <p className="text-sm text-gray-500">Submitted to {selectedResume.LastName}</p>
              </div>
              <button onClick={() => setSelectedResume(null)} className="text-gray-400 hover:text-gray-800 transition text-3xl">&times;</button>
            </div>
            
            <div className="space-y-6">
              {/* MODAL JOB PREFERENCES */}
              <section className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Job Preferences</label>
                <p className="text-blue-900 font-bold text-lg mt-1">{selectedResume.JobPreferences || "No specific preferences listed."}</p>
              </section>

              <section>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Professional Summary</label>
                <p className="text-gray-700 mt-2 leading-relaxed">{selectedResume.Summary || "No summary provided."}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Education</label>
                    <div className="text-gray-700 mt-2 whitespace-pre-line bg-gray-50 p-3 rounded border border-gray-100">
                        {selectedResume.Education || "N/A"}
                    </div>
                  </section>
                  <section>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Skills</label>
                    <div className="text-gray-700 mt-2 bg-gray-50 p-3 rounded border border-gray-100">
                        {selectedResume.Skills || "N/A"}
                    </div>
                  </section>
              </div>

              <section>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Work Experience</label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mt-2 text-gray-700 whitespace-pre-line">
                  {selectedResume.Experience || "No experience listed."}
                </div>
              </section>
            </div>

            <button 
              onClick={() => setSelectedResume(null)}
              className="mt-8 w-full bg-gray-800 text-white py-4 rounded-xl hover:bg-black transition font-bold shadow-lg"
            >
              Back to Tracker
            </button>
          </div>
        </div>
      )}

      <footer className="bg-white border-t p-6 text-gray-400 text-center text-sm">
        CareerMatch © 2025
      </footer>
    </div>
  );
}