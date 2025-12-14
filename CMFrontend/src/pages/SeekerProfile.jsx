import React, { useState, useEffect } from "react";
import NavbarSeeker from "../components/NavbarSeeker";
import { User, Mail, MapPin, GraduationCap, Briefcase, Award, FileText } from "lucide-react";

export default function SeekerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const seekerId = localStorage.getItem('seeker_id');
      
      if (!seekerId) {
        setError("User session expired. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_resume.php?seeker_id=${seekerId}`);
        const data = await response.json();

        if (data.success) {
          setProfile(data.resume);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <NavbarSeeker />
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm border border-red-100">
        <h2 className="text-xl font-bold text-gray-800">Profile Error</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <button onClick={() => window.location.href='/ResumeBuilder'} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
          Go to Resume Builder
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <NavbarSeeker />
      
      <main className="flex-1 p-6 md:p-12 ml-0 md:ml-20">
        <div className="max-w-5xl mx-auto">
          
          {/* TOP PROFILE HEADER */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-slate-900 to-blue-800" />
            <div className="px-8 pb-8 relative">
              <div className="flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
                  <div className="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-black">
                    {profile.FirstName?.[0]}{profile.LastName?.[0]}
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href='/ResumeBuilder'}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                >
                  Edit Resume
                </button>
              </div>
              
              <h1 className="text-3xl font-black text-slate-900">{profile.FirstName} {profile.LastName}</h1>
              <p className="text-blue-600 font-bold text-lg">{profile.JobPreferences || "General Applicant"}</p>
              
              <div className="flex flex-wrap gap-6 mt-4 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-2"><Mail size={18} className="text-slate-400"/> {profile.Email}</div>
                <div className="flex items-center gap-2"><MapPin size={18} className="text-slate-400"/> {profile.Address || "Location not provided"}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SIDE COLUMN */}
            <div className="space-y-8">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-4 uppercase text-xs tracking-widest">
                  <Award size={18} className="text-blue-600"/> Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.Skills ? profile.Skills.split(',').map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase">
                      {skill.trim()}
                    </span>
                  )) : <span className="text-gray-400 text-sm italic">No skills added</span>}
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-4 uppercase text-xs tracking-widest">
                  <FileText size={18} className="text-blue-600"/> Summary
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{profile.Summary || "No professional summary provided yet."}"
                </p>
              </section>
            </div>

            {/* MAIN COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-6 text-xl">
                  <Briefcase size={22} className="text-blue-600"/> Experience
                </h3>
                <div className="whitespace-pre-line text-slate-700 text-base leading-relaxed">
                  {profile.Experience || "No work history listed."}
                </div>
              </section>

              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-6 text-xl">
                  <GraduationCap size={22} className="text-blue-600"/> Education
                </h3>
                <div className="whitespace-pre-line text-slate-700 text-base leading-relaxed">
                  {profile.Education || "No educational background listed."}
                </div>
              </section>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}