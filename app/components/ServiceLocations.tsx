'use client';
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';

interface Location {
  id: number;
  city: string;
  properties: string;
  types: string;
  image: string;
  featured: string;
  stats: {
    luxury: string;
    premium: string;
    economy: string;
  };
}

const locations: Location[] = [
  {
    id: 1,
    city: "Chennai",
    properties: "120+ Properties",
    types: "Apartments, Villas, Plots",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&q=90",
    featured: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop&q=90",
    stats: {
      luxury: "45",
      premium: "50",
      economy: "25"
    }
  },
  {
    id: 2,
    city: "Bangalore",
    properties: "150+ Properties",
    types: "Apartments, Villas, Plots",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=90",
    featured: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop&q=90",
    stats: {
      luxury: "60",
      premium: "65",
      economy: "25"
    }
  },
  {
    id: 3,
    city: "Hyderabad",
    properties: "100+ Properties",
    types: "Apartments, Villas, Plots",
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop&q=90",
    featured: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=400&h=300&fit=crop&q=90",
    stats: {
      luxury: "35",
      premium: "45",
      economy: "20"
    }
  },
  {
    id: 4,
    city: "Coimbatore",
    properties: "80+ Properties",
    types: "Apartments, Villas, Plots",
    image: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop&q=90",
    featured: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop&q=90",
    stats: {
      luxury: "25",
      premium: "35",
      economy: "20"
    }
  },
];

