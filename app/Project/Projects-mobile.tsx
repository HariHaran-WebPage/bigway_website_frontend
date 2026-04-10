'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const MOBILE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@700;800;900&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; -webkit-tap-highlight-color:transparent; }
  body { background:#030A16; color:#E8D5A3; overflow-x:hidden; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:none;} }
  @keyframes pulse     { 0%,100%{opacity:.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.2);} }
  @keyframes orbDrift  { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-14px);} }
  @keyframes scanMob   { 0%{top:-10%} 100%{top:110%} }
  @keyframes shimmer   { 0%{background-position:-300px 0} 100%{background-position:300px 0} }
  @keyframes cardSlide { from{opacity:0;transform:translateX(40px);} to{opacity:1;transform:none;} }
  @keyframes badgePop  { 0%{transform:scale(.7);opacity:0;} 70%{transform:scale(1.05);} 100%{transform:scale(1);opacity:1;} }
  @keyframes blipFall  { 0%{opacity:0;top:0;} 20%{opacity:1;} 100%{opacity:0;top:100%;} }
  @keyframes ctaGlow   { 0%,100%{box-shadow:0 0 30px rgba(212,175,55,.4);} 50%{box-shadow:0 0 60px rgba(212,175,55,.8);} }
  @keyframes rotateBadge { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
  @keyframes bwGShimmer   { 0%{background-position:-220%} 100%{background-position:220%} }
  @keyframes bwShelfPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes bwHoloScan   { 0%{top:-4px} 100%{top:100%} }
  @keyframes bwSheetUp    { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes float3d      { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-6px);} }

  ::-webkit-scrollbar { display:none; }

  .mob-filter-bar {
    position:sticky; top:0; z-index:50;
    background:rgba(3,10,22,.97);
    backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(212,175,55,.1);
    padding:12px 16px;
    display:flex; flex-direction:column; gap:10px;
  }

  .mob-card {
    background:linear-gradient(145deg,rgba(7,16,32,.95),rgba(3,10,22,.98));
    border:1px solid rgba(212,175,55,.12);
    border-radius:20px;
    overflow:hidden;
    transition:border .3s, transform .2s;
    cursor:pointer;
    animation: cardSlide .5s ease both;
  }
  .mob-card:active { transform:scale(.985); }

  .mob-modal {
    position:fixed; inset:0; z-index:1000;
    background:rgba(0,0,0,.92); backdrop-filter:blur(16px);
    display:flex; flex-direction:column;
    overflow:hidden;
    animation:fadeUp .3s ease both;
  }
  .mob-modal-body { flex:1; overflow-y:auto; padding-bottom:env(safe-area-inset-bottom, 20px); }

  .mob-search {
    background:rgba(212,175,55,.06);
    border:1px solid rgba(212,175,55,.22);
    border-radius:100px;
    color:#E8D5A3;
    font-family:'Poppins',sans-serif;
    font-size:14px;
    padding:11px 18px 11px 42px;
    outline:none;
    width:100%;
    transition:border .3s;
  }
  .mob-search:focus { border-color:rgba(212,175,55,.55); }
  .mob-search::placeholder { color:rgba(212,175,55,.38); }

  .mob-pill {
    padding:9px 20px; border-radius:100px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:12px;
    cursor:pointer; border:1.5px solid rgba(212,175,55,.3);
    transition:all .25s; white-space:nowrap;
    background:transparent; color:rgba(212,175,55,.9);
  }
  .mob-pill.active {
    background:linear-gradient(135deg,#D4AF37,#F5C97A);
    color:#0A1628; border-color:transparent;
    box-shadow:0 0 30px rgba(212,175,55,.45);
  }

  .mob-view-tab {
    display:flex; flex-direction:column; align-items:center; gap:3px;
    padding:8px 10px; border-radius:10px; cursor:pointer;
    border:none; transition:all .25s;
    font-family:'Orbitron',sans-serif; font-size:8px; letter-spacing:1px;
  }
  .mob-view-tab.active {
    background:linear-gradient(135deg,#D4AF37,#B8941F);
    box-shadow:0 0 18px rgba(212,175,55,.55);
  }

  /* ── 3D Viewer Styles ── */
  .view3d-container {
    position: relative;
    width: 100%;
    height: 280px;
    background: #020d1a;
    overflow: hidden;
    border-radius: 0;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .view3d-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    transform-origin: center center;
    will-change: transform;
    transition: none;
  }
  .view3d-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,20,40,.4) 0%, transparent 50%, rgba(0,5,15,.3) 100%);
    pointer-events: none;
  }
  .view3d-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(212,175,55,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,175,55,.06) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
  .view3d-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: rgba(3,10,22,.85);
    border: 1px solid rgba(212,175,55,.35);
    border-radius: 100px;
    backdrop-filter: blur(12px);
  }
  .view3d-controls {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
  }
  .view3d-btn {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: rgba(3,10,22,.9);
    border: 1px solid rgba(212,175,55,.4);
    color: #D4AF37;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    transition: background .2s, transform .1s;
    -webkit-tap-highlight-color: transparent;
  }
  .view3d-btn:active { transform: scale(.92); background: rgba(212,175,55,.15); }
  .view3d-compass {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(3,10,22,.85);
    border: 1px solid rgba(212,175,55,.35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  /* Hologram */
  .gold-shimmer {
    background:linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F);
    background-size:220% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:bwGShimmer 8s linear infinite;
  }
  .bw-shelf-glow { animation:bwShelfPulse 4s ease-in-out infinite; }
  .bw-book-wrap  {
    transition:opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1);
    display:flex; align-items:flex-end; flex-shrink:0; cursor:pointer; position:relative;
  }
  .bw-modal-sheet { animation:bwSheetUp 0.42s cubic-bezier(0.16,1,0.3,1); }

  .scanline-mob { animation:scanMob 3s linear infinite; }
  .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
  .scrollbar-hide::-webkit-scrollbar { display:none; }
`;

const gold = (a = 1) => `rgba(212,175,55,${a})`;

/* ── 3D VIEWER COMPONENT ── fully working touch drag-to-rotate */
const ThreeDViewer: React.FC<{ src: string; height?: number; borderRadius?: number }> = ({ src, height = 280, borderRadius = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const rotRef       = useRef({ x: 0, y: 0 });
  const zoomRef      = useRef(1);
  const dragging     = useRef(false);
  const lastPos      = useRef({ x: 0, y: 0 });
  const rafRef       = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = () => {
    if (!imgRef.current) return;
    const { x, y } = rotRef.current;
    const z = zoomRef.current;
    imgRef.current.style.transform =
      `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${z})`;
  };

  const startDrag = (cx: number, cy: number) => {
    dragging.current = true;
    lastPos.current = { x: cx, y: cy };
    setIsDragging(true);
  };
  const moveDrag = (cx: number, cy: number) => {
    if (!dragging.current) return;
    const dx = cx - lastPos.current.x;
    const dy = cy - lastPos.current.y;
    rotRef.current.y += dx * 0.35;
    rotRef.current.x -= dy * 0.35;
    rotRef.current.x = Math.max(-40, Math.min(40, rotRef.current.x));
    lastPos.current = { x: cx, y: cy };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(applyTransform);
  };
  const endDrag = () => { dragging.current = false; setIsDragging(false); };

  const handleReset = () => {
    rotRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    applyTransform();
  };
  const handleZoomIn  = () => { zoomRef.current = Math.min(2.5, zoomRef.current + 0.2); applyTransform(); };
  const handleZoomOut = () => { zoomRef.current = Math.max(0.5, zoomRef.current - 0.2); applyTransform(); };

  useEffect(() => {
    // Auto gentle rotation when idle
    let idleTimer: ReturnType<typeof setTimeout>;
    let autoRaf: number;
    let autoAngle = 0;
    const autoRotate = () => {
      if (!dragging.current) {
        autoAngle += 0.2;
        rotRef.current.y = Math.sin(autoAngle * 0.02) * 18;
        rotRef.current.x = Math.sin(autoAngle * 0.015) * 8;
        applyTransform();
      }
      autoRaf = requestAnimationFrame(autoRotate);
    };
    // Start gentle animation after a short delay
    idleTimer = setTimeout(() => { autoRaf = requestAnimationFrame(autoRotate); }, 800);
    return () => { clearTimeout(idleTimer); cancelAnimationFrame(autoRaf); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="view3d-container"
      style={{ height, borderRadius, cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
      onMouseMove={e => moveDrag(e.clientX, e.clientY)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={e => { e.stopPropagation(); startDrag(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchMove={e => { e.stopPropagation(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={endDrag}
    >
      <img
        ref={imgRef}
        src={src}
        alt="3D View"
        className="view3d-img"
        draggable={false}
        style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)' }}
      />
      <div className="view3d-overlay" />
      <div className="view3d-grid" />

      {/* Badge */}
      <div className="view3d-badge">
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,.8)' }} />
        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: '#D4AF37', letterSpacing: '.18em' }}>
          {isDragging ? 'ROTATING…' : 'DRAG TO ROTATE'}
        </span>
      </div>

      {/* Compass */}
      <div className="view3d-compass">
        <span style={{ fontSize: 18 }}>🧭</span>
      </div>

      {/* Controls */}
      <div className="view3d-controls">
        <button className="view3d-btn" onTouchStart={e => { e.stopPropagation(); handleZoomOut(); }} onClick={handleZoomOut} title="Zoom out">−</button>
        <button className="view3d-btn" onTouchStart={e => { e.stopPropagation(); handleReset(); }} onClick={handleReset} title="Reset" style={{ fontSize: 14 }}>↺</button>
        <button className="view3d-btn" onTouchStart={e => { e.stopPropagation(); handleZoomIn(); }} onClick={handleZoomIn} title="Zoom in">+</button>
      </div>

      {/* Scan line */}
      <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${gold(.4)}, transparent)`, animation: 'scanMob 4s linear infinite', pointerEvents: 'none' }} />
    </div>
  );
};

