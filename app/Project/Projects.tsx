'use client';
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
const useBreakpoint = () => {
  const [bp, setBp] = useState({ isMobile: false, isTablet: false, isDesktop: true, width: 1200 });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp({ isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024, width: w });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return bp;
};

// ─── ANIMATED GRID ─────────────────────────────────────────────────────────────
const AnimatedGrid = ({ hidden }: { hidden?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const frame = useRef(0);
  const blips = useRef<any[]>([]);

  useEffect(() => {
    if (hidden) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let W: number, H: number;

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    const blipInterval = setInterval(() => {
      blips.current.push({ col: Math.floor(Math.random() * 14), progress: 0, speed: 0.003 + Math.random() * 0.004, alpha: 0.7 + Math.random() * 0.3 });
    }, 900);

    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W, H);
      const COLS = 14, ROWS = 10;
      const cellW = W / COLS, cellH = H / ROWS;
      const t = frame.current * 0.012;

      for (let c = 0; c <= COLS; c++) {
        const x = c * cellW;
        const dx = x - mouse.current.x, dy = H / 2 - mouse.current.y;
        const proximity = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 300);
        const baseAlpha = 0.06 + proximity * 0.22;
        const grad = ctx.createLinearGradient(x, 0, x, H);
        grad.addColorStop(0, `rgba(212,175,55,0)`); grad.addColorStop(0.3, `rgba(212,175,55,${baseAlpha})`);
        grad.addColorStop(0.7, `rgba(212,175,55,${baseAlpha})`); grad.addColorStop(1, `rgba(212,175,55,0)`);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.strokeStyle = grad; ctx.lineWidth = proximity > 0.4 ? 1.5 : 0.8; ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        const y = r * cellH;
        const dx = W / 2 - mouse.current.x, dy = y - mouse.current.y;
        const proximity = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 300);
        const baseAlpha = 0.06 + proximity * 0.22;
        const grad = ctx.createLinearGradient(0, y, W, y);
        grad.addColorStop(0, `rgba(212,175,55,0)`); grad.addColorStop(0.2, `rgba(212,175,55,${baseAlpha})`);
        grad.addColorStop(0.8, `rgba(212,175,55,${baseAlpha})`); grad.addColorStop(1, `rgba(212,175,55,0)`);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = grad; ctx.lineWidth = proximity > 0.4 ? 1.5 : 0.8; ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        for (let r = 0; r <= ROWS; r++) {
          const x = c * cellW, y = r * cellH;
          const dx = x - mouse.current.x, dy = y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 200);
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + c * 0.5 + r * 0.7);
          const size = 1.2 + pulse * 0.6 + proximity * 4;
          const alpha = 0.12 + pulse * 0.1 + proximity * 0.65;
          ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${alpha})`; ctx.fill();
        }
      }
      const scanY = (Math.sin(t * 0.3) * 0.5 + 0.5) * H;
      const scanGrad = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
      scanGrad.addColorStop(0, 'rgba(212,175,55,0)'); scanGrad.addColorStop(0.5, 'rgba(212,175,55,0.10)'); scanGrad.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = scanGrad; ctx.fillRect(0, scanY - 80, W, 160);
      blips.current = blips.current.filter(b => b.progress < 1);
      for (const blip of blips.current) {
        blip.progress += blip.speed;
        const x = blip.col * cellW, y = blip.progress * H;
        const blipGrad = ctx.createLinearGradient(x, y - 60, x, y + 10);
        blipGrad.addColorStop(0, 'rgba(212,175,55,0)'); blipGrad.addColorStop(1, `rgba(255,220,100,${blip.alpha})`);
        ctx.beginPath(); ctx.moveTo(x, y - 60); ctx.lineTo(x, y);
        ctx.strokeStyle = blipGrad; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,100,${blip.alpha})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); clearInterval(blipInterval); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, [hidden]);

  if (hidden) return null;
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />;
};

// ─── SHARED SMALL COMPONENTS ──────────────────────────────────────────────────
const AnimatedLine = ({ delay = 0 }: { delay?: number }) => (
  <div style={{ width: 1, height: 60, background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.5), transparent)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-40%', left: 0, width: '100%', height: '40%', background: 'linear-gradient(180deg, transparent, rgba(255,220,100,0.95), transparent)', animation: 'lineTravelV 2.4s ease-in-out infinite', animationDelay: `${delay}s` }} />
  </div>
);
const PulsingOrb = ({ size = 6, delay = 0 }: { size?: number; delay?: number }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle, #F5C97A 0%, #D4AF37 60%, transparent 100%)', boxShadow: `0 0 ${size * 2}px rgba(212,175,55,0.9), 0 0 ${size * 4}px rgba(212,175,55,0.3)`, animation: 'orbPulse 2s ease-in-out infinite', animationDelay: `${delay}s` }} />
);
const RotatingDiamond = ({ delay = 0 }: { delay?: number }) => (
  <div style={{ position: 'relative', width: 22, height: 22, margin: '2px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(212,175,55,0.5)', transform: 'rotate(45deg)', animation: 'diamondSpin 7s linear infinite', animationDelay: `${delay}s` }} />
    <div style={{ width: 8, height: 8, background: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 14px rgba(212,175,55,0.9)', animation: 'diamondGlow 2.2s ease-in-out infinite', animationDelay: `${delay}s` }} />
  </div>
);

const AnimatedStatCard = ({ value, label, delay = 0, icon }: { value: string; label: string; delay?: number; icon?: React.ReactNode }) => (
  <div style={{ padding: '18px 22px', background: 'rgba(2,7,18,0.96)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 16, textAlign: 'center', position: 'relative', overflow: 'hidden', minWidth: 138, animation: 'cardFloat 4s ease-in-out infinite', animationDelay: `${delay}s`, boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(212,175,55,0.13)' }}>
    <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.07), transparent)', animation: 'shimmerSweep 3.5s ease-in-out infinite', animationDelay: `${delay + 0.4}s` }} />
    <div style={{ position: 'absolute', top: 0, left: '15%', width: '70%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }} />
    {icon && <div style={{ marginBottom: 7, display: 'flex', justifyContent: 'center' }}>{icon}</div>}
    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 26, fontWeight: 800, color: '#D4AF37', lineHeight: 1, marginBottom: 6, textShadow: '0 0 20px rgba(212,175,55,0.5)', animation: 'numberGlow 3s ease-in-out infinite', animationDelay: `${delay}s` }}>{value}</div>
    <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(199,209,219,0.6)' }}>{label}</div>
  </div>
);

const ProjectLeftPanel = ({ isVisible, hide }: { isVisible: boolean; hide: boolean }) => {
  if (hide) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 'calc((100% - 1000px) / 2)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-60px)', transition: 'opacity 1.4s cubic-bezier(.22,1,.36,1) 0.3s, transform 1.4s cubic-bezier(.22,1,.36,1) 0.3s', padding: '0 20px', pointerEvents: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>
        <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.4))' }} />
        <AnimatedStatCard value="5+" label="Premium Projects" delay={0.2} icon={<svg width="16" height="16" fill="none" stroke="#D4AF37" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
        <AnimatedLine delay={0} />
        <PulsingOrb size={6} delay={0} />
        <AnimatedLine delay={0.3} />
        <AnimatedStatCard value="₹850Cr+" label="Transaction Value" delay={0.6} icon={<svg width="16" height="16" fill="none" stroke="#D4AF37" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <AnimatedLine delay={0.6} />
        <RotatingDiamond delay={0} />
        <AnimatedLine delay={0.9} />
        <div style={{ padding: '10px 20px', background: 'rgba(2,7,18,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 50, animation: 'cardFloat 5s ease-in-out infinite 1s', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 10px rgba(212,175,55,1)', animation: 'orbPulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D4AF37' }}>COIMBATORE · EST. 2009</span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 10px rgba(212,175,55,1)', animation: 'orbPulse 1.5s ease-in-out infinite 0.7s' }} />
          </div>
        </div>
        <AnimatedLine delay={1.2} />
        <PulsingOrb size={6} delay={0.5} />
        <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg, rgba(212,175,55,0.4), transparent)' }} />
      </div>
      <div style={{ position: 'absolute', top: '8%', left: 12, width: 22, height: 22, borderLeft: '1.5px solid rgba(212,175,55,0.4)', borderTop: '1.5px solid rgba(212,175,55,0.4)', animation: 'bracketPulse 3s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '8%', left: 12, width: 22, height: 22, borderLeft: '1.5px solid rgba(212,175,55,0.4)', borderBottom: '1.5px solid rgba(212,175,55,0.4)', animation: 'bracketPulse 3s ease-in-out infinite 1s' }} />
    </div>
  );
};

const ProjectRightPanel = ({ isVisible, hide }: { isVisible: boolean; hide: boolean }) => {
  if (hide) return null;
  return (
    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 'calc((100% - 1000px) / 2)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(60px)', transition: 'opacity 1.4s cubic-bezier(.22,1,.36,1) 0.3s, transform 1.4s cubic-bezier(.22,1,.36,1) 0.3s', padding: '0 20px', pointerEvents: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>
        <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.4))' }} />
        <AnimatedStatCard value="2,400+" label="Happy Families" delay={0.4} icon={<div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>{[0, 1, 2, 3, 4].map(i => <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill="#D4AF37" style={{ filter: 'drop-shadow(0 0 3px rgba(212,175,55,0.7))' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}</div>} />
        <AnimatedLine delay={1.1} />
        <RotatingDiamond delay={1} />
        <AnimatedLine delay={1.4} />
        <AnimatedStatCard value="100%" label="Satisfaction" delay={1.0} />
        <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg, rgba(212,175,55,0.4), transparent)' }} />
      </div>
      <div style={{ position: 'absolute', top: '8%', right: 12, width: 22, height: 22, borderRight: '1.5px solid rgba(212,175,55,0.4)', borderTop: '1.5px solid rgba(212,175,55,0.4)', animation: 'bracketPulse 3s ease-in-out infinite 0.5s' }} />
      <div style={{ position: 'absolute', bottom: '8%', right: 12, width: 22, height: 22, borderRight: '1.5px solid rgba(212,175,55,0.4)', borderBottom: '1.5px solid rgba(212,175,55,0.4)', animation: 'bracketPulse 3s ease-in-out infinite 1.5s' }} />
    </div>
  );
};

// ─── MAP ──────────────────────────────────────────────────────────────────────
const PropertyMap = dynamic(
  () => import('react-leaflet').then((mod) => {
    const MapContent = ({ lat, lng, title }: { lat: number; lng: number; title: string }) => {
      const { MapContainer, TileLayer, Marker, Popup } = mod;
      const L = require('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png' });
      return (
        <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]}><Popup>{title}</Popup></Marker>
        </MapContainer>
      );
    };
    return MapContent;
  }),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#030A16', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontFamily: "'Orbitron',sans-serif" }}>Loading map...</div> }
);

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Testimonial { id: number; name: string; location: string; comment: string; rating: number; image: string; }
interface Project {
  id: number; name: string; builder: string; location: string; startingPrice: string;
  amenities: string[]; possessionDate: string; status: 'Ongoing' | 'Completed'; featured: boolean;
  description: string; images: string[]; videoUrl?: string; view3D?: string;
  coordinates: { lat: number; lng: number }; testimonials: Testimonial[];
  spineColor?: string; coverAccent?: string; chapter?: string;
}

// ─── PROJECTS DATA — 2 ongoing + 5 completed ─────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: 1, name: 'Bigway Serene Villas', builder: 'Bigway Constructions', location: 'RS Puram, Coimbatore',
    startingPrice: '₹1.2 Cr', amenities: ['Swimming Pool', 'Club House', 'Gym', 'Landscaped Gardens', '24/7 Security', "Children's Play Area"],
    possessionDate: 'Dec 2025', status: 'Ongoing', featured: true,
    description: 'Experience luxury living with 3 & 4 BHK villas in the heart of Coimbatore. Spread across 5 acres with world-class amenities.',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=90', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&fit=crop&q=90', 'https://images.unsplash.com/photo-1600607687920-4e2c09cf159a?w=1200&fit=crop&q=90'],
    videoUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=90',
    view3D: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&fit=crop&q=90',
    coordinates: { lat: 11.0168, lng: 76.9558 },
    testimonials: [{ id: 1, name: 'Ramesh Kumar', location: 'Coimbatore', comment: 'Bigway Serene Villas exceeded our expectations. Quality construction and timely delivery.', rating: 5, image: 'https://randomuser.me/api/portraits/men/1.jpg' }],
  },
  {
    id: 2, name: 'Bigway Greenfield Enclave', builder: 'Bigway Group', location: 'Saibaba Colony, Coimbatore',
    startingPrice: '₹85 L', amenities: ['Club House', 'Park', 'Walking Tracks', 'Outdoor Gym', 'Community Hall'],
    possessionDate: 'Jun 2026', status: 'Ongoing', featured: false,
    description: 'Affordable luxury apartments with modern amenities in a prime location.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&fit=crop&q=90', 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=1200&fit=crop&q=90'],
    coordinates: { lat: 11.0204, lng: 76.9930 }, testimonials: [],
  },
  // ── 5 COMPLETED BOOKS ────────────────────────────────────────────────────────
  {
    id: 3, name: 'Bigway Lakeview Towers', builder: 'Bigway Developers', location: 'Peelamedu, Coimbatore',
    startingPrice: '₹1.5 Cr', amenities: ['Swimming Pool', 'Gym', 'Tennis Court', 'Party Hall', "Children's Pool"],
    possessionDate: 'Mar 2025', status: 'Completed', featured: true,
    description: 'Ready-to-move-in apartments with stunning lake views and premium finishes.',
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&fit=crop&q=90',
    ],
    view3D: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&fit=crop&q=90',
    coordinates: { lat: 11.0255, lng: 77.0151 },
    testimonials: [{ id: 3, name: 'Suresh Iyer', location: 'Coimbatore', comment: 'Living here is a dream come true. The quality and location are unmatched.', rating: 5, image: 'https://randomuser.me/api/portraits/men/3.jpg' }],
    spineColor: '#050f1a', coverAccent: '#C8A96E', chapter: '01',
  },
  {
    id: 4, name: 'Bigway Riverside Homes', builder: 'Bigway Constructions', location: 'Gandhipuram, Coimbatore',
    startingPrice: '₹95 L', amenities: ['Gated Community', 'Power Backup', 'Water Harvesting', "Children's Park"],
    possessionDate: 'Aug 2024', status: 'Completed', featured: false,
    description: 'Completed 2 & 3 BHK homes near the river. Peaceful environment and excellent connectivity.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&fit=crop&q=90',
    ],
    coordinates: { lat: 11.0186, lng: 76.9670 }, testimonials: [],
    spineColor: '#051015', coverAccent: '#D4B870', chapter: '02',
  },
  {
    id: 5, name: 'Bigway Palm Grove', builder: 'Bigway Estates', location: 'Gandhipuram, Coimbatore',
    startingPrice: '₹1.35 Cr', amenities: ['Swimming Pool', 'Club House', 'Indoor Games', 'Landscaped Gardens', 'Jogging Track', '24/7 Security'],
    possessionDate: 'Jan 2025', status: 'Completed', featured: true,
    description: 'An exclusive enclave of luxury villas surrounded by lush palm groves.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600607687920-4e2c09cf159a?w=1200&fit=crop&q=90',
    ],
    view3D: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&fit=crop&q=90',
    coordinates: { lat: 11.0186, lng: 76.9685 },
    testimonials: [{ id: 5, name: 'Vikram Raj', location: 'Coimbatore', comment: 'Bigway Palm Grove is a masterpiece. Outstanding quality and attention to detail.', rating: 5, image: 'https://randomuser.me/api/portraits/men/5.jpg' }],
    spineColor: '#0a1505', coverAccent: '#E8C97A', chapter: '03',
  },
  {
    id: 6, name: 'Bigway Emerald Heights', builder: 'Bigway Constructions', location: 'RS Puram, Coimbatore',
    startingPrice: '₹2.1 Cr', amenities: ['Swimming Pool', 'Tennis Court', 'Club House', 'Spa', 'Home Automation', 'Concierge'],
    possessionDate: 'Sep 2023', status: 'Completed', featured: true,
    description: 'Ultra-luxury penthouses and villas in the heart of RS Puram with smart home technology.',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600607687920-4e2c09cf159a?w=1200&fit=crop&q=90',
    ],
    view3D: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&fit=crop&q=90',
    coordinates: { lat: 11.0168, lng: 76.9568 },
    testimonials: [{ id: 6, name: 'Anita Krishnan', location: 'Chennai', comment: 'Emerald Heights redefines luxury. Amenities and location are unbeatable.', rating: 5, image: 'https://randomuser.me/api/portraits/women/6.jpg' }],
    spineColor: '#1a0505', coverAccent: '#F0D090', chapter: '04',
  },
  {
    id: 7, name: 'Bigway Silver Springs', builder: 'Bigway Group', location: 'Peelamedu, Coimbatore',
    startingPrice: '₹98 L', amenities: ['Club House', 'Swimming Pool', "Children's Play Area", 'Gym', 'Power Backup', 'CCTV'],
    possessionDate: 'Mar 2024', status: 'Completed', featured: false,
    description: 'Thoughtfully designed 2 & 3 BHK apartments with premium club amenities in Peelamedu.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=1200&fit=crop&q=90',
    ],
    view3D: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&fit=crop&q=90',
    coordinates: { lat: 11.0255, lng: 77.0140 }, testimonials: [],
    spineColor: '#0f0a1a', coverAccent: '#B8A8D8', chapter: '05',
  },
];

// ─── RESPONSIVE MODAL ─────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose, isMobile, isTablet }: { project: Project; onClose: () => void; isMobile: boolean; isTablet: boolean; }) => {
  const [activeView, setActiveView] = useState<'images' | '3d' | 'video' | 'hologram' | 'map' | 'testimonials'>('images');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [rotation3D, setRotation3D] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const hologramRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  useEffect(() => {
    if (activeView === 'images' && !fullscreenImage) {
      const interval = setInterval(() => setCurrentImageIndex(p => (p + 1) % project.images.length), 4000);
      return () => clearInterval(interval);
    }
  }, [activeView, fullscreenImage, project.images.length]);

  const handle3DMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setDragStart({ x: e.clientX, y: e.clientY }); };
  const handle3DMouseMove = (e: React.MouseEvent) => { if (isDragging) { setRotation3D(p => ({ x: p.x + (e.clientY - dragStart.y) * 0.5, y: p.y + (e.clientX - dragStart.x) * 0.5 })); setDragStart({ x: e.clientX, y: e.clientY }); } };
  const handle3DMouseUp = () => setIsDragging(false);

  const views = [
    { id: 'images', label: '📷', fullLabel: 'Photos', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: '3d', label: '🔮', fullLabel: '3D View', icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5' },
    { id: 'video', label: '▶', fullLabel: 'Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'hologram', label: '◈', fullLabel: 'Hologram', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'map', label: '📍', fullLabel: 'Map', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { id: 'testimonials', label: '💬', fullLabel: 'Reviews', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ];

  const renderView = () => {
    if (activeView === 'images') return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          <img src={project.images[currentImageIndex]} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} onClick={() => setFullscreenImage(project.images[currentImageIndex])} />
          <button onClick={() => setCurrentImageIndex(p => p === 0 ? project.images.length - 1 : p - 1)} style={{ position: 'absolute', left: isMobile ? 10 : 16, top: '50%', transform: 'translateY(-50%)', width: isMobile ? 34 : 44, height: isMobile ? 34 : 44, borderRadius: 10, background: 'rgba(3,10,22,.85)', border: '1px solid rgba(212,175,55,.4)', color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: isMobile ? 14 : 18, height: isMobile ? 14 : 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => setCurrentImageIndex(p => (p + 1) % project.images.length)} style={{ position: 'absolute', right: isMobile ? 10 : 16, top: '50%', transform: 'translateY(-50%)', width: isMobile ? 34 : 44, height: isMobile ? 34 : 44, borderRadius: 10, background: 'rgba(3,10,22,.85)', border: '1px solid rgba(212,175,55,.4)', color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: isMobile ? 14 : 18, height: isMobile ? 14 : 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {project.images.map((_, i) => <button key={i} onClick={() => setCurrentImageIndex(i)} style={{ width: i === currentImageIndex ? 20 : 6, height: 6, borderRadius: 3, background: i === currentImageIndex ? '#D4AF37' : 'rgba(255,255,255,.3)', border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: isMobile ? '8px 12px' : '10px 16px', background: 'rgba(3,10,22,.95)', overflowX: 'auto', flexShrink: 0 }} className="scrollbar-hide">
          {project.images.map((img, i) => (
            <button key={i} onClick={() => setCurrentImageIndex(i)} style={{ flexShrink: 0, width: isMobile ? 60 : 80, height: isMobile ? 40 : 54, borderRadius: 8, overflow: 'hidden', border: `2px solid ${i === currentImageIndex ? '#D4AF37' : 'transparent'}`, opacity: i === currentImageIndex ? 1 : 0.5, transition: 'all .3s', padding: 0 }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
        <div style={{ padding: isMobile ? '14px 14px 18px' : '16px 20px 20px', background: '#030A16', flexShrink: 0, borderTop: '1px solid rgba(212,175,55,.1)', overflowY: 'auto', maxHeight: isMobile ? 220 : 'none' }}>
          <div style={{ display: 'flex', gap: isMobile ? 8 : 12, marginBottom: 12 }}>
            <div style={{ flex: 1, padding: isMobile ? '10px 12px' : '12px 16px', borderRadius: 12, background: 'linear-gradient(135deg,rgba(212,175,55,.12),rgba(184,148,31,.06))', border: '1px solid rgba(212,175,55,.25)' }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: 'rgba(212,175,55,.5)', letterSpacing: '.18em', marginBottom: 3 }}>FROM</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: isMobile ? 16 : 20, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.startingPrice}</div>
            </div>
            <div style={{ flex: 1, padding: isMobile ? '10px 12px' : '12px 16px', borderRadius: 12, background: 'rgba(7,16,32,.8)', border: '1px solid rgba(212,175,55,.1)' }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: 'rgba(212,175,55,.4)', letterSpacing: '.18em', marginBottom: 3 }}>POSSESSION</div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: isMobile ? 13 : 15, color: '#fff' }}>{project.possessionDate}</div>
            </div>
          </div>
          <p style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? 12 : 14, color: 'rgba(199,209,219,.7)', lineHeight: 1.7, marginBottom: 14 }}>{project.description}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ flex: 1, padding: isMobile ? '12px' : '13px', borderRadius: 12, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: isMobile ? 12 : 13, border: 'none', cursor: 'pointer' }}>Schedule Site Visit</button>
            <button style={{ flex: 1, padding: isMobile ? '12px' : '13px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(212,175,55,.35)', color: '#D4AF37', fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: isMobile ? 12 : 13, cursor: 'pointer' }}>Brochure</button>
          </div>
        </div>
      </div>
    );
    if (activeView === 'map') return <div style={{ position: 'absolute', inset: 0 }}><PropertyMap lat={project.coordinates.lat} lng={project.coordinates.lng} title={project.name} /></div>;
    if (activeView === 'testimonials') return (
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: isMobile ? 12 : 20 }}>
        {project.testimonials.length > 0 ? project.testimonials.map(t => (
          <div key={t.id} style={{ padding: isMobile ? '14px' : '20px 24px', borderRadius: 14, background: 'rgba(7,16,32,.8)', border: '1px solid rgba(212,175,55,.12)', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <img src={t.image} alt={t.name} style={{ width: isMobile ? 40 : 52, height: isMobile ? 40 : 52, borderRadius: 10, objectFit: 'cover', border: '2px solid rgba(212,175,55,.3)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: isMobile ? 13 : 15, color: '#fff', marginBottom: 3 }}>{t.name}</div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>{[...Array(5)].map((_, i) => <svg key={i} style={{ width: 12, height: 12, color: i < t.rating ? '#D4AF37' : '#333' }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? 12 : 14, color: 'rgba(199,209,219,.65)', lineHeight: 1.7, fontStyle: 'italic' }}>"{t.comment}"</p>
              </div>
            </div>
          </div>
        )) : <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(199,209,219,.4)', fontFamily: "'Lato',sans-serif" }}>No testimonials yet.</div>}
      </div>
    );
    if (activeView === 'video') return (
      <div style={{ position: 'absolute', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {project.videoUrl && <img src={project.videoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .6 }} />}
        <button style={{ position: 'absolute', width: isMobile ? 60 : 76, height: isMobile ? 60 : 76, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(212,175,55,.6)' }}>
          <svg style={{ width: isMobile ? 24 : 30, height: isMobile ? 24 : 30, color: '#0A1628', marginLeft: 4 }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </button>
      </div>
    );
    if (activeView === '3d' && project.view3D) return (
      <div style={{ position: 'absolute', inset: 0, cursor: 'move' }} onMouseDown={handle3DMouseDown} onMouseMove={handle3DMouseMove} onMouseUp={handle3DMouseUp} onMouseLeave={handle3DMouseUp}>
        <div style={{ width: '100%', height: '100%', transform: `perspective(1200px) rotateX(${rotation3D.x}deg) rotateY(${rotation3D.y}deg) scale(${zoom})`, transition: isDragging ? 'none' : 'transform .4s' }}>
          <img src={project.view3D} alt="3D" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
        </div>
        <div style={{ position: 'absolute', bottom: isMobile ? 12 : 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
          {(isMobile ? [['−', () => setZoom(p => Math.max(.5, p - .2))], ['↺', () => { setRotation3D({ x: 0, y: 0 }); setZoom(1); }], ['+', () => setZoom(p => Math.min(2, p + .2))]] : [['←', () => setRotation3D(p => ({ ...p, y: p.y - 45 }))], ['−', () => setZoom(p => Math.max(.5, p - .2))], ['↺', () => { setRotation3D({ x: 0, y: 0 }); setZoom(1); }], ['+', () => setZoom(p => Math.min(2, p + .2))], ['→', () => setRotation3D(p => ({ ...p, y: p.y + 45 }))]]).map(([label, action]: any, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); action(); }} style={{ width: isMobile ? 36 : 42, height: isMobile ? 36 : 42, borderRadius: 10, background: 'rgba(3,10,22,.9)', border: '1px solid rgba(212,175,55,.4)', color: '#D4AF37', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: isMobile ? 12 : 14 }}>{label}</button>
          ))}
        </div>
        <div style={{ position: 'absolute', top: 14, left: 14, padding: '6px 14px', borderRadius: 8, background: 'rgba(3,10,22,.85)', border: '1px solid rgba(212,175,55,.3)', fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: 'rgba(212,175,55,.8)' }}>◈ DRAG TO ROTATE</div>
      </div>
    );
    if (activeView === 'hologram' && project.view3D) return (
      <div ref={hologramRef} style={{ position: 'absolute', inset: 0, background: '#020d1a', cursor: 'crosshair' }}
        onMouseMove={e => { if (!hologramRef.current) return; const r = hologramRef.current.getBoundingClientRect(); setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }); }}
        onMouseLeave={() => setMousePos({ x: .5, y: .5 })}>
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${(mousePos.x - .5) * 28}px,${(mousePos.y - .5) * 28}px)`, filter: 'blur(3px) hue-rotate(160deg) saturate(3) brightness(.5)', opacity: .5, mixBlendMode: 'screen' }}><img src={project.view3D} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} /></div>
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${(mousePos.x - .5) * 8}px,${(mousePos.y - .5) * 8}px) perspective(800px) rotateX(${(mousePos.y - .5) * 8}deg) rotateY(${(mousePos.x - .5) * 8}deg)`, filter: 'brightness(1.3) contrast(1.2) saturate(.7)', opacity: .85 }}><img src={project.view3D} alt="Hologram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} /></div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(212,175,55,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,.12) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(to right,transparent,rgba(212,175,55,.8) 30%,rgba(0,255,200,.6) 50%,rgba(212,175,55,.8) 70%,transparent)', boxShadow: '0 0 12px rgba(212,175,55,.8)', animation: 'scan-sweep 3s linear infinite' }} />
        <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: "'Orbitron',sans-serif", fontSize: isMobile ? 8 : 10, color: 'rgba(212,175,55,.7)' }}>◈ HOLOGRAM.ACTIVE</div>
      </div>
    );
    return null;
  };

  // MOBILE
  if (isMobile) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.85)' }} onClick={onClose} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '94svh', background: '#030A16', borderRadius: '22px 22px 0 0', border: '1px solid rgba(212,175,55,.2)', borderBottom: 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideFromBottom .38s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(212,175,55,.3)' }} />
        </div>
        <div style={{ padding: '0 14px 10px', borderBottom: '1px solid rgba(212,175,55,.1)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 9, fontWeight: 700, fontFamily: "'Poppins',sans-serif", flexShrink: 0, whiteSpace: 'nowrap', ...(project.status === 'Ongoing' ? { background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628' } : { background: 'linear-gradient(135deg,#10b981,#4ade80)', color: '#fff' }) }}>{project.status}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1rem', color: '#fff', lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name}</h2>
            <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 10, color: 'rgba(212,175,55,.65)', marginTop: 1 }}>{project.location}</div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(26,10,10,1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(212,175,55,.08)', flexShrink: 0 }} className="scrollbar-hide">
          {views.map(v => (
            <button key={v.id} onClick={() => { setActiveView(v.id as any); setFullscreenImage(null); }} style={{ flexShrink: 0, padding: '9px 14px', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, cursor: 'pointer', border: 'none', borderBottom: `2px solid ${activeView === v.id ? '#D4AF37' : 'transparent'}`, background: 'transparent', color: activeView === v.id ? '#D4AF37' : 'rgba(199,209,219,.45)', whiteSpace: 'nowrap', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{v.label}</span><span>{v.fullLabel}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>{renderView()}</div>
      </div>
      {fullscreenImage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'fadeIn .3s ease' }} onClick={() => setFullscreenImage(null)}>
          <button onClick={() => setFullscreenImage(null)} style={{ position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: 16, height: 16, color: '#0A1628' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={fullscreenImage} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );

  // TABLET
  if (isTablet) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', background: 'rgba(3,10,22,.95)', backdropFilter: 'blur(16px)' }}>
      <div style={{ width: '100%', maxWidth: 680, height: 'min(88vh, 780px)', background: '#030A16', borderRadius: 20, border: '1px solid rgba(212,175,55,.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'modal-in .3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 32px 100px rgba(0,0,0,.8)' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(212,175,55,.12)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(26,10,10,1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 9, fontWeight: 700, fontFamily: "'Poppins',sans-serif", flexShrink: 0, ...(project.status === 'Ongoing' ? { background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628' } : { background: 'linear-gradient(135deg,#10b981,#4ade80)', color: '#fff' }) }}>{project.status}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1.15rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name}</h2>
            <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 11, color: 'rgba(212,175,55,.65)', marginTop: 1 }}>{project.location}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: 'rgba(212,175,55,.4)' }}>FROM</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: '1.15rem', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.startingPrice}</div>
          </div>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(212,175,55,.08)', flexShrink: 0 }} className="scrollbar-hide">
          {views.map(v => (
            <button key={v.id} onClick={() => { setActiveView(v.id as any); setFullscreenImage(null); }} style={{ flexShrink: 0, padding: '10px 16px', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, cursor: 'pointer', border: 'none', borderBottom: `2px solid ${activeView === v.id ? '#D4AF37' : 'transparent'}`, background: 'transparent', color: activeView === v.id ? '#D4AF37' : 'rgba(199,209,219,.45)', whiteSpace: 'nowrap', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{v.label}</span><span>{v.fullLabel}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>{renderView()}</div>
      </div>
      {fullscreenImage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setFullscreenImage(null)}>
          <button onClick={() => setFullscreenImage(null)} style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: 18, height: 18, color: '#0A1628' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={fullscreenImage} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );

  // DESKTOP
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', background: 'rgba(3,10,22,.98)', backdropFilter: 'blur(24px)', animation: 'modal-in .3s cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ height: 72, borderBottom: '1px solid rgba(212,175,55,.2)', background: 'rgba(3,10,22,.98)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(26,10,10,1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <span style={{ padding: '5px 12px', borderRadius: 100, fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif", flexShrink: 0, ...(project.status === 'Ongoing' ? { background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628' } : { background: 'linear-gradient(135deg,#10b981,#4ade80)', color: '#fff' }) }}>{project.status}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1.35rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name}</h2>
          <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 11, color: 'rgba(212,175,55,.7)' }}>{project.location}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: 'rgba(212,175,55,.4)' }}>FROM</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.startingPrice}</div>
        </div>
        <button style={{ padding: '10px 22px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', flexShrink: 0 }}>Schedule</button>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 10px', background: 'rgba(3,10,22,.95)', borderRight: '1px solid rgba(212,175,55,.1)', flexShrink: 0 }}>
          {views.map(v => (
            <button key={v.id} onClick={() => { setActiveView(v.id as any); setFullscreenImage(null); }} title={v.fullLabel} style={{ width: 50, height: 50, borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, transition: 'all .3s', ...(activeView === v.id ? { background: 'linear-gradient(135deg,#D4AF37,#B8941F)', boxShadow: '0 0 24px rgba(212,175,55,.6)' } : { background: 'rgba(7,16,32,1)' }) }}>
              <svg style={{ width: 18, height: 18, color: activeView === v.id ? '#0A1628' : 'rgba(212,175,55,.6)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} /></svg>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 8, fontWeight: 700, color: activeView === v.id ? '#0A1628' : 'rgba(212,175,55,.5)', letterSpacing: '.04em' }}>{v.fullLabel}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>{renderView()}</div>
      </div>
      {fullscreenImage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn .3s ease' }} onClick={() => setFullscreenImage(null)}>
          <button onClick={() => setFullscreenImage(null)} style={{ position: 'absolute', top: 20, right: 20, width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: 20, height: 20, color: '#0A1628' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={fullscreenImage} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ProjectsPage: React.FC = () => {
  const { isMobile, isTablet, isDesktop, width } = useBreakpoint();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [bookMounted, setBookMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setIsVisible(true), 200); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setTimeout(() => setBookMounted(true), 400); return () => clearTimeout(t); }, []);

  const filteredProjects = PROJECTS.filter(p => {
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase()) || p.builder.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const completedProjects = filteredProjects.filter(p => p.status === 'Completed');
  const ongoingProjects = filteredProjects.filter(p => p.status === 'Ongoing');

  const getCoverAccent = (p: Project, idx: number) => { const accents = ['#D4AF37', '#C8A96E', '#E8C97A', '#B8A070', '#F0D090', '#D4B870']; return p.coverAccent || accents[idx % accents.length]; };
  const getChapter = (p: Project, idx: number) => p.chapter || String(idx + 1).padStart(2, '0');

  const heroPaddingTop = isMobile ? 80 : isTablet ? 100 : 110;
  const heroPaddingBottom = isMobile ? 60 : 80;
  const heroMaxW = isDesktop ? 1000 : '100%';
  const ongoingCardMinH = isMobile ? 320 : isTablet ? 360 : 420;

  // ── Book sizing: wider covers so images are clearly visible ──────────────────
  const SPINE_W  = isMobile ? 32 : isTablet ? 38 : 44;
  const COVER_W  = isMobile ? 118 : isTablet ? 155 : 192;
  const BOOK_H   = isMobile ? 220 : isTablet ? 280 : 360;
  const BOOK_W   = SPINE_W + COVER_W;

  return (
    <>
      <Head>
        <title>Bigway Real Estate | Premium Projects in Coimbatore</title>
        <meta name="description" content="Bigway Real Estate offers premium ongoing and completed residential projects in Coimbatore." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes au__driftA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-35px)} }
        @keyframes au__driftB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,28px)} }

        .bw-page-root { background: #030A16 !important; }
        .bw-fixed-orb1 { position:fixed; top:-10%; right:-8%; width:600px; height:600px; border-radius:50%; z-index:0; pointer-events:none; background:radial-gradient(circle,rgba(212,175,55,0.04) 0%,transparent 65%); filter:blur(100px); animation:au__driftA 26s ease-in-out infinite; }
        .bw-fixed-orb2 { position:fixed; bottom:-10%; left:-8%; width:550px; height:550px; border-radius:50%; z-index:0; pointer-events:none; background:radial-gradient(circle,rgba(245,201,122,0.035) 0%,transparent 60%); filter:blur(120px); animation:au__driftB 32s ease-in-out infinite 3s; }

        .gold-shimmer { background: linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F); background-size: 220% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: textShimmer 9s linear infinite; }
        @keyframes textShimmer { 0%{background-position:-220%} 100%{background-position:220%} }

        .pulse-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #D4AF37; box-shadow: 0 0 8px rgba(212,175,55,.8); animation: pdot 2.4s ease-out infinite; }
        @keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.7)} 60%{box-shadow:0 0 0 10px rgba(212,175,55,0)} }

        .gem { width: 8px; height: 8px; background: #D4AF37; transform: rotate(45deg); box-shadow: 0 0 16px rgba(212,175,55,.85); animation: gemP 3.8s ease-in-out infinite; }
        @keyframes gemP { 0%,100%{box-shadow:0 0 12px rgba(212,175,55,.7)} 50%{box-shadow:0 0 32px rgba(212,175,55,1)} }

        .header-search { width:100%; padding:16px 28px; padding-right:60px; border-radius:100px; background:rgba(2,7,18,0.92); backdrop-filter:blur(28px); border:1.5px solid rgba(212,175,55,.35); color:#fff; font-family:'Lato',sans-serif; font-size:15px; outline:none; transition:border-color .3s,box-shadow .3s; }
        .header-search::placeholder { color:rgba(199,209,219,.45); }
        .header-search:focus { border-color:rgba(212,175,55,.65); box-shadow:0 0 0 3px rgba(212,175,55,.12); }

        .ongoing-card { box-shadow:0 20px 80px rgba(0,0,0,.7); transition:box-shadow .4s,transform .4s; }
        .ongoing-card:hover { box-shadow:0 30px 120px rgba(0,0,0,.8),0 0 60px rgba(212,175,55,.2); transform:translateY(-4px); }

        /* ── BOOK SHELF ─────────────────────────────────────────────────────── */
        .shelf-book {
          transform-origin: bottom center;
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: flex-end;
        }
        .shelf-book:hover { transform: translateY(-56px); }
        .shelf-glow { animation:shelfPulse 4s ease-in-out infinite; }
        @keyframes shelfPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .book-stagger { opacity:0; transform:translateY(60px) rotate(2deg); transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .book-stagger.visible { opacity:1; transform:translateY(0) rotate(0deg); }
        .page-lines-bg { background-image:repeating-linear-gradient(to bottom,transparent 0px,transparent 18px,rgba(212,175,55,0.07) 18px,rgba(212,175,55,0.07) 19px); }

        /* ── BOOK COVER IMAGE ── explicitly set dimensions ─────────────────── */
        .book-cover-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s ease;
        }
        .shelf-book:hover .book-cover-img { transform: scale(1.12); }

        @keyframes lineTravelV { 0%{top:-40%} 100%{top:140%} }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.5);opacity:1;box-shadow:0 0 22px rgba(212,175,55,1)} }
        @keyframes diamondSpin { from{transform:rotate(45deg)} to{transform:rotate(405deg)} }
        @keyframes diamondGlow { 0%,100%{box-shadow:0 0 8px rgba(212,175,55,0.7)} 50%{box-shadow:0 0 24px rgba(212,175,55,1)} }
        @keyframes cardFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes shimmerSweep { 0%{left:-100%} 100%{left:200%} }
        @keyframes numberGlow { 0%,100%{text-shadow:0 0 14px rgba(212,175,55,0.4)} 50%{text-shadow:0 0 30px rgba(212,175,55,0.9)} }
        @keyframes bracketPulse { 0%,100%{border-color:rgba(212,175,55,0.3)} 50%{border-color:rgba(212,175,55,0.75)} }
        @keyframes modal-in { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideFromBottom { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes scan-sweep { 0%{top:-2px} 100%{top:100%} }

        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#030A16; }
        ::-webkit-scrollbar-thumb { background:rgba(212,175,55,.24); border-radius:3px; }

        @media (max-width: 1023px) { .shelf-book:hover { transform:translateY(-40px); } }
        @media (max-width: 767px) {
          .shelf-book:hover { transform:translateY(-28px); }
          .header-search { font-size:14px; padding:14px 20px; padding-right:52px; }
          .ongoing-card:hover { transform:translateY(-2px); }
        }
      `}</style>

      <div className="bw-fixed-orb1" />
      <div className="bw-fixed-orb2" />

      <article className="bw-page-root" style={{ position: 'relative', overflow: 'hidden', color: '#C7D1DB', minHeight: '100vh' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <header style={{ position: 'relative', minHeight: isMobile ? '70vh' : '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#030A16' }}>
          <div style={{ position: 'absolute', top: -180, left: -160, width: 650, height: 650, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%)', filter: 'blur(70px)', animation: 'au__driftA 28s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: -200, right: -160, width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,201,122,0.04) 0%,transparent 62%)', filter: 'blur(90px)', animation: 'au__driftB 34s ease-in-out infinite 3s', pointerEvents: 'none', zIndex: 0 }} />
          <AnimatedGrid hidden={isMobile || isTablet} />
          <ProjectLeftPanel isVisible={isVisible} hide={!isDesktop || width < 1300} />
          <ProjectRightPanel isVisible={isVisible} hide={!isDesktop || width < 1300} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: `${heroPaddingTop}px ${isMobile ? 20 : 24}px ${heroPaddingBottom}px`, maxWidth: heroMaxW, margin: '0 auto', opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(44px)', transition: 'opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1)', width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 20 : 28, padding: isMobile ? '10px 20px' : '12px 32px', borderRadius: 10, background: 'rgba(2,7,18,0.88)', backdropFilter: 'blur(28px)', border: '1.5px solid rgba(212,175,55,.36)', boxShadow: '0 0 56px rgba(212,175,55,.16)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div className="pulse-dot" />
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: isMobile ? 9 : 11, fontWeight: 700, letterSpacing: isMobile ? '.18em' : '.26em', textTransform: 'uppercase', color: '#D4AF37' }}>Bigway Real Estate · Coimbatore</span>
              <div className="pulse-dot" style={{ animationDelay: '.7s' }} />
            </div>

            <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? '2.2rem' : isTablet ? '3rem' : 'clamp(2.8rem, 5.5vw, 4.5rem)', lineHeight: 1.06, color: '#fff', marginBottom: 4, textShadow: '0 4px 60px rgba(0,0,0,.8)' }}>Discover Our</h1>
            <div className="gold-shimmer" style={{ display: 'block', fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? '2.2rem' : isTablet ? '3rem' : 'clamp(2.8rem, 5.5vw, 4.5rem)', lineHeight: 1.06, marginBottom: isMobile ? 18 : 26 }}>Signature Projects</div>

            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? '0.95rem' : '1.08rem', lineHeight: 1.85, color: 'rgba(199,209,219,.7)', maxWidth: 560, margin: '0 auto 28px', fontWeight: 300 }}>Ongoing & completed luxury villas, premium apartments and gated enclaves — trusted by 2,400+ families across Coimbatore since 2009.</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 20 : 32, marginBottom: isMobile ? 28 : 40, flexWrap: 'wrap' }}>
              {[['5+', 'Premium Projects'], ['2,400+', 'Happy Families'], ['₹850Cr+', 'Transacted']].map(([val, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: isMobile ? '1.3rem' : 'clamp(1.4rem,2.5vw,2rem)', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</div>
                  <div style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? 10 : 12, color: 'rgba(212,175,55,.5)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
              <input type="text" placeholder={isMobile ? 'Search projects…' : 'Search by project name, location, or builder…'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="header-search" />
              <button style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', padding: isMobile ? '10px 14px' : '12px 20px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', border: 'none', cursor: 'pointer', boxShadow: '0 0 30px rgba(212,175,55,.5)' }}>
                <svg style={{ width: isMobile ? 16 : 20, height: isMobile ? 16 : 20, color: '#0A1628' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: isMobile ? 32 : 44 }}>
              <div style={{ height: 1, width: isMobile ? 60 : 120, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.55),transparent)' }} />
              <div className="gem" />
              <div style={{ height: 1, width: isMobile ? 60 : 120, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.55),transparent)', transform: 'scaleX(-1)' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, #030A16)', pointerEvents: 'none', zIndex: 3 }} />
        </header>

        {/* ── STICKY FILTER BAR ─────────────────────────────────────────────── */}
        <div style={{ position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid rgba(212,175,55,.2)', background: 'rgba(3,10,22,.97)', backdropFilter: 'blur(24px)', boxShadow: '0 10px 50px rgba(0,0,0,.5)', padding: isMobile ? '12px 16px' : '16px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: isMobile ? 6 : 10 }}>
              {['All', 'Ongoing', 'Completed'].map(status => (
                <button key={status} onClick={() => setSelectedStatus(status)} style={{ padding: isMobile ? '8px 14px' : '10px 24px', borderRadius: 100, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: isMobile ? 11 : 13, cursor: 'pointer', transition: 'all .3s', ...(selectedStatus === status ? { background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', border: 'none', boxShadow: '0 0 40px rgba(212,175,55,.5)' } : { background: 'transparent', color: '#D4AF37', border: '1.5px solid rgba(212,175,55,.3)' }) }}>{status}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16 }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13 }}>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: isMobile ? 14 : 18, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{filteredProjects.length}</span>
                <span style={{ color: 'rgba(199,209,219,.5)', marginLeft: 4, fontSize: isMobile ? 11 : 13 }}> projects</span>
              </div>
              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="pulse-dot" style={{ width: 8, height: 8, background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,.6)' }} />
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600, color: '#4ade80' }}>Virtual Tours Live</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
        <main style={{ position: 'relative', zIndex: 10, background: '#030A16' }}>

          {/* ── ONGOING PROJECTS ───────────────────────────────────────────── */}
          {(selectedStatus === 'All' || selectedStatus === 'Ongoing') && ongoingProjects.length > 0 && (
            <section style={{ padding: isMobile ? '50px 16px' : '80px 24px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 60 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 24px', borderRadius: 100, background: 'rgba(212,175,55,.1)', border: '1px solid rgba(212,175,55,.3)', marginBottom: 20 }}>
                  <div className="pulse-dot" />
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: '#F5C97A' }}>UNDER CONSTRUCTION</span>
                </div>
                <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? '1.8rem' : 'clamp(2rem,4vw,3.2rem)', marginBottom: 10 }}>
                  <span style={{ color: '#fff' }}>Ongoing </span><span className="gold-shimmer">Projects</span>
                </h2>
                <p style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? 14 : 16, color: 'rgba(199,209,219,.6)', fontWeight: 300 }}>Invest today in your dream home of tomorrow</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 20 : 28 }}>
                {ongoingProjects.map((project, idx) => (
                  <article key={project.id} className="ongoing-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: isMobile ? 16 : 20, cursor: 'pointer', minHeight: ongoingCardMinH, opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(40px)', transition: `opacity .8s ease ${idx * 180}ms, transform .8s ease ${idx * 180}ms` }}
                    onClick={() => setSelectedProject(project)} onMouseEnter={() => setHoveredCard(project.id)} onMouseLeave={() => setHoveredCard(null)}>
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <img src={project.images[0]} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s', transform: hoveredCard === project.id ? 'scale(1.08)' : 'scale(1)' }} />
                    </div>
                    {isMobile ? (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,10,22,.98) 0%, rgba(3,10,22,.7) 50%, rgba(3,10,22,.3) 100%)' }} />
                    ) : (
                      <>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(3,10,22,.97) 0%,#030A16 45%,transparent 70%)', clipPath: idx % 2 === 0 ? 'polygon(0 0, 62% 0, 42% 100%, 0 100%)' : 'polygon(38% 0, 100% 0, 100% 100%, 58% 100%)' }} />
                        <div style={{ position: 'absolute', inset: 0, background: idx % 2 === 0 ? 'linear-gradient(to right,rgba(3,10,22,0) 45%,rgba(3,10,22,.7) 100%)' : 'linear-gradient(to left,rgba(3,10,22,0) 45%,rgba(3,10,22,.7) 100%)' }} />
                        {!isMobile && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: idx % 2 === 0 ? 'linear-gradient(to bottom right,transparent 41.5%,rgba(212,175,55,.7) 41.5%,rgba(212,175,55,.7) 42.5%,transparent 42.5%)' : 'linear-gradient(to bottom left,transparent 41.5%,rgba(212,175,55,.7) 41.5%,rgba(212,175,55,.7) 42.5%,transparent 42.5%)' }} />}
                      </>
                    )}
                    <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: isMobile ? '20px' : isTablet ? '28px 32px' : '36px 48px', height: '100%', ...(!isMobile && !isTablet && idx % 2 !== 0 ? { alignItems: 'flex-end', textAlign: 'right', position: 'absolute', left: '38%', right: 0, paddingLeft: 24 } : (!isMobile && !isTablet ? { position: 'absolute', inset: '0', right: '42%' } : { position: 'relative' })) }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: isMobile ? 12 : 16, ...(!isMobile && !isTablet && idx % 2 !== 0 ? { justifyContent: 'flex-end' } : {}) }}>
                        <span style={{ padding: '6px 14px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0A1628', display: 'inline-block' }} />ONGOING
                        </span>
                        {project.featured && <span style={{ padding: '6px 12px', borderRadius: 100, background: 'rgba(3,10,22,.8)', border: '1px solid rgba(212,175,55,.5)', color: '#D4AF37', fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>★ FEATURED</span>}
                      </div>
                      <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? '1.4rem' : isTablet ? '1.8rem' : 'clamp(1.6rem,3vw,2.8rem)', color: '#fff', lineHeight: 1.1, marginBottom: 6 }}>{project.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Lato',sans-serif", fontSize: 13, color: 'rgba(199,209,219,.7)', marginBottom: 12, ...(!isMobile && !isTablet && idx % 2 !== 0 ? { justifyContent: 'flex-end' } : {}) }}>
                        <svg style={{ width: 12, height: 12, color: '#D4AF37', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {project.location}
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', ...(!isMobile && !isTablet && idx % 2 !== 0 ? { justifyContent: 'flex-end' } : {}) }}>
                        <div style={{ padding: '8px 14px', background: 'rgba(212,175,55,.15)', border: '1px solid rgba(212,175,55,.4)', borderRadius: 10 }}>
                          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: '#D4AF37', letterSpacing: '.18em', marginBottom: 2 }}>FROM</div>
                          <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: isMobile ? 15 : 18, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.startingPrice}</div>
                        </div>
                        <div style={{ padding: '8px 14px', background: 'rgba(3,10,22,.7)', border: '1px solid rgba(212,175,55,.2)', borderRadius: 10 }}>
                          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: '#D4AF37', letterSpacing: '.18em', marginBottom: 2 }}>POSSESSION</div>
                          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>{project.possessionDate}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16, ...(!isMobile && !isTablet && idx % 2 !== 0 ? { justifyContent: 'flex-end' } : {}) }}>
                        {project.amenities.slice(0, isMobile ? 3 : 4).map((a, i) => (
                          <span key={i} style={{ padding: '3px 10px', background: 'rgba(3,10,22,.7)', border: '1px solid rgba(212,175,55,.18)', borderRadius: 100, fontSize: isMobile ? 10 : 11, fontFamily: "'Lato',sans-serif", color: '#C7D1DB', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg style={{ width: 9, height: 9, color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{a}
                          </span>
                        ))}
                        {project.amenities.length > (isMobile ? 3 : 4) && <span style={{ padding: '3px 10px', background: 'rgba(212,175,55,.15)', border: '1px solid rgba(212,175,55,.35)', borderRadius: 100, fontSize: 10, fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: '#D4AF37' }}>+{project.amenities.length - (isMobile ? 3 : 4)}</span>}
                      </div>
                      <button onClick={e => { e.stopPropagation(); setSelectedProject(project); }} style={{ padding: isMobile ? '10px 20px' : '12px 24px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: isMobile ? 12 : 13, border: 'none', cursor: 'pointer', boxShadow: '0 0 25px rgba(212,175,55,.4)' }}>View Details</button>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: isMobile ? 16 : 20, pointerEvents: 'none', boxShadow: hoveredCard === project.id ? 'inset 0 0 0 2px rgba(212,175,55,.8)' : 'inset 0 0 0 1px rgba(212,175,55,.1)', transition: 'box-shadow .4s' }} />
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── COMPLETED — BOOK SHELF (5 books) ──────────────────────────── */}
          {(selectedStatus === 'All' || selectedStatus === 'Completed') && completedProjects.length > 0 && (
            <section style={{ padding: isMobile ? '50px 0 80px' : '80px 24px 120px', position: 'relative', zIndex: 1, background: 'linear-gradient(180deg, #030A16 0%, #08050f 40%, #0a0a08 100%)' }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 72, padding: isMobile ? '0 16px' : 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 24px', borderRadius: 100, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', marginBottom: 20 }}>
                  <svg style={{ width: 16, height: 16, color: '#4ade80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: '#4ade80' }}>READY TO MOVE IN</span>
                </div>
                <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? '1.8rem' : 'clamp(2rem,4vw,3.2rem)', marginBottom: 10 }}>
                  <span style={{ color: '#fff' }}>The Bigway </span><span className="gold-shimmer">Chronicle</span>
                </h2>
                <p style={{ fontFamily: "'EB Garamond',serif", fontStyle: 'italic', fontSize: isMobile ? '1rem' : '1.1rem', color: 'rgba(212,175,55,.5)', letterSpacing: '.06em' }}>A curated library of completed residences</p>
              </div>

              <div style={{ position: 'relative', maxWidth: 1300, margin: '0 auto' }}>
                {/* SHELF CASE */}
                <div style={{ background: 'linear-gradient(180deg, #030A16 0%, #120a04 100%)', borderRadius: '8px 8px 0 0', border: '1px solid rgba(180,120,40,0.3)', boxShadow: '0 -20px 80px rgba(0,0,0,0.6)', padding: isMobile ? '0 12px' : '0 40px' }}>
                  {/* Gold crown rail */}
                  <div style={{ height: 6, background: 'linear-gradient(to right, #8B5E20, #C8A04A, #D4AF37, #C8A04A, #8B5E20)', borderRadius: '4px 4px 0 0', boxShadow: '0 2px 12px rgba(212,175,55,0.4)' }} />

                  {/* BOOKS ROW */}
                  <div
                    style={{ display: 'flex', alignItems: 'flex-end', justifyContent: completedProjects.length <= 5 && !isMobile ? 'center' : 'flex-start', gap: 0, padding: isMobile ? '32px 4px 0' : '48px 20px 0', perspective: '2400px', perspectiveOrigin: '50% 100%', overflowX: 'auto', overflowY: 'visible', minHeight: BOOK_H + 60 }}
                    className="scrollbar-hide"
                  >
                    {completedProjects.map((project, idx) => {
                      const isHovered = hoveredCard === project.id;
                      const accent = getCoverAccent(project, idx);
                      const spine  = project.spineColor || '#1a0e05';
                      const chapter = getChapter(project, idx);

                      return (
                        <div
                          key={project.id}
                          className={`shelf-book book-stagger ${bookMounted ? 'visible' : ''}`}
                          style={{ transitionDelay: `${idx * 90}ms`, width: BOOK_W, height: BOOK_H }}
                          onMouseEnter={() => setHoveredCard(project.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          onClick={() => setSelectedProject(project)}
                        >
                          {/* ── SPINE ── */}
                          <div style={{
                            position: 'absolute', top: 0, left: 0, bottom: 0, width: SPINE_W,
                            background: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, ${spine} 20%, ${spine} 80%, rgba(0,0,0,0.5) 100%)`,
                            borderRadius: '3px 0 0 3px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0', overflow: 'hidden',
                            boxShadow: isHovered ? `-6px 0 30px rgba(0,0,0,0.8)` : `-4px 0 18px rgba(0,0,0,0.7)`,
                            transition: 'box-shadow 0.4s',
                          }}>
                            <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? 7 : 9, color: `${accent}90`, letterSpacing: '0.18em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{chapter}</span>
                            <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: isMobile ? 6 : Math.max(8, 11 - project.name.length / 6), color: isHovered ? accent : `${accent}cc`, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.1em', textAlign: 'center', lineHeight: 1.3, transition: 'color 0.4s', maxHeight: BOOK_H - 80, overflow: 'hidden' }}>{project.name}</span>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: `radial-gradient(circle, ${accent}90 0%, transparent 70%)` }} />
                            {/* Spine sheen */}
                            <div style={{ position: 'absolute', top: 0, left: '25%', width: '18%', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent)', pointerEvents: 'none' }} />
                          </div>

                          {/* ── COVER ── */}
                          <div style={{
                            position: 'absolute', top: 0, left: SPINE_W, right: 0, bottom: 0,
                            background: '#030A16', borderRadius: '0 6px 6px 0', overflow: 'hidden',
                            border: `1px solid rgba(212,175,55,0.18)`, borderLeft: 'none',
                            boxShadow: isHovered ? `6px 0 40px rgba(0,0,0,0.6), 0 0 30px ${accent}30` : '4px 0 20px rgba(0,0,0,0.5)',
                            transition: 'box-shadow 0.4s',
                          }}>
                            {/* Top accent line */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${accent}80, ${accent}, ${accent}80, transparent)`, zIndex: 2 }} />

                            {/* ── PHOTO AREA — fixed height, position relative so img fills it ── */}
                            <div style={{ position: 'relative', height: '60%', overflow: 'hidden' }}>
                              <img
                                src={project.images[0]}
                                alt={project.name}
                                className="book-cover-img"
                                loading="eager"
                              />
                              {/* Fade to dark */}
                              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 20%, #030A16 100%)`, zIndex: 1 }} />
                              {/* Featured star */}
                              {project.featured && (
                                <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #8B6010)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#030A16', zIndex: 2, fontWeight: 900 }}>★</div>
                              )}
                            </div>

                            {/* ── TEXT AREA ── */}
                            <div className="page-lines-bg" style={{ padding: '8px 10px 10px', height: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ fontFamily: "'Cinzel',serif", fontSize: isMobile ? 6 : 7.5, color: `${accent}60`, letterSpacing: '0.2em', marginBottom: 4, textTransform: 'uppercase' }}>Chapter {chapter}</div>
                                <div style={{ height: 1, background: `linear-gradient(to right, ${accent}60, transparent)`, marginBottom: 5 }} />
                                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 8 : Math.max(9, 13 - project.name.length / 5), color: isHovered ? accent : '#e8dfc8', lineHeight: 1.2, transition: 'color 0.3s', marginBottom: 3 }}>{project.name}</h3>
                                <div style={{ fontFamily: "'EB Garamond',serif", fontSize: isMobile ? 7 : 9, color: 'rgba(199,185,155,0.5)', lineHeight: 1.3 }}>{project.location}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: isMobile ? 8 : 10, background: `linear-gradient(135deg, ${accent}, #F0E0A0)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.startingPrice}</span>
                                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <svg style={{ width: 8, height: 8, color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                              </div>
                            </div>

                            {/* Hover overlay */}
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,10,22,0.6)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.35s', zIndex: 3 }}>
                              <div style={{ padding: isMobile ? '7px 13px' : '10px 18px', borderRadius: 20, background: `linear-gradient(135deg, ${accent}, #8B6010)`, color: '#030A16', fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: isMobile ? 9 : 11, transform: isHovered ? 'translateY(0)' : 'translateY(12px)', transition: 'transform 0.35s', boxShadow: `0 0 30px ${accent}60` }}>Open Book</div>
                            </div>
                          </div>

                          {/* ── PAGE EDGE ── */}
                          <div style={{ position: 'absolute', top: 4, right: -7, bottom: 4, width: 8, background: 'repeating-linear-gradient(to bottom, #d6cdb0 0px, #d6cdb0 1px, #ede6cc 1px, #ede6cc 3.5px)', borderRadius: '0 2px 2px 0', boxShadow: '3px 0 8px rgba(0,0,0,0.4)', pointerEvents: 'none' }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Shelf plank */}
                  <div style={{ height: isMobile ? 16 : 22, background: 'linear-gradient(to bottom, #5a3510 0%, #3d2208 40%, #2a1605 100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.7)', position: 'relative', overflow: 'hidden' }}>
                    <div className="shelf-glow" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4) 20%, rgba(212,175,55,0.6) 50%, rgba(212,175,55,0.4) 80%, transparent)' }} />
                  </div>
                  <div style={{ height: 20, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }} />
                </div>

                {/* Shelf leg */}
                <div style={{ height: isMobile ? 14 : 20, background: 'linear-gradient(to right, #3d2208, #5a3510, #6b4018, #5a3510, #3d2208)', borderRadius: '0 0 8px 8px', boxShadow: '0 12px 50px rgba(0,0,0,0.8)' }} />

                {/* Caption */}
                <div style={{ textAlign: 'center', paddingTop: 32, padding: '32px 16px 0' }}>
                  <p style={{ fontFamily: "'EB Garamond',serif", fontStyle: 'italic', fontSize: isMobile ? 12 : 14, color: 'rgba(212,175,55,0.35)' }}>{isMobile ? 'Tap a book to explore' : 'Hover over a book to preview · Click to explore'}</p>
                </div>
              </div>
            </section>
          )}

          {filteredProjects.length === 0 && (
            <div style={{ padding: '80px 24px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 800, fontSize: '2rem', color: '#fff', marginBottom: 16 }}>No Projects Found</h3>
              <p style={{ fontFamily: "'Lato',sans-serif", color: 'rgba(199,209,219,.55)', fontSize: 16, marginBottom: 24 }}>Try adjusting your search or filters</p>
              <button onClick={() => { setSelectedStatus('All'); setSearchQuery(''); }} style={{ padding: '14px 32px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>Reset Filters</button>
            </div>
          )}

          {/* ── CTA ─────────────────────────────────────────────────────────── */}
          <section style={{ padding: isMobile ? '70px 20px' : '100px 24px', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,10,22,.96)' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%,rgba(212,175,55,.06) 0%,transparent 60%)' }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 24px', borderRadius: 100, background: 'rgba(212,175,55,.1)', border: '1px solid rgba(212,175,55,.3)', marginBottom: 28 }}>
                <div className="pulse-dot" />
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: isMobile ? 9 : 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: '#F5C97A' }}>INVEST IN YOUR FUTURE</span>
              </div>
              <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? '1.8rem' : 'clamp(2rem,4vw,3.2rem)', color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>Ready to Own Your <span className="gold-shimmer">Dream Home?</span></h2>
              <p style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? '0.95rem' : '1.1rem', color: 'rgba(199,209,219,.6)', fontWeight: 300, lineHeight: 1.9, marginBottom: 40 }}>Book a personalized site visit or virtual tour — zero commission, zero pressure.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                <button style={{ padding: isMobile ? '14px 30px' : '16px 40px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: isMobile ? 14 : 16, border: 'none', cursor: 'pointer', boxShadow: '0 0 50px rgba(212,175,55,.5)', width: isMobile ? '100%' : 'auto' }}>Schedule Site Visit</button>
                <button style={{ padding: isMobile ? '14px 30px' : '16px 40px', borderRadius: 100, background: 'transparent', color: '#D4AF37', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: isMobile ? 14 : 16, border: '1.5px solid rgba(212,175,55,.5)', cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>Contact Sales</button>
              </div>
            </div>
          </section>
        </main>
      </article>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} isMobile={isMobile} isTablet={isTablet} />
      )}
    </>
  );
};

export default ProjectsPage;