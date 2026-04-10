'use client';
import React, { useState, useEffect, useRef } from 'react';

const AnimatedGrid = () => {
  const ref   = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const fr    = useRef(0);
  const blips = useRef<{ col:number; progress:number; speed:number; alpha:number }[]>([]);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    let raf: number, W: number, H: number;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.current = { x: e.clientX, y: e.clientY }; });
    const iv = setInterval(() => blips.current.push({
      col: Math.floor(Math.random() * 14), progress: 0,
      speed: 0.002 + Math.random() * 0.003, alpha: 0.5 + Math.random() * 0.4,
    }), 1200);
    const draw = () => {
      fr.current++;
      ctx.clearRect(0, 0, W, H);
      const COLS=14, ROWS=10, cW=W/COLS, cH=H/ROWS, t=fr.current*0.01;
      for (let col=0; col<=COLS; col++) {
        const x=col*cW, dx=x-mouse.current.x, dy=H/2-mouse.current.y;
        const pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/350), ba=0.05+pr*0.2;
        const g=ctx.createLinearGradient(x,0,x,H);
        g.addColorStop(0,'rgba(212,175,55,0)'); g.addColorStop(0.3,`rgba(212,175,55,${ba})`);
        g.addColorStop(0.7,`rgba(212,175,55,${ba})`); g.addColorStop(1,'rgba(212,175,55,0)');
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H);
        ctx.strokeStyle=g; ctx.lineWidth=pr>0.3?1.2:0.6; ctx.stroke();
      }
      for (let row=0; row<=ROWS; row++) {
        const y=row*cH, dx=W/2-mouse.current.x, dy=y-mouse.current.y;
        const pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/350), ba=0.05+pr*0.2;
        const g=ctx.createLinearGradient(0,y,W,y);
        g.addColorStop(0,'rgba(212,175,55,0)'); g.addColorStop(0.2,`rgba(212,175,55,${ba})`);
        g.addColorStop(0.8,`rgba(212,175,55,${ba})`); g.addColorStop(1,'rgba(212,175,55,0)');
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y);
        ctx.strokeStyle=g; ctx.lineWidth=pr>0.3?1.2:0.6; ctx.stroke();
      }
      for (let col=0; col<=COLS; col++) for (let row=0; row<=ROWS; row++) {
        const x=col*cW, y=row*cH, dx=x-mouse.current.x, dy=y-mouse.current.y;
        const pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/220), pulse=0.5+0.5*Math.sin(t*1.2+col*0.6+row*0.8);
        ctx.beginPath(); ctx.arc(x,y,1+pulse*0.5+pr*3.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(212,175,55,${0.1+pulse*0.08+pr*0.6})`; ctx.fill();
      }
      blips.current = blips.current.filter(b=>b.progress<1);
      for (const b of blips.current) {
        b.progress+=b.speed;
        const x=b.col*cW, y=b.progress*H;
        const bg=ctx.createLinearGradient(x,y-80,x,y+4);
        bg.addColorStop(0,'rgba(212,175,55,0)'); bg.addColorStop(1,`rgba(255,220,100,${b.alpha})`);
        ctx.beginPath(); ctx.moveTo(x,y-80); ctx.lineTo(x,y);
        ctx.strokeStyle=bg; ctx.lineWidth=1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(x,y,2.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,220,100,${b.alpha})`; ctx.fill();
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); clearInterval(iv); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }} />;
};

