'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── TYPE DEFINITIONS ─────────────────────────────────────────
interface Blip {
  col: number;
  progress: number;
  speed: number;
  alpha: number;
}

interface Hotspot {
  x: number;
  y: number;
  label: string;
}

interface VRRoom {
  id: string;
  label: string;
  emoji: string;
  image: string;
  hotspots: Hotspot[];
}

interface NearbyFacility {
  name: string;
  distance: string;
  type: string;
  time: string;
}

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  pricePerSqft: string;
  emi: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  plotArea: string;
  floors: string;
  age: string;
  possession: string;
  facing: string;
  vastu: boolean;
  parking: string;
  walkScore: number;
  tag: string;
  tagColor: string;
  type: string;
  status: string;
  featured: boolean;
  accentColor: string;
  hasPlotSite?: boolean;
  videoUrl: string;
  image: string;
  images: string[];
  amenities: string[];
  highlights: string[];
  description: string;
  whyBuy: string[];
  specifications: Record<string, string>;
  nearbyFacilities: NearbyFacility[];
  coordinates: { lat: number; lng: number };
  vrRooms: VRRoom[];
}

interface Plot {
  id: string;
  number: string;
  col: number;
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
  direction: string;
  area: string;
  status: 'available' | 'sold' | 'reserved';
  price: string;
  image: string;
  vrImage: string;
}

interface VRState {
  property: Property;
  plotOverride: Plot | null;
}

// ── DATA ──────────────────────────────────────────────────────
const VIDEOS = {
  villa: 'https://videos.pexels.com/video-files/7578540/7578540-uhd_2560_1440_25fps.mp4',
  plot:  'https://videos.pexels.com/video-files/4763829/4763829-uhd_2560_1440_25fps.mp4',
  land:  'https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_25fps.mp4',
};

const PLOT_STATUSES: Array<'available' | 'sold' | 'reserved'> = ['available','available','available','sold','reserved'];
const AREAS = ['1100 sqft','1200 sqft','1250 sqft','1300 sqft','1350 sqft','1450 sqft','1500 sqft','1600 sqft'];
const PRICES_BASE = [75,83,86,90,93,100,105,110];

function generatePlots(): Plot[] {
  const plots: Plot[] = [];
  for (let i = 0; i < 60; i++) {
    const col = i % 10;
    const row = Math.floor(i / 10);
    const aIdx = Math.floor(Math.random() * AREAS.length);
    const statusIdx = Math.floor(Math.random() * PLOT_STATUSES.length);
    const dir = row < 3 ? 'North' : 'South';
    const price = `₹${PRICES_BASE[aIdx]}L`;
    const imgPool = [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop&q=90',
      'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800&fit=crop&q=90',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&fit=crop&q=90',
      'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&fit=crop&q=90',
      'https://images.unsplash.com/photo-1504615755583-2916b52192a3?w=800&fit=crop&q=90',
    ];
    plots.push({
      id: `p${i+1}`,
      number: String(i + 1).padStart(2,'0'),
      col, row,
      x: 4 + col * 9.2,
      y: 6 + row * 14.2,
      w: 8.4, h: 12.5,
      direction: dir,
      area: AREAS[aIdx],
      status: PLOT_STATUSES[statusIdx],
      price,
      image: imgPool[i % imgPool.length],
      vrImage: imgPool[(i + 3) % imgPool.length],
    });
  }
  return plots;
}
const ALL_PLOTS = generatePlots();

