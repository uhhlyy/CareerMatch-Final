import React, { useState, useEffect, useRef } from "react";
import NavbarSeeker from "../components/NavbarSeeker";
import { useNavigate } from "react-router-dom";

const SWIPE_THRESHOLD = 120;

export default function SeekerMainPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterJobPref, setFilterJobPref] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  
  // NEW STATES ADDED
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [filterEducationLevel, setFilterEducationLevel] = useState(""); 
  const [showFilters, setShowFilters] = useState(false);
  
  const [hasResume, setHasResume] = useState(null); 
  const [checkingResume, setCheckingResume] = useState(true);
  const [error, setError] = useState(null);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const draggingRef = useRef(false);
  const activeCardRef = useRef(null);

  // 1. Check Seeker Resume Status
  useEffect(() => {
    const checkResumeStatus = async () => {
      const seekerId = localStorage.getItem('seeker_id') || localStorage.getItem('user_id');
      
      if (!seekerId) {
        navigate("/LoginSeeker");
        return;
      }

      try {
        const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/check_resume.php?seeker_id=${seekerId}`);
        const data = await response.json();

        if (data.hasResume) {
          setHasResume(true);
          setCheckingResume(false);
        } else {
          setHasResume(false);
          setTimeout(() => navigate("/ResumeBuilder"), 500);
        }
      } catch (err) {
        console.error("Resume check failed:", err);
        setError("Connection failed. Ensure XAMPP/Apache is running.");
        setCheckingResume(false);
      }
    };

    checkResumeStatus();
  }, [navigate]);

  // 2. Fetch Jobs
  useEffect(() => {
    if (hasResume === true) {
      const loadJobs = async () => {
        const seekerId = localStorage.getItem('seeker_id') || localStorage.getItem('user_id');
        try {
          const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_all_jobs_seeker.php?seeker_id=${seekerId}`);
          const data = await response.json();
          
          console.log("Raw Jobs Data:", data);

          if (data.success && Array.isArray(data.jobs)) {
            setJobs(data.jobs);
          } else if (Array.isArray(data)) {
            setJobs(data);
          } else if (data.error) {
            setError(`Backend Error: ${data.error}`);
          }
        } catch (err) {
          console.error("Fetch Jobs Error:", err);
          setError("Failed to load jobs. Please check console.");
        }
      };
      loadJobs();
    }
  }, [hasResume]);

  // 3. Helpers & Filter Logic

  const extractNumber = (val) => {
    if (!val) return 0;
    const match = val.toString().match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  };

  const filteredJobs = jobs.filter(job => {
    const title = job.title || job.Title || "";
    const prefMatch = !filterJobPref || title.toLowerCase().includes(filterJobPref.toLowerCase());
    
    // Salary Filter Logic
    const jobSalary = extractNumber(job.salary || job.Salary || "");
    const minSalMatch = !minSalary || jobSalary >= parseFloat(minSalary);
    const maxSalMatch = !maxSalary || jobSalary <= parseFloat(maxSalary);
    
    // NEW: Experience Filter Logic
    const jobExp = extractNumber(job.experience || job.Experience || job.Exp || "");
    const minExpMatch = !minExp || jobExp >= parseFloat(minExp);
    const maxExpMatch = !maxExp || jobExp <= parseFloat(maxExp);
    
    const type = job.type || job.Type || "";
    const typeMatch = selectedJobTypes.length === 0 || selectedJobTypes.includes(type);
    
    const eduLevel = job.educationLevel || job.EducationLevel || "";
    const educationMatch = !filterEducationLevel || eduLevel === filterEducationLevel; 
    
    return prefMatch && minSalMatch && maxSalMatch && minExpMatch && maxExpMatch && typeMatch && educationMatch;
  });

  // UPDATED Dependency Array to include new Experience filters
  useEffect(() => {
    setCurrentIndex(0);
  }, [filterJobPref, minSalary, maxSalary, minExp, maxExp, selectedJobTypes, filterEducationLevel]);

  // 4. Swipe Logic
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
      card.style.transition = "transform 0.3s ease, opacity 0.3s ease";

      if (diff < 0) {
        card.style.display = "none";
      } else if (diff === 0) {
        card.style.display = "block";
        card.style.transform = "translateX(0) rotate(0deg) scale(1)";
        card.style.opacity = "1";
        card.style.zIndex = "10";
      } else if (diff === 1) {
        card.style.display = "block";
        card.style.transform = "scale(0.95) translateY(12px)";
        card.style.opacity = "0.85";
        card.style.zIndex = "9";
      } else if (diff === 2) {
        card.style.display = "block";
        card.style.transform = "scale(0.9) translateY(24px)";
        card.style.opacity = "0.6";
        card.style.zIndex = "8";
      } else {
        card.style.display = "none";
      }
    });
  };

  const handleSwipeAction = async (job, actionType) => {
    const seekerId = localStorage.getItem('seeker_id') || localStorage.getItem('user_id');
    const jobId = job.id || job.job_id;
    const empId = job.employer_id || job.EmployerID || job.Employer_id;

    try {
      await fetch('http://localhost/CareerMatch-Final/CMBackend/apply.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          seeker_id: parseInt(seekerId), 
          job_id: parseInt(jobId),
          employer_id: parseInt(empId),
          action: actionType 
        })
      });
    } catch (err) {
      console.error("Swipe Action Failed:", err);
    }
  };

  const handlePointerDown = (e, index) => {
    if (index !== currentIndex) return;
    draggingRef.current = true;
    activeCardRef.current = e.currentTarget;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    
    const moveHandler = (ev) => {
      if (!draggingRef.current) return;
      currentXRef.current = ev.clientX;
      const diff = ev.clientX - startXRef.current;
      const card = activeCardRef.current;
      if (!card) return;
      
      const rotation = diff / 25;
      card.style.transition = "none";
      card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
      
      const accept = card.querySelector(".swipe-accept");
      const decline = card.querySelector(".swipe-decline");
      if (accept) accept.style.opacity = diff > 0 ? Math.min(diff / 150, 1) : 0;
      if (decline) decline.style.opacity = diff < 0 ? Math.min(-diff / 150, 1) : 0;
    };

    const upHandler = () => {
      window.removeEventListener("pointermove", moveHandler);
      window.removeEventListener("pointerup", upHandler);
      
      if (!draggingRef.current) return;
      draggingRef.current = false;
      
      const diff = currentXRef.current - startXRef.current;
      if (diff > SWIPE_THRESHOLD) {
        animateSwipe("right");
      } else if (diff < -SWIPE_THRESHOLD) {
        animateSwipe("left");
      } else {
        if (activeCardRef.current) {
          activeCardRef.current.style.transition = "transform 0.3s ease";
          activeCardRef.current.style.transform = "translateX(0) rotate(0deg)";
          const accept = activeCardRef.current.querySelector(".swipe-accept");
          const decline = activeCardRef.current.querySelector(".swipe-decline");
          if (accept) accept.style.opacity = 0;
          if (decline) decline.style.opacity = 0;
        }
      }
    };
    
    window.addEventListener("pointermove", moveHandler);
    window.addEventListener("pointerup", upHandler);
  };

  const animateSwipe = (direction) => {
    const job = filteredJobs[currentIndex];
    const card = document.querySelector(`.job-card[data-index='${currentIndex}']`);
    if (!job || !card) return;
    
    handleSwipeAction(job, direction === "right" ? 'apply' : 'decline');

    card.style.transition = "transform 0.4s ease-out, opacity 0.4s ease-out";
    card.style.transform = direction === "right" 
      ? "translateX(1200px) rotate(40deg)" 
      : "translateX(-1200px) rotate(-40deg)";
    card.style.opacity = "0";
    
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
    }, 300);
  };

  // 5. Render Components
  const renderCard = (job, index) => {
    const title = job.title || job.Title || "Job Opportunity";
    const company = job.company || job.Company || "Hiring Company";
    const initials = company.split(" ").map(c => c[0]).join("").toUpperCase().substring(0, 2);

    return (
      <div 
        key={job.id || index} 
        data-index={index} 
        onPointerDown={(e) => handlePointerDown(e, index)} 
        className="job-card bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 cursor-grab select-none touch-none"
      >
        <div className="flex flex-col h-full">
          <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-white text-5xl font-black shadow-inner overflow-hidden mb-6">
            {(job.Photo || job.photo) ? (
              <img 
                src={`http://localhost/CareerMatch-Final/CMBackend/${job.Photo || job.photo}`} 
                alt="Logo" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = initials; }} 
              />
            ) : initials}
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">{title}</h2>
            <p className="text-blue-600 font-bold text-lg">{company}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
              <span className="text-xl">📍</span>
              <span className="text-xs font-bold truncate">{job.location || job.Location || "Not Specified"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
              <span className="text-xl">🎓</span>
              <span className="text-xs font-bold truncate">{job.educationLevel || job.EducationLevel || "Open"}</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Job Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              {job.description || job.Description || "No description provided."}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase">Monthly Salary</span>
              <span className="text-2xl font-black text-blue-600">{job.salary || job.Salary || "Negotiable"}</span>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
              {job.type || job.Type || "Full-Time"}
            </span>
          </div>
        </div>

        {/* Swipe Overlays */}
        <div className="swipe-accept absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-3xl opacity-0 pointer-events-none transition-opacity">
          <span className="text-white text-6xl font-black -rotate-12 border-8 border-white px-8 py-4 rounded-2xl">APPLY</span>
        </div>
        <div className="swipe-decline absolute inset-0 flex items-center justify-center bg-red-500/90 rounded-3xl opacity-0 pointer-events-none transition-opacity">
          <span className="text-white text-6xl font-black rotate-12 border-8 border-white px-8 py-4 rounded-2xl">SKIP</span>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-red-900 flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-3xl font-black mb-4">Error Occurred</h1>
        <p className="bg-red-800 p-4 rounded-2xl max-w-md">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-8 px-10 py-3 bg-white text-red-900 rounded-xl font-black shadow-xl">TRY AGAIN</button>
      </div>
    );
  }

  if (checkingResume) {
    return (
      <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 border-4 border-blue-400 border-t-white rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-black tracking-widest uppercase">Fetching Talent...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-900 flex">
      <NavbarSeeker />
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center py-10">
          <div className="w-full max-w-xl px-6">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="animate-fade-up opacity-0 delay-100 text-white text-4xl font-black tracking-tighter">Discover</h1>
                <p className="animate-fade-up opacity-0 delay-100 text-blue-100 text-sm opacity-80">Find your next career match</p>
              </div>
              <button 
                onClick={() => setShowFilters(true)} 
                className="animate-fade-up opacity-0 delay-100 p-3 bg-white/10 text-white border border-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/20 transition shadow-xl"
              >
                ⚙️ Filters
              </button>
            </div>

            <div className="animate-fade-up opacity-0 delay-300 relative h-[650px] mb-12">
              {jobs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-white p-10 bg-white/5 rounded-3xl border-2 border-dashed border-white/20">
                  <p className="text-2xl font-bold">Scanning for Jobs...</p>
                  <p className="text-sm opacity-60 mt-2">Adjust your filters if this takes too long.</p>
                </div>
              ) : filteredJobs.length === 0 || currentIndex >= filteredJobs.length ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-white p-12 bg-white/10 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-2xl">
                  <span className="text-7xl mb-6 animate-bounce">✨</span>
                  <h2 className="text-3xl font-black mb-2">You're All Set!</h2>
                  <p className="opacity-70 text-lg">No more jobs match your current criteria.</p>
                  <button 
                    onClick={() => {
                      setCurrentIndex(0);
                      setMinSalary(""); setMaxSalary("");
                      setMinExp(""); setMaxExp("");
                      setFilterJobPref("");
                    }} 
                    className="mt-10 px-8 py-3 bg-white text-blue-900 rounded-xl font-black hover:scale-105 transition active:scale-95"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              ) : (
                filteredJobs.map((job, idx) => renderCard(job, idx))
              )}
            </div>

            {filteredJobs.length > 0 && currentIndex < filteredJobs.length && (
              <div className="flex justify-center gap-12">
                <button 
                  onClick={() => animateSwipe("left")} 
                  className="w-20 h-20 rounded-full bg-white text-red-500 text-3xl shadow-2xl hover:scale-110 active:scale-90 transition flex items-center justify-center"
                >
                  ✕
                </button>
                <button 
                  onClick={() => animateSwipe("right")} 
                  className="w-20 h-20 rounded-full bg-blue-600 text-white text-3xl shadow-2xl hover:scale-110 active:scale-90 transition flex items-center justify-center border-4 border-white/20"
                >
                  ✓
                </button>
              </div>
            )}
          </div>
        </main>
        <footer className="p-6 text-white/30 text-[10px] font-black tracking-[0.3em] text-center uppercase">
          CareerMatch Matching Engine © 2025
        </footer>
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-md border border-white/20 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Filter</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-300 hover:text-gray-500 text-4xl">×</button>
            </div>
            
            <div className="space-y-6">
              {/* Keywords */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Keywords</label>
                <input 
                  type="text" 
                  value={filterJobPref} 
                  onChange={(e) => setFilterJobPref(e.target.value)} 
                  placeholder="Developer, Designer..." 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                />
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Salary Range (Monthly)</label>
                <div className="flex gap-3">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minSalary} 
                    onChange={(e) => setMinSalary(e.target.value)} 
                    className="w-1/2 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxSalary} 
                    onChange={(e) => setMaxSalary(e.target.value)} 
                    className="w-1/2 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>
              </div>

              {/* Experience Range */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Experience (Years)</label>
                <div className="flex gap-3">
                  <input 
                    type="number" 
                    placeholder="Min Yrs" 
                    value={minExp} 
                    onChange={(e) => setMinExp(e.target.value)} 
                    className="w-1/2 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                  <input 
                    type="number" 
                    placeholder="Max Yrs" 
                    value={maxExp} 
                    onChange={(e) => setMaxExp(e.target.value)} 
                    className="w-1/2 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>
              </div>
              
              {/* Education Level */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Minimum Education</label>
                <select 
                  value={filterEducationLevel} 
                  onChange={(e) => setFilterEducationLevel(e.target.value)} 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold appearance-none cursor-pointer"
                >
                  <option value="">Any Level</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => setShowFilters(false)} 
              className="w-full mt-10 py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition active:scale-95"
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}