/* ── tiny canvas for hero bg ── */
const MobileGridBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    canvas.width = window.innerWidth;
    canvas.height = 420;
    const W = canvas.width, H = canvas.height;
    const COLS = 8, ROWS = 6, cW = W / COLS, cH = H / ROWS;
    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W, H);
      const t = frame.current * .015;
      for (let c = 0; c <= COLS; c++) {
        const x = c * cW;
        const g = ctx.createLinearGradient(x, 0, x, H);
        g.addColorStop(0, gold(0)); g.addColorStop(.5, gold(.06)); g.addColorStop(1, gold(0));
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.strokeStyle = g; ctx.lineWidth = .7; ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        const y = r * cH;
        const g = ctx.createLinearGradient(0, y, W, y);
        g.addColorStop(0, gold(0)); g.addColorStop(.5, gold(.06)); g.addColorStop(1, gold(0));
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.strokeStyle = g; ctx.lineWidth = .7; ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) for (let r = 0; r <= ROWS; r++) {
        const x = c * cW, y = r * cH;
        const pulse = .5 + .5 * Math.sin(t + c * .6 + r * .8);
        ctx.beginPath(); ctx.arc(x, y, 1.2 + pulse * .6, 0, Math.PI * 2);
        ctx.fillStyle = gold(.1 + pulse * .12); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: .9 }} />;
};

