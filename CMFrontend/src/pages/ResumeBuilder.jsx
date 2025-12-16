import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SeekerLayout from "../components/SeekerLayout";
import { User, Briefcase, GraduationCap } from "lucide-react";

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: localStorage.getItem('seekerEmail') || "", 
    maritalStatus: "",
    birthday: "",
    phoneNumber: "",
    city: "",
    gender: "",
    summary: "",
    aboutMe: "",
    skills: "",
    workExperience: "",
    education: "",
    languages: "",
    jobPreferences: "", 
    otherJob: "",
    photo: null, 
  });

  // PROTECT THIS PAGE: Redirect if user is not logged in
  useEffect(() => {
    const seekerID = localStorage.getItem('seeker_id');
    if (!seekerID) {
      alert("Session expired or User ID not found. Please log in again.");
      navigate("/LoginSeeker");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        e.target.value = null;
        return;
      }
      
      setFormData({ ...formData, photo: file });
      
      // Create preview
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

    // Check ID before sending
    const seekerID = localStorage.getItem('seeker_id'); 
    
    if (!seekerID) {
      alert("Session expired. Please log in again.");
      navigate("/LoginSeeker");
      return;
    }

    setIsSubmitting(true);

    try {
      const combinedJobPreferences = formData.jobPreferences
        ? formData.jobPreferences.split(',').map(pref => pref.trim()).filter(pref => pref)
        : [];
      
      if (formData.otherJob) {
        combinedJobPreferences.push(`Other: ${formData.otherJob}`);
      }

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('seekerID', seekerID);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('education', formData.education);
      formDataToSend.append('experience', formData.workExperience);
      formDataToSend.append('skills', formData.skills);
      formDataToSend.append('aboutMe', formData.aboutMe);
      formDataToSend.append('maritalStatus', formData.maritalStatus);
      formDataToSend.append('birthday', formData.birthday);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('languages', formData.languages);
      formDataToSend.append('jobPreferences', JSON.stringify(combinedJobPreferences));
      
      // Append photo file if exists
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo, formData.photo.name);
        console.log('Uploading photo:', formData.photo.name);
      }

      // Log FormData contents for debugging
      console.log('Sending data to server...');
      for (let pair of formDataToSend.entries()) {
        if (pair[0] === 'photo') {
          console.log(pair[0] + ': [File Object]', pair[1].name);
        } else {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }

      const response = await fetch(
        "http://localhost/CareerMatch-Final/CMBackend/resume_api.php",
        {
          method: "POST",
          body: formDataToSend,
          // DO NOT set Content-Type header - browser will set it automatically with boundary
        }
      );

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok && result.success) {
        alert("Resume saved successfully!" + (result.photoPath ? "\nPhoto uploaded: " + result.photoPath : ""));
        
        // Optional: Redirect to profile or resume view page
        // navigate("/profile");
      } else {
        throw new Error(result.error || result.message || "Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting resume:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false); 
    }
  };

  const sections = [
    { 
      id: 'personal', 
      label: 'Personal Information', 
      icon: User 
    },
    { 
      id: 'professional', 
      label: 'Professional Details', 
      icon: Briefcase 
    },
    { 
      id: 'experience', 
      label: 'Experience & Education', 
      icon: GraduationCap 
    },
  ];

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
              Resume Builder
            </h1>
          </div>

          {/* Progress Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              {sections.map((section, index) => {
                const IconComponent = section.icon;
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
                    <IconComponent size={24} strokeWidth={2} />
                    <span className="font-medium hidden sm:inline">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            {activeSection === 'personal' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                {/* Photo Upload Card */}
                <div className="lg:col-span-1">
                  <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sticky top-8">
                    <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-6">
                      Profile Photo
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="photo-upload-area relative">
                        {photoPreview ? (
                          <div className="relative group">
                            <img 
                              src={photoPreview} 
                              alt="Profile Preview" 
                              className="w-full aspect-square object-cover rounded-xl border-4 border-slate-100"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-xl flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                Change Photo
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-slate-500 text-sm font-medium">No photo selected</p>
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
                        <p className="font-medium">Requirements:</p>
                        <ul className="list-disc list-inside space-y-0.5 ml-2">
                          <li>Professional headshot recommended</li>
                          <li>Square format (1:1 ratio)</li>
                          <li>JPG, PNG, GIF, or WebP</li>
                          <li>Maximum size: 5MB</li>
                          <li>Minimum: 400x400px</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Details Form */}
                <div className="lg:col-span-2">
                  <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-8">
                      Personal Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="fullName" className="label-text block mb-2">
                          Full Legal Name *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="email" className="label-text block mb-2">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full px-4 py-3 rounded-lg bg-slate-100 border-1.5 border-slate-200 text-slate-500 cursor-not-allowed outline-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label htmlFor="phoneNumber" className="label-text block mb-2">
                          Mobile Number *
                        </label>
                        <input
                          id="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          placeholder="+63 XXX XXX XXXX"
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="birthday" className="label-text block mb-2">
                          Date of Birth *
                        </label>
                        <input
                          id="birthday"
                          type="date"
                          value={formData.birthday}
                          onChange={handleChange}
                          required
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="gender" className="label-text block mb-2">
                          Gender *
                        </label>
                        <select
                          id="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="maritalStatus" className="label-text block mb-2">
                          Marital Status *
                        </label>
                        <select
                          id="maritalStatus"
                          value={formData.maritalStatus}
                          onChange={handleChange}
                          required
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        >
                          <option value="">Select status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Separated">Separated</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="city" className="label-text block mb-2">
                          Current City *
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          placeholder="City, Province/Region"
                          className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Details Section */}
            {activeSection === 'professional' && (
              <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-8">
                    Professional Profile
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="label-text block mb-2">
                        Professional Title / Headline *
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Senior Software Engineer | Marketing Specialist"
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-1">This appears at the top of your resume</p>
                    </div>

                    <div>
                      <label htmlFor="summary" className="label-text block mb-2">
                        Professional Summary *
                      </label>
                      <textarea
                        id="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                        rows="6"
                        placeholder="Write a compelling summary of your professional background, key achievements, and career objectives..."
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none resize-none"
                      />
                      <p className="text-xs text-slate-500 mt-1">3-5 sentences highlighting your expertise and value proposition</p>
                    </div>

                    <div>
                      <label htmlFor="skills" className="label-text block mb-2">
                        Core Skills & Competencies *
                      </label>
                      <textarea
                        id="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="List your key skills, separated by commas or line breaks&#10;e.g., Project Management, Data Analysis, Python, Leadership..."
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="languages" className="label-text block mb-2">
                        Languages *
                      </label>
                      <textarea
                        id="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="e.g., English (Native), Filipino (Fluent), Mandarin (Conversational)"
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="jobPreferences" className="label-text block mb-2">
                        Job Preferences & Target Roles
                      </label>
                      <textarea
                        id="jobPreferences"
                        value={formData.jobPreferences}
                        onChange={handleChange}
                        rows="4"
                        placeholder="List job titles or roles you're interested in, separated by commas&#10;e.g., Software Engineer, Full Stack Developer, Technical Lead"
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience & Education Section */}
            {activeSection === 'experience' && (
              <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-8">
                    Professional Experience
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="workExperience" className="label-text block mb-2">
                        Work Experience *
                      </label>
                      <textarea
                        id="workExperience"
                        value={formData.workExperience}
                        onChange={handleChange}
                        required
                        rows="10"
                        placeholder="Describe your work history in detail:&#10;&#10;Company Name | Job Title | Duration&#10;• Key responsibility or achievement&#10;• Another accomplishment with metrics&#10;• Impact you made in the role&#10;&#10;Include 2-3 most recent positions"
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none resize-none font-mono text-sm"
                      />
                      <p className="text-xs text-slate-500 mt-1">Focus on achievements and quantifiable results</p>
                    </div>
                  </div>
                </div>

                <div className="section-card bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h3 className="heading-font text-2xl font-semibold text-slate-900 mb-8">
                    Educational Background
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="education" className="label-text block mb-2">
                        Highest Educational Attainment *
                      </label>
                      <select
                        id="education"
                        value={formData.education}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-4 py-3 rounded-lg bg-white outline-none"
                      >
                        <option value="">Select your highest education level</option>
                        <option value="High School Graduate">High School Graduate</option>
                        <option value="College Undergraduate">College Undergraduate</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate/PhD">Doctorate/PhD</option>
                        <option value="Vocational / TESDA">Vocational / TESDA Certificate</option>
                      </select>
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
                        Saving Resume...
                      </span>
                    ) : (
                      'Save Resume'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {activeSection !== 'experience' && (
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
    </SeekerLayout>
  );
}