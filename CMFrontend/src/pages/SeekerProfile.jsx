import React, { useState, useEffect } from "react";
import SeekerLayout from "../components/SeekerLayout";
import { Mail, MapPin, GraduationCap, Briefcase, Award, FileText, Edit3 } from "lucide-react";

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
    <SeekerLayout>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    </SeekerLayout>
  );

  if (error) return (
    <SeekerLayout>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Profile Error</h3>
          <p className="text-red-700 text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.href='/ResumeBuilder'} 
            className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Go to Resume Builder
          </button>
        </div>
      </div>
    </SeekerLayout>
  );

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
        
        .animate-slide-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .section-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .section-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }
        
        .skill-badge {
          transition: all 0.2s ease;
        }
        
        .skill-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
      `}</style>

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="heading-font text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  My Profile
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  View and manage your professional information
                </p>
              </div>
              <button 
                onClick={() => window.location.href='/ResumeBuilder'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm font-medium text-sm self-start sm:self-auto"
              >
                <Edit3 size={16} />
                Edit Resume
              </button>
            </div>

            {/* Profile Header Card - Redesigned */}
            <div className="relative rounded-3xl shadow-lg border border-slate-200 overflow-hidden mb-8">
              {/* Background Banner */}
              <div className="h-36 sm:h-48 bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              {/* Profile Image and Info */}
              <div className="absolute left-1/2 top-24 sm:top-32 transform -translate-x-1/2 sm:left-16 sm:translate-x-0 z-10">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl bg-blue-600 flex items-center justify-center text-white text-4xl font-extrabold">
                  {profile.FirstName?.[0]}{profile.LastName?.[0]}
                </div>
              </div>
              <div className="pt-24 sm:pt-12 pb-8 px-4 sm:pl-60 sm:pr-8 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="heading-font text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                      {profile.FirstName} {profile.LastName}
                    </h2>
                    <p className="text-blue-600 font-semibold text-base sm:text-lg mb-2">
                      {profile.JobPreferences ? `"${profile.JobPreferences}"` : '"General Applicant"'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                      <Mail size={18} className="text-blue-600"/>
                      <span className="text-sm font-medium text-slate-900 truncate">{profile.Email}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                      <MapPin size={18} className="text-blue-600"/>
                      <span className="text-sm font-medium text-slate-900 truncate">{profile.Address || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
              <div className="stat-card bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Profile Views
                  </p>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900">127</p>
              </div>

              <div className="stat-card bg-blue-50 rounded-2xl shadow-sm border border-blue-200 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    Applications
                  </p>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-blue-900">24</p>
              </div>

              <div className="stat-card bg-green-50 rounded-2xl shadow-sm border border-green-200 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide">
                    Skills
                  </p>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Award size={20} className="text-green-600"/>
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-green-900">
                  {profile.Skills ? profile.Skills.split(',').length : 0}
                </p>
              </div>

              <div className="stat-card bg-purple-50 rounded-2xl shadow-sm border border-purple-200 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wide">
                    Completion
                  </p>
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-purple-900">85%</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Professional Summary */}
              <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText size={22} className="text-blue-600"/>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Summary</h3>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "{profile.Summary || "No professional summary provided yet."}"
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Award size={22} className="text-green-600"/>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Key Skills</h3>
                </div>
                
                {profile.Skills ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.Skills.split(',').map((skill, i) => (
                      <span 
                        key={i} 
                        className="skill-badge px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 uppercase tracking-wide"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Award size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm italic">No skills added</p>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Experience */}
              <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase size={26} className="text-blue-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                      Work Experience
                    </h3>
                    <p className="text-sm text-slate-500">Professional background and achievements</p>
                  </div>
                </div>
                
                {profile.Experience ? (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="whitespace-pre-line text-slate-700 text-base leading-relaxed">
                      {profile.Experience}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Briefcase size={48} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 text-base">No work history listed.</p>
                  </div>
                )}
              </div>

              {/* Education */}
              <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={26} className="text-blue-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                      Education
                    </h3>
                    <p className="text-sm text-slate-500">Academic qualifications and certifications</p>
                  </div>
                </div>
                
                {profile.Education ? (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="whitespace-pre-line text-slate-700 text-base leading-relaxed">
                      {profile.Education}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <GraduationCap size={48} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 text-base">No educational background listed.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </SeekerLayout>
  );
}