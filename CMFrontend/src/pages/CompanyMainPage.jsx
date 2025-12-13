import React, { useState, useEffect, useRef } from "react";
import NavbarCompany from "../components/NavbarCompany";

const SWIPE_THRESHOLD = 120;

export default function CompanyMainPage() {
  const [applicants, setApplicants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [employerId, setEmployerId] = useState(null);
  const [filterJobPref, setFilterJobPref] = useState("");
  const [minExpYears, setMinExpYears] = useState("");
  const [maxExpYears, setMaxExpYears] = useState("");
  const [filterEducation, setFilterEducation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [filterEducationLevel, setFilterEducationLevel] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const draggingRef = useRef(false);
  const activeCardRef = useRef(null);

  // Function to update applicant status on backend
  const updateApplicantStatus = async (applicantId, employerId, newDecision) => {
    const payload = { 
      applicant_id: applicantId, 
      employer_id: employerId,   
      decision: newDecision      
    };
    
    console.log('Sending payload:', payload); 
    try {
      const response = await fetch('http://localhost/CareerMatch-Final/CMBackend/update_applicant_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response status:', response.status, 'Body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Update Result:', result);
    } catch (error) {
      console.error('Error updating applicant status:', error);
    }
  };

  // Fetch applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch('http://localhost/CareerMatch-Final/CMBackend/get_seeker_application.php');
        
        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const processedData = data.map(app => {
            let prefs = app.JobPreferences;
            if (typeof prefs === "string") {
              try {
                prefs = JSON.parse(prefs);
              } catch (e) {
                prefs = prefs.split(",").map(p => p.trim());
              }
            }
            return { ...app, JobPreferences: prefs };
          });
          setApplicants(processedData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setApplicants([]);
      }
    };
    fetchApplicants();
  }, []);

  // Employer Auth logic
  useEffect(() => {
    const storedEmployerId = localStorage.getItem('employer_id') || localStorage.getItem('employerID');
    if (!storedEmployerId) {
      alert('Please log in first.');
      window.location.href = '/login'; 
    } else {
      setEmployerId(storedEmployerId);
    }
  }, []);

  // Reset index when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filterJobPref, minExpYears, maxExpYears, filterEducationLevel, selectedJobTypes]);

  // Extract numeric experience
  const extractExpYears = (expStr) => {
    const match = expStr?.toString().match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Handle job type checkbox changes
  const handleJobTypeChange = (type) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Apply filters
  const filteredApplicants = (Array.isArray(applicants) ? applicants : []).filter((app) => {
    const prefMatch =
      !filterJobPref.trim() ||
      (Array.isArray(app.JobPreferences)
        ? app.JobPreferences
        : [app.JobPreferences || ""]
      ).some((pref) =>
        pref.toLowerCase().includes(filterJobPref.toLowerCase())
      );

    const expYears = extractExpYears(app.Experience || "");
    const minMatch = !minExpYears || expYears >= parseInt(minExpYears);
    const maxMatch = !maxExpYears || expYears <= parseInt(maxExpYears);

    const educationMatch =
      !filterEducationLevel || app.Education === filterEducationLevel;

    const jobTypeMatch =
      selectedJobTypes.length === 0 ||
      (Array.isArray(app.JobTypes)
        ? app.JobTypes.some((type) => selectedJobTypes.includes(type))
        : selectedJobTypes.includes(app.JobTypes));

    return prefMatch && minMatch && maxMatch && educationMatch && jobTypeMatch;
  });

  // Update visible card stack positions
  const updateCardPositions = () => {
    const cards = document.querySelectorAll(".swipe-card");

    cards.forEach((card) => {
      const idx = parseInt(card.dataset.index, 10);
      const diff = idx - currentIndex;

      if (diff < 0) {
        card.style.display = "none";
        return;
      }

      card.style.display = "block";
      const accept = card.querySelector(".indicator-accept");
      const decline = card.querySelector(".indicator-decline");
      if (accept) accept.style.opacity = 0;
      if (decline) decline.style.opacity = 0;

      card.style.transition = "transform .3s ease, opacity .3s ease";
      if (diff === 0) {
        card.style.transform = "translateX(0) rotate(0) scale(1)";
        card.style.zIndex = 15;
        card.style.opacity = 1;
      } else if (diff === 1) {
        card.style.transform = "scale(.95) translateY(12px)";
        card.style.zIndex = 10;
        card.style.opacity = 0.85;
      } else {
        card.style.transform = "scale(.9) translateY(22px)";
        card.style.zIndex = 5;
        card.style.opacity = 0.55;
      }
    });
  };

  useEffect(updateCardPositions, [currentIndex, filteredApplicants]);

  // Handle swipe movement
  const handleMove = (clientX) => {
    if (!draggingRef.current) return;

    currentXRef.current = clientX;
    const diff = clientX - startXRef.current;
    const card = activeCardRef.current;

    if (card) {
      card.style.transition = "none";
      card.style.transform = `translateX(${diff}px) rotate(${diff / 20}deg)`;

      const accept = card.querySelector(".indicator-accept");
      const decline = card.querySelector(".indicator-decline");

      if (accept) accept.style.opacity = diff > 0 ? Math.min(diff / 150, 1) : 0;
      if (decline) decline.style.opacity = diff < 0 ? Math.min(-diff / 150, 1) : 0;
    }
  };

  // Finish swipe
  const endSwipe = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const card = activeCardRef.current;
    if (!card) return;
    const diff = currentXRef.current - startXRef.current;
    const currentApp = filteredApplicants[currentIndex]; 

    card.style.transition = "transform .35s ease, opacity .35s ease";

    // Detect ID vs id
    const targetId = currentApp.ID || currentApp.id;

    if (diff > SWIPE_THRESHOLD) {
      card.style.transform = "translateX(1200px) rotate(30deg)";
      card.style.opacity = 0;
      updateApplicantStatus(targetId, employerId, "accepted"); 
      setTimeout(() => setCurrentIndex((p) => p + 1), 300);
    } else if (diff < -SWIPE_THRESHOLD) {
      card.style.transform = "translateX(-1200px) rotate(-30deg)";
      card.style.opacity = 0;
      updateApplicantStatus(targetId, employerId, "denied"); 
      setTimeout(() => setCurrentIndex((p) => p + 1), 300);
    } else {
      card.style.transform = "translateX(0) rotate(0)";
    }
    setTimeout(() => {
      if (activeCardRef.current) activeCardRef.current.style.transition = "";
      activeCardRef.current = null;
    }, 350);
  };

  const handlePointerDown = (e, index) => {
    if (index !== currentIndex) return;
    draggingRef.current = true;
    activeCardRef.current = e.currentTarget;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;

    const move = (ev) => handleMove(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      endSwipe();
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const handleTouchStart = (e, index) => {
    if (index !== currentIndex) return;
    draggingRef.current = true;
    activeCardRef.current = e.currentTarget;
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => draggingRef.current && handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => endSwipe();

  const animateSwipe = (dir) => {
    const card = document.querySelector(`[data-index="${currentIndex}"]`);
    if (!card) return;
    const currentApp = filteredApplicants[currentIndex];
    const targetId = currentApp.ID || currentApp.id;

    card.style.transition = "transform .35s ease, opacity .35s ease";
    card.style.transform =
      dir === "right"
        ? "translateX(1200px) rotate(30deg)"
        : "translateX(-1200px) rotate(-30deg)";
    card.style.opacity = 0;
    
    updateApplicantStatus(targetId, employerId, dir === "right" ? "accepted" : "denied");
    setTimeout(() => setCurrentIndex((p) => p + 1), 300);
  };

  const renderCard = (app, index) => {
    const initials = app.FullName
      ? app.FullName.split(" ").map((c) => c[0]).join("")
      : "NA";

    return (
      <div
        key={app.ID || app.id}
        data-index={index}
        onPointerDown={(e) => handlePointerDown(e, index)}
        onTouchStart={(e) => handleTouchStart(e, index)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="swipe-card absolute inset-0 bg-white shadow-xl border rounded-2xl p-6 md:p-8 overflow-y-auto transition-all duration-300"
      >
        <div className="w-40 h-40 md:w-48 md:h-48 aspect-square rounded-full bg-gradient-to-br from-blue-300 to-blue-900 flex items-center justify-center text-white text-3xl font-bold mb-6 overflow-hidden mx-auto">
          {app.Photo ? (
            <img
              src={`http://localhost/CareerMatch-Final/CMBackend/${app.Photo}`}
              alt={`${app.FullName}'s Photo`}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = initials;
              }}
            />
          ) : (
            initials
          )}
        </div>

        <div className="text-2xl font-bold text-blue-900 text-center">
          {app.FullName || "N/A"}
        </div>
        <p className="text-gray-600 mb-4 text-center">{app.Email || "N/A"}</p>

        <div className="flex flex-col gap-3 text-left">
          {[
            ["👤", "About Me", app.AboutMe],
            ["🎂", "Birthday", app.Birthday],
            ["🏙️", "City", app.City],
            ["🎓", "Education", app.Education],
            ["⚧", "Gender", app.Gender],
            ["💼", "Job Preferences",
              Array.isArray(app.JobPreferences)
                ? app.JobPreferences.join(", ")
                : app.JobPreferences
            ],
            ["🗣️", "Languages", app.Languages],
            ["💍", "Marital Status", app.MaritalStatus],
            ["📞", "Phone Number", app.PhoneNumber],
            ["🛠️", "Skills", app.Skills],
            ["🏢", "Experience", app.Experience],
            ["⏰", "Summary", app.Summary],
          ].map(([icon, label, value], i) => (
            <div key={i} className="flex gap-2 items-start text-gray-800">
              <span>{icon}</span>
              <span className="font-medium">{label}:</span>
              <span className="break-words">{value || "N/A"}</span>
            </div>
          ))}
        </div>

        <div className="indicator-accept absolute top-10 right-6 opacity-0 pointer-events-none px-6 py-3 rounded-xl border-4 text-green-500 border-green-500 font-extrabold text-3xl bg-white/70 backdrop-blur-md rotate-6">
          ACCEPT
        </div>
        <div className="indicator-decline absolute top-10 left-6 opacity-0 pointer-events-none px-6 py-3 rounded-xl border-4 text-red-500 border-red-500 font-extrabold text-3xl bg-white/70 backdrop-blur-md -rotate-6">
          DECLINE
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-900 flex">
      <NavbarCompany />

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex justify-center items-center py-10">
          <div className="w-full max-w-3xl px-6">
            <p className="text-center text-white text-lg mb-6">
              Swipe right to accept, left to decline.
            </p>

            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
              >
                Open Filters
              </button>
            </div>

            <div className="relative h-[750px] mb-10">
              {applicants.length === 0 ? (
                <p className="text-white text-center">Loading applicants...</p>
              ) : currentIndex >= filteredApplicants.length ? (
                <div className="text-center p-10 bg-white/20 rounded-2xl backdrop-blur-md text-white">
                    <h2 className="text-2xl font-bold">No more applicants!</h2>
                    <p>Try clearing your filters to see more results.</p>
                </div>
              ) : (
                filteredApplicants.map((app, idx) => renderCard(app, idx))
              )}
            </div>

            <div className="flex justify-center gap-16">
              <button
                onClick={() => animateSwipe("left")}
                className="w-16 h-16 rounded-full bg-red-500 text-white text-3xl shadow-lg hover:scale-110 transition"
              >
                ✕
              </button>

              <button
                onClick={() => animateSwipe("right")}
                className="w-16 h-16 rounded-full bg-green-500 text-white text-3xl shadow-lg hover:scale-110 transition"
              >
                ✓
              </button>
            </div>
          </div>
        </div>

        <footer className="bg-gray-900 p-6 text-gray-400 text-center mt-auto">
          CareerMatch © 2025 — All rights reserved.
        </footer>
      </div>

      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Job Preference:</label>
              <input
                type="text"
                value={filterJobPref}
                onChange={(e) => setFilterJobPref(e.target.value)}
                placeholder="e.g., Chef"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Education Level:</label>
              <select
                value={filterEducationLevel}
                onChange={(e) => setFilterEducationLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option>High School Graduate</option>
                <option>College Undergraduate</option>
                <option>Bachelor’s Degree</option>
                <option>Master’s Degree</option>
              </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Exp (Years):</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={minExpYears} onChange={(e) => setMinExpYears(e.target.value)} className="w-1/2 p-2 border rounded"/>
                    <input type="number" placeholder="Max" value={maxExpYears} onChange={(e) => setMaxExpYears(e.target.value)} className="w-1/2 p-2 border rounded"/>
                </div>
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}