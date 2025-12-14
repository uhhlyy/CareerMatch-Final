import React, { useState, useEffect } from "react";
import NavbarCompany from "../components/NavbarCompany";

export default function CompanyMainPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employerId, setEmployerId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      // Get the ID from localStorage
      const storedId = localStorage.getItem('employer_id') || localStorage.getItem('employerID') || localStorage.getItem('user_id');
      
      if (!storedId) {
        console.error("No employer_id found");
        setLoading(false);
        return;
      }

      setEmployerId(storedId);

      try {
        const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_employer_jobs.php?employer_id=${storedId}`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Dashboard Data:", data);

        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          console.error("Backend Error or non-array returned:", data);
          setJobs([]);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarCompany />
      
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900">Company Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Employer ID: <span className="font-bold text-blue-600">{employerId}</span>
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/jobposting'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            + Post New Job
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-blue-600 font-bold">Loading your jobs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl mr-4 overflow-hidden">
                      {job.photo ? (
                         <img src={`http://localhost/CareerMatch-Final/CMBackend/${job.photo}`} className="w-full h-full object-cover" alt="" />
                      ) : (
                        job.title?.charAt(0)
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 leading-tight">{job.title}</h2>
                      <p className="text-blue-600 text-sm font-medium">{job.type}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2 mb-6">
                    <p><strong>📍 Location:</strong> {job.location}</p>
                    <p><strong>💰 Salary:</strong> {job.salary}</p>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">ID: {job.id}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase">
                      {job.status || "Active"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center bg-white p-20 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-xl font-medium">You haven't posted any jobs yet.</p>
                <button onClick={() => window.location.href = '/jobposting'} className="text-blue-600 font-bold mt-2">Create your first post</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}