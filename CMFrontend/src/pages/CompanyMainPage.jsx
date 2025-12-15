import React, { useState, useEffect } from "react";
import NavbarCompany from "../components/NavbarCompany";

export default function CompanyMainPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employerId, setEmployerId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    const storedId = localStorage.getItem('employer_id') || localStorage.getItem('employerID') || localStorage.getItem('user_id');
    if (!storedId) {
      setLoading(false);
      return;
    }
    setEmployerId(storedId);

    try {
      const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_employer_jobs.php?employer_id=${storedId}`);
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">
      <NavbarCompany />
      
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Company Dashboard</h1>
            <p className="text-gray-500 text-sm">Managing listings for Employer #{employerId}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/jobposting'}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
          >
            + Post New Job
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-blue-600 font-bold animate-pulse">Syncing application data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 hover:shadow-xl transition cursor-pointer group relative overflow-hidden"
              >
                {/* APPLICANT COUNT BADGE (Using swiped_actions data) */}
                <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
                  <span className="text-xs font-black">{job.applicant_count || 0}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Applied</span>
                </div>

                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl mr-4 overflow-hidden border">
                    {job.photo ? (
                       <img src={`http://localhost/CareerMatch-Final/CMBackend/uploads/${job.photo}`} className="w-full h-full object-cover" alt="" 
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.title)}&background=dbeafe&color=2563eb`; }} />
                    ) : <span className="uppercase">{job.title?.charAt(0)}</span>}
                  </div>
                  <div className="pr-12">
                    <h2 className="text-lg font-black text-gray-800 group-hover:text-blue-600 transition-colors truncate w-full">{job.title}</h2>
                    <p className="text-blue-600 text-xs font-black uppercase tracking-widest">{job.type}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2 mb-4 font-medium">
                  <p>📍 {job.location}</p>
                  <p>💰 {job.salary}</p>
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase leading-tight">Job ID</span>
                    <span className="text-xs font-bold text-gray-400">#{job.id}</span>
                  </div>
                  <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs group-hover:bg-black transition-all">Manage Job</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- POPUP MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-8 relative animate-fade-up active">
            <button onClick={() => setSelectedJob(null)} className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-red-500 transition">&times;</button>

            <div className="flex gap-6 items-center mb-8 pb-8 border-b">
               <img src={`http://localhost/CareerMatch-Final/CMBackend/uploads/${selectedJob.photo}`} className="w-24 h-24 rounded-3xl object-cover border" 
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedJob.title)}&background=dbeafe&color=2563eb`; }} alt="" />
               <div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight">{selectedJob.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-blue-600 font-bold uppercase text-sm tracking-widest">{selectedJob.company || "Your Company"}</p>
                    <span className="bg-green-100 text-green-600 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      {selectedJob.applicant_count || 0} Successful Swipes
                    </span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Applicants</h3>
                    <p className="text-2xl font-black text-blue-900">{selectedJob.applicant_count || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</h3>
                    <p className="text-sm font-black text-gray-800 uppercase">Active</p>
                </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Job Description</h3>
              <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line bg-blue-50/20 p-6 rounded-3xl border border-blue-50">
                {selectedJob.description}
              </div>
            </div>

            <div className="flex gap-4">
                <button onClick={() => setSelectedJob(null)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-xs uppercase hover:bg-gray-200 transition">
                Close
                </button>
                <button 
                  onClick={() => window.location.href = `/manage-applicants/${selectedJob.id}`}
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-lg"
                >
                Manage {selectedJob.applicant_count || 0} Applicants
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}