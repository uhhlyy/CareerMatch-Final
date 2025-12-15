import React, { useState, useEffect } from "react";
import NavbarCompany from "../components/NavbarCompany";

export default function EmployerReview() {
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Pending"); 
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [confirmation, setConfirmation] = useState({ isOpen: false, type: "", data: null });

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

  // Helper to format the display date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const initiateStatusChange = (applicantObj, decision) => {
    setConfirmation({ isOpen: true, type: decision, data: applicantObj });
  };

  const confirmDecision = async () => {
    const { data, type } = confirmation;
    const employerId = localStorage.getItem('employer_id') || localStorage.getItem('employerID') || localStorage.getItem('user_id');
    
    try {
      const response = await fetch('http://localhost/CareerMatch-Final/CMBackend/update_applicant_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: data.application_id, employer_id: employerId, decision: type })
      });
      const result = await response.json();
      if (result.success) {
        fetchApplications();
        setSelectedApplicant(null);
        setConfirmation({ isOpen: false, type: "", data: null });
      }
    } catch (error) { console.error(error); }
  };

  const filteredList = allApplications.filter(item => {
    const matchesSearch = item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && item.status === activeTab;
  });

  const getCount = (status) => allApplications.filter(a => a.status === status).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarCompany />
      <div className="max-w-6xl mx-auto p-6 mt-10">
        <header className="animate-fade-up opacity-0 delay-100 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Application Review</h1>
          
          <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
            <button onClick={() => setActiveTab("Pending")} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === "Pending" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              Pending ({getCount("Pending")})
            </button>
            <button onClick={() => setActiveTab("Accepted")} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === "Accepted" ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              Accepted ({getCount("Accepted")})
            </button>
            <button onClick={() => setActiveTab("Rejected")} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === "Rejected" ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              Rejected ({getCount("Rejected")})
            </button>
          </div>
        </header>

        <input type="text" placeholder="Search by name or position..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="animate-fade-up opacity-0 delay-300 w-full p-3 mb-6 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white" />

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-sm uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-sm uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-sm uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-center text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredList.length > 0 ? (
                  filteredList.map((app) => (
                    <tr key={app.application_id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <button onClick={() => setSelectedApplicant(app)} className="font-bold text-blue-600 text-lg hover:underline text-left">{app.fullname}</button>
                      </td>
                      <td className="px-6 py-5 uppercase font-bold text-xs text-slate-500">{app.job_title}</td>
                      <td className="px-6 py-5 text-sm text-slate-600">{app.email}<br/>{app.phone}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {app.status}
                        </span>
                        {app.processed_at && (
                          <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">{formatDate(app.processed_at)}</p>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          {activeTab === "Pending" ? (
                            <>
                              <button onClick={() => initiateStatusChange(app, 'Accepted')} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md">✓</button>
                              <button onClick={() => initiateStatusChange(app, 'Rejected')} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md">✕</button>
                            </>
                          ) : (
                            <button 
                              onClick={() => initiateStatusChange(app, 'Pending')}
                              className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                              ↺ Undo
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-20 text-slate-400 font-medium">No {activeTab.toLowerCase()} applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- DYNAMIC CONFIRMATION POPUP --- */}
        {confirmation.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center border border-slate-100">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl shadow-lg ${
                confirmation.type === 'Accepted' ? 'bg-blue-500' : 
                confirmation.type === 'Rejected' ? 'bg-red-500' : 'bg-slate-500'
              }`}>
                {confirmation.type === 'Accepted' ? '✓' : confirmation.type === 'Rejected' ? '✕' : '↺'}
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                {confirmation.type === 'Pending' ? 'Undo Decision?' : 'Confirm Action'}
              </h2>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                {confirmation.type === 'Pending' 
                  ? `Are you sure you want to move ${confirmation.data.fullname} back to the Pending list?`
                  : <>Are you sure you want to <span className={confirmation.type === 'Accepted' ? 'text-blue-600 font-bold' : 'text-red-600 font-bold'}>{confirmation.type.toUpperCase()}</span> <strong>{confirmation.data.fullname}</strong> for this position?</>
                }
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmation({ isOpen: false, type: "", data: null })} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button onClick={confirmDecision} className={`flex-1 py-3 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 ${
                  confirmation.type === 'Accepted' ? 'bg-blue-600 hover:bg-blue-700' : 
                  confirmation.type === 'Rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-black'
                }`}>
                  Yes, Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- FULL RESUME MODAL (Same as before) --- */}
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
              <div className={`p-6 text-white flex justify-between items-start ${selectedApplicant.status === 'Rejected' ? 'bg-red-600' : 'bg-blue-600'}`}>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-black shadow-inner">
                    {selectedApplicant.fullname.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{selectedApplicant.fullname}</h2>
                    <p className="text-blue-100 font-bold uppercase tracking-widest text-xs">{selectedApplicant.job_title}</p>
                    <p className="text-blue-200 text-xs mt-1">📍 {selectedApplicant.City || "Location not specified"}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApplicant(null)} className="hover:bg-white/20 p-2 rounded-lg transition-colors text-2xl font-light">✕</button>
              </div>

              <div className="p-8 overflow-y-auto bg-white grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6 border-r pr-6 border-slate-100">
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Personal Details</h3>
                      <ul className="text-sm space-y-3 text-slate-700">
                        <li className="flex justify-between border-b border-slate-50 pb-1">
                            <span className="font-bold text-slate-400">Gender</span> 
                            <span className="font-bold">{selectedApplicant.Gender}</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-50 pb-1">
                            <span className="font-bold text-slate-400">Birthday</span> 
                            <span className="font-bold">{selectedApplicant.Birthday}</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-50 pb-1">
                            <span className="font-bold text-slate-400">Status</span> 
                            <span className="font-bold">{selectedApplicant.MaritalStatus}</span>
                        </li>
                      </ul>
                    </section>
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Contact Information</h3>
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <p className="text-xs font-bold text-blue-600">{selectedApplicant.email}</p>
                        <p className="text-xs font-bold text-slate-600">{selectedApplicant.phone}</p>
                      </div>
                    </section>
                </div>
                
                <div className="md:col-span-2 space-y-8">
                    <section>
                      <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Professional Summary
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-sm italic font-medium">"{selectedApplicant.AboutMe || selectedApplicant.Summary}"</p>
                    </section>
                    
                    <section>
                      <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Core Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.Skills?.split(',').map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tight rounded-lg border border-slate-200">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Experience
                      </h3>
                      <p className="text-slate-700 text-sm whitespace-pre-line bg-slate-50 p-4 rounded-2xl">
                        {selectedApplicant.Experience || "No experience listed."}
                      </p>
                    </section>
                </div>
              </div>

              {selectedApplicant.status === "Pending" && (
                <div className="p-6 bg-slate-50 border-t flex gap-4">
                  <button onClick={() => initiateStatusChange(selectedApplicant, 'Accepted')} className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg transition-all active:scale-95">Accept Candidate</button>
                  <button onClick={() => initiateStatusChange(selectedApplicant, 'Rejected')} className="flex-1 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 shadow-lg transition-all active:scale-95">Reject Candidate</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}