const FloatChip = ({ children, delay=0, style={} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => (
  <div className="au__float-chip" style={{
    padding:'15px 20px', background:'rgba(2,7,18,0.96)', backdropFilter:'blur(20px)',
    border:'1px solid rgba(212,175,55,0.22)', borderRadius:14, textAlign:'center',
    animation:'au__floatDrift 4.5s ease-in-out infinite', animationDelay:`${delay}s`,
    boxShadow:'0 10px 36px rgba(0,0,0,0.58)', ...style,
  }}>{children}</div>
);

const chipNum: React.CSSProperties = { fontFamily:"'Orbitron',sans-serif", fontSize:22, fontWeight:800, color:'#D4AF37', lineHeight:1, marginBottom:5 };
const chipLbl: React.CSSProperties = { fontFamily:"'Lato',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(199,209,219,0.5)' };
const vLine = (op=0.25): React.CSSProperties => ({ width:1, height:36, background:`rgba(212,175,55,${op})` });
const orbDot = (d=0): React.CSSProperties => ({ width:5, height:5, borderRadius:'50%', background:'#D4AF37', boxShadow:'0 0 10px rgba(212,175,55,0.8)', animation:'au__orbPulse 2s ease-in-out infinite', animationDelay:`${d}s` });

const Diamond = ({ d=0 }: { d?: number }) => (
  <div style={{ position:'relative', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div style={{ position:'absolute', inset:0, border:'1px solid rgba(212,175,55,0.45)', transform:'rotate(45deg)', animation:`au__spinDiamond 8s linear infinite`, animationDelay:`${d}s` }}/>
    <div style={{ width:7, height:7, background:'#D4AF37', transform:'rotate(45deg)', boxShadow:'0 0 12px rgba(212,175,55,0.9)' }}/>
  </div>
);

function useCountUp(target: number, dur: number, active: boolean) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(tick); else setV(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, dur]);
  return v;
}

const StatCard = ({ s, i, active }: { s: any; i: number; active: boolean }) => {
  const count = useCountUp(s.num, s.dur, active);
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position:'relative', overflow:'hidden', borderRadius:20, padding:'38px 26px 34px',
        textAlign:'center', background:'rgba(7,16,32,0.93)', backdropFilter:'blur(24px)',
        border:`1px solid ${hov?'rgba(212,175,55,0.62)':'rgba(212,175,55,0.12)'}`,
        boxShadow:hov?'0 26px 64px rgba(0,0,0,0.62),0 0 50px rgba(212,175,55,0.1)':'0 4px 24px rgba(0,0,0,0.38)',
        transform:hov?'translateY(-7px)':'none',
        transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)',
        animation:'au__fadeUpIn 0.7s cubic-bezier(0.22,1,0.36,1) both',
        animationDelay:`${i*130}ms`,
      }}
    >
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(212,175,55,0.07),transparent)', opacity:hov?1:0, transition:'opacity 0.5s' }}/>
      <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:2, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.65),transparent)', opacity:hov?1:0.18, transition:'opacity 0.5s' }}/>
      <div style={{
        width:64, height:64, borderRadius:18, margin:'0 auto 24px',
        background:'linear-gradient(135deg,#D4AF37,#F5C97A)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:hov?'0 0 48px rgba(212,175,55,0.72)':'0 0 24px rgba(212,175,55,0.28)',
        transform:hov?'scale(1.13) rotate(7deg)':'none',
        transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ width:28, height:28, color:'#040C1A' }}>{s.icon}</div>
      </div>
      <div style={{
        fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(2.2rem,3vw,2.8rem)',
        fontWeight:900, lineHeight:1, marginBottom:12,
        background:'linear-gradient(135deg,#D4AF37,#F5C97A,#B8941F)',
        WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent',
        filter:'drop-shadow(0 0 10px rgba(212,175,55,0.42))',
      }}>
        {s.pre}{count}{s.suf}
      </div>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, color:'#fff', letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:700, marginBottom:7 }}>{s.lbl}</div>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:'rgba(199,209,219,0.38)', fontWeight:400, letterSpacing:'0.03em' }}>{s.sub}</div>
    </div>
  );
};

const STATS = [
  { num:50,  suf:'+',   pre:'',  lbl:'Properties Sold',     sub:'Across Coimbatore', dur:1600,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:'100%',height:'100%'}}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
  { num:100, suf:'%',   pre:'',  lbl:'Client Satisfaction', sub:'Verified Reviews',  dur:1800,
    icon:<svg viewBox="0 0 24 24" fill="currentColor" style={{width:'100%',height:'100%'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { num:350, suf:'+',   pre:'',  lbl:'Happy Families',      sub:'Trusted Clients',   dur:2000,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:'100%',height:'100%'}}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
  { num:200, suf:'Cr+', pre:'₹', lbl:'Value Closed',        sub:'Total Deals',       dur:2200,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:'100%',height:'100%'}}><line x1="6" y1="5" x2="18" y2="5"/><line x1="6" y1="10" x2="18" y2="10"/><path d="M6 10c0 5 4 9 9 9"/><line x1="6" y1="10" x2="15" y2="21"/></svg> },
];

const MILESTONES = [
  { year:'2024', title:'Foundation',        desc:"BIGWAY was born with a vision to revolutionize Coimbatore's luxury real estate market." },
  { year:'2025', title:'Tech Integration',  desc:'Launched AI-powered matching, VR tours, and blockchain verification systems.' },
  { year:'2025', title:'Market Leadership', desc:"Became Coimbatore's most trusted luxury property platform." },
  { year:'2026', title:'Future Vision',     desc:'Expanding with smart contracts and advanced analytics for clients.' },
];

const VALUES = [
  { title:'Excellence',      desc:'We curate only the finest properties and deliver exceptional service at every touchpoint.' },
  { title:'Innovation',      desc:'Leveraging AI, VR, and blockchain to pioneer the future of real estate.' },
  { title:'Transparency',    desc:'Complete honesty and clarity in every transaction, building trust through openness.' },
  { title:'Personalization', desc:'Every client is unique — our recommendations reflect your individual dreams.' },
];

const STORY_PHOTOS = [
  { src:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=85', alt:'Luxury property interior', label:'Interior Design', tag:'Premium' },
  { src:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85', alt:'Premium residential property', label:'Residential', tag:'Exclusive' },
  { src:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=85', alt:'Modern villa', label:'Modern Villa', tag:'Luxury' },
  { src:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=85', alt:'Luxury architecture', label:'Architecture', tag:'Signature' },
];

const PhotoCard = ({ photo, style, badgePos='bottom' }: { photo: typeof STORY_PHOTOS[0]; style?: React.CSSProperties; badgePos?: 'bottom'|'top' }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      position:'relative', borderRadius:20, overflow:'hidden',
      border:`1.5px solid ${hov?'rgba(212,175,55,0.55)':'rgba(212,175,55,0.22)'}`,
      boxShadow: hov ? '0 32px 80px rgba(0,0,0,0.75),0 0 0 1px rgba(212,175,55,0.3)' : '0 8px 36px rgba(0,0,0,0.55)',
      transform: hov ? 'scale(1.025) translateY(-4px)' : 'scale(1) translateY(0)',
      transition:'all 0.55s cubic-bezier(0.22,1,0.36,1)', cursor:'pointer', ...style,
    }}>
      <img src={photo.src} alt={photo.alt} style={{
        width:'100%', height:'100%', objectFit:'cover', display:'block',
        filter: hov ? 'brightness(0.88) saturate(1.1)' : 'brightness(0.68) saturate(0.85)',
        transform: hov ? 'scale(1.08)' : 'scale(1)',
        transition:'all 0.65s cubic-bezier(0.22,1,0.36,1)',
      }}/>
      <div style={{ position:'absolute', inset:0, background: badgePos==='bottom' ? 'linear-gradient(180deg,rgba(3,10,22,0.08) 0%,rgba(3,10,22,0.88) 100%)' : 'linear-gradient(180deg,rgba(3,10,22,0.85) 0%,rgba(3,10,22,0.08) 100%)' }}/>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#D4AF37,transparent)', opacity:hov?1:0, transition:'opacity 0.4s' }}/>
      <div style={{
        position:'absolute', ...(badgePos==='bottom'?{bottom:16,left:16,right:16}:{top:16,left:16,right:16}),
        display:'flex', alignItems:'center', justifyContent:'space-between',
        transform:hov?'translateY(0)':(badgePos==='bottom'?'translateY(4px)':'translateY(-4px)'),
        opacity:hov?1:0.72, transition:'all 0.4s ease',
      }}>
        <span style={{ fontFamily:"'Lato',sans-serif", fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#fff' }}>{photo.label}</span>
        <span style={{ padding:'4px 10px', borderRadius:100, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', fontFamily:"'Orbitron',sans-serif", fontSize:7.5, fontWeight:800, letterSpacing:'0.16em', color:'#040C1A' }}>{photo.tag}</span>
      </div>
      <div style={{ position:'absolute', top:12, right:12, width:14, height:14, borderTop:'1.5px solid rgba(212,175,55,0.6)', borderRight:'1.5px solid rgba(212,175,55,0.6)', opacity:hov?1:0, transition:'opacity 0.3s' }}/>
      <div style={{ position:'absolute', bottom:12, left:12, width:14, height:14, borderBottom:'1.5px solid rgba(212,175,55,0.6)', borderLeft:'1.5px solid rgba(212,175,55,0.6)', opacity:hov?1:0, transition:'opacity 0.3s' }}/>
    </div>
  );
};

export default function AboutUsPage() {
  const [visible, setVisible]         = useState(false);
  const [activeTab, setActiveTab]     = useState<'mission'|'vision'|'values'>('mission');
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsActive(true); }, { threshold:0.15 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const fadeUp = (delay=0): React.CSSProperties => ({
    opacity: visible?1:0,
    transform: visible?'none':'translateY(36px)',
    transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay*110}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay*110}ms`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Lato:wght@300;400;600;700&family=Poppins:wght@500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;}

        @keyframes au__driftA     { 0%,100%{transform:translate(0,0)}   50%{transform:translate(25px,-35px)} }
        @keyframes au__driftB     { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-20px,28px)} }
        @keyframes au__shimmer    { 0%{background-position:-200%}        100%{background-position:200%} }
        @keyframes au__pulseDot   { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.7)} 60%{box-shadow:0 0 0 9px rgba(212,175,55,0)} }
        @keyframes au__gemGlow    { 0%,100%{box-shadow:0 0 10px rgba(212,175,55,0.65)} 50%{box-shadow:0 0 32px rgba(212,175,55,1)} }
        @keyframes au__floatDrift { 0%,100%{transform:translateY(0)}     50%{transform:translateY(-8px)} }
        @keyframes au__orbPulse   { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.65);opacity:1} }
        @keyframes au__spinDiamond{ from{transform:rotate(45deg)}        to{transform:rotate(405deg)} }
        @keyframes au__glowBlink  { 0%,100%{border-color:rgba(212,175,55,0.28)} 50%{border-color:rgba(212,175,55,0.72)} }
        @keyframes au__fadeUpIn   { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:none} }
        @keyframes au__tabEnter   { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:none} }
        @keyframes au__particleUp { 0%{opacity:0;transform:translateY(0) scale(0)} 10%{opacity:1} 90%{opacity:1} 100%{opacity:0;transform:translateY(-80vh) scale(1.5)} }

        /* ── DESKTOP / TABLET GRIDS ── */
        .au__stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        @media(max-width:1024px){ .au__stats-grid{ grid-template-columns:repeat(2,1fr); gap:18px; } }
        @media(max-width:700px) { .au__stats-grid{ display:none; } } /* hidden on mobile — use mobile file */

        .au__timeline { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        @media(max-width:1024px){ .au__timeline{ grid-template-columns:repeat(2,1fr); gap:18px; } }
        @media(max-width:700px) { .au__timeline{ display:none; } }

        .au__values-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
        @media(max-width:900px){ .au__values-grid{ grid-template-columns:1fr; } }

        .au__contact-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media(max-width:900px){ .au__contact-grid{ grid-template-columns:1fr 1fr; gap:16px; } }

        /* ── STORY LAYOUT ── */
        .au__story-layout { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
        @media(max-width:1100px){ .au__story-layout{ grid-template-columns:1fr; gap:40px; } }

        /* ── PHOTO GRID ── */
        .au__photo-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          grid-template-rows:300px 200px 260px;
          gap:14px;
        }
        .au__photo-main  { grid-column:1; grid-row:1/3; }
        .au__photo-top-r { grid-column:2; grid-row:1; }
        .au__photo-bot-l { grid-column:1; grid-row:3; }
        .au__photo-bot-r { grid-column:2; grid-row:2/4; }

        @media(max-width:1100px){
          .au__photo-grid { grid-template-columns:1fr 1fr; grid-template-rows:220px 160px 200px; }
        }
        @media(max-width:700px){ .au__photo-grid{ display:none; } }

        /* ── SIDE PANELS: full on desktop, compact on tablet, hidden on small ── */
        @media(max-width:1400px) and (min-width:769px){
          .au__side-panel { padding: 0 8px !important; }
        }
        @media(max-width:1100px) and (min-width:769px){
          .au__float-chip { min-width:80px !important; padding:10px 10px !important; }
          .au__float-chip div { font-size:15px !important; }
          .au__side-img   { display:none !important; }
          .au__side-text  { display:none !important; }
        }
        @media(max-width:768px){ .au__side-panel{ display:none!important; } }

        /* ── Scroll reveal ── */
        .scroll-reveal { opacity:0; transform:translateY(40px); transition:opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1); }
        .scroll-reveal.visible { opacity:1; transform:none; }

        /* DESKTOP ONLY — hide this file on true mobile */
        @media(max-width:700px){ .au__desktop-only{ display:none!important; } }
      `}</style>

      {/* ════ HERO ════ */}
      <header style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#030A16' }}>
        <div style={{ position:'absolute', top:-180, left:-160, width:650, height:650, borderRadius:'50%', background:'radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%)', filter:'blur(70px)', animation:'au__driftA 28s ease-in-out infinite', pointerEvents:'none', zIndex:0 }}/>
        <div style={{ position:'absolute', bottom:-200, right:-160, width:580, height:580, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,201,122,0.04) 0%,transparent 62%)', filter:'blur(90px)', animation:'au__driftB 34s ease-in-out infinite 3s', pointerEvents:'none', zIndex:0 }}/>
        <AnimatedGrid />

        {/* LEFT PANEL */}
        <div className="au__side-panel" style={{ position:'absolute', left:0, top:0, bottom:0, width:'clamp(90px, calc((100% - 820px) / 2), 220px)', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:0, padding:'0 12px', opacity:visible?1:0, transform:visible?'translateX(0)':'translateX(-52px)', transition:'opacity 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s', pointerEvents:'none' }}>
          <div style={{ width:1, height:60, background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.35))' }}/>
          <FloatChip delay={0.3} style={{ minWidth:132 }}><div style={chipNum}>6+</div><div style={chipLbl}>Services</div></FloatChip>
          <div style={vLine()}/><div style={orbDot(0)}/><div style={vLine()}/>
          <FloatChip delay={0.8} style={{ minWidth:132 }}><div style={chipNum}>500+</div><div style={chipLbl}>Deals Closed</div></FloatChip>
          <div style={vLine()}/><Diamond d={0}/><div style={vLine()}/>
          <div style={{ padding:'8px 18px', border:'1px solid rgba(212,175,55,0.28)', borderRadius:100, animation:'au__floatDrift 5.5s ease-in-out infinite 1.2s' }}>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:'#D4AF37' }}>FULL SERVICE</span>
          </div>
          <div style={{ width:1, height:60, background:'linear-gradient(180deg,rgba(212,175,55,0.35),transparent)' }}/>
          <div style={{ position:'absolute', top:'8%', left:12, width:18, height:18, borderLeft:'1.5px solid rgba(212,175,55,0.35)', borderTop:'1.5px solid rgba(212,175,55,0.35)', animation:'au__glowBlink 3s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', bottom:'8%', left:12, width:18, height:18, borderLeft:'1.5px solid rgba(212,175,55,0.35)', borderBottom:'1.5px solid rgba(212,175,55,0.35)', animation:'au__glowBlink 3s ease-in-out infinite 1s' }}/>
          <div className="au__side-text" style={{ position:'absolute', bottom:'12%', left:10, transform:'rotate(-90deg)', transformOrigin:'center', fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.3em', color:'rgba(212,175,55,0.3)', whiteSpace:'nowrap' }}>COIMBATORE · EST. 2024</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="au__side-panel" style={{ position:'absolute', right:0, top:0, bottom:0, width:'clamp(90px, calc((100% - 820px) / 2), 220px)', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:0, padding:'0 12px', opacity:visible?1:0, transform:visible?'translateX(0)':'translateX(52px)', transition:'opacity 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s', pointerEvents:'none' }}>
          <div style={{ width:1, height:60, background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.35))' }}/>
          <div className="au__side-img" style={{ width:130, height:88, borderRadius:12, overflow:'hidden', border:'1px solid rgba(212,175,55,0.25)', animation:'au__floatDrift 4s ease-in-out infinite 0.5s', flexShrink:0, position:'relative' }}>
            <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.5) saturate(0.7)' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 30%,rgba(4,10,20,0.9) 100%)' }}/>
            <div style={{ position:'absolute', bottom:7, left:9 }}><span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.14em', color:'#D4AF37', textTransform:'uppercase' }}>Premium</span></div>
          </div>
          <div style={vLine()}/><div style={orbDot(0.5)}/><div style={vLine()}/>
          <FloatChip delay={0.5} style={{ minWidth:132 }}><div style={chipNum}>15+</div><div style={chipLbl}>Bank Tie-ups</div></FloatChip>
          <div style={vLine()}/><Diamond d={2}/><div style={vLine()}/>
          <FloatChip delay={1.0} style={{ minWidth:132 }}><div style={{ ...chipNum, fontSize:19 }}>₹200Cr+</div><div style={chipLbl}>Value Closed</div></FloatChip>
          <div style={{ width:1, height:60, background:'linear-gradient(180deg,rgba(212,175,55,0.35),transparent)' }}/>
          <div style={{ position:'absolute', top:'8%', right:12, width:18, height:18, borderRight:'1.5px solid rgba(212,175,55,0.35)', borderTop:'1.5px solid rgba(212,175,55,0.35)', animation:'au__glowBlink 3s ease-in-out infinite 0.5s' }}/>
          <div style={{ position:'absolute', bottom:'8%', right:12, width:18, height:18, borderRight:'1.5px solid rgba(212,175,55,0.35)', borderBottom:'1.5px solid rgba(212,175,55,0.35)', animation:'au__glowBlink 3s ease-in-out infinite 1.5s' }}/>
          <div className="au__side-text" style={{ position:'absolute', bottom:'12%', right:10, transform:'rotate(90deg)', transformOrigin:'center', fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.3em', color:'rgba(212,175,55,0.3)', whiteSpace:'nowrap' }}>LUXURY · REAL · ESTATE</div>
        </div>

        {/* Hero center */}
        <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'100px 24px 64px', maxWidth:900, margin:'0 auto', ...fadeUp(0) }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:32, padding:'11px 28px', borderRadius:10, background:'rgba(2,7,18,0.88)', backdropFilter:'blur(28px)', border:'1px solid rgba(212,175,55,0.32)', boxShadow:'0 0 55px rgba(212,175,55,0.15)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#D4AF37', animation:'au__pulseDot 2.4s ease-out infinite' }}/>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, fontWeight:700, letterSpacing:'0.26em', textTransform:'uppercase', color:'#D4AF37' }}>⭐ Bigway Real Estate · Coimbatore</span>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#D4AF37', animation:'au__pulseDot 2.4s ease-out infinite 0.7s' }}/>
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 20px', borderRadius:8, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.28)', fontFamily:"'Orbitron',sans-serif", fontSize:10, fontWeight:700, letterSpacing:'0.24em', textTransform:'uppercase', color:'#D4AF37' }}>
              OUR STORY · SINCE 2024
            </div>
          </div>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(3.2rem,6.5vw,5.6rem)', lineHeight:1.04, color:'#fff', margin:'0 0 4px', letterSpacing:'-0.03em' }}>About</h1>
          <span style={{ display:'block', fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(3.2rem,6.5vw,5.6rem)', lineHeight:1.04, margin:'0 0 32px', background:'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', animation:'au__shimmer 8s linear infinite', letterSpacing:'-0.03em' }}>BIGWAY</span>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:'clamp(1.1rem,1.9vw,1.3rem)', lineHeight:2.0, color:'rgba(199,209,219,0.72)', maxWidth:560, margin:'0 auto 38px', fontWeight:400, letterSpacing:'0.01em' }}>
            Revolutionizing Coimbatore's luxury real estate with AI-powered matching, immersive VR tours, and blockchain verification. Trusted by over 350 families since 2024.
          </p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
            <div style={{ height:1, width:100, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)' }}/>
            <div style={{ width:7, height:7, background:'#D4AF37', transform:'rotate(45deg)', boxShadow:'0 0 14px rgba(212,175,55,0.85)', animation:'au__gemGlow 3.8s ease-in-out infinite' }}/>
            <div style={{ height:1, width:100, background:'linear-gradient(270deg,transparent,rgba(212,175,55,0.5),transparent)' }}/>
          </div>
        </div>
      </header>

      {/* ════ MAIN CONTENT ════ */}
      <main style={{ position:'relative', background:'#030A16' }}>
        <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-10%', right:'-8%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(212,175,55,0.04) 0%,transparent 65%)', filter:'blur(100px)', animation:'au__driftA 26s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', bottom:'-10%', left:'-8%', width:550, height:550, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,201,122,0.035) 0%,transparent 60%)', filter:'blur(120px)', animation:'au__driftB 32s ease-in-out infinite 3s' }}/>
        </div>

        {/* ── OUR STORY ── */}
        <section style={{ position:'relative', zIndex:10, padding:'108px 0 100px' }}>
          <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 32px' }}>
            <div style={{ ...fadeUp(0), textAlign:'center', marginBottom:68 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:8, marginBottom:18, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.24)' }}>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9.5, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'#D4AF37' }}>Who We Are</span>
              </div>
              <h2 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(2.3rem,4.5vw,3.6rem)', color:'#fff', margin:'0 0 18px', lineHeight:1.12 }}>
                Crafting Dreams into{' '}
                <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Reality</span>
              </h2>
            </div>

            <div className="au__story-layout" style={{ ...fadeUp(1) }}>
              {/* Photo grid */}
              <div className="au__photo-grid">
                <PhotoCard photo={STORY_PHOTOS[0]} style={{ gridColumn:1, gridRow:'1/3' }} badgePos="bottom"/>
                <PhotoCard photo={STORY_PHOTOS[1]} style={{ gridColumn:2, gridRow:1 }} badgePos="top"/>
                <PhotoCard photo={STORY_PHOTOS[2]} style={{ gridColumn:1, gridRow:3 }} badgePos="top"/>
                <PhotoCard photo={STORY_PHOTOS[3]} style={{ gridColumn:2, gridRow:'2/4' }} badgePos="bottom"/>
              </div>

              {/* Story text */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:26 }}>
                  <div style={{ height:2, width:32, borderRadius:2, background:'linear-gradient(90deg,#D4AF37,transparent)' }}/>
                  <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(212,175,55,0.6)' }}>Our Story</span>
                </div>
                <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(1.8rem,3.2vw,2.7rem)', color:'#fff', margin:'0 0 28px', lineHeight:1.18 }}>
                  Born to Redefine<br/>
                  <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Luxury Living</span>
                </h3>
                {["BIGWAY emerged from a simple yet powerful belief: that acquiring a luxury property should be as exceptional as the property itself. We set out to revolutionize Coimbatore's real estate landscape by blending tradition with innovation.",
                  'Our platform leverages artificial intelligence, virtual reality, and blockchain technology to provide unprecedented transparency and personalization. Each property is meticulously curated, verified, and presented with the care it deserves.',
                ].map((p,i)=>(
                  <p key={i} style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, lineHeight:2.0, color:'rgba(199,209,219,0.72)', fontWeight:400, margin:'0 0 22px', letterSpacing:'0.01em' }}>{p}</p>
                ))}
                <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:16.5, lineHeight:1.85, color:'#D4AF37', fontWeight:600, margin:'0 0 36px', borderLeft:'4px solid #D4AF37', paddingLeft:22, borderRadius:'0 16px 16px 0', background:'rgba(212,175,55,0.06)', padding:'18px 22px', letterSpacing:'0.01em' }}>
                  We don't just sell properties — we forge lasting relationships and create legacies.
                </p>
                <div style={{ display:'flex', gap:24, marginBottom:36, flexWrap:'wrap' }}>
                  {[{n:'350+',l:'Families Served'},{n:'₹200Cr',l:'Value Closed'},{n:'2024',l:'Established'}].map((m,i)=>(
                    <div key={i} style={{ padding:'14px 22px', borderRadius:16, background:'rgba(212,175,55,0.06)', border:'1px solid rgba(212,175,55,0.15)' }}>
                      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:22, fontWeight:900, color:'#D4AF37', lineHeight:1, marginBottom:6 }}>{m.n}</div>
                      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(199,209,219,0.5)' }}>{m.l}</div>
                    </div>
                  ))}
                </div>
                <button
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 0 38px rgba(212,175,55,0.78)';e.currentTarget.style.transform='scale(1.06)';}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 4px 22px rgba(212,175,55,0.48)';e.currentTarget.style.transform='scale(1)';}}
                  style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'15px 36px', borderRadius:100, border:0, cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', color:'#040C1A', boxShadow:'0 4px 22px rgba(212,175,55,0.48)', transition:'all 0.3s' }}>
                  Explore Properties <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION / VISION / VALUES ── */}
        <section style={{ position:'relative', zIndex:10, padding:'96px 0' }}>
          <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 32px' }}>
            <div style={{ ...fadeUp(0), textAlign:'center', marginBottom:52 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:8, marginBottom:18, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.24)' }}>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9.5, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'#D4AF37' }}>Our Foundation</span>
              </div>
              <h2 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(2.3rem,4.5vw,3.6rem)', color:'#fff', margin:0, lineHeight:1.12 }}>
                What <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Drives Us</span>
              </h2>
            </div>
            <div style={{ ...fadeUp(1), display:'flex', justifyContent:'center', gap:12, marginBottom:36, flexWrap:'wrap' }}>
              {(['mission','vision','values'] as const).map(tab=>(
                <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:'13px 34px', borderRadius:100, border:'none', cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'0.05em', textTransform:'uppercase', background:activeTab===tab?'linear-gradient(135deg,#D4AF37,#F5C97A)':'rgba(7,16,32,0.9)', color:activeTab===tab?'#040C1A':'rgba(212,175,55,0.7)', borderColor:activeTab===tab?'transparent':'rgba(212,175,55,0.22)', borderWidth:1, borderStyle:'solid', boxShadow:activeTab===tab?'0 6px 28px rgba(212,175,55,0.48)':'none', transform:activeTab===tab?'scale(1.06)':'scale(1)', transition:'all 0.3s ease' }}>
                  {tab.charAt(0).toUpperCase()+tab.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ ...fadeUp(2), background:'linear-gradient(170deg,#0D1E3A 0%,#060F1E 55%,#030A15 100%)', border:'1px solid rgba(212,175,55,0.18)', borderRadius:28, padding:'52px 56px', boxShadow:'0 6px 32px rgba(0,0,0,0.52)', position:'relative', overflow:'hidden', animation:'au__tabEnter 0.45s ease both', minHeight:260 }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.45),transparent)' }}/>
              <div style={{ position:'absolute', top:'18%', left:0, width:3, height:'64%', background:'linear-gradient(180deg,transparent,#D4AF37,transparent)', borderRadius:'0 2px 2px 0', opacity:0.7 }}/>
              {activeTab==='mission' && (
                <div style={{ display:'flex', alignItems:'flex-start', gap:28 }}>
                  <div style={{ width:62, height:62, borderRadius:17, flexShrink:0, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 36px rgba(212,175,55,0.5)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#040C1A" strokeWidth="2.5" style={{width:28,height:28}}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(1.6rem,2.8vw,2.1rem)', color:'#fff', margin:'0 0 18px' }}>Our Mission</h3>
                    <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, lineHeight:2.0, color:'rgba(199,209,219,0.72)', fontWeight:400, margin:0, maxWidth:680 }}>To revolutionize Coimbatore's luxury real estate market through innovative technology, transparent processes, and personalized service — empowering clients to find properties that perfectly align with their dreams and aspirations.</p>
                  </div>
                </div>
              )}
              {activeTab==='vision' && (
                <div style={{ display:'flex', alignItems:'flex-start', gap:28 }}>
                  <div style={{ width:62, height:62, borderRadius:17, flexShrink:0, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 36px rgba(212,175,55,0.5)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#040C1A" strokeWidth="2.5" style={{width:28,height:28}}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(1.6rem,2.8vw,2.1rem)', color:'#fff', margin:'0 0 18px' }}>Our Vision</h3>
                    <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, lineHeight:2.0, color:'rgba(199,209,219,0.72)', fontWeight:400, margin:0, maxWidth:680 }}>To become India's most trusted luxury real estate platform, where AI-powered insights, blockchain verification, and immersive VR experiences set new industry standards — transforming property discovery into an extraordinary journey.</p>
                  </div>
                </div>
              )}
              {activeTab==='values' && (
                <div>
                  <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(1.6rem,2.8vw,2.1rem)', color:'#fff', margin:'0 0 28px' }}>Our Core Values</h3>
                  <div className="au__values-grid">
                    {VALUES.map((v,i)=>(
                      <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:18, padding:'26px 28px', borderRadius:20, background:'rgba(255,255,255,0.035)', border:'1px solid rgba(212,175,55,0.12)', transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
                        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(212,175,55,0.09)';el.style.borderColor='rgba(212,175,55,0.38)';el.style.transform='translateY(-3px)';}}
                        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,0.035)';el.style.borderColor='rgba(212,175,55,0.12)';el.style.transform='none';}}
                      >
                        <div style={{ width:10, height:10, borderRadius:'50%', background:'#D4AF37', flexShrink:0, marginTop:6, boxShadow:'0 0 12px rgba(212,175,55,0.8)' }}/>
                        <div>
                          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:15.5, fontWeight:700, color:'#F5C97A', marginBottom:10 }}>{v.title}</div>
                          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, color:'rgba(199,209,219,0.62)', lineHeight:1.85, fontWeight:400 }}>{v.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section style={{ position:'relative', zIndex:10, padding:'96px 0' }}>
          <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 32px' }}>
            <div style={{ ...fadeUp(0), textAlign:'center', marginBottom:52 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:8, marginBottom:18, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.24)' }}>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9.5, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'#D4AF37' }}>Our Journey</span>
              </div>
              <h2 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(2.3rem,4.5vw,3.6rem)', color:'#fff', margin:0, lineHeight:1.12 }}>
                Key <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Milestones</span>
              </h2>
            </div>
            <div className="au__timeline" style={{ ...fadeUp(1) }}>
              {MILESTONES.map((m,i)=>(
                <div key={i} style={{ position:'relative', background:'linear-gradient(170deg,#0D1E3A,#060F1E)', border:'1px solid rgba(212,175,55,0.14)', borderRadius:24, padding:'36px 28px', transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)', cursor:'default' }}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-7px)';el.style.borderColor='rgba(212,175,55,0.55)';el.style.boxShadow='0 26px 64px rgba(0,0,0,0.6)';}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor='rgba(212,175,55,0.14)';el.style.boxShadow='none';}}
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.45),transparent)', borderRadius:'24px 24px 0 0' }}/>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:32, fontWeight:900, color:'rgba(212,175,55,0.18)', lineHeight:1, marginBottom:18 }}>{m.year}</div>
                  <div style={{ display:'inline-block', padding:'5px 16px', borderRadius:100, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:800, letterSpacing:'0.14em', color:'#040C1A', marginBottom:18 }}>{`0${i+1}`}</div>
                  <h4 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:17, color:'#fff', margin:'0 0 14px' }}>{m.title}</h4>
                  <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.85, color:'rgba(199,209,219,0.58)', fontWeight:400, margin:0 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section ref={statsRef} style={{ position:'relative', zIndex:10, padding:'96px 0' }}>
          <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 32px' }}>
            <div style={{ textAlign:'center', marginBottom:52 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:8, marginBottom:18, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.24)' }}>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9.5, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'#D4AF37' }}>By The Numbers</span>
              </div>
              <h2 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(2.3rem,4.5vw,3.6rem)', color:'#fff', margin:0, lineHeight:1.12 }}>
                Our <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Track Record</span>
              </h2>
            </div>
            <div className="au__stats-grid">
              {STATS.map((s,i)=><StatCard key={i} s={s} i={i} active={statsActive}/>)}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ position:'relative', zIndex:10, padding:'108px 0 116px', overflow:'hidden' }}>
          {[{l:'10%',t:'20%',d:'0s'},{l:'30%',t:'15%',d:'1s'},{l:'55%',t:'35%',d:'2s'},{l:'70%',t:'10%',d:'0.5s'},{l:'85%',t:'28%',d:'1.5s'},{l:'20%',t:'65%',d:'2.5s'},{l:'45%',t:'70%',d:'0.8s'},{l:'65%',t:'75%',d:'1.8s'}].map((p,i)=>(
            <div key={i} style={{ position:'absolute', width:4, height:4, borderRadius:'50%', background:'#D4AF37', opacity:0.35, left:p.l, top:p.t, animation:'au__particleUp 12s linear infinite', animationDelay:p.d, pointerEvents:'none' }}/>
          ))}
          <div style={{ position:'absolute', inset:0 }}>
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&fit=crop&q=90" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.18) saturate(0.6)' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#030A16 0%,rgba(3,10,22,0.88) 50%,#030A16 100%)' }}/>
          </div>
          <div style={{ position:'relative', zIndex:2, maxWidth:920, margin:'0 auto', padding:'0 32px', textAlign:'center' }}>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(2.3rem,5.5vw,4.2rem)', color:'#fff', margin:'0 0 20px', lineHeight:1.1 }}>
              Begin Your <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Luxury Journey</span> Today
            </h2>
            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, color:'rgba(199,209,219,0.62)', lineHeight:2.0, fontWeight:400, maxWidth:560, margin:'0 auto 42px' }}>Experience the perfect blend of technology and personalized service.</p>
            <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap', marginBottom:56 }}>
              <button onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 0 42px rgba(212,175,55,0.78)';e.currentTarget.style.transform='scale(1.07)';}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 4px 24px rgba(212,175,55,0.48)';e.currentTarget.style.transform='scale(1)';}} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'15px 36px', borderRadius:100, border:0, cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13.5, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', color:'#040C1A', boxShadow:'0 4px 24px rgba(212,175,55,0.48)', transition:'all 0.3s' }}>
                Schedule Consultation <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <button onMouseEnter={e=>{e.currentTarget.style.background='rgba(212,175,55,0.1)';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';}} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'15px 36px', borderRadius:100, border:'1.5px solid rgba(212,175,55,0.5)', cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13.5, background:'transparent', color:'#D4AF37', transition:'all 0.3s' }}>
                View Properties
              </button>
            </div>
            <div className="au__contact-grid">
              {[
                { icon:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label:'Call Us', value:'+91 90000 00000', href:'tel:+919000000000' },
                { icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label:'Email Us', value:'hello@bigway.com', href:'mailto:hello@bigway.com' },
                { icon:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', label:'Visit Us', value:'Coimbatore, Tamil Nadu', href:null },
              ].map((c,i)=>(
                <div key={i} style={{ background:'rgba(7,16,32,0.93)', backdropFilter:'blur(24px)', border:'1px solid rgba(212,175,55,0.18)', borderRadius:18, padding:'30px 24px', textAlign:'center', transition:'all 0.4s ease' }}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(212,175,55,0.5)';el.style.transform='translateY(-5px)';el.style.boxShadow='0 16px 48px rgba(0,0,0,0.5)';}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(212,175,55,0.18)';el.style.transform='none';el.style.boxShadow='none';}}
                >
                  <div style={{ width:48, height:48, borderRadius:13, background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.28)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" style={{width:22,height:22}}><path strokeLinecap="round" strokeLinejoin="round" d={c.icon}/></svg>
                  </div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11.5, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(199,209,219,0.45)', marginBottom:10 }}>{c.label}</div>
                  {c.href ? <a href={c.href} style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:'#D4AF37', textDecoration:'none' }}>{c.value}</a>
                    : <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:'#D4AF37' }}>{c.value}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}