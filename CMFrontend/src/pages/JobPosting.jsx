import React, { useState } from "react";
import NavbarCompany from "../components/NavbarCompany";

import { db } from "./Firebase";
import { collection, addDoc } from "firebase/firestore";

export default function JobPost() {
  const [logo, setLogo] = useState("");
  const [preview, setPreview] = useState("");
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

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
      setLogo("");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      logo,
      title: formData.jobTitle,
      company: formData.companyName,
      location: formData.location,
      type: formData.jobType,
      salary: formData.salary,
      description: formData.description,
      degree: formData.degree,
      experience: formData.experience,
      employmentLevel: formData.employmentLevel,
      datePosted: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "jobPosts"), jobData);
      alert("Job successfully posted!");

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
      setPreview("");
      setLogo("");
    } catch (error) {
      console.error(error);
      alert("Error saving job.");
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
            w-full max-w-5xl p-10 rounded-3xl backdrop-blur-2xl 
            bg-white/30 shadow-[0px_20px_40px_rgba(0,0,0,0.25)]
            border border-white/20 transition-all hover:bg-white/40
          "
        >
          <h1 className="text-4xl font-extrabold text-center text-blue-900 drop-shadow mb-12 tracking-tight">
            Post a Job
          </h1>

          <div className="flex flex-col md:flex-row gap-12">
            {/* Upload Logo */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <div
                className="
                  w-44 h-44 rounded-3xl bg-white/40 border border-white/20 
                  backdrop-blur-xl shadow-lg overflow-hidden flex justify-center items-center 
                  text-white font-semibold tracking-wide transition-all
                  hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]
                "
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Logo Preview"
                )}
              </div>

              <label
                htmlFor="companyLogo"
                className="
                  mt-5 px-6 py-2 rounded-full cursor-pointer
                  bg-gradient-to-r from-blue-600 to-blue-500 text-white 
                  font-semibold shadow-lg text-sm tracking-wide
                  transition-all hover:scale-105 hover:shadow-xl
                "
              >
                Upload Logo
              </label>

              <input
                id="companyLogo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full"
            >
              {/* FLOATING LABEL INPUT */}
              {[
                ["jobTitle", "Job Title"],
                ["companyName", "Company Name"],
                ["location", "Location"],
                ["salary", "Salary Range"],
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
                      w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur 
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
                      peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-700 bg-white/80 px-2
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
                    w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur shadow-md 
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
                    w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur shadow-md 
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
                    w-full px-4 py-4 rounded-xl h-36 bg-white/80 backdrop-blur 
                    shadow-md outline-none border border-white/40 focus:ring-2 
                    focus:ring-blue-500 resize-none peer
                  "
                />
                <label
                  htmlFor="description"
                  className="
                    absolute left-4 top-3 text-gray-600 transition-all pointer-events-none
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                    peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-700 bg-white/80 px-2
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
          </div>
        </main>
      </div>

      <footer className="bg-gray-900 p-6 text-gray-400 text-center">
        CareerMatch © 2025 — All rights reserved.
      </footer>
    </>
  );
}
