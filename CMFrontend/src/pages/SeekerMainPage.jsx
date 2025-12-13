import React, { useState, useEffect, useRef } from "react";
import NavbarSeeker from "../components/NavbarSeeker";

const SWIPE_THRESHOLD = 120;

export default function SeekerMainPage() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterJobPref, setFilterJobPref] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [filterEducationLevel, setFilterEducationLevel] = useState(""); // New filter
  const [showFilters, setShowFilters] = useState(false);

  // Swipe refs
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const draggingRef = useRef(false);
  const activeCardRef = useRef(null);

  // Load jobs from PHP/MySQL instead of Firebase
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch('http://localhost/CareerMatch-Final/CMBackend/get_jobs.php');
        const data = await response.json();
        if (data.success) {
          setJobs(data.jobs);
        } else {
          console.error('Error fetching jobs:', data.error);
        }
      } catch (err) {
        console.error("Error loading jobs:", err);
      }
    };

    loadJobs();
  }, []);

  // Helper to extract numeric salary from string (e.g., "$50,000" -> 50000)
  const extractSalaryNumber = (salaryStr) => {
    const match = salaryStr.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  };

  // Filter jobs based on job preferences, salary range, job types, and education level
  const filteredJobs = jobs.filter(job => {
    const prefMatch = !filterJobPref || job.title.toLowerCase().includes(filterJobPref.toLowerCase());
    const jobSalary = extractSalaryNumber(job.salary || "");
    const minMatch = !minSalary || jobSalary >= parseFloat(minSalary);
    const maxMatch = !maxSalary || jobSalary <= parseFloat(maxSalary);
    const typeMatch = selectedJobTypes.length === 0 || selectedJobTypes.includes(job.type);
    const educationMatch = !filterEducationLevel || job.educationLevel === filterEducationLevel; // New filter
    return prefMatch && minMatch && maxMatch && typeMatch && educationMatch;
  });

  // Reset currentIndex when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filterJobPref, minSalary, maxSalary, selectedJobTypes, filterEducationLevel]); // Added new filter

  // Update card stack visual layout
  useEffect(() => {
    updateCardPositions();
  }, [currentIndex, filteredJobs]);

  const updateCardPositions = () => {
    const cards = document.querySelectorAll(".job-card");

    cards.forEach((card) => {
      const idx = Number(card.dataset.index);
      const diff = idx - currentIndex;

      card.style.position = "absolute";
      card.style.inset = "0";
      card.style.display = diff < 0 ? "none" : "block";

      if (diff === 0) {
        card.style.transform = "translateX(0) rotate(0deg) scale(1)";
        card.style.opacity = "1";
        card.style.zIndex = "10";
      } else if (diff === 1) {
        card.style.transform = "scale(0.95) translateY(10px)";
        card.style.opacity = "0.85";
        card.style.zIndex = "9";
      } else {
        card.style.transform = "scale(0.9) translateY(20px)";
        card.style.opacity = "0.6";
        card.style.zIndex = "8";
      }

      card.style.transition = "transform 0.3s ease, opacity 0.3s ease";

      const accept = card.querySelector(".swipe-accept");
      const decline = card.querySelector(".swipe-decline");
      if (accept) accept.style.opacity = 0;
      if (decline) decline.style.opacity = 0;
    });
  };

  // Handle swipe motion
  const handleMove = (clientX) => {
    if (!draggingRef.current) return;

    currentXRef.current = clientX;

    const diff = clientX - startXRef.current;
    const card = activeCardRef.current;

    if (!card) return;

    const rotation = diff / 20;

    card.style.transition = "none";
    card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;

    const accept = card.querySelector(".swipe-accept");
    const decline = card.querySelector(".swipe-decline");

    if (accept) accept.style.opacity = diff > 0 ? Math.min(diff / 150, 1) : 0;
    if (decline) decline.style.opacity = diff < 0 ? Math.min(-diff / 150, 1) : 0;
  };

  // When swipe ends
  const endSwipe = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    const card = activeCardRef.current;
    if (!card) return;

    const diff = currentXRef.current - startXRef.current;

    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";

    const job = filteredJobs[currentIndex];
    const isLast = currentIndex === filteredJobs.length - 1;
    const threshold = isLast ? 50 : SWIPE_THRESHOLD;

    if (diff > threshold) {
      // Right swipe
      card.style.transform = "translateX(1200px) rotate(30deg)";
      card.style.opacity = "0";
      setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    } else if (diff < -threshold) {
      // Left swipe
      card.style.transform = "translateX(-1200px) rotate(-30deg)";
      card.style.opacity = "0";
      setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    } else {
      // Reset card
      card.style.transform = "translateX(0) rotate(0deg)";
      const a = card.querySelector(".swipe-accept");
      const d = card.querySelector(".swipe-decline");
      if (a) a.style.opacity = 0;
      if (d) d.style.opacity = 0;
    }

    setTimeout(() => {
      if (activeCardRef.current)
        activeCardRef.current.style.transition = "";
      activeCardRef.current = null;
    }, 350);
  };

  // Pointer down event
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

  // Button-triggered swipe
  const animateSwipe = (direction) => {
    const card = document.querySelector(`[data-index="${currentIndex}"]`);
    if (!card) return;

    const job = filteredJobs[currentIndex];
    if (!job) return;

    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";
    card.style.transform =
      direction === "right"
        ? "translateX(1200px) rotate(30deg)"
        : "translateX(-1200px) rotate(-30deg)";
    card.style.opacity = "0";

    setTimeout(() => setCurrentIndex((i) => i + 1), 300);
  };

  // Handle job type checkbox change
  const handleJobTypeChange = (type) => {
    setSelectedJobTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Render job card
  const renderCard = (job, index) => {
    const initials = job.company
      ? job.company.split(" ").map((c) => c[0]).join("").toUpperCase()
      : "CM";

    return (
      <div
        key={index}
        data-index={index}
        onPointerDown={(e) => handlePointerDown(e, index)}
        className="job-card bg-white rounded-2xl shadow-xl border p-8 cursor-grab"
      >
        {/* Photo or Initials Placeholder */}
        <div className="w-full h-52 rounded-xl bg-linear-to-br from-blue-300 to-blue-900 flex items-center justify-center text-white text-3xl font-bold shadow-md overflow-hidden mb-5">
          {job.Photo ? (
            <img
              src={`http://localhost/CareerMatch-Final/CMBackend/${job.Photo}`}
              alt={`${job.company} Logo`}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = initials; // Fallback to initials on error
              }}
            />
          ) : (
            initials
          )}
        </div>

        <div className="text-2xl font-bold text-gray-800">{job.title}</div>
        <div className="text-gray-500 text-sm mb-4">{job.company}</div>

        <div className="space-y-2 text-gray-700">
          <p>📍 {job.location}</p>
          <p>💼 {job.type}</p>
          <p>🎓 {job.degree || "Any"}</p>
          <p>🕒 {job.experience || "Not Specified"}</p>
          <p>⚡ {job.employmentLevel || "N/A"}</p>
        </div>

        <div className="text-xl font-bold text-blue-600 mt-3">
          {job.salary || "Not specified"}
        </div>

        <div className="text-gray-600 mt-3 leading-relaxed">
          {job.description}
        </div>

        {/* Swipe Indicators */}
        <div className="swipe-accept absolute top-10 right-10 text-green-500 border-4 border-green-500 text-5xl font-black px-6 py-4 bg-white/80 backdrop-blur-md rounded-lg opacity-0 rotate-6 pointer-events-none">
          APPLY
        </div>

        <div className="swipe-decline absolute top-10 left-10 text-red-500 border-4 border-red-500 text-5xl font-black px-6 py-4 bg-white/80 backdrop-blur-md rounded-lg opacity-0 -rotate-6 pointer-events-none">
          DECLINE
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-300 to-blue-900 flex">
      <NavbarSeeker />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex justify-center items-center py-10">
          <div className="w-full max-w-3xl px-6">
            <p className="text-center text-white text-lg mb-6">
              Swipe right to apply, left to decline.
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

            <div className="relative h-[750px] mb-10">
              {jobs.length === 0 ? (
                <p className="text-white text-center">Loading jobs...</p>
              ) : currentIndex >= filteredJobs.length ? (
                <p className="text-white text-center text-xl">
                  No more jobs!
                </p>
              ) : (
                filteredJobs.map((job, idx) => renderCard(job, idx))
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

        <footer className="bg-gray-900 p-6 text-gray-400 text-center">
          CareerMatch © 2025 — All rights reserved.
        </footer>
      </div>

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
                Salary Range:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Job Types:
              </label>
              <div className="space-y-2">
                {["Full-Time", "Part-Time", "Internship", "Remote"].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes(type)}
                      onChange={() => handleJobTypeChange(type)}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* New Education Level Filter */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Required Education Level:
              </label>
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
                <option>Vocational / TESDA</option>
                <option>Bootcamp Graduate</option>
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
    </div>
  );
}