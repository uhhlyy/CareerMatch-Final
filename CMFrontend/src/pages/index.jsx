import React, { useState, useEffect } from "react";
import videobuilding from '../videos/videobuilding.mp4';
import Hero2Img from '../images/Hero2Img.png';
import Footer from '../components/Footer';
import MarqueeTestimonials from '../components/MarqueeTestimonials';
import CountUp from '../components/CountUp';
import { Briefcase, Building2, Users, TrendingUp, ChevronRight, Check, Sparkles } from 'lucide-react';

export default function Index() {
  const [counts, setCounts] = useState({ jobs: 0, employers: 0, employed: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fetch live data from PHP
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost/CareerMatch-Final/CMBackend/get_stats.php");
        const data = await response.json();
        if (data.success) {
          setCounts({
            jobs: data.jobs || 1247,
            employers: data.employers || 350,
            employed: data.employed || 5890
          });
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching live stats:", error);
        // Fallback values
        setCounts({
          jobs: 1247,
          employers: 350,
          employed: 5890
        });
        setIsLoaded(true);
      }
    };

    fetchStats();

    // Scroll Reveal Animation Logic
    const revealElements = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };

    window.addEventListener("scroll", revealElements);
    revealElements();

    return () => window.removeEventListener("scroll", revealElements);
  }, []);

  const statsList = [
    { 
      number: counts.jobs, 
      label: "Active Jobs",
      icon: Briefcase,
      color: "from-blue-600 to-blue-500",
      bgColor: "bg-blue-50"
    },
    { 
      number: counts.employers, 
      label: "Top Companies",
      icon: Building2,
      color: "from-purple-600 to-purple-500",
      bgColor: "bg-purple-50"
    },
    { 
      number: counts.employed, 
      label: "Successfully Hired",
      icon: Users,
      color: "from-green-600 to-green-500",
      bgColor: "bg-green-50"
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "Smart Matching",
      description: "AI-powered algorithm matches you with jobs that fit your skills and preferences"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Access exclusive opportunities from top companies actively hiring"
    },
    {
      icon: Check,
      title: "Easy Application",
      description: "Swipe right to apply instantly - no lengthy forms or redundant steps"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        html, body, * {
          font-family: 'Inter', sans-serif !important;
        }
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      <div className="relative w-full min-h-screen overflow-x-hidden bg-slate-50">
        
        {/* Hero Section with Video Background */}
        <div className="relative min-h-screen bg-slate-900">
          {/* Background Video - Only for Hero Section */}
          <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={videobuilding} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80"></div>
          </div>

          {/* Mobile gradient background - Only for Hero Section */}
          <div className="md:hidden absolute inset-0 h-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 z-0"></div>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-8 px-4 sm:px-6 py-32 md:py-40 min-h-screen">
            <div className="max-w-5xl mx-auto">
              {/* Badge */}
              

              {/* Main Heading */}
              <h1 className="reveal active text-white font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
                Your Dream Career
                <br />
                <span className="gradient-animate bg-linear-to-r from-blue-400 via-blue-700 to-blue-400 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>

              {/* Subtitle */}
              <p className="reveal active delay-100 text-slate-200 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed mb-8">
                Connect with world-class companies and discover opportunities that match your skills. 
                Your perfect job is just one swipe away.
              </p>

              {/* CTA Buttons */}
              <div className="reveal active delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/roleselection">
                  <button className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-white text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    Register Now
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
                <a href="/about">
                  <button className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
                    Learn More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* End Hero Section */}

        {/* Stats Section with CountUp */}
        <div className="relative z-10 py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="reveal text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Trusted by Thousands
              </h2>
              <p className="reveal delay-100 text-slate-600 text-lg max-w-2xl mx-auto">
                Join the growing community of professionals finding their perfect match
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {statsList.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="reveal group relative bg-white rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${item.bgColor} mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent size={28} className={`bg-linear-to-r ${item.color} bg-clip-text text-transparent`} strokeWidth={2} />
                    </div>

                    {/* Count */}
                    <div className={`text-5xl font-black mb-2 bg-linear-to-r ${item.color} bg-clip-text text-transparent`}>
                      {isLoaded ? (
                        <CountUp 
                          to={item.number} 
                          duration={2.5}
                          delay={index * 0.2}
                          separator=","
                        />
                      ) : (
                        '0'
                      )}
                      +
                    </div>

                    {/* Label */}
                    <p className="text-slate-600 font-semibold text-lg">
                      {item.label}
                    </p>

                    {/* Decorative gradient */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${item.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

       

        {/* Features Section */}
        <div id="features" className="relative z-10 py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="reveal text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Why Choose CareerMatch?
              </h2>
              <p className="reveal delay-100 text-slate-600 text-lg max-w-2xl mx-auto">
                Experience the future of job hunting with our innovative platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={index}
                    className="reveal text-center p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-xl mb-6">
                      <IconComponent size={32} className="text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

         <MarqueeTestimonials />

        {/* Info Section with Image */}
        <div className="relative z-10 py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="reveal">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-semibold mb-6">
                  <TrendingUp size={16} />
                  Discover Your Path
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  Find Your Perfect Job
                  <span className="text-blue-600"> Today</span>
                </h2>
                
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Our intelligent platform simplifies your job search with an intuitive swiping feature. 
                  Experience faster, more accurate job matches tailored specifically to your unique skills 
                  and career preferences.
                </p>

                <ul className="space-y-4 mb-8">
                  {[
                    "Instant job matching ",
                    
                    "Real-time application tracking",
                    
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-green-600" strokeWidth={3} />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <a href="/roleselection">
                  <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold bg-linear-to-r from-slate-900 to-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Start Your Journey
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
              </div>

              {/* Image */}
              <div className="reveal delay-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 float-animation">
                    <img 
                      src={Hero2Img} 
                      alt="CareerMatch Platform" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="relative z-10 py-24 bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Find Your Dream Job?
            </h2>
            <p className="reveal delay-100 text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already found their perfect match
            </p>
            <div className="reveal delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/roleselection">
                <button className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-white text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                  Get Started Now
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}