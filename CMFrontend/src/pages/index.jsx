import React, { useState, useEffect } from "react";
import videobuilding from '../videos/videobuilding.mp4';
import Hero2Img from '../images/Hero2Img.png';
import Footer from '../components/Footer';
import MarqueeTestimonials from '../components/MarqueeTestimonials';

export default function Index() {
  const [counts, setCounts] = useState({ jobs: 0, employers: 0, employed: 0 });

  useEffect(() => {
    // 1. Fetch live data from PHP
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost/CareerMatch-Final/CMBackend/get_stats.php");
        const data = await response.json();
        if (data.success) {
          setCounts({
            jobs: data.jobs,
            employers: data.employers,
            employed: data.employed
          });
        }
      } catch (error) {
        console.error("Error fetching live stats:", error);
      }
    };

    fetchStats();

    // 2. Scroll Reveal Animation Logic
    const revealElements = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100; // Trigger when 100px from bottom

        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };

    window.addEventListener("scroll", revealElements);
    revealElements(); // Initial check

    return () => window.removeEventListener("scroll", revealElements);
  }, []);

  const statsList = [
    { number: counts.jobs, label: "Active Jobs" },
    { number: counts.employers, label: "Top Companies" },
    { number: counts.employed, label: "Employed" }
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden font-[Poppins]">
      
      {/* Background Video */}
      <div className="hidden md:block fixed inset-0 w-full h-screen overflow-hidden z-[-2]">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-90 saturate-110 brightness-110">
          <source src={videobuilding} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      {/* Hero Section - Pre-Activated so it's visible on load */}
      <div className="relative z-[2] flex flex-col items-center justify-center text-center gap-8 px-6 py-32 md:py-40 min-h-screen">
        <h1 className="reveal active text-white drop-shadow-xl font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          Your Dream <br /> Career Awaits
        </h1>
        <p className="reveal active delay-100 text-gray-200 max-w-2xl text-lg sm:text-xl leading-relaxed drop-shadow-lg">
          Connect with amazing opportunities from world-class companies. <br /> Your perfect job is just one swipe away.
        </p>
        <a href="/roleselection" className="reveal active delay-200">
          <button className="text-white px-10 py-4 mt-4 text-lg font-bold rounded-full bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            Start Swiping
          </button>
        </a>
      </div>

      {/* Stats Section - Animates on Scroll */}
      <div className="relative z-[2] py-20 bg-white/90 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 max-w-6xl mx-auto">
          {statsList.map((item, index) => (
            <div
              key={index}
              className="reveal w-48 h-48 md:w-56 md:h-56 bg-white rounded-3xl border-2 border-blue-600 flex flex-col justify-center items-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              style={{ transitionDelay: `${index * 150}ms` }} // Staggered delay
            >
              <h1 className="text-4xl md:text-5xl font-bold text-blue-500">
                {item.number}
              </h1>
              <p className="text-gray-700 font-semibold text-lg">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <MarqueeTestimonials />

      {/* Info Section - Animates on Scroll */}
      <div className="relative z-[2] py-24 bg-white/90 backdrop-blur-md px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 max-w-6xl mx-auto">
          <div className="reveal max-w-lg text-left">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 text-3xl sm:text-4xl font-bold leading-tight mb-6">
              Discover Your Perfect Job Today
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Our job board simplifies your job search with an intuitive swiping feature. 
              Experience faster, more accurate job matches tailored to your preferences.
            </p>
            <a href="/roleselection">
              <button className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all">
                Register
              </button>
            </a>
          </div>

          <div className="reveal max-w-lg flex justify-center delay-300">
            <div className="w-full max-w-md h-64 md:h-80 rounded-xl shadow-xl overflow-hidden">
              <img src={Hero2Img} alt="Hero illustration" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}