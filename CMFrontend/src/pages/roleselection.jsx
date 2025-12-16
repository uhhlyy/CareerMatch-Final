import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Building2 } from "lucide-react";
import man from "../images/man.png";
import woman from "../images/woman.png";
import images from "../images/work.png";

function Roleselection() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif !important;
        }
        
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .role-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .role-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative pt-24">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-24 left-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 border-2 border-blue-700/30 backdrop-blur-md transition-all duration-200 z-50 group"
          style={{ minWidth: '90px', fontSize: '1rem', letterSpacing: '0.02em' }}
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Card Container */}
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-5xl rounded-3xl shadow-2xl overflow-hidden mx-auto animate-fade-in bg-white">
          
          {/* Main Content - Flex Layout */}
          <div className="flex flex-col lg:flex-row items-stretch min-h-[500px]">
            
            {/* LEFT SECTION - Image */}
            <div className="flex-1 flex w-full justify-center items-center p-8 sm:p-12 lg:p-16 bg-blue-900 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
              
              <div className="relative z-10 text-center animate-fade-up">
                <img 
                  src={images}
                  alt="Career Matching Illustration"
                  className="w-full max-w-[300px] lg:max-w-[350px] drop-shadow-2xl mx-auto mb-6"
                />
                <h1 className="text-white text-2xl lg:text-3xl font-bold mb-3">
                  Welcome to CareerMatch
                </h1>
                <p className="text-blue-100 text-sm lg:text-base max-w-md mx-auto">
                  Your journey to the perfect career match starts here
                </p>
              </div>
            </div>

            {/* RIGHT SECTION - Header and Role Selection */}
            <div className="flex-1 p-6 sm:p-8 lg:p-12 bg-white flex flex-col justify-center">
              
              {/* Header */}
              <div className="text-center mb-10 lg:mb-12 animate-fade-up">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Continue as
                </h2>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-md mx-auto">
                  Choose your role to start using CareerMatch and find your perfect match
                </p>
              </div>

              {/* CARDS CONTAINER */}
              <div className="flex flex-col gap-5 max-w-md mx-auto w-full">

                {/* JOB SEEKER */}
                <Link to="/LoginSeeker" className="no-underline">
                  <div className="role-card bg-gradient-to-br from-white to-blue-50 rounded-2xl p-5 sm:p-6 flex items-center hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border-2 border-blue-100 hover:border-blue-400 cursor-pointer group">
                    
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mr-4 sm:mr-5 shrink-0 relative">
                      <div className="absolute inset-0 bg-blue-200 rounded-full blur-sm group-hover:bg-blue-300 transition-colors"></div>
                      <img 
                        src={woman}
                        alt="Job Seeker"
                        className="relative w-full h-full rounded-full object-cover border-3 border-white shadow-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <h4 className="text-gray-900 text-lg font-bold">Job Seeker</h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Explore thousands of job opportunities tailored to your career goals
                      </p>
                    </div>

                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-5 h-5 text-blue-600 rotate-180" />
                    </div>

                  </div>
                </Link>

                {/* COMPANY */}
                <Link to="/LoginCompany" className="no-underline">
                  <div className="role-card bg-gradient-to-br from-white to-purple-50 rounded-2xl p-5 sm:p-6 flex items-center hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border-2 border-purple-100 hover:border-purple-400 cursor-pointer group">
                    
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mr-4 sm:mr-5 shrink-0 relative">
                      <div className="absolute inset-0 bg-purple-200 rounded-full blur-sm group-hover:bg-purple-300 transition-colors"></div>
                      <img 
                        src={man}
                        alt="Company"
                        className="relative w-full h-full rounded-full object-cover border-3 border-white shadow-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-5 h-5 text-purple-600" />
                        <h4 className="text-gray-900 text-lg font-bold">Company</h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Find the best candidates quickly and grow your organization efficiently
                      </p>
                    </div>

                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-5 h-5 text-purple-600 rotate-180" />
                    </div>

                  </div>
                </Link>

              </div>

              {/* Additional Info */}
              <div className="text-center mt-8 lg:mt-10 animate-fade-up">
                <p className="text-gray-500 text-xs">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default Roleselection;