export default function ServiceLocations() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate images for each card
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex(prev => prev.map((index, i) => 
        hoveredCard !== i ? (index + 1) % 2 : index
      ));
    }, 4000);
    return () => clearInterval(interval);
  }, [hoveredCard]);

  const toggleImage = (cardIndex: number) => {
    setActiveImageIndex(prev => {
      const newIndexes = [...prev];
      newIndexes[cardIndex] = (newIndexes[cardIndex] + 1) % 2;
      return newIndexes;
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0D1B2E 50%, #0A1628 100%)',
      }}
    >
      {/* Enhanced Real Estate Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Architectural Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,0.4) 1.5px, transparent 1.5px), 
              linear-gradient(90deg, rgba(212,175,55,0.4) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Animated Diagonal Blueprint Lines */}
        <div 
          className="absolute inset-0 opacity-[0.02] animate-blueprint"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(212,175,55,0.3) 50px, rgba(212,175,55,0.3) 51px),
              repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(212,175,55,0.2) 50px, rgba(212,175,55,0.2) 51px)
            `,
          }}
        />

        {/* Luxury Gold Accent Orbs */}
        <div 
          className="absolute top-20 right-0 w-[800px] h-[800px] opacity-20 blur-[120px] animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(245,201,122,0.15) 30%, transparent 70%)',
          }}
        />
        
        <div 
          className="absolute bottom-0 left-0 w-[700px] h-[700px] opacity-15 blur-[100px] animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(184,148,31,0.1) 40%, transparent 70%)',
          }}
        />

        {/* Floating Property Cards Effect */}
        <div className="absolute top-1/4 left-10 w-32 h-32 rounded-xl opacity-[0.03] bg-gradient-to-br from-[#D4AF37] to-transparent blur-sm animate-card-float" />
        <div className="absolute bottom-1/4 right-20 w-40 h-40 rounded-xl opacity-[0.03] bg-gradient-to-br from-[#D4AF37] to-transparent blur-sm animate-card-float-reverse" />

        {/* Corner Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,22,40,0.6) 100%)'
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header Badge */}
        <div 
          className={`inline-flex items-center gap-3 mb-10 group cursor-pointer transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div 
            className="relative flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl border-2 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(16,38,63,0.8) 50%, rgba(10,22,40,0.9) 100%)',
              borderColor: 'rgba(212,175,55,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            {/* Animated Glow Background */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.3), transparent 70%)'
              }}
            />

            {/* Icon */}
            <div 
              className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(245,201,122,0.2))',
                border: '2px solid rgba(212,175,55,0.6)',
                boxShadow: '0 4px 15px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              {/* Pulsing Ring */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-[#D4AF37] animate-ping-slow"
                style={{ opacity: 0.3 }}
              />
              
              <svg className="w-5 h-5 text-[#D4AF37] relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </div>

            {/* Divider */}
            <div className="relative w-20 h-[2px] overflow-hidden">
              <div 
                className="absolute inset-0 animate-shimmer"
                style={{
                  backgroundImage: 'linear-gradient(to right, #D4AF37, #F5C97A, transparent)',
                  backgroundSize: '200% 100%'
                }}
              />
            </div>

            {/* Text */}
            <span 
              className="text-[#D4AF37] tracking-[0.25em] text-sm font-extrabold uppercase transition-all duration-300 group-hover:tracking-[0.3em] group-hover:text-[#F5C97A]"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 20px rgba(212,175,55,0.5), 0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Our Locations
            </span>

            <svg className="w-4 h-4 text-[#D4AF37] animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div 
          className={`text-center mb-14 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            <span className="text-white">Properties In </span>
            <span 
              className="bg-clip-text text-transparent animate-gradient-shift"
              style={{ 
                backgroundImage: 'linear-gradient(to bottom right, #F5C97A, #D4AF37, #B8941F)',
                backgroundSize: '200% 200%',
                filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.3))'
              }}
            >
              Prime Locations
            </span>
          </h2>
          <p 
            className="text-[#A0AEC0] text-lg md:text-xl mt-4"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Discover luxury properties in the cities we serve
          </p>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="group relative backdrop-blur-xl rounded-2xl overflow-hidden border-2 transition-all duration-700 hover:scale-105 cursor-pointer"
              style={{
                backgroundImage: hoveredCard === index 
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(16,38,63,0.8))' 
                  : 'linear-gradient(135deg, rgba(16,38,63,0.6), rgba(10,22,40,0.8))',
                borderColor: hoveredCard === index ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.3)',
                boxShadow: hoveredCard === index 
                  ? '0 20px 60px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 10px 40px rgba(0,0,0,0.4)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${(index * 150) + 400}ms`
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.3), transparent 70%)'
                }}
              />

              {/* Image Container with 3D Effect */}
              <div className="relative h-56 w-full overflow-hidden">
                {/* Main Image */}
                <div 
                  className="absolute inset-0 transition-all duration-1000"
                  style={{
                    opacity: activeImageIndex[index] === 0 ? 1 : 0,
                    transform: activeImageIndex[index] === 0 ? 'scale(1) rotateY(0deg)' : 'scale(0.8) rotateY(90deg)',
                  }}
                >
                  <Image
                    src={location.image}
                    alt={location.city}
                    fill
                    className="object-cover transition-all duration-700"
                    style={{
                      filter: hoveredCard === index ? 'brightness(1) saturate(1.1)' : 'brightness(0.8) saturate(0.9)'
                    }}
                  />
                </div>

                {/* Featured Image */}
                <div 
                  className="absolute inset-0 transition-all duration-1000"
                  style={{
                    opacity: activeImageIndex[index] === 1 ? 1 : 0,
                    transform: activeImageIndex[index] === 1 ? 'scale(1) rotateY(0deg)' : 'scale(0.8) rotateY(-90deg)',
                  }}
                >
                  <Image
                    src={location.featured}
                    alt={`${location.city} Featured`}
                    fill
                    className="object-cover transition-all duration-700"
                    style={{
                      filter: hoveredCard === index ? 'brightness(1) saturate(1.1)' : 'brightness(0.8) saturate(0.9)'
                    }}
                  />
                </div>
                
                {/* Enhanced Gradient Overlay */}
                <div 
                  className="absolute inset-0 z-10"
                  style={{
                    background: 'linear-gradient(to top, rgba(10,22,40,0.98) 0%, rgba(10,22,40,0.6) 40%, rgba(10,22,40,0.2) 70%, transparent 100%)'
                  }}
                />

                {/* 3D Badge */}
                <div 
                  className="absolute top-4 left-4 backdrop-blur-xl border-2 rounded-lg px-3 py-1.5 z-20 transition-all duration-500"
                  style={{
                    backgroundColor: 'rgba(10,22,40,0.9)',
                    borderColor: 'rgba(212,175,55,0.6)',
                    boxShadow: '0 8px 25px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    transform: hoveredCard === index ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)'
                  }}
                >
                  <p 
                    className="text-[#F5C97A] font-extrabold text-xs flex items-center gap-1.5"
                    style={{ 
                      fontFamily: 'Orbitron, sans-serif',
                      textShadow: '0 0 10px rgba(245,201,122,0.5)'
                    }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                    </svg>
                    3D View
                  </p>
                </div>

                {/* Image Toggle Button */}
                <button
                  onClick={() => toggleImage(index)}
                  className="absolute top-4 right-4 backdrop-blur-xl border-2 rounded-full p-2 z-20 transition-all duration-500 hover:scale-110"
                  style={{
                    backgroundColor: 'rgba(10,22,40,0.9)',
                    borderColor: 'rgba(212,175,55,0.6)',
                    boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
                  }}
                >
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </button>

                {/* Corner Accent */}
                <div 
                  className="absolute top-0 right-0 w-20 h-20 border-t-[3px] border-r-[3px] rounded-tr-2xl opacity-0 group-hover:opacity-60 transition-all duration-500 z-10"
                  style={{ 
                    borderColor: '#D4AF37',
                    filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.5))'
                  }}
                />

                {/* Property Count Mini Stats */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2">
                  {Object.entries(location.stats).map(([type, count], idx) => (
                    <div 
                      key={type}
                      className="flex-1 backdrop-blur-xl rounded-lg p-2 border transition-all duration-500"
                      style={{
                        backgroundColor: 'rgba(10,22,40,0.8)',
                        borderColor: 'rgba(212,175,55,0.4)',
                        opacity: hoveredCard === index ? 1 : 0,
                        transform: hoveredCard === index ? 'translateY(0)' : 'translateY(10px)',
                        transitionDelay: `${idx * 100}ms`
                      }}
                    >
                      <p className="text-[#D4AF37] text-xs font-bold text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {count}
                      </p>
                      <p className="text-[#A0AEC0] text-[10px] text-center capitalize" style={{ fontFamily: 'Lato, sans-serif' }}>
                        {type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center relative z-10">
                {/* City Name */}
                <h3 
                  className="text-2xl font-bold mb-3 transition-all duration-300 group-hover:text-[#F5C97A]"
                  style={{ 
                    fontFamily: 'Cinzel, serif',
                    color: '#FFFFFF',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  {location.city}
                </h3>

                {/* Properties Count */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div 
                    className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse-slow"
                    style={{
                      boxShadow: '0 0 10px rgba(212,175,55,0.8)'
                    }}
                  />
                  <p 
                    className="text-[#D4AF37] font-bold text-lg"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      textShadow: '0 0 10px rgba(212,175,55,0.4)'
                    }}
                  >
                    {location.properties}
                  </p>
                </div>

                {/* Property Types */}
                <p 
                  className="text-[#A0AEC0] text-sm mb-5 transition-colors duration-300 group-hover:text-[#C7D1DB]"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  {location.types}
                </p>

                {/* View Properties Button */}
                <button 
                  className="group/btn relative px-6 py-3 rounded-xl font-bold text-sm overflow-hidden transition-all duration-500 hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] w-full"
                  style={{
                    backgroundImage: hoveredCard === index 
                      ? 'linear-gradient(135deg, #D4AF37 0%, #F5C97A 100%)' 
                      : 'none',
                    backgroundColor: hoveredCard === index ? 'transparent' : 'rgba(212,175,55,0.1)',
                    border: `2px solid ${hoveredCard === index ? 'rgba(212,175,55,0.9)' : 'rgba(212,175,55,0.4)'}`,
                    color: hoveredCard === index ? '#0A1628' : '#D4AF37',
                    fontFamily: 'Poppins, sans-serif',
                    letterSpacing: '0.05em'
                  }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500 group-hover/btn:animate-shimmer-fast" style={{ backgroundSize: '200% 100%' }} />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    View Properties
                    <svg 
                      className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Bottom Accent */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-700"
                style={{
                  backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.9), transparent)',
                  opacity: hoveredCard === index ? 1 : 0,
                  boxShadow: hoveredCard === index ? '0 0 20px rgba(212,175,55,0.6)' : 'none'
                }}
              />
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div 
          className={`mt-16 text-center transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
       
        </div>
      </div>

      {/* Enhanced Styles with Animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-25px, 25px) scale(1.05);
          }
          66% {
            transform: translate(20px, -20px) scale(0.95);
          }
        }

        @keyframes card-float {
          0%, 100% {
            transform: translate(0, 0) rotate(12deg);
          }
          50% {
            transform: translate(10px, -10px) rotate(15deg);
          }
        }

        @keyframes card-float-reverse {
          0%, 100% {
            transform: translate(0, 0) rotate(-12deg);
          }
          50% {
            transform: translate(-10px, 10px) rotate(-15deg);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }

        @keyframes shimmer-fast {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.95);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }

        @keyframes blueprint {
          0% {
            opacity: 0.02;
          }
          50% {
            opacity: 0.04;
          }
          100% {
            opacity: 0.02;
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-card-float {
          animation: card-float 15s ease-in-out infinite;
        }

        .animate-card-float-reverse {
          animation: card-float-reverse 18s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }

        .animate-shimmer-fast {
          animation: shimmer-fast 1.5s linear infinite;
        }

        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-blueprint {
          animation: blueprint 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}