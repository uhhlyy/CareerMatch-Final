import React, { useState, useEffect, useRef } from "react";
import NavbarCompany from "../components/NavbarCompany";

const SWIPE_THRESHOLD = 120;

export default function ViewApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterJobPref, setFilterJobPref] = useState("");
  const [minExpYears, setMinExpYears] = useState("");
  const [maxExpYears, setMaxExpYears] = useState("");
  const [filterEducation, setFilterEducation] = useState(""); // New state for education filter
  const [showFilters, setShowFilters] = useState(false);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const draggingRef = useRef(false);
  const activeCardRef = useRef(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch('http://localhost/CareerMatchFinalV2/CareerMatch-Final/CMBackend/resume_api.php');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched applicants data:', data); // Debug: Check the full array
        console.log('First applicant object:', data[0]); // Debug: Inspect the first item
        setApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, []);

  // Helper to extract numeric years from experience string (e.g., "5 years" -> 5)
  const extractExpYears = (expStr) => {
    const match = expStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Filter applicants based on job preferences, experience years range, and education
  const filteredApplicants = applicants.filter(app => {
    const prefMatch = !filterJobPref.trim() || (Array.isArray(app.JobPreferences) ? app.JobPreferences : [app.JobPreferences || ""]).some(pref => pref.toLowerCase().includes(filterJobPref.toLowerCase()));
    const expYears = extractExpYears(app.Experience || "");
    const minMatch = !minExpYears || expYears >= parseInt(minExpYears);
    const maxMatch = !maxExpYears || expYears <= parseInt(maxExpYears);
    const educationMatch = !filterEducation || app.Education === filterEducation; // Exact match for education
    return prefMatch && minMatch && maxMatch && educationMatch;
  });

  // Reset currentIndex when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filterJobPref, minExpYears, maxExpYears, filterEducation]); // Added filterEducation

  const updateCardPositions = () => {
    const cards = document.querySelectorAll(".swipe-card");
    cards.forEach((card) => {
      const idx = parseInt(card.dataset.index, 10);
      const diff = idx - currentIndex;

      if (diff < 0) {
        card.style.display = "none";
      } else if (diff === 0) {
        card.style.display = "block";
        card.style.transform =
          "translateX(0) rotate(0deg) scale(1)";
        card.style.opacity = "1";
        card.style.zIndex = "15";
      } else if (diff === 1) {
        card.style.display = "block";
        card.style.transform = "scale(0.95) translateY(12px)";
        card.style.opacity = "0.85";
        card.style.zIndex = "10";
      } else {
        card.style.display = "block";
        card.style.transform = "scale(0.90) translateY(22px)";
        card.style.opacity = "0.55";
        card.style.zIndex = "5";
      }

      const accept = card.querySelector(".indicator-accept");
      const decline = card.querySelector(".indicator-decline");
      if (accept) accept.style.opacity = 0;
      if (decline) decline.style.opacity = 0;

      card.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    });
  };

  useEffect(updateCardPositions, [currentIndex, filteredApplicants]);

  /* === DRAG HANDLERS === */
  const handleMove = (clientX) => {
    if (!draggingRef.current) return;

    currentXRef.current = clientX;
    const diff = clientX - startXRef.current;
    const card = activeCardRef.current;

    if (!card) return;

    const rotation = diff / 20;
    card.style.transition = "none";
    card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;

    const accept = card.querySelector(".indicator-accept");
    const decline = card.querySelector(".indicator-decline");

    if (accept) accept.style.opacity = diff > 0 ? Math.min(diff / 150, 1) : 0;
    if (decline) decline.style.opacity = diff < 0 ? Math.min(-diff / 150, 1) : 0;
  };

  const endSwipe = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    const card = activeCardRef.current;
    if (!card) return;

    const diff = currentXRef.current - startXRef.current;
    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";

    if (diff > SWIPE_THRESHOLD) {
      card.style.transform = "translateX(1200px) rotate(30deg)";
      card.style.opacity = 0;
      setTimeout(() => setCurrentIndex((p) => p + 1), 300);
    } else if (diff < -SWIPE_THRESHOLD) {
      card.style.transform = "translateX(-1200px) rotate(-30deg)";
      card.style.opacity = 0;
      setTimeout(() => setCurrentIndex((p) => p + 1), 300);
    } else {
      card.style.transform = "translateX(0) rotate(0deg)";

      const accept = card.querySelector(".indicator-accept");
      const decline = card.querySelector(".indicator-decline");
      if (accept) accept.style.opacity = 0;
      if (decline) decline.style.opacity = 0;
    }

    setTimeout(() => {
      if (activeCardRef.current)
        activeCardRef.current.style.transition = "";
      activeCardRef.current = null;
    }, 350);
  };

  const handlePointerDown = (e, index) => {
    if (index !== currentIndex) return;

    draggingRef.current = true;
    activeCardRef.current = e.currentTarget;

    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;

    const moveHandler = (ev) => handleMove(ev.clientX);
    const upHandler = () => {
      window.removeEventListener("pointermove", moveHandler);
      window.removeEventListener("pointerup", upHandler);
      endSwipe();
    };

    window.addEventListener("pointermove", moveHandler);
    window.addEventListener("pointerup", upHandler);
  };

  /* === TOUCH === */
  const handleTouchStart = (e, index) => {
    if (index !== currentIndex) return;
    draggingRef.current = true;
    activeCardRef.current = e.currentTarget;
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!draggingRef.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => endSwipe();

  const swipeLeft = () => animateSwipe("left");
  const swipeRight = () => animateSwipe("right");

  const animateSwipe = (direction) => {
    const card = document.querySelector(`[data-index="${currentIndex}"]`);
    if (!card) return;

    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";
    card.style.transform =
      direction === "right"
        ? "translateX(1200px) rotate(30deg)"
        : "translateX(-1200px) rotate(-30deg)";
    card.style.opacity = 0;

    setTimeout(() => setCurrentIndex((p) => p + 1), 300);
  };

  const renderCard = (applicant, index) => {
    const initials = applicant.FullName  // Fixed: Use 'FullName'
      ? applicant.FullName.split(" ").map((c) => c[0]).join("")
      : "NA";

    return (
      <div
        key={applicant.ID}  // Fixed: Use 'ID'
        data-index={index}
        onPointerDown={(e) => handlePointerDown(e, index)}
        onTouchStart={(e) => handleTouchStart(e, index)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        className="
          swipe-card absolute inset-0 bg-white shadow-xl border rounded-2xl
          p-6 md:p-8 overflow-y-auto
          transition-all duration-300
        "
      >
        {/* Top Banner */}
        <div className="
          w-full h-40 md:h-48 rounded-xl
          bg-gradient-to-br from-blue-300 to-blue-900
          flex items-center justify-center text-white text-3xl font-bold mb-6
        ">
          {initials}
        </div>

        <div className="text-2xl font-bold text-blue-900 break-words">
          {applicant.FullName || "N/A"}  
        </div>
        <p className="text-gray-600 mb-4 break-words">{applicant.Email || "N/A"}</p> 

        {/* Details */}
        <div className="flex flex-col gap-3 text-left">
          {[
            ["👤", "About Me", applicant.AboutMe || "N/A"],
            ["🎂", "Birthday", applicant.Birthday || "N/A"],
            ["🏙️", "City", applicant.City || "N/A"],
            ["🎓", "Education", applicant.Education || "N/A"],
            ["⚧", "Gender", applicant.Gender || "N/A"],
            ["💼", "Job Preferences", Array.isArray(applicant.JobPreferences) ? applicant.JobPreferences.join(", ") : (applicant.JobPreferences || "N/A")],
            ["🗣️", "Languages", applicant.Languages || "N/A"],
            ["💍", "Marital Status", applicant.MaritalStatus || "N/A"],
            ["📞", "Phone Number", applicant.PhoneNumber || "N/A"],
            ["🛠️", "Skills", applicant.Skills || "N/A"],
            ["🏢", "Experience", applicant.Experience || "N/A"],
            ["⏰", "Summary", applicant.Summary || "N/A"],  // Assuming 'Summary' from DB
          ].map(([icon, label, value], i) => (
            <div
              key={i}
              className="flex gap-2 items-start text-gray-800 break-words"
            >
              <span>{icon}</span>
              <span className="font-medium">{label}:</span>  {/* Show label always */}
              <span>{value}</span>
            </div>
          ))}
        </div>

        {/* Swipe Indicators */}
        <div
          className="
          indicator-accept absolute top-10 right-6 
          opacity-0 pointer-events-none
          px-6 py-3 rounded-xl border-4
          text-green-500 border-green-500 font-extrabold text-3xl
          bg-white/70 backdrop-blur-md rotate-6
        "
        >
          ACCEPT
        </div>

        <div
          className="
          indicator-decline absolute top-10 left-6
          opacity-0 pointer-events-none
          px-6 py-3 rounded-xl border-4
          text-red-500 border-red-500 font-extrabold text-3xl
          bg-white/70 backdrop-blur-md -rotate-6
        "
        >
          DECLINE
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">
        <NavbarCompany />
        <div className="flex flex-col items-center w-full px-4 py-10">
          <p className="text-gray-800 font-medium mb-6">
            Swipe right to accept, left to decline.
          </p>

          {/* Filter Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowFilters(true)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              Open Filters
            </button>
          </div>

          <div className="relative w-full max-w-xl h-[650px]">
            {applicants.length === 0 ? (
              <div className="text-center text-gray-700">Loading applicants...</div>
            ) : currentIndex >= filteredApplicants.length ? (
              <div className="text-center text-gray-700 text-xl font-semibold">
                No more applicants to review!
              </div>
            ) : (
              filteredApplicants.map((app, i) => renderCard(app, i))
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-10 mt-8">
            <button
              onClick={swipeLeft}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-500 text-white text-2xl shadow-lg hover:scale-110 hover:shadow-xl transition"
            >
              ✕
            </button>
            <button
              onClick={swipeRight}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500 text-white text-2xl shadow-lg hover:scale-110 hover:shadow-xl transition"
            >
              ✓
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 p-6 text-gray-400 text-center">
        CareerMatch © 2025 — All rights reserved.
      </footer>

      {/* Filter Popup */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full transition-all duration-500 ease-out"
            style={{
              transform: showFilters ? 'translateY(0)' : 'translateY(20px)',
              opacity: showFilters ? 1 : 0,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="jobPrefFilter" className="block text-gray-700 font-medium mb-2">
                Job Preferences:
              </label>
              <input
                id="jobPrefFilter"
                type="text"
                value={filterJobPref}
                onChange={(e) => setFilterJobPref(e.target.value)}
                placeholder="e.g., Chef, Flight Attendant"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Experience Years Range:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minExpYears}
                  onChange={(e) => setMinExpYears(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={maxExpYears}
                  onChange={(e) => setMaxExpYears(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="educationFilter" className="block text-gray-700 font-medium mb-2">
                Education Level:
              </label>
              <select
                id="educationFilter"
                value={filterEducation}
                onChange={(e) => setFilterEducation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Education Levels</option>
                <option value="High School Graduate">High School Graduate</option>
                <option value="College Undergraduate">College Undergraduate</option>
                <option value="Bachelor’s Degree">Bachelor’s Degree</option>
                <option value="Master’s Degree">Master’s Degree</option>
                <option value="Vocational / TESDA">Vocational / TESDA</option>
                <option value="Bootcamp Graduate">Bootcamp Graduate</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}