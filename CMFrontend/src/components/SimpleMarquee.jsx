import React from 'react';

export default function SimpleMarquee({ images }) {
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
}