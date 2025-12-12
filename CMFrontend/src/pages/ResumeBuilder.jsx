import React, { useState } from "react";
import NavbarSeeker from "../components/NavbarSeeker";

export default function ResumeBuilder() {
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
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
    jobPreferences: "", // Changed to string
    otherJob: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const seekerID = 1; // Replace with actual SeekerID
      const combinedJobPreferences = formData.jobPreferences
        ? formData.jobPreferences.split(',').map(pref => pref.trim()).filter(pref => pref)
        : [];
      if (formData.otherJob) {
        combinedJobPreferences.push(`Other: ${formData.otherJob}`);
      }

      const response = await fetch(
        "http://localhost/CareerMatch-Final/CMBackend/resume_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seekerID,
            fullName: formData.fullName,
            email: formData.email,
            title: formData.title,
            summary: formData.summary,
            education: formData.education,
            experience: formData.workExperience,
            skills: formData.skills,
            aboutMe: formData.aboutMe,
            maritalStatus: formData.maritalStatus,
            birthday: formData.birthday,
            phoneNumber: formData.phoneNumber,
            city: formData.city,
            gender: formData.gender,
            languages: formData.languages,
            jobPreferences: combinedJobPreferences,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit");
      alert("Resume submitted successfully!");
      setFormData({
        title: "",
        fullName: "",
        email: "",
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
        jobPreferences: "", // Reset to empty string
        otherJob: "",
      });
    } catch (error) {
      console.error("Error submitting resume:", error);
      alert("Error submitting resume.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-200 to-blue-600 p-6 flex justify-center">
      <NavbarSeeker />
      <main className="w-full max-w-4xl mt-10">
        <h1 className="text-4xl font-semibold text-white text-center mb-10 drop-shadow-md">
          Resume Builder
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 space-y-6">
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
              ["summary", "Professional Summary"],
              ["aboutMe", "About Me"],
              ["skills", "Professional Skills"],
              ["workExperience", "Work Experience (in Years)"],
              ["languages", "Languages"],
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

            {/* Education Dropdown */}
            <div>
              <label className="block font-medium mb-1">Education</label>
              <select
                id="education"
                value={formData.education}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Select Education Level</option>
                <option value="High School Graduate">High School Graduate</option>
                <option value="College Undergraduate">College Undergraduate</option>
                <option value="Bachelor’s Degree">Bachelor’s Degree</option>
                <option value="Master’s Degree">Master’s Degree</option>
                <option value="Vocational / TESDA">Vocational / TESDA</option>
                <option value="Bootcamp Graduate">Bootcamp Graduate</option>
              </select>
            </div>

            {/* Job Preferences (now a textarea) */}
            <div>
              <label className="block font-medium mb-1">Job Preferences</label>
              <textarea
                id="jobPreferences"
                value={formData.jobPreferences}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white border border-gray-300 min-h-[90px] focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
                placeholder="Enter job preferences, (e.g., Software Engineer, Data Scientist)..."
              />  
            </div>

         

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