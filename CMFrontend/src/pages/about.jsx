import React from 'react';
import { ArrowRight, ArrowLeft, Check, Zap, Target, Rocket } from 'lucide-react';

const SimpleMarquee = ({ images }) => {
  return (
    <div className="relative h-[400px] overflow-hidden rounded-2xl">
      {/* First Row - Moving Left */}
      <div className="marquee-container mb-4">
        <div className="marquee-content">
          {[...images, ...images].map((img, idx) => (
            <div
              key={`row1-${idx}`}
              className="marquee-item"
            >
              <img
                src={img}
                alt={`Company ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Moving Right */}
      <div className="marquee-container mb-4">
        <div className="marquee-content marquee-reverse">
          {[...images, ...images].map((img, idx) => (
            <div
              key={`row2-${idx}`}
              className="marquee-item"
            >
              <img
                src={img}
                alt={`Company ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Third Row - Moving Left */}
      <div className="marquee-container">
        <div className="marquee-content">
          {[...images, ...images].map((img, idx) => (
            <div
              key={`row3-${idx}`}
              className="marquee-item"
            >
              <img
                src={img}
                alt={`Company ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }

        .marquee-content {
          display: inline-flex;
          gap: 1rem;
          animation: scroll 30s linear infinite;
        }

        .marquee-reverse {
          animation: scroll-reverse 30s linear infinite;
        }

        .marquee-item {
          flex: 0 0 200px;
          height: 120px;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .marquee-item:hover {
          transform: scale(1.05) translateZ(20px);
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default function AboutPage() {
  const images = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
    "https://assets.aceternity.com/animated-testimonials.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
    "https://assets.aceternity.com/github-globe.png",
    "https://assets.aceternity.com/glare-card.png",
    "https://assets.aceternity.com/layout-grid.png",
    "https://assets.aceternity.com/flip-text.png",
    "https://assets.aceternity.com/hero-highlight.png",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
    "https://assets.aceternity.com/signup-form.png",
    "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
    "https://assets.aceternity.com/spotlight-new.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
    "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    "https://assets.aceternity.com/tabs.png",
    "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    "https://assets.aceternity.com/glowing-effect.webp",
    "https://assets.aceternity.com/hover-border-gradient.png",
    "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
    "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "https://assets.aceternity.com/multi-step-loader.png",
    "https://assets.aceternity.com/vortex.png",
    "https://assets.aceternity.com/wobble-card.png",
    "https://assets.aceternity.com/world-map.webp",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-['Inter',sans-serif]">
      {/* Space for Navbar */}
      <div className="h-20"></div>

      {/* Main Heading */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          About CareerMatch
        </h1>
        <p className="text-center text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          Where Your Dream Career is Just a Swipe Away
        </p>
      </div>

      {/* Content Section with Marquee and Introduction */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Marquee */}
          <div className="order-2 md:order-1">
            <div className="mx-auto max-w-full rounded-3xl bg-white p-3 shadow-xl border border-gray-100">
              <SimpleMarquee images={images} />
            </div>
          </div>

          {/* Right Side - Introduction */}
          <div className="order-1 md:order-2 space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-4">
              <span className="text-blue-600 font-semibold text-sm">INNOVATIVE JOB SEARCH</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Job Hunting Made Simple
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              CareerMatch revolutionizes the way you discover your next career opportunity. 
              Inspired by the intuitive swipe interface you already know and love, we've made 
              job searching as easy as swiping right.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              No complicated forms. No endless filters. Just you, exploring opportunities 
              that align with your skills, interests, and career goals—one swipe at a time.
            </p>

            <div className="space-y-5 pt-6">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl transition-all hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Swipe Right on Opportunities</h3>
                  <p className="text-gray-600 text-sm">Browse through curated job listings tailored to your profile</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl transition-all hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <ArrowLeft className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Swipe Left to Pass</h3>
                  <p className="text-gray-600 text-sm">Not interested? Simply swipe left and move on to the next opportunity</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-xl transition-all hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Check className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Apply Instantly</h3>
                  <p className="text-gray-600 text-sm">Found the perfect role? Apply with just a few taps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why CareerMatch Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl p-8 md:p-16 border border-gray-100 shadow-lg">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-white rounded-full mb-4 shadow-sm">
              <span className="text-blue-600 font-semibold text-sm">WHY CHOOSE US</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Why CareerMatch?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Fast & Intuitive</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Browse hundreds of jobs in minutes with our simple swipe interface
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Personalized for You</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Smart algorithms show you jobs that match your skills and preferences
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Rocket className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Career Growth</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Discover opportunities that align with your career aspirations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </div>
  );
}