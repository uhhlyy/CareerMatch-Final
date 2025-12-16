import React, { useState, useEffect, useRef } from "react";
import SeekerLayout from "../components/SeekerLayout";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  GraduationCap, 
  DollarSign, 
  Briefcase, 
  X, 
  Check, 
  SlidersHorizontal,
  Building2,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const SWIPE_THRESHOLD = 120;

export default function SeekerMainPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterJobPref, setFilterJobPref] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [filterEducationLevel, setFilterEducationLevel] = useState(""); 
  const [showFilters, setShowFilters] = useState(false);
  const [hasResume, setHasResume] = useState(null); 
  const [checkingResume, setCheckingResume] = useState(true);
  const [error, setError] = useState(null);
  const [declinedJobs, setDeclinedJobs] = useState([]);

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

  const filteredJobs = [...jobs.filter(job => {
    const title = job.title || job.Title || "";
    const prefMatch = !filterJobPref || title.toLowerCase().includes(filterJobPref.toLowerCase());
    
    const jobSalary = extractNumber(job.salary || job.Salary || "");
    const minSalMatch = !minSalary || jobSalary >= parseFloat(minSalary);
    const maxSalMatch = !maxSalary || jobSalary <= parseFloat(maxSalary);
    
    const jobExp = extractNumber(job.experience || job.Experience || job.Exp || "");
    const minExpMatch = !minExp || jobExp >= parseFloat(minExp);
    const maxExpMatch = !maxExp || jobExp <= parseFloat(maxExp);
    
    const type = job.type || job.Type || "";
    const typeMatch = selectedJobTypes.length === 0 || selectedJobTypes.includes(type);
    
    const eduLevel = job.educationLevel || job.EducationLevel || "";
    const educationMatch = !filterEducationLevel || eduLevel === filterEducationLevel; 
    
    return prefMatch && minSalMatch && maxSalMatch && minExpMatch && maxExpMatch && typeMatch && educationMatch;
  }), ...declinedJobs];

  useEffect(() => {
    setCurrentIndex(0);
    setDeclinedJobs([]);
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

    if (direction === "left") {
      const jobId = job.id || job.job_id;
      setDeclinedJobs(prev => {
        const exists = prev.some(j => (j.id || j.job_id) === jobId);
        if (!exists) {
          return [...prev, job];
        }
        return prev;
      });
    }

    card.style.transition = "transform 0.4s ease-out, opacity 0.4s ease-out";
    card.style.transform = direction === "right" 
      ? "translateX(1200px) rotate(40deg)" 
      : "translateX(-1200px) rotate(-40deg)";
    card.style.opacity = "0";
    
    setTimeout(() => {
      setCurrentIndex((i) => {
        const nextIndex = i + 1;
        if (nextIndex >= filteredJobs.length && declinedJobs.length > 0) {
          return jobs.length;
        }
        return nextIndex;
      });
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
        className="job-card bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 cursor-grab select-none touch-none"
      >
        <div className="flex flex-col h-full">
          {/* Company Logo/Header */}
          <div className="relative w-full h-40 sm:h-48 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center text-white text-5xl sm:text-6xl font-black shadow-lg overflow-hidden mb-6">
            {(job.Photo || job.photo) ? (
              <img 
                src={`http://localhost/CareerMatch-Final/CMBackend/${job.Photo || job.photo}`} 
                alt="Logo" 
                className="w-full h-full object-cover" 
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  e.target.parentElement.innerHTML = `<div class="text-5xl sm:text-6xl font-black">${initials}</div>`; 
                }} 
              />
            ) : (
              <div className="text-5xl sm:text-6xl font-black">{initials}</div>
            )}
          </div>

          {/* Job Title & Company */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-2">{title}</h2>
            <div className="flex items-center gap-2 text-slate-600">
              <Building2 size={18} strokeWidth={2} />
              <p className="font-semibold text-base sm:text-lg">{company}</p>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-blue-600" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{job.location || job.Location || "Remote"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap size={18} className="text-purple-600" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Education</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{job.educationLevel || job.EducationLevel || "Any"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-green-600" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Experience</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {job.experience || job.Experience || "Entry Level"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase size={18} className="text-orange-600" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Type</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{job.type || job.Type || "Full-Time"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 overflow-hidden mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-slate-900 rounded-full"></span>
              About this role
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
              {job.description || job.Description || "No description provided."}
            </p>
          </div>

          {/* Salary Footer */}
          <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 mb-1">
                Monthly Salary
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">{job.salary || job.Salary || "Negotiable"}</span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full">
                {job.type || job.Type || "Full-Time"}
              </span>
            </div>
          </div>
        </div>

        {/* Swipe Overlays */}
        <div className="swipe-accept absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl opacity-0 pointer-events-none transition-opacity">
          <div className="flex flex-col items-center">
            <Check size={64} className="text-white mb-4" strokeWidth={3} />
            <span className="text-white text-4xl font-black -rotate-12 border-8 border-white px-6 py-3 rounded-2xl shadow-2xl">
              APPLY
            </span>
          </div>
        </div>
        <div className="swipe-decline absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl opacity-0 pointer-events-none transition-opacity">
          <div className="flex flex-col items-center">
            <X size={64} className="text-white mb-4" strokeWidth={3} />
            <span className="text-white text-4xl font-black rotate-12 border-8 border-white px-6 py-3 rounded-2xl shadow-2xl">
              SKIP
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <SeekerLayout>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 p-6">
          <div className="bg-white rounded-3xl p-10 max-w-md border border-red-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={32} className="text-red-600" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold mb-3">Error Occurred</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  if (checkingResume) {
    return (
      <SeekerLayout>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
          <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-6 mx-auto"></div>
            <p className="text-xl font-semibold text-slate-900 flex items-center justify-center gap-2">
              <Sparkles size={20} className="animate-pulse" />
              Loading Opportunities...
            </p>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
      
      <div className="min-h-screen bg-slate-50">
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 flex flex-col items-center py-8 sm:py-12 px-4">
            <div className="w-full max-w-6xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-10">
                <div>
                  <h1 className="animate-fade-up opacity-0 delay-100 text-slate-900 text-3xl sm:text-4xl font-bold mb-2">
                    Discover Jobs
                  </h1>
                  <p className="animate-fade-up opacity-0 delay-100 text-slate-600 text-sm sm:text-base">
                    Swipe right to apply, left to skip
                  </p>
                </div>
                <button 
                  onClick={() => setShowFilters(true)} 
                  className="animate-fade-up opacity-0 delay-100 inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm font-semibold text-sm"
                >
                  <SlidersHorizontal size={18} strokeWidth={2} />
                  Filters
                </button>
              </div>

              {/* Main Content Area with Side Buttons */}
              <div className="animate-fade-up opacity-0 delay-300 relative flex items-center justify-center gap-4 sm:gap-8">
                {/* Decline Button (Left) */}
                {filteredJobs.length > 0 && currentIndex < filteredJobs.length && (
                  <button 
                    onClick={() => animateSwipe("left")} 
                    className="hidden sm:flex w-16 h-16 rounded-full bg-white border-2 border-slate-200 text-red-500 shadow-lg hover:scale-110 hover:border-red-200 hover:shadow-xl active:scale-95 transition-all items-center justify-center group"
                    aria-label="Skip job"
                  >
                    <X size={28} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                  </button>
                )}

                {/* Card Stack Container */}
                <div className="relative w-full max-w-xl h-[600px] sm:h-[700px]">
                  {jobs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                      <Search size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
                      <p className="text-xl font-bold text-slate-900 mb-2">Scanning for Jobs...</p>
                      <p className="text-sm text-slate-500">Adjust your filters if this takes too long.</p>
                    </div>
                  ) : (filteredJobs.length === 0 || (currentIndex >= filteredJobs.length && declinedJobs.length === 0)) ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <Check size={40} className="text-green-600" strokeWidth={2} />
                      </div>
                      <h2 className="text-3xl font-bold mb-3 text-slate-900">All Done!</h2>
                      <p className="text-slate-600 text-base mb-8">You've reviewed all available jobs</p>
                      <button 
                        onClick={() => {
                          setCurrentIndex(0);
                          setDeclinedJobs([]);
                          setMinSalary(""); 
                          setMaxSalary("");
                          setMinExp(""); 
                          setMaxExp("");
                          setFilterJobPref("");
                          setFilterEducationLevel("");
                        }} 
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2"
                      >
                        <RefreshCw size={18} />
                        Reset & View All Jobs
                      </button>
                    </div>
                  ) : (
                    filteredJobs.map((job, idx) => renderCard(job, idx))
                  )}
                </div>

                {/* Accept Button (Right) */}
                {filteredJobs.length > 0 && currentIndex < filteredJobs.length && (
                  <button 
                    onClick={() => animateSwipe("right")} 
                    className="hidden sm:flex w-20 h-20 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl hover:scale-110 hover:shadow-2xl active:scale-95 transition-all items-center justify-center group"
                    aria-label="Apply to job"
                  >
                    <Check size={32} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>

              {/* Mobile Action Buttons */}
              {filteredJobs.length > 0 && currentIndex < filteredJobs.length && (
                <div className="sm:hidden flex justify-center gap-6 mt-8">
                  <button 
                    onClick={() => animateSwipe("left")} 
                    className="w-16 h-16 rounded-full bg-white border-2 border-slate-200 text-red-500 shadow-lg active:scale-95 transition-all flex items-center justify-center"
                  >
                    <X size={28} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => animateSwipe("right")} 
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl active:scale-95 transition-all flex items-center justify-center"
                  >
                    <Check size={32} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg border border-slate-200 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <SlidersHorizontal size={24} strokeWidth={2} className="text-slate-900" />
                  Filters
                </h2>
                <button 
                  onClick={() => setShowFilters(false)} 
                  className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>
              
              <div className="space-y-5">
                {/* Keywords */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Search size={16} className="text-slate-600" />
                    Keywords
                  </label>
                  <input 
                    type="text" 
                    value={filterJobPref} 
                    onChange={(e) => setFilterJobPref(e.target.value)} 
                    placeholder="Developer, Designer, Manager..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>

                {/* Salary Range */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <DollarSign size={16} className="text-slate-600" />
                    Salary Range
                  </label>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minSalary} 
                      onChange={(e) => setMinSalary(e.target.value)} 
                      className="w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxSalary} 
                      onChange={(e) => setMaxSalary(e.target.value)} 
                      className="w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Experience Range */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Clock size={16} className="text-slate-600" />
                    Experience (Years)
                  </label>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minExp} 
                      onChange={(e) => setMinExp(e.target.value)} 
                      className="w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxExp} 
                      onChange={(e) => setMaxExp(e.target.value)} 
                      className="w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>
                
                {/* Education Level */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <GraduationCap size={16} className="text-slate-600" />
                    Education Level
                  </label>
                  <select 
                    value={filterEducationLevel} 
                    onChange={(e) => setFilterEducationLevel(e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
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
                className="w-full mt-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </SeekerLayout>
  );
}