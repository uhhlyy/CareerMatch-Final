import React from 'react';
import manAvatar from '../images/man.png';
import womanAvatar from '../images/woman.png';

export default function MarqueeTestimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Software Engineer at Google",
      text: "CareerMatch helped me find my dream role in just 2 weeks. The swiping interface is so intuitive!",
      image: womanAvatar
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Product Manager at Meta",
      text: "The job matches are incredibly accurate. I felt like they really understood my career goals.",
      image: manAvatar
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "UX Designer at Apple",
      text: "Best job search experience I've ever had. Found a role that aligns perfectly with my values.",
      image: womanAvatar
    },
    {
      id: 4,
      name: "David Park",
      title: "Data Scientist at Amazon",
      text: "Saved me so much time compared to traditional job boards. Highly recommend CareerMatch!",
      image: manAvatar
    },
    {
      id: 5,
      name: "Jessica Williams",
      title: "Marketing Manager at Netflix",
      text: "The personalized matches were spot-on. Got 3 offers within a month of signing up.",
      image: womanAvatar
    },
    {
      id: 6,
      name: "Alex Thompson",
      title: "DevOps Engineer at Microsoft",
      text: "CareerMatch's algorithm is genius. Every job suggestion felt relevant and exciting.",
      image: manAvatar
    },
  ];

  return (
    <section className="relative z-[2] py-24 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Loved by professionals worldwide
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Join thousands of career-focused professionals who found their perfect role on CareerMatch.
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden py-4">
        <div className="marquee-container group">
          <div className="marquee-content">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="marquee-item">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic text-sm">"{testimonial.text}"</p>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate for seamless loop */}
          <div className="marquee-content">
            {testimonials.map((testimonial) => (
              <div key={`${testimonial.id}-dup`} className="marquee-item">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic text-sm">"{testimonial.text}"</p>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-blue-50 to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-blue-50 to-transparent z-10"></div>
      </div>
    </section>
  );
}