const PROPERTIES: Property[] = [
  {
    id: 1, title: 'Luxury Villa with Pool', location: 'RS Puram, Coimbatore',
    price: '₹8.5 Cr', pricePerSqft: '₹18,888/sqft', emi: '₹5.2L/month',
    bedrooms: 5, bathrooms: 6, area: '4,500 sq ft', plotArea: '6,200 sq ft',
    floors: 'G+2', age: 'New Construction', possession: 'Ready to Move',
    facing: 'East', vastu: true, parking: '3 Cars', walkScore: 92,
    tag: 'Ultra Premium', tagColor: '#E91E8C', type: 'Villa', status: 'For Sale', featured: true,
    accentColor: '#D4AF37',
    videoUrl: VIDEOS.villa,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&fit=crop&q=90',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600607687920-4e2c09cf159a?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&fit=crop&q=90',
    ],
    amenities: ['Swimming Pool','Smart Home','Garden','Gym','24/7 Security','Modular Kitchen','EV Charging','Solar Panels','Home Theatre','Terrace'],
    highlights: ['RERA Approved','Bank Loan Available','Clear Title','Vastu Compliant'],
    description: 'An extraordinary 5-bedroom luxury villa where architecture meets artistry. Private infinity pool, chef\'s kitchen, home theatre, and landscaped gardens craft a sanctuary of unparalleled refinement in the heart of RS Puram.',
    whyBuy: ['Premium RS Puram address with excellent connectivity','Infinity pool and landscaped gardens spanning 1,700 sqft','KNX-ready smart home infrastructure pre-installed','10-year structural warranty with dedicated maintenance team'],
    specifications: { Structure:'RCC Frame', Flooring:'Italian Marble', Doors:'Teak Wood', Windows:'UPVC Double Glazed', Kitchen:'Modular Italian', Electrical:'Smart Switches' },
    nearbyFacilities: [
      { name:'Stanes School', distance:'1.0 km', type:'school', time:'3 min' },
      { name:'KMCH Hospital', distance:'2.5 km', type:'hospital', time:'7 min' },
      { name:'Prozone Mall', distance:'1.5 km', type:'shopping', time:'5 min' },
      { name:'Race Course', distance:'1.2 km', type:'park', time:'4 min' },
      { name:'CBE Airport', distance:'18 km', type:'transport', time:'25 min' },
    ],
    coordinates: { lat:11.0168, lng:76.9558 },
    vrRooms: [
      { id:'exterior', label:'Exterior', emoji:'🏡', image:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&fit=crop&q=95', hotspots:[{x:35,y:55,label:'Main Entrance'},{x:75,y:65,label:'Garage'}] },
      { id:'living', label:'Living Room', emoji:'🛋️', image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&fit=crop&q=95', hotspots:[{x:45,y:50,label:'Entertainment Zone'}] },
      { id:'pool', label:'Pool Area', emoji:'🏊', image:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&fit=crop&q=95', hotspots:[{x:50,y:55,label:'Infinity Pool'},{x:80,y:40,label:'Sun Deck'}] },
    ],
  },
  {
    id: 2, title: 'Premium Residential Plots', location: 'RS Puram, Coimbatore',
    price: '₹2.5 Cr', pricePerSqft: '₹6,944/sqft', emi: '₹1.5L/month',
    area: '3,600 sq ft', plotArea: '3,600 sq ft',
    floors: 'N/A', age: 'NA', possession: 'Immediate', walkScore: 88,
    facing: 'North / South', vastu: true, parking: 'Open',
    tag: 'New Launch', tagColor: '#D4AF37', type: 'Plot', status: 'For Sale', featured: true,
    accentColor: '#22C55E',
    hasPlotSite: true,
    videoUrl: VIDEOS.plot,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop&q=90',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&fit=crop&q=90',
    ],
    amenities: ['DTCP Approved','Clear Title','Water Connection','Electricity','30ft Wide Road','Gated Community','Underground Drainage','Street Lighting'],
    highlights: ['DTCP Approved','Bank Loan Available','Clear Title','Immediate Registration'],
    description: 'DTCP approved premium residential plots in a gated community. 60 plots available — North & South facing options. 30ft wide road access, underground drainage, all utilities ready.',
    whyBuy: ['Gated community with 24/7 security','DTCP approved — bank loans from all major banks','Immediate registration and possession','Plots starting from ₹75L — best entry price in RS Puram'],
    specifications: { 'Road Width':'30 ft', 'Compound':'Pre-cast Walls', 'Water':'Underground Sump', 'Electricity':'EB + Solar', 'Drainage':'Underground', 'Approval':'DTCP', 'Title':'Clear Patta', 'Zone':'Residential' },
    nearbyFacilities: [
      { name:'RS Puram School', distance:'0.5 km', type:'school', time:'2 min' },
      { name:'Ganga Hospital', distance:'1.2 km', type:'hospital', time:'4 min' },
      { name:'Fun Republic Mall', distance:'2.0 km', type:'shopping', time:'6 min' },
      { name:'VOC Park', distance:'1.8 km', type:'park', time:'5 min' },
    ],
    coordinates: { lat:11.0168, lng:76.9558 },
    vrRooms: [
      { id:'aerial', label:'Aerial View', emoji:'🚁', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&fit=crop&q=95', hotspots:[{x:30,y:40,label:'North Block'},{x:70,y:60,label:'South Block'}] },
      { id:'road', label:'Main Road', emoji:'🛣️', image:'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=1920&fit=crop&q=95', hotspots:[{x:50,y:55,label:'30ft Wide Road'}] },
    ],
  },
  {
    id: 3, title: 'Agricultural Land – 2 Acres', location: 'Saibaba Colony, Coimbatore',
    price: '₹4.8 Cr', pricePerSqft: '₹551/sqft', emi: '₹2.9L/month',
    area: '2 Acres (87,120 sq ft)', plotArea: '87,120 sq ft',
    floors: 'N/A', age: 'Agricultural', possession: 'Immediate', walkScore: 74,
    facing: 'East', vastu: true, parking: 'Open',
    tag: 'Best Value', tagColor: '#00BCD4', type: 'Land', status: 'For Sale', featured: true,
    accentColor: '#00BCD4',
    videoUrl: VIDEOS.land,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop&q=90',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&fit=crop&q=90',
    ],
    amenities: ['Agricultural Zone','Borewell','Electricity','Fertile Soil','Road Access','Compound Wall','6 Ft Fencing','Clear Patta'],
    highlights: ['Clear Patta','Bank Loan Eligible','No Disputes','NA Approved'],
    description: 'Vast agricultural land with excellent red soil quality. Fully fenced with compound wall, functional borewell, and electricity connection. Perfect for organic farming or future residential development.',
    whyBuy: ['Lowest price per sqft in Saibaba Colony','NA conversion potential for residential development','Functional borewell with year-round water supply','Fully fenced — no encroachment, clear boundaries'],
    specifications: { 'Soil Type':'Red Laterite', 'Water':'Borewell Available', 'Fencing':'6 ft Pre-cast', 'Electricity':'EB Connection', 'Road':'Motorable', 'Survey No':'123/4A', 'Title':'Clear Patta', 'Zone':'Agricultural' },
    nearbyFacilities: [
      { name:'PSG College', distance:'2.5 km', type:'school', time:'7 min' },
      { name:'Kovai Medical', distance:'1.8 km', type:'hospital', time:'5 min' },
      { name:'Brookefields Mall', distance:'3.2 km', type:'shopping', time:'9 min' },
    ],
    coordinates: { lat:11.0204, lng:76.9930 },
    vrRooms: [
      { id:'field', label:'Main Field', emoji:'🌾', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&fit=crop&q=95', hotspots:[{x:40,y:55,label:'Fertile Zone'}] },
      { id:'well', label:'Borewell', emoji:'💧', image:'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=1920&fit=crop&q=95', hotspots:[{x:55,y:45,label:'Water Source'}] },
    ],
  },
  {
    id: 4, title: 'Smart Home Villa', location: 'Peelamedu, Coimbatore',
    price: '₹9.8 Cr', pricePerSqft: '₹23,333/sqft', emi: '₹6.0L/month',
    bedrooms: 5, bathrooms: 5, area: '4,200 sq ft', plotArea: '5,800 sq ft',
    floors: 'G+2', age: '2 Years', possession: 'Ready to Move', walkScore: 96,
    facing: 'North', vastu: true, parking: '4 Cars',
    tag: 'Ready to Move', tagColor: '#7C4DFF', type: 'Villa', status: 'For Sale', featured: false,
    accentColor: '#7C4DFF',
    videoUrl: VIDEOS.villa,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&fit=crop&q=90',
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&fit=crop&q=90',
    ],
    amenities: ['Smart Automation','Solar Panels','Garden','Gym','Home Office','EV Charging','CCTV','Generator Backup'],
    highlights: ['RERA Approved','Bank Loan Available','Smart Home Ready','Green Building'],
    description: 'Future-ready smart home villa with integrated KNX automation system, 15kW solar installation, and eco-friendly features. The pinnacle of modern intelligent living in Coimbatore.',
    whyBuy: ['Airport road connectivity — 8km to CBE airport','15kW solar: electricity bill nearly zero','KNX automation: control everything from your phone','Rare north-facing vastu-perfect configuration'],
    specifications: { Automation:'KNX System', Solar:'15kW Installed', Flooring:'Engineered Wood', Facade:'Stone Cladding', Windows:'Triple Glazed', Security:'Biometric+CCTV' },
    nearbyFacilities: [
      { name:'Airport', distance:'8.0 km', type:'transport', time:'15 min' },
      { name:'GKNM Hospital', distance:'2.0 km', type:'hospital', time:'6 min' },
      { name:'Fun Mall', distance:'1.5 km', type:'shopping', time:'5 min' },
    ],
    coordinates: { lat:11.0255, lng:77.0151 },
    vrRooms: [
      { id:'facade', label:'Facade', emoji:'🏠', image:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&fit=crop&q=95', hotspots:[{x:50,y:55,label:'Smart Entry'}] },
      { id:'lounge', label:'Lounge', emoji:'🛋️', image:'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&fit=crop&q=95', hotspots:[{x:40,y:50,label:'Automation Hub'}] },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   ANIMATED BG GRID
══════════════════════════════════════════════════════════════ */
const AnimatedGrid = ({ fixed = false }: { fixed?: boolean }) => {
  const ref   = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const fr    = useRef(0);
  const blips = useRef<Blip[]>([]);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    let raf: number, W: number, H: number;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; });
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
  return (
    <canvas
      ref={ref}
      style={{ position: fixed ? 'fixed' : 'absolute', inset:0, zIndex:0, pointerEvents:'none' }}
    />
  );
};

/* ══════════════════════════════════════════════════════════════
   SIDE PANEL SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */
const FloatChip = ({ children, delay=0, style={} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => (
  <div style={{
    padding:'15px 20px', background:'rgba(2,7,18,0.96)', backdropFilter:'blur(20px)',
    border:'1px solid rgba(212,175,55,0.22)', borderRadius:14, textAlign:'center',
    animation:'floatDrift 4.5s ease-in-out infinite', animationDelay:`${delay}s`,
    boxShadow:'0 10px 36px rgba(0,0,0,0.58)', minWidth:132, ...style,
  }}>{children}</div>
);

const chipNum: React.CSSProperties = { fontFamily:"'Orbitron',sans-serif", fontSize:22, fontWeight:800, color:'#D4AF37', lineHeight:1, marginBottom:5 };
const chipLbl: React.CSSProperties = { fontFamily:"'Lato',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(199,209,219,0.5)' };
const vLine = (op=0.25): React.CSSProperties => ({ width:1, height:36, background:`rgba(212,175,55,${op})` });
const orbDot = (d=0): React.CSSProperties => ({ width:5, height:5, borderRadius:'50%', background:'#D4AF37', boxShadow:'0 0 10px rgba(212,175,55,0.8)', animation:'orbPulse 2s ease-in-out infinite', animationDelay:`${d}s` });

const Diamond = ({ d=0 }: { d?: number }) => (
  <div style={{ position:'relative', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div style={{ position:'absolute', inset:0, border:'1px solid rgba(212,175,55,0.45)', transform:'rotate(45deg)', animation:'spinDiamond 8s linear infinite', animationDelay:`${d}s` }}/>
    <div style={{ width:7, height:7, background:'#D4AF37', transform:'rotate(45deg)', boxShadow:'0 0 12px rgba(212,175,55,0.9)' }}/>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   HERO HEADER
══════════════════════════════════════════════════════════════ */
interface HeroHeaderProps {
  visible: boolean;
  search: string;
  setSearch: (v: string) => void;
  selType: string;
  setSelType: (v: string) => void;
  filtered: Property[];
}

const HeroHeader = ({ visible, search, setSearch, selType, setSelType, filtered }: HeroHeaderProps) => {
  const types = ['All','Villa','Plot','Land'];
  const fadeUp = (delay=0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(36px)',
    transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay*110}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay*110}ms`,
  });

  return (
    <header style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#030A16' }}>

      <div style={{ position:'absolute', top:'-12%', left:'-8%', width:650, height:650, borderRadius:'50%', background:'radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%)', filter:'blur(70px)', animation:'driftA 28s ease-in-out infinite', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'absolute', bottom:'-12%', right:'-8%', width:580, height:580, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,201,122,0.04) 0%,transparent 62%)', filter:'blur(90px)', animation:'driftB 34s ease-in-out infinite 3s', pointerEvents:'none', zIndex:0 }}/>

      <AnimatedGrid fixed={false} />

      {/* ── LEFT SIDE PANEL ── */}
      <div className="side-panel" style={{ left:0, opacity:visible?1:0, transform:visible?'translateX(0)':'translateX(-52px)', transition:'opacity 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s' }}>
        <div style={{ width:1, height:60, background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.35))' }}/>
        <FloatChip delay={0.3}><div style={chipNum}>60</div><div style={chipLbl}>Plots Listed</div></FloatChip>
        <div style={vLine()}/><div style={orbDot(0)}/><div style={vLine()}/>
        <FloatChip delay={0.8}><div style={chipNum}>4+</div><div style={chipLbl}>Properties</div></FloatChip>
        <div style={vLine()}/><Diamond d={0}/><div style={vLine()}/>
        <div style={{ padding:'8px 18px', border:'1px solid rgba(212,175,55,0.28)', borderRadius:100, animation:'floatDrift 5.5s ease-in-out infinite 1.2s' }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:'#D4AF37' }}>RERA APPROVED</span>
        </div>
        <div style={vLine()}/>
        <FloatChip delay={1.3}><div style={chipNum}>3</div><div style={chipLbl}>Locations</div></FloatChip>
        <div style={{ width:1, height:60, background:'linear-gradient(180deg,rgba(212,175,55,0.35),transparent)' }}/>
        <div style={{ position:'absolute', top:'6%', left:12, width:18, height:18, borderLeft:'1.5px solid rgba(212,175,55,0.35)', borderTop:'1.5px solid rgba(212,175,55,0.35)', animation:'glowBlink 3s ease-in-out infinite' }}/>
        <div style={{ position:'absolute', bottom:'6%', left:12, width:18, height:18, borderLeft:'1.5px solid rgba(212,175,55,0.35)', borderBottom:'1.5px solid rgba(212,175,55,0.35)', animation:'glowBlink 3s ease-in-out infinite 1s' }}/>
        <div style={{ position:'absolute', bottom:'14%', left:10, transform:'rotate(-90deg)', transformOrigin:'center', fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.3em', color:'rgba(212,175,55,0.3)', whiteSpace:'nowrap' }}>COIMBATORE · LUXURY REALTY</div>
      </div>

      {/* ── RIGHT SIDE PANEL ── */}
      <div className="side-panel" style={{ right:0, opacity:visible?1:0, transform:visible?'translateX(0)':'translateX(52px)', transition:'opacity 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s' }}>
        <div style={{ width:1, height:60, background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.35))' }}/>
        <div style={{ width:130, height:88, borderRadius:12, overflow:'hidden', border:'1px solid rgba(212,175,55,0.25)', animation:'floatDrift 4s ease-in-out infinite 0.5s', flexShrink:0, position:'relative' }}>
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&q=80" alt="Villa" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.5) saturate(0.7)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 30%,rgba(4,10,20,0.9) 100%)' }}/>
          <div style={{ position:'absolute', bottom:7, left:9 }}>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.14em', color:'#D4AF37', textTransform:'uppercase' }}>Premium</span>
          </div>
        </div>
        <div style={vLine()}/><div style={orbDot(0.5)}/><div style={vLine()}/>
        <FloatChip delay={0.5}><div style={chipNum}>VR</div><div style={chipLbl}>360° Tours</div></FloatChip>
        <div style={vLine()}/><Diamond d={2}/><div style={vLine()}/>
        <FloatChip delay={1.0}><div style={{ ...chipNum, fontSize:19 }}>₹2.5Cr+</div><div style={chipLbl}>Starting Price</div></FloatChip>
        <div style={{ width:1, height:60, background:'linear-gradient(180deg,rgba(212,175,55,0.35),transparent)' }}/>
        <div style={{ position:'absolute', top:'6%', right:12, width:18, height:18, borderRight:'1.5px solid rgba(212,175,55,0.35)', borderTop:'1.5px solid rgba(212,175,55,0.35)', animation:'glowBlink 3s ease-in-out infinite 0.5s' }}/>
        <div style={{ position:'absolute', bottom:'6%', right:12, width:18, height:18, borderRight:'1.5px solid rgba(212,175,55,0.35)', borderBottom:'1.5px solid rgba(212,175,55,0.35)', animation:'glowBlink 3s ease-in-out infinite 1.5s' }}/>
        <div style={{ position:'absolute', bottom:'14%', right:10, transform:'rotate(90deg)', transformOrigin:'center', fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.3em', color:'rgba(212,175,55,0.3)', whiteSpace:'nowrap' }}>BIGWAY · REAL · ESTATE</div>
      </div>

      {/* ── HERO CENTER ── */}
      <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'100px 24px 80px', maxWidth:860, margin:'0 auto', width:'100%', ...fadeUp(0) }}>

        <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:28, padding:'11px 28px', borderRadius:10, background:'rgba(2,7,18,0.88)', backdropFilter:'blur(28px)', border:'1px solid rgba(212,175,55,0.32)', boxShadow:'0 0 55px rgba(212,175,55,0.15)' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#D4AF37', animation:'pulseDot 2.4s ease-out infinite' }}/>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, fontWeight:700, letterSpacing:'0.26em', textTransform:'uppercase', color:'#D4AF37' }}>BIGWAY REAL ESTATE · COIMBATORE</span>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#D4AF37', animation:'pulseDot 2.4s ease-out infinite 0.7s' }}/>
        </div>

        <h1 style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(2.8rem,6.5vw,5.2rem)', lineHeight:1.04, color:'#fff', margin:'0 0 4px', letterSpacing:'-0.03em' }}>
          Premium
        </h1>
        <span style={{ display:'block', fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(2.8rem,6.5vw,5.2rem)', lineHeight:1.04, margin:'0 0 10px', background:'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 8s linear infinite', letterSpacing:'-0.03em' }}>
          Properties
        </span>

        <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:'clamp(1rem,1.7vw,1.18rem)', lineHeight:2.0, color:'rgba(199,209,219,0.68)', maxWidth:520, margin:'0 auto 28px', fontWeight:400, letterSpacing:'0.01em' }}>
          Video Tours · 360° VR Walkthroughs · 60-Plot Site Map.<br/>
          Discover luxury villas, premium plots & agricultural land.
        </p>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:28 }}>
          <div style={{ height:1, width:90, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)' }}/>
          <div style={{ width:7, height:7, background:'#D4AF37', transform:'rotate(45deg)', boxShadow:'0 0 14px rgba(212,175,55,0.85)', animation:'gemGlow 3.8s ease-in-out infinite' }}/>
          <div style={{ height:1, width:90, background:'linear-gradient(270deg,transparent,rgba(212,175,55,0.5),transparent)' }}/>
        </div>

        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:32, ...fadeUp(2) }}>
          {([['▶','Video Tour'],['🥽','VR 360°'],['🗺️','60-Plot Map'],['💡','Why Buy'],['📐','Walk Score'],['📞','Live Support']] as [string, string][]).map(([icon,label])=>(
            <div key={label} className="feat-pill" style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 15px', borderRadius:10, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.2)' }}>
              <span style={{ fontSize:13 }}>{icon}</span>
              <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, color:'rgba(212,175,55,0.8)', letterSpacing:'0.07em' }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ maxWidth:520, margin:'0 auto 18px', position:'relative', ...fadeUp(3) }}>
          <div style={{ position:'absolute', inset:-1, borderRadius:100, background:'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37)', opacity:0.25, filter:'blur(12px)', zIndex:-1 }}/>
          <input
            className="prop-search"
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search by location, type, price…"
            style={{ width:'100%', padding:'14px 52px 14px 24px', borderRadius:100, border:'1.5px solid rgba(212,175,55,0.3)', background:'rgba(2,7,18,0.92)', color:'#fff', fontFamily:"'Poppins',sans-serif", fontSize:14, backdropFilter:'blur(20px)', outline:'none' }}
          />
          <div style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', color:'rgba(212,175,55,0.55)', pointerEvents:'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:17, height:17 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
        </div>

        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:22, ...fadeUp(4) }}>
          {types.map(t=>(
            <button key={t} className="type-btn" onClick={()=>setSelType(t)} style={{ padding:'9px 24px', borderRadius:100, cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'0.07em', background:selType===t?'linear-gradient(135deg,#D4AF37,#F5C97A)':'rgba(7,16,32,0.9)', color:selType===t?'#040C1A':'rgba(212,175,55,0.65)', boxShadow:selType===t?'0 6px 28px rgba(212,175,55,0.45)':'none', border:selType===t?'none':'1px solid rgba(212,175,55,0.18)', transform:selType===t?'scale(1.06)':'scale(1)', transition:'all 0.28s cubic-bezier(0.22,1,0.36,1)' }}>{t}</button>
          ))}
        </div>

        <div style={{ display:'flex', gap:0, justifyContent:'center', marginBottom:0, ...fadeUp(5) }}>
          {([{n:'4',l:'Properties'},{n:'60',l:'Plots'},{n:'3',l:'Locations'},{n:'₹2.5Cr',l:'From'}] as {n:string;l:string}[]).map((s,i,arr)=>(
            <div key={s.l} style={{ textAlign:'center', padding:'14px 28px', background:'rgba(4,10,22,0.82)', backdropFilter:'blur(16px)', border:'1px solid rgba(212,175,55,0.18)', borderRadius:i===0?'14px 0 0 14px':i===arr.length-1?'0 14px 14px 0':'0', borderRight:i!==arr.length-1?'none':'1px solid rgba(212,175,55,0.18)' }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:900, color:'#D4AF37', lineHeight:1, marginBottom:5 }}>{s.n}</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:'rgba(212,175,55,0.55)', letterSpacing:'0.1em' }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:14, fontFamily:"'Poppins',sans-serif", fontSize:12, color:'rgba(199,209,219,0.38)', ...fadeUp(6) }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:800, color:'#D4AF37' }}>{filtered.length}</span> properties found — scroll to explore
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:140, background:'linear-gradient(to bottom, transparent, #030A16)', zIndex:5, pointerEvents:'none' }}/>
    </header>
  );
};

/* ══════════════════════════════════════════════════════════════
   WALK SCORE RING
══════════════════════════════════════════════════════════════ */
const WalkScoreRing = ({ score, acc }: { score: number; acc: string }) => {
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      <svg width="60" height="60" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4"/>
        <circle cx="30" cy="30" r={r} fill="none" stroke={acc} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:'stroke-dasharray 1.2s ease', filter:`drop-shadow(0 0 4px ${acc})` }}/>
        <text x="30" y="30" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="900" fontFamily="Orbitron, sans-serif" style={{ transform:'rotate(90deg)', transformOrigin:'30px 30px' }}>{score}</text>
      </svg>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, color:`${acc}80`, letterSpacing:'.1em', textAlign:'center' }}>WALK<br/>SCORE</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   VIDEO TOUR MODAL
══════════════════════════════════════════════════════════════ */
const VideoTourModal = ({ property, onClose }: { property: Property; onClose: () => void }) => {
  const acc = property.accentColor || '#D4AF37';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.97)', backdropFilter:'blur(16px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={onClose}>
      <div style={{ width:'100%', maxWidth:980, borderRadius:20, overflow:'hidden', border:`2px solid ${acc}40`, background:'#030A16', boxShadow:`0 0 80px ${acc}30` }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${acc}20` }}>
          <div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, color:`${acc}70`, letterSpacing:'.2em', marginBottom:2 }}>VIDEO TOUR</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'1.1rem', color:'#fff' }}>{property.title}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ padding:'5px 12px', borderRadius:100, background:`${acc}15`, border:`1px solid ${acc}40`, fontFamily:"'Orbitron',sans-serif", fontSize:8, color:acc }}>📍 {property.location}</div>
            <button onClick={onClose} style={{ width:38, height:38, borderRadius:10, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', color:'#f87171', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
        </div>
        <div style={{ position:'relative', background:'#000', aspectRatio:'16/9' }}>
          <video ref={videoRef} src={property.videoUrl} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loop playsInline onClick={togglePlay}/>
          {!playing && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.45)', cursor:'pointer' }} onClick={togglePlay}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${acc},${acc}cc)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 50px ${acc}60` }}>
                <span style={{ fontSize:28, marginLeft:4 }}>▶</span>
              </div>
            </div>
          )}
          {playing && (
            <div style={{ position:'absolute', top:14, right:14, cursor:'pointer' }} onClick={togglePlay}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:`1px solid ${acc}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⏸</div>
            </div>
          )}
          <div style={{ position:'absolute', bottom:16, left:16, padding:'8px 16px', borderRadius:10, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', border:`1px solid ${acc}40` }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, color:`${acc}80`, letterSpacing:'.15em' }}>PROPERTY TOUR</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:900, color:'#fff' }}>{property.price}</div>
          </div>
        </div>
        <div style={{ padding:'16px 24px 20px', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          <button style={{ flex:1, padding:'12px 20px', borderRadius:11, background:`linear-gradient(135deg,${acc},${acc}cc)`, color:'#030A16', border:'none', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'.08em' }}>📅 SCHEDULE SITE VISIT</button>
          <button style={{ flex:1, padding:'12px 20px', borderRadius:11, background:'transparent', border:`1.5px solid ${acc}40`, color:acc, cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:10 }}>📞 CALL AGENT NOW</button>
          <button onClick={onClose} style={{ padding:'12px 20px', borderRadius:11, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontSize:10 }}>CLOSE</button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PROPERTY CARD
══════════════════════════════════════════════════════════════ */
interface PropertyCardProps {
  p: Property;
  onVR: () => void;
  onDetail: () => void;
  onVideoTour: () => void;
}

const PropertyCard = ({ p, onVR, onDetail, onVideoTour }: PropertyCardProps) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tab, setTab] = useState('overview');
  const [showVideoHover, setShowVideoHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const acc = p.accentColor;
  const facilityEmoji: Record<string, string> = { school:'🎓', hospital:'🏥', shopping:'🛍️', transport:'🚌', park:'🌳' };

  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) { videoRef.current.play().catch(()=>{}); }
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [hovered]);

  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>{ setHovered(false); setShowVideoHover(false); }}
      style={{ borderRadius:22, overflow:'hidden', background:'rgba(4,10,22,0.97)', border:`1.5px solid ${hovered?acc+'60':'rgba(255,255,255,0.07)'}`, transition:'all .35s cubic-bezier(0.22,1,0.36,1)', transform:hovered?'translateY(-6px)':'none', boxShadow:hovered?`0 28px 70px rgba(0,0,0,0.75), 0 0 0 1px ${acc}30`:'0 12px 40px rgba(0,0,0,0.5)' }}>

      <div style={{ position:'relative', height:240, overflow:'hidden' }}>
        <img src={p.images[imgIdx]} alt={p.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'opacity .5s, transform .5s', opacity:hovered&&showVideoHover?0:1, transform:hovered?'scale(1.04)':'scale(1)', filter:'brightness(0.72)' }}/>
        <video ref={videoRef} src={p.videoUrl} muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:hovered&&showVideoHover?1:0, transition:'opacity .6s' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 45%, rgba(4,10,22,1) 100%)', zIndex:2 }}/>

        <button onMouseEnter={()=>setShowVideoHover(true)} onMouseLeave={()=>setShowVideoHover(false)} onClick={()=>onVideoTour()} style={{ position:'absolute', top:12, left:12, zIndex:10, padding:'5px 11px', borderRadius:8, background:showVideoHover?`${acc}cc`:'rgba(0,0,0,0.75)', border:`1px solid ${acc}60`, fontFamily:"'Orbitron',sans-serif", fontSize:7.5, fontWeight:700, color:showVideoHover?'#030A16':acc, cursor:'pointer', display:'flex', alignItems:'center', gap:4, transition:'all .2s', backdropFilter:'blur(8px)' }}>
          <span>▶</span> VIDEO TOUR
        </button>

        <div style={{ position:'absolute', top:12, right:12, zIndex:10, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
          {p.featured&&<span style={{ padding:'4px 10px', borderRadius:100, background:`linear-gradient(135deg,${acc},${acc}aa)`, color:'#040C1A', fontFamily:"'Orbitron',sans-serif", fontSize:7.5, fontWeight:800, letterSpacing:'.08em' }}>⭐ FEATURED</span>}
          {p.tag&&<span style={{ padding:'4px 10px', borderRadius:100, background:`${p.tagColor}25`, border:`1px solid ${p.tagColor}60`, color:p.tagColor, fontFamily:"'Orbitron',sans-serif", fontSize:7.5, fontWeight:700 }}>{p.tag}</span>}
        </div>

        {p.images.length > 1 && (
          <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4, zIndex:5 }}>
            {p.images.map((_: string, i: number)=>(
              <button key={i} onClick={()=>setImgIdx(i)} style={{ width:i===imgIdx?16:5, height:5, borderRadius:3, border:'none', cursor:'pointer', background:i===imgIdx?acc:`${acc}40`, transition:'all .3s', padding:0 }}/>
            ))}
          </div>
        )}

        {p.images.length > 1 && <>
          <button onClick={()=>setImgIdx(i=>i===0?p.images.length-1:i-1)} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.65)', border:`1px solid ${acc}30`, color:acc, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, zIndex:5 }}>‹</button>
          <button onClick={()=>setImgIdx(i=>(i+1)%p.images.length)} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.65)', border:`1px solid ${acc}30`, color:acc, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, zIndex:5 }}>›</button>
        </>}

        <button onClick={()=>onVR()} style={{ position:'absolute', bottom:10, right:12, padding:'5px 10px', borderRadius:8, background:'rgba(0,0,0,0.82)', border:`1px solid ${acc}50`, fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, color:acc, cursor:'pointer', zIndex:5 }}>🥽 VR</button>
      </div>

      <div style={{ padding:'18px 20px 0' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:12 }}>
          <div style={{ flex:1 }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(1rem,1.6vw,1.12rem)', color:'#fff', margin:'0 0 5px', lineHeight:1.2 }}>{p.title}</h3>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, color:`${acc}80`, display:'flex', alignItems:'center', gap:4 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:10, height:10 }}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              {p.location}
            </div>
          </div>
          {p.walkScore && <WalkScoreRing score={p.walkScore} acc={acc}/>}
        </div>

        <div style={{ padding:'14px 16px', borderRadius:14, background:`linear-gradient(135deg,${acc}14,${acc}07)`, border:`1px solid ${acc}28`, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(1.1rem,1.8vw,1.28rem)', fontWeight:900, color:acc }}>{p.price}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10.5, color:`${acc}60`, marginTop:2 }}>{p.pricePerSqft}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'rgba(255,255,255,0.45)' }}>EMI from</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, fontWeight:800, color:'#fff' }}>{p.emi}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:'rgba(255,255,255,0.3)', marginTop:1 }}>20yr · 8.5% p.a.</div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
          {[p.area.split(' ')[0]+' sqft',...(p.bedrooms?[`${p.bedrooms} BHK`]:[]),p.facing+' Facing',p.possession,p.vastu?'✓ Vastu':'',p.floors!=='N/A'?p.floors:''].filter(Boolean).map((s,i)=>(
            <span key={i} style={{ padding:'4px 10px', borderRadius:7, background:`${acc}0d`, border:`1px solid ${acc}20`, fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:`${acc}cc` }}>{s}</span>
          ))}
        </div>

        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
          {p.highlights?.map((h: string, i: number)=>(
            <span key={i} style={{ padding:'3px 9px', borderRadius:6, background:`${acc}10`, border:`1px solid ${acc}22`, fontFamily:"'Orbitron',sans-serif", fontSize:7, color:`${acc}aa` }}>✓ {h}</span>
          ))}
        </div>

        <div style={{ display:'flex', gap:0, borderBottom:`1px solid ${acc}14`, marginBottom:0, overflowX:'auto' }} className="bw__ns">
          {([['overview','📖','Overview'],['whybuy','💡','Why Buy'],['specs','🔧','Specs'],['location','📍','Nearby'],...(p.hasPlotSite?[['plots','🗺️','Plots']]:[])]).map(([id,icon,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1, minWidth:56, padding:'8px 4px', borderRadius:'8px 8px 0 0', border:'none', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:7.5, letterSpacing:'.03em', background:tab===id?`${acc}20`:'transparent', color:tab===id?acc:'rgba(255,255,255,0.3)', borderBottom:tab===id?`2px solid ${acc}`:'2px solid transparent', transition:'all .2s', whiteSpace:'nowrap' }}>{icon} {label}</button>
          ))}
        </div>

        <div style={{ padding:'14px 0 12px', minHeight:120, maxHeight:160, overflowY:'auto' }} className="bw__scroll">
          {tab==='overview' && (
            <div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, lineHeight:1.85, color:'rgba(199,209,219,0.62)', margin:'0 0 12px' }}>{p.description}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {p.amenities.map((a: string, i: number)=><span key={i} style={{ padding:'4px 9px', borderRadius:100, fontSize:10, background:`${acc}0d`, border:`1px solid ${acc}1a`, color:`${acc}bb`, fontFamily:"'DM Sans',sans-serif" }}>✦ {a}</span>)}
              </div>
            </div>
          )}
          {tab==='whybuy' && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, color:`${acc}60`, letterSpacing:'.15em', marginBottom:4 }}>TOP REASONS TO BUY</div>
              {p.whyBuy?.map((reason: string, i: number)=>(
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', borderRadius:10, background:`${acc}08`, border:`1px solid ${acc}18` }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:`linear-gradient(135deg,${acc},${acc}aa)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:"'Orbitron',sans-serif", fontSize:9, fontWeight:900, color:'#030A16' }}>{i+1}</div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, lineHeight:1.6, color:'rgba(220,230,240,0.8)' }}>{reason}</span>
                </div>
              ))}
            </div>
          )}
          {tab==='specs' && (
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {p.specifications && Object.entries(p.specifications).map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 10px', borderRadius:8, background:'rgba(255,255,255,0.03)', border:`1px solid ${acc}08` }}>
                  <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:'rgba(199,209,219,0.38)', letterSpacing:'.08em' }}>{k}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#fff', fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab==='location' && (
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              {p.nearbyFacilities.map((f: NearbyFacility, i: number)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:8, background:'rgba(255,255,255,0.03)', border:`1px solid ${acc}08` }}>
                  <span style={{ fontSize:15 }}>{facilityEmoji[f.type]||'📍'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#fff' }}>{f.name}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9.5, color:'rgba(199,209,219,0.35)' }}>{f.distance} · {f.time}</div>
                  </div>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:`${acc}70` }}>{f.time}</div>
                </div>
              ))}
            </div>
          )}
          {tab==='plots' && p.hasPlotSite && (
            <div style={{ textAlign:'center', padding:'14px 0' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🗺️</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:`${acc}80`, letterSpacing:'.15em', marginBottom:6 }}>60 PLOTS AVAILABLE</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:14, lineHeight:1.7 }}>Individual plot images, VR walkthroughs,<br/>and interactive site roadmap</div>
              <button onClick={()=>onDetail()} style={{ padding:'10px 22px', borderRadius:10, background:`linear-gradient(135deg,${acc},${acc}cc)`, color:'#040C1A', border:'none', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'.1em' }}>🗺️ OPEN SITE MAP</button>
            </div>
          )}
        </div>

        <div style={{ padding:'0 0 18px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:7 }}>
          <button onClick={()=>onVR()} style={{ padding:'11px 6px', borderRadius:11, background:`linear-gradient(135deg,${acc},${acc}cc)`, color:'#040C1A', border:'none', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:8.5, letterSpacing:'.06em', boxShadow:`0 0 20px ${acc}30` }}>🥽 VR</button>
          <button onClick={()=>onVideoTour()} style={{ padding:'11px 6px', borderRadius:11, background:'rgba(255,255,255,0.06)', border:`1.5px solid ${acc}38`, color:acc, cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:8.5, letterSpacing:'.06em' }}>▶ VIDEO</button>
          {p.hasPlotSite
            ? <button onClick={()=>onDetail()} style={{ padding:'11px 6px', borderRadius:11, background:'rgba(255,255,255,0.04)', border:`1.5px solid rgba(255,255,255,0.12)`, color:'rgba(255,255,255,0.55)', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:600, fontSize:8.5 }}>🗺️ MAP</button>
            : <button style={{ padding:'11px 6px', borderRadius:11, background:'rgba(255,255,255,0.04)', border:`1.5px solid rgba(255,255,255,0.12)`, color:'rgba(255,255,255,0.55)', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:600, fontSize:8.5 }}>📞 CALL</button>
          }
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PLOT SITE MAP
══════════════════════════════════════════════════════════════ */
const statusColors: Record<string, string> = { available:'#22C55E', sold:'#EF4444', reserved:'#F59E0B' };

interface PlotSiteMapProps {
  onPlotSelect: (plot: Plot) => void;
  selectedPlot: Plot | null;
}

const PlotSiteMap = ({ onPlotSelect, selectedPlot }: PlotSiteMapProps) => {
  const available = ALL_PLOTS.filter(p=>p.status==='available').length;
  const sold = ALL_PLOTS.filter(p=>p.status==='sold').length;
  const reserved = ALL_PLOTS.filter(p=>p.status==='reserved').length;

  return (
    <div style={{ background:'rgba(4,10,20,0.97)', borderRadius:18, border:'1.5px solid rgba(212,175,55,0.2)', overflow:'hidden' }}>
      <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(212,175,55,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'.22em', color:'rgba(212,175,55,0.6)', marginBottom:4 }}>BIGWAY REALTY · SITE PLAN</div>
          <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'1.3rem', color:'#fff', margin:0 }}>Premium Residential Plots — 60 Units</h3>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          {([['#22C55E','Available',available],['#EF4444','Sold',sold],['#F59E0B','Reserved',reserved]] as [string,string,number][]).map(([c,l,n])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:900, color:c }}>{n}</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, color:`${c}80`, letterSpacing:'.1em' }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'20px 20px 10px', overflowX:'auto' }}>
        <div style={{ minWidth:780, position:'relative' }}>
          <div style={{ position:'absolute', top:8, right:8, zIndex:10, width:48, height:48, background:'rgba(4,10,20,0.9)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:900, color:'#D4AF37' }}>N</div>
            <div style={{ fontSize:16 }}>🧭</div>
          </div>
          <svg viewBox="0 0 100 100" style={{ width:'100%', height:'auto', aspectRatio:'2/1', display:'block' }} preserveAspectRatio="xMidYMid meet">
            <rect width="100" height="100" fill="#050d1a" rx="2"/>
            <rect x="2" y="2" width="96" height="96" fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="0.4" strokeDasharray="1.5,0.8" rx="1.5"/>
            <rect x="0" y="90" width="100" height="10" fill="#1a2a1a" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2"/>
            <text x="50" y="96" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="1.8" fontFamily="sans-serif">MAIN ENTRANCE ROAD (40ft)</text>
            <rect x="0" y="0" width="100" height="5.5" fill="#1a2a1a" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2"/>
            <text x="50" y="3.8" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="1.8" fontFamily="sans-serif">NORTH BOUNDARY ROAD (30ft)</text>
            <rect x="43.5" y="5" width="4.5" height="85" fill="#162416" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15"/>
            <line x1="45.75" y1="5" x2="45.75" y2="90" stroke="rgba(255,220,0,0.18)" strokeWidth="0.25" strokeDasharray="1.2,0.8"/>
            <rect x="2" y="46" width="96" height="5" fill="#162416" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15"/>
            <line x1="2" y1="48.5" x2="98" y2="48.5" stroke="rgba(255,220,0,0.18)" strokeWidth="0.25" strokeDasharray="1.2,0.8"/>
            {ALL_PLOTS.map((plot) => {
              let px = plot.x, py = plot.y;
              const pw = plot.w, ph = plot.h;
              if (plot.col >= 5) px = plot.x + 4;
              if (plot.row >= 3) py = plot.y + 4.5;
              const isSelected = selectedPlot?.id === plot.id;
              const col = statusColors[plot.status];
              return (
                <g key={plot.id} style={{ cursor:'pointer' }} onClick={()=>onPlotSelect(plot)}>
                  <rect x={px} y={py} width={pw} height={ph} fill={isSelected?`${col}45`:`${col}18`} stroke={isSelected?col:`${col}70`} strokeWidth={isSelected?0.6:0.35} rx="0.4"/>
                  <text x={px+pw/2} y={py+ph/2-1.2} textAnchor="middle" fill="#fff" fontSize="2.2" fontFamily="'Orbitron',sans-serif" fontWeight="bold">{plot.number}</text>
                  <text x={px+pw/2} y={py+ph/2+0.8} textAnchor="middle" fill={`${col}cc`} fontSize="1.5" fontFamily="sans-serif">{plot.area.replace(' sqft','')}</text>
                  <text x={px+pw/2} y={py+ph/2+2.5} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="1.4" fontFamily="sans-serif">{plot.price}</text>
                  <text x={px+pw-0.8} y={py+1.8} textAnchor="end" fill={`${col}90`} fontSize="1.3" fontFamily="sans-serif">{plot.direction.charAt(0)}</text>
                </g>
              );
            })}
            <text x="4" y="3.5" fill="rgba(212,175,55,0.6)" fontSize="1.6" fontFamily="'Orbitron',sans-serif" fontWeight="bold">N ↑</text>
            <text x="96" y="3.5" textAnchor="end" fill="rgba(212,175,55,0.4)" fontSize="1.5" fontFamily="sans-serif">BIGWAY REALTY</text>
          </svg>
          <div style={{ display:'flex', gap:16, padding:'12px 4px 4px', justifyContent:'center', flexWrap:'wrap' }}>
            {([['#22C55E','Available — Click to View'],['#EF4444','Sold'],['#F59E0B','Reserved']] as [string,string][]).map(([c,l])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:c, border:`1px solid ${c}` }}/>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'.08em' }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', paddingBottom:8 }}>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, color:'rgba(212,175,55,0.4)', letterSpacing:'.12em' }}>CLICK ANY PLOT FOR DETAILS & VR VIEW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   VR VIEWER
══════════════════════════════════════════════════════════════ */
interface VRViewerProps {
  property: Property;
  plotOverride: Plot | null;
  onClose: () => void;
}

const VRViewer = ({ property, plotOverride, onClose }: VRViewerProps) => {
  const p = property;
  const acc = p?.accentColor || '#D4AF37';
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRoom, setActiveRoom] = useState(0);
  const [mode, setMode] = useState('vr');
  const [imgIdx, setImgIdx] = useState(0);
  const [entering, setEntering] = useState(true);
  const [showHotspot, setShowHotspot] = useState<string | null>(null);
  const [vrScan, setVrScan] = useState(false);
  const [zoom, setZoom] = useState(false);
  const mouse = useRef({ x:0.5, y:0.5 });
  const smoothMouse = useRef({ x:0.5, y:0.5 });
  const rafRef = useRef<number>(0);
  const [parallax, setParallax] = useState({ x:0, y:0 });
  const [dragging, setDragging] = useState(false);
  const [scanY, setScanY] = useState(0);
  const scanRef = useRef(0);

  const rooms: VRRoom[] = plotOverride
    ? [{ id:'plot', label:`Plot #${plotOverride.number}`, emoji:'📍', image:plotOverride.image, hotspots:[{x:40,y:55,label:'Plot Area'},{x:70,y:45,label:'Road Access'}] }]
    : (p?.vrRooms || []);
  const currentRoom = rooms[activeRoom];

  useEffect(() => { const t = setTimeout(()=>setEntering(false),700); return ()=>clearTimeout(t); }, []);
  useEffect(() => {
    const loop = () => {
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x)*0.04;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y)*0.04;
      setParallax({ x:(smoothMouse.current.x-0.5)*24, y:(smoothMouse.current.y-0.5)*14 });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);
  useEffect(() => {
    const iv = setInterval(() => { scanRef.current=(scanRef.current+1)%100; setScanY(scanRef.current); },18);
    return ()=>clearInterval(iv);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect(); if (!r) return;
    mouse.current = { x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height };
  }, []);

  const changeRoom = (i: number) => { setEntering(true); setActiveRoom(i); setShowHotspot(null); setTimeout(()=>setEntering(false),500); };
  const bgImage = mode==='gallery' ? (p?.images[imgIdx]||'') : currentRoom?.image || p?.image || '';
  const tabs = [{ id:'vr', icon:'🥽', label:'360° VR' },...(p?.images?.length?[{ id:'gallery', icon:'📸', label:'Gallery' }]:[]),{ id:'specs', icon:'📋', label:'Details' }];

  return (
    <div ref={containerRef} style={{ position:'fixed', inset:0, zIndex:1000, background:'#000', cursor:dragging?'grabbing':'grab', userSelect:'none', overflow:'hidden' }}
      onMouseMove={onMouseMove} onMouseDown={()=>setDragging(true)} onMouseUp={()=>setDragging(false)} onMouseLeave={()=>setDragging(false)}>
      <style>{`
        @keyframes vr__pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.6}}
        @keyframes vr__ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes vr__fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes vr__hudSlide{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}
        @keyframes vr__glow{0%,100%{box-shadow:0 0 16px rgba(212,175,55,0.3)}50%{box-shadow:0 0 36px rgba(212,175,55,0.7)}}
        @keyframes vr__hotspot{0%{box-shadow:0 0 0 0 rgba(212,175,55,0.7)}100%{box-shadow:0 0 0 20px rgba(212,175,55,0)}}
        @keyframes vr__ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes vr__flash{0%{opacity:1}100%{opacity:0}}
        @keyframes vr__scan{0%{opacity:0.7}50%{opacity:0.25}100%{opacity:0.7}}
        .vr__btn{transition:all 0.2s;cursor:pointer;border:none;outline:none;}
        .vr__scroll::-webkit-scrollbar{width:3px;} .vr__scroll::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.2);border-radius:2px;}
      `}</style>

      <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:'-5%', backgroundImage:`url(${bgImage})`, backgroundSize:'cover', backgroundPosition:`${50+parallax.x*0.6}% ${50+parallax.y*0.6}%`, transform:`scale(1.08) translateX(${-parallax.x*0.3}px) translateY(${-parallax.y*0.3}px)`, transition:dragging?'none':'transform 0.1s ease-out', filter:entering?'blur(18px) brightness(0.2)':'brightness(0.55) saturate(1.1)', opacity:entering?0:1, willChange:'transform' }}/>
        {vrScan && <><div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)', animation:'vr__scan 3s ease-in-out infinite' }}/><div style={{ position:'absolute', left:0, right:0, height:2, top:`${scanY}%`, background:`linear-gradient(90deg,transparent,${acc}60,rgba(255,255,255,0.3),${acc}60,transparent)`, boxShadow:`0 0 10px ${acc}80`, pointerEvents:'none' }}/></>}
        {entering && <div style={{ position:'absolute', inset:0, background:'#fff', animation:'vr__flash 0.5s ease-out both', pointerEvents:'none', zIndex:50 }}/>}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 40%, rgba(0,0,0,0.92) 100%)', pointerEvents:'none' }}/>
      </div>

      {mode==='vr' && !entering && currentRoom?.hotspots?.map((hs: Hotspot, i: number)=>(
        <div key={i} style={{ position:'absolute', left:`${hs.x+parallax.x*0.08}%`, top:`${hs.y+parallax.y*0.08}%`, transform:'translate(-50%,-50%)', zIndex:20, cursor:'pointer', animation:`vr__fadeIn 0.4s ${i*0.15}s ease both` }}
          onClick={e=>{ e.stopPropagation(); setShowHotspot(showHotspot===hs.label?null:hs.label); }}>
          <div style={{ position:'absolute', inset:-14, borderRadius:'50%', border:`1px solid ${acc}40`, animation:'vr__ripple 2.5s ease-out infinite' }}/>
          <div style={{ width:16, height:16, borderRadius:'50%', background:`radial-gradient(circle, #fff 30%, ${acc} 100%)`, boxShadow:`0 0 0 3px ${acc}60, 0 0 18px ${acc}80`, display:'flex', alignItems:'center', justifyContent:'center', animation:'vr__hotspot 2s ease-out infinite' }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:acc }}/>
          </div>
          {showHotspot===hs.label && <div style={{ position:'absolute', bottom:26, left:'50%', transform:'translateX(-50%)', padding:'7px 13px', borderRadius:9, whiteSpace:'nowrap', background:'rgba(4,10,20,0.94)', backdropFilter:'blur(16px)', border:`1px solid ${acc}50`, fontFamily:"'Orbitron',sans-serif", fontSize:9.5, fontWeight:700, color:acc, letterSpacing:'.1em', animation:'vr__fadeIn 0.2s ease both' }}>{hs.label}</div>}
        </div>
      ))}

      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:30, padding:'12px 18px', background:'linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, transparent 100%)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap', animation:'vr__hudSlide 0.5s 0.3s ease both' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button className="vr__btn" onClick={onClose} style={{ width:38, height:38, borderRadius:9, background:'rgba(220,40,40,0.2)', border:'1px solid rgba(220,40,40,0.4)', color:'#f87171', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          <div style={{ width:1, height:24, background:`${acc}30` }}/>
          <div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'.22em', color:`${acc}70`, marginBottom:2 }}>{plotOverride?`PLOT #${plotOverride.number} · SITE VR`:'BIGWAY REALTY · VIRTUAL TOUR'}</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(0.85rem,1.4vw,1.1rem)', color:'#fff' }}>{plotOverride?`Plot #${plotOverride.number} — ${plotOverride.area}`:p?.title}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:3, padding:'3px', borderRadius:12, background:'rgba(4,10,20,0.8)', backdropFilter:'blur(20px)', border:`1px solid ${acc}18` }}>
          {tabs.map(t=>(
            <button key={t.id} className="vr__btn" onClick={()=>{ setMode(t.id); setEntering(true); setTimeout(()=>setEntering(false),400); }} style={{ padding:'6px 12px', borderRadius:9, fontSize:9.5, fontFamily:"'Orbitron',sans-serif", fontWeight:700, letterSpacing:'.04em', background:mode===t.id?`linear-gradient(135deg,${acc},${acc}cc)`:'transparent', color:mode===t.id?'#040C1A':`${acc}55`, border:'none', boxShadow:mode===t.id?`0 4px 16px ${acc}40`:'none' }}>{t.icon} {t.label}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <button className="vr__btn" onClick={()=>setVrScan(v=>!v)} style={{ padding:'6px 12px', borderRadius:9, fontSize:9, fontFamily:"'Orbitron',sans-serif", fontWeight:700, background:vrScan?`${acc}22`:'rgba(255,255,255,0.06)', color:vrScan?acc:'rgba(255,255,255,0.4)', border:`1px solid ${vrScan?acc+'45':'rgba(255,255,255,0.1)'}` }}>🥽 HUD</button>
          <button className="vr__btn" onClick={()=>setZoom(z=>!z)} style={{ width:34, height:34, borderRadius:9, background:zoom?`${acc}22`:'rgba(255,255,255,0.06)', border:`1px solid ${zoom?acc+'45':'rgba(255,255,255,0.1)'}`, color:zoom?acc:'rgba(255,255,255,0.4)', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>🔍</button>
        </div>
      </div>

      <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', zIndex:30, display:'flex', flexDirection:'column', gap:6, animation:'vr__hudSlide 0.5s 0.5s ease both' }}>
        {(plotOverride ? [
          { label:'PLOT', value:`#${plotOverride.number}`, icon:'📍' },
          { label:'AREA', value:plotOverride.area.split(' ')[0], sub:'sq ft', icon:'📐' },
          { label:'FACING', value:plotOverride.direction, icon:'🧭' },
          { label:'PRICE', value:plotOverride.price, icon:'💰' },
          { label:'STATUS', value:plotOverride.status.toUpperCase(), icon:'✅' },
        ] : [
          { label:'PRICE', value:p?.price, icon:'💰' },
          { label:'AREA', value:p?.area?.split(' ')[0], sub:'sq ft', icon:'📐' },
          ...(p?.bedrooms?[{ label:'BED/BATH', value:`${p.bedrooms}/${p.bathrooms}`, icon:'🛏️' }]:[]),
          { label:'FACING', value:p?.facing, icon:'🧭' },
          { label:'STATUS', value:p?.possession, icon:'🏠' },
        ]).map((s,i)=>(
          <div key={i} style={{ padding:'8px 11px', borderRadius:10, minWidth:108, background:'rgba(4,10,20,0.82)', backdropFilter:'blur(20px)', border:`1px solid ${acc}18`, borderLeft:`3px solid ${acc}`, animation:`vr__fadeIn 0.4s ${i*0.08}s ease both` }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:6.5, fontWeight:700, color:`${acc}70`, letterSpacing:'.18em', marginBottom:2 }}>{s.icon} {s.label}</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(0.7rem,1vw,0.88rem)', fontWeight:700, color:'#fff', lineHeight:1 }}>{s.value}</div>
            {'sub' in s && s.sub && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8.5, color:`${acc}50`, marginTop:1 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {mode==='vr' && !entering && (
        <div style={{ position:'absolute', bottom:72, left:'50%', transform:'translateX(-50%)', zIndex:30, display:'flex', gap:7, alignItems:'center', flexWrap:'wrap', justifyContent:'center', maxWidth:'80vw', animation:'vr__fadeIn 0.5s 0.4s ease both' }}>
          {rooms.map((room: VRRoom, i: number)=>(
            <button key={room.id} className="vr__btn" onClick={()=>changeRoom(i)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'8px 14px', borderRadius:12, background:activeRoom===i?`linear-gradient(135deg,${acc}30,${acc}15)`:'rgba(4,10,20,0.75)', backdropFilter:'blur(16px)', border:`1px solid ${activeRoom===i?acc:'rgba(255,255,255,0.1)'}`, boxShadow:activeRoom===i?`0 0 20px ${acc}40`:'none', minWidth:58 }}>
              <span style={{ fontSize:18 }}>{room.emoji}</span>
              <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'.07em', color:activeRoom===i?acc:'rgba(255,255,255,0.4)', textAlign:'center' }}>{room.label.toUpperCase()}</span>
              {activeRoom===i&&<div style={{ width:14, height:2, borderRadius:1, background:acc }}/>}
            </button>
          ))}
        </div>
      )}

      {mode==='gallery' && p?.images && (
        <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:30, padding:'16px 20px 20px', background:'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)', animation:'vr__fadeIn 0.3s ease both' }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, color:`${acc}70`, letterSpacing:'.22em', marginBottom:8 }}>📸 GALLERY · {imgIdx+1}/{p.images.length}</div>
          <div style={{ display:'flex', gap:7, overflowX:'auto' }} className="bw__ns">
            {p.images.map((img: string, i: number)=>(
              <button key={i} onClick={()=>{ setImgIdx(i); setEntering(true); setTimeout(()=>setEntering(false),400); }} style={{ flexShrink:0, width:88, height:56, borderRadius:8, overflow:'hidden', border:`2px solid ${i===imgIdx?acc:'transparent'}`, opacity:i===imgIdx?1:0.38, transition:'all .25s', padding:0 }}>
                <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
              </button>
            ))}
          </div>
          {(['prev','next'] as const).map(dir=>(
            <button key={dir} className="vr__btn" onClick={()=>{ setEntering(true); setImgIdx(i=>dir==='prev'?(i===0?p.images.length-1:i-1):(i+1)%p.images.length); setTimeout(()=>setEntering(false),400); }} style={{ position:'absolute', [dir==='prev'?'left':'right']:60, top:'42%', transform:'translateY(-50%)', width:44, height:44, borderRadius:'50%', background:'rgba(4,10,20,0.78)', backdropFilter:'blur(16px)', border:`1px solid ${acc}40`, color:acc, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>{dir==='prev'?'‹':'›'}</button>
          ))}
        </div>
      )}

      {mode==='specs' && (
        <div style={{ position:'absolute', inset:0, zIndex:25, display:'flex', alignItems:'center', justifyContent:'center', padding:'72px 20px 72px', animation:'vr__fadeIn 0.3s ease both' }}>
          <div style={{ width:'100%', maxWidth:820, maxHeight:'100%', overflowY:'auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="vr__scroll">
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ padding:'20px', borderRadius:16, background:'rgba(4,10,20,0.94)', backdropFilter:'blur(32px)', border:`1.5px solid ${acc}30` }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:`${acc}70`, letterSpacing:'.22em', marginBottom:4 }}>PROPERTY OVERVIEW</div>
                <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(1rem,1.8vw,1.3rem)', color:'#fff', marginBottom:3 }}>{plotOverride?`Plot #${plotOverride.number}`:p?.title}</h3>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, color:`${acc}80`, marginBottom:14 }}>📍 {p?.location}</div>
                <div style={{ padding:'12px 16px', borderRadius:11, background:`linear-gradient(135deg,${acc}18,${acc}08)`, border:`1.5px solid ${acc}35`, marginBottom:14 }}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(1.1rem,2.2vw,1.5rem)', fontWeight:900, color:acc }}>{plotOverride?plotOverride.price:p?.price}</div>
                </div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, lineHeight:1.85, color:'rgba(199,209,219,0.65)' }}>{p?.description}</p>
              </div>
              {p?.highlights && (
                <div style={{ padding:'16px', borderRadius:16, background:'rgba(4,10,20,0.94)', backdropFilter:'blur(32px)', border:`1.5px solid ${acc}25` }}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:`${acc}70`, letterSpacing:'.2em', marginBottom:10 }}>KEY HIGHLIGHTS</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {p.highlights.map((h: string, i: number)=><span key={i} style={{ padding:'5px 12px', borderRadius:100, fontSize:11, background:`${acc}12`, border:`1px solid ${acc}30`, color:acc, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>✓ {h}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {p?.specifications && (
                <div style={{ padding:'16px', borderRadius:16, background:'rgba(4,10,20,0.94)', backdropFilter:'blur(32px)', border:`1.5px solid ${acc}25` }}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:`${acc}70`, letterSpacing:'.2em', marginBottom:10 }}>SPECIFICATIONS</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    {Object.entries(p.specifications).map(([k,v])=>(
                      <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 10px', borderRadius:7, background:'rgba(255,255,255,0.03)', border:`1px solid ${acc}10` }}>
                        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, color:`${acc}55`, letterSpacing:'.1em' }}>{k}</span>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600, color:'#fff' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {p?.amenities && (
                <div style={{ padding:'16px', borderRadius:16, background:'rgba(4,10,20,0.94)', backdropFilter:'blur(32px)', border:`1.5px solid ${acc}25` }}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:`${acc}70`, letterSpacing:'.2em', marginBottom:10 }}>AMENITIES</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {p.amenities.map((a: string, i: number)=><span key={i} style={{ padding:'5px 11px', borderRadius:100, fontSize:11, background:`${acc}10`, border:`1px solid ${acc}22`, color:`${acc}cc`, fontFamily:"'DM Sans',sans-serif" }}>✦ {a}</span>)}
                  </div>
                </div>
              )}
              <div style={{ display:'flex', gap:9 }}>
                <button className="vr__btn" style={{ flex:1, padding:'12px', borderRadius:11, background:`linear-gradient(135deg,${acc},${acc}cc)`, color:'#040C1A', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'.08em', border:'none' }}>📅 SCHEDULE VISIT</button>
                <button className="vr__btn" style={{ flex:1, padding:'12px', borderRadius:11, background:'transparent', border:`1.5px solid ${acc}45`, color:acc, fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:10 }}>📞 CONTACT AGENT</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:30, padding:'8px 20px', background:'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:"'Orbitron',sans-serif", fontSize:8, color:`${acc}55` }}>
          <span>BIGWAY</span><span style={{ color:`${acc}28` }}>›</span><span style={{ color:acc }}>{mode.toUpperCase()}</span>
        </div>
        <div style={{ overflow:'hidden', width:220, height:16 }}>
          <div style={{ display:'flex', gap:18, animation:'vr__ticker 18s linear infinite', whiteSpace:'nowrap' }}>
            {[...(p?.amenities||[]),...(p?.amenities||[])].map((a: string, i: number)=><span key={i} style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, fontWeight:700, color:`${acc}40`, letterSpacing:'.1em' }}>✦ {a.toUpperCase()}</span>)}
          </div>
        </div>
        {plotOverride
          ? <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:`${acc}50` }}>PLOT #{plotOverride.number} · {plotOverride.status.toUpperCase()}</span>
          : <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, color:`${acc}35` }}>{p?.coordinates?.lat.toFixed(4)}°N · {p?.coordinates?.lng.toFixed(4)}°E</span>
        }
      </div>
      {([{top:12,left:12,bT:true,bL:true},{top:12,right:12,bT:true,bR:true},{bottom:12,left:12,bB:true,bL:true},{bottom:12,right:12,bB:true,bR:true}] as {top?:number;bottom?:number;left?:number;right?:number;bT?:boolean;bB?:boolean;bL?:boolean;bR?:boolean}[]).map((c,i)=>(
        <div key={i} style={{ position:'absolute', top:c.top, left:c.left, right:c.right, bottom:c.bottom, width:24, height:24, borderTop:c.bT?`2px solid ${acc}50`:'none', borderBottom:c.bB?`2px solid ${acc}50`:'none', borderLeft:c.bL?`2px solid ${acc}50`:'none', borderRight:c.bR?`2px solid ${acc}50`:'none', zIndex:40, animation:`vr__glow 3s ease-in-out infinite`, animationDelay:`${i*0.4}s`, pointerEvents:'none' }}/>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PLOT SITE DETAIL PAGE
══════════════════════════════════════════════════════════════ */
interface PlotSiteDetailPageProps {
  property: Property;
  onBack: () => void;
  onVR: (prop: Property, plot: Plot) => void;
}

const PlotSiteDetailPage = ({ property, onBack, onVR }: PlotSiteDetailPageProps) => {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDir, setFilterDir] = useState('all');
  const acc = '#22C55E';

  return (
    <div style={{ minHeight:'100vh', background:'#030A16', paddingTop:80 }}>
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, background:'rgba(3,10,22,0.97)', backdropFilter:'blur(28px)', borderBottom:'1px solid rgba(212,175,55,0.15)', padding:'14px 24px', display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={onBack} style={{ padding:'8px 16px', borderRadius:10, background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.3)', color:'#D4AF37', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'.1em' }}>← BACK</button>
        <div style={{ width:1, height:28, background:'rgba(212,175,55,0.2)' }}/>
        <div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:'rgba(212,175,55,0.55)', letterSpacing:'.2em' }}>BIGWAY REALTY · SITE PLAN</div>
          <div style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'1.1rem', color:'#fff' }}>{property.title} — 60 Plots</div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
          {(['all','available','sold','reserved'] as const).map(s=>(
            <button key={s} onClick={()=>setFilterStatus(s)} style={{ padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, background:filterStatus===s?'rgba(212,175,55,0.2)':'transparent', color:filterStatus===s?'#D4AF37':'rgba(255,255,255,0.35)', borderBottom:filterStatus===s?'2px solid #D4AF37':'2px solid transparent' }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'20px 24px 60px', display:'grid', gridTemplateColumns:'1fr 380px', gap:24 }}>
        <div>
          <PlotSiteMap onPlotSelect={setSelectedPlot} selectedPlot={selectedPlot}/>
          <div style={{ marginTop:24, background:'rgba(4,10,20,0.97)', borderRadius:18, border:'1.5px solid rgba(212,175,55,0.2)', padding:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
              <div>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, color:'rgba(212,175,55,0.55)', letterSpacing:'.2em', marginBottom:3 }}>ALL PLOTS · CLICK FOR VR</div>
                <h4 style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'1rem', color:'#fff', margin:0 }}>60 Residential Plots</h4>
              </div>
              <select onChange={e=>setFilterDir(e.target.value)} style={{ padding:'7px 12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(212,175,55,0.2)', color:'rgba(212,175,55,0.8)', fontFamily:"'Orbitron',sans-serif", fontSize:8, outline:'none', cursor:'pointer' }}>
                <option value="all">ALL DIRECTIONS</option>
                <option value="North">NORTH FACING</option>
                <option value="South">SOUTH FACING</option>
              </select>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(10,1fr)', gap:6 }}>
              {ALL_PLOTS.filter(pl=>filterStatus==='all'||pl.status===filterStatus).filter(pl=>filterDir==='all'||pl.direction===filterDir).map(plot=>{
                const col=statusColors[plot.status];
                const isSelected=selectedPlot?.id===plot.id;
                return (
                  <button key={plot.id} onClick={()=>setSelectedPlot(isSelected?null:plot)} style={{ aspectRatio:'1/1', borderRadius:8, border:`2px solid ${isSelected?col:col+'50'}`, background:isSelected?`${col}30`:`${col}12`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1, transition:'all .2s', padding:3, transform:isSelected?'scale(1.12)':'scale(1)', boxShadow:isSelected?`0 0 14px ${col}60`:'none' }}>
                    <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, fontWeight:900, color:'#fff' }}>{plot.number}</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:7, color:col }}>{plot.status==='available'?'✓':plot.status==='sold'?'✗':'~'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ position:'sticky', top:90, height:'fit-content', display:'flex', flexDirection:'column', gap:14 }}>
          {selectedPlot ? (
            <div style={{ borderRadius:16, overflow:'hidden', border:`2px solid ${statusColors[selectedPlot.status]}40`, background:'rgba(4,10,22,0.97)' }}>
              <div style={{ position:'relative', height:200 }}>
                <img src={selectedPlot.image} alt={`Plot ${selectedPlot.number}`} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.7)' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 40%, rgba(4,10,22,1) 100%)' }}/>
                <div style={{ position:'absolute', top:10, left:12, padding:'5px 12px', borderRadius:100, background:`${statusColors[selectedPlot.status]}20`, border:`1px solid ${statusColors[selectedPlot.status]}`, fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, color:statusColors[selectedPlot.status] }}>{selectedPlot.status.toUpperCase()}</div>
                <div style={{ position:'absolute', bottom:10, left:14 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:900, color:'#fff' }}>Plot #{selectedPlot.number}</div>
                </div>
              </div>
              <div style={{ padding:'16px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                  {([['Area',selectedPlot.area],['Facing',selectedPlot.direction],['Price',selectedPlot.price],['Status',selectedPlot.status.toUpperCase()]] as [string,string][]).map(([k,v])=>(
                    <div key={k} style={{ padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, color:'rgba(212,175,55,0.5)', letterSpacing:'.14em', marginBottom:3 }}>{k}</div>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:700, color:'#fff' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {selectedPlot.status==='available' && (
                    <button onClick={()=>onVR(property, selectedPlot)} style={{ flex:2, padding:'11px', borderRadius:10, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', color:'#040C1A', border:'none', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'.1em' }}>🥽 LAUNCH VR</button>
                  )}
                  <button style={{ flex:1, padding:'11px', borderRadius:10, background:'transparent', border:'1.5px solid rgba(212,175,55,0.35)', color:'#D4AF37', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:600, fontSize:9.5 }}>📞 ENQUIRE</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ borderRadius:16, padding:'40px 24px', textAlign:'center', background:'rgba(4,10,22,0.9)', border:'1.5px solid rgba(212,175,55,0.12)' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>👆</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:'rgba(212,175,55,0.5)', letterSpacing:'.15em', lineHeight:2 }}>SELECT A PLOT</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:8 }}>Click any numbered plot to see details and launch VR</div>
            </div>
          )}
          <div style={{ borderRadius:16, padding:'18px', background:'rgba(4,10,22,0.97)', border:'1.5px solid rgba(212,175,55,0.15)' }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:'rgba(212,175,55,0.55)', letterSpacing:'.18em', marginBottom:12 }}>AVAILABILITY SUMMARY</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {([['Total',60,'#D4AF37'],['Available',ALL_PLOTS.filter(u=>u.status==='available').length,'#22C55E'],['Sold',ALL_PLOTS.filter(u=>u.status==='sold').length,'#EF4444'],['Reserved',ALL_PLOTS.filter(u=>u.status==='reserved').length,'#F59E0B']] as [string,number,string][]).map(([l,n,c])=>(
                <div key={l} style={{ padding:'12px 14px', borderRadius:10, background:`${c}0d`, border:`1px solid ${c}28`, textAlign:'center' }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:900, color:c }}>{n}</div>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, color:`${c}80`, letterSpacing:'.1em', marginTop:2 }}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   CONTACT STRIP
