import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSeeker from "../components/NavbarSeeker";

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  
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
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await fetch(
        "http://localhost/CareerMatch-Final/CMBackend/resume_api.php",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Resume saved successfully!");
      } else {
        throw new Error(result.error || "Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting resume:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-600 p-6 flex justify-center">
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

            <div>
              <label className="block font-medium mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-gray-200 border border-gray-300 cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Profile Photo</label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              {photoPreview && (
                <div className="mt-2 text-center">
                  <img src={photoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-full border-2 border-blue-500 mx-auto" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 space-y-6">
            {[
              ["title", "Job Title / Headline"],
              ["summary", "Professional Summary"],
              ["skills", "Professional Skills"],
              ["workExperience", "Work Experience (Description)"],
              ["languages", "Languages"],
            ].map(([id, label]) => (
              <div key={id}>
                <label className="block font-medium mb-1">{label}</label>
                <textarea
                  id={id}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-white border border-gray-300 min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              </div>
            ))}

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
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Job Preferences</label>
              <textarea
                id="jobPreferences"
                value={formData.jobPreferences}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white border border-gray-300 min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Software Engineer, Data Scientist..."
              />  
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-full font-bold text-white transition-all shadow-lg ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }`}
              >
                {isSubmitting ? "Saving Resume..." : "Save Resume"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}