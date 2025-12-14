import React, { useState } from "react";
import NavbarCompany from "../components/NavbarCompany";

export default function JobPosting() {
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
    setFormData({ ...formData, photo: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- CRITICAL LOGIC FIX ---
    const employerId = localStorage.getItem('employer_id') || localStorage.getItem('employerID');
    
    if (!employerId) {
      alert("Session expired. Please log in again.");
      return;
    }

    const formDataToSend = new FormData();
    
    // Force the employer_id into the request
    formDataToSend.append('employer_id', employerId);
    
    // Append your existing form fields
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
      formDataToSend.append('photo', formData.photo);
    }
    // ---------------------------

    try {
      const response = await fetch('http://localhost/CareerMatch-Final/CMBackend/job_post.php', {
        method: 'POST',
        body: formDataToSend, 
      });

      const text = await response.text();
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
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Error saving job: " + error.message);
    }
  };

  return (
    <>
      <NavbarCompany />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 pt-24 pb-14 flex justify-center px-5">
        <main className="w-full max-w-5xl p-10 rounded-3xl bg-white/80 shadow-[0px_20px_40px_rgba(0,0,0,0.25)] border border-white/20 transition-all hover:bg-white/90">
          <h1 className="text-4xl font-extrabold text-center text-blue-900 drop-shadow mb-12 tracking-tight">Post a Job</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full">
            <div className="relative">
              <input id="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 shadow-md outline-none border border-white/40 focus:ring-2 focus:ring-blue-500 peer" placeholder=" " />
              <label htmlFor="jobTitle" className="absolute left-4 top-3 text-gray-600 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1 peer-not-placeholder-shown:top-[-12px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700">Job Title</label>
            </div>

            <div className="relative">
              <input id="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 shadow-md outline-none border border-white/40 focus:ring-2 focus:ring-blue-500 peer" placeholder=" " />
              <label htmlFor="companyName" className="absolute left-4 top-3 text-gray-600 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1 peer-not-placeholder-shown:top-[-12px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700">Company Name</label>
            </div>

            <div className="relative">
              <input id="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 shadow-md outline-none border border-white/40 focus:ring-2 focus:ring-blue-500 peer" placeholder=" " />
              <label htmlFor="location" className="absolute left-4 top-3 text-gray-600 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1 peer-not-placeholder-shown:top-[-12px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700">Location</label>
            </div>

            <div className="relative">
              <input id="salary" value={formData.salary} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 shadow-md outline-none border border-white/40 focus:ring-2 focus:ring-blue-500 peer" placeholder=" " />
              <label htmlFor="salary" className="absolute left-4 top-3 text-gray-600 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1 peer-not-placeholder-shown:top-[-12px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700">Salary Range (in PHP)</label>
            </div>

            <div className="relative">
              <input id="degree" value={formData.degree} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/80 shadow-md outline-none border border-white/40 focus:ring-2 focus:ring-blue-500 peer" placeholder=" " />
              <label htmlFor="degree" className="absolute left-4 top-3 text-gray-600 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1 peer-not-placeholder-shown:top-[-12px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700">Required Degree</label>
            </div>

            <div className="relative">
              <input id="experience" value={formData.experience} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/80 shadow-md outline-none border border-white/40 focus:ring-2 focus:ring-blue-500 peer" placeholder=" " />
              <label htmlFor="experience" className="absolute left-4 top-3 text-gray-600 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1 peer-not-placeholder-shown:top-[-12px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700">Experience</label>
            </div>

            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Job Photo (Optional)</label>
              <input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-3 rounded-xl bg-white/80 shadow-md border border-white/40 focus:ring-2 focus:ring-blue-500" />
              {photoPreview && <div className="mt-2"><img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" /></div>}
            </div>

            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Job Type</label>
              <select id="jobType" value={formData.jobType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/80 shadow-md border border-white/40 focus:ring-2 focus:ring-blue-500">
                <option value="">Select type</option>
                <option>Full-Time</option><option>Part-Time</option><option>Internship</option><option>Remote</option>
              </select>
            </div>

            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Employment Level</label>
              <select id="employmentLevel" value={formData.employmentLevel} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/80 shadow-md border border-white/40 focus:ring-2 focus:ring-blue-500">
                <option value="">Select level</option>
                <option>Entry-level</option><option>Mid-level</option><option>Senior</option><option>Manager</option>
              </select>
            </div>

            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Education Level</label>
              <select id="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/80 shadow-md border border-white/40 focus:ring-2 focus:ring-blue-500">
                <option value="">Select education level</option>
                <option>High School Graduate</option><option>College Undergraduate</option><option>Bachelor’s Degree</option><option>Master’s Degree</option><option>Vocational / TESDA</option><option>Bootcamp Graduate</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 relative">
              <textarea id="description" value={formData.description} onChange={handleChange} placeholder=" " required className="w-full px-4 py-4 rounded-xl h-36 bg-white/80 shadow-md outline-none border border-white/40 focus:ring-2 focus:ring-blue-500 resize-none peer" />
              <label htmlFor="description" className="absolute left-4 top-4 text-gray-600 transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1 peer-not-placeholder-shown:top-[-12px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700">Job Description</label>
            </div>

            <button type="submit" className="col-span-1 md:col-span-2 mt-4 py-3 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold shadow-lg transition-all hover:scale-105">Post Job</button>
          </form>
        </main>
      </div>
      <footer className="bg-gray-900 p-6 text-gray-400 text-center">CareerMatch © 2025 — All rights reserved.</footer>
    </>
  );
}