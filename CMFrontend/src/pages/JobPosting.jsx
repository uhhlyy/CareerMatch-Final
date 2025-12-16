import React, { useState } from "react";
import CompanyLayout from "../components/CompanyLayout";
import { ClipboardList, CheckCircle, FileText } from 'lucide-react';

export default function JobPosting() {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    jobTitle: "",  
    companyName: "",
    location: "",
    jobType: "",
    salary: "",
    description: "",
    degree: "",
    experience: "",
    employmentLevel: "",
    educationLevel: "", 
    photo: null, 
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
        e.target.value = null;
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        e.target.value = null;
        return;
      }
      
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      
      console.log('Photo selected:', file.name, 'Size:', (file.size / 1024).toFixed(2) + 'KB');
    } else {
      setFormData({ ...formData, photo: null });
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const employerId = localStorage.getItem('employer_id') || localStorage.getItem('employerID');
    
    if (!employerId) {
      alert("Session expired. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('employer_id', employerId);
    formDataToSend.append('title', formData.jobTitle);
    formDataToSend.append('company', formData.companyName);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('type', formData.jobType);
    formDataToSend.append('salary', formData.salary);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('degree', formData.degree);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('employmentLevel', formData.employmentLevel);
    formDataToSend.append('educationLevel', formData.educationLevel);

    if (formData.photo) {
      formDataToSend.append('photo', formData.photo, formData.photo.name);
      console.log('Uploading photo:', formData.photo.name);
    }

    // Log FormData for debugging
    console.log('Posting job...');
    for (let pair of formDataToSend.entries()) {
      if (pair[0] === 'photo') {
        console.log(pair[0] + ': [File Object]', pair[1].name);
      } else {
        console.log(pair[0] + ': ' + pair[1]);
      }
    }

    try {
      const response = await fetch('http://localhost/CareerMatch-Final/CMBackend/job_post.php', {
        method: 'POST',
        body: formDataToSend, 
      });

      const text = await response.text();
      console.log('Server response:', text);
      
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        alert("Server error: " + text);
        return;
      }

      if (result.success) {
        alert("Job successfully posted!");
        setFormData({
          jobTitle: "", companyName: "", location: "", jobType: "",
          salary: "", description: "", degree: "", experience: "",
          employmentLevel: "", educationLevel: "", photo: null,
        });
        setPhotoPreview(null);
        setActiveSection('basic');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Error saving job: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Information', icon: ClipboardList },
    { id: 'requirements', label: 'Job Requirements', icon: CheckCircle },
    { id: 'details', label: 'Additional Details', icon: FileText },
  ];

  return (
    <CompanyLayout>
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
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-slide-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .section-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .section-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }
        
        .input-field {
          transition: all 0.2s ease;
          border: 1.5px solid #e2e8f0;
        }
        
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .nav-tab {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-tab::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          transition: width 0.3s ease;
        }
        
        .nav-tab.active::after {
          width: 100%;
        }
        
        .photo-upload-area {
          position: relative;
          overflow: hidden;
        }
        
        .photo-upload-area::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          transition: all 0.3s ease;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
        }
        
        .submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
        
        .label-text {
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.025em;
          text-transform: uppercase;
          color: #475569;
        }
        
        .file-upload-btn {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        
        .file-upload-btn input[type="file"] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
      `}</style>
      
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="heading-font text-5xl font-bold text-slate-900 mb-3">
              Post a New Job Opening
            </h1>
          </div>

          {/* Progress Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`nav-tab flex-1 flex items-center justify-center gap-3 py-3 px-4 ${
                      activeSection === section.id 
                        ? 'active text-blue-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon size={24} className={activeSection === section.id ? 'text-blue-600' : 'text-slate-500'} />
                    <span className="font-medium hidden sm:inline">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            {activeSection === 'basic' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                {/* Photo Upload Card */}
                <div className="lg:col-span-1">
                  <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sticky top-8">
                    <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-6">
                      Job Photo
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="photo-upload-area relative">
                        {photoPreview ? (
                          <div className="relative group">
                            <img 
                              src={photoPreview} 
                              alt="Job Preview" 
                              className="w-full aspect-video object-cover rounded-xl border-4 border-slate-100"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-xl flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                Change Photo
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-slate-500 text-sm font-medium">No photo selected</p>
                            <p className="text-slate-400 text-xs mt-1">Optional</p>
                          </div>
                        )}
                      </div>
                      
                      <label className="file-upload-btn block w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-lg cursor-pointer transition-colors font-medium">
                        <input
                          id="photo"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleFileChange}
                        />
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                      </label>
                      
                      <div className="text-xs text-slate-500 space-y-1">
                        <p className="font-medium">Optional:</p>
                        <ul className="list-disc list-inside space-y-0.5 ml-2">
                          <li>Company logo or office photo</li>
                          <li>Landscape format (16:9 ratio)</li>
                          <li>JPG, PNG, GIF, or WebP</li>
                          <li>Maximum size: 5MB</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info Form */}
                <div className="lg:col-span-2">
                  <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-8">
                      Basic Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="jobTitle" className="label-text block mb-2">
                          Job Title *
                        </label>
                        <input
                          id="jobTitle"
                          type="text"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Senior Software Engineer"
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="companyName" className="label-text block mb-2">
                          Company Name *
                        </label>
                        <input
                          id="companyName"
                          type="text"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                          placeholder="Your company name"
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="location" className="label-text block mb-2">
                          Location *
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          placeholder="City, Province/Region"
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="salary" className="label-text block mb-2">
                          Salary Range *
                        </label>
                        <input
                          id="salary"
                          type="text"
                          value={formData.salary}
                          onChange={handleChange}
                          required
                          placeholder="e.g., ₱50,000 - ₱70,000"
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="jobType" className="label-text block mb-2">
                          Job Type *
                        </label>
                        <select
                          id="jobType"
                          value={formData.jobType}
                          onChange={handleChange}
                          required
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        >
                          <option value="">Select job type</option>
                          <option>Full-Time</option>
                          <option>Part-Time</option>
                          <option>Internship</option>
                          <option>Remote</option>
                          <option>Hybrid</option>
                          <option>Contract</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="employmentLevel" className="label-text block mb-2">
                          Employment Level *
                        </label>
                        <select
                          id="employmentLevel"
                          value={formData.employmentLevel}
                          onChange={handleChange}
                          required
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        >
                          <option value="">Select level</option>
                          <option>Entry-level</option>
                          <option>Mid-level</option>
                          <option>Senior</option>
                          <option>Manager</option>
                          <option>Executive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements Section */}
            {activeSection === 'requirements' && (
              <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-8">
                    Job Requirements
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="educationLevel" className="label-text block mb-2">
                        Education Level Required *
                      </label>
                      <select
                        id="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                      >
                        <option value="">Select education level</option>
                        <option>High School Graduate</option>
                        <option>College Undergraduate</option>
                        <option>Bachelor's Degree</option>
                        <option>Master's Degree</option>
                        <option>Doctorate/PhD</option>
                        <option>Vocational / TESDA</option>
                        <option>Bootcamp Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="degree" className="label-text block mb-2">
                        Preferred Degree/Field *
                      </label>
                      <input
                        id="degree"
                        type="text"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Computer Science, Engineering"
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="experience" className="label-text block mb-2">
                        Required Experience *
                      </label>
                      <input
                        id="experience"
                        type="text"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 3-5 years in software development"
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Specify years of experience and relevant fields
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Details Section */}
            {activeSection === 'details' && (
              <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-8">
                    Job Description
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="description" className="label-text block mb-2">
                        Detailed Job Description *
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="12"
                        placeholder="Provide a comprehensive description including:&#10;&#10;• Role overview and responsibilities&#10;• Day-to-day tasks&#10;• Required skills and qualifications&#10;• Preferred qualifications&#10;• Benefits and perks&#10;• Company culture&#10;• Growth opportunities"
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none resize-none font-mono text-sm"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Be detailed and specific to attract the right candidates
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-btn px-12 py-4 rounded-xl text-white font-semibold text-lg shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Posting Job...
                      </span>
                    ) : (
                      'Post Job Opening'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {activeSection !== 'details' && (
              <div className="flex justify-end mt-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1].id);
                    }
                  }}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
                >
                  Continue to Next Section →
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <footer className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm">
            CareerMatch © 2025 — All rights reserved.
          </p>
        </div>
      </footer>
    </CompanyLayout>
  );
}