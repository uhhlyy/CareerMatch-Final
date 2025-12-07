import React from "react";
import videobuilding from '../videos/videobuilding.mp4';
import Hero2Img from '../images/Hero2Img.png';
import Footer from '../components/Footer';
import MarqueeTestimonials from '../components/MarqueeTestimonials';

export default function Index() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden font-[Poppins]">

    {/* Desktop Background Video */}
    <div className=" hidden md:block fixed inset-0 w-full h-screen overflow-hidden z-[-2]">
    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-90 saturate-110 brightness-110">
    <source src={videobuilding} type="video/mp4" />
    </video>

    {/* black shadow for the background*/}
    <div className="absolute inset-0 bg-black/35"></div>
      </div>

    {/* Hero Section */}
    <div className="relative z-[2] flex flex-col items-center justify-center text-center gap-8 px-6 py-32 md:py-40 min-h-screen">

    {/* Mobile background image */}
    <div className="absolute inset-0 md:hidden opacity-20 pointer-events-none z-[-1] bg-gradient-to-b from-blue-900 to-blue-700">
    {/* Image placeholder - add your mobile background here */}
    </div>

    {/* Title */}
    <h1 className="text-white drop-shadow-xl font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
    Your Dream <br /> Career Awaits</h1>

    {/* Subtitle */}
    <p className="text-gray-200 max-w-2xl text-lg sm:text-xl leading-relaxed drop-shadow-lg">
    Connect with amazing opportunities from world-class companies. <br /> Your perfect job is just one swipe away.</p>

    {/* Button */}
    <a href="/roleselection">
    <button className="text-white px-10 py-4 mt-4 text-lg font-bold rounded-full bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
    Start Swiping
    </button>
    </a>
    </div>

    {/* Stats Section */}
    <div className="relative z-[2] py-20 bg-white/90 backdrop-blur-md">
    <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 max-w-6xl mx-auto">
    {[
            { number: "0", label: "Active Jobs" },
            { number: "0", label: "Top Companies" },
            { number: "0", label: "Employed" },
          ].map((item, index) => (
            <div
              key={index}
              className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-3xl border-2 border-blue-600 flex flex-col justify-center items-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
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

      {/* Marquee Testimonials */}
      <MarqueeTestimonials />

      {/* Info Section */}
      <div className="relative z-[2] py-24 bg-white/90 backdrop-blur-md px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 max-w-6xl mx-auto">

          {/* Left Text */}
          <div className="max-w-lg text-left">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 text-3xl sm:text-4xl font-bold leading-tight mb-6">
              Discover Your Perfect Job Today
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Our job board simplifies your job search with an intuitive swiping
              feature. Experience faster, more accurate job matches tailored to
              your preferences.
            </p>
            <a href="/roleselection">
              <button className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all">
                Register
              </button>
            </a>
          </div>

     

          {/* Right Image */}
          
          <div className="max-w-lg flex justify-center">
                <div className="w-300 max-w-md h-64 md:h-80 rounded-xl shadow-xl overflow-hidden">
                  <img src={Hero2Img} alt="Hero illustration" className="w-full h-full object-cover" />
                </div>
          </div>
        </div>
      </div>
     
      {/* Footer */}
      <Footer />
    </div>
  );
}
