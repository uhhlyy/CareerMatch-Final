import React, { useState } from "react";
import { db } from "../pages/Firebase";
import { collection, addDoc } from "firebase/firestore";
import NavbarSeeker from "../components/NavbarSeeker";

export default function ResumeBuilder() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    maritalStatus: "",
    birthday: "",
    phoneNumber: "",
    city: "",
    gender: "",
    aboutMe: "",
    skills: "",
    workExperience: "",
    education: "",
    languages: "",
    jobPreferences: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "resumes"), {
        ...formData,
        submittedAt: new Date(),
      });

      alert("Resume submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        maritalStatus: "",
        birthday: "",
        phoneNumber: "",
        city: "",
        gender: "",
        aboutMe: "",
        skills: "",
        workExperience: "",
        education: "",
        languages: "",
        jobPreferences: "",
      });
    } catch (error) {
      console.error("Error submitting resume:", error);
      alert("Error submitting resume.");
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-600 p-6 flex justify-center">
        <NavbarSeeker />
      <main className="w-full max-w-6xl">
        <h1 className="text-4xl font-semibold text-white text-center mb-10 drop-shadow-md">
          Resume Builder
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* LEFT COLUMN */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 space-y-6">

            {/* Upload Image */}
            <div className="text-center">
              <label
                htmlFor="userLogo"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow hover:shadow-lg transition cursor-pointer"
              >
                Upload Image
              </label>
              <input type="file" id="userLogo" className="hidden" />
            </div>

            {/* Inputs */}
            {[
              ["fullName", "Full Name", "text"],
              ["email", "Email Address", "email"],
              ["maritalStatus", "Marital Status", "text"],
              ["birthday", "Birthday", "date"],
              ["phoneNumber", "Mobile Number", "text"],
              ["city", "City", "text"],
              ["gender", "Gender", "text"],
            ].map(([id, label, type]) => (
              <div key={id}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  id={id}
                  type={type}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 space-y-6">
            {[
              ["aboutMe", "About Me"],
              ["skills", "Professional Skills"],
              ["workExperience", "Work Experience"],
              ["education", "Education"],
              ["languages", "Languages"],
              ["jobPreferences", "Job Preferences"],
            ].map(([id, label]) => (
              <div key={id}>
                <label className="block font-medium mb-1">{label}</label>
                <textarea
                  id={id}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-white border border-gray-300 min-h-[90px] focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              </div>
            ))}

            {/* Save Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition"
              >
                Save Resume
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
