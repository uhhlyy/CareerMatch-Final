import React from "react";
import { Link, useNavigate } from "react-router-dom";
import man from "../images/man.png";
import woman from "../images/woman.png";
import images from "../images/work.png";

function Roleselection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-6">
      
    {/* Back button */}
      {/* Back button removed */}

      {/* Card Container */}
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl rounded-2xl shadow-2xl overflow-hidden mx-auto">

        

{/* Main Content - Flex Layout */}
<div className="flex flex-col lg:flex-row items-stretch bg-white min-h-[400px]">
            
            {/* LEFT SECTION - Image */}
            <div className="flex-1 flex w-full h-48 sm:h-130 justify-center items-center p-4 sm:p-8 min-h-full" style={{ backgroundColor: '#2A5298' }}>
              <img 
                src={images}
                alt="Career Matching Illustration"
                className="w-full max-w-[280px] lg:max-w-[300px]"
              />
            </div>

            {/* RIGHT SECTION - Header and Role Selection */}
            <div className="flex-1 p-4 sm:p-8 w-full h-130" style={{ backgroundColor: '#d9ebf8' }}>
              
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3">Continue as</h2>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  Choose your role to start using CareerMatch and find your perfect match.
                </p>
              </div>

              {/* CARDS CONTAINER */}
              <div className="flex flex-col gap-4 mt-10 sm:mt-28">

                {/* JOB SEEKER */}
                <Link to="/LoginSeeker" className="no-underline">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-5 flex items-center hover:shadow-xl hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:border-blue-400">
                    
                    <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] mr-2 sm:mr-4 shrink-0">
                      <img 
                        src={woman}
                        alt="Job Seeker"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="text-gray-800 text-base font-semibold mb-0.5">JOB SEEKER</h4>
                      <p className="text-gray-600 text-xs leading-[1.3]">
                        Explore thousands of job opportunities tailored to your career goals.
                      </p>
                    </div>

                  </div>
                </Link>

                {/* COMPANY */}
                <Link to="/LoginCompany" className="no-underline">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-5 flex items-center hover:shadow-xl hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:border-blue-400">
                    
                    <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] mr-2 sm:mr-4 shrink-0">
                      <img 
                        src={man}
                        alt="Company"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="text-gray-800 text-base font-semibold mb-0.5">COMPANY</h4>
                      <p className="text-gray-600 text-xs leading-[1.3]">
                        Find the best candidates quickly and grow your organization efficiently.
                      </p>
                    </div>

                  </div>
                </Link>

              </div>

            </div>

          </div>

        </div>
      </div>

    
  );
}

export default Roleselection;
