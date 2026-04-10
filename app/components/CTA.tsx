"use client";
import { useState, useEffect, useRef } from 'react';

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0D1B2E 50%, #0A1628 100%)',
      }}
    >
      {/* Enhanced Background Effects */}
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-25 blur-[150px] animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(245,201,122,0.2) 30%, transparent 70%)',
          }}
        />

        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-3 h-3 rounded-full bg-[#D4AF37] opacity-40 animate-float" />
        <div className="absolute top-40 right-32 w-2 h-2 rounded-full bg-[#F5C97A] opacity-30 animate-float-delayed" />
        <div className="absolute bottom-32 left-40 w-4 h-4 rounded-full bg-[#D4AF37] opacity-20 animate-card-float" />
        <div className="absolute bottom-20 right-20 w-2 h-2 rounded-full bg-[#F5C97A] opacity-40 animate-card-float-reverse" />

        {/* Corner Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,22,40,0.8) 100%)'
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-6xl mx-auto">
        {/* Decorative Top Badge */}
        <div 
          className={`flex justify-center mb-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(16,38,63,0.8) 50%, rgba(10,22,40,0.9) 100%)',
              borderColor: 'rgba(212,175,55,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <div 
              className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse-slow"
              style={{
                boxShadow: '0 0 10px rgba(212,175,55,0.8)'
              }}
            />
            <span 
              className="text-[#D4AF37] tracking-[0.2em] text-xs font-extrabold uppercase"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 15px rgba(212,175,55,0.5)'
              }}
            >
              Get Started Today
            </span>
            <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>

        {/* Main Content Box */}
        <div 
          className="backdrop-blur-xl rounded-3xl p-12 md:p-16 border-2 text-center relative overflow-hidden transition-all duration-1000 delay-200"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(16,38,63,0.6), rgba(10,22,40,0.8))',
            borderColor: 'rgba(212,175,55,0.4)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          {/* Background Glow */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-50 blur-2xl -z-10"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.2), transparent 70%)'
            }}
          />

          {/* Corner Accents */}
          <div 
            className="absolute -top-2 -left-2 w-24 h-24 border-t-[3px] border-l-[3px] rounded-tl-3xl opacity-40"
            style={{ 
              borderColor: '#D4AF37',
              filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))'
            }}
          />
          <div 
            className="absolute -bottom-2 -right-2 w-24 h-24 border-b-[3px] border-r-[3px] rounded-br-3xl opacity-40"
            style={{ 
              borderColor: '#D4AF37',
              filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))'
            }}
          />

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div 
              className="relative w-20 h-20 flex items-center justify-center rounded-2xl transition-all duration-700 hover:scale-110 hover:rotate-6"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(245,201,122,0.2))',
                border: '3px solid rgba(212,175,55,0.6)',
                boxShadow: '0 10px 40px rgba(212,175,55,0.3), inset 0 2px 0 rgba(255,255,255,0.2)'
              }}
            >
              {/* Pulsing Ring */}
              <div 
                className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37] animate-ping-slow"
                style={{ opacity: 0.3 }}
              />
              
              <svg className="w-10 h-10 text-[#D4AF37] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            <span className="text-white block mb-2">Ready to Find Your</span>
            <span 
              className="bg-clip-text text-transparent animate-gradient-shift block"
              style={{ 
                backgroundImage: 'linear-gradient(to right, #F5C97A, #D4AF37, #B8941F, #D4AF37, #F5C97A)',
                backgroundSize: '200% 100%',
                filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.3))'
              }}
            >
              Perfect Property?
            </span>
          </h2>

          {/* Description */}
          <p 
            className="text-[#C7D1DB] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Talk to our{' '}
            <span 
              className="text-[#F5C97A] font-bold"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 0 10px rgba(245,201,122,0.4)'
              }}
            >
              real estate experts
            </span>
            {' '}and get personalized property recommendations today.
          </p>

          {/* Divider Line */}
          <div className="flex items-center justify-center mb-10">
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
            <div 
              className="mx-4 w-3 h-3 rounded-full border-2 border-[#D4AF37]"
              style={{
                boxShadow: '0 0 15px rgba(212,175,55,0.6)'
              }}
            />
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            {/* Primary Button */}
            <button 
              className="group relative px-10 py-4 rounded-xl font-bold text-base overflow-hidden transition-all duration-500 hover:scale-105"
              style={{
                backgroundImage: hoveredButton === 'primary' 
                  ? 'linear-gradient(135deg, #F5C97A 0%, #D4AF37 50%, #B8941F 100%)' 
                  : 'linear-gradient(135deg, #D4AF37 0%, #F5C97A 50%, #D4AF37 100%)',
                backgroundSize: '200% 100%',
                color: '#0A1628',
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0.05em',
                boxShadow: hoveredButton === 'primary'
                  ? '0 15px 50px rgba(212,175,55,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                  : '0 10px 40px rgba(212,175,55,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
              onMouseEnter={() => setHoveredButton('primary')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 group-hover:animate-shimmer-fast" style={{ backgroundSize: '200% 100%' }} />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Contact Agent
              </span>
            </button>

            {/* Secondary Button */}
            <button 
              className="group relative px-10 py-4 rounded-xl font-bold text-base border-2 transition-all duration-500 overflow-hidden hover:scale-105"
              style={{
                borderColor: hoveredButton === 'secondary' ? 'rgba(212,175,55,0.9)' : 'rgba(212,175,55,0.5)',
                backgroundColor: hoveredButton === 'secondary' ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.05)',
                color: hoveredButton === 'secondary' ? '#F5C97A' : '#D4AF37',
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0.05em',
                boxShadow: hoveredButton === 'secondary'
                  ? '0 15px 40px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : '0 8px 30px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={() => setHoveredButton('secondary')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {/* Hover Gradient Background */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  backgroundSize: '200% 100%'
                }}
              />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                Request Callback
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-[#D4AF37]/20">
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[
                { icon: '⚡', text: 'Instant Response', value: '24/7' },
                { icon: '🏆', text: 'Expert Agents', value: '25+' },
                { icon: '✓', text: 'Happy Clients', value: '100+' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div 
                    className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(16,38,63,0.5))',
                      border: '2px solid rgba(212,175,55,0.4)',
                      boxShadow: '0 4px 15px rgba(212,175,55,0.2)'
                    }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="text-left">
                    <p 
                      className="text-[#D4AF37] font-bold text-lg"
                      style={{ 
                        fontFamily: 'Cinzel, serif',
                        textShadow: '0 0 10px rgba(212,175,55,0.3)'
                      }}
                    >
                      {item.value}
                    </p>
                    <p 
                      className="text-[#A0AEC0] text-sm"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Styles with Animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(10px, -10px) scale(1.1);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-10px, 10px) scale(1.1);
          }
        }

        @keyframes card-float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(15px, -15px);
          }
        }

        @keyframes card-float-reverse {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-15px, 15px);
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
            opacity: 0.25;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
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
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-card-float {
          animation: card-float 12s ease-in-out infinite;
        }

        .animate-card-float-reverse {
          animation: card-float-reverse 14s ease-in-out infinite;
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

        .animate-blueprint {
          animation: blueprint 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}