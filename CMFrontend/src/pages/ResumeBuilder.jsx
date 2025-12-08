import React, { useState } from "react";
import NavbarSeeker from "../components/NavbarSeeker";
import Select from "react-select"; // just import normally

const jobOptions = [
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'Web Developer', label: 'Web Developer' },
  { value: 'Mobile App Developer', label: 'Mobile App Developer' },
  { value: 'UI/UX Designer', label: 'UI/UX Designer' },
  { value: 'Graphic Designer', label: 'Graphic Designer' },
  { value: 'Network Engineer', label: 'Network Engineer' },
  { value: 'Cybersecurity Analyst', label: 'Cybersecurity Analyst' },
  { value: 'Database Administrator', label: 'Database Administrator' },
  { value: 'Systems Analyst', label: 'Systems Analyst' },
  { value: 'Cloud Engineer', label: 'Cloud Engineer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'AI/ML Engineer', label: 'AI/ML Engineer' },
  { value: 'Game Developer', label: 'Game Developer' },
  { value: 'Computer Hardware Engineer', label: 'Computer Hardware Engineer' },
  { value: 'IT Project Manager', label: 'IT Project Manager' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer' },
  { value: 'Embedded Systems Engineer', label: 'Embedded Systems Engineer' },
  { value: 'Robotics Engineer', label: 'Robotics Engineer' },
  { value: 'Digital Marketing Specialist', label: 'Digital Marketing Specialist' },
  { value: 'Content Writer', label: 'Content Writer' },
  { value: 'Social Media Manager', label: 'Social Media Manager' },
  { value: 'SEO Specialist', label: 'SEO Specialist' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Quality Assurance Tester', label: 'Quality Assurance Tester' },
  { value: 'Customer Support Specialist', label: 'Customer Support Specialist' },
  { value: 'Sales Executive', label: 'Sales Executive' },
  { value: 'Business Analyst', label: 'Business Analyst' },
  { value: 'Financial Analyst', label: 'Financial Analyst' },
  { value: 'Accountant', label: 'Accountant' },
  { value: 'Auditor', label: 'Auditor' },
  { value: 'Human Resources Specialist', label: 'Human Resources Specialist' },
  { value: 'Recruiter', label: 'Recruiter' },
  { value: 'Nurse', label: 'Nurse' },
  { value: 'Doctor', label: 'Doctor' },
  { value: 'Pharmacist', label: 'Pharmacist' },
  { value: 'Physiotherapist', label: 'Physiotherapist' },
  { value: 'Occupational Therapist', label: 'Occupational Therapist' },
  { value: 'Dietitian/Nutritionist', label: 'Dietitian/Nutritionist' },
  { value: 'Laboratory Technician', label: 'Laboratory Technician' },
  { value: 'Radiologist', label: 'Radiologist' },
  { value: 'Surgeon', label: 'Surgeon' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'University Professor', label: 'University Professor' },
  { value: 'Lawyer', label: 'Lawyer' },
  { value: 'Paralegal', label: 'Paralegal' },
  { value: 'Judge', label: 'Judge' },
  { value: 'Architect', label: 'Architect' },
  { value: 'Civil Engineer', label: 'Civil Engineer' },
  { value: 'Mechanical Engineer', label: 'Mechanical Engineer' },
  { value: 'Electrical Engineer', label: 'Electrical Engineer' },
  { value: 'Chemical Engineer', label: 'Chemical Engineer' },
  { value: 'Environmental Engineer', label: 'Environmental Engineer' },
  { value: 'Pilot', label: 'Pilot' },
  { value: 'Flight Attendant', label: 'Flight Attendant' },
  { value: 'Police Officer', label: 'Police Officer' },
  { value: 'Firefighter', label: 'Firefighter' },
  { value: 'Journalist', label: 'Journalist' },
  { value: 'Photographer', label: 'Photographer' },
  { value: 'Chef', label: 'Chef' },
  { value: 'Event Planner', label: 'Event Planner' },
  { value: 'Interior Designer', label: 'Interior Designer' },
  { value: 'Fashion Designer', label: 'Fashion Designer' },
  { value: 'Makeup Artist', label: 'Makeup Artist' },
  { value: 'Actor/Actress', label: 'Actor/Actress' },
  { value: 'Musician', label: 'Musician' },
  { value: 'Singer', label: 'Singer' },
  { value: 'Dancer', label: 'Dancer' },
  { value: 'Film Director', label: 'Film Director' },
  { value: 'Producer', label: 'Producer' },
  { value: 'Editor', label: 'Editor' },
  { value: 'Animator', label: 'Animator' },
  { value: 'Illustrator', label: 'Illustrator' },
  { value: 'Translator', label: 'Translator' },
  { value: 'Interpreter', label: 'Interpreter' },
  { value: 'Librarian', label: 'Librarian' },
  { value: 'Researcher', label: 'Researcher' },
  { value: 'Scientist', label: 'Scientist' },
  { value: 'Biologist', label: 'Biologist' },
  { value: 'Chemist', label: 'Chemist' },
  { value: 'Physicist', label: 'Physicist' },
  { value: 'Mathematician', label: 'Mathematician' },
  { value: 'Statistician', label: 'Statistician' },
  { value: 'Economist', label: 'Economist' },
  { value: 'Psychologist', label: 'Psychologist' },
  { value: 'Counselor', label: 'Counselor' },
  { value: 'Social Worker', label: 'Social Worker' },
  { value: 'Public Relations Specialist', label: 'Public Relations Specialist' },
  { value: 'Marketing Manager', label: 'Marketing Manager' },
  { value: 'Brand Manager', label: 'Brand Manager' },
  { value: 'Supply Chain Manager', label: 'Supply Chain Manager' },
  { value: 'Logistics Coordinator', label: 'Logistics Coordinator' },
  { value: 'Operations Manager', label: 'Operations Manager' },
  { value: 'Entrepreneur', label: 'Entrepreneur' },
  { value: 'Consultant', label: 'Consultant' },
  { value: 'Real Estate Agent', label: 'Real Estate Agent' },
  { value: 'Insurance Agent', label: 'Insurance Agent' },
  { value: 'Banker', label: 'Banker' },
  { value: 'Investment Analyst', label: 'Investment Analyst' },
  { value: 'Fund Manager', label: 'Fund Manager' },
  { value: 'IT Support Specialist', label: 'IT Support Specialist' },
  { value: 'Help Desk Technician', label: 'Help Desk Technician' },
  { value: 'Technical Writer', label: 'Technical Writer' },
  { value: 'E-commerce Specialist', label: 'E-commerce Specialist' },
  { value: 'Copywriter', label: 'Copywriter' },
  { value: 'Digital Illustrator', label: 'Digital Illustrator' },
  { value: 'Voice Actor', label: 'Voice Actor' },
  { value: 'Sound Engineer', label: 'Sound Engineer' },
  { value: 'Video Editor', label: 'Video Editor' },
  { value: 'Broadcast Journalist', label: 'Broadcast Journalist' },
  { value: 'News Anchor', label: 'News Anchor' },
  { value: 'Radio DJ', label: 'Radio DJ' },
  { value: 'Public Speaker', label: 'Public Speaker' },
  { value: 'Tour Guide', label: 'Tour Guide' },
  { value: 'Travel Agent', label: 'Travel Agent' },
  { value: 'Hotel Manager', label: 'Hotel Manager' },
  { value: 'Restaurant Manager', label: 'Restaurant Manager' },
  { value: 'Bartender', label: 'Bartender' },
  { value: 'Waiter/Waitress', label: 'Waiter/Waitress' },
  { value: 'Barista', label: 'Barista' },
  { value: 'Personal Trainer', label: 'Personal Trainer' },
  { value: 'Yoga Instructor', label: 'Yoga Instructor' },
  { value: 'Fitness Coach', label: 'Fitness Coach' },
  { value: 'Life Coach', label: 'Life Coach' },
  { value: 'Nutrition Coach', label: 'Nutrition Coach' },
  { value: 'Realtor', label: 'Realtor' },
  { value: 'Construction Worker', label: 'Construction Worker' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Plumber', label: 'Plumber' },
  { value: 'Carpenter', label: 'Carpenter' },
  { value: 'Welder', label: 'Welder' },
  { value: 'Machinist', label: 'Machinist' },
  { value: 'Pilot Instructor', label: 'Pilot Instructor' },
  { value: 'Air Traffic Controller', label: 'Air Traffic Controller' },
  { value: 'Security Guard', label: 'Security Guard' },
  { value: 'Customs Officer', label: 'Customs Officer' },
  { value: 'Detective', label: 'Detective' },
  { value: 'Paramedic', label: 'Paramedic' },
  { value: 'EMT (Emergency Medical Technician)', label: 'EMT (Emergency Medical Technician)' },
  { value: 'Veterinarian', label: 'Veterinarian' },
  { value: 'Animal Trainer', label: 'Animal Trainer' },
  { value: 'Zookeeper', label: 'Zookeeper' },
  { value: 'Farm Manager', label: 'Farm Manager' },
  { value: 'Agricultural Scientist', label: 'Agricultural Scientist' },
  { value: 'Horticulturist', label: 'Horticulturist' },
  { value: 'Environmental Scientist', label: 'Environmental Scientist' },
  { value: 'Conservationist', label: 'Conservationist' },
  { value: 'Renewable Energy Engineer', label: 'Renewable Energy Engineer' },
  { value: 'Automotive Engineer', label: 'Automotive Engineer' },
  { value: 'Truck Driver', label: 'Truck Driver' },
];

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
    jobPreferences: [],
    otherJob: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleJobPreferencesChange = (selectedOptions) => {
    setFormData({
      ...formData,
      jobPreferences: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const seekerID = 1; // Replace with actual SeekerID
      const combinedJobPreferences = [
        ...formData.jobPreferences,
        ...(formData.otherJob ? [`Other: ${formData.otherJob}`] : []),
      ];

      const response = await fetch(
        "http://localhost/CareerMatch/CareerMatch-Final/CMBackend/resume_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seekerID,
            fullName: formData.fullName,
            email: formData.email,
            summary: formData.aboutMe,
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
        jobPreferences: [],
        otherJob: "",
      });
    } catch (error) {
      console.error("Error submitting resume:", error);
      alert("Error submitting resume.");
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

            {/* Job Preferences */}
            <div>
              <label className="block font-medium mb-1">Job Preferences</label>
              <Select
                isMulti
                options={jobOptions}
                value={jobOptions.filter((option) =>
                  formData.jobPreferences.includes(option.value)
                )}
                onChange={handleJobPreferencesChange}
                placeholder="Search and select jobs..."
                className="w-full"
              />
            </div>

            {/* Other Job Input */}
            <div>
              <label className="block font-medium mb-1">Other Job (if not in list)</label>
              <input
                id="otherJob"
                type="text"
                value={formData.otherJob}
                onChange={handleChange}
                placeholder="Enter custom job title..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
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
