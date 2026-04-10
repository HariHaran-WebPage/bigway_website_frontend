'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Service {
  id: number;
  type: '3d-model' | '3d-video' | 'image';
  media: string;
  title: string;
  description: string;
  benefits: string[];
  icon: string;
  tagline: string;
}

const WhyChooseUsRealEstate: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const GOLD_PRIMARY = '#D4AF37';
  const GOLD_LIGHT = 'rgba(212,175,55,0.3)';
  const GOLD_GLOW = 'rgba(212,175,55,0.5)';
  const BG_DARK = 'rgba(10,22,40,0.85)';
  const BG_DARKER = 'rgba(0,0,0,0.4)';

  const services: Service[] = [
    {
      id: 1,
      type: '3d-model',
      media: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=900&fit=crop&q=90',
      title: 'Virtual Property Tours',
      tagline: 'Step Inside From Anywhere',
      description: 'Immersive 3D walkthroughs that let you explore every corner of your future home without leaving your couch.',
      benefits: ['360° Views', 'VR Ready', 'Instant Access', 'HD Quality'],
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      id: 2,
      type: '3d-video',
      media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Cinematic Flythrough',
      tagline: 'Hollywood-Style Property Videos',
      description: 'Professional drone footage and 3D animations that showcase properties like never before.',
      benefits: ['Drone Shots', '4K Video', 'Neighborhood Tour', 'Professional Edit'],
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    },
    {
      id: 3,
      type: 'image',
      media: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=900&fit=crop&q=90',
      title: 'Smart Home Tech',
      tagline: 'Living in the Future',
      description: 'State-of-the-art IoT integration with voice control, automated climate, and security systems.',
      benefits: ['Voice Control', 'Auto Climate', 'Smart Security', 'Energy Saving'],
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    },
    {
      id: 4,
      type: '3d-model',
      media: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&h=900&fit=crop&q=90',
      title: 'Architectural Models',
      tagline: "See Before It's Built",
      description: 'Detailed 3D models of under-construction properties with material selection and customization.',
      benefits: ['Pre-Launch', 'Material Choice', 'Customization', 'Progress Track'],
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    {
      id: 5,
      type: '3d-video',
      media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'Neighborhood Explorer',
      tagline: 'Know Your Community',
      description: 'Immersive tours of surrounding areas including schools, parks, shopping, and transport links.',
      benefits: ['Area Insights', 'Amenities Map', 'School Info', 'Transit Links'],
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
    },
    {
      id: 6,
      type: 'image',
      media: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=900&fit=crop&q=90',
      title: 'AI Investment Analytics',
      tagline: 'Data-Driven Decisions',
      description: 'Advanced AI algorithms predict ROI, rental yields, price trends, and market opportunities.',
      benefits: ['ROI Predictor', 'Market Analysis', 'Price Trends', 'Investment Score'],
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    setIsMounted(true);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const id = parseInt(key);
      const video = videoRefs.current[id];
      if (video) {
        if (id === services[activeIndex].id && services[activeIndex].type === '3d-video') {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [activeIndex]);

  const generateParticleData = () =>
    Array.from({ length: 20 }, (_, i) => {
      const seed = i * 137;
      return {
        width: ((seed * 13) % 8) + 2,
        height: ((seed * 17) % 8) + 2,
        left: ((seed * 19) % 98) + 1,
        top: ((seed * 23) % 98) + 1,
        shadow: ((seed * 29) % 20) + 10,
        delay: ((seed * 31) % 5),
        duration: ((seed * 37) % 10) + 15,
      };
    });

  const particleData = isMounted ? generateParticleData() : [];

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setActiveIndex((p) => (p + 1) % services.length);
      else setActiveIndex((p) => (p - 1 + services.length) % services.length);
    }
    setTouchStart(null);
  };

  const stats = [
    { num: '500+', label: 'Properties', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { num: '1K+', label: 'Virtual Tours', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { num: '98%', label: 'Satisfaction', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { num: '24/7', label: 'Support', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  const trustBadges = [
    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Free Consultation' },
    { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Secure & Private' },
    { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', text: 'Award Winning' }
  ];

  return (
    <div
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg,#000 0%,#0A0E1A 25%,#050810 50%,#0A0E1A 75%,#000 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}
    >
      {/* ── BACKGROUND EFFECTS ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Wave SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
          <defs>
            <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: GOLD_PRIMARY, stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: GOLD_PRIMARY, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: GOLD_PRIMARY, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <path key={i} d={`M0,${100 + i * 150} Q250,${50 + i * 150} 500,${100 + i * 150} T1000,${100 + i * 150} T1500,${100 + i * 150} T2000,${100 + i * 150}`} stroke="url(#wg)" strokeWidth="2" fill="none" style={{ animation: `wave ${10 + i * 2}s ease-in-out ${i * 0.5}s infinite` }} />
          ))}
        </svg>

        {/* Particles */}
        {isMounted && particleData.map((p, i) => (
          <div key={i} style={{ position: 'absolute', width: p.width, height: p.height, borderRadius: '50%', backgroundColor: GOLD_PRIMARY, left: `${p.left}%`, top: `${p.top}%`, boxShadow: `0 0 ${p.shadow}px ${GOLD_GLOW}`, animation: `particle ${p.duration}s ease-in-out ${p.delay}s infinite` }} />
        ))}

        {/* Hex Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23D4AF37' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px', animation: 'rotateGrid 60s linear infinite' }} />

        {/* Pulse Rings */}
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: 300 + i * 200, height: 300 + i * 200, borderRadius: '50%', border: `2px solid ${GOLD_PRIMARY}40`, transform: 'translate(-50%,-50%)', animation: `pulseRing 4s ease-out ${i}s infinite` }} />
        ))}
      </div>

      {/* ── HERO SECTION ── */}
      <div style={{ position: 'relative', padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,32px) clamp(24px,5vw,48px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Title block */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,5vw,48px)', opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(30px)', transition: 'opacity 1s ease, transform 1s ease' }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 24px', borderRadius: 100, marginBottom: 24, border: `2px solid ${GOLD_PRIMARY}60`, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', animation: 'floatSmooth 4s ease-in-out infinite' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: GOLD_PRIMARY, animation: 'pulseGlow 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 'clamp(9px,1.5vw,11px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', color: GOLD_PRIMARY, fontFamily: "'Orbitron', sans-serif" }}>Premium Real Estate · Coimbatore</span>
            </div>

            {/* Heading */}
            <h1 style={{ margin: '0 0 12px', lineHeight: 1.08 }}>
              <div style={{ fontSize: 'clamp(1.6rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', fontFamily: "'Cinzel', serif", animation: 'slideUp 0.8s ease-out 0.1s both' }}>
                Experience Tomorrow's
              </div>
              <div style={{ fontSize: 'clamp(2rem,6.5vw,4.5rem)', fontWeight: 900, fontFamily: "'Cinzel', serif", background: `linear-gradient(135deg,${GOLD_PRIMARY} 0%,#F4E5B8 50%,${GOLD_PRIMARY} 100%)`, backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: `drop-shadow(0 0 30px ${GOLD_GLOW})`, animation: 'slideUp 0.8s ease-out 0.2s both, gradientFlow 4s ease infinite' }}>
                Living Today
              </div>
            </h1>

            <p style={{ fontSize: 'clamp(0.9rem,2.5vw,1.2rem)', color: '#B4C0D0', maxWidth: 600, margin: '0 auto', lineHeight: 1.8, fontFamily: "'Lato', sans-serif", animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
              Cutting-edge technology meets luxury living in Coimbatore
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(10px,2vw,20px)', marginBottom: 'clamp(32px,6vw,56px)' }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{ position: 'relative', padding: 'clamp(14px,3vw,24px)', borderRadius: 20, border: `2px solid ${GOLD_PRIMARY}30`, backgroundColor: BG_DARKER, backdropFilter: 'blur(20px)', textAlign: 'center', overflow: 'hidden', animation: `fadeInUp 0.8s ease-out ${0.5 + idx * 0.1}s both`, cursor: 'pointer', transition: 'transform 0.3s ease, border-color 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD_PRIMARY}80`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD_PRIMARY}30`; }}
              >
                <div style={{ width: 44, height: 44, margin: '0 auto 10px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg,${GOLD_LIGHT},transparent)`, border: `2px solid ${GOLD_PRIMARY}60` }}>
                  <svg style={{ width: 22, height: 22, color: GOLD_PRIMARY }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
                  </svg>
                </div>
                <div style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)', fontWeight: 900, fontFamily: "'Cinzel', serif", background: `linear-gradient(135deg,${GOLD_PRIMARY},#F4E5B8)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.num}</div>
                <div style={{ fontSize: 'clamp(9px,1.5vw,11px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', fontFamily: "'Poppins', sans-serif", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CAROUSEL ── */}
      <div style={{ position: 'relative', padding: '0 clamp(16px,4vw,32px) clamp(32px,6vw,56px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
            {services.map((svc, idx) => (
              <button key={svc.id} onClick={() => setActiveIndex(idx)} aria-label={`View ${svc.title}`} style={{ position: 'relative', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
                {activeIndex === idx && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: GOLD_PRIMARY, opacity: 0.4, animation: 'ping 1s ease-out infinite' }} />}
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: activeIndex === idx ? GOLD_PRIMARY : 'rgba(255,255,255,0.3)', transform: activeIndex === idx ? 'scale(1.5)' : 'scale(1)', transition: 'all 0.4s ease' }} />
              </button>
            ))}
          </div>

          {/* Cards */}
          <div
            style={{ position: 'relative', minHeight: 'clamp(560px,80vw,680px)' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {services.map((service, idx) => {
              const isActive = activeIndex === idx;
              const isPrev = idx === (activeIndex - 1 + services.length) % services.length;
              const isNext = idx === (activeIndex + 1) % services.length;
              return (
                <div key={service.id} style={{
                  position: 'absolute', inset: 0,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0) scale(1)' : isPrev ? 'translateX(-60%) scale(0.85)' : isNext ? 'translateX(60%) scale(0.85)' : 'scale(0.7)',
                  transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
                  zIndex: isActive ? 20 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}>
                  {/* Responsive 2-col on ≥768px, 1-col on mobile */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 'clamp(16px,3vw,36px)', alignItems: 'center', height: '100%' }}>

                    {/* Image */}
                    <div style={{ position: 'relative', minHeight: 'clamp(220px,40vw,480px)', order: 2 }}>
                      <div style={{ position: 'relative', height: '100%', minHeight: 'clamp(220px,40vw,480px)', borderRadius: 20, overflow: 'hidden', border: `3px solid ${GOLD_PRIMARY}80`, boxShadow: `0 24px 70px ${GOLD_GLOW}`, transform: isMounted ? `perspective(1200px) rotateY(${mousePosition.x * 4}deg) rotateX(${mousePosition.y * -2}deg)` : 'none', transition: 'transform 0.3s ease-out' }}>
                        {service.type === '3d-video' ? (
                          <video ref={(el) => { videoRefs.current[service.id] = el; }} src={service.media} loop muted playsInline autoPlay={isActive} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <img src={service.media} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${GOLD_LIGHT} 0%,transparent 50%,${GOLD_LIGHT} 100%)`, opacity: 0.35, mixBlendMode: 'overlay' }} />
                        {/* Corner accents */}
                        {[0,1,2,3].map(c => (
                          <div key={c} style={{ position: 'absolute', width: 48, height: 48, [c < 2 ? 'top' : 'bottom']: 12, [c % 2 === 0 ? 'left' : 'right']: 12, animation: `cornerPulse 2s ease-in-out ${c * 0.2}s infinite` }}>
                            <div style={{ position: 'absolute', inset: 0, border: `3px solid ${GOLD_PRIMARY}`, [c < 2 ? 'borderBottom' : 'borderTop']: 'none', [c % 2 === 0 ? 'borderRight' : 'borderLeft']: 'none', borderRadius: c === 0 ? '14px 0 0 0' : c === 1 ? '0 14px 0 0' : c === 2 ? '0 0 0 14px' : '0 0 14px 0' }} />
                          </div>
                        ))}
                        {/* Type badge */}
                        <div style={{ position: 'absolute', top: 16, right: 16, padding: '6px 14px', borderRadius: 100, backgroundColor: BG_DARKER, border: `2px solid ${GOLD_PRIMARY}`, backdropFilter: 'blur(14px)', boxShadow: `0 0 24px ${GOLD_GLOW}`, animation: 'floatSmooth 3.5s ease-in-out infinite' }}>
                          <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: GOLD_PRIMARY, fontFamily: "'Poppins', sans-serif" }}>{service.type.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <div style={{ position: 'absolute', inset: -30, zIndex: -1, background: `radial-gradient(circle,${GOLD_GLOW},transparent 65%)`, filter: 'blur(40px)', animation: 'pulseSlow 4s ease-in-out infinite' }} />
                    </div>

                    {/* Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,2vw,18px)', order: 1 }}>
                      {/* Icon */}
                      <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg,${GOLD_GLOW},${GOLD_LIGHT})`, border: `3px solid ${GOLD_PRIMARY}`, boxShadow: `0 16px 40px ${GOLD_GLOW}`, animation: 'floatSmooth 4s ease-in-out infinite', flexShrink: 0 }}>
                        <svg style={{ width: 26, height: 26, color: GOLD_PRIMARY }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={service.icon} />
                        </svg>
                      </div>

                      <div style={{ fontSize: 'clamp(10px,2vw,13px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: GOLD_PRIMARY, fontFamily: "'Orbitron', sans-serif", textShadow: `0 0 16px ${GOLD_GLOW}` }}>{service.tagline}</div>

                      <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem,5vw,3.5rem)', fontWeight: 900, lineHeight: 1.1, color: '#fff', fontFamily: "'Cinzel', serif" }}>{service.title}</h2>

                      <p style={{ margin: 0, fontSize: 'clamp(0.85rem,2vw,1.1rem)', lineHeight: 1.8, color: '#B4C0D0', fontFamily: "'Lato', sans-serif" }}>{service.description}</p>

                      {/* Benefits */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(6px,1.5vw,12px)' }}>
                        {service.benefits.map((benefit, bidx) => (
                          <div key={bidx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'clamp(8px,1.5vw,12px)', borderRadius: 12, border: `2px solid ${GOLD_PRIMARY}30`, backgroundColor: BG_DARKER, backdropFilter: 'blur(10px)', animation: `fadeInRight 0.6s ease-out ${bidx * 0.1}s both`, transition: 'transform 0.3s, border-color 0.3s', cursor: 'default' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD_PRIMARY}70`; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD_PRIMARY}30`; }}
                          >
                            <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: GOLD_LIGHT, border: `2px solid ${GOLD_PRIMARY}60` }}>
                              <svg style={{ width: 14, height: 14, color: GOLD_PRIMARY }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span style={{ fontSize: 'clamp(10px,1.8vw,13px)', fontWeight: 700, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 'clamp(12px,2vw,16px) clamp(20px,4vw,32px)', borderRadius: 16, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 'clamp(12px,2vw,15px)', letterSpacing: '0.08em', background: `linear-gradient(135deg,${GOLD_PRIMARY},${GOLD_PRIMARY}CC)`, color: '#000', fontFamily: "'Poppins', sans-serif", boxShadow: `0 16px 44px ${GOLD_GLOW}`, transition: 'transform 0.3s, box-shadow 0.3s', alignSelf: 'flex-start' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.07)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 24px 60px ${GOLD_GLOW}`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 16px 44px ${GOLD_GLOW}`; }}
                      >
                        EXPLORE NOW
                        <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrow Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 28 }}>
            <button onClick={() => setActiveIndex(p => (p - 1 + services.length) % services.length)} style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${GOLD_PRIMARY}60`, backgroundColor: BG_DARKER, backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: GOLD_PRIMARY, transition: 'transform 0.3s, border-color 0.3s', boxShadow: `0 6px 20px ${GOLD_LIGHT}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD_PRIMARY; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = `${GOLD_PRIMARY}60`; }}
              aria-label="Previous">
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setActiveIndex(p => (p + 1) % services.length)} style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${GOLD_PRIMARY}60`, backgroundColor: BG_DARKER, backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: GOLD_PRIMARY, transition: 'transform 0.3s, border-color 0.3s', boxShadow: `0 6px 20px ${GOLD_LIGHT}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD_PRIMARY; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = `${GOLD_PRIMARY}60`; }}
              aria-label="Next">
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── CTA SECTION ── */}
      <div style={{ padding: '0 clamp(16px,4vw,32px) clamp(40px,8vw,80px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ position: 'relative', padding: 'clamp(28px,6vw,56px)', borderRadius: 32, border: `3px solid ${GOLD_PRIMARY}60`, backgroundColor: BG_DARK, backdropFilter: 'blur(40px)', boxShadow: `0 40px 100px ${GOLD_LIGHT}`, overflow: 'hidden' }}>
            {/* Animated grid bg */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: `linear-gradient(${GOLD_PRIMARY} 1px,transparent 1px),linear-gradient(90deg,${GOLD_PRIMARY} 1px,transparent 1px)`, backgroundSize: '40px 40px', animation: 'gridMove 20s linear infinite' }} />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 'clamp(1.6rem,5vw,3rem)', fontWeight: 900, color: '#fff', fontFamily: "'Cinzel', serif", lineHeight: 1.15 }}>
                Ready to Step Into<br />
                <span style={{ color: GOLD_PRIMARY, textShadow: `0 0 36px ${GOLD_GLOW}` }}>The Future?</span>
              </h3>
              <p style={{ fontSize: 'clamp(0.9rem,2.5vw,1.2rem)', color: '#B4C0D0', margin: '0 0 28px', fontFamily: "'Lato', sans-serif", lineHeight: 1.7 }}>Book your immersive 3D virtual tour today</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 28 }}>
                <button style={{ padding: 'clamp(12px,2vw,18px) clamp(22px,4vw,40px)', borderRadius: 16, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 'clamp(12px,2vw,16px)', letterSpacing: '0.07em', background: `linear-gradient(135deg,${GOLD_PRIMARY},${GOLD_PRIMARY}CC)`, color: '#000', fontFamily: "'Poppins', sans-serif", boxShadow: `0 16px 50px ${GOLD_GLOW}`, transition: 'transform 0.3s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}>
                  BOOK VIRTUAL TOUR
                </button>
                <button style={{ padding: 'clamp(12px,2vw,18px) clamp(22px,4vw,40px)', borderRadius: 16, border: `3px solid ${GOLD_PRIMARY}80`, cursor: 'pointer', fontWeight: 900, fontSize: 'clamp(12px,2vw,16px)', letterSpacing: '0.07em', backgroundColor: 'transparent', color: GOLD_PRIMARY, fontFamily: "'Poppins', sans-serif", transition: 'transform 0.3s, border-color 0.3s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD_PRIMARY; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = `${GOLD_PRIMARY}80`; }}>
                  VIEW PROPERTIES
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(12px,3vw,24px)' }}>
                {trustBadges.map((badge, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 7, animation: `fadeInUp 0.8s ease-out ${idx * 0.1}s both` }}>
                    <svg style={{ width: 18, height: 18, color: GOLD_PRIMARY, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.icon} />
                    </svg>
                    <span style={{ fontSize: 'clamp(11px,1.8vw,13px)', fontWeight: 700, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Lato:wght@300;400;600;700&family=Poppins:wght@500;600;700;800;900&family=Orbitron:wght@600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        @keyframes wave{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes particle{0%{transform:translateY(0) scale(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-80vh) scale(1);opacity:0}}
        @keyframes rotateGrid{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseRing{0%{transform:translate(-50%,-50%) scale(0.85);opacity:0.8}100%{transform:translate(-50%,-50%) scale(1.25);opacity:0}}
        @keyframes floatSmooth{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 8px #D4AF37,0 0 16px #D4AF37;transform:scale(1)}50%{box-shadow:0 0 20px #D4AF37,0 0 40px #D4AF37;transform:scale(1.15)}}
        @keyframes slideUp{from{transform:translateY(60%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes gradientFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes cornerPulse{0%,100%{opacity:0.55;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes pulseSlow{0%,100%{opacity:0.35}50%{opacity:0.75}}
        @keyframes gridMove{0%{transform:translate(0,0)}100%{transform:translate(40px,40px)}}
        @keyframes ping{0%{transform:scale(1);opacity:0.7}100%{transform:scale(2);opacity:0}}
      `}</style>
    </div>
  );
};

export default WhyChooseUsRealEstate;