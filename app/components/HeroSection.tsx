"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Premium background images - Real luxury estate photography
const backgroundImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80',
    location: 'Luxury Villa, RS Puram',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80',
    location: 'Modern Villa, Race Course',
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80',
    location: 'Penthouse, Saibaba Colony',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80',
    location: 'Executive Villa, Peelamedu',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80',
    location: 'Premium Estate, Ukkadam',
    thumbnail: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80',
    location: 'Luxury Residence, Gandhipuram',
    thumbnail: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
];

// Location options
const locations = [
  'All Locations',
  'RS Puram',
  'Race Course',
  'Saibaba Colony',
  'Peelamedu',
  'Ukkadam',
  'Gandhipuram',
  'Town Hall',
  'Singanallur'
];

// Property type options
const propertyTypes = [
  'All Types',
  'Villa',
  'Apartment',
  'Penthouse',
  'Plot/Land',
  'Commercial',
  'Residential'
];

const HeroSection: React.FC = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [nextBgIndex, setNextBgIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedPropertyType, setSelectedPropertyType] = useState('All Types');
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);



  // Background image slideshow with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setNextBgIndex((currentBgIndex + 1) % backgroundImages.length);
      
      setTimeout(() => {
        setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 1500);
    }, 7000);

    return () => clearInterval(interval);
  }, [currentBgIndex]);

  // Set loaded state after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Manual background image navigation
  const handleBgNavigation = (index: number) => {
    setIsTransitioning(true);
    setNextBgIndex(index);
    setTimeout(() => {
      setCurrentBgIndex(index);
      setIsTransitioning(false);
    }, 1500);
  };

  // Search handler
  const handleSearch = () => {
    console.log('Searching with:', {
      location: selectedLocation,
      propertyType: selectedPropertyType
    });
    alert(`Searching for ${selectedPropertyType} in ${selectedLocation}`);
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0D1B2E 50%, #0A1628 100%)',
      }}
    >
      {/* Luxury Background Effects - Matching About Section */}
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

      {/* Background Images with Ken Burns Effect */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {backgroundImages.map((image, index) => {
          const isCurrent = index === currentBgIndex;
          const isNext = index === nextBgIndex;
          
          return (
            <div
              key={image.id}
              className={`absolute inset-0 bg-image ${
                isCurrent && !isTransitioning
                  ? 'ken-burns-active opacity-100 z-10' 
                  : isNext && isTransitioning
                  ? 'ken-burns-enter opacity-100 z-20'
                  : 'opacity-0 z-0'
              }`}
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />
          );
        })}
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/40 via-[#0A1628]/20 to-[#0A1628]/60 z-30"></div>
      </div>

    

      {/* Spacer */}
      <div className={`transition-all duration-300 ${
        isScrolled ? 'h-16' : 'h-20'
      }`}></div>

      {/* Main Content Container */}
      <div className="relative z-40 flex-1 flex flex-col">
        {/* Hero Content - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-6xl mx-auto">
              {/* Hero Content */}
              <div className={`text-center transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                {/* Logo Section with Gold Accents */}
                <div className="mb-8 md:mb-10">
                  <div className="inline-flex items-center justify-center">
                    <div className="relative">
                      <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
                        <div className="relative animate-logo-fade-in">
                          <img 
                            src="/logo.png" 
                            alt="BIGWAY Real Estate" 
                            className="h-12 md:h-16 lg:h-20 w-auto object-contain hero-logo"
                            style={{
                              filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(212,175,55,0.5))'
                            }}
                          />
                        </div>
                        
                        <h1 
                          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-wide ml-[-0.5rem] md:ml-[-1rem]"
                          style={{
                            fontFamily: 'Orbitron, sans-serif',
                            backgroundImage: 'linear-gradient(to bottom, #F5C97A, #D4AF37, #B8941F)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.4))'
                          }}
                        >
                          BIGWAY
                        </h1>
                      </div>
                      
                      <div className="mb-5">
                        <div 
                          className="text-lg md:text-xl lg:text-2xl font-medium tracking-[0.15em] uppercase"
                          style={{
                            color: '#D4AF37',
                            fontFamily: 'Poppins, sans-serif',
                            textShadow: '0 0 15px rgba(212,175,55,0.4)'
                          }}
                        >
                          Luxury • Architecture • Real Estate
                        </div>
                      </div>
                      
                      <div className="relative h-[2px] w-40 md:w-52 mx-auto overflow-hidden">
                        <div 
                          className="absolute inset-0 animate-shimmer"
                          style={{
                            backgroundImage: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
                            backgroundSize: '200% 100%'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hero Heading - Gold Gradient */}
                <div className="mb-8 md:mb-12 relative max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight relative">
                    <span 
                      className="text-white drop-shadow-2xl"
                      style={{ fontFamily: 'Cinzel, serif' }}
                    >
                      Discover Luxury
                      <br />
                      <span 
                        className="text-2xl md:text-3xl lg:text-4xl font-medium mt-3 block bg-clip-text text-transparent"
                        style={{
                          fontFamily: 'Cinzel, serif',
                          backgroundImage: 'linear-gradient(135deg, #F5C97A, #D4AF37, #B8941F)',
                          filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))'
                        }}
                      >
                        Properties in Coimbatore
                      </span>
                    </span>
                  </h2>
                  
                  <p 
                    className="text-lg md:text-xl lg:text-2xl mb-4 max-w-2xl mx-auto leading-relaxed relative font-normal"
                    style={{
                      color: '#C7D1DB',
                      fontFamily: 'Lato, sans-serif',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    Premier real estate solutions in the Manchester of South India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Gold Themed */}
        <div className="pb-10 md:pb-16">
          {/* Search Section - Luxury Gold Design */}
          <div className="relative z-20 container mx-auto px-4 w-full">
            <div className="max-w-5xl mx-auto">
              <div className={`transition-all duration-1000 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="relative">
                  <div 
                    className="flex flex-col md:flex-row items-center gap-3 md:gap-4 p-5 md:p-6 rounded-2xl border-2 shadow-2xl"
                    style={{
                      backgroundColor: 'rgba(10,22,40,0.85)',
                      borderColor: 'rgba(212,175,55,0.4)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  >
                    {/* Location Filter */}
                    <div className="flex-1 w-full">
                      <label 
                        className="block text-base font-semibold mb-2"
                        style={{
                          color: '#D4AF37',
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '0 0 10px rgba(212,175,55,0.4)'
                        }}
                      >
                        Location
                      </label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full text-white text-base md:text-lg border-2 rounded-xl px-4 md:px-5 py-3 font-medium focus:outline-none transition-all duration-300 cursor-pointer luxury-select"
                        style={{
                          backgroundColor: 'rgba(16,38,63,0.8)',
                          borderColor: 'rgba(212,175,55,0.3)',
                          fontFamily: 'Lato, sans-serif'
                        }}
                      >
                        {locations.map((location) => (
                          <option key={location} value={location} className="text-base" style={{backgroundColor: '#10263f'}}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Property Type Filter */}
                    <div className="flex-1 w-full">
                      <label 
                        className="block text-base font-semibold mb-2"
                        style={{
                          color: '#D4AF37',
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '0 0 10px rgba(212,175,55,0.4)'
                        }}
                      >
                        Property Type
                      </label>
                      <select
                        value={selectedPropertyType}
                        onChange={(e) => setSelectedPropertyType(e.target.value)}
                        className="w-full text-white text-base md:text-lg border-2 rounded-xl px-4 md:px-5 py-3 font-medium focus:outline-none transition-all duration-300 cursor-pointer luxury-select"
                        style={{
                          backgroundColor: 'rgba(16,38,63,0.8)',
                          borderColor: 'rgba(212,175,55,0.3)',
                          fontFamily: 'Lato, sans-serif'
                        }}
                      >
                        {propertyTypes.map((type) => (
                          <option key={type} value={type} className="text-base" style={{backgroundColor: '#10263f'}}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Button - Gold Gradient */}
                    <div className="w-full md:w-auto">
                      <label 
                        className="block text-base font-semibold mb-2 invisible md:visible"
                        style={{ color: '#D4AF37' }}
                      >
                        &nbsp;
                      </label>
                      <button
                        onClick={handleSearch}
                        className="w-full py-3.5 px-10 rounded-xl font-bold text-base md:text-lg transition-all duration-500 flex items-center justify-center gap-2 group overflow-hidden relative"
                        style={{
                          backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5C97A 50%, #D4AF37 100%)',
                          backgroundSize: '200% 100%',
                          color: '#0A1628',
                          fontFamily: 'Poppins, sans-serif',
                          letterSpacing: '0.05em',
                          boxShadow: '0 10px 30px rgba(212,175,55,0.4)'
                        }}
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-shimmer-fast" style={{ backgroundSize: '200% 100%' }} />
                        
                        <svg className="relative z-10 w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="relative z-10">Search</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Navigation - Gold Themed */}
          <div className="relative z-30 mt-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center space-y-3">
                  {/* Current Location Indicator - Gold */}
                  <div 
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full border-2 shadow-xl"
                    style={{
                      backgroundColor: 'rgba(10,22,40,0.85)',
                      borderColor: 'rgba(212,175,55,0.5)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.4), 0 0 20px rgba(212,175,55,0.2)'
                    }}
                  >
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#D4AF37' }} />
                      <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#D4AF37' }} />
                    </div>
                    <span 
                      className="text-sm font-medium tracking-wide"
                      style={{
                        color: '#F5C97A',
                        fontFamily: 'Poppins, sans-serif',
                        textShadow: '0 0 10px rgba(212,175,55,0.4)'
                      }}
                    >
                      {backgroundImages[currentBgIndex].location}
                    </span>
                  </div>

                  {/* Image Thumbnails - Gold Accented */}
                  <div 
                    className="flex items-center space-x-2 md:space-x-3 px-4 py-3 rounded-2xl border-2 shadow-xl"
                    style={{
                      backgroundColor: 'rgba(10,22,40,0.85)',
                      borderColor: 'rgba(212,175,55,0.3)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.4)'
                    }}
                  >
                    {backgroundImages.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => handleBgNavigation(index)}
                        className={`group relative transition-all duration-500 ${
                          index === currentBgIndex 
                            ? 'scale-110' 
                            : 'scale-100 opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-500 ${
                          index === currentBgIndex
                            ? 'shadow-lg'
                            : 'group-hover:border-[#F5C97A]'
                        }`}
                        style={{
                          borderColor: index === currentBgIndex ? '#D4AF37' : 'rgba(212,175,55,0.3)',
                          boxShadow: index === currentBgIndex ? '0 0 20px rgba(212,175,55,0.6)' : 'none'
                        }}
                        >
                          <img 
                            src={image.thumbnail} 
                            alt={image.location}
                            className={`w-full h-full object-cover transition-all duration-700 ${
                              index === currentBgIndex 
                                ? 'scale-110 brightness-110' 
                                : 'scale-100 brightness-90 group-hover:scale-105 group-hover:brightness-100'
                            }`}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        
        * {
          box-sizing: border-box;
        }

        /* Ken Burns Effect */
        .bg-image {
          transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }

        @keyframes kenBurnsZoomPan {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.08) translate(-2%, -1%);
          }
          100% {
            transform: scale(1.15) translate(-4%, -2%);
          }
        }

        .ken-burns-active {
          animation: kenBurnsZoomPan 12s ease-out forwards;
        }

        .ken-burns-enter {
          animation: kenBurnsZoomPan 12s ease-out forwards;
        }

        /* Floating Animations */
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

        @keyframes logoFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
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

        .animate-blueprint {
          animation: blueprint 10s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 4s infinite;
        }

        .animate-shimmer-fast {
          animation: shimmer-fast 1.5s linear infinite;
        }

        .animate-logo-fade-in {
          animation: logoFadeIn 1.5s ease-out forwards;
        }

        /* Luxury Select Styling */
        .luxury-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em 1em;
          padding-right: 3rem;
        }

        .luxury-select:hover {
          border-color: rgba(212,175,55,0.6) !important;
          box-shadow: 0 0 20px rgba(212,175,55,0.2);
        }

        .luxury-select:focus {
          border-color: rgba(212,175,55,0.8) !important;
          box-shadow: 0 0 25px rgba(212,175,55,0.3);
        }

        .luxury-select option {
          padding: 10px;
          font-size: 0.95rem;
        }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(10,22,40,0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(212,175,55,0.4);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(212,175,55,0.6);
        }

        /* Font Smoothing */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* Responsive Typography */
        @media (max-width: 640px) {
          section {
            min-height: 100vh;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          section {
            min-height: 100vh;
          }
        }

        @media (min-width: 1025px) {
          section {
            min-height: 100vh;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;