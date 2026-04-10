'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Kumar",
    location: "Chennai",
    role: "First-time Homebuyer",
    message:
      "Bigway made finding our perfect home a seamless and enjoyable experience. The 3D virtual tours saved us so much time!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    property: "3BHK Villa, Anna Nagar"
  },
  {
    id: 2,
    name: "Anil Mehta",
    location: "Bangalore",
    role: "Property Investor",
    message:
      "Professional team and transparent process. The AI analytics helped us make the right investment decision.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    property: "Luxury Apartment, Whitefield"
  },
  {
    id: 3,
    name: "Priya Sen",
    location: "Hyderabad",
    role: "Home Upgrader",
    message:
      "Exceptional service and attention to detail. The smart home integration was exactly what we were looking for.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    property: "4BHK Penthouse, Jubilee Hills"
  },
  {
    id: 4,
    name: "Rajesh Patel",
    location: "Coimbatore",
    role: "Business Owner",
    message:
      "Outstanding experience from start to finish. The virtual reality tours were incredible and helped us decide quickly.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5,
    property: "Commercial Space, RS Puram"
  },
  {
    id: 5,
    name: "Meera Iyer",
    location: "Mumbai",
    role: "Senior Executive",
    message:
      "The neighborhood explorer feature was a game-changer. We knew everything about the area before even visiting!",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
    property: "2BHK Apartment, Bandra"
  },
  {
    id: 6,
    name: "Vikram Singh",
    location: "Delhi",
    role: "IT Professional",
    message:
      "Best real estate experience ever! The investment analytics dashboard gave us complete transparency and confidence.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
    property: "3BHK Flat, Dwarka"
  },
];

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.scrollWidth / testimonials.length;
      scrollContainerRef.current.scrollTo({
        left: scrollWidth * currentSlide,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    } else {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }
  };

  return (
    <section 
      className="relative overflow-hidden py-12 md:py-16"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0F1419 50%, #000000 100%)',
      }}
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-move 20s linear infinite'
          }}
        />

        {/* Floating Orbs */}
        <div 
          className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-20 blur-[80px] animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.6), transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-15 blur-[100px] animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, rgba(245,201,122,0.5), transparent 70%)',
          }}
        />

        {/* Diagonal Light Beams */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 60px,
              rgba(212,175,55,0.2) 60px,
              rgba(212,175,55,0.2) 61px
            )`,
            animation: 'beam-move 15s linear infinite'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with Animations */}
        <div 
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'
          }`}
        >
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full mb-6 border-2 backdrop-blur-xl relative overflow-hidden group"
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderColor: 'rgba(212,175,55,0.4)',
              boxShadow: '0 0 30px rgba(212,175,55,0.2)'
            }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700"
              style={{ animation: 'shimmer 3s infinite' }}
            />
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse-glow relative z-10" />
            <span className="text-[#D4AF37] text-xs font-black tracking-[0.2em] uppercase relative z-10"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                textShadow: '0 0 20px rgba(212,175,55,0.5)'
              }}
            >
              Client Success Stories
            </span>
          </div>

          {/* Animated Title */}
          <h2 className="text-4xl md:text-5xl font-black mb-3 leading-tight"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            <span className="text-white">What Our</span>{' '}
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #F5C97A, #D4AF37, #B8941F)',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 3s ease infinite'
                }}
              >
                Clients Say
              </span>
              {/* Underline Animation */}
              <div 
                className="absolute -bottom-1 left-0 h-1 rounded-full"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                  animation: 'slide-in 1.5s ease-out',
                  boxShadow: '0 0 10px rgba(212,175,55,0.6)'
                }}
              />
            </span>
          </h2>
          
          <p className="text-[#B4C0D0] text-sm md:text-base max-w-2xl mx-auto"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Real experiences from families who found their dream homes
          </p>
        </div>

        {/* Enhanced Carousel with 3D Cards */}
        <div className="relative mb-10">
          {/* Stylish Navigation Arrows */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 hidden md:flex group"
            style={{
              backgroundColor: 'rgba(0,0,0,0.9)',
              borderColor: 'rgba(212,175,55,0.5)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(212,175,55,0.3)'
            }}
          >
            <svg className="w-6 h-6 text-[#D4AF37] transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-rotate-12 hidden md:flex group"
            style={{
              backgroundColor: 'rgba(0,0,0,0.9)',
              borderColor: 'rgba(212,175,55,0.5)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(212,175,55,0.3)'
            }}
          >
            <svg className="w-6 h-6 text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="flex-shrink-0 w-[85%] sm:w-[380px] snap-center"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.9)',
                  transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 120}ms`
                }}
              >
                {/* Enhanced 3D Card */}
                <div 
                  className="relative rounded-3xl p-7 border-2 transition-all duration-500 group cursor-pointer h-full"
                  style={{
                    backgroundColor: 'rgba(10,14,26,0.85)',
                    borderColor: hoveredCard === idx ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.25)',
                    backdropFilter: 'blur(30px)',
                    boxShadow: hoveredCard === idx 
                      ? '0 20px 60px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : '0 10px 40px rgba(0,0,0,0.5)',
                    transform: hoveredCard === idx ? 'translateY(-8px) rotateX(2deg)' : 'translateY(0)',
                  }}
                >
                  {/* Glow Effect on Hover */}
                  <div 
                    className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(212,175,55,0.4), transparent 70%)'
                    }}
                  />

                  {/* Diagonal Accent Corner */}
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 rounded-tr-3xl overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #F5C97A)',
                      clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                    }}
                  />

                  {/* Animated Quote Icon */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(245,201,122,0.1))',
                      border: '2px solid rgba(212,175,55,0.4)',
                      boxShadow: '0 8px 24px rgba(212,175,55,0.2)'
                    }}
                  >
                    <svg className="w-7 h-7 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Animated Stars */}
                  <div className="flex gap-1.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg 
                        key={i}
                        className="w-5 h-5 text-[#D4AF37] transition-all duration-300"
                        style={{
                          animation: `star-bounce 0.6s ease ${i * 0.1}s`,
                          filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))'
                        }}
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Message with Fade Animation */}
                  <p 
                    className="text-sm leading-relaxed text-white mb-6 transition-all duration-300"
                    style={{ 
                      fontFamily: 'Lato, sans-serif',
                      opacity: hoveredCard === idx ? 1 : 0.9
                    }}
                  >
                    "{testimonial.message}"
                  </p>

                  {/* Elegant Divider */}
                  <div className="relative h-px mb-6 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40"
                      style={{
                        animation: hoveredCard === idx ? 'shimmer 2s infinite' : 'none'
                      }}
                    />
                  </div>

                  {/* Author Section with Avatar Animation */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {/* Avatar Glow */}
                      <div 
                        className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.6), transparent 70%)' }}
                      />
                      
                      {/* Avatar */}
                      <div 
                        className="relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                        style={{
                          borderColor: 'rgba(212,175,55,0.6)',
                          boxShadow: '0 4px 20px rgba(212,175,55,0.3)'
                        }}
                      >
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Verification Badge */}
                      <div 
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-black transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: '#D4AF37',
                          boxShadow: '0 2px 12px rgba(212,175,55,0.5)'
                        }}
                      >
                        <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-black text-white truncate mb-0.5 transition-colors duration-300 group-hover:text-[#F5C97A]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-[#D4AF37] truncate font-bold mb-0.5">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <p className="text-xs text-[#9CA3AF] truncate">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Animated Accent Bar */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-3xl overflow-hidden"
                  >
                    <div 
                      className="h-full transition-all duration-700"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                        transform: hoveredCard === idx ? 'translateX(0)' : 'translateX(-100%)',
                        boxShadow: '0 0 20px rgba(212,175,55,0.6)'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Progress Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="group relative"
              >
                <div 
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: currentSlide === idx ? '32px' : '8px',
                    height: '8px',
                    backgroundColor: currentSlide === idx ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                    boxShadow: currentSlide === idx ? '0 0 20px rgba(212,175,55,0.6)' : 'none'
                  }}
                />
                {currentSlide === idx && (
                  <div 
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      backgroundColor: '#D4AF37',
                      opacity: 0.4
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats with Icons */}
        <div 
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div 
            className="rounded-2xl p-6 border-2 relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(10,14,26,0.7)',
              borderColor: 'rgba(212,175,55,0.3)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
            }}
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, #D4AF37 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />

            <div className="grid grid-cols-3 gap-6 text-center relative z-10">
              {[
                { num: '500+', label: 'Properties', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { num: '4.9★', label: 'Rating', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                { num: '1000+', label: 'Happy Clients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="group cursor-pointer"
                  style={{
                    animation: `fade-in-up 0.8s ease ${idx * 200 + 800}ms backwards`
                  }}
                >
                  <div 
                    className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(245,201,122,0.1))',
                      border: '2px solid rgba(212,175,55,0.4)',
                      boxShadow: '0 4px 20px rgba(212,175,55,0.2)'
                    }}
                  >
                    <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
                    </svg>
                  </div>
                  <div 
                    className="text-2xl font-black mb-1 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #F5C97A, #D4AF37)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: 'Cinzel, serif',
                      filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))'
                    }}
                  >
                    {stat.num}
                  </div>
                  <div className="text-xs text-[#9CA3AF] font-medium transition-colors duration-300 group-hover:text-white"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800;900&family=Montserrat:wght@600;700;800;900&display=swap');

        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -30px) scale(1.1) rotate(5deg); }
          66% { transform: translate(-20px, 20px) scale(0.9) rotate(-5deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-25px, 25px) scale(1.1) rotate(-5deg); }
          66% { transform: translate(20px, -20px) scale(0.9) rotate(5deg); }
        }

        @keyframes beam-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(212,175,55,0.5);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 20px rgba(212,175,55,0.8);
            transform: scale(1.1);
          }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes slide-in {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }

        @keyframes star-bounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.3) rotate(10deg); }
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .animate-float { animation: float 25s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 30s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}