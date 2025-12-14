import React, { useState, useEffect } from "react";
import NavbarCompany from "../components/NavbarCompany";

export default function EmployerReview() {
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplications = async () => {
    const storedId = localStorage.getItem('employer_id') || localStorage.getItem('employerID') || localStorage.getItem('user_id');
    if (!storedId) { setLoading(false); return; }
    try {
      const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_pending_applications.php?employer_id=${storedId}`);
      const data = await response.json();
      if (Array.isArray(data)) setAllApplications(data);
    } catch (error) { console.error("Fetch error:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleStatusChange = async (applicantObj, newDecision) => {
    const employerId = localStorage.getItem('employer_id') || localStorage.getItem('employerID') || localStorage.getItem('user_id');
    try {
      const response = await fetch('http://localhost/CareerMatch-Final/CMBackend/update_applicant_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: applicantObj.application_id, employer_id: employerId, decision: newDecision })
      });
      const result = await response.json();
      if (result.success) {
        fetchApplications();
        setSelectedApplicant(null);
      }
    } catch (error) { console.error(error); }
  };

  const filteredList = allApplications.filter(item => {
    const matchesSearch = item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
    return activeTab === "Pending" ? (matchesSearch && item.status === "Pending") : (matchesSearch && item.status !== "Pending");
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarCompany />
      <div className="max-w-6xl mx-auto p-6 mt-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Application Review</h1>
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button onClick={() => setActiveTab("Pending")} className={`px-6 py-2 rounded-lg font-bold text-sm ${activeTab === "Pending" ? "bg-white text-blue-600" : "text-slate-500"}`}>
              Pending ({allApplications.filter(a => a.status === "Pending").length})
            </button>
            <button onClick={() => setActiveTab("History")} className={`px-6 py-2 rounded-lg font-bold text-sm ${activeTab === "History" ? "bg-white text-blue-600" : "text-slate-500"}`}>
              History ({allApplications.filter(a => a.status !== "Pending").length})
            </button>
          </div>
        </header>

        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 mb-6 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />

        {loading ? <p className="text-center py-10">Loading...</p> : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredList.map((app) => (
                  <tr key={app.application_id} className="hover:bg-blue-50/50">
                    <td className="px-6 py-5">
                      <button onClick={() => setSelectedApplicant(app)} className="font-bold text-blue-600 text-lg hover:underline">{app.fullname}</button>
                    </td>
                    <td className="px-6 py-5 uppercase font-bold text-xs text-slate-500">{app.job_title}</td>
                    <td className="px-6 py-5 text-sm">{app.email}<br/>{app.phone}</td>
                    <td className="px-6 py-5 flex justify-center gap-2">
                      {activeTab === "Pending" ? (
                        <>
                          <button onClick={() => handleStatusChange(app, 'Accepted')} className="p-2 bg-green-500 text-white rounded-full hover:scale-110 transition-transform">✓</button>
                          <button onClick={() => handleStatusChange(app, 'Rejected')} className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">✕</button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{app.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- FULL RESUME MODAL --- */}
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-6 bg-blue-600 text-white flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-black">
                    {selectedApplicant.fullname.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{selectedApplicant.fullname}</h2>
                    <p className="text-blue-100 font-bold uppercase tracking-widest text-sm">{selectedApplicant.job_title}</p>
                    <p className="text-blue-200 text-xs">{selectedApplicant.City}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApplicant(null)} className="bg-blue-500 hover:bg-red-500 p-2 rounded-lg transition-colors">✕</button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto bg-white grid md:grid-cols-3 gap-8">
                {/* Left Column: Personal Info */}
                <div className="md:col-span-1 space-y-6 border-r pr-6 border-slate-100">
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Personal Info</h3>
                    <ul className="text-sm space-y-2 text-slate-700">
                      <li><span className="font-bold">Gender:</span> {selectedApplicant.Gender}</li>
                      <li><span className="font-bold">Birthday:</span> {selectedApplicant.Birthday}</li>
                      <li><span className="font-bold">Status:</span> {selectedApplicant.MaritalStatus}</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact</h3>
                    <p className="text-sm text-slate-700">{selectedApplicant.email}</p>
                    <p className="text-sm text-slate-700">{selectedApplicant.phone}</p>
                  </section>
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Languages</h3>
                    <p className="text-sm text-slate-700">{selectedApplicant.Languages}</p>
                  </section>
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Preferences</h3>
                    <p className="text-sm text-slate-600 italic">"{selectedApplicant.JobPreferences}"</p>
                  </section>
                </div>

                {/* Right Column: Experience & Details */}
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-blue-600 font-black uppercase text-xs mb-2">About Me</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedApplicant.AboutMe}</p>
                  </section>
                  <section>
                    <h3 className="text-blue-600 font-black uppercase text-xs mb-2">Professional Summary</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedApplicant.Summary}</p>
                  </section>
                  <div className="grid grid-cols-2 gap-4">
                    <section>
                      <h3 className="text-blue-600 font-black uppercase text-xs mb-2">Experience</h3>
                      <p className="text-sm text-slate-600 whitespace-pre-line">{selectedApplicant.Experience}</p>
                    </section>
                    <section>
                      <h3 className="text-blue-600 font-black uppercase text-xs mb-2">Education</h3>
                      <p className="text-sm text-slate-600 whitespace-pre-line">{selectedApplicant.Education}</p>
                    </section>
                  </div>
                  <section>
                    <h3 className="text-blue-600 font-black uppercase text-xs mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.Skills?.split(',').map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">#{s.trim()}</span>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer Actions */}
              {selectedApplicant.status === "Pending" && (
                <div className="p-6 bg-slate-50 border-t flex gap-4">
                  <button onClick={() => handleStatusChange(selectedApplicant, 'Accepted')} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">Accept Candidate</button>
                  <button onClick={() => handleStatusChange(selectedApplicant, 'Rejected')} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Reject Candidate</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}