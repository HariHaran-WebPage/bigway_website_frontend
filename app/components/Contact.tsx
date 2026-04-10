"use client";
import { useState, useEffect, useRef } from 'react';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: '#'
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: '#'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: '#'
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: '#'
    }
  ];

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      title: 'Office Locations',
      content: 'Chennai · Bangalore · Hyderabad · Coimbatore'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
      ),
      title: 'Phone',
      content: '+91 90000 00000'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      title: 'Email',
      content: 'contact@bigway.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: 'Working Hours',
      content: 'Monday – Saturday, 9:00 AM – 7:00 PM'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0D1B2E 50%, #0A1628 100%)',
      }}
    >
      {/* Enhanced Background */}
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
            {/* Icon */}
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
              <svg className="w-5 h-5 text-[#D4AF37] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
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
              Contact Us
            </span>

            <svg className="w-4 h-4 text-[#D4AF37] animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT: Contact Info */}
          <div 
            className={`backdrop-blur-xl rounded-3xl p-10 border-2 relative overflow-hidden transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(16,38,63,0.8))',
              borderColor: 'rgba(212,175,55,0.4)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            {/* Background Glow */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-30 blur-2xl -z-10"
              style={{
                backgroundImage: 'radial-gradient(circle at top left, rgba(212,175,55,0.3), transparent 70%)'
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

            {/* Header */}
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <span className="text-white block mb-2">Get in Touch</span>
              <span 
                className="bg-clip-text text-transparent animate-gradient-shift block"
                style={{ 
                  backgroundImage: 'linear-gradient(to right, #F5C97A, #D4AF37, #B8941F)',
                  backgroundSize: '200% 100%',
                  filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))'
                }}
              >
                With BIGWAY
              </span>
            </h2>

            <p 
              className="text-[#C7D1DB] mb-10 text-lg leading-relaxed"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Our real estate experts are ready to help you buy, sell, or invest in the right property.
            </p>

            {/* Contact Info Items */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="group relative backdrop-blur-xl rounded-xl p-5 border-2 transition-all duration-500 cursor-pointer hover:scale-105"
                  style={{
                    backgroundImage: hoveredInfo === index 
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(16,38,63,0.7))' 
                      : 'linear-gradient(135deg, rgba(16,38,63,0.4), rgba(10,22,40,0.6))',
                    borderColor: hoveredInfo === index ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)',
                    boxShadow: hoveredInfo === index 
                      ? '0 10px 40px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : '0 5px 20px rgba(0,0,0,0.3)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${(index * 100) + 400}ms`
                  }}
                  onMouseEnter={() => setHoveredInfo(index)}
                  onMouseLeave={() => setHoveredInfo(null)}
                >
                  {/* Background Glow on Hover */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.2), transparent 70%)'
                    }}
                  />

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(245,201,122,0.2))',
                        border: '2px solid rgba(212,175,55,0.5)',
                        boxShadow: '0 4px 15px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      <div className="text-[#D4AF37]">
                        {info.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p 
                        className="text-[#F5C97A] font-bold text-sm mb-1 transition-colors duration-300 group-hover:text-[#D4AF37]"
                        style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '0 0 10px rgba(245,201,122,0.3)'
                        }}
                      >
                        {info.title}
                      </p>
                      <p 
                        className="text-[#C7D1DB] text-base transition-colors duration-300 group-hover:text-white"
                        style={{ fontFamily: 'Lato, sans-serif' }}
                      >
                        {info.content}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <svg 
                      className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Bottom Accent */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl transition-all duration-500"
                    style={{
                      backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.9), transparent)',
                      opacity: hoveredInfo === index ? 1 : 0,
                      boxShadow: hoveredInfo === index ? '0 0 15px rgba(212,175,55,0.6)' : 'none'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Social Media Icons - FIXED VERSION */}
            <div className="mt-10 pt-8 border-t border-[#D4AF37]/20">
              <p 
                className="text-[#F5C97A] font-bold mb-4 text-sm"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Connect With Us
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="group relative"
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    aria-label={social.name}
                  >
                    <div 
                      className="w-11 h-11 flex items-center justify-center rounded-lg transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                      style={{
                        backgroundImage: hoveredSocial === social.name 
                          ? 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(245,201,122,0.2))'
                          : 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(16,38,63,0.5))',
                        border: `2px solid ${hoveredSocial === social.name ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.4)'}`,
                        boxShadow: hoveredSocial === social.name 
                          ? '0 10px 30px rgba(212,175,55,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
                          : '0 4px 15px rgba(212,175,55,0.2)',
                        color: hoveredSocial === social.name ? '#F5C97A' : '#D4AF37'
                      }}
                    >
                      {social.icon}
                    </div>
                    
                    {/* Tooltip */}
                    <div 
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg backdrop-blur-xl border transition-all duration-300 whitespace-nowrap pointer-events-none"
                      style={{
                        backgroundColor: 'rgba(10,22,40,0.95)',
                        borderColor: 'rgba(212,175,55,0.5)',
                        opacity: hoveredSocial === social.name ? 1 : 0,
                        transform: hoveredSocial === social.name ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-5px)'
                      }}
                    >
                      <span 
                        className="text-[#D4AF37] text-xs font-bold"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {social.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div 
            className={`backdrop-blur-xl rounded-3xl p-10 border-2 relative overflow-hidden transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(16,38,63,0.8), rgba(10,22,40,0.9))',
              borderColor: 'rgba(212,175,55,0.4)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            {/* Background Glow */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-20 blur-2xl -z-10"
              style={{
                backgroundImage: 'radial-gradient(circle at top right, rgba(212,175,55,0.3), transparent 70%)'
              }}
            />

            {/* Corner Accents */}
            <div 
              className="absolute -top-2 -right-2 w-24 h-24 border-t-[3px] border-r-[3px] rounded-tr-3xl opacity-40"
              style={{ 
                borderColor: '#D4AF37',
                filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))'
              }}
            />

            <h3 
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ 
                fontFamily: 'Cinzel, serif',
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              Send Us an Enquiry
            </h3>
            <p 
              className="text-[#A0AEC0] mb-8"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Fill out the form and we'll get back to you within 24 hours
            </p>

            <form className="space-y-5">
              {/* Name Input */}
              <div className="relative group">
                <label 
                  className="block text-[#D4AF37] text-sm font-bold mb-2 transition-all duration-300"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    opacity: focusedField === 'name' ? 1 : 0.7
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl px-5 py-4 transition-all duration-500 focus:outline-none"
                  style={{
                    backgroundColor: 'rgba(16,38,63,0.6)',
                    border: `2px solid ${focusedField === 'name' ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.3)'}`,
                    color: '#FFFFFF',
                    fontFamily: 'Lato, sans-serif',
                    boxShadow: focusedField === 'name' 
                      ? '0 0 25px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                />
                {focusedField === 'name' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl animate-shimmer"
                    style={{
                      backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)',
                      backgroundSize: '200% 100%'
                    }}
                  />
                )}
              </div>

              {/* Phone Input */}
              <div className="relative group">
                <label 
                  className="block text-[#D4AF37] text-sm font-bold mb-2 transition-all duration-300"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    opacity: focusedField === 'phone' ? 1 : 0.7
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 90000 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl px-5 py-4 transition-all duration-500 focus:outline-none"
                  style={{
                    backgroundColor: 'rgba(16,38,63,0.6)',
                    border: `2px solid ${focusedField === 'phone' ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.3)'}`,
                    color: '#FFFFFF',
                    fontFamily: 'Lato, sans-serif',
                    boxShadow: focusedField === 'phone' 
                      ? '0 0 25px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                />
                {focusedField === 'phone' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl animate-shimmer"
                    style={{
                      backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)',
                      backgroundSize: '200% 100%'
                    }}
                  />
                )}
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label 
                  className="block text-[#D4AF37] text-sm font-bold mb-2 transition-all duration-300"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    opacity: focusedField === 'email' ? 1 : 0.7
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl px-5 py-4 transition-all duration-500 focus:outline-none"
                  style={{
                    backgroundColor: 'rgba(16,38,63,0.6)',
                    border: `2px solid ${focusedField === 'email' ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.3)'}`,
                    color: '#FFFFFF',
                    fontFamily: 'Lato, sans-serif',
                    boxShadow: focusedField === 'email' 
                      ? '0 0 25px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                />
                {focusedField === 'email' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl animate-shimmer"
                    style={{
                      backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)',
                      backgroundSize: '200% 100%'
                    }}
                  />
                )}
              </div>

              {/* City Select */}
              <div className="relative group">
                <label 
                  className="block text-[#D4AF37] text-sm font-bold mb-2 transition-all duration-300"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    opacity: focusedField === 'city' ? 1 : 0.7
                  }}
                >
                  Select City
                </label>
                <select 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  onFocus={() => setFocusedField('city')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl px-5 py-4 transition-all duration-500 focus:outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(16,38,63,0.6)',
                    border: `2px solid ${focusedField === 'city' ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.3)'}`,
                    color: formData.city ? '#FFFFFF' : '#A0AEC0',
                    fontFamily: 'Lato, sans-serif',
                    boxShadow: focusedField === 'city' 
                      ? '0 0 25px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                >
                  <option value="">Choose your city</option>
                  <option value="chennai">Chennai</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="coimbatore">Coimbatore</option>
                </select>
                <svg 
                  className="absolute right-4 top-[50px] w-5 h-5 text-[#D4AF37] pointer-events-none transition-transform duration-300"
                  style={{
                    transform: focusedField === 'city' ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {focusedField === 'city' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl animate-shimmer"
                    style={{
                      backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)',
                      backgroundSize: '200% 100%'
                    }}
                  />
                )}
              </div>

              {/* Message Textarea */}
              <div className="relative group">
                <label 
                  className="block text-[#D4AF37] text-sm font-bold mb-2 transition-all duration-300"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    opacity: focusedField === 'message' ? 1 : 0.7
                  }}
                >
                  Your Message
                </label>
                <textarea
                  placeholder="Tell us about your property requirements..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl px-5 py-4 transition-all duration-500 focus:outline-none resize-none"
                  style={{
                    backgroundColor: 'rgba(16,38,63,0.6)',
                    border: `2px solid ${focusedField === 'message' ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.3)'}`,
                    color: '#FFFFFF',
                    fontFamily: 'Lato, sans-serif',
                    boxShadow: focusedField === 'message' 
                      ? '0 0 25px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                />
                {focusedField === 'message' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl animate-shimmer"
                    style={{
                      backgroundImage: 'linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)',
                      backgroundSize: '200% 100%'
                    }}
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group relative w-full py-4 rounded-xl font-bold text-base overflow-hidden transition-all duration-500 hover:scale-105 mt-2"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5C97A 50%, #D4AF37 100%)',
                  backgroundSize: '200% 100%',
                  color: '#0A1628',
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.05em',
                  boxShadow: '0 15px 50px rgba(212,175,55,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 group-hover:animate-shimmer-fast" style={{ backgroundSize: '200% 100%' }} />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Send Enquiry
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </span>
              </button>
            </form>

            {/* Trust Badge */}
            <div 
              className="mt-6 p-4 rounded-xl border flex items-center gap-3"
              style={{
                backgroundColor: 'rgba(212,175,55,0.05)',
                borderColor: 'rgba(212,175,55,0.3)'
              }}
            >
              <svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <p 
                className="text-[#C7D1DB] text-sm"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                <span className="text-[#F5C97A] font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Secure & Private:</span> Your information is protected with us
              </p>
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

        /* Custom Placeholder Styles */
        input::placeholder,
        textarea::placeholder,
        select option[value=""] {
          color: rgba(160, 174, 192, 0.6);
        }

        /* Custom Select Styles for Dark Mode */
        select option {
          background-color: #0D1B2E;
          color: #FFFFFF;
        }
      `}</style>
    </section>
  );
}