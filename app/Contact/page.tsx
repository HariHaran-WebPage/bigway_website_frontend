'use client';
import React, { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */
interface Blip {
  col: number;
  progress: number;
  speed: number;
  alpha: number;
}

interface AnimatedStatCardProps {
  value: string;
  label: string;
  delay?: number;
  icon?: React.ReactNode;
}

interface SidePanelProps {
  isVisible: boolean;
}

interface MobileStatsStripProps {
  isVisible: boolean;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  link?: string;
  delay?: number;
}

interface ServiceOptionProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}

/* ═══════════════════════════════════════════════════
   ANIMATED GRID BACKGROUND
═══════════════════════════════════════════════════ */
const AnimatedGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const frame = useRef(0);
  const blips = useRef<Blip[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    let W: number, H: number;

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const spawnBlip = () => {
      const cols = 14;
      blips.current.push({ col: Math.floor(Math.random() * cols), progress: 0, speed: 0.003 + Math.random() * 0.004, alpha: 0.7 + Math.random() * 0.3 });
    };
    const blipInterval = setInterval(spawnBlip, 900);

    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W, H);
      const COLS = 14, ROWS = 10;
      const cellW = W / COLS, cellH = H / ROWS;
      const t = frame.current * 0.012;

      for (let c = 0; c <= COLS; c++) {
        const x = c * cellW;
        const dx = x - mouse.current.x, dy = H / 2 - mouse.current.y;
        const proximity = Math.max(0, 1 - Math.sqrt(dx*dx+dy*dy) / 300);
        const baseAlpha = 0.06 + proximity * 0.22;
        const grad = ctx.createLinearGradient(x, 0, x, H);
        grad.addColorStop(0, `rgba(212,175,55,0)`); grad.addColorStop(0.3, `rgba(212,175,55,${baseAlpha})`);
        grad.addColorStop(0.7, `rgba(212,175,55,${baseAlpha})`); grad.addColorStop(1, `rgba(212,175,55,0)`);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.strokeStyle = grad; ctx.lineWidth = proximity > 0.4 ? 1.5 : 0.8; ctx.stroke();
      }

      for (let r = 0; r <= ROWS; r++) {
        const y = r * cellH;
        const dx = W/2 - mouse.current.x, dy = y - mouse.current.y;
        const proximity = Math.max(0, 1 - Math.sqrt(dx*dx+dy*dy) / 300);
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
          const dist = Math.sqrt(dx*dx+dy*dy);
          const proximity = Math.max(0, 1 - dist / 200);
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + c * 0.5 + r * 0.7);
          const size = 1.2 + pulse * 0.6 + proximity * 4;
          const alpha = 0.12 + pulse * 0.1 + proximity * 0.65;
          ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI*2);
          ctx.fillStyle = `rgba(212,175,55,${alpha})`; ctx.fill();
          if (proximity > 0.5) {
            ctx.beginPath(); ctx.arc(x, y, size + 4, 0, Math.PI*2);
            ctx.strokeStyle = `rgba(212,175,55,${proximity * 0.3})`; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }

      const scanY = (Math.sin(t * 0.3) * 0.5 + 0.5) * H;
      const scanGrad = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
      scanGrad.addColorStop(0,'rgba(212,175,55,0)'); scanGrad.addColorStop(0.5,'rgba(212,175,55,0.10)'); scanGrad.addColorStop(1,'rgba(212,175,55,0)');
      ctx.fillStyle = scanGrad; ctx.fillRect(0, scanY - 80, W, 160);
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY);
      const lineGrad = ctx.createLinearGradient(0,0,W,0);
      lineGrad.addColorStop(0,'rgba(212,175,55,0)'); lineGrad.addColorStop(0.5,'rgba(245,201,122,0.55)'); lineGrad.addColorStop(1,'rgba(212,175,55,0)');
      ctx.strokeStyle = lineGrad; ctx.lineWidth = 1.5; ctx.stroke();

      blips.current = blips.current.filter((b: Blip) => b.progress < 1);
      for (const blip of blips.current) {
        blip.progress += blip.speed;
        const x = blip.col * cellW, y = blip.progress * H;
        const blipGrad = ctx.createLinearGradient(x, y - 60, x, y + 10);
        blipGrad.addColorStop(0,'rgba(212,175,55,0)'); blipGrad.addColorStop(1,`rgba(255,220,100,${blip.alpha})`);
        ctx.beginPath(); ctx.moveTo(x, y-60); ctx.lineTo(x, y);
        ctx.strokeStyle = blipGrad; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,220,100,${blip.alpha})`; ctx.fill();
      }

      const corners: [number, number][] = [[0,0],[W,0],[0,H],[W,H]];
      const cornerPulse = 0.6 + 0.4 * Math.sin(t * 2);
      corners.forEach(([cx, cy]) => {
        const s = 8 * cornerPulse;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI/4);
        ctx.strokeStyle = `rgba(212,175,55,${0.3 * cornerPulse})`; ctx.lineWidth = 1.5;
        ctx.strokeRect(-s/2, -s/2, s, s); ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); clearInterval(blipInterval); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

/* ═══════════════════════════════════════════════════
   RESPONSIVE HOOK
═══════════════════════════════════════════════════ */
function useScreenSize() {
  const [size, setSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1200 });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return {
    isMobile: size.w < 480,
    isTablet: size.w >= 480 && size.w < 900,
    isSmall: size.w < 900,
    isWide: size.w >= 1300,
    w: size.w,
  };
}

/* ═══════════════════════════════════════════════════
   SIDE PANEL ATOMS
═══════════════════════════════════════════════════ */
const AnimatedLine = ({ delay = 0 }: { delay?: number }) => (
  <div style={{ width: 1, height: 60, background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.5), transparent)', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: '-40%', left: 0, width: '100%', height: '40%',
      background: 'linear-gradient(180deg, transparent, rgba(255,220,100,0.95), transparent)',
      animation: 'lineTravelV 2.4s ease-in-out infinite',
      animationDelay: `${delay}s`,
    }} />
  </div>
);

const PulsingOrb = ({ size = 6, delay = 0 }: { size?: number; delay?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: 'radial-gradient(circle, #F5C97A 0%, #D4AF37 60%, transparent 100%)',
    boxShadow: `0 0 ${size * 2}px rgba(212,175,55,0.9), 0 0 ${size * 4}px rgba(212,175,55,0.3)`,
    animation: 'orbPulse 2s ease-in-out infinite',
    animationDelay: `${delay}s`,
  }} />
);

const RotatingDiamond = ({ delay = 0 }: { delay?: number }) => (
  <div style={{ position: 'relative', width: 22, height: 22, margin: '2px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(212,175,55,0.5)', transform: 'rotate(45deg)', animation: 'diamondSpin 7s linear infinite', animationDelay: `${delay}s` }} />
    <div style={{ width: 8, height: 8, background: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 14px rgba(212,175,55,0.9)', animation: 'diamondGlow 2.2s ease-in-out infinite', animationDelay: `${delay}s` }} />
  </div>
);

const AnimatedStatCard = ({ value, label, delay = 0, icon }: AnimatedStatCardProps) => (
  <div style={{
    padding: '18px 22px',
    background: 'rgba(2,7,18,0.96)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: 16,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    minWidth: 138,
    animation: 'cardFloat 4s ease-in-out infinite',
    animationDelay: `${delay}s`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(212,175,55,0.13)',
  }}>
    <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.07), transparent)', animation: 'shimmerSweep 3.5s ease-in-out infinite', animationDelay: `${delay + 0.4}s` }} />
    <div style={{ position: 'absolute', top: 0, left: '15%', width: '70%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }} />
    {icon && <div style={{ marginBottom: 7, display: 'flex', justifyContent: 'center' }}>{icon}</div>}
    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 26, fontWeight: 800, color: '#D4AF37', lineHeight: 1, marginBottom: 6, textShadow: '0 0 20px rgba(212,175,55,0.5)', animation: 'numberGlow 3s ease-in-out infinite', animationDelay: `${delay}s` }}>{value}</div>
    <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(199,209,219,0.6)' }}>{label}</div>
  </div>
);

/* ═══════════════════════════════════════════════════
   LEFT SIDE PANEL — hidden on small screens
═══════════════════════════════════════════════════ */
const LeftSidePanel = ({ isVisible }: SidePanelProps) => (
  <div className="side-panel side-panel-left" style={{
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 'calc((100% - 1000px) / 2)',
    zIndex: 5, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(-60px)',
    transition: 'opacity 1.4s cubic-bezier(.22,1,.36,1) 0.3s, transform 1.4s cubic-bezier(.22,1,.36,1) 0.3s',
    padding: '0 20px', pointerEvents: 'none',
  }}>
    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 180, height: 480, background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>
      <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.4))' }} />
      <AnimatedStatCard value="<30m" label="Response Time" delay={0.2}
        icon={<svg width="16" height="16" fill="none" stroke="#D4AF37" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
      />
      <AnimatedLine delay={0} />
      <PulsingOrb size={6} delay={0} />
      <AnimatedLine delay={0.3} />
      <AnimatedStatCard value="2400+" label="Families Served" delay={0.6}
        icon={<svg width="16" height="16" fill="none" stroke="#D4AF37" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
      />
      <AnimatedLine delay={0.6} />
      <RotatingDiamond delay={0} />
      <AnimatedLine delay={0.9} />
      <div style={{ padding: '10px 20px', background: 'rgba(2,7,18,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 50, animation: 'cardFloat 5s ease-in-out infinite 1s', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 10px rgba(212,175,55,1)', animation: 'orbPulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D4AF37' }}>FREE · CONSULT</span>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 10px rgba(212,175,55,1)', animation: 'orbPulse 1.5s ease-in-out infinite 0.7s' }} />
        </div>
      </div>
      <AnimatedLine delay={1.2} />
      <PulsingOrb size={6} delay={0.5} />
      <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg, rgba(212,175,55,0.4), transparent)' }} />
    </div>
    <div style={{ position: 'absolute', top: '18%', left: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[0,1,2,3].map(i => <div key={i} style={{ width: 2, height: 2, borderRadius: '50%', background: '#D4AF37', opacity: 0.35 + i * 0.12, animation: 'orbPulse 2s ease-in-out infinite', animationDelay: `${i * 0.3}s` }} />)}
    </div>
    <div style={{ position: 'absolute', bottom: '12%', left: 14, transform: 'rotate(-90deg)', transformOrigin: 'center center', fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.35)', whiteSpace: 'nowrap' }}>COIMBATORE · EST. 2009</div>
    <div style={{ position: 'absolute', top: '8%', left: 12, width: 22, height: 22, borderLeft: '1.5px solid rgba(212,175,55,0.4)', borderTop: '1.5px solid rgba(212,175,55,0.4)', animation: 'bracketPulse 3s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '8%', left: 12, width: 22, height: 22, borderLeft: '1.5px solid rgba(212,175,55,0.4)', borderBottom: '1.5px solid rgba(212,175,55,0.4)', animation: 'bracketPulse 3s ease-in-out infinite 1s' }} />
  </div>
);

/* ═══════════════════════════════════════════════════
   RIGHT SIDE PANEL — hidden on small screens
═══════════════════════════════════════════════════ */
const RightSidePanel = ({ isVisible }: SidePanelProps) => (
  <div className="side-panel side-panel-right" style={{
    position: 'absolute', right: 0, top: 0, bottom: 0,
    width: 'calc((100% - 1000px) / 2)',
    zIndex: 5, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(60px)',
    transition: 'opacity 1.4s cubic-bezier(.22,1,.36,1) 0.3s, transform 1.4s cubic-bezier(.22,1,.36,1) 0.3s',
    padding: '0 20px', pointerEvents: 'none',
  }}>
    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 180, height: 480, background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>
      <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.4))' }} />
      <div style={{ width: 138, height: 98, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.28)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.08)', position: 'relative', animation: 'cardFloat 4.5s ease-in-out infinite 0.5s' }}>
        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) saturate(0.7)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(3,10,22,0.9) 100%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(212,175,55,0.6)', animation: 'imageScan 3s ease-in-out infinite', boxShadow: '0 0 6px rgba(212,175,55,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 700, letterSpacing: '0.15em', color: '#D4AF37', textTransform: 'uppercase' }}>Our Office</span>
          <div style={{ display: 'flex', gap: 2 }}>{[0,1,2].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#D4AF37', opacity: 0.6 + i * 0.15 }} />)}</div>
        </div>
      </div>
      <AnimatedLine delay={0.5} />
      <PulsingOrb size={6} delay={0.2} />
      <AnimatedLine delay={0.8} />
      <AnimatedStatCard value="15+" label="Years Expert" delay={0.4}
        icon={<svg width="16" height="16" fill="none" stroke="#D4AF37" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
      />
      <AnimatedLine delay={1.1} />
      <RotatingDiamond delay={1} />
      <AnimatedLine delay={1.4} />
      <div style={{ padding: '12px 18px', background: 'rgba(2,7,18,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.28)', borderRadius: 12, animation: 'cardFloat 5s ease-in-out infinite 2s', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', minWidth: 138 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
          <svg width="13" height="13" fill="none" stroke="#D4AF37" strokeWidth="2" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.6))' }}><circle cx="12" cy="12" r="10"/><path d="M9 9h.01M15 15h.01M9.5 15.5l5-7"/></svg>
          <div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase' }}>ZERO</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(212,175,55,0.55)', textTransform: 'uppercase' }}>COMMISSION</div>
          </div>
        </div>
      </div>
      <AnimatedLine delay={1.7} />
      <PulsingOrb size={6} delay={0.8} />
      <AnimatedStatCard value="₹850Cr+" label="Transacted" delay={1.0} />
      <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg, rgba(212,175,55,0.4), transparent)' }} />
    </div>
    <div style={{ position: 'absolute', top: '18%', right: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[0,1,2,3].map(i => <div key={i} style={{ width: 2, height: 2, borderRadius: '50%', background: '#D4AF37', opacity: 0.35 + i * 0.12, animation: 'orbPulse 2s ease-in-out infinite', animationDelay: `${i * 0.3}s` }} />)}
    </div>
    <div style={{ position: 'absolute', bottom: '12%', right: 14, transform: 'rotate(90deg)', transformOrigin: 'center center', fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.35)', whiteSpace: 'nowrap' }}>LUXURY · REAL · ESTATE</div>
    <div style={{ position: 'absolute', top: '8%', right: 12, width: 22, height: 22, borderRight: '1.5px solid rgba(212,175,55,0.4)', borderTop: '1.5px solid rgba(212,175,55,0.4)', animation: 'bracketPulse 3s ease-in-out infinite 0.5s' }} />
    <div style={{ position: 'absolute', bottom: '8%', right: 12, width: 22, height: 22, borderRight: '1.5px solid rgba(212,175,55,0.4)', borderBottom: '1.5px solid rgba(212,175,55,0.4)', animation: 'bracketPulse 3s ease-in-out infinite 1.5s' }} />
  </div>
);

/* ═══════════════════════════════════════════════════
   MOBILE STATS STRIP — shown only on small screens
═══════════════════════════════════════════════════ */
const MobileStatsStrip = ({ isVisible }: MobileStatsStripProps) => (
  <div style={{
    display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
    padding: '0 16px 28px',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : 'translateY(20px)',
    transition: 'opacity 1s ease 0.6s, transform 1s ease 0.6s',
  }}>
    {[
      { value: '<30m', label: 'Response' },
      { value: '2400+', label: 'Families' },
      { value: '15+', label: 'Yrs Expert' },
      { value: '₹850Cr+', label: 'Transacted' },
    ].map((s, i) => (
      <div key={i} style={{
        padding: '12px 18px', borderRadius: 12,
        background: 'rgba(2,7,18,0.92)', border: '1px solid rgba(212,175,55,0.22)',
        textAlign: 'center', minWidth: 80,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, fontWeight: 800, color: '#D4AF37' }}>{s.value}</div>
        <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(199,209,219,0.55)', marginTop: 3 }}>{s.label}</div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════ */
const IconPhone = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 10.68 19.79 19.79 0 01.46 2.05a2 2 0 012-.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.2-1.2a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const IconMail = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const IconLocation = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>);
const IconClock = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const IconWhatsapp = () => (<svg viewBox="0 0 24 24" fill="currentColor" style={{width:'100%',height:'100%'}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>);
const IconArrow = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const IconHome = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconBuilding = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>);
const IconKey = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/></svg>);
const IconChart = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
const IconCheckCircle = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);

/* ═══════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════ */
function useFadeIn(threshold = 0.05): [React.RefObject<HTMLDivElement | null>, boolean] {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ═══════════════════════════════════════════════════
   CONTACT INFO CARD
═══════════════════════════════════════════════════ */
const InfoCard = ({ icon, label, value, sub, link, delay = 0 }: InfoCardProps) => {
  const [ref, vis] = useFadeIn(0.05);
  const [hov, setHov] = useState(false);
  const inner = (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? (hov ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(40px)',
        transition: `all .4s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        padding: '22px 22px',
        borderRadius: 18,
        background: 'linear-gradient(155deg,rgba(7,18,36,.92),rgba(3,10,22,.98))',
        border: `1.5px solid ${hov ? 'rgba(212,175,55,.55)' : 'rgba(212,175,55,.14)'}`,
        boxShadow: hov ? '0 28px 80px rgba(0,0,0,.7), 0 0 50px rgba(212,175,55,.08)' : '0 4px 28px rgba(0,0,0,.45)',
        cursor: link ? 'pointer' : 'default',
        display: 'flex', alignItems: 'flex-start', gap: 16,
        backdropFilter: 'blur(12px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 12, flexShrink: 0,
        background: hov ? 'linear-gradient(135deg,#D4AF37,#F5C97A)' : 'rgba(212,175,55,.1)',
        border: `1.5px solid ${hov ? 'transparent' : 'rgba(212,175,55,.22)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov ? '#0A1628' : '#D4AF37',
        boxShadow: hov ? '0 8px 32px rgba(212,175,55,.5)' : 'none',
        transition: 'all .4s cubic-bezier(.22,1,.36,1)',
        padding: 12,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(212,175,55,.45)', marginBottom: 6 }}>{label}</div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: hov ? '#F5C97A' : '#fff', transition: 'color .3s', marginBottom: sub ? 4 : 0, wordBreak: 'break-word' }}>{value}</div>
        {sub && <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 12, color: 'rgba(199,209,219,.42)', fontWeight: 300 }}>{sub}</div>}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#D4AF37,#F5C97A,transparent)', opacity: hov ? 1 : 0, transition: 'opacity .4s' }} />
    </div>
  );
  return link ? <a href={link} style={{ textDecoration: 'none', display: 'block' }}>{inner}</a> : inner;
};

/* ═══════════════════════════════════════════════════
   SERVICE OPTION
═══════════════════════════════════════════════════ */
const ServiceOption = ({ icon, label, desc, selected, onClick }: ServiceOptionProps) => (
  <button onClick={onClick} style={{
    background: selected ? 'linear-gradient(135deg,rgba(212,175,55,.18),rgba(245,201,122,.1))' : 'rgba(212,175,55,.05)',
    border: `1.5px solid ${selected ? 'rgba(212,175,55,.65)' : 'rgba(212,175,55,.15)'}`,
    borderRadius: 12, padding: '14px 14px', cursor: 'pointer', textAlign: 'left',
    display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: selected ? '0 0 30px rgba(212,175,55,.12)' : 'none',
    transition: 'all .3s cubic-bezier(.22,1,.36,1)',
    width: '100%',
  }}>
    <div style={{ width: 34, height: 34, borderRadius: 9, background: selected ? 'linear-gradient(135deg,#D4AF37,#F5C97A)' : 'rgba(212,175,55,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selected ? '#0A1628' : 'rgba(212,175,55,.6)', flexShrink: 0, padding: 8, transition: 'all .3s' }}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: selected ? '#F5C97A' : 'rgba(255,255,255,.7)', transition: 'color .3s' }}>{label}</div>
      <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 11, color: 'rgba(199,209,219,.36)', fontWeight: 300, marginTop: 2 }}>{desc}</div>
    </div>
    {selected && <div style={{ marginLeft: 'auto', width: 18, height: 18, color: '#D4AF37', flexShrink: 0 }}><IconCheckCircle /></div>}
  </button>
);

/* ═══════════════════════════════════════════════════
   MAIN CONTACT PAGE
═══════════════════════════════════════════════════ */
const ContactPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formRef, formVis] = useFadeIn(0.04);
  const [selectedService, setSelectedService] = useState('Buy Property');
  const [budget, setBudget] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', message: '' });
  const screen = useScreenSize();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1800);
  };

  const services = [
    { id: 'Buy Property', icon: <IconHome />, label: 'Buy Property', desc: 'Find your dream home' },
    { id: 'Sell Property', icon: <IconKey />, label: 'Sell Property', desc: 'Get the best value' },
    { id: 'Investment Advisory', icon: <IconChart />, label: 'Investment Advisory', desc: 'Maximize returns' },
    { id: 'Commercial Space', icon: <IconBuilding />, label: 'Commercial Space', desc: 'Office & retail' },
  ];

  const budgets = ['Below ₹30L', '₹30L – ₹60L', '₹60L – ₹1Cr', '₹1Cr – ₹2Cr', 'Above ₹2Cr'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --gold:#D4AF37;--gold-lt:#F5C97A;--gold-dk:#B8941F;--bg:#030A16; }
        html { -webkit-text-size-adjust: 100%; }
        body { background: var(--bg); overflow-x: hidden; }

        .cw { position:relative;overflow-x:hidden;min-height:100vh;background:var(--bg);color:#C7D1DB; }

        @keyframes au__driftA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-35px)} }
        @keyframes au__driftB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,28px)} }

        .bw-hero-orb1 { position:absolute;top:-180px;left:-160px;width:650px;height:650px;border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%);filter:blur(70px);animation:au__driftA 28s ease-in-out infinite; }
        .bw-hero-orb2 { position:absolute;bottom:-200px;right:-160px;width:580px;height:580px;border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(245,201,122,0.04) 0%,transparent 62%);filter:blur(90px);animation:au__driftB 34s ease-in-out infinite 3s; }
        .bw-fixed-orb1 { position:fixed;top:-10%;right:-8%;width:600px;height:600px;border-radius:50%;z-index:0;pointer-events:none;background:radial-gradient(circle,rgba(212,175,55,0.04) 0%,transparent 65%);filter:blur(100px);animation:au__driftA 26s ease-in-out infinite; }
        .bw-fixed-orb2 { position:fixed;bottom:-10%;left:-8%;width:550px;height:550px;border-radius:50%;z-index:0;pointer-events:none;background:radial-gradient(circle,rgba(245,201,122,0.035) 0%,transparent 60%);filter:blur(120px);animation:au__driftB 32s ease-in-out infinite 3s; }

        .gold-shimmer { background:linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F);background-size:220% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:textShimmer 9s linear infinite; }
        @keyframes textShimmer { 0%{background-position:-220%} 100%{background-position:220%} }

        .pulse-dot { display:inline-block;width:7px;height:7px;border-radius:50%;background:#D4AF37;box-shadow:0 0 8px rgba(212,175,55,.8);animation:pdot 2.4s ease-out infinite; }
        @keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.7)} 60%{box-shadow:0 0 0 10px rgba(212,175,55,0)} }

        .gem { width:8px;height:8px;background:#D4AF37;transform:rotate(45deg);box-shadow:0 0 16px rgba(212,175,55,.85);animation:gemP 3.8s ease-in-out infinite; }
        @keyframes gemP { 0%,100%{box-shadow:0 0 12px rgba(212,175,55,.7)} 50%{box-shadow:0 0 32px rgba(212,175,55,1)} }

        /* Side panels – hidden on screens ≤1200px */
        .side-panel { display:flex; }
        @media(max-width:1200px) { .side-panel { display:none !important; } }

        /* Side-panel animations */
        @keyframes lineTravelV { 0%{top:-40%} 100%{top:140%} }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:.8;box-shadow:0 0 8px rgba(212,175,55,.7)} 50%{transform:scale(1.5);opacity:1;box-shadow:0 0 22px rgba(212,175,55,1),0 0 44px rgba(212,175,55,.4)} }
        @keyframes diamondSpin { from{transform:rotate(45deg)} to{transform:rotate(405deg)} }
        @keyframes diamondGlow { 0%,100%{box-shadow:0 0 8px rgba(212,175,55,.7)} 50%{box-shadow:0 0 24px rgba(212,175,55,1),0 0 44px rgba(212,175,55,.4)} }
        @keyframes cardFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmerSweep { 0%{left:-100%} 100%{left:200%} }
        @keyframes numberGlow { 0%,100%{text-shadow:0 0 14px rgba(212,175,55,.4)} 50%{text-shadow:0 0 30px rgba(212,175,55,.9),0 0 55px rgba(212,175,55,.3)} }
        @keyframes imageScan { 0%{top:0%;opacity:1} 85%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes bracketPulse { 0%,100%{border-color:rgba(212,175,55,.3)} 50%{border-color:rgba(212,175,55,.75);box-shadow:2px 2px 14px rgba(212,175,55,.22)} }

        /* Form inputs */
        .cw-input { width:100%;background:rgba(3,10,22,.92);backdrop-filter:blur(20px);border:1.5px solid rgba(212,175,55,.18);border-radius:10px;padding:14px 16px;font-family:'Lato',sans-serif;font-size:15px;color:#fff;outline:none;transition:border-color .3s,box-shadow .3s; -webkit-appearance:none; }
        .cw-input::placeholder { color:rgba(199,209,219,.32); }
        .cw-input:focus { border-color:rgba(212,175,55,.55);box-shadow:0 0 0 3px rgba(212,175,55,.1); }
        .cw-label { font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(212,175,55,.5);display:block;margin-bottom:9px; }
        .submit-btn { width:100%;padding:16px;border-radius:12px;border:none;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:700;font-size:16px;letter-spacing:.06em;background:linear-gradient(135deg,#D4AF37,#F5C97A);color:#0A1628;box-shadow:0 0 52px rgba(212,175,55,.4);transition:all .35s cubic-bezier(.22,1,.36,1); -webkit-appearance:none; touch-action:manipulation; }
        .submit-btn:hover { transform:translateY(-2px);box-shadow:0 16px 60px rgba(212,175,55,.65); }
        .submit-btn:disabled { opacity:.65;cursor:not-allowed;transform:none; }

        /* Main grid layouts */
        .contact-grid { display:grid;grid-template-columns:1fr 1fr;gap:24px; }
        .info-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .service-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
        .form-two-col { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
        .testimonial-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
        .hours-flex { display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:space-between; }

        /* Tablet breakpoint ≤900px */
        @media(max-width:900px) {
          .contact-grid { grid-template-columns:1fr; }
          .testimonial-grid { grid-template-columns:1fr 1fr; }
        }

        /* Mobile breakpoint ≤620px */
        @media(max-width:620px) {
          .info-grid { grid-template-columns:1fr; }
          .service-grid { grid-template-columns:1fr 1fr; }
          .form-two-col { grid-template-columns:1fr; gap:14px; }
          .testimonial-grid { grid-template-columns:1fr; }
          .hours-flex { flex-direction:column;align-items:flex-start;gap:10px; }
        }

        /* Extra small ≤380px */
        @media(max-width:380px) {
          .service-grid { grid-template-columns:1fr; }
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#030A16; }
        ::-webkit-scrollbar-thumb { background:rgba(212,175,55,.24);border-radius:3px; }

        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        .spin { animation:spin 1s linear infinite; }

        /* Touch targets */
        @media(hover:none) {
          .submit-btn:hover { transform:none; }
        }

        /* Safe area insets for notched phones */
        .cw { padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }
      `}</style>

      <div className="cw">
        <div className="bw-fixed-orb1" />
        <div className="bw-fixed-orb2" />
        <AnimatedGrid />

        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* ══════════════════════════════════════════
              HERO HEADER
          ══════════════════════════════════════════ */}
          <header style={{ position: 'relative', minHeight: screen.isMobile ? '80vh' : '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#030A16' }}>
            <div className="bw-hero-orb1" />
            <div className="bw-hero-orb2" />
            <LeftSidePanel isVisible={isVisible} />
            <RightSidePanel isVisible={isVisible} />

            <div style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(44px)',
              transition: 'opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1)',
              textAlign: 'center',
              padding: screen.isMobile ? '80px 20px 40px' : screen.isTablet ? '90px 32px 52px' : '90px 24px 56px',
              maxWidth: 1000,
              margin: '0 auto',
              position: 'relative',
              zIndex: 10,
              width: '100%',
            }}>
              {/* Brand pill */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: screen.isMobile ? 8 : 12, marginBottom: screen.isMobile ? 20 : 28, padding: screen.isMobile ? '10px 20px' : '12px 32px', borderRadius: 10, background: 'rgba(2,7,18,.88)', backdropFilter: 'blur(28px)', border: '1.5px solid rgba(212,175,55,.36)', boxShadow: '0 0 56px rgba(212,175,55,.16), inset 0 1px 0 rgba(212,175,55,.1)', maxWidth: '100%' }}>
                <div className="pulse-dot" />
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: screen.isMobile ? 9 : 11, fontWeight: 700, letterSpacing: screen.isMobile ? '.16em' : '.26em', textTransform: 'uppercase', color: '#D4AF37' }}>
                  Bigway Real Estate · Coimbatore
                </span>
                <div className="pulse-dot" style={{ animationDelay: '.7s' }} />
              </div>

              {/* Badge */}
              <div style={{ marginBottom: screen.isMobile ? 16 : 22 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: screen.isMobile ? '6px 14px' : '8px 20px', borderRadius: 8, background: 'rgba(212,175,55,.09)', border: '1px solid rgba(212,175,55,.28)', fontFamily: "'Orbitron',sans-serif", fontSize: screen.isMobile ? 9 : 11, fontWeight: 700, letterSpacing: screen.isMobile ? '.16em' : '.24em', textTransform: 'uppercase', color: '#D4AF37' }}>
                  GET IN TOUCH · FREE CONSULTATION
                </div>
              </div>

              {/* Main heading */}
              <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: screen.isMobile ? '2.2rem' : 'clamp(2.8rem, 5.5vw, 4.5rem)', lineHeight: 1.06, color: '#fff', marginBottom: 4, textShadow: '0 4px 60px rgba(0,0,0,.8)', letterSpacing: '-.025em' }}>
                Let's Find Your
              </h1>
              <div className="gold-shimmer" style={{ display: 'block', fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: screen.isMobile ? '2.2rem' : 'clamp(2.8rem, 5.5vw, 4.5rem)', lineHeight: 1.06, marginBottom: screen.isMobile ? 20 : 26, letterSpacing: '-.025em' }}>
                Dream Property
              </div>

              {/* Subtext */}
              <p style={{ fontFamily: "'Lato',sans-serif", fontSize: screen.isMobile ? '0.95rem' : 'clamp(1rem, 1.6vw, 1.18rem)', lineHeight: 1.9, color: 'rgba(199,209,219,.7)', maxWidth: 520, margin: '0 auto 28px', fontWeight: 300, padding: '0 4px' }}>
                Speak directly with our expert advisors — zero commission, zero pressure. Trusted by 2,400+ families across Coimbatore since 2009.
              </p>

              {/* Decorative divider */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
                <div style={{ height: 1, width: screen.isMobile ? 60 : 120, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.55),transparent)' }} />
                <div className="gem" />
                <div style={{ height: 1, width: screen.isMobile ? 60 : 120, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.55),transparent)', transform: 'scaleX(-1)' }} />
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, transparent, #030A16)', pointerEvents: 'none', zIndex: 3 }} />
          </header>

          {/* Mobile stats strip – only on small screens */}
          {screen.isSmall && <MobileStatsStrip isVisible={isVisible} />}

          {/* ══ CONTACT CARDS ROW ══ */}
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: screen.isMobile ? '0 14px 28px' : '0 24px 36px' }}>
            <div className="info-grid">
              <InfoCard delay={0} icon={<IconPhone />} label="Call / WhatsApp" value="+91 98421 XXXXX" sub="Mon–Sat, 9 AM – 7 PM" link="tel:+919842100000" />
              <InfoCard delay={100} icon={<IconWhatsapp />} label="WhatsApp Chat" value="Quick Response" sub="Usually replies within 15 min" link="https://wa.me/919842100000" />
              <InfoCard delay={200} icon={<IconMail />} label="Email Us" value="info@bigwayrealty.com" sub="Response within 24 hours" link="mailto:info@bigwayrealty.com" />
              <InfoCard delay={300} icon={<IconLocation />} label="Visit Office" value="45, Race Course Road" sub="Coimbatore – 641018, Tamil Nadu" />
            </div>
          </div>

          {/* ══ OFFICE HOURS STRIP ══ */}
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: screen.isMobile ? '0 14px 32px' : '0 24px 40px' }}>
            <div style={{ padding: screen.isMobile ? '16px 18px' : '20px 30px', borderRadius: 14, background: 'rgba(212,175,55,.07)', border: '1px solid rgba(212,175,55,.18)' }}>
              <div className="hours-flex">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, color: '#D4AF37' }}><IconClock /></div>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: '#D4AF37' }}>Office Hours</span>
                </div>
                {[['Mon – Fri', '9:00 AM – 7:00 PM'], ['Saturday', '9:00 AM – 5:00 PM'], ['Sunday', 'By Appointment']].map(([day, time]) => (
                  <div key={day} style={{ textAlign: screen.isMobile ? 'left' : 'center' }}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: '#fff' }}>{day}</div>
                    <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 13, color: 'rgba(212,175,55,.55)' }}>{time}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,.6)', animation: 'pdot 2.4s ease-out infinite' }} />
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, color: '#4ade80' }}>Online Now</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══ MAIN SECTION: FORM + RIGHT PANEL ══ */}
          <div ref={formRef} style={{
            maxWidth: 1200, margin: '0 auto', padding: screen.isMobile ? '0 14px 70px' : '0 24px 100px',
            opacity: formVis ? 1 : 0,
            transform: formVis ? 'none' : 'translateY(40px)',
            transition: 'opacity .95s cubic-bezier(.22,1,.36,1), transform .95s cubic-bezier(.22,1,.36,1)',
          }}>
            <div className="contact-grid">

              {/* ── CONTACT FORM ── */}
              <div style={{ borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(160deg,rgba(7,18,36,.96),rgba(3,10,22,.99))', border: '1.5px solid rgba(212,175,55,.2)', boxShadow: '0 28px 100px rgba(0,0,0,.65), inset 0 1px 0 rgba(212,175,55,.08)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#B8941F 25%,#F5C97A 50%,#D4AF37 75%,transparent)' }} />

                {!submitted ? (
                  <form onSubmit={handleSubmit} style={{ padding: screen.isMobile ? '28px 20px' : screen.isTablet ? '36px 28px' : '48px 44px' }}>
                    <div style={{ marginBottom: 28 }}>
                      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: 'rgba(212,175,55,.45)', marginBottom: 10 }}>Start Here</div>
                      <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 800, fontSize: screen.isMobile ? '1.35rem' : 'clamp(1.45rem, 2.8vw, 1.85rem)', color: '#fff', lineHeight: 1.2 }}>Book a Free Consultation</h2>
                    </div>

                    <div style={{ marginBottom: 22 }}>
                      <label className="cw-label">I'm looking to</label>
                      <div className="service-grid">
                        {services.map(s => (
                          <ServiceOption key={s.id} icon={s.icon} label={s.label} desc={s.desc}
                            selected={selectedService === s.id} onClick={() => setSelectedService(s.id)} />
                        ))}
                      </div>
                    </div>

                    <div className="form-two-col" style={{ marginBottom: 14 }}>
                      <div>
                        <label className="cw-label">Full Name *</label>
                        <input className="cw-input" name="name" placeholder="Eg: Arjun Kumar" required value={form.name} onChange={handleChange} />
                      </div>
                      <div>
                        <label className="cw-label">Phone Number *</label>
                        <input className="cw-input" name="phone" type="tel" placeholder="+91 98400 00000" required value={form.phone} onChange={handleChange} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label className="cw-label">Email Address</label>
                      <input className="cw-input" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
                    </div>

                    <div className="form-two-col" style={{ marginBottom: 14 }}>
                      <div>
                        <label className="cw-label">Preferred Area / City</label>
                        <input className="cw-input" name="city" placeholder="Eg: Saravanampatti" value={form.city} onChange={handleChange} />
                      </div>
                      <div>
                        <label className="cw-label">Budget Range</label>
                        <select className="cw-input" value={budget} onChange={e => setBudget(e.target.value)} style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                          <option value="" disabled>Select budget</option>
                          {budgets.map(b => <option key={b} value={b} style={{ background: '#030A16', color: '#fff' }}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: 26 }}>
                      <label className="cw-label">Your Message (Optional)</label>
                      <textarea className="cw-input" name="message" rows={3} placeholder="Tell us more about your requirements..." value={form.message} onChange={handleChange} style={{ resize: 'vertical', minHeight: 90 }} />
                    </div>

                    <button type="submit" className="submit-btn" disabled={submitting}>
                      {submitting ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                          <svg className="spin" style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/></svg>
                          Submitting…
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                          Request Free Consultation <IconArrow />
                        </span>
                      )}
                    </button>

                    <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 12, color: 'rgba(199,209,219,.32)', textAlign: 'center', marginTop: 14, lineHeight: 1.7 }}>
                      By submitting, you agree to be contacted by our team. No spam, zero obligation.
                    </p>
                  </form>
                ) : (
                  <div style={{ padding: screen.isMobile ? '50px 24px' : '80px 40px', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 26px', boxShadow: '0 0 60px rgba(212,175,55,.6)', padding: 20 }}>
                      <IconCheckCircle />
                    </div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: 'rgba(212,175,55,.45)', marginBottom: 14 }}>Submitted Successfully</div>
                    <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 800, fontSize: screen.isMobile ? '1.5rem' : '1.8rem', color: '#fff', marginBottom: 14 }}>We'll Call You Shortly!</h3>
                    <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 15, color: 'rgba(199,209,219,.58)', lineHeight: 1.85, maxWidth: 360, margin: '0 auto 28px', fontWeight: 300 }}>
                      Thank you, <strong style={{ color: '#D4AF37' }}>{form.name || 'valued client'}</strong>. Our team will contact you within 30 minutes during business hours.
                    </p>
                    <div style={{ padding: '16px 22px', borderRadius: 12, background: 'rgba(212,175,55,.08)', border: '1px solid rgba(212,175,55,.2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 16, height: 16, color: '#D4AF37' }}><IconPhone /></div>
                      <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 600, color: '#D4AF37' }}>+91 98421 XXXXX</span>
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <button onClick={() => { setSubmitted(false); setForm({ name:'', phone:'', email:'', city:'', message:'' }); setBudget(''); }}
                        style={{ background: 'none', border: '1px solid rgba(212,175,55,.28)', borderRadius: 8, padding: '10px 24px', color: 'rgba(212,175,55,.6)', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, transition: 'all .3s' }}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'rgba(212,175,55,.1)'; e.currentTarget.style.color = '#D4AF37'; }}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(212,175,55,.6)'; }}
                      >Submit Another Request</button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT PANEL ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Map Embed */}
                <div style={{ borderRadius: 20, overflow: 'hidden', border: '1.5px solid rgba(212,175,55,.18)', boxShadow: '0 12px 60px rgba(0,0,0,.55)', position: 'relative', flex: '0 0 240px' }}>
                  <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(3,10,22,.3) 0%, transparent 30%, transparent 70%, rgba(3,10,22,.4) 100%)' }} />
                  <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 3, padding: '8px 14px', borderRadius: 8, background: 'rgba(3,10,22,.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(212,175,55,.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, color: '#D4AF37' }}><IconLocation /></div>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>Our Office</span>
                  </div>
                  <iframe title="Bigway Real Estate Office Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125287.01254044584!2d76.8960048!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710000000000" width="100%" height="240" style={{ border: 0, display: 'block', filter: 'grayscale(80%) invert(90%) brightness(0.35) sepia(40%) hue-rotate(180deg)' }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
                </div>

                {/* Why Choose Us */}
                <div style={{ padding: screen.isMobile ? '22px 20px' : '30px 32px', borderRadius: 20, background: 'linear-gradient(155deg,rgba(7,18,36,.92),rgba(3,10,22,.98))', border: '1.5px solid rgba(212,175,55,.14)', boxShadow: '0 4px 40px rgba(0,0,0,.45)', flex: 1 }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: 'rgba(212,175,55,.42)', marginBottom: 18 }}>Why Choose Bigway</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      ['15+ Years', 'Deep local expertise in Coimbatore & Tamil Nadu markets'],
                      ['₹850Cr+ Transacted', '2,400+ families trusted us with their biggest decisions'],
                      ['Free Legal Checks', '30-year title verification included with every purchase'],
                      ['15+ Bank Tie-ups', 'Best home loan rates, processed faster'],
                      ['Zero Hidden Fees', 'Transparent pricing with no surprises at registration'],
                    ].map(([title, desc], i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 22, height: 22, borderRadius: 7, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 2 }}>{title}</div>
                          <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 13, color: 'rgba(199,209,219,.45)', fontWeight: 300, lineHeight: 1.6 }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a href="https://wa.me/919842100000?text=Hi%20Bigway!%20I'm%20interested%20in%20a%20property%20consultation." target="_blank" rel="noreferrer"
                  style={{ textDecoration: 'none', display: 'block', padding: '20px 24px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(37,211,102,.14),rgba(37,211,102,.07))', border: '1.5px solid rgba(37,211,102,.3)', cursor: 'pointer', transition: 'all .35s', textAlign: 'center' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(37,211,102,.24),rgba(37,211,102,.12))'; e.currentTarget.style.borderColor = 'rgba(37,211,102,.6)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(37,211,102,.14),rgba(37,211,102,.07))'; e.currentTarget.style.borderColor = 'rgba(37,211,102,.3)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                    <div style={{ width: 28, height: 28, color: '#25D366', flexShrink: 0 }}><IconWhatsapp /></div>
                    <div>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, color: '#25D366' }}>Chat on WhatsApp</div>
                      <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 13, color: 'rgba(37,211,102,.58)', fontWeight: 300, marginTop: 2 }}>Instant response · Send property requirements</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* ══ TESTIMONIAL STRIP ══ */}
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: screen.isMobile ? '0 14px 60px' : '0 24px 80px' }}>
            <div className="testimonial-grid">
              {[
                { quote: 'Bigway found us the perfect 3BHK in Saravanampatti within 2 weeks. Exceptional service!', name: 'Priya & Raj Venkat', role: 'Homebuyers, 2024', initial: 'PV' },
                { quote: "The legal verification saved us from a fraudulent property. Truly invaluable guidance.", name: 'M. Suresh Kumar', role: 'Investor, 2024', initial: 'SK' },
                { quote: "Got 0.4% lower rate on my home loan through Bigway's bank tie-ups. Huge savings over 20 years!", name: 'Anitha Ramesh', role: 'First-time Buyer', initial: 'AR' },
              ].map((t, i) => (
                <div key={i} style={{ padding: '26px 22px', borderRadius: 16, background: 'rgba(7,18,36,.7)', border: '1px solid rgba(212,175,55,.12)', backdropFilter: 'blur(12px)' }}>
                  <div style={{ color: '#D4AF37', fontSize: 28, lineHeight: 1, marginBottom: 14, fontFamily: 'serif', opacity: 0.5 }}>"</div>
                  <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 14, color: 'rgba(199,209,219,.68)', lineHeight: 1.8, fontWeight: 300, fontStyle: 'italic', marginBottom: 18 }}>{t.quote}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#B8941F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: '#0A1628', flexShrink: 0 }}>{t.initial}</div>
                    <div>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: '#fff' }}>{t.name}</div>
                      <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 12, color: 'rgba(212,175,55,.4)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactPage;