"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════
   ANIMATED GRID
═══════════════════════════════════════════════ */
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
        const pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/350), ba=0.04+pr*0.18;
        const g=ctx.createLinearGradient(x,0,x,H);
        g.addColorStop(0,'rgba(212,175,55,0)'); g.addColorStop(0.3,`rgba(212,175,55,${ba})`);
        g.addColorStop(0.7,`rgba(212,175,55,${ba})`); g.addColorStop(1,'rgba(212,175,55,0)');
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H);
        ctx.strokeStyle=g; ctx.lineWidth=pr>0.3?1.1:0.5; ctx.stroke();
      }
      for (let row=0; row<=ROWS; row++) {
        const y=row*cH, dx=W/2-mouse.current.x, dy=y-mouse.current.y;
        const pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/350), ba=0.04+pr*0.18;
        const g=ctx.createLinearGradient(0,y,W,y);
        g.addColorStop(0,'rgba(212,175,55,0)'); g.addColorStop(0.2,`rgba(212,175,55,${ba})`);
        g.addColorStop(0.8,`rgba(212,175,55,${ba})`); g.addColorStop(1,'rgba(212,175,55,0)');
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y);
        ctx.strokeStyle=g; ctx.lineWidth=pr>0.3?1.1:0.5; ctx.stroke();
      }
      for (let col=0; col<=COLS; col++) for (let row=0; row<=ROWS; row++) {
        const x=col*cW, y=row*cH, dx=x-mouse.current.x, dy=y-mouse.current.y;
        const pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/220), pulse=0.5+0.5*Math.sin(t*1.2+col*0.6+row*0.8);
        ctx.beginPath(); ctx.arc(x,y,1+pulse*0.5+pr*3.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(212,175,55,${0.08+pulse*0.07+pr*0.55})`; ctx.fill();
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
    return () => { cancelAnimationFrame(raf); clearInterval(iv); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }} />;
};

/* ── Shared helpers ── */
const chipNum: React.CSSProperties = { fontFamily:"'Orbitron',sans-serif", fontSize:20, fontWeight:800, color:'#D4AF37', lineHeight:1, marginBottom:4 };
const chipLbl: React.CSSProperties = { fontFamily:"'Lato',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(199,209,219,0.45)' };
const vLine = (op=0.22): React.CSSProperties => ({ width:1, height:32, background:`rgba(212,175,55,${op})` });
const orbDot = (d=0): React.CSSProperties => ({ width:5, height:5, borderRadius:'50%', background:'#D4AF37', boxShadow:'0 0 10px rgba(212,175,55,0.8)', animation:'g__orbPulse 2s ease-in-out infinite', animationDelay:`${d}s` });

const FloatChip = ({ children, delay=0, style={} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => (
  <div style={{
    padding:'12px 18px', background:'rgba(2,7,18,0.97)', backdropFilter:'blur(20px)',
    border:'1px solid rgba(212,175,55,0.2)', borderRadius:12, textAlign:'center',
    animation:'g__floatDrift 4.5s ease-in-out infinite', animationDelay:`${delay}s`,
    boxShadow:'0 10px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)', ...style,
  }}>{children}</div>
);

const Diamond = ({ d=0 }: { d?: number }) => (
  <div style={{ position:'relative', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div style={{ position:'absolute', inset:0, border:'1px solid rgba(212,175,55,0.4)', transform:'rotate(45deg)', animation:`g__spinDiamond 8s linear infinite`, animationDelay:`${d}s` }}/>
    <div style={{ width:6, height:6, background:'#D4AF37', transform:'rotate(45deg)', boxShadow:'0 0 14px rgba(212,175,55,1)' }}/>
  </div>
);

/* ═══════════════════════════════════════════════
   GALLERY DATA — with real Unsplash images
═══════════════════════════════════════════════ */
const categories = [
  { label: "All",                icon: "◈" },
  { label: "Residential",        icon: "🏠" },
  { label: "Plots & Land",       icon: "🗺️" },
  { label: "Construction",       icon: "🏗️" },
  { label: "Commercial",         icon: "🏢" },
  { label: "Completed Projects", icon: "✅" },
];

const galleryItems = [
  { id:1,  cat:"Residential",        title:"Emerald Heights Villa",    loc:"Baner, Pune",       bed:4, bath:3, area:"2800",  price:"₹1.85 Cr", status:"Ready to Move",       size:"tall",   img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", accent:"#D4AF37" },
  { id:2,  cat:"Residential",        title:"Skyline 3BHK Apartment",  loc:"Wakad, Pune",       bed:3, bath:2, area:"1450",  price:"₹82 L",    status:"Under Construction",  size:"normal", img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", accent:"#C9A227" },
  { id:3,  cat:"Residential",        title:"Royal Nest Bungalow",     loc:"Kharadi, Pune",     bed:5, bath:4, area:"3500",  price:"₹2.4 Cr",  status:"Ready to Move",       size:"wide",   img:"https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=80", accent:"#F5C97A" },
  { id:4,  cat:"Residential",        title:"Garden View Flat",        loc:"Aundh, Pune",       bed:2, bath:2, area:"1100",  price:"₹58 L",    status:"New Launch",          size:"normal", img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80", accent:"#D4AF37" },
  { id:5,  cat:"Residential",        title:"Premium Row House",       loc:"Hadapsar, Pune",    bed:3, bath:3, area:"1900",  price:"₹1.1 Cr",  status:"Ready to Move",       size:"tall",   img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", accent:"#E8C060" },
  { id:6,  cat:"Plots & Land",       title:"Green Valley Plot",       loc:"Hinjewadi, Pune",   bed:0, bath:0, area:"1200",  price:"₹45 L",    status:"RERA Approved",       size:"wide",   img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80", accent:"#6DBF67" },
  { id:7,  cat:"Plots & Land",       title:"Farmland Estate NA",      loc:"Talegaon, Pune",    bed:0, bath:0, area:"21780", price:"₹18 L/G",  status:"NA Converted",        size:"normal", img:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", accent:"#7ECB78" },
  { id:8,  cat:"Plots & Land",       title:"Corner Plot Premium",     loc:"Chakan, Pune",      bed:0, bath:0, area:"2400",  price:"₹68 L",    status:"RERA Approved",       size:"tall",   img:"https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=600&q=80", accent:"#5BA755" },
  { id:9,  cat:"Plots & Land",       title:"Township Plots",          loc:"Uruli Kanchan",     bed:0, bath:0, area:"1500",  price:"₹32 L",    status:"New Launch",          size:"normal", img:"https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=600&q=80", accent:"#68BE62" },
  { id:10, cat:"Construction",       title:"Turnkey Villa Build",     loc:"Baner, Pune",       bed:4, bath:3, area:"2600",  price:"₹3200/sqft",status:"Ongoing",            size:"tall",   img:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80", accent:"#FF8C42" },
  { id:11, cat:"Construction",       title:"Site Foundation Work",    loc:"Wakad, Pune",       bed:0, bath:0, area:"5000",  price:"Custom",   status:"In Progress",         size:"wide",   img:"https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&q=80", accent:"#FFA040" },
  { id:12, cat:"Construction",       title:"Interior Fit-out",        loc:"Viman Nagar",       bed:3, bath:2, area:"1600",  price:"₹2500/sqft",status:"Completed",          size:"normal", img:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80", accent:"#FF9530" },
  { id:13, cat:"Construction",       title:"Structural Framework",    loc:"Kharadi, Pune",     bed:0, bath:0, area:"8000",  price:"Custom",   status:"Ongoing",             size:"normal", img:"https://images.unsplash.com/photo-1590725140246-20acddc1ec6d?w=600&q=80", accent:"#FFB347" },
  { id:14, cat:"Commercial",         title:"Business Park Tower",     loc:"Viman Nagar, Pune", bed:0, bath:0, area:"800",   price:"₹1.2 Cr",  status:"Ready to Move",       size:"wide",   img:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80", accent:"#AB47BC" },
  { id:15, cat:"Commercial",         title:"Retail Shop Complex",     loc:"Camp, Pune",        bed:0, bath:0, area:"450",   price:"₹75 L",    status:"New Launch",          size:"normal", img:"https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80", accent:"#BA68C8" },
  { id:16, cat:"Commercial",         title:"IT Office Space",         loc:"Hinjewadi, Pune",   bed:0, bath:0, area:"2000",  price:"₹2.8 Cr",  status:"Under Construction",  size:"tall",   img:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", accent:"#CE93D8" },
  { id:17, cat:"Completed Projects", title:"Sunrise Residency",       loc:"Baner, Pune",       bed:2, bath:2, area:"1250",  price:"₹72 L",    status:"Delivered 2023",      size:"wide",   img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80", accent:"#26C6DA" },
  { id:18, cat:"Completed Projects", title:"Heritage Heights",        loc:"Koregaon Park",     bed:4, bath:3, area:"2900",  price:"₹2.1 Cr",  status:"Delivered 2023",      size:"tall",   img:"https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=600&q=80", accent:"#2BBBAD" },
  { id:19, cat:"Completed Projects", title:"Green Meadows Phase 1",   loc:"Hadapsar, Pune",    bed:3, bath:2, area:"1550",  price:"₹88 L",    status:"Delivered 2022",      size:"normal", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", accent:"#22BEB2" },
  { id:20, cat:"Completed Projects", title:"Silver Oak Villas",       loc:"Undri, Pune",       bed:5, bath:4, area:"3200",  price:"₹1.95 Cr", status:"Delivered 2024",      size:"normal", img:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80", accent:"#34C4B4" },
];

const statusColor: Record<string, string> = {
  "Ready to Move":"#4CAF50","Under Construction":"#FF9800","New Launch":"#2196F3",
  "RERA Approved":"#9C27B0","NA Converted":"#009688","Ongoing":"#FF9800",
  "In Progress":"#FF5722","Completed":"#4CAF50","Delivered 2023":"#4CAF50",
  "Delivered 2022":"#4CAF50","Delivered 2024":"#4CAF50","Custom":"#9E9E9E",
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const GalleryPage: React.FC = () => {
  const [active, setActive]     = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visible, setVisible]   = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  const filtered = active === "All" ? galleryItems : galleryItems.filter(i => i.cat === active);

  const openLb  = useCallback((id: number) => { setLightbox(id); document.body.style.overflow = "hidden"; }, []);
  const closeLb = useCallback(() => { setLightbox(null); document.body.style.overflow = ""; }, []);
  const navLb   = useCallback((dir: 1 | -1) => {
    if (lightbox === null) return;
    const idx  = filtered.findIndex(i => i.id === lightbox);
    const next = filtered[(idx + dir + filtered.length) % filtered.length];
    setLightbox(next.id);
  }, [lightbox, filtered]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")     closeLb();
      if (e.key === "ArrowRight") navLb(1);
      if (e.key === "ArrowLeft")  navLb(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [closeLb, navLb]);

  const lbItem = lightbox !== null ? galleryItems.find(i => i.id === lightbox) : null;
  const lbIdx  = lbItem ? filtered.findIndex(i => i.id === lbItem.id) : 0;

  const fadeUp = (delay=0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(36px)',
    transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay * 120}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay * 120}ms`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Lato:wght@300;400;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        :root {
          --g:#D4AF37; --gl:#F5C97A; --gd:#B8941F;
          --bg0:#030A16;
          --bg1:#030A16;
          --bg2:#0A192F;
          --bg3:#171008;
          --w:#FFF; --m:rgba(255,255,255,0.5); --m2:rgba(255,255,255,0.28);
          --serif:'Cinzel',serif;
          --alt:'Cormorant Garamond',Georgia,serif;
          --sans:'DM Sans',sans-serif;
          --poppins:'Poppins',sans-serif;
          --orb:'Orbitron',sans-serif;
        }

        html { background: #030A16; }
        body { background: #030A16; }

        @keyframes g__driftA      { 0%,100%{transform:translate(0,0)}   50%{transform:translate(25px,-35px)} }
        @keyframes g__driftB      { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-20px,28px)} }
        @keyframes g__shimmer     { 0%{background-position:-200%}       100%{background-position:200%} }
        @keyframes g__pulseDot    { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.7)} 60%{box-shadow:0 0 0 9px rgba(212,175,55,0)} }
        @keyframes g__gemGlow     { 0%,100%{box-shadow:0 0 10px rgba(212,175,55,0.6)} 50%{box-shadow:0 0 28px rgba(212,175,55,1)} }
        @keyframes g__floatDrift  { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-8px)} }
        @keyframes g__orbPulse    { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.65);opacity:1} }
        @keyframes g__spinDiamond { from{transform:rotate(45deg)}       to{transform:rotate(405deg)} }
        @keyframes g__glowBlink   { 0%,100%{border-color:rgba(212,175,55,0.22)} 50%{border-color:rgba(212,175,55,0.65)} }
        @keyframes g__fadeUpIn    { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:none} }
        @keyframes gCardIn        { from{opacity:0;transform:translateY(22px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes scrollP        { 0%,100%{opacity:.4;transform:scaleY(.9)} 50%{opacity:1;transform:scaleY(1.1)} }
        @keyframes gLbIn          { from{opacity:0}to{opacity:1} }
        @keyframes gLbSlide       { from{transform:translateY(28px) scale(.97)}to{transform:none} }
        @keyframes noiseDrift     { 0%{transform:translate(0,0)} 100%{transform:translate(-50%,-50%)} }
        @keyframes goldPulseRing  { 0%{opacity:.4;transform:scale(.95)} 50%{opacity:.8;transform:scale(1.05)} 100%{opacity:.4;transform:scale(.95)} }

        /* ════ HERO ════ */
        .g-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(ellipse 80% 80% at 50% 0%, #1C1400 0%, #030A16 45%, #060400 100%);
        }
        /* Noise texture overlay */
        .g-hero::before {
          content:'';
          position:absolute; inset:0; z-index:1; pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size:200px 200px;
          opacity:0.025;
          mix-blend-mode:overlay;
        }
        .g-hero-orb1 {
          position:absolute; top:-220px; left:-200px;
          width:800px; height:800px; border-radius:50%;
          background:radial-gradient(circle,rgba(212,175,55,0.08) 0%,rgba(180,130,20,0.04) 40%,transparent 68%);
          filter:blur(80px);
          animation:g__driftA 28s ease-in-out infinite;
          pointer-events:none; z-index:0;
        }
        .g-hero-orb2 {
          position:absolute; bottom:-240px; right:-200px;
          width:720px; height:720px; border-radius:50%;
          background:radial-gradient(circle,rgba(245,201,122,0.065) 0%,transparent 62%);
          filter:blur(100px);
          animation:g__driftB 34s ease-in-out infinite 3s;
          pointer-events:none; z-index:0;
        }
        .g-hero-orb3 {
          position:absolute; top:40%; left:50%; transform:translate(-50%,-50%);
          width:500px; height:500px; border-radius:50%;
          background:radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 65%);
          pointer-events:none; z-index:0;
          animation:goldPulseRing 6s ease-in-out infinite;
        }

        /* Side Panels */
        .g-side-panel {
          position:absolute; top:0; bottom:0;
          width:clamp(90px,calc((100% - 820px)/2),220px);
          z-index:5;
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:0;
          padding:0 12px;
          pointer-events:none;
        }
        .g-side-left  { left:0; }
        .g-side-right { right:0; }

        @media(max-width:1100px) and (min-width:769px) {
          .g-side-panel { padding:0 6px; }
          .g-float-chip { min-width:80px !important; padding:8px 10px !important; }
          .g-side-img   { display:none !important; }
          .g-side-text  { display:none !important; }
        }
        @media(max-width:768px) { .g-side-panel { display:none !important; } }

        /* Hero center */
        .g-hero-center {
          position:relative; z-index:10;
          text-align:center;
          padding:120px 24px 80px;
          max-width:920px;
          margin:0 auto;
        }
        .g-hero-badge {
          display:inline-flex; align-items:center; gap:10px;
          margin-bottom:32px; padding:12px 30px;
          border-radius:10px;
          background:rgba(2,7,18,0.92); backdrop-filter:blur(28px);
          border:1px solid rgba(212,175,55,0.28);
          box-shadow:0 0 60px rgba(212,175,55,0.12), inset 0 1px 0 rgba(212,175,55,0.06);
        }
        .g-hero-badge span {
          font-family:var(--orb); font-size:10px; font-weight:700;
          letter-spacing:0.26em; text-transform:uppercase; color:var(--g);
        }
        .g-pulse-dot {
          width:6px; height:6px; border-radius:50%; background:var(--g);
          animation:g__pulseDot 2.4s ease-out infinite;
        }
        .g-hero-tag {
          display:inline-flex; align-items:center; gap:8px;
          padding:8px 20px; border-radius:8px; margin-bottom:26px;
          background:rgba(212,175,55,0.06); border:1px solid rgba(212,175,55,0.22);
          font-family:var(--orb); font-size:10px; font-weight:700;
          letter-spacing:0.24em; text-transform:uppercase; color:var(--g);
        }
        .g-hero-h1 {
          font-family:var(--serif); font-weight:900;
          font-size:clamp(3.2rem,7vw,5.8rem);
          line-height:1.04; color:#fff; margin:0 0 4px;
          letter-spacing:-0.03em;
          animation:g__fadeUpIn 0.8s cubic-bezier(0.22,1,0.36,1) both;
          text-shadow: 0 2px 40px rgba(0,0,0,0.8);
        }
        .g-hero-title-shine {
          display:block;
          font-family:var(--serif); font-weight:900;
          font-size:clamp(3.2rem,7vw,5.8rem);
          line-height:1.04; margin:0 0 34px;
          background:linear-gradient(90deg,#C9A227,#F5C97A,#D4AF37,#FFE090,#C4920A,#F5C97A,#C9A227);
          background-size:300% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:g__shimmer 7s linear infinite, g__fadeUpIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both;
          letter-spacing:-0.03em;
          filter: drop-shadow(0 4px 24px rgba(212,175,55,0.3));
        }
        .g-hero-desc {
          font-family:var(--poppins); font-size:clamp(0.95rem,1.7vw,1.15rem);
          line-height:2.1; color:rgba(199,209,219,0.62);
          max-width:560px; margin:0 auto 40px;
          font-weight:400; letter-spacing:0.01em;
          animation:g__fadeUpIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both;
        }
        .g-hero-divider {
          display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:44px;
          animation:g__fadeUpIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }
        .g-hero-line { height:1px; width:120px; background:linear-gradient(90deg,transparent,rgba(212,175,55,0.45),transparent); }
        .g-hero-line-rev { background:linear-gradient(270deg,transparent,rgba(212,175,55,0.45),transparent); }
        .g-gem {
          width:7px; height:7px; background:var(--g); transform:rotate(45deg);
          box-shadow:0 0 16px rgba(212,175,55,0.9);
          animation:g__gemGlow 3.8s ease-in-out infinite;
        }
        .g-hero-stats {
          display:flex; align-items:center; justify-content:center; gap:0;
          animation:g__fadeUpIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both;
          background:rgba(2,7,18,0.8); backdrop-filter:blur(28px);
          border:1px solid rgba(212,175,55,0.16); border-radius:16px;
          padding:22px 0; max-width:500px; margin:0 auto;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.06);
        }
        .g-hero-stat { flex:1; text-align:center; }
        .g-hero-stat strong {
          display:block; font-family:var(--orb); font-size:1.55rem;
          font-weight:800; color:var(--g); line-height:1; margin-bottom:6px;
          text-shadow:0 0 30px rgba(212,175,55,0.4);
        }
        .g-hero-stat span {
          font-family:var(--poppins); font-size:0.6rem; font-weight:600;
          letter-spacing:0.24em; text-transform:uppercase; color:rgba(200,185,155,0.4);
        }
        .g-hero-sdiv { width:1px; height:42px; background:rgba(212,175,55,0.18); }
        .g-scroll-hint {
          position:absolute; bottom:2.2rem; left:50%; transform:translateX(-50%);
          display:flex; flex-direction:column; align-items:center; gap:8px;
          font-family:var(--orb); font-size:0.55rem; letter-spacing:0.3em;
          text-transform:uppercase; color:rgba(212,175,55,0.28); z-index:10;
          animation:g__fadeUpIn 1s ease 0.8s both;
        }
        .g-scroll-bar {
          width:1px; height:40px;
          background:linear-gradient(180deg,rgba(212,175,55,0.6),transparent);
          animation:scrollP 2s ease-in-out infinite;
        }

        /* ════ FILTER BAR ════ */
        .g-bar-wrap {
          position:sticky; top:0; z-index:40;
          background:rgba(3,6,14,0.95); backdrop-filter:blur(28px);
          border-bottom:1px solid rgba(212,175,55,0.12);
          border-top:1px solid rgba(212,175,55,0.06);
          box-shadow:0 4px 40px rgba(0,0,0,0.6);
        }
        .g-bar {
          max-width:1440px; margin:0 auto; padding:0 2rem;
          display:flex; align-items:center; justify-content:space-between; gap:1rem;
        }
        .g-tabs { display:flex; align-items:center; overflow-x:auto; scrollbar-width:none; }
        .g-tabs::-webkit-scrollbar { display:none; }
        .g-tab {
          display:flex; align-items:center; gap:6px;
          padding:18px 18px;
          font-family:var(--sans); font-size:.72rem; font-weight:500;
          letter-spacing:.08em; text-transform:uppercase; color:rgba(199,209,219,0.45);
          background:none; border:none; border-bottom:2px solid transparent;
          cursor:pointer; transition:all .25s ease; white-space:nowrap;
        }
        .g-ticon { font-size:.9rem; }
        .g-tab:hover { color:rgba(212,175,55,0.8); }
        .g-tab--on { color:var(--g); border-bottom-color:var(--g); font-weight:600; }
        .g-count { font-size:.7rem; color:rgba(199,209,219,0.38); white-space:nowrap; letter-spacing:.1em; flex-shrink:0; font-family:var(--orb); }
        .g-count strong { color:var(--g); }

        /* ════ SECTION BG ════ */
        .g-section-bg {
          background: linear-gradient(180deg, #030A16 0%, #060F1E 50%, #030A16 100%);
          position:relative;
        }
        .g-section-bg::before {
          content:'';
          position:absolute; inset:0; pointer-events:none;
          background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.025) 0%, transparent 60%);
        }

        /* ════ MASONRY GRID ════ */
        .g-section { max-width:1440px; margin:0 auto; padding:3rem 2rem 5rem; position:relative; z-index:1; }
        .g-masonry { columns:4; column-gap:20px; }

        .g-card {
          break-inside:avoid; margin-bottom:20px; border-radius:20px;
          overflow:hidden; cursor:pointer; position:relative;
          background:#0A192F;
          border:1px solid rgba(212,175,55,0.07);
          transition:transform .4s cubic-bezier(.22,.68,0,1.2),box-shadow .4s ease,border-color .3s ease;
          animation:gCardIn .55s ease both;
          box-shadow:0 8px 32px rgba(0,0,0,0.5);
        }
        .g-card:hover {
          transform:translateY(-10px) scale(1.012);
          box-shadow:0 28px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.25), 0 0 60px rgba(212,175,55,0.06);
          border-color:rgba(212,175,55,0.25);
        }
        .g-card--normal .g-card-img { height:185px; }
        .g-card--tall   .g-card-img { height:270px; }
        .g-card--wide   .g-card-img { height:165px; }

        .g-card-img { position:relative; overflow:hidden; }
        .g-card-photo {
          position:absolute; inset:0; width:100%; height:100%;
          object-fit:cover;
          transition:transform .6s cubic-bezier(0.4,0,0.2,1), filter .4s ease;
          filter:brightness(0.7) saturate(0.85);
        }
        .g-card:hover .g-card-photo { transform:scale(1.08); filter:brightness(0.8) saturate(0.95); }
        .g-card-overlay {
          position:absolute; inset:0;
          background:linear-gradient(180deg, rgba(3,6,14,0.1) 0%, rgba(3,6,14,0.0) 40%, rgba(3,6,14,0.75) 100%);
          z-index:1;
        }

        .g-pill {
          position:absolute; top:12px; left:12px;
          padding:4px 10px; border-radius:99px; border:1px solid;
          font-size:.57rem; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
          display:flex; align-items:center; gap:5px; backdrop-filter:blur(12px); z-index:3;
          background:rgba(3,6,14,0.65);
        }
        .g-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

        .g-accent-bar {
          height:2px; width:100%; opacity:0.6;
          transition:opacity .3s ease, height .3s ease;
          position:relative; z-index:2;
        }
        .g-card:hover .g-accent-bar { opacity:1; height:2.5px; }

        .g-body { padding:15px 17px 17px; background:#0A192F; }
        .g-cat { font-size:.58rem; font-weight:700; letter-spacing:.28em; text-transform:uppercase; color:rgba(212,175,55,0.65); margin-bottom:5px; }
        .g-name { font-family:var(--alt); font-size:1.12rem; font-weight:700; line-height:1.25; margin-bottom:6px; color:#FFFFFF; }
        .g-loc { font-size:.71rem; color:rgba(199,209,219,0.45); display:flex; align-items:center; gap:5px; margin-bottom:12px; }
        .g-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; padding-top:10px; border-top:1px solid rgba(212,175,55,0.07); }
        .g-price { font-family:var(--alt); font-size:1.18rem; font-weight:700; color:var(--g); text-shadow:0 0 20px rgba(212,175,55,0.3); }
        .g-specs { display:flex; gap:5px; flex-wrap:wrap; }
        .g-specs span { font-size:.62rem; color:rgba(199,209,219,0.5); background:rgba(212,175,55,0.05); padding:3px 8px; border-radius:6px; border:1px solid rgba(212,175,55,0.08); }

        .g-hover-layer {
          position:absolute; inset:0; display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:10px; opacity:0; transition:opacity .3s ease;
          background:rgba(3,6,14,0.45); backdrop-filter:blur(3px); border-radius:20px; pointer-events:none; z-index:5;
        }
        .g-card:hover .g-hover-layer { opacity:1; }
        .g-zoom {
          width:52px; height:52px; border-radius:50%; border:1.5px solid rgba(212,175,55,0.7);
          display:flex; align-items:center; justify-content:center;
          font-size:1.4rem; background:rgba(2,7,18,0.7);
          transform:scale(0.7); transition:transform .35s cubic-bezier(.34,1.56,.64,1);
          box-shadow:0 0 30px rgba(212,175,55,0.25);
        }
        .g-card:hover .g-zoom { transform:scale(1); }
        .g-view-label { font-size:.68rem; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:rgba(245,237,216,0.8); }

        /* ════ EMPTY ════ */
        .g-empty { text-align:center; padding:6rem 2rem; color:rgba(199,209,219,0.45); }
        .g-eico { font-size:3.5rem; margin-bottom:1.2rem; }

        /* ════ CTA ════ */
        .g-cta {
          position:relative; overflow:hidden;
          border-top:1px solid rgba(212,175,55,0.1);
          padding:6rem 2rem;
          background: linear-gradient(180deg, #060F1E 0%, #0A192F 50%, #030A16 100%);
        }
        .g-cta-bg {
          position:absolute; inset:0;
          background:
            radial-gradient(ellipse 50% 70% at 0% 50%, rgba(212,175,55,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 60% at 100% 50%, rgba(180,130,20,0.04) 0%, transparent 55%);
        }
        .g-cta-inner { position:relative; max-width:1440px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:3rem; flex-wrap:wrap; }
        .g-cta-left { max-width:580px; }
        .g-cta-tag { font-size:.62rem; letter-spacing:.35em; text-transform:uppercase; color:var(--g); margin-bottom:.9rem; font-family:var(--orb); }
        .g-cta-h2 { font-family:var(--serif); font-size:clamp(2rem,4vw,3.2rem); font-weight:800; line-height:1.15; margin-bottom:.9rem; color:#FFFFFF; }
        .g-cta-h2 em { font-style:italic; color:var(--g); font-family:var(--alt); }
        .g-cta-p { font-size:.9rem; color:rgba(199,209,219,0.5); line-height:1.8; font-weight:300; font-family:var(--sans); }
        .g-cta-right { display:flex; flex-direction:column; gap:14px; flex-shrink:0; }
        .g-btn { padding:15px 40px; border-radius:10px; font-family:var(--sans); font-size:.78rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; cursor:pointer; transition:all .3s ease; min-width:230px; text-align:center; }
        .g-btn--gold { background:linear-gradient(135deg,#C9A227,#E8C055,#D4AF37,#F5E27A,#B8960C); color:#020710; border:none; box-shadow:0 6px 32px rgba(212,175,55,0.35); font-weight:800; }
        .g-btn--gold:hover { transform:translateY(-3px); box-shadow:0 14px 45px rgba(212,175,55,0.55); }
        .g-btn--ghost { background:transparent; color:var(--g); border:1.5px solid rgba(212,175,55,0.38); }
        .g-btn--ghost:hover { background:rgba(212,175,55,0.07); border-color:var(--gl); transform:translateY(-2px); }

        /* ════ LIGHTBOX ════ */
        .g-lb { position:fixed; inset:0; z-index:999; background:rgba(2,4,12,0.96); backdrop-filter:blur(40px); display:flex; align-items:center; justify-content:center; padding:1.5rem; animation:gLbIn .3s ease both; }
        .g-lb-box {
          display:grid; grid-template-columns:1fr 360px; max-width:920px; width:100%;
          background:linear-gradient(145deg,#0D2040,#030A16);
          border:1px solid rgba(212,175,55,0.2); border-radius:26px; overflow:hidden;
          animation:gLbSlide .35s cubic-bezier(.22,.68,0,1.1) both;
          max-height:92vh; position:relative;
          box-shadow:0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(212,175,55,0.08);
        }
        .g-lb-visual { position:relative; display:flex; align-items:center; justify-content:center; min-height:440px; overflow:hidden; }
        .g-lb-photo { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.65) saturate(0.8); }
        .g-lb-grad { position:absolute; inset:0; background:linear-gradient(180deg,rgba(2,4,12,0.15) 0%,rgba(2,4,12,0.0) 30%,rgba(2,4,12,0.65) 100%); z-index:1; }
        .g-lb-arr { position:absolute; top:50%; transform:translateY(-50%); z-index:10; width:46px; height:46px; border-radius:50%; background:rgba(2,7,18,0.75); border:1px solid rgba(212,175,55,0.3); color:var(--g); font-size:1.8rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .25s ease; backdrop-filter:blur(10px); }
        .g-lb-arr:hover { background:rgba(212,175,55,0.2); border-color:var(--g); box-shadow:0 0 20px rgba(212,175,55,0.3); }
        .g-lb-l { left:14px; } .g-lb-r { right:14px; }
        .g-lb-counter { position:absolute; bottom:16px; left:50%; transform:translateX(-50%); font-size:.65rem; letter-spacing:.2em; color:rgba(199,209,219,0.5); background:rgba(2,4,12,0.7); padding:4px 14px; border-radius:99px; backdrop-filter:blur(10px); z-index:2; font-family:var(--orb); border:1px solid rgba(212,175,55,0.1); }
        .g-lb-x { position:absolute; top:16px; right:16px; z-index:20; width:38px; height:38px; border-radius:50%; background:rgba(2,7,18,0.8); border:1px solid rgba(212,175,55,0.15); color:rgba(199,209,219,0.6); font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .25s ease; }
        .g-lb-x:hover { background:rgba(212,175,55,0.15); color:var(--g); border-color:var(--g); }
        .g-lb-info { padding:2.2rem 2rem; display:flex; flex-direction:column; overflow-y:auto; border-left:1px solid rgba(212,175,55,0.08); background:#060F1E; }
        .g-lb-pill { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:99px; border:1px solid; font-size:.58rem; font-weight:600; letter-spacing:.12em; text-transform:uppercase; width:fit-content; margin-bottom:1.1rem; background:rgba(2,7,18,0.7); }
        .g-lb-cat { font-size:.6rem; letter-spacing:.32em; text-transform:uppercase; color:rgba(212,175,55,0.6); margin-bottom:6px; font-family:var(--orb); }
        .g-lb-title { font-family:var(--serif); font-size:1.7rem; font-weight:700; line-height:1.2; margin-bottom:8px; color:#FFFFFF; }
        .g-lb-loc { font-size:.78rem; color:rgba(199,209,219,0.45); display:flex; align-items:center; gap:6px; }
        .g-lb-div { height:1px; background:rgba(212,175,55,0.07); margin:1.3rem 0; }
        .g-lb-prices { display:flex; gap:2.5rem; margin-bottom:1.2rem; }
        .g-lb-plabel { font-size:.6rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(199,209,219,0.38); margin-bottom:5px; font-family:var(--orb); }
        .g-lb-price { font-family:var(--serif); font-size:1.5rem; font-weight:700; color:var(--g); text-shadow:0 0 20px rgba(212,175,55,0.3); }
        .g-lb-price small { font-size:.75rem; font-family:var(--sans); font-weight:400; color:rgba(199,209,219,0.4); }
        .g-lb-specs { display:flex; gap:1rem; margin-bottom:0; }
        .g-lb-spec { display:flex; flex-direction:column; align-items:center; gap:3px; background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.08); border-radius:12px; padding:12px 18px; flex:1; }
        .g-lb-spec span { font-size:1.1rem; }
        .g-lb-spec strong { font-size:1.1rem; font-family:var(--serif); color:#FFFFFF; }
        .g-lb-spec small { font-size:.6rem; color:rgba(199,209,219,0.4); letter-spacing:.15em; text-transform:uppercase; }
        .g-lb-cta { width:100%; padding:14px; background:linear-gradient(135deg,#C9A227,#E8C055,#D4AF37,#F0DC80,#B8960C); color:#08050000; border:none; border-radius:10px; font-family:var(--sans); font-size:.74rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; transition:all .3s ease; margin-top:auto; color:#020710; }
        .g-lb-cta:hover { transform:translateY(-2px); box-shadow:0 10px 35px rgba(212,175,55,0.5); }
        .g-lb-visit { width:100%; padding:12px; background:transparent; color:var(--g); border:1.5px solid rgba(212,175,55,0.3); border-radius:10px; font-family:var(--sans); font-size:.72rem; font-weight:600; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; transition:all .3s ease; margin-top:10px; }
        .g-lb-visit:hover { background:rgba(212,175,55,0.07); border-color:var(--gl); }

        /* ════ RESPONSIVE ════ */
        @media(max-width:1280px){ .g-masonry{columns:3} }
        @media(max-width:960px){
          .g-masonry{columns:2}
          .g-lb-box{grid-template-columns:1fr;max-width:500px}
          .g-lb-visual{min-height:260px}
          .g-lb-info{border-left:none;border-top:1px solid rgba(212,175,55,0.08)}
          .g-lb-arr{display:none}
        }
        @media(max-width:640px){
          .g-masonry{columns:1}
          .g-card--normal .g-card-img,.g-card--tall .g-card-img,.g-card--wide .g-card-img{height:195px}
          .g-hover-layer{opacity:0!important}
          .g-section{padding:2rem 1.2rem 4rem}
          .g-tab{padding:14px 10px;font-size:.65rem}
          .g-lb-box{border-radius:18px}
          .g-lb-visual{min-height:210px}
          .g-lb-info{padding:1.5rem}
          .g-lb-title{font-size:1.3rem}
          .g-lb-price{font-size:1.2rem}
          .g-cta-inner{flex-direction:column;text-align:center}
          .g-cta-right{align-items:center}
          .g-btn{min-width:240px}
          .g-hero-stats{flex-direction:column;gap:16px;padding:20px}
          .g-hero-sdiv{width:40px;height:1px}
        }
      `}</style>

      {/* ══════════ HERO ══════════ */}
      <header className="g-hero">
        <div className="g-hero-orb1"/>
        <div className="g-hero-orb2"/>
        <div className="g-hero-orb3"/>
        <AnimatedGrid />

        {/* LEFT SIDE PANEL */}
        <div className="g-side-panel g-side-left" style={{ opacity:visible?1:0, transform:visible?'translateX(0)':'translateX(-52px)', transition:'opacity 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s' }}>
          <div style={{ width:1, height:60, background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.3))' }}/>
          <FloatChip delay={0.3} style={{ minWidth:126 }}><div style={chipNum}>1200+</div><div style={chipLbl}>Properties</div></FloatChip>
          <div style={vLine()}/><div style={orbDot(0)}/><div style={vLine()}/>
          <FloatChip delay={0.8} style={{ minWidth:126 }}><div style={chipNum}>350+</div><div style={chipLbl}>Plots</div></FloatChip>
          <div style={vLine()}/><Diamond d={0}/><div style={vLine()}/>
          <div style={{ padding:'7px 16px', border:'1px solid rgba(212,175,55,0.22)', borderRadius:100, animation:'g__floatDrift 5.5s ease-in-out infinite 1.2s', background:'rgba(2,7,18,0.9)' }}>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:'#D4AF37' }}>PREMIUM</span>
          </div>
          <div style={{ width:1, height:60, background:'linear-gradient(180deg,rgba(212,175,55,0.3),transparent)' }}/>
          <div style={{ position:'absolute', top:'8%', left:12, width:18, height:18, borderLeft:'1.5px solid rgba(212,175,55,0.3)', borderTop:'1.5px solid rgba(212,175,55,0.3)', animation:'g__glowBlink 3s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', bottom:'8%', left:12, width:18, height:18, borderLeft:'1.5px solid rgba(212,175,55,0.3)', borderBottom:'1.5px solid rgba(212,175,55,0.3)', animation:'g__glowBlink 3s ease-in-out infinite 1s' }}/>
          <div className="g-side-text" style={{ position:'absolute', bottom:'12%', left:10, transform:'rotate(-90deg)', transformOrigin:'center', fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.3em', color:'rgba(212,175,55,0.25)', whiteSpace:'nowrap' }}>PUNE · EST. 2006</div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="g-side-panel g-side-right" style={{ opacity:visible?1:0, transform:visible?'translateX(0)':'translateX(52px)', transition:'opacity 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s' }}>
          <div style={{ width:1, height:60, background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.3))' }}/>
          <div className="g-side-img" style={{ width:126, height:82, borderRadius:10, overflow:'hidden', border:'1px solid rgba(212,175,55,0.2)', animation:'g__floatDrift 4s ease-in-out infinite 0.5s', flexShrink:0, position:'relative' }}>
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.5) saturate(0.7)' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 30%,rgba(3,6,14,0.92) 100%)' }}/>
            <div style={{ position:'absolute', bottom:6, left:8 }}><span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.14em', color:'#D4AF37', textTransform:'uppercase' }}>Luxury</span></div>
          </div>
          <div style={vLine()}/><div style={orbDot(0.5)}/><div style={vLine()}/>
          <FloatChip delay={0.5} style={{ minWidth:126 }}><div style={chipNum}>18 Yrs</div><div style={chipLbl}>Experience</div></FloatChip>
          <div style={vLine()}/><Diamond d={2}/><div style={vLine()}/>
          <FloatChip delay={1.0} style={{ minWidth:126 }}><div style={{ ...chipNum, fontSize:17 }}>₹500Cr+</div><div style={chipLbl}>Value Closed</div></FloatChip>
          <div style={{ width:1, height:60, background:'linear-gradient(180deg,rgba(212,175,55,0.3),transparent)' }}/>
          <div style={{ position:'absolute', top:'8%', right:12, width:18, height:18, borderRight:'1.5px solid rgba(212,175,55,0.3)', borderTop:'1.5px solid rgba(212,175,55,0.3)', animation:'g__glowBlink 3s ease-in-out infinite 0.5s' }}/>
          <div style={{ position:'absolute', bottom:'8%', right:12, width:18, height:18, borderRight:'1.5px solid rgba(212,175,55,0.3)', borderBottom:'1.5px solid rgba(212,175,55,0.3)', animation:'g__glowBlink 3s ease-in-out infinite 1.5s' }}/>
          <div className="g-side-text" style={{ position:'absolute', bottom:'12%', right:10, transform:'rotate(90deg)', transformOrigin:'center', fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.3em', color:'rgba(212,175,55,0.25)', whiteSpace:'nowrap' }}>LUXURY · REAL · ESTATE</div>
        </div>

        {/* Center */}
        <div className="g-hero-center" style={fadeUp(0)}>
          <div className="g-hero-badge">
            <div className="g-pulse-dot"/>
            <span>⭐ Bigway Real Estate · Pune</span>
            <div className="g-pulse-dot" style={{ animationDelay:'0.7s' }}/>
          </div>
          <div style={{ marginBottom:22 }}>
            <div className="g-hero-tag">Property Gallery · 1200+ Listings</div>
          </div>
          <h1 className="g-hero-h1">Our</h1>
          <span className="g-hero-title-shine">Gallery</span>
          <p className="g-hero-desc">
            Handpicked residences, premium plots &amp; construction projects across Pune's finest locations — curated for the discerning buyer.
          </p>
          <div className="g-hero-divider">
            <div className="g-hero-line"/>
            <div className="g-gem"/>
            <div className="g-hero-line g-hero-line-rev"/>
          </div>
          <div className="g-hero-stats">
            <div className="g-hero-stat"><strong>1,200+</strong><span>Properties</span></div>
            <div className="g-hero-sdiv"/>
            <div className="g-hero-stat"><strong>350+</strong><span>Plots</span></div>
            <div className="g-hero-sdiv"/>
            <div className="g-hero-stat"><strong>18 Yrs</strong><span>Experience</span></div>
          </div>
        </div>

        <div className="g-scroll-hint">
          <span>Scroll to explore</span>
          <div className="g-scroll-bar"/>
        </div>
      </header>

      {/* ══ FILTER BAR ══ */}
      <div className="g-bar-wrap">
        <div className="g-bar">
          <div className="g-tabs">
            {categories.map(c => (
              <button key={c.label} className={`g-tab ${active === c.label ? "g-tab--on" : ""}`} onClick={() => setActive(c.label)}>
                <span className="g-ticon">{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
          <span className="g-count"><strong>{filtered.length}</strong> listings</span>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div className="g-section-bg">
        <div className="g-section">
          <div className="g-masonry">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`g-card g-card--${item.size}`}
                style={{ animationDelay: `${Math.min(i * 0.07, 0.6)}s` }}
                onClick={() => openLb(item.id)}
              >
                <div className="g-card-img">
                  <img className="g-card-photo" src={item.img} alt={item.title} loading="lazy"/>
                  <div className="g-card-overlay"/>
                  <div className="g-pill" style={{ color: statusColor[item.status], borderColor: statusColor[item.status]+"55" }}>
                    <span className="g-dot" style={{ background: statusColor[item.status] }} />{item.status}
                  </div>
                </div>
                <div className="g-accent-bar" style={{ background: `linear-gradient(90deg,${item.accent},rgba(212,175,55,0.3))` }} />
                <div className="g-body">
                  <div className="g-cat">{item.cat}</div>
                  <div className="g-name">{item.title}</div>
                  <div className="g-loc">
                    <svg width="9" height="11" viewBox="0 0 10 12"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg>
                    {item.loc}
                  </div>
                  <div className="g-footer">
                    <div className="g-price">{item.price}</div>
                    <div className="g-specs">
                      {item.bed > 0 && <><span>🛏 {item.bed}</span><span>🚿 {item.bath}</span></>}
                      <span>📐 {parseInt(item.area).toLocaleString()} sqft</span>
                    </div>
                  </div>
                </div>
                <div className="g-hover-layer">
                  <div className="g-zoom" style={{ color: item.accent }}>⊕</div>
                  <div className="g-view-label">View Details</div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="g-empty"><div className="g-eico">🔍</div><p>No listings in this category yet.</p></div>
          )}
        </div>
      </div>

      {/* ══ CTA ══ */}
      <div className="g-cta">
        <div className="g-cta-bg" />
        <div className="g-cta-inner">
          <div className="g-cta-left">
            <p className="g-cta-tag">✦ Free Consultation</p>
            <h2 className="g-cta-h2">Found Your <em>Dream Property?</em></h2>
            <p className="g-cta-p">Our experts will guide you through site visits, documentation and loan assistance — end to end.</p>
          </div>
          <div className="g-cta-right">
            <button className="g-btn g-btn--gold">Schedule a Visit ✦</button>
            <button className="g-btn g-btn--ghost">📞 Call Us Now</button>
          </div>
        </div>
      </div>

      {/* ══ LIGHTBOX ══ */}
      {lbItem && (
        <div className="g-lb" onClick={closeLb}>
          <div className="g-lb-box" onClick={e => e.stopPropagation()}>
            <button className="g-lb-x" onClick={closeLb}>✕</button>
            <div className="g-lb-visual">
              <img className="g-lb-photo" src={lbItem.img} alt={lbItem.title}/>
              <div className="g-lb-grad"/>
              <button className="g-lb-arr g-lb-l" onClick={e => { e.stopPropagation(); navLb(-1); }}>‹</button>
              <button className="g-lb-arr g-lb-r" onClick={e => { e.stopPropagation(); navLb(1); }}>›</button>
              <div className="g-lb-counter">{lbIdx + 1} / {filtered.length}</div>
            </div>
            <div className="g-lb-info">
              <div className="g-lb-pill" style={{ color: statusColor[lbItem.status], borderColor: statusColor[lbItem.status]+"55" }}>
                <span className="g-dot" style={{ background: statusColor[lbItem.status] }} />{lbItem.status}
              </div>
              <div className="g-lb-cat">{lbItem.cat}</div>
              <h2 className="g-lb-title">{lbItem.title}</h2>
              <div className="g-lb-loc">
                <svg width="11" height="13" viewBox="0 0 10 12"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg>
                {lbItem.loc}
              </div>
              <div className="g-lb-div" />
              <div style={{ height:3, borderRadius:2, background:`linear-gradient(90deg,${lbItem.accent},rgba(212,175,55,0.2))`, marginBottom:'1.2rem' }}/>
              <div className="g-lb-prices">
                <div><div className="g-lb-plabel">Price</div><div className="g-lb-price">{lbItem.price}</div></div>
                <div><div className="g-lb-plabel">Area</div><div className="g-lb-price">{parseInt(lbItem.area).toLocaleString()} <small>sqft</small></div></div>
              </div>
              {lbItem.bed > 0 && (
                <div className="g-lb-specs">
                  <div className="g-lb-spec"><span>🛏</span><strong>{lbItem.bed}</strong><small>Beds</small></div>
                  <div className="g-lb-spec"><span>🚿</span><strong>{lbItem.bath}</strong><small>Baths</small></div>
                </div>
              )}
              <div className="g-lb-div" />
              <button className="g-lb-cta">Enquire About This Property →</button>
              <button className="g-lb-visit">📅 Schedule Site Visit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;