══════════════════════════════════════════════════════════════ */
const ContactStrip = () => (
  <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, background:'rgba(3,10,22,0.97)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(212,175,55,0.18)', padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E', animation:'bwPulse 2s ease-out infinite' }}/>
      <div>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7.5, color:'rgba(212,175,55,0.55)', letterSpacing:'.15em' }}>BIGWAY REALTY · LIVE SUPPORT</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.7)' }}>Our agents are online — get instant answers</div>
      </div>
    </div>
    <div style={{ display:'flex', gap:8 }}>
      <button style={{ padding:'9px 20px', borderRadius:10, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', color:'#030A16', border:'none', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:9, letterSpacing:'.08em' }}>📞 CALL NOW</button>
      <button style={{ padding:'9px 20px', borderRadius:10, background:'rgba(34,197,94,0.15)', border:'1.5px solid rgba(34,197,94,0.5)', color:'#22C55E', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:9, letterSpacing:'.08em' }}>💬 WHATSAPP</button>
      <button style={{ padding:'9px 20px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:9 }}>📅 SCHEDULE</button>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function BigwayPropertiesPage() {
  const [search, setSearch]           = useState('');
  const [selType, setSelType]         = useState('All');
  const [visible, setVisible]         = useState(false);
  const [vrState, setVrState]         = useState<VRState | null>(null);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [videoTourProperty, setVideoTourProperty] = useState<Property | null>(null);

  useEffect(() => { const t=setTimeout(()=>setVisible(true),150); return ()=>clearTimeout(t); }, []);

  const filtered = PROPERTIES.filter(p => {
    const mt = selType==='All' || p.type===selType;
    const mq = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return mt && mq;
  });

  const launchVR = (property: Property, plotOverride: Plot | null = null) => setVrState({ property, plotOverride });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&family=Lato:wght@300;400;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:#030A16; overflow-x:hidden; }

        @keyframes driftA      { 0%,100%{transform:translate(0,0)}  50%{transform:translate(22px,-30px)} }
        @keyframes driftB      { 0%,100%{transform:translate(0,0)}  50%{transform:translate(-18px,24px)} }
        @keyframes shimmer     { 0%{background-position:-200%}       100%{background-position:200%} }
        @keyframes bwPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.7)} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0)} }
        @keyframes pulseDot    { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.7)} 60%{box-shadow:0 0 0 9px rgba(212,175,55,0)} }
        @keyframes floatDrift  { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-8px)} }
        @keyframes orbPulse    { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.65);opacity:1} }
        @keyframes spinDiamond { from{transform:rotate(45deg)}       to{transform:rotate(405deg)} }
        @keyframes glowBlink   { 0%,100%{border-color:rgba(212,175,55,0.28)} 50%{border-color:rgba(212,175,55,0.72)} }
        @keyframes gemGlow     { 0%,100%{box-shadow:0 0 10px rgba(212,175,55,0.65)} 50%{box-shadow:0 0 32px rgba(212,175,55,1)} }
        @keyframes fadeUpIn    { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:none} }

        /* Side panels */
        .side-panel {
          position:absolute; top:0; bottom:0; pointer-events:none;
          width:clamp(90px,calc((100% - 820px)/2),230px);
          z-index:5; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:0; padding:0 12px;
        }
        @media(max-width:1100px){ .side-panel{ display:none !important; } }

        /* Feature pills */
        .feat-pill { transition:all 0.25s ease; cursor:default; }
        .feat-pill:hover { background:rgba(212,175,55,0.16)!important; border-color:rgba(212,175,55,0.5)!important; transform:translateY(-2px); }

        /* Search */
        .prop-search::placeholder { color:rgba(255,255,255,0.3); }
        .prop-search:focus { outline:none; border-color:rgba(212,175,55,0.6)!important; box-shadow:0 0 28px rgba(212,175,55,0.2)!important; }

        /* Type buttons */
        .type-btn:hover { transform:translateY(-2px); }

        /* Scrollbars */
        .bw__ns::-webkit-scrollbar { display:none; } .bw__ns { scrollbar-width:none; }
        .bw__scroll::-webkit-scrollbar { width:3px; } .bw__scroll::-webkit-scrollbar-thumb { background:rgba(212,175,55,0.2); border-radius:2px; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(212,175,55,0.2); border-radius:2px; }

        /* Grid */
        .prop__grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        @media(max-width:1100px){ .prop__grid{ grid-template-columns:repeat(2,1fr); gap:18px; } }
        @media(max-width:640px){ .prop__grid{ grid-template-columns:1fr; } }
      `}</style>

      {/* ── MODALS ── */}
      {vrState && <VRViewer property={vrState.property} plotOverride={vrState.plotOverride} onClose={()=>setVrState(null)}/>}
      {videoTourProperty && <VideoTourModal property={videoTourProperty} onClose={()=>setVideoTourProperty(null)}/>}

      {/* ── PLOT DETAIL PAGE ── */}
      {detailProperty && !vrState && (
        <PlotSiteDetailPage property={detailProperty} onBack={()=>setDetailProperty(null)} onVR={(prop: Property, plot: Plot)=>launchVR(prop,plot)}/>
      )}

      {/* ── MAIN LISTING ── */}
      {!detailProperty && !vrState && (
        <div style={{ background:'#030A16', minHeight:'100vh', position:'relative', paddingBottom:80 }}>

          <HeroHeader
            visible={visible}
            search={search}
            setSearch={setSearch}
            selType={selType}
            setSelType={setSelType}
            filtered={filtered}
          />

          <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
            <AnimatedGrid fixed={true}/>
          </div>

          <div style={{ position:'fixed', top:'-8%', right:'-8%', width:580, height:580, borderRadius:'50%', background:'radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 65%)', filter:'blur(90px)', animation:'driftA 26s ease-in-out infinite', pointerEvents:'none', zIndex:1 }}/>
          <div style={{ position:'fixed', bottom:'-8%', left:'-8%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,201,122,0.04) 0%,transparent 60%)', filter:'blur(110px)', animation:'driftB 30s ease-in-out infinite 3s', pointerEvents:'none', zIndex:1 }}/>

          {/* ── PROPERTY GRID ── */}
          <main style={{ position:'relative', zIndex:2, maxWidth:1320, margin:'0 auto', padding:'60px 24px 40px' }}>
            <div className="prop__grid">
              {filtered.map((p: Property, idx: number)=>(
                <div key={p.id} style={{ opacity:visible?1:0, transform:visible?'none':`translateY(${30+idx*6}px)`, transition:`opacity .6s ${idx*0.08}s ease, transform .6s ${idx*0.08}s ease` }}>
                  <PropertyCard
                    p={p}
                    onVR={()=>launchVR(p)}
                    onDetail={()=>setDetailProperty(p)}
                    onVideoTour={()=>setVideoTourProperty(p)}
                  />
                </div>
              ))}
            </div>
            {filtered.length===0 && (
              <div style={{ textAlign:'center', padding:'80px 0', fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:800, color:'rgba(212,175,55,0.35)' }}>No properties found.</div>
            )}
          </main>

          <ContactStrip/>
        </div>
      )}
    </>
  );
}