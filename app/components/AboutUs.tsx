'use client';
import React, { useState, useEffect, useRef } from 'react';

interface StatItem {
  number: string;
  label: string;
  subtext: string;
  suffix?: string;
}

const AboutUsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate images with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features: string[] = [
    'Handpicked luxury properties in prime locations',
    'Dedicated expert consultation and personalized guidance',
    'Transparent pricing with no hidden fees'
  ];

  const stats: StatItem[] = [
    { number: '50', suffix: '+', label: 'Properties', subtext: 'Premium Collection' },
    { number: '100', suffix: '+', label: 'Happy Clients', subtext: 'Trusted Service' },
    { number: '25', suffix: '+', label: 'Expert Team', subtext: 'Professional Agents' }
  ];

  const propertyImages = [
    {
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=90',
      title: 'Luxury Villa',
      location: 'Beverly Hills'
    },
    {
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&q=90',
      title: 'Modern Apartment',
      location: 'Downtown'
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&q=90',
      title: 'Penthouse Suite',
      location: 'Manhattan'
    }
  ];

  return (
    <div 
      ref={sectionRef}
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

        {/* Luxury Gold Accent Orbs with Animation */}
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

        {/* Floating Property Cards Effect with Animation */}
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
        {/* Enhanced Section Header Badge */}
        <div 
          className={`inline-flex items-center gap-3 mb-10 group cursor-pointer transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          {/* Animated Badge Container */}
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

            {/* Left Icon with Animation */}
            <div className="relative z-10 flex items-center gap-2">
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
                
                {/* House Icon */}
                <svg className="w-5 h-5 text-[#D4AF37] relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              </div>

              {/* Animated Divider Line */}
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

            {/* Badge Text */}
            <div className="relative z-10 flex items-center gap-3">
              <span 
                className="text-[#D4AF37] tracking-[0.25em] text-sm font-extrabold uppercase transition-all duration-300 group-hover:tracking-[0.3em] group-hover:text-[#F5C97A]"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 20px rgba(212,175,55,0.5), 0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                About BIGWAY
              </span>

              {/* Star Icon */}
              <svg className="w-4 h-4 text-[#D4AF37] animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>

            {/* Bottom Glow Line */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)',
                boxShadow: '0 0 10px rgba(212,175,55,0.6)'
              }}
            />
          </div>
        </div>

        {/* Main Content - Single Row Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left Content Column */}
          <div 
            className={`space-y-8 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
          >
            {/* Main Heading with Enhanced Animation */}
            <div className="space-y-5">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span 
                  className="block text-white mb-3 animate-slide-up"
                  style={{ 
                    fontFamily: 'Cinzel, serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Your Trusted
                </span>
                <span 
                  className="block bg-clip-text text-transparent animate-gradient-shift"
                  style={{ 
                    fontFamily: 'Cinzel, serif',
                    backgroundImage: 'linear-gradient(to bottom right, #F5C97A, #D4AF37, #B8941F)',
                    backgroundSize: '200% 200%',
                    filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.3))'
                  }}
                >
                  Real Estate Partner
                </span>
              </h2>
              
              <p 
                className="text-xl md:text-2xl text-[#A0AEC0] font-light animate-fade-in-up"
                style={{ 
                  fontFamily: 'Raleway, sans-serif',
                  letterSpacing: '0.02em'
                }}
              >
                Discover Your Dream Property Today
              </p>
            </div>

            {/* Enhanced Description */}
            <div className="space-y-4 pl-5 border-l-3 relative animate-fade-in-up" style={{ borderColor: 'rgba(212,175,55,0.4)' }}>
              {/* Animated Border Accent */}
              <div 
                className="absolute left-0 top-0 w-1 rounded-full animate-border-pulse"
                style={{ 
                  height: '60%',
                  backgroundImage: 'linear-gradient(to bottom, #D4AF37, transparent)',
                  boxShadow: '0 0 10px rgba(212,175,55,0.5)'
                }}
              />
              
              <p 
                className="text-[#C7D1DB] text-lg leading-relaxed"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                <span 
                  className="text-[#F5C97A] font-extrabold text-xl tracking-wider"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    textShadow: '0 0 15px rgba(212,175,55,0.4)'
                  }}
                >
                  BIGWAY
                </span>
                {' '}is your premier destination for luxury real estate, offering an exclusive collection of meticulously curated properties that redefine sophisticated living.
              </p>
              <p 
                className="text-[#B0BAC5] text-base leading-relaxed"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                With our personalized approach and expert guidance, we transform your property dreams into reality, ensuring every detail exceeds your expectations.
              </p>
            </div>

            {/* Enhanced Feature List */}
            <div className="flex flex-col gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 group cursor-pointer"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${(index * 150) + 400}ms`
                  }}
                >
                  {/* Enhanced Checkmark with Animation */}
                  <div className="flex-shrink-0 relative w-7 h-7 mt-0.5">
                    {/* Outer Glow Ring */}
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-125"
                      style={{
                        boxShadow: '0 0 15px rgba(212,175,55,0.5)'
                      }}
                    />
                    
                    {/* Main Circle */}
                    <div 
                      className="relative w-full h-full rounded-full border-2 border-[#D4AF37] flex items-center justify-center transition-all duration-300 group-hover:bg-[#D4AF37]/20 group-hover:border-[#F5C97A]"
                      style={{
                        boxShadow: '0 0 10px rgba(212,175,55,0.3)'
                      }}
                    >
                      {/* Inner Dot */}
                      <div 
                        className="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125"
                        style={{
                          backgroundImage: 'linear-gradient(to bottom right, #F5C97A, #D4AF37)',
                          boxShadow: '0 0 10px rgba(212,175,55,0.6)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Feature Text */}
                  <p 
                    className="text-[#C7D1DB] text-base md:text-lg leading-relaxed transition-all duration-300 group-hover:text-[#E5EDF5] group-hover:translate-x-1"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap gap-5 pt-6">
              <button 
                className="group relative px-10 py-4 rounded-xl font-bold text-[#0A1628] text-sm overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)]"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5C97A 50%, #D4AF37 100%)',
                  backgroundSize: '200% 100%',
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 group-hover:animate-shimmer-fast" style={{ backgroundSize: '200% 100%' }} />
                
                <span className="relative z-10">Explore More</span>
              </button>

              <button 
                className="group relative px-10 py-4 rounded-xl font-bold text-[#D4AF37] text-sm border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-500 overflow-hidden hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="relative z-10">View Properties</span>
                
                {/* Arrow Icon */}
                <svg className="inline-block w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Image Column - Enhanced Gallery Design */}
          <div 
            className={`relative transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
          >
            <div className="relative">
              {/* Main Featured Image */}
              <div className="relative group">
                {/* Enhanced Glow Effect with Animation */}
                <div 
                  className="absolute -inset-8 blur-[100px] opacity-40 group-hover:opacity-70 transition-all duration-1000 animate-pulse-glow"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(212,175,55,0.5), rgba(245,201,122,0.3) 50%, transparent 80%)'
                  }}
                />
                
                {/* Main Image Card */}
                <div 
                  className="relative rounded-3xl overflow-hidden border-2 transition-all duration-700 group-hover:scale-[1.02]"
                  style={{
                    borderColor: 'rgba(212,175,55,0.6)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px rgba(212,175,55,0.2)'
                  }}
                >
                  {/* Image Slider with Enhanced Transitions */}
                  <div className="relative" style={{ aspectRatio: '4/3' }}>
                    {propertyImages.map((image, index) => (
                      <div
                        key={index}
                        className="absolute inset-0 transition-all duration-1500"
                        style={{
                          opacity: activeImage === index ? 1 : 0,
                          transform: activeImage === index ? 'scale(1)' : 'scale(1.1)',
                          zIndex: activeImage === index ? 1 : 0
                        }}
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Enhanced Gradient Overlay */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to top, rgba(10,22,40,0.98) 0%, rgba(10,22,40,0.6) 30%, rgba(10,22,40,0.2) 60%, transparent 80%)'
                          }}
                        />

                        {/* Property Info */}
                        <div className="absolute bottom-6 left-6 right-6 animate-fade-in-up">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse-slow shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                            <span 
                              className="text-[#D4AF37] text-xs font-extrabold tracking-[0.2em] uppercase"
                              style={{ 
                                fontFamily: 'Orbitron, sans-serif',
                                textShadow: '0 0 10px rgba(212,175,55,0.6)'
                              }}
                            >
                              Featured Property
                            </span>
                          </div>
                          <h3 
                            className="text-white text-3xl font-bold mb-2"
                            style={{ 
                              fontFamily: 'Cinzel, serif',
                              textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                            }}
                          >
                            {image.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[#A0AEC0] text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            <span style={{ fontFamily: 'Lato, sans-serif' }}>
                              {image.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Image Navigation Dots */}
                  <div className="absolute bottom-6 right-6 flex gap-2.5 z-10">
                    {propertyImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className="transition-all duration-500 hover:scale-110"
                        style={{
                          width: activeImage === index ? '40px' : '10px',
                          height: '10px',
                          borderRadius: '5px',
                          backgroundImage: activeImage === index 
                            ? 'linear-gradient(90deg, #D4AF37, #F5C97A, #D4AF37)' 
                            : 'none',
                          backgroundColor: activeImage === index ? 'transparent' : 'rgba(212,175,55,0.3)',
                          border: activeImage === index ? '2px solid rgba(212,175,55,0.9)' : 'none',
                          boxShadow: activeImage === index ? '0 0 15px rgba(212,175,55,0.6)' : 'none',
                          backgroundSize: activeImage === index ? '200% 100%' : 'auto',
                          animation: activeImage === index ? 'shimmer 2s infinite' : 'none'
                        }}
                      />
                    ))}
                  </div>

                  {/* Enhanced Verified Badge */}
                  <div 
                    className="absolute top-6 right-6 backdrop-blur-xl border-2 rounded-xl px-5 py-2.5 z-10 group/badge hover:scale-110 transition-all duration-500 cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(10,22,40,0.85)',
                      borderColor: 'rgba(212,175,55,0.6)',
                      boxShadow: '0 10px 40px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  >
                    <p 
                      className="text-[#F5C97A] font-extrabold text-sm flex items-center gap-2.5"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        textShadow: '0 0 10px rgba(245,201,122,0.5)'
                      }}
                    >
                      <svg className="w-5 h-5 animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Verified
                    </p>
                  </div>
                </div>

                {/* Enhanced Corner Accents with Animation */}
                <div 
                  className="absolute -top-3 -left-3 w-24 h-24 border-t-[3px] border-l-[3px] rounded-tl-3xl opacity-60 transition-all duration-700 group-hover:opacity-100 group-hover:-top-5 group-hover:-left-5 group-hover:w-28 group-hover:h-28"
                  style={{ 
                    borderColor: '#D4AF37',
                    filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))'
                  }}
                />
                <div 
                  className="absolute -bottom-3 -right-3 w-24 h-24 border-b-[3px] border-r-[3px] rounded-br-3xl opacity-60 transition-all duration-700 group-hover:opacity-100 group-hover:-bottom-5 group-hover:-right-5 group-hover:w-28 group-hover:h-28"
                  style={{ 
                    borderColor: '#D4AF37',
                    filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))'
                  }}
                />
              </div>

              {/* Enhanced Thumbnail Gallery Strip */}
              <div className="flex gap-4 mt-8 justify-center">
                {propertyImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className="relative group/thumb overflow-hidden rounded-xl transition-all duration-500 hover:scale-110"
                    style={{
                      width: '90px',
                      height: '70px',
                      border: activeImage === index ? '3px solid rgba(212,175,55,0.9)' : '2px solid rgba(212,175,55,0.3)',
                      boxShadow: activeImage === index 
                        ? '0 10px 30px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.3)' 
                        : '0 5px 20px rgba(0,0,0,0.4)'
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover transition-all duration-500"
                      style={{
                        filter: activeImage === index ? 'brightness(1) saturate(1.1)' : 'brightness(0.6) saturate(0.8)',
                        transform: activeImage === index ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/50 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-500"
                    />
                    {activeImage === index && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-pulse-slow" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Enhanced Property Stats Mini Cards */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { value: '50+', label: 'Listings' },
                  { value: '100%', label: 'Verified' },
                  { value: '24/7', label: 'Support' }
                ].map((stat, idx) => (
                  <div 
                    key={idx}
                    className="group/stat backdrop-blur-xl rounded-xl p-4 border-2 text-center transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(16,38,63,0.7)',
                      borderColor: 'rgba(212,175,55,0.3)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div 
                      className="text-[#D4AF37] text-2xl font-bold mb-1 transition-all duration-300 group-hover/stat:scale-110" 
                      style={{ 
                        fontFamily: 'Cinzel, serif',
                        textShadow: '0 0 15px rgba(212,175,55,0.4)'
                      }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-[#A0AEC0] text-xs transition-colors duration-300 group-hover/stat:text-[#C7D1DB]" 
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

        {/* Enhanced Statistics Section */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-3 gap-8 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-xl rounded-2xl p-8 border-2 transition-all duration-700 hover:scale-105 cursor-pointer"
              style={{
                backgroundImage: hoveredStat === index 
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(16,38,63,0.7))' 
                  : 'linear-gradient(135deg, rgba(16,38,63,0.5), rgba(10,22,40,0.7))',
                borderColor: hoveredStat === index ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.3)',
                boxShadow: hoveredStat === index 
                  ? '0 20px 60px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 10px 40px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              {/* Background Glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.3), transparent 70%)'
                }}
              />

              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div 
                    className="w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      backgroundImage: hoveredStat === index 
                        ? 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(245,201,122,0.2))'
                        : 'rgba(212,175,55,0.1)',
                      border: `2px solid ${hoveredStat === index ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)'}`,
                      boxShadow: hoveredStat === index ? '0 0 25px rgba(212,175,55,0.4)' : 'none'
                    }}
                  >
                    {index === 0 && (
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                    )}
                    {index === 1 && (
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                    {index === 2 && (
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Number */}
                <div className="flex items-center justify-center mb-3">
                  <span 
                    className="text-5xl md:text-6xl font-bold transition-all duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #F5C97A 0%, #D4AF37 50%, #B8941F 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: 'Cinzel, serif',
                      filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))'
                    }}
                  >
                    {stat.number}
                  </span>
                  {stat.suffix && (
                    <span 
                      className="text-3xl font-bold ml-1 text-[#D4AF37]"
                      style={{ 
                        fontFamily: 'Cinzel, serif',
                        textShadow: '0 0 15px rgba(212,175,55,0.4)'
                      }}
                    >
                      {stat.suffix}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div 
                  className="text-white font-bold text-lg mb-2 transition-all duration-300 group-hover:text-[#F5C97A]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {stat.label}
                </div>

                {/* Subtext */}
                <div 
                  className="text-[#9CA3AF] text-sm transition-colors duration-300 group-hover:text-[#B0BAC5]"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  {stat.subtext}
                </div>
              </div>

              {/* Bottom Accent with Enhanced Animation */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-700"
                style={{
                  backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.9), transparent)',
                  opacity: hoveredStat === index ? 1 : 0,
                  boxShadow: hoveredStat === index ? '0 0 20px rgba(212,175,55,0.6)' : 'none'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Styles with New Animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
        }

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

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes border-pulse {
          0%, 100% {
            height: 60%;
            opacity: 1;
          }
          50% {
            height: 80%;
            opacity: 0.6;
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

        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-border-pulse {
          animation: border-pulse 3s ease-in-out infinite;
        }

        .animate-blueprint {
          animation: blueprint 10s ease-in-out infinite;
        }

        .border-l-3 {
          border-left-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default AboutUsSection;