/* ── Bookshelf canvas ── */
const BookshelfGridCanvas: React.FC<{ sectionRef: React.RefObject<HTMLDivElement | null> }> = ({ sectionRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const blipsRef = useRef<{ col: number; progress: number; speed: number; alpha: number; color: string }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => {
      canvas.width  = sectionRef.current?.offsetWidth  || window.innerWidth;
      canvas.height = sectionRef.current?.offsetHeight || 600;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (sectionRef.current) ro.observe(sectionRef.current);

    const COLS = 10;
    const blipColors = ['rgba(212,175,55,', 'rgba(255,220,100,', 'rgba(245,201,122,'];

    const blipInterval = setInterval(() => {
      blipsRef.current.push({
        col: Math.floor(Math.random() * COLS), progress: 0,
        speed: 0.003 + Math.random() * 0.005,
        alpha: 0.5 + Math.random() * 0.5,
        color: blipColors[Math.floor(Math.random() * blipColors.length)],
      });
    }, 900);

    const draw = () => {
      frameRef.current++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cellW = W / COLS;
      const ROWS = Math.ceil(H / cellW) + 1;
      const t = frameRef.current * .008;

      for (let c = 0; c <= COLS; c++) {
        const x = c * cellW;
        const g = ctx.createLinearGradient(x, 0, x, H);
        g.addColorStop(0, 'rgba(212,175,55,0)'); g.addColorStop(.2, 'rgba(212,175,55,.09)');
        g.addColorStop(.5, 'rgba(212,175,55,.13)'); g.addColorStop(.8, 'rgba(212,175,55,.09)');
        g.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.strokeStyle = g; ctx.lineWidth = .8; ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        const y = r * cellW;
        const g = ctx.createLinearGradient(0, y, W, y);
        g.addColorStop(0, 'rgba(212,175,55,0)'); g.addColorStop(.15, 'rgba(212,175,55,.09)');
        g.addColorStop(.5, 'rgba(212,175,55,.13)'); g.addColorStop(.85, 'rgba(212,175,55,.09)');
        g.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = g; ctx.lineWidth = .8; ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) for (let r = 0; r <= ROWS; r++) {
        const x = c * cellW, y = r * cellW;
        const pulse = .5 + .5 * Math.sin(t * 1.4 + c * .55 + r * .75);
        ctx.beginPath(); ctx.arc(x, y, .8 + pulse * .7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${.1 + pulse * .15})`; ctx.fill();
      }
      const scanY = (Math.sin(t * .18) * .5 + .5) * H;
      const sg = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
      sg.addColorStop(0, 'rgba(212,175,55,0)');
      sg.addColorStop(.5, 'rgba(212,175,55,.055)');
      sg.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = sg; ctx.fillRect(0, scanY - 80, W, 160);

      blipsRef.current = blipsRef.current.filter(b => b.progress < 1);
      for (const blip of blipsRef.current) {
        blip.progress += blip.speed;
        const x = blip.col * cellW, y = blip.progress * H;
        const bg = ctx.createLinearGradient(x, y - 60, x, y + 4);
        bg.addColorStop(0, `${blip.color}0)`);
        bg.addColorStop(.8, `${blip.color}${(blip.alpha * .6).toFixed(2)})`);
        bg.addColorStop(1, `${blip.color}${blip.alpha.toFixed(2)})`);
        ctx.beginPath(); ctx.moveTo(x, y - 60); ctx.lineTo(x, y + 4);
        ctx.strokeStyle = bg; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `${blip.color}${blip.alpha.toFixed(2)})`;
        ctx.shadowColor = '#F5C97A'; ctx.shadowBlur = 8;
        ctx.fill(); ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); clearInterval(blipInterval); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  );
};

/* ── LeafletMap ── */
const PropertyMap = dynamic(
  () => import('react-leaflet').then(mod => {
    const MC = ({ lat, lng, title }: { lat: number; lng: number; title: string }) => {
      const { MapContainer, TileLayer, Marker, Popup } = mod;
      const L = require('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png' });
      return <MapContainer center={[lat, lng] as [number, number]} zoom={15} style={{ width: '100%', height: '100%' }}><TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" /><Marker position={[lat, lng]}><Popup>{title}</Popup></Marker></MapContainer>;
    };
    return MC;
  }),
  { ssr: false, loading: () => <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: gold() }}>Loading map…</div> }
);

interface Testimonial { id: number; name: string; location: string; comment: string; rating: number; image: string; }
interface Project {
  id: number; name: string; builder: string; location: string; startingPrice: string;
  amenities: string[]; possessionDate: string; status: 'Ongoing' | 'Completed'; featured: boolean;
  description: string; images: string[]; videoUrl?: string; view3D?: string;
  coordinates: { lat: number; lng: number }; testimonials: Testimonial[]; galleryImages: string[];
  spineColor?: string; coverAccent?: string; chapter?: string;
}

/* ── BOOK ── */
const Book: React.FC<{ project: Project; idx: number; onOpen: () => void; mounted: boolean }> = ({ project, idx, onOpen, mounted }) => {
  const [lifted, setLifted] = useState(false);
  const accent  = project.coverAccent || '#D4AF37';
  const spine   = project.spineColor  || '#1a0e05';
  const chapter = project.chapter     || String(idx + 1).padStart(2, '0');

  const SPINE_W = 36, COVER_W = 110, BOOK_H = 240;
  const BOOK_W  = SPINE_W + COVER_W;

  const handleTap = () => {
    setLifted(true);
    setTimeout(() => { setLifted(false); onOpen(); }, 320);
  };

  return (
    <div
      className="bw-book-wrap"
      style={{
        transitionDelay: `${idx * 85}ms`,
        opacity: mounted ? 1 : 0,
        transform: mounted
          ? (lifted ? 'translateY(-52px)' : 'translateY(0)')
          : 'translateY(60px) rotate(2deg)',
      }}
      onClick={handleTap}
    >
      <div style={{ width: BOOK_W, height: BOOK_H, position: 'relative' }}>
        {/* SPINE */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: SPINE_W,
          background: `linear-gradient(to right,rgba(0,0,0,.75) 0%,${spine} 18%,${spine} 82%,rgba(0,0,0,.55) 100%)`,
          borderRadius: '4px 0 0 4px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 0', overflow: 'hidden',
          boxShadow: lifted ? `-8px 0 36px rgba(0,0,0,.9)` : `-4px 0 18px rgba(0,0,0,.7)`,
          transition: 'box-shadow .3s',
        }}>
          <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 8, color: `${accent}90`, letterSpacing: '.22em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{chapter}</span>
          <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: Math.max(6, 10 - project.name.length / 7), color: lifted ? accent : `${accent}cc`, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.1em', textAlign: 'center', lineHeight: 1.25, transition: 'color .3s', maxHeight: BOOK_H - 70, overflow: 'hidden' }}>
            {project.name}
          </span>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: `radial-gradient(circle,${accent}90 0%,transparent 70%)` }} />
          <div style={{ position: 'absolute', top: 0, left: '30%', width: '20%', height: '100%', background: 'linear-gradient(to bottom,transparent,rgba(255,255,255,.06),transparent)', pointerEvents: 'none' }} />
        </div>

        {/* COVER */}
        <div style={{
          position: 'absolute', top: 0, left: SPINE_W, right: 0, bottom: 0,
          background: '#030A16', borderRadius: '0 6px 6px 0', overflow: 'hidden',
          border: `1px solid rgba(212,175,55,.18)`, borderLeft: 'none',
          boxShadow: lifted ? `6px 0 50px rgba(0,0,0,.7), 0 -8px 30px ${accent}30` : '4px 0 22px rgba(0,0,0,.55)',
          transition: 'box-shadow .3s',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,transparent,${accent}80,${accent},${accent}80,transparent)`, zIndex: 2 }} />
          <div style={{ height: '58%', overflow: 'hidden', position: 'relative' }}>
            <img src={project.images[0]} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s', transform: lifted ? 'scale(1.1)' : 'scale(1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom,transparent 25%,#030A16 100%)` }} />
            {project.featured && <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg,${accent},#8B6010)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#030A16', fontWeight: 900 }}>★</div>}
          </div>
          <div style={{ padding: '7px 9px 8px', height: '42%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundImage: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 14px,rgba(212,175,55,.06) 14px,rgba(212,175,55,.06) 15px)' }}>
            <div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 6, color: `${accent}60`, letterSpacing: '.2em', marginBottom: 3, textTransform: 'uppercase' }}>Chapter {chapter}</div>
              <div style={{ height: 1, background: `linear-gradient(to right,${accent}60,transparent)`, marginBottom: 5 }} />
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: Math.max(8, 12 - project.name.length / 6), color: lifted ? accent : '#e8dfc8', lineHeight: 1.2, transition: 'color .3s', marginBottom: 2 }}>{project.name}</h3>
              <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 8, color: 'rgba(199,185,155,.5)', lineHeight: 1.3 }}>{project.location}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9, background: `linear-gradient(135deg,${accent},#F0E0A0)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.startingPrice}</span>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 7, height: 7, color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,10,22,.65)', opacity: lifted ? 1 : 0, transition: 'opacity .3s' }}>
            <div style={{ padding: '8px 14px', borderRadius: 20, background: `linear-gradient(135deg,${accent},#8B6010)`, color: '#030A16', fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 10, transform: lifted ? 'translateY(0)' : 'translateY(14px)', transition: 'transform .3s', boxShadow: `0 0 28px ${accent}60` }}>Open Book</div>
          </div>
        </div>

        {/* PAGE EDGE */}
        <div style={{ position: 'absolute', top: 4, right: -7, bottom: 4, width: 8, background: 'repeating-linear-gradient(to bottom,#d6cdb0 0px,#d6cdb0 1px,#ede6cc 1px,#ede6cc 3.5px)', borderRadius: '0 2px 2px 0', boxShadow: '3px 0 8px rgba(0,0,0,.4)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

/* ── BOOK MODAL ── */
const BookModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  type BookTab = 'images' | 'info' | '3d' | 'hologram' | 'map' | 'testimonials';
  const [tab, setTab]       = useState<BookTab>('images');
  const [imgIdx, setImgIdx] = useState(0);
  const [fullscreen, setFs] = useState(false);
  const [mPos, setMPos]     = useState({ x: .5, y: .5 });
  const holoRef             = useRef<HTMLDivElement>(null);
  const swipeStartY         = useRef(0);
  const accent              = project.coverAccent || '#D4AF37';

  useEffect(() => {
    if (tab !== 'images') return;
    const iv = setInterval(() => setImgIdx(p => (p + 1) % project.images.length), 4000);
    return () => clearInterval(iv);
  }, [tab, project.images.length]);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

  const TABS: { id: BookTab; label: string }[] = [
    { id: 'images',       label: '📷 Photos' },
    { id: 'info',         label: '📋 Info' },
    ...(project.view3D ? [{ id: '3d' as BookTab, label: '🔮 3D' }, { id: 'hologram' as BookTab, label: '✦ Holo' }] : []),
    { id: 'map',          label: '📍 Map' },
    { id: 'testimonials', label: '💬 Reviews' },
  ];

  return (
    <>
      {fullscreen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.97)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setFs(false)}>
          <img src={project.images[imgIdx]} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
          <button onClick={() => setFs(false)} style={{ position: 'absolute', top: 20, right: 20, width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: 18, height: 18, color: '#0A1628' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(8px)' }} onClick={onClose} />

      <div
        className="bw-modal-sheet"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 110, height: '93vh', background: '#07101f', borderRadius: '26px 26px 0 0', border: `1px solid ${accent}30`, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -24px 80px rgba(0,0,0,.85)' }}
        onTouchStart={e => { swipeStartY.current = e.touches[0].clientY; }}
        onTouchEnd={e => { if (e.changedTouches[0].clientY - swipeStartY.current > 90) onClose(); }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,transparent,${accent}90,${accent},${accent}90,transparent)` }} />

        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 6px', flexShrink: 0 }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: `${accent}40` }} />
        </div>

        {/* Header */}
        <div style={{ padding: '4px 18px 14px', flexShrink: 0, borderBottom: '1px solid rgba(212,175,55,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 48, height: 64, borderRadius: 4, overflow: 'hidden', border: `1px solid ${accent}40`, flexShrink: 0 }}>
              <img src={project.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 10px', borderRadius: 100, background: 'linear-gradient(135deg,#10b981,#4ade80)', color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: "'Poppins',sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg style={{ width: 7, height: 7 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  READY TO MOVE
                </span>
                {project.featured && <span style={{ padding: '3px 8px', borderRadius: 100, background: 'rgba(3,10,22,.8)', border: `1px solid ${accent}50`, color: accent, fontSize: 9, fontWeight: 700 }}>★ FEATURED</span>}
              </div>
              <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1.12rem', color: '#fff', lineHeight: 1.15, marginBottom: 3 }}>{project.name}</h2>
              <div style={{ fontFamily: "'EB Garamond',serif", fontStyle: 'italic', fontSize: 12, color: `${accent}70` }}>{project.location}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: 18, background: `linear-gradient(135deg,${accent},#F5C97A)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.startingPrice}</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: `${accent}45`, letterSpacing: '.14em', marginTop: 1 }}>ONWARDS</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="scrollbar-hide" style={{ display: 'flex', borderBottom: '1px solid rgba(212,175,55,.08)', overflowX: 'auto', flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flexShrink: 0, padding: '11px 16px', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, cursor: 'pointer', border: 'none', borderBottom: tab === t.id ? `2.5px solid ${accent}` : '2.5px solid transparent', background: 'transparent', color: tab === t.id ? accent : 'rgba(199,209,219,.38)', whiteSpace: 'nowrap', transition: 'all .2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>

          {/* PHOTOS */}
          {tab === 'images' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }} className="scrollbar-hide">
              <div style={{ position: 'relative', height: 260, flexShrink: 0 }}>
                {project.images.map((src, i) => (
                  <img key={i} src={src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === imgIdx ? 1 : 0, transition: 'opacity .8s', cursor: 'zoom-in' }} onClick={() => setFs(true)} />
                ))}
                {project.images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(p => p === 0 ? project.images.length - 1 : p - 1)} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 38, height: 38, borderRadius: 10, background: 'rgba(3,10,22,.8)', border: `1px solid ${accent}40`, color: accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => setImgIdx(p => (p + 1) % project.images.length)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 38, height: 38, borderRadius: 10, background: 'rgba(3,10,22,.8)', border: `1px solid ${accent}40`, color: accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}
                <div style={{ position: 'absolute', bottom: 10, right: 12, padding: '4px 10px', borderRadius: 100, background: 'rgba(3,10,22,.8)', fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: accent }}>{imgIdx + 1}/{project.images.length}</div>
                <div style={{ position: 'absolute', bottom: 10, left: 12, padding: '4px 10px', borderRadius: 100, background: 'rgba(3,10,22,.7)', fontFamily: "'Poppins',sans-serif", fontSize: 10, color: 'rgba(199,209,219,.55)' }}>Tap to zoom</div>
              </div>
              <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, padding: '10px 16px', background: 'rgba(3,10,22,.95)', flexShrink: 0, overflowX: 'auto' }}>
                {project.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{ flexShrink: 0, width: 74, height: 50, borderRadius: 9, overflow: 'hidden', border: `2px solid ${i === imgIdx ? accent : 'transparent'}`, opacity: i === imgIdx ? 1 : .5, transition: 'all .2s', padding: 0 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
              {project.view3D && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '12px 16px 8px' }}>
                  {[['🔮', '3D VIEW', accent, () => setTab('3d')], ['✦', 'HOLOGRAM', '#4ade80', () => setTab('hologram')], ['📍', 'MAP', '#4ade80', () => setTab('map')]].map(([icon, label, color, fn]: any) => (
                    <button key={label} onClick={fn} style={{ padding: '11px 6px', borderRadius: 12, background: `${color}10`, border: `1px solid ${color}28`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 18 }}>{icon}</span>
                      <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color, letterSpacing: '.1em' }}>{label}</span>
                    </button>
                  ))}
                </div>
              )}
              <div style={{ padding: '12px 16px 24px' }}>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: 'rgba(232,213,163,.65)', lineHeight: 1.75, marginBottom: 16 }}>{project.description}</p>
                <button style={{ width: '100%', padding: '15px', borderRadius: 14, background: `linear-gradient(135deg,${accent},#F5C97A)`, color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', marginBottom: 10, boxShadow: `0 0 28px ${accent}45` }}>📅 Schedule Site Visit</button>
                <button style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'transparent', border: `1px solid ${accent}50`, color: accent, fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>📄 Download Brochure</button>
              </div>
            </div>
          )}

          {/* INFO */}
          {tab === 'info' && (
            <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '18px 18px 30px' }} className="scrollbar-hide">
              <div style={{ padding: 16, borderRadius: 16, background: `linear-gradient(135deg,${accent}15,${accent}06)`, border: `1px solid ${accent}30`, marginBottom: 16 }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${accent}70`, letterSpacing: '.2em', marginBottom: 4 }}>STARTING PRICE</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: 30, background: `linear-gradient(135deg,${accent},#F5C97A)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.startingPrice}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[['POSSESSION', project.possessionDate], ['STATUS', 'Ready to Move'], ['BUILDER', project.builder], ['LOCATION', project.location]].map(([k, v]) => (
                  <div key={k} style={{ padding: 12, borderRadius: 13, background: 'rgba(7,16,32,.85)', border: '1px solid rgba(212,175,55,.1)' }}>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: 'rgba(212,175,55,.4)', letterSpacing: '.16em', marginBottom: 4 }}>{k}</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 12, color: '#fff', wordBreak: 'break-word' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 14, borderRadius: 13, background: 'rgba(7,16,32,.85)', border: '1px solid rgba(212,175,55,.1)', marginBottom: 16 }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: 'rgba(212,175,55,.4)', letterSpacing: '.2em', marginBottom: 10 }}>◈ ABOUT</div>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: 'rgba(232,213,163,.65)', lineHeight: 1.75 }}>{project.description}</p>
              </div>
              <div style={{ padding: 14, borderRadius: 13, background: 'rgba(7,16,32,.85)', border: '1px solid rgba(212,175,55,.1)', marginBottom: 20 }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: 'rgba(212,175,55,.4)', letterSpacing: '.2em', marginBottom: 12 }}>◈ AMENITIES</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {project.amenities.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 9, background: `${accent}05`, border: `1px solid ${accent}10` }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: 'rgba(232,213,163,.7)' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button style={{ width: '100%', padding: 15, borderRadius: 14, background: `linear-gradient(135deg,${accent},#F5C97A)`, color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', marginBottom: 10, boxShadow: `0 0 28px ${accent}45` }}>📅 Schedule Site Visit</button>
              <button style={{ width: '100%', padding: 13, borderRadius: 14, background: 'transparent', border: `1px solid ${accent}50`, color: accent, fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>📄 Download Brochure</button>
            </div>
          )}

          {/* ── 3D TAB — now uses ThreeDViewer ── */}
          {tab === '3d' && project.view3D && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#020d1a' }}>
              <ThreeDViewer src={project.view3D} height={420} />
              <div style={{ padding: '16px 20px', flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'rgba(212,175,55,.08)', border: '1px solid rgba(212,175,55,.18)', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: gold(.5), letterSpacing: '.2em', marginBottom: 3 }}>DRAG</div>
                    <div style={{ fontSize: 20 }}>👆</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: 'rgba(232,213,163,.5)', marginTop: 3 }}>Rotate View</div>
                  </div>
                  <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'rgba(212,175,55,.08)', border: '1px solid rgba(212,175,55,.18)', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: gold(.5), letterSpacing: '.2em', marginBottom: 3 }}>PINCH</div>
                    <div style={{ fontSize: 20 }}>🤏</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: 'rgba(232,213,163,.5)', marginTop: 3 }}>Zoom In/Out</div>
                  </div>
                  <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'rgba(212,175,55,.08)', border: '1px solid rgba(212,175,55,.18)', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: gold(.5), letterSpacing: '.2em', marginBottom: 3 }}>TAP ↺</div>
                    <div style={{ fontSize: 20 }}>🔄</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: 'rgba(232,213,163,.5)', marginTop: 3 }}>Reset View</div>
                  </div>
                </div>
                <p style={{ fontFamily: "'EB Garamond',serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(212,175,55,.4)', textAlign: 'center' }}>Auto-rotates when idle · Drag to explore</p>
              </div>
            </div>
          )}

          {/* HOLOGRAM */}
          {tab === 'hologram' && project.view3D && (
            <div ref={holoRef} style={{ position: 'absolute', inset: 0, background: '#020d1a', cursor: 'crosshair', overflow: 'hidden' }}
              onMouseMove={e => { if (!holoRef.current) return; const r = holoRef.current.getBoundingClientRect(); setMPos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }); }}
              onTouchMove={e => { if (!holoRef.current) return; const r = holoRef.current.getBoundingClientRect(); setMPos({ x: (e.touches[0].clientX - r.left) / r.width, y: (e.touches[0].clientY - r.top) / r.height }); }}
            >
              <div style={{ position: 'absolute', inset: 0, transform: `translate(${(mPos.x - .5) * 26}px,${(mPos.y - .5) * 26}px)`, filter: 'blur(3px) hue-rotate(160deg) saturate(3) brightness(.45)', opacity: .5, mixBlendMode: 'screen' }}>
                <img src={project.view3D} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, transform: `translate(${(mPos.x - .5) * 7}px,${(mPos.y - .5) * 7}px) perspective(900px) rotateX(${(mPos.y - .5) * 8}deg) rotateY(${(mPos.x - .5) * 8}deg)`, filter: 'brightness(1.3) contrast(1.2) saturate(.65)', opacity: .88 }}>
                <img src={project.view3D} alt="Hologram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(212,175,55,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,.1) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(to right,transparent,rgba(212,175,55,.9) 30%,rgba(0,255,200,.7) 50%,rgba(212,175,55,.9) 70%,transparent)', boxShadow: '0 0 14px rgba(212,175,55,.8)', animation: 'bwHoloScan 3s linear infinite' }} />
              <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: 'rgba(212,175,55,.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,.8)' }} />
                HOLOGRAM.ACTIVE
              </div>
            </div>
          )}

          {/* MAP */}
          {tab === 'map' && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <PropertyMap lat={project.coordinates.lat} lng={project.coordinates.lng} title={project.name} />
            </div>
          )}

          {/* REVIEWS */}
          {tab === 'testimonials' && (
            <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '16px 18px 30px' }} className="scrollbar-hide">
              {project.testimonials.length > 0 ? project.testimonials.map(t => (
                <div key={t.id} style={{ padding: 16, borderRadius: 16, background: 'rgba(7,16,32,.85)', border: `1px solid ${accent}15`, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <img src={t.image} alt={t.name} style={{ width: 48, height: 48, borderRadius: 13, objectFit: 'cover', border: `2px solid ${accent}35`, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 2 }}>{t.name}</div>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: 'rgba(199,209,219,.4)', marginBottom: 5 }}>{t.location}</div>
                      <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: i < t.rating ? accent : `${accent}25`, fontSize: 11 }}>★</span>)}</div>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: 'rgba(232,213,163,.65)', lineHeight: 1.75, fontStyle: 'italic', marginTop: 12, borderTop: '1px solid rgba(212,175,55,.08)', paddingTop: 10 }}>"{t.comment}"</p>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 38, marginBottom: 10 }}>💬</div>
                  <div style={{ color: 'rgba(199,209,219,.35)', fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>No reviews yet.</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Close */}
        <div style={{ flexShrink: 0, padding: '10px 18px 14px', borderTop: '1px solid rgba(212,175,55,.08)', background: 'rgba(3,10,22,.98)' }}>
          <button onClick={onClose} style={{ width: '100%', padding: 13, borderRadius: 100, background: 'rgba(26,10,10,.9)', border: '1px solid rgba(239,68,68,.25)', color: '#f87171', fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

/* ── BOOKSHELF SECTION ── */
const BookshelfSection: React.FC<{ projects: Project[]; onOpen: (p: Project) => void }> = ({ projects, onOpen }) => {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 260); return () => clearTimeout(t); }, []);

  return (
    <section ref={sectionRef} style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#030A16 0%,#080510 50%,#0a0809 100%)', marginTop: 36 }}>
      <BookshelfGridCanvas sectionRef={sectionRef} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 28%,rgba(212,175,55,.04) 0%,transparent 65%)', pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, background: 'linear-gradient(to top,#0a0809,transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '48px 20px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 100, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', marginBottom: 16 }}>
          <svg style={{ width: 13, height: 13, color: '#4ade80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '.22em', color: '#4ade80', textTransform: 'uppercase' }}>Ready to Move In</span>
        </div>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1.85rem', lineHeight: 1.1, marginBottom: 7 }}>
          <span style={{ color: '#fff' }}>The Bigway </span>
          <span className="gold-shimmer">Chronicle</span>
        </h2>
        <p style={{ fontFamily: "'EB Garamond',serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(212,175,55,.48)', letterSpacing: '.06em', marginBottom: 6 }}>A curated library of completed residences</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ height: 1, width: 50, background: 'linear-gradient(to right,transparent,rgba(212,175,55,.4),transparent)' }} />
          <div style={{ width: 6, height: 6, background: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(212,175,55,.7)' }} />
          <div style={{ height: 1, width: 50, background: 'linear-gradient(to right,transparent,rgba(212,175,55,.4),transparent)' }} />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 3 }}>
        <div style={{ margin: '0 14px', background: 'linear-gradient(180deg,#5a3510 0%,#3d2208 40%,#2a1605 100%)', borderRadius: '8px 8px 0 0', border: '1px solid rgba(180,120,40,.28)', padding: '0 10px', boxShadow: '0 -16px 60px rgba(0,0,0,.55)' }}>
          <div style={{ height: 5, background: 'linear-gradient(to right,#8B5E20,#C8A04A,#D4AF37,#C8A04A,#8B5E20)', borderRadius: '4px 4px 0 0', boxShadow: '0 2px 10px rgba(212,175,55,.45)' }} />
          <div className="scrollbar-hide" style={{ display: 'flex', alignItems: 'flex-end', gap: 0, padding: '32px 6px 0', overflowX: 'auto', overflowY: 'visible', minHeight: 290, WebkitOverflowScrolling: 'touch' }}>
            {projects.map((project, idx) => (
              <Book key={project.id} project={project} idx={idx} mounted={mounted} onOpen={() => onOpen(project)} />
            ))}
            <div style={{ flexShrink: 0, width: 20 }} />
          </div>
          <div style={{ height: 18, background: 'linear-gradient(to bottom,#5a3510 0%,#3d2208 45%,#2a1605 100%)', position: 'relative', overflow: 'hidden', boxShadow: '0 6px 30px rgba(0,0,0,.65)' }}>
            <div className="bw-shelf-glow" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right,transparent,rgba(212,175,55,.4) 20%,rgba(212,175,55,.65) 50%,rgba(212,175,55,.4) 80%,transparent)' }} />
          </div>
        </div>
        <div style={{ margin: '0 14px', height: 16, background: 'linear-gradient(to right,#3d2208,#5a3510,#6b4018,#5a3510,#3d2208)', borderRadius: '0 0 8px 8px', boxShadow: '0 10px 40px rgba(0,0,0,.75)' }} />
        <div style={{ height: 26, background: 'linear-gradient(to bottom,rgba(0,0,0,.42),transparent)', margin: '0 14px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '16px 0 46px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 17px', borderRadius: 100, background: 'rgba(7,14,30,.8)', border: '1px solid rgba(212,175,55,.13)' }}>
          <span style={{ fontSize: 13 }}>👆</span>
          <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(212,175,55,.4)' }}>Tap a book · scroll for more</span>
        </div>
      </div>
    </section>
  );
};

/* ══ MAIN PAGE ══ */
const ProjectsPageMobile: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState<'images' | 'map' | 'testimonials' | 'video' | '3d' | 'hologram'>('images');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [bookProject, setBookProject] = useState<Project | null>(null);

  useEffect(() => { const t = setTimeout(() => setIsVisible(true), 150); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (showModal && selectedProject && activeView === 'images' && !fullscreenImage) {
      const iv = setInterval(() => setCurrentImageIndex(p => (p + 1) % selectedProject.images.length), 4000);
      return () => clearInterval(iv);
    }
  }, [showModal, selectedProject, activeView, fullscreenImage]);

  const projects: Project[] = [
    { id: 1, name: 'Bigway Serene Villas', builder: 'Bigway Constructions', location: 'RS Puram, Coimbatore', startingPrice: '₹1.2 Cr', amenities: ['Swimming Pool', 'Club House', 'Gym', 'Landscaped Gardens', '24/7 Security', "Children's Play Area"], possessionDate: 'Dec 2025', status: 'Ongoing', featured: true, description: 'Experience luxury living with 3 & 4 BHK villas in the heart of Coimbatore. Spread across 5 acres with world-class amenities.', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1600607687920-4e2c09cf159a?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&fit=crop&q=85'], videoUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&fit=crop&q=85', view3D: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&fit=crop&q=85', coordinates: { lat: 11.0168, lng: 76.9558 }, testimonials: [{ id: 1, name: 'Ramesh Kumar', location: 'Coimbatore', comment: 'Bigway Serene Villas exceeded our expectations. Quality construction and timely delivery.', rating: 5, image: 'https://randomuser.me/api/portraits/men/1.jpg' }, { id: 2, name: 'Priya Srinivasan', location: 'Chennai', comment: 'Excellent amenities and great location. Highly recommended!', rating: 5, image: 'https://randomuser.me/api/portraits/women/2.jpg' }], galleryImages: [] },
    { id: 2, name: 'Bigway Greenfield Enclave', builder: 'Bigway Group', location: 'Saibaba Colony, Coimbatore', startingPrice: '₹85 L', amenities: ['Club House', 'Park', 'Walking Tracks', 'Outdoor Gym', 'Community Hall'], possessionDate: 'Jun 2026', status: 'Ongoing', featured: false, description: 'Affordable luxury apartments with modern amenities in a prime location. Perfect for families.', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&fit=crop&q=85'], coordinates: { lat: 11.0204, lng: 76.9930 }, testimonials: [], galleryImages: [] },
    { id: 3, name: 'Bigway Lakeview Towers', builder: 'Bigway Developers', location: 'Peelamedu, Coimbatore', startingPrice: '₹1.5 Cr', amenities: ['Swimming Pool', 'Gym', 'Tennis Court', 'Party Hall', "Children's Pool"], possessionDate: 'Mar 2025', status: 'Completed', featured: true, description: 'Ready-to-move-in apartments. Stunning lake views and premium finishes.', images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&fit=crop&q=85'], view3D: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&fit=crop&q=85', coordinates: { lat: 11.0255, lng: 77.0151 }, testimonials: [{ id: 3, name: 'Suresh Iyer', location: 'Coimbatore', comment: 'Living here is a dream come true.', rating: 5, image: 'https://randomuser.me/api/portraits/men/3.jpg' }], galleryImages: [], spineColor: '#050f1a', coverAccent: '#C8A96E', chapter: '01' },
    { id: 5, name: 'Bigway Riverside Homes', builder: 'Bigway Constructions', location: 'Gandhipuram, Coimbatore', startingPrice: '₹95 L', amenities: ['Gated Community', 'Power Backup', 'Water Harvesting', "Children's Park"], possessionDate: 'Aug 2024', status: 'Completed', featured: false, description: 'Peaceful 2 & 3 BHK homes near the river with excellent connectivity.', images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800&fit=crop&q=85'], coordinates: { lat: 11.0186, lng: 76.9670 }, testimonials: [], galleryImages: [], spineColor: '#051015', coverAccent: '#D4B870', chapter: '02' },
    { id: 6, name: 'Bigway Palm Grove', builder: 'Bigway Estates', location: 'Gandhipuram, Coimbatore', startingPrice: '₹1.35 Cr', amenities: ['Swimming Pool', 'Club House', 'Indoor Games', 'Landscaped Gardens', 'Jogging Track', '24/7 Security'], possessionDate: 'Jan 2025', status: 'Completed', featured: true, description: 'An exclusive enclave of luxury villas surrounded by lush palm groves.', images: ['https://images.unsplash.com/photo-1613977257363-707ba9348221?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1600607687920-4e2c09cf159a?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&fit=crop&q=85'], videoUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348221?w=800&fit=crop&q=85', view3D: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&fit=crop&q=85', coordinates: { lat: 11.0186, lng: 76.9685 }, testimonials: [{ id: 5, name: 'Vikram Raj', location: 'Coimbatore', comment: 'Bigway Palm Grove is a masterpiece.', rating: 5, image: 'https://randomuser.me/api/portraits/men/5.jpg' }], galleryImages: [], spineColor: '#0a1505', coverAccent: '#E8C97A', chapter: '03' },
    { id: 7, name: 'Bigway Silver Springs', builder: 'Bigway Group', location: 'Peelamedu, Coimbatore', startingPrice: '₹98 L', amenities: ['Club House', 'Swimming Pool', "Children's Play Area", 'Gym', 'Power Backup'], possessionDate: 'Mar 2024', status: 'Completed', featured: false, description: 'Affordable luxury apartments ideal for families seeking comfort and connectivity.', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&fit=crop&q=85'], videoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop&q=85', view3D: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&fit=crop&q=85', coordinates: { lat: 11.0255, lng: 77.0140 }, testimonials: [], galleryImages: [], spineColor: '#0f0a1a', coverAccent: '#B8A070', chapter: '04' },
    { id: 8, name: 'Bigway Emerald Heights', builder: 'Bigway Constructions', location: 'RS Puram, Coimbatore', startingPrice: '₹2.1 Cr', amenities: ['Swimming Pool', 'Tennis Court', 'Club House', 'Spa', 'Home Automation', 'Concierge'], possessionDate: 'Sep 2023', status: 'Completed', featured: true, description: 'Ultra-luxury penthouses and villas with smart home technology.', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1600607687920-4e2c09cf159a?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&fit=crop&q=85'], videoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop&q=85', view3D: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&fit=crop&q=85', coordinates: { lat: 11.0168, lng: 76.9568 }, testimonials: [{ id: 6, name: 'Anita Krishnan', location: 'Chennai', comment: 'Emerald Heights redefines luxury.', rating: 5, image: 'https://randomuser.me/api/portraits/women/6.jpg' }], galleryImages: [], spineColor: '#1a0505', coverAccent: '#F0D090', chapter: '05' },
  ];

  const filtered  = projects.filter(p => {
    const ms = selectedStatus === 'All' || p.status === selectedStatus;
    const mq = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return ms && mq;
  });
  const ongoing   = filtered.filter(p => p.status === 'Ongoing');
  const completed = [...filtered.filter(p => p.status === 'Completed')].sort((a, b) => parseInt(a.chapter || '0') - parseInt(b.chapter || '0'));

  const openProject = (p: Project) => { setSelectedProject(p); setShowModal(true); setActiveView('images'); setCurrentImageIndex(0); };
  const closeModal  = () => { setShowModal(false); setSelectedProject(null); setFullscreenImage(null); };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd   = (e: React.TouchEvent, total: number) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentImageIndex(p => (p + 1) % total);
      else          setCurrentImageIndex(p => p === 0 ? total - 1 : p - 1);
    }
  };

  const viewTabs = [
    { id: 'images',       label: 'PHOTOS',  path: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: '3d',           label: '3D',      path: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5' },
    { id: 'video',        label: 'VIDEO',   path: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'hologram',     label: 'HOLO',    path: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'map',          label: 'MAP',     path: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { id: 'testimonials', label: 'REVIEWS', path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOBILE_STYLES }} />

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[{ x: 20, y: 10, size: 280 }, { x: 80, y: 60, size: 240 }].map((o, i) => (
          <div key={i} style={{ position: 'absolute', left: `${o.x}%`, top: `${o.y}%`, width: o.size, height: o.size, borderRadius: '50%', background: `radial-gradient(circle,rgba(212,175,55,0.07),transparent 70%)`, transform: 'translate(-50%,-50%)', animation: `orbDrift ${9 + i * 4}s ease-in-out infinite alternate` }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* HERO */}
        <section style={{ position: 'relative', padding: '80px 20px 48px', overflow: 'hidden', background: 'linear-gradient(180deg,rgba(212,175,55,.04) 0%,transparent 100%)' }}>
          <MobileGridBg />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', border: `1px solid ${gold(.3)}`, borderRadius: 100, marginBottom: 20, background: 'rgba(212,175,55,.06)', animation: 'badgePop .6s ease both' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: gold(), animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, letterSpacing: 3, color: gold(.7), textTransform: 'uppercase' }}>Bigway · Est. 2009</span>
            </div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, letterSpacing: 6, color: gold(.35), marginBottom: 10, textTransform: 'uppercase' }}>SIGNATURE PROJECTS</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,9vw,52px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, background: 'linear-gradient(135deg,#D4AF37,#F5C97A,#D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'fadeUp .7s .15s ease both' }}>
              Discover Our<br /><em>Signature</em><br />Projects
            </h1>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: 'rgba(232,213,163,.55)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto 28px', animation: 'fadeUp .7s .3s ease both' }}>
              Luxury villas & premium apartments trusted by 2,400+ families.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', animation: 'fadeUp .7s .45s ease both' }}>
              {[['4+', 'Projects'], ['2,400+', 'Families'], ['₹850Cr+', 'Transacted']].map(([val, label]) => (
                <div key={label} style={{ flex: 1, padding: '14px 8px', border: `1px solid ${gold(.18)}`, borderRadius: 14, background: 'rgba(212,175,55,.04)', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, fontWeight: 700, color: gold() }}>{val}</div>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: gold(.45), marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STICKY FILTER */}
        <div className="mob-filter-bar">
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: gold(.4) }} width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" /></svg>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search projects, locations…" className="mob-search" />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto' }}>
            {['All', 'Ongoing', 'Completed'].map(s => (
              <button key={s} className={`mob-pill${selectedStatus === s ? ' active' : ''}`} onClick={() => setSelectedStatus(s)}>{s}</button>
            ))}
            <div style={{ marginLeft: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: gold(.4), letterSpacing: 1, whiteSpace: 'nowrap' }}>{filtered.length} PROJECTS</span>
            </div>
          </div>
        </div>

        <main style={{ padding: '0 0 60px' }}>

          {/* ONGOING */}
          {(selectedStatus === 'All' || selectedStatus === 'Ongoing') && ongoing.length > 0 && (
            <section style={{ padding: '28px 16px 8px' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'inline-block', padding: '3px 12px', border: `1px solid ${gold(.3)}`, borderRadius: 100, fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: gold(.6), letterSpacing: 3, marginBottom: 8 }}>UNDER CONSTRUCTION</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: gold() }}>Ongoing Projects</h2>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: 'rgba(232,213,163,.45)', marginTop: 4 }}>Invest in your dream home of tomorrow</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {ongoing.map((project, idx) => (
                  <div key={project.id} className="mob-card" onClick={() => openProject(project)} style={{ animationDelay: `${idx * 80}ms` }}>
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                      <img src={project.images[0]} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(3,10,22,.85))' }} />
                      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                        <span style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(74,222,128,.15)', border: '1px solid rgba(74,222,128,.4)', fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: '#4ade80', letterSpacing: 1 }}>ONGOING</span>
                        {project.featured && <span style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(212,175,55,.15)', border: `1px solid ${gold(.4)}`, fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: gold(), letterSpacing: 1 }}>★ FEATURED</span>}
                      </div>
                      <div style={{ position: 'absolute', bottom: 12, right: 14, fontFamily: "'Orbitron',sans-serif", fontSize: 40, fontWeight: 900, color: gold(.08), lineHeight: 1 }}>0{idx + 1}</div>
                    </div>
                    <div style={{ padding: '18px 18px 16px' }}>
                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: gold(), marginBottom: 4, lineHeight: 1.25 }}>{project.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                        <svg width={11} height={11} fill={gold()} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                        <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: 'rgba(232,213,163,.55)' }}>{project.location}</span>
                      </div>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: gold(.35), marginBottom: 14 }}>{project.builder}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, padding: '12px 14px', background: 'rgba(212,175,55,.05)', borderRadius: 12, border: `1px solid ${gold(.1)}` }}>
                        {[['FROM', project.startingPrice, true], ['POSSESSION', project.possessionDate, false]].map(([l, v, big]) => (
                          <div key={l as string}>
                            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: gold(.4), letterSpacing: 2, marginBottom: 2 }}>{l}</div>
                            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: big ? 18 : 13, fontWeight: 700, color: gold() }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                        {project.amenities.slice(0, 3).map((a, i) => (
                          <span key={i} style={{ padding: '3px 9px', borderRadius: 100, border: `1px solid ${gold(.18)}`, fontFamily: "'Poppins',sans-serif", fontSize: 10, color: gold(.55), background: 'rgba(212,175,55,.03)' }}>{a}</span>
                        ))}
                        {project.amenities.length > 3 && <span style={{ padding: '3px 9px', borderRadius: 100, background: gold(.12), fontFamily: "'Poppins',sans-serif", fontSize: 10, color: gold(), fontWeight: 700 }}>+{project.amenities.length - 3}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={e => { e.stopPropagation(); openProject(project); }} style={{ flex: 1, padding: '13px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', boxShadow: `0 0 20px ${gold(.35)}` }}>View Details</button>
                        <button onClick={e => e.stopPropagation()} style={{ padding: '13px 15px', borderRadius: 100, background: 'transparent', border: `1.5px solid ${gold(.4)}`, color: gold(), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                      </div>
                      {/* Quick access 3D badge */}
                      {project.view3D && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                          {[['🔮 3D', '#D4AF37'], ['✦ HOLO', '#4ade80'], ['📍 MAP', '#60a5fa']].map(([label, color]) => (
                            <div key={label} style={{ flex: 1, padding: '6px 0', border: `1px solid ${color}25`, borderRadius: 8, fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${color}80`, letterSpacing: .5, textAlign: 'center', background: `${color}05` }}>{label}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* COMPLETED — BOOKSHELF */}
          {(selectedStatus === 'All' || selectedStatus === 'Completed') && completed.length > 0 && (
            <BookshelfSection projects={completed} onOpen={p => setBookProject(p)} />
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 48, color: gold(.1), marginBottom: 16 }}>◈</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: gold(.5), marginBottom: 10 }}>No Projects Found</h3>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: 'rgba(232,213,163,.35)', marginBottom: 24 }}>Try adjusting your search or filters</p>
              <button onClick={() => { setSelectedStatus('All'); setSearchQuery(''); }} style={{ padding: '14px 32px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>Reset Filters</button>
            </div>
          )}

          {/* CTA */}
          <section style={{ margin: '40px 16px 0', padding: '36px 24px', background: 'linear-gradient(145deg,rgba(7,16,32,.97),rgba(3,10,22,.99))', border: `1px solid ${gold(.15)}`, borderRadius: 24, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: gold(.4), letterSpacing: 4, marginBottom: 12, textTransform: 'uppercase' }}>INVEST IN YOUR FUTURE</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: gold(), lineHeight: 1.2, marginBottom: 12 }}>Ready to Own Your Dream Home?</h2>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: 'rgba(232,213,163,.5)', lineHeight: 1.65, marginBottom: 24 }}>Book a site visit or virtual tour with our expert advisors — zero commission, zero pressure.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button style={{ padding: '16px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', animation: 'ctaGlow 3s ease-in-out infinite' }}>Schedule Site Visit</button>
              <button style={{ padding: '16px', borderRadius: 100, background: 'transparent', border: `1.5px solid ${gold(.4)}`, color: gold(), fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Contact Sales</button>
            </div>
          </section>
        </main>
      </div>

      {/* ONGOING MODAL */}
      {showModal && selectedProject && (
        <div className="mob-modal">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(3,10,22,.99)', borderBottom: `1px solid ${gold(.1)}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#D4AF37,#B8941F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: 11, color: '#030A16' }}>BW</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: gold(), lineHeight: 1.2 }}>{selectedProject.name}</div>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: gold(.45) }}>{selectedProject.location}</div>
              </div>
            </div>
            <button onClick={closeModal} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(26,10,10,1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6, padding: '10px 16px', background: 'rgba(3,10,22,.98)', borderBottom: `1px solid ${gold(.08)}`, overflowX: 'auto', flexShrink: 0 }}>
            {viewTabs.map(tab => (
              <button key={tab.id} className={`mob-view-tab${activeView === tab.id ? ' active' : ''}`}
                onClick={() => { setActiveView(tab.id as any); setFullscreenImage(null); }}
                style={{ color: activeView === tab.id ? '#030A16' : gold(.5), background: activeView === tab.id ? undefined : 'rgba(7,16,32,1)' }}>
                <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={tab.path} /></svg>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mob-modal-body">
            {activeView === 'images' && (
              <div>
                <div style={{ position: 'relative', height: 260 }} onTouchStart={handleTouchStart} onTouchEnd={e => handleTouchEnd(e, selectedProject.images.length)}>
                  <img src={selectedProject.images[currentImageIndex]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setFullscreenImage(selectedProject.images[currentImageIndex])} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 60%,rgba(3,10,22,.6))' }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
                    {selectedProject.images.map((_, i) => (
                      <div key={i} onClick={() => setCurrentImageIndex(i)} style={{ width: i === currentImageIndex ? 18 : 6, height: 5, borderRadius: 3, background: i === currentImageIndex ? gold() : 'rgba(255,255,255,.3)', transition: 'all .3s', cursor: 'pointer' }} />
                    ))}
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12, padding: '3px 10px', borderRadius: 100, background: 'rgba(0,0,0,.55)', fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: gold(.7) }}>{currentImageIndex + 1}/{selectedProject.images.length}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto' }}>
                  {selectedProject.images.map((img, i) => (
                    <div key={i} onClick={() => setCurrentImageIndex(i)} style={{ flexShrink: 0, width: 72, height: 50, borderRadius: 8, overflow: 'hidden', border: `2px solid ${i === currentImageIndex ? gold() : 'transparent'}`, opacity: i === currentImageIndex ? 1 : .5, cursor: 'pointer', transition: 'all .3s' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FIXED: 3D tab in Ongoing modal now uses ThreeDViewer ── */}
            {activeView === '3d' && selectedProject.view3D && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ThreeDViewer src={selectedProject.view3D} height={300} />
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    {[['👆 Drag', 'Rotate View'], ['🤏 Pinch', 'Zoom In/Out'], ['↺ Tap', 'Reset View']].map(([icon, label]) => (
                      <div key={label} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: 'rgba(212,175,55,.06)', border: '1px solid rgba(212,175,55,.14)', textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, marginBottom: 4 }}>{icon}</div>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: 'rgba(232,213,163,.5)' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'EB Garamond',serif", fontStyle: 'italic', fontSize: 12, color: gold(.35), textAlign: 'center' }}>Auto-rotates when idle · Use controls to explore</p>
                </div>
              </div>
            )}

            {activeView === 'map' && (
              <div style={{ height: 300, margin: '0 16px 16px', borderRadius: 16, overflow: 'hidden', border: `1px solid ${gold(.15)}` }}>
                <PropertyMap lat={selectedProject.coordinates.lat} lng={selectedProject.coordinates.lng} title={selectedProject.name} />
              </div>
            )}
            {activeView === 'testimonials' && (
              <div style={{ padding: '16px' }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: gold(.5), letterSpacing: 3, marginBottom: 14 }}>◈ RESIDENT TESTIMONIALS</div>
                {selectedProject.testimonials.length > 0 ? selectedProject.testimonials.map(t => (
                  <div key={t.id} style={{ padding: 16, border: `1px solid ${gold(.15)}`, borderRadius: 16, marginBottom: 14, background: 'rgba(212,175,55,.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <img src={t.image} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${gold(.3)}` }} />
                      <div>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: gold(), fontSize: 14 }}>{t.name}</div>
                        <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: i < t.rating ? gold() : gold(.2), fontSize: 11 }}>★</span>)}</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: 'rgba(232,213,163,.7)', fontStyle: 'italic', lineHeight: 1.6 }}>"{t.comment}"</p>
                  </div>
                )) : <p style={{ fontFamily: "'Poppins',sans-serif", color: gold(.4), fontSize: 13 }}>No testimonials yet.</p>}
              </div>
            )}
            {activeView === 'video' && (
              <div style={{ height: 260, position: 'relative', margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedProject.videoUrl && <img src={selectedProject.videoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .6 }} />}
                <div style={{ position: 'absolute', width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 0 30px ${gold(.5)}` }}>
                  <svg width={22} height={22} fill="#030A16" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            )}
            {activeView === 'hologram' && selectedProject.view3D && (
              <div style={{ height: 260, margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg,rgba(0,20,40,.95),rgba(0,5,15,.98))', border: `1px solid ${gold(.25)}`, position: 'relative' }}>
                <img src={selectedProject.view3D} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .35, filter: 'hue-rotate(180deg) saturate(2) brightness(1.5)' }} />
                <div className="scanline-mob" style={{ position: 'absolute', left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${gold(.6)},transparent)` }} />
                <div style={{ position: 'absolute', top: 12, left: 14, fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: gold(.6), letterSpacing: 2 }}>◈ HOLOGRAM.ACTIVE</div>
              </div>
            )}

            {/* Shared details */}
            <div style={{ padding: '20px 16px' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, padding: '14px', border: `1px solid ${gold(.2)}`, borderRadius: 14, background: 'rgba(212,175,55,.04)', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: gold(.4), letterSpacing: 2, marginBottom: 2 }}>STARTING PRICE</div>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: gold() }}>{selectedProject.startingPrice}</div>
                </div>
                <div style={{ flex: 1, padding: '14px', border: `1px solid ${gold(.12)}`, borderRadius: 14, background: 'rgba(212,175,55,.02)', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: gold(.4), letterSpacing: 2, marginBottom: 2 }}>POSSESSION</div>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, color: gold(.9) }}>{selectedProject.possessionDate}</div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: gold(.5), letterSpacing: 2, marginBottom: 8 }}>◈ ABOUT</div>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: 'rgba(232,213,163,.65)', lineHeight: 1.7 }}>{selectedProject.description}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: gold(.5), letterSpacing: 2, marginBottom: 10 }}>◈ AMENITIES</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                  {selectedProject.amenities.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', border: `1px solid ${gold(.1)}`, borderRadius: 10, background: 'rgba(212,175,55,.02)' }}>
                      <span style={{ color: gold(), fontSize: 10 }}>◆</span>
                      <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: 'rgba(232,213,163,.65)', lineHeight: 1.3 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button style={{ padding: '15px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: `0 0 25px ${gold(.4)}` }}>Schedule Site Visit</button>
                <button style={{ padding: '15px', borderRadius: 100, background: 'transparent', border: `1.5px solid ${gold(.4)}`, color: gold(), fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Download Brochure</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOK MODAL for completed */}
      {bookProject && <BookModal project={bookProject} onClose={() => setBookProject(null)} />}

      {/* Fullscreen image */}
      {fullscreenImage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setFullscreenImage(null)}>
          <button onClick={() => setFullscreenImage(null)} style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={18} height={18} fill="none" stroke="#030A16" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={fullscreenImage} alt="" style={{ maxWidth: '95vw', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default ProjectsPageMobile;