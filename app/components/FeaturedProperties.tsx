'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  details: string;
  images: string[]; // Changed to array for multiple images
  featured?: boolean;
  status?: string;
}

const properties: Property[] = [
  {
    id: 1,
    title: "Luxury Apartment",
    price: "₹85 Lakhs",
    location: "Chennai",
    details: "3 BHK · 1500 Sq.ft",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
    ],
    featured: true,
    status: "New Listing"
  },
  {
    id: 2,
    title: "Elegant Villa",
    price: "₹1.75 Crore",
    location: "Bangalore",
    details: "4 BHK · 2800 Sq.ft",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
    ],
    featured: true,
    status: "Premium"
  },
  {
    id: 3,
    title: "Modern Office Space",
    price: "₹1.20 Crore",
    location: "Hyderabad",
    details: "Commercial · 2000 Sq.ft",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
    ],
    status: "Hot Deal"
  },
  {
    id: 4,
    title: "Residential Plot",
    price: "₹50 Lakhs",
    location: "Coimbatore",
    details: "Plot · 2400 Sq.ft",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
    ],
    status: "Available"
  },
];

export default function FeaturedProperties() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<{[key: number]: number}>({
    1: 0, 2: 0, 3: 0, 4: 0
  });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    setIsMounted(true);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate images for each property
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex(prev => {
        const newIndices = { ...prev };
        properties.forEach(property => {
          newIndices[property.id] = (prev[property.id] + 1) % property.images.length;
        });
        return newIndices;
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8"
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
        
        {/* Animated Light Rays */}
        <div className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent animate-light-ray" />
        <div className="absolute top-0 right-1/3 w-[2px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent animate-light-ray-delayed" />
        
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
        {/* Enhanced Section Header Badge */}
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
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.3), transparent 70%)'
              }}
            />

            <div className="relative z-10 flex items-center gap-2">
              <div 
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(245,201,122,0.2))',
                  border: '2px solid rgba(212,175,55,0.6)',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full border-2 border-[#D4AF37] animate-ping-slow"
                  style={{ opacity: 0.3 }}
                />
                
                <svg className="w-5 h-5 text-[#D4AF37] relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              </div>

              <div className="relative w-20 h-[2px] overflow-hidden">
                <div 
                  className="absolute inset-0 animate-shimmer"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #D4AF37, #F5C97A, transparent)',
                    backgroundSize: '200% 100%'
                  }}
                />
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <span 
                className="text-[#D4AF37] tracking-[0.25em] text-sm font-extrabold uppercase transition-all duration-300 group-hover:tracking-[0.3em] group-hover:text-[#F5C97A]"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 20px rgba(212,175,55,0.5), 0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                Featured Properties
              </span>

              <svg className="w-4 h-4 text-[#D4AF37] animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>

            <div 
              className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)',
                boxShadow: '0 0 10px rgba(212,175,55,0.6)'
              }}
            />
          </div>
        </div>

        {/* Heading Section */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            <span 
              className="block bg-clip-text text-transparent animate-gradient-shift"
              style={{ 
                fontFamily: 'Cinzel, serif',
                backgroundImage: 'linear-gradient(to bottom right, #F5C97A, #D4AF37, #B8941F)',
                backgroundSize: '200% 200%',
                filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.3))'
              }}
            >
              Featured Properties
            </span>
          </h2>
          
          <p 
            className="text-xl md:text-2xl text-[#A0AEC0] font-light max-w-3xl mx-auto"
            style={{ 
              fontFamily: 'Raleway, sans-serif',
              letterSpacing: '0.02em'
            }}
          >
            Explore hand-picked premium properties from{' '}
            <span 
              className="text-[#F5C97A] font-extrabold tracking-wider"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 15px rgba(212,175,55,0.4)'
              }}
            >
              BIGWAY
            </span>
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((property, index) => (
            <div
              key={property.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="group relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${(index * 150) + 400}ms`
              }}
              onMouseEnter={() => setHoveredCard(property.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={(e) => handleMouseMove(e, index)}
            >
              {/* Card Container */}
              <div 
                className="relative rounded-2xl overflow-hidden border-2 transition-all duration-700 cursor-pointer"
                style={{
                  borderColor: hoveredCard === property.id ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.3)',
                  boxShadow: hoveredCard === property.id 
                    ? '0 25px 60px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                    : '0 10px 40px rgba(0,0,0,0.4)',
                  transform: hoveredCard === property.id ? 'translateY(-8px) scale(1.02) rotateX(2deg)' : 'translateY(0) scale(1)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* Dynamic Glow Effect that follows mouse */}
                {isMounted && hoveredCard === property.id && (
                  <div 
                    className="absolute blur-[80px] opacity-60 transition-all duration-300 pointer-events-none"
                    style={{
                      width: '200px',
                      height: '200px',
                      background: 'radial-gradient(circle, rgba(212,175,55,0.6), rgba(245,201,122,0.3) 40%, transparent 70%)',
                      left: `${mousePosition.x - 100}px`,
                      top: `${mousePosition.y - 100}px`,
                      zIndex: 0
                    }}
                  />
                )}

                {/* Static Glow Effect */}
                <div 
                  className="absolute -inset-4 blur-[60px] opacity-0 group-hover:opacity-50 transition-all duration-700 -z-10"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(212,175,55,0.4), transparent 70%)'
                  }}
                />

                {/* Image Container with Advanced Animations */}
                <div className="relative h-64 overflow-hidden">
                  {/* Animated Scan Line Effect */}
                  <div 
                    className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(212,175,55,0.1) 50%, transparent 100%)',
                      animation: hoveredCard === property.id ? 'scan-line 2s ease-in-out infinite' : 'none'
                    }}
                  />

                  {/* Particle Effect Overlay */}
                  {isMounted && hoveredCard === property.id && (
                    <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {[...Array(8)].map((_, i) => {
                        // Use deterministic values based on property ID and index
                        // This ensures consistent values between server and client
                        const particleSeed = property.id * 100 + i;
                        const left = ((particleSeed * 13) % 97) + 1; // 1-98%
                        const top = ((particleSeed * 17) % 97) + 1; // 1-98%
                        
                        return (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full animate-particle-float"
                            style={{
                              left: `${left}%`,
                              top: `${top}%`,
                              animationDelay: `${i * 0.3}s`,
                              boxShadow: '0 0 10px rgba(212,175,55,0.8)'
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* 3D Image Carousel Container */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      perspective: '1500px',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Multiple Images in 3D Space */}
                    {property.images.map((imageSrc, imgIndex) => {
                      const isActive = activeImageIndex[property.id] === imgIndex;
                      const isPrev = activeImageIndex[property.id] === (imgIndex + 1) % property.images.length;
                      const isNext = (activeImageIndex[property.id] + 1) % property.images.length === imgIndex;
                      
                      let transform = 'translateX(0%) rotateY(0deg) scale(1)';
                      let opacity = 0;
                      let zIndex = 0;
                      
                      if (isActive) {
                        transform = isMounted && hoveredCard === property.id 
                          ? `translateX(0%) rotateY(0deg) scale(1.15) translate3d(${(mousePosition.x - 150) * 0.02}px, ${(mousePosition.y - 150) * 0.02}px, 50px)` 
                          : 'translateX(0%) rotateY(0deg) scale(1) translate3d(0, 0, 0)';
                        opacity = 1;
                        zIndex = 3;
                      } else if (isPrev) {
                        transform = 'translateX(-100%) rotateY(-45deg) scale(0.85) translate3d(-50px, 0, -100px)';
                        opacity = 0.3;
                        zIndex = 1;
                      } else if (isNext) {
                        transform = 'translateX(100%) rotateY(45deg) scale(0.85) translate3d(50px, 0, -100px)';
                        opacity = 0.3;
                        zIndex = 1;
                      }

                      return (
                        <div
                          key={imgIndex}
                          className="absolute inset-0 transition-all duration-1000 ease-out"
                          style={{
                            transform,
                            opacity,
                            zIndex,
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden'
                          }}
                        >
                          <Image
                            src={imageSrc}
                            alt={`${property.title} - View ${imgIndex + 1}`}
                            fill
                            className="object-cover"
                            style={{
                              filter: hoveredCard === property.id && isActive 
                                ? 'brightness(1.1) contrast(1.1) saturate(1.2)' 
                                : 'brightness(0.9) saturate(0.9)'
                            }}
                          />
                          
                          {/* Individual Image Overlay */}
                          <div 
                            className="absolute inset-0"
                            style={{
                              background: isActive
                                ? (hoveredCard === property.id
                                  ? 'linear-gradient(135deg, rgba(10,22,40,0.6) 0%, rgba(212,175,55,0.05) 50%, rgba(10,22,40,0.75) 100%)'
                                  : 'linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.4) 50%, transparent 80%)')
                                : 'linear-gradient(to top, rgba(10,22,40,0.98) 0%, rgba(10,22,40,0.6) 100%)',
                              transition: 'background 0.7s ease'
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Diagonal Light Streak */}
                  <div 
                    className="absolute inset-0 z-15 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, rgba(212,175,55,0.15) 45%, rgba(245,201,122,0.25) 50%, rgba(212,175,55,0.15) 55%, transparent 100%)',
                      animation: hoveredCard === property.id ? 'diagonal-shine 3s ease-in-out infinite' : 'none'
                    }}
                  />

                  {/* Corner Light Burst */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-all duration-700 z-5"
                    style={{
                      background: 'radial-gradient(circle at top right, rgba(212,175,55,0.4), transparent 70%)',
                      filter: 'blur(20px)'
                    }}
                  />

                  {/* Image Navigation Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                    {property.images.map((_, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={() => setActiveImageIndex(prev => ({ ...prev, [property.id]: imgIndex }))}
                        className="group/dot transition-all duration-300 hover:scale-125"
                        style={{
                          width: activeImageIndex[property.id] === imgIndex ? '28px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          background: activeImageIndex[property.id] === imgIndex
                            ? 'linear-gradient(90deg, #D4AF37, #F5C97A, #D4AF37)'
                            : 'rgba(255,255,255,0.4)',
                          border: activeImageIndex[property.id] === imgIndex ? '1px solid rgba(212,175,55,0.8)' : '1px solid rgba(255,255,255,0.3)',
                          boxShadow: activeImageIndex[property.id] === imgIndex 
                            ? '0 0 15px rgba(212,175,55,0.6), inset 0 1px 0 rgba(255,255,255,0.3)' 
                            : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>

                  {/* Image Counter */}
                  <div 
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-xl border-2 rounded-full px-3 py-1 z-30"
                    style={{
                      backgroundColor: 'rgba(10,22,40,0.85)',
                      borderColor: 'rgba(212,175,55,0.5)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}
                  >
                    <span 
                      className="text-[#F5C97A] font-bold text-xs"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {activeImageIndex[property.id] + 1} / {property.images.length}
                    </span>
                  </div>

                  {/* Status Badge with Pulse Animation */}
                  {property.status && (
                    <div 
                      className="absolute top-4 left-4 backdrop-blur-xl border-2 rounded-lg px-3 py-1.5 z-20 animate-badge-pulse"
                      style={{
                        backgroundColor: 'rgba(10,22,40,0.9)',
                        borderColor: property.featured ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.5)',
                        boxShadow: '0 8px 25px rgba(212,175,55,0.3), 0 0 20px rgba(212,175,55,0.2)'
                      }}
                    >
                      <span 
                        className="text-[#F5C97A] font-bold text-xs flex items-center gap-1.5"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {property.featured && (
                          <svg className="w-3.5 h-3.5 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        )}
                        {property.status}
                      </span>
                    </div>
                  )}

                  {/* Quick View Button with Ripple Effect */}
                  <div 
                    className="absolute top-4 right-4 w-10 h-10 rounded-lg backdrop-blur-xl border-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-125 z-20"
                    style={{
                      backgroundColor: 'rgba(10,22,40,0.9)',
                      borderColor: 'rgba(212,175,55,0.8)',
                      boxShadow: '0 8px 25px rgba(212,175,55,0.3)'
                    }}
                  >
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 rounded-lg border-2 border-[#D4AF37] animate-ripple" />
                    
                    <svg className="w-5 h-5 text-[#D4AF37] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 space-y-4 bg-gradient-to-b from-transparent to-[rgba(10,22,40,0.5)]">
                  {/* Title with Underline Animation */}
                  <div className="relative inline-block">
                    <h3 
                      className="text-white text-xl font-bold transition-colors duration-300 group-hover:text-[#F5C97A]"
                      style={{ fontFamily: 'Cinzel, serif' }}
                    >
                      {property.title}
                    </h3>
                    <div 
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F5C97A] transition-all duration-500"
                      style={{
                        width: hoveredCard === property.id ? '100%' : '0%',
                        boxShadow: '0 0 10px rgba(212,175,55,0.6)'
                      }}
                    />
                  </div>

                  {/* Price with Count-up Animation Effect */}
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-3xl font-bold transition-all duration-500"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #F5C97A 0%, #D4AF37 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: 'Cinzel, serif',
                        filter: hoveredCard === property.id 
                          ? 'drop-shadow(0 0 20px rgba(212,175,55,0.5))' 
                          : 'drop-shadow(0 0 15px rgba(212,175,55,0.3))',
                        transform: hoveredCard === property.id ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      {property.price}
                    </span>
                  </div>

                  {/* Location with Animated Icon */}
                  <div className="flex items-center gap-2 text-[#A0AEC0] group/location">
                    <svg 
                      className="w-4 h-4 transition-all duration-500 group-hover/location:text-[#D4AF37] group-hover/location:scale-125" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      style={{
                        animation: hoveredCard === property.id ? 'bounce-subtle 2s ease-in-out infinite' : 'none'
                      }}
                    >
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <span 
                      className="transition-colors duration-300 group-hover/location:text-[#C7D1DB]"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {property.location}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-2 text-[#C7D1DB] text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span style={{ fontFamily: 'Lato, sans-serif' }}>
                      {property.details}
                    </span>
                  </div>

                  {/* Animated Divider */}
                  <div className="relative h-[1px] overflow-hidden">
                    <div 
                      className="absolute inset-0 transition-all duration-700"
                      style={{
                        backgroundImage: hoveredCard === property.id
                          ? 'linear-gradient(to right, rgba(212,175,55,0.6), rgba(245,201,122,0.8), rgba(212,175,55,0.6))'
                          : 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
                        boxShadow: hoveredCard === property.id ? '0 0 10px rgba(212,175,55,0.4)' : 'none'
                      }}
                    />
                  </div>

                  {/* View Details Button with Advanced Hover */}
                  <button 
                    className="w-full group/btn relative px-6 py-3 rounded-xl font-bold text-sm overflow-hidden transition-all duration-500 hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
                    style={{
                      backgroundImage: hoveredCard === property.id 
                        ? 'linear-gradient(135deg, #D4AF37 0%, #F5C97A 50%, #D4AF37 100%)'
                        : 'none',
                      backgroundColor: hoveredCard === property.id ? 'transparent' : 'rgba(212,175,55,0.1)',
                      border: `2px solid ${hoveredCard === property.id ? 'rgba(212,175,55,0.9)' : 'rgba(212,175,55,0.3)'}`,
                      color: hoveredCard === property.id ? '#0A1628' : '#D4AF37',
                      fontFamily: 'Poppins, sans-serif',
                      letterSpacing: '0.05em',
                      backgroundSize: '200% 100%',
                      animation: hoveredCard === property.id ? 'gradient-slide 3s ease infinite' : 'none'
                    }}
                  >
                    {/* Multi-layer Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-40 transition-opacity duration-500 animate-shimmer-fast" />
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      View Details
                      <svg 
                        className="w-4 h-4 transition-all duration-300 group-hover/btn:translate-x-2 group-hover/btn:scale-110" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Enhanced Corner Accents with Glow */}
                <div 
                  className="absolute -top-2 -left-2 w-20 h-20 border-t-[3px] border-l-[3px] rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{ 
                    borderColor: '#D4AF37',
                    filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.6))',
                    animation: hoveredCard === property.id ? 'corner-glow 2s ease-in-out infinite' : 'none'
                  }}
                />
                <div 
                  className="absolute -bottom-2 -right-2 w-20 h-20 border-b-[3px] border-r-[3px] rounded-br-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{ 
                    borderColor: '#D4AF37',
                    filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.6))',
                    animation: hoveredCard === property.id ? 'corner-glow 2s ease-in-out infinite 0.5s' : 'none'
                  }}
                />

                {/* Floating Sparkles */}
                {isMounted && hoveredCard === property.id && (
                  <>
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#F5C97A] rounded-full animate-sparkle" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#F5C97A] rounded-full animate-sparkle" style={{ animationDelay: '1s' }} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Styles with New Animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 25px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }

        @keyframes card-float {
          0%, 100% { transform: translate(0, 0) rotate(12deg); }
          50% { transform: translate(10px, -10px) rotate(15deg); }
        }

        @keyframes card-float-reverse {
          0%, 100% { transform: translate(0, 0) rotate(-12deg); }
          50% { transform: translate(-10px, 10px) rotate(-15deg); }
        }

        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @keyframes shimmer-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes gradient-slide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }

        @keyframes blueprint {
          0% { opacity: 0.02; }
          50% { opacity: 0.04; }
          100% { opacity: 0.02; }
        }

        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        @keyframes diagonal-shine {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }

        @keyframes particle-float {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% { opacity: 1; }
          50% { 
            transform: translateY(-50px) translateX(20px);
            opacity: 0.8;
          }
          90% { opacity: 0.5; }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        @keyframes badge-pulse {
          0%, 100% {
            box-shadow: 0 8px 25px rgba(212,175,55,0.3), 0 0 20px rgba(212,175,55,0.2);
          }
          50% {
            box-shadow: 0 8px 35px rgba(212,175,55,0.5), 0 0 30px rgba(212,175,55,0.4);
          }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes corner-glow {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(212,175,55,0.6));
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(212,175,55,0.9));
            opacity: 0.7;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
        }

        @keyframes light-ray {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }

        @keyframes light-ray-delayed {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.12; }
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

        .animate-particle-float {
          animation: particle-float 4s ease-in-out infinite;
        }

        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }

        .animate-badge-pulse {
          animation: badge-pulse 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-light-ray {
          animation: light-ray 5s ease-in-out infinite;
        }

        .animate-light-ray-delayed {
          animation: light-ray-delayed 7s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
}