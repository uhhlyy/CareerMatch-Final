import React, { useState } from "react";
import NavbarCompany from "../components/NavbarCompany";

export default function JobPosting() {
  console.log("JobPost component is rendering");  // For debugging

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
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting job post", formData);
    const jobData = {
      title: formData.jobTitle,
      company: formData.companyName,
      location: formData.location,
      type: formData.jobType,
      salary: formData.salary,
      description: formData.description,
      degree: formData.degree,
      experience: formData.experience,
      employmentLevel: formData.employmentLevel,
    };
    try {
      const response = await fetch('http://localhost/CareerMatchFinalV2/CareerMatch-Final/CMBackend/job_post.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      const text = await response.text(); // Get raw response
      console.log('Response status:', response.status);
      console.log('Response text:', text);

      if (!response.ok) {
        alert(`HTTP Error: ${response.status} - ${text}`);
        return;
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (jsonError) {
        console.error('Invalid JSON:', text);
        alert('Server returned invalid response: ' + text);
        return;
      }

      if (result.success) {
        alert("Job successfully posted!");
        // Reset all form fields to initial empty state
        setFormData({
          jobTitle: "",
          companyName: "",
          location: "",
          jobType: "",
          salary: "",
          description: "",
          degree: "",
          experience: "",
          employmentLevel: "",
        });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error saving job: " + error.message);
    }
  };

  return (
    <>
      <NavbarCompany />

      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 pt-24 pb-14 flex justify-center px-5">
        {/* Container */}
        <main
          className="
            w-full max-w-5xl p-10 rounded-3xl 
            bg-white/80 shadow-[0px_20px_40px_rgba(0,0,0,0.25)]
            border border-white/20 transition-all hover:bg-white/90
          "
        >
          <h1 className="text-4xl font-extrabold text-center text-blue-900 drop-shadow mb-12 tracking-tight">
            Post a Job
          </h1>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full"
          >
            {/* Job Title Input (now regular input with floating label) */}
            <div className="relative">
              <input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-3 rounded-xl bg-white/80 
                  text-gray-900 shadow-md outline-none border border-white/40 
                  focus:ring-2 focus:ring-blue-500 peer
                "
                placeholder=" "
              />
              <label
                htmlFor="jobTitle"
                className="
                  absolute left-4 top-3 text-gray-600 transition-all pointer-events-none
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                  peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1
                  peer-not-placeholder-shown:top-[-10px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700
                "
              >
                Job Title
              </label>
            </div>

            {/* Other FLOATING LABEL INPUTS */}
            {[
              ["companyName", "Company Name"],
              ["location", "Location"],
              ["salary", "Salary Range (in PHP)"],
              ["degree", "Required Degree"],
              ["experience", "Experience"],
            ].map(([id, label]) => (
              <div className="relative" key={id}>
                <input
                  id={id}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                  className="
                    w-full px-4 py-3 rounded-xl bg-white/80 
                    text-gray-900 shadow-md outline-none border border-white/40 
                    focus:ring-2 focus:ring-blue-500 peer
                  "
                  placeholder=" "
                />
                <label
                  htmlFor={id}
                  className="
                    absolute left-4 top-3 text-gray-600 transition-all pointer-events-none
                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                    peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1
                    peer-not-placeholder-shown:top-[-10px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700
                  "
                >
                  {label}
                </label>
              </div>
            ))}

            {/* SELECT — JOB TYPE */}
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Job Type
              </label>
              <select
                id="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="
                  w-full px-4 py-3 rounded-xl bg-white/80 shadow-md 
                  outline-none border border-white/40 focus:ring-2 focus:ring-blue-500
                "
              >
                <option value="">Select type</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
                <option>Remote</option>
              </select>
            </div>

            {/* SELECT — EMPLOYMENT LEVEL */}
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Employment Level
              </label>
              <select
                id="employmentLevel"
                value={formData.employmentLevel}
                onChange={handleChange}
                className="
                  w-full px-4 py-3 rounded-xl bg-white/80 shadow-md 
                  outline-none border border-white/40 focus:ring-2 focus:ring-blue-500
                "
              >
                <option value="">Select level</option>
                <option>Entry-level</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Manager</option>
              </select>
            </div>

            {/* TEXTAREA */}
            <div className="col-span-1 md:col-span-2 relative">
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder=" "
                required
                className="
                  w-full px-4 py-4 rounded-xl h-36 bg-white/80 
                  shadow-md outline-none border border-white/40 focus:ring-2 
                  focus:ring-blue-500 resize-none peer
                "
              />
              <label
                htmlFor="description"
                className="
                  absolute left-4 top-4 text-gray-600 transition-all pointer-events-none
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                  peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-700 bg-white px-1
                  peer-not-placeholder-shown:top-[-10px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-700
                "
              >
                Job Description
              </label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="
                col-span-1 md:col-span-2 mt-4 py-3 rounded-full 
                bg-gradient-to-r from-blue-700 to-blue-500 
                text-white font-bold shadow-lg tracking-wide
                transition-all hover:scale-105 hover:shadow-2xl
              "
            >
              Post Job
            </button>
          </form>
        </main>
      </div>

      <footer className="bg-gray-900 p-6 text-gray-400 text-center">
        CareerMatch © 2025 — All rights reserved.
      </footer>
    </>
  );
}