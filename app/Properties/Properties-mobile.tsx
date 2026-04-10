'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const VIDEOS = {
  villa: 'https://videos.pexels.com/video-files/7578540/7578540-uhd_2560_1440_25fps.mp4',
  plot:  'https://videos.pexels.com/video-files/4763829/4763829-uhd_2560_1440_25fps.mp4',
  land:  'https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_25fps.mp4',
};

const PLOT_STATUSES = ['available','available','available','sold','reserved'] as const;
type PlotStatus = typeof PLOT_STATUSES[number];

const AREAS = ['1100 sqft','1200 sqft','1250 sqft','1300 sqft','1350 sqft','1450 sqft','1500 sqft','1600 sqft'];
const PRICES_BASE = [75,83,86,90,93,100,105,110];

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
  status: PlotStatus;
  price: string;
  image: string;
  vrImage: string;
}

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
      id: `p${i+1}`, number: String(i + 1).padStart(2,'0'),
      col, row, x: 4 + col * 9.2, y: 6 + row * 14.2, w: 8.4, h: 12.5,
      direction: dir, area: AREAS[aIdx], status: PLOT_STATUSES[statusIdx] as PlotStatus, price,
      image: imgPool[i % imgPool.length], vrImage: imgPool[(i + 3) % imgPool.length],
    });
  }
  return plots;
}
const ALL_PLOTS = generatePlots();

type FacilityType = 'school' | 'hospital' | 'shopping' | 'transport' | 'park' | 'temple';
const FACILITY_EMOJI: Record<FacilityType, string> = {
  school: '🎓', hospital: '🏥', shopping: '🛍️', transport: '🚌', park: '🌳', temple: '🛕'
};

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
  walkScore?: number;
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
  nearbyFacilities: Array<{ name: string; distance: string; type: FacilityType; time: string }>;
  coordinates: { lat: number; lng: number };
  vrRooms: Array<{
    id: string;
    label: string;
    emoji: string;
    image: string;
    hotspots: Array<{ x: number; y: number; label: string }>;
  }>;
}

const PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'Bigway Prestige Villa',
    location: 'Saravanampatti, Coimbatore',
    price: '₹2.85 Cr',
    pricePerSqft: '₹8,200/sqft',
    emi: '₹1.92L/mo',
    bedrooms: 4,
    bathrooms: 4,
    area: '3,480 sqft (Built)',
    plotArea: '4,200 sqft',
    floors: 'G+2',
    age: 'New',
    possession: 'Ready',
    facing: 'East',
    vastu: true,
    parking: '2 Car',
    walkScore: 88,
    tag: 'NEW LAUNCH',
    tagColor: '#22C55E',
    type: 'Villa',
    status: 'Available',
    featured: true,
    accentColor: '#D4AF37',
    hasPlotSite: false,
    videoUrl: 'https://videos.pexels.com/video-files/7578540/7578540-uhd_2560_1440_25fps.mp4',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&fit=crop&q=90',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&fit=crop&q=90',
    ],
    amenities: ['Swimming Pool','Home Theatre','Smart Home','Solar Power','EV Charging','Gym','Garden','Security'],
    highlights: ['Vastu Compliant','Premium Fittings','Modular Kitchen','Italian Marble'],
    description: 'An architectural masterpiece blending contemporary design with Vastu principles. This 4BHK ultra-luxury villa features soaring ceilings, floor-to-ceiling glass, and premium finishes throughout.',
    whyBuy: [
      'Prime Saravanampatti location — IT corridor with 20-min access to TIDEL Park',
      'Vastu-compliant layout approved by certified consultant',
      'Smart home automation: lights, security, AC all app-controlled',
      'Projected 18% appreciation in 3 years based on area growth trends',
    ],
    specifications: {
      'Structure': 'RCC Framed',
      'Flooring': 'Italian Marble',
      'Kitchen': 'Modular + Granite',
      'Doors': 'Teak Wood',
      'Windows': 'UPVC Double Glazed',
      'Electrical': '3-Phase + Solar',
      'Water': 'Borewell + TWAD',
      'Security': '24/7 CCTV + Guard',
    },
    nearbyFacilities: [
      { name: 'KGISL Tech Park', distance: '1.2 km', type: 'transport', time: '4 min' },
      { name: 'SIMS Hospital', distance: '2.1 km', type: 'hospital', time: '7 min' },
      { name: 'Brookefields Mall', distance: '3.4 km', type: 'shopping', time: '11 min' },
      { name: 'Stanes School', distance: '1.8 km', type: 'school', time: '6 min' },
    ],
    coordinates: { lat: 11.0668, lng: 76.9991 },
    vrRooms: [
      { id: 'living', label: 'Living Room', emoji: '🛋️', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&fit=crop&q=90', hotspots: [{ x: 30, y: 55, label: 'Entertainment Wall' }, { x: 70, y: 45, label: 'Dining Area' }] },
      { id: 'master', label: 'Master Suite', emoji: '🛏️', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&fit=crop&q=90', hotspots: [{ x: 40, y: 50, label: 'King Bed Area' }, { x: 75, y: 40, label: 'Walk-in Closet' }] },
      { id: 'kitchen', label: 'Kitchen', emoji: '🍳', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop&q=90', hotspots: [{ x: 35, y: 60, label: 'Island Counter' }, { x: 68, y: 42, label: 'Appliance Zone' }] },
      { id: 'pool', label: 'Pool Deck', emoji: '🏊', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&fit=crop&q=90', hotspots: [{ x: 50, y: 65, label: 'Infinity Pool' }, { x: 25, y: 45, label: 'Lounge Area' }] },
    ],
  },
  {
    id: 2,
    title: 'Bigway Premium Plots',
    location: 'Vadavalli, Coimbatore',
    price: '₹75L – ₹1.1Cr',
    pricePerSqft: '₹5,500–₹7,200/sqft',
    emi: '₹52K/mo',
    area: '1,100–1,600 sqft',
    plotArea: '1,100–1,600 sqft',
    floors: 'Plot',
    age: 'New',
    possession: 'Immediate',
    facing: 'North / South',
    vastu: true,
    parking: 'Open',
    walkScore: 72,
    tag: 'HOT DEAL',
    tagColor: '#F59E0B',
    type: 'Plot',
    status: 'Available',
    featured: true,
    accentColor: '#22C55E',
    hasPlotSite: true,
    videoUrl: 'https://videos.pexels.com/video-files/4763829/4763829-uhd_2560_1440_25fps.mp4',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&fit=crop&q=90',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&fit=crop&q=90',
    ],
    amenities: ['DTCP Approved','Clear Title','30ft Roads','Avenue Trees','Underground EB','Water Supply','Compound Wall','24/7 Security'],
    highlights: ['DTCP Approved','Clear Title','Immediate Registration','Loan Available'],
    description: 'DTCP-approved residential plots in the rapidly developing Vadavalli corridor. 60 premium plots ranging from 1,100–1,600 sqft with North and South facing options.',
    whyBuy: [
      'DTCP approved — safe, legal, bank-loan eligible investment',
      'Vadavalli corridor: fastest appreciating micro-market in CBE (22% YoY)',
      'All 60 plots have clear title, ready for immediate registration',
      'Developed roads, underground EB and water supply already in place',
    ],
    specifications: {
      'Approval': 'DTCP / RERA',
      'Road Width': '30ft BT Road',
      'Electricity': 'Underground EB',
      'Water': 'TWAD Borewell',
      'Boundary': 'Compound Wall',
      'Title': 'Clear & Absolute',
      'Loan': 'All Major Banks',
      'Registration': 'Immediate',
    },
    nearbyFacilities: [
      { name: 'Vadavalli Bus Stand', distance: '0.8 km', type: 'transport', time: '3 min' },
      { name: 'G.Kuppuswamy Naidu Hospital', distance: '4.2 km', type: 'hospital', time: '12 min' },
      { name: 'D-Mart Vadavalli', distance: '1.5 km', type: 'shopping', time: '5 min' },
      { name: 'Nirmala College', distance: '2.3 km', type: 'school', time: '8 min' },
    ],
    coordinates: { lat: 11.0035, lng: 76.9264 },
    vrRooms: [
      { id: 'entry', label: 'Entry Road', emoji: '🛣️', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&fit=crop&q=90', hotspots: [{ x: 50, y: 60, label: '30ft Main Road' }, { x: 25, y: 45, label: 'Avenue Trees' }] },
      { id: 'plot', label: 'Plot View', emoji: '📍', image: 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=1200&fit=crop&q=90', hotspots: [{ x: 40, y: 55, label: 'Plot Boundary' }, { x: 70, y: 40, label: 'Corner Plot' }] },
    ],
  },
  {
    id: 3,
    title: 'Bigway Horizon Villa',
    location: 'Kalapatti, Coimbatore',
    price: '₹1.95 Cr',
    pricePerSqft: '₹6,800/sqft',
    emi: '₹1.32L/mo',
    bedrooms: 3,
    bathrooms: 3,
    area: '2,870 sqft (Built)',
    plotArea: '3,400 sqft',
    floors: 'G+1',
    age: 'New',
    possession: '6 Months',
    facing: 'North',
    vastu: true,
    parking: '2 Car',
    walkScore: 79,
    tag: 'UNDER CONST.',
    tagColor: '#3B82F6',
    type: 'Villa',
    status: 'Available',
    featured: false,
    accentColor: '#C084FC',
    hasPlotSite: false,
    videoUrl: 'https://videos.pexels.com/video-files/7578540/7578540-uhd_2560_1440_25fps.mp4',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&fit=crop&q=90',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&fit=crop&q=90',
    ],
    amenities: ['Terrace Garden','Solar Water Heater','Rainwater Harvesting','Smart Locks','Modular Kitchen','CCTV','Gym Room','Children Play'],
    highlights: ['North Facing','Vastu Perfect','Green Certified','Prime Location'],
    description: 'A thoughtfully designed 3BHK villa in the serene Kalapatti locale, offering panoramic views and sustainable living features including solar panels and rainwater harvesting.',
    whyBuy: [
      'Kalapatti IT hub proximity — 10 min from Tidel Park & CIT Nagar',
      'Green-certified build with 40% lower utility bills vs conventional',
      'North-facing Vastu-perfect layout — rare in this price bracket',
      'Flexible payment plan: 20-40-40 construction-linked',
    ],
    specifications: {
      'Structure': 'Shear Wall',
      'Flooring': 'Vitrified + Hardwood',
      'Kitchen': 'Modular Hafele',
      'Doors': 'Engineered Wood',
      'Windows': 'UPVC Casement',
      'Electrical': '3-Phase + Solar 5kW',
      'Water': 'Dual Source',
      'Green': 'IGBC Pre-certified',
    },
    nearbyFacilities: [
      { name: 'Tidel Park', distance: '2.8 km', type: 'transport', time: '9 min' },
      { name: 'Kovai Medical Center', distance: '5.1 km', type: 'hospital', time: '15 min' },
      { name: 'Fun Republic Mall', distance: '4.2 km', type: 'shopping', time: '13 min' },
      { name: 'PSG Tech', distance: '3.6 km', type: 'school', time: '11 min' },
    ],
    coordinates: { lat: 11.0535, lng: 77.0421 },
    vrRooms: [
      { id: 'living', label: 'Living', emoji: '🛋️', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&fit=crop&q=90', hotspots: [{ x: 35, y: 50, label: 'Feature Wall' }, { x: 68, y: 42, label: 'Balcony Access' }] },
      { id: 'terrace', label: 'Terrace', emoji: '🌿', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&fit=crop&q=90', hotspots: [{ x: 50, y: 55, label: 'Garden Zone' }, { x: 30, y: 40, label: 'City View' }] },
    ],
  },
  {
    id: 4,
    title: 'Bigway Farmland Estate',
    location: 'Annur, Coimbatore',
    price: '₹48L – ₹1.2Cr',
    pricePerSqft: '₹180–₹220/sqft',
    emi: '₹32K/mo',
    area: '1–3 Acres',
    plotArea: '43,560–1,30,680 sqft',
    floors: 'Agricultural Land',
    age: 'N/A',
    possession: 'Immediate',
    facing: 'East / North',
    vastu: false,
    parking: 'Open',
    tag: 'AGRI LAND',
    tagColor: '#10B981',
    type: 'Land',
    status: 'Available',
    featured: false,
    accentColor: '#10B981',
    hasPlotSite: false,
    videoUrl: 'https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_25fps.mp4',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&fit=crop&q=90',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&fit=crop&q=90',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&fit=crop&q=90',
    ],
    amenities: ['Borewell','Electricity','Patta Available','Farm Road Access','Coconut/Mango','Fertile Soil','Water Canal Nearby','No Encumbrance'],
    highlights: ['Patta Land','Fertile Soil','Water Source','Peaceful Setting'],
    description: 'Premium agricultural land parcels in Annur with guaranteed water source, fertile red soil, and existing coconut/mango cultivation. Ideal for farmhouse or investment.',
    whyBuy: [
      'Annur agri belt — highest soil fertility rating in Coimbatore district',
      'Guaranteed borewell water at 120ft — never runs dry (tested)',
      'Existing coconut & mango plantation generates ₹2–4L annual income',
      'Annur highway widening project (2025) to boost land value 35%+',
    ],
    specifications: {
      'Land Type': 'Agricultural / Patta',
      'Soil': 'Red Loam (Grade A)',
      'Water': 'Borewell 120ft',
      'Electricity': 'EB Connection',
      'Road': 'Tar Road Access',
      'Survey': 'Clear Survey',
      'Encumbrance': 'Nil (EC verified)',
      'Cultivation': 'Coconut + Mango',
    },
    nearbyFacilities: [
      { name: 'Annur Town Bus', distance: '1.5 km', type: 'transport', time: '5 min' },
      { name: 'Annur Govt Hospital', distance: '3.2 km', type: 'hospital', time: '10 min' },
      { name: 'Weekly Market', distance: '2.0 km', type: 'shopping', time: '7 min' },
      { name: 'Govt School Annur', distance: '2.5 km', type: 'school', time: '8 min' },
      { name: 'Karamadai Forest', distance: '8 km', type: 'park', time: '20 min' },
    ],
    coordinates: { lat: 11.2282, lng: 77.1010 },
    vrRooms: [
      { id: 'field', label: 'Farm View', emoji: '🌾', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&fit=crop&q=90', hotspots: [{ x: 45, y: 60, label: 'Coconut Grove' }, { x: 70, y: 45, label: 'Borewell Point' }] },
      { id: 'road', label: 'Road Access', emoji: '🛣️', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&fit=crop&q=90', hotspots: [{ x: 50, y: 55, label: 'Tar Road Entry' }] },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   HOOK: useIsMobile
══════════════════════════════════════════════════════════════ */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

/* ══════════════════════════════════════════════════════════════
   ANIMATED GRID
══════════════════════════════════════════════════════════════ */
const AnimatedGrid = ({ fixed = false }: { fixed?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const frame = useRef(0);
  const blips = useRef<{ col: number; progress: number; speed: number; alpha: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let W: number, H: number;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const blipInterval = setInterval(() => {
      blips.current.push({
        col: Math.floor(Math.random() * 14),
        progress: 0,
        speed: 0.002 + Math.random() * 0.003,
        alpha: 0.5 + Math.random() * 0.4,
      });
    }, 1200);

    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W, H);
      const COLS = 14, ROWS = 10;
      const cellW = W / COLS, cellH = H / ROWS;
      const t = frame.current * 0.01;

      for (let col = 0; col <= COLS; col++) {
        const x = col * cellW;
        const dx = x - mouse.current.x;
        const dy = H / 2 - mouse.current.y;
        const proximity = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 350);
        const baseAlpha = 0.05 + proximity * 0.2;
        const grad = ctx.createLinearGradient(x, 0, x, H);
        grad.addColorStop(0, 'rgba(212,175,55,0)');
        grad.addColorStop(0.3, `rgba(212,175,55,${baseAlpha})`);
        grad.addColorStop(0.7, `rgba(212,175,55,${baseAlpha})`);
        grad.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.strokeStyle = grad;
        ctx.lineWidth = proximity > 0.3 ? 1.2 : 0.6;
        ctx.stroke();
      }

      for (let row = 0; row <= ROWS; row++) {
        const y = row * cellH;
        const dx = W / 2 - mouse.current.x;
        const dy = y - mouse.current.y;
        const proximity = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 350);
        const baseAlpha = 0.05 + proximity * 0.2;
        const grad = ctx.createLinearGradient(0, y, W, y);
        grad.addColorStop(0, 'rgba(212,175,55,0)');
        grad.addColorStop(0.2, `rgba(212,175,55,${baseAlpha})`);
        grad.addColorStop(0.8, `rgba(212,175,55,${baseAlpha})`);
        grad.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = proximity > 0.3 ? 1.2 : 0.6;
        ctx.stroke();
      }

      for (let col = 0; col <= COLS; col++) {
        for (let row = 0; row <= ROWS; row++) {
          const x = col * cellW, y = row * cellH;
          const dx = x - mouse.current.x, dy = y - mouse.current.y;
          const proximity = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 220);
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + col * 0.6 + row * 0.8);
          const size = 1 + pulse * 0.5 + proximity * 3.5;
          const alpha = 0.1 + pulse * 0.08 + proximity * 0.6;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${alpha})`;
          ctx.fill();
        }
      }

      blips.current = blips.current.filter(b => b.progress < 1);
      for (const b of blips.current) {
        b.progress += b.speed;
        const x = b.col * cellW;
        const y = b.progress * H;
        const grad = ctx.createLinearGradient(x, y - 80, x, y + 4);
        grad.addColorStop(0, 'rgba(212,175,55,0)');
        grad.addColorStop(1, `rgba(255,220,100,${b.alpha})`);
        ctx.beginPath();
        ctx.moveTo(x, y - 80);
        ctx.lineTo(x, y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,100,${b.alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(blipInterval);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [fixed]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: fixed ? 'fixed' : 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

/* ══════════════════════════════════════════════════════════════
   WALK SCORE RING
══════════════════════════════════════════════════════════════ */
const WalkScoreRing = ({ score, acc }: { score: number; acc: string }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
        <circle
          cx="30" cy="30" r={r}
          fill="none" stroke={acc} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s ease', filter: `drop-shadow(0 0 4px ${acc})` }}
        />
        <text
          x="30" y="30" textAnchor="middle" dominantBaseline="central"
          fill="#fff" fontSize="13" fontWeight="900" fontFamily="Orbitron, sans-serif"
          style={{ transform: 'rotate(90deg)', transformOrigin: '30px 30px' }}
        >
          {score}
        </text>
      </svg>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: `${acc}80`, letterSpacing: '.1em', textAlign: 'center' }}>
        WALK<br />SCORE
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   VIDEO TOUR MODAL
══════════════════════════════════════════════════════════════ */
interface VideoTourModalProps {
  property: Property;
  onClose: () => void;
}
const VideoTourModal = ({ property, onClose }: VideoTourModalProps) => {
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
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 980, borderRadius: 20, overflow: 'hidden', border: `2px solid ${acc}40`, background: '#030A16', boxShadow: `0 0 80px ${acc}30` }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${acc}20`, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${acc}70`, letterSpacing: '.2em', marginBottom: 2 }}>VIDEO TOUR</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1rem', color: '#fff' }}>{property.title}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ padding: '4px 10px', borderRadius: 100, background: `${acc}15`, border: `1px solid ${acc}40`, fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: acc }}>📍 {property.location}</div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>
        <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9' }}>
          <video ref={videoRef} src={property.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loop playsInline onClick={togglePlay} />
          {!playing && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', cursor: 'pointer' }} onClick={togglePlay}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${acc},${acc}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 50px ${acc}60` }}>
                <span style={{ fontSize: 24, marginLeft: 4 }}>▶</span>
              </div>
            </div>
          )}
          {playing && (
            <div style={{ position: 'absolute', top: 12, right: 12, cursor: 'pointer' }} onClick={togglePlay}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: `1px solid ${acc}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⏸</div>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 14, left: 14, padding: '7px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', border: `1px solid ${acc}40` }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${acc}80`, letterSpacing: '.15em' }}>PROPERTY TOUR</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 15, fontWeight: 900, color: '#fff' }}>{property.price}</div>
          </div>
        </div>
        <div style={{ padding: '14px 18px 18px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{ flex: 1, padding: '11px 16px', borderRadius: 11, background: `linear-gradient(135deg,${acc},${acc}cc)`, color: '#030A16', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '.08em' }}>📅 SCHEDULE SITE VISIT</button>
          <button style={{ flex: 1, padding: '11px 16px', borderRadius: 11, background: 'transparent', border: `1.5px solid ${acc}40`, color: acc, cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9 }}>📞 CALL AGENT NOW</button>
          <button onClick={onClose} style={{ padding: '11px 16px', borderRadius: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontSize: 9 }}>CLOSE</button>
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
  plotOverride?: Plot | null;
  onClose: () => void;
}
const VRViewer = ({ property, plotOverride, onClose }: VRViewerProps) => {
  const p = property;
  const acc = p?.accentColor || '#D4AF37';
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRoom, setActiveRoom] = useState(0);
  const [mode, setMode] = useState<'vr' | 'gallery' | 'specs'>('vr');
  const [imgIdx, setImgIdx] = useState(0);
  const [entering, setEntering] = useState(true);
  const [showHotspot, setShowHotspot] = useState<string | null>(null);
  const [vrScan, setVrScan] = useState(false);
  const [zoom, setZoom] = useState(false);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  // FIX: useRef must have initial value
  const rafRef = useRef<number>(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [scanY, setScanY] = useState(0);
  const scanRef = useRef(0);
  const isMobile = useIsMobile();

  const rooms = plotOverride
    ? [{ id: 'plot', label: `Plot #${plotOverride.number}`, emoji: '📍', image: plotOverride.image, hotspots: [{ x: 40, y: 55, label: 'Plot Area' }, { x: 70, y: 45, label: 'Road Access' }] }]
    : (p?.vrRooms || []);
  const currentRoom = rooms[activeRoom];

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const loop = () => {
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.04;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.04;
      setParallax({ x: (smoothMouse.current.x - 0.5) * 24, y: (smoothMouse.current.y - 0.5) * 14 });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      scanRef.current = (scanRef.current + 1) % 100;
      setScanY(scanRef.current);
    }, 18);
    return () => clearInterval(iv);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }, []);

  const changeRoom = (i: number) => {
    setEntering(true);
    setActiveRoom(i);
    setShowHotspot(null);
    setTimeout(() => setEntering(false), 500);
  };

  const bgImage = mode === 'gallery' ? (p?.images[imgIdx] || '') : currentRoom?.image || p?.image || '';
  const tabs = [
    { id: 'vr' as const, icon: '🥽', label: '360° VR' },
    ...(p?.images?.length ? [{ id: 'gallery' as const, icon: '📸', label: 'Gallery' }] : []),
    { id: 'specs' as const, icon: '📋', label: 'Details' },
  ];

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', overflow: 'hidden' }}
      onMouseMove={onMouseMove}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
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

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', inset: '-5%',
            backgroundImage: `url(${bgImage})`, backgroundSize: 'cover',
            backgroundPosition: `${50 + parallax.x * 0.6}% ${50 + parallax.y * 0.6}%`,
            transform: `scale(1.08) translateX(${-parallax.x * 0.3}px) translateY(${-parallax.y * 0.3}px)`,
            transition: dragging ? 'none' : 'transform 0.1s ease-out',
            filter: entering ? 'blur(18px) brightness(0.2)' : 'brightness(0.55) saturate(1.1)',
            opacity: entering ? 0 : 1, willChange: 'transform',
          }}
        />
        {vrScan && (
          <>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)', animation: 'vr__scan 3s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, height: 2, top: `${scanY}%`, background: `linear-gradient(90deg,transparent,${acc}60,rgba(255,255,255,0.3),${acc}60,transparent)`, boxShadow: `0 0 10px ${acc}80`, pointerEvents: 'none' }} />
          </>
        )}
        {entering && <div style={{ position: 'absolute', inset: 0, background: '#fff', animation: 'vr__flash 0.5s ease-out both', pointerEvents: 'none', zIndex: 50 }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 40%, rgba(0,0,0,0.92) 100%)', pointerEvents: 'none' }} />
      </div>

      {mode === 'vr' && !entering && currentRoom?.hotspots?.map((hs, i) => (
        <div
          key={i}
          style={{ position: 'absolute', left: `${hs.x + parallax.x * 0.08}%`, top: `${hs.y + parallax.y * 0.08}%`, transform: 'translate(-50%,-50%)', zIndex: 20, cursor: 'pointer', animation: `vr__fadeIn 0.4s ${i * 0.15}s ease both` }}
          onClick={(e) => { e.stopPropagation(); setShowHotspot(showHotspot === hs.label ? null : hs.label); }}
        >
          <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: `1px solid ${acc}40`, animation: 'vr__ripple 2.5s ease-out infinite' }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: `radial-gradient(circle, #fff 30%, ${acc} 100%)`, boxShadow: `0 0 0 3px ${acc}60, 0 0 18px ${acc}80`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'vr__hotspot 2s ease-out infinite' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: acc }} />
          </div>
          {showHotspot === hs.label && (
            <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', padding: '7px 13px', borderRadius: 9, whiteSpace: 'nowrap', background: 'rgba(4,10,20,0.94)', backdropFilter: 'blur(16px)', border: `1px solid ${acc}50`, fontFamily: "'Orbitron',sans-serif", fontSize: 9.5, fontWeight: 700, color: acc, letterSpacing: '.1em', animation: 'vr__fadeIn 0.2s ease both' }}>
              {hs.label}
            </div>
          )}
        </div>
      ))}

      {/* HUD TOP */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: isMobile ? '10px 12px' : '12px 18px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', animation: 'vr__hudSlide 0.5s 0.3s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="vr__btn" onClick={onClose} style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(220,40,40,0.2)', border: '1px solid rgba(220,40,40,0.4)', color: '#f87171', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          {!isMobile && (
            <>
              <div style={{ width: 1, height: 24, background: `${acc}30` }} />
              <div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 700, letterSpacing: '.22em', color: `${acc}70`, marginBottom: 2 }}>
                  {plotOverride ? `PLOT #${plotOverride.number} · SITE VR` : 'BIGWAY REALTY · VIRTUAL TOUR'}
                </div>
                <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 'clamp(0.8rem,1.4vw,1.05rem)', color: '#fff' }}>
                  {plotOverride ? `Plot #${plotOverride.number} — ${plotOverride.area}` : p?.title}
                </div>
              </div>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 3, padding: '3px', borderRadius: 12, background: 'rgba(4,10,20,0.8)', backdropFilter: 'blur(20px)', border: `1px solid ${acc}18` }}>
          {tabs.map(t => (
            <button key={t.id} className="vr__btn" onClick={() => { setMode(t.id); setEntering(true); setTimeout(() => setEntering(false), 400); }}
              style={{ padding: isMobile ? '5px 8px' : '6px 12px', borderRadius: 9, fontSize: isMobile ? 8 : 9.5, fontFamily: "'Orbitron',sans-serif", fontWeight: 700, letterSpacing: '.04em', background: mode === t.id ? `linear-gradient(135deg,${acc},${acc}cc)` : 'transparent', color: mode === t.id ? '#040C1A' : `${acc}55`, border: 'none', boxShadow: mode === t.id ? `0 4px 16px ${acc}40` : 'none' }}>
              {t.icon} {isMobile ? '' : t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <button className="vr__btn" onClick={() => setVrScan(v => !v)} style={{ padding: '5px 10px', borderRadius: 9, fontSize: 8, fontFamily: "'Orbitron',sans-serif", fontWeight: 700, background: vrScan ? `${acc}22` : 'rgba(255,255,255,0.06)', color: vrScan ? acc : 'rgba(255,255,255,0.4)', border: `1px solid ${vrScan ? acc + '45' : 'rgba(255,255,255,0.1)'}` }}>
            🥽{!isMobile && ' HUD'}
          </button>
          <button className="vr__btn" onClick={() => setZoom(z => !z)} style={{ width: 32, height: 32, borderRadius: 9, background: zoom ? `${acc}22` : 'rgba(255,255,255,0.06)', border: `1px solid ${zoom ? acc + '45' : 'rgba(255,255,255,0.1)'}`, color: zoom ? acc : 'rgba(255,255,255,0.4)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔍</button>
        </div>
      </div>

      {/* HUD LEFT */}
      {!isMobile && (
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 30, display: 'flex', flexDirection: 'column', gap: 6, animation: 'vr__hudSlide 0.5s 0.5s ease both' }}>
          {(plotOverride
            ? [
                { label: 'PLOT', value: `#${plotOverride.number}`, icon: '📍' },
                { label: 'AREA', value: plotOverride.area.split(' ')[0], sub: 'sq ft', icon: '📐' },
                { label: 'FACING', value: plotOverride.direction, icon: '🧭' },
                { label: 'PRICE', value: plotOverride.price, icon: '💰' },
                { label: 'STATUS', value: plotOverride.status.toUpperCase(), icon: '✅' },
              ]
            : [
                { label: 'PRICE', value: p?.price, icon: '💰' },
                { label: 'AREA', value: p?.area?.split(' ')[0], sub: 'sq ft', icon: '📐' },
                ...(p?.bedrooms ? [{ label: 'BED/BATH', value: `${p.bedrooms}/${p.bathrooms}`, icon: '🛏️' }] : []),
                { label: 'FACING', value: p?.facing, icon: '🧭' },
                { label: 'STATUS', value: p?.possession, icon: '🏠' },
              ]).map((s, i) => (
            <div key={i} style={{ padding: '8px 11px', borderRadius: 10, minWidth: 108, background: 'rgba(4,10,20,0.82)', backdropFilter: 'blur(20px)', border: `1px solid ${acc}18`, borderLeft: `3px solid ${acc}`, animation: `vr__fadeIn 0.4s ${i * 0.08}s ease both` }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 6.5, fontWeight: 700, color: `${acc}70`, letterSpacing: '.18em', marginBottom: 2 }}>{s.icon} {s.label}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(0.7rem,1vw,0.88rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.value}</div>
              {s.sub && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8.5, color: `${acc}50`, marginTop: 1 }}>{s.sub}</div>}
            </div>
          ))}
        </div>
      )}

      {/* MOBILE HUD */}
      {isMobile && (
        <div style={{ position: 'absolute', bottom: 72, left: 12, right: 12, zIndex: 30, display: 'flex', gap: 6, flexWrap: 'wrap', animation: 'vr__fadeIn 0.5s 0.4s ease both' }}>
          {(plotOverride
            ? [{ label: 'PLOT', value: `#${plotOverride.number}` }, { label: 'AREA', value: plotOverride.area.split(' ')[0] }, { label: 'PRICE', value: plotOverride.price }]
            : [{ label: 'PRICE', value: p?.price }, { label: 'AREA', value: p?.area?.split(' ')[0] }, { label: 'FACING', value: p?.facing }]
          ).map((s, i) => (
            <div key={i} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(4,10,20,0.88)', backdropFilter: 'blur(16px)', border: `1px solid ${acc}28`, borderLeft: `2px solid ${acc}` }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 6, color: `${acc}70`, letterSpacing: '.18em', marginBottom: 1 }}>{s.label}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, color: '#fff' }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ROOM SWITCHER */}
      {mode === 'vr' && !entering && (
        <div style={{ position: 'absolute', bottom: isMobile ? 22 : 70, left: '50%', transform: 'translateX(-50%)', zIndex: 30, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '90vw', animation: 'vr__fadeIn 0.5s 0.4s ease both' }}>
          {rooms.map((room, i) => (
            <button key={room.id} className="vr__btn" onClick={() => changeRoom(i)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: isMobile ? '6px 10px' : '8px 14px', borderRadius: 12, background: activeRoom === i ? `linear-gradient(135deg,${acc}30,${acc}15)` : 'rgba(4,10,20,0.75)', backdropFilter: 'blur(16px)', border: `1px solid ${activeRoom === i ? acc : 'rgba(255,255,255,0.1)'}`, boxShadow: activeRoom === i ? `0 0 20px ${acc}40` : 'none', minWidth: isMobile ? 44 : 58 }}>
              <span style={{ fontSize: isMobile ? 14 : 18 }}>{room.emoji}</span>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: isMobile ? 6 : 7, fontWeight: 700, letterSpacing: '.07em', color: activeRoom === i ? acc : 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                {room.label.toUpperCase().slice(0, isMobile ? 6 : 20)}
              </span>
              {activeRoom === i && <div style={{ width: 12, height: 2, borderRadius: 1, background: acc }} />}
            </button>
          ))}
        </div>
      )}

      {/* GALLERY MODE */}
      {mode === 'gallery' && p?.images && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30, padding: '14px 16px 18px', background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)', animation: 'vr__fadeIn 0.3s ease both' }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, color: `${acc}70`, letterSpacing: '.22em', marginBottom: 8 }}>📸 GALLERY · {imgIdx + 1}/{p.images.length}</div>
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto' }}>
            {p.images.map((img, i) => (
              <button key={i} onClick={() => { setImgIdx(i); setEntering(true); setTimeout(() => setEntering(false), 400); }}
                style={{ flexShrink: 0, width: isMobile ? 68 : 88, height: isMobile ? 44 : 56, borderRadius: 8, overflow: 'hidden', border: `2px solid ${i === imgIdx ? acc : 'transparent'}`, opacity: i === imgIdx ? 1 : 0.38, transition: 'all .25s', padding: 0 }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SPECS MODE */}
      {mode === 'specs' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '64px 12px 12px' : '72px 20px 72px', animation: 'vr__fadeIn 0.3s ease both' }}>
          <div style={{ width: '100%', maxWidth: 820, maxHeight: '100%', overflowY: 'auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }} className="vr__scroll">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '16px', borderRadius: 16, background: 'rgba(4,10,20,0.94)', backdropFilter: 'blur(32px)', border: `1.5px solid ${acc}30` }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: `${acc}70`, letterSpacing: '.22em', marginBottom: 4 }}>PROPERTY OVERVIEW</div>
                <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 'clamp(0.95rem,1.8vw,1.2rem)', color: '#fff', marginBottom: 3 }}>{plotOverride ? `Plot #${plotOverride.number}` : p?.title}</h3>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: `${acc}80`, marginBottom: 12 }}>📍 {p?.location}</div>
                <div style={{ padding: '10px 14px', borderRadius: 11, background: `linear-gradient(135deg,${acc}18,${acc}08)`, border: `1.5px solid ${acc}35`, marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1rem,2.2vw,1.4rem)', fontWeight: 900, color: acc }}>{plotOverride ? plotOverride.price : p?.price}</div>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, lineHeight: 1.85, color: 'rgba(199,209,219,0.65)' }}>{p?.description}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p?.specifications && (
                <div style={{ padding: '14px', borderRadius: 16, background: 'rgba(4,10,20,0.94)', backdropFilter: 'blur(32px)', border: `1.5px solid ${acc}25` }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: `${acc}70`, letterSpacing: '.2em', marginBottom: 8 }}>SPECIFICATIONS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {Object.entries(p.specifications).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: `1px solid ${acc}10` }}>
                        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: `${acc}55`, letterSpacing: '.1em' }}>{k}</span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 600, color: '#fff' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="vr__btn" style={{ flex: 1, padding: '11px', borderRadius: 11, background: `linear-gradient(135deg,${acc},${acc}cc)`, color: '#040C1A', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '.08em', border: 'none' }}>📅 SCHEDULE VISIT</button>
                <button className="vr__btn" style={{ flex: 1, padding: '11px', borderRadius: 11, background: 'transparent', border: `1.5px solid ${acc}45`, color: acc, fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9 }}>📞 CALL AGENT</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM TICKER */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30, padding: '7px 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: `${acc}55` }}>
          <span>BIGWAY</span><span style={{ color: `${acc}28` }}>›</span><span style={{ color: acc }}>{mode.toUpperCase()}</span>
        </div>
        {!isMobile && (
          <div style={{ overflow: 'hidden', width: 200, height: 15 }}>
            <div style={{ display: 'flex', gap: 16, animation: 'vr__ticker 18s linear infinite', whiteSpace: 'nowrap' }}>
              {[...(p?.amenities || []), ...(p?.amenities || [])].map((a, i) => (
                <span key={i} style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 700, color: `${acc}40`, letterSpacing: '.1em' }}>✦ {a.toUpperCase()}</span>
              ))}
            </div>
          </div>
        )}
        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: `${acc}35` }}>{plotOverride ? `PLOT #${plotOverride.number}` : `${p?.coordinates?.lat?.toFixed(4)}°N`}</span>
      </div>

      {/* CORNER BRACKETS */}
      {[
        { top: 12, left: 12, bT: true, bL: true, bB: false, bR: false },
        { top: 12, right: 12, bT: true, bR: true, bB: false, bL: false },
        { bottom: 12, left: 12, bB: true, bL: true, bT: false, bR: false },
        { bottom: 12, right: 12, bB: true, bR: true, bT: false, bL: false },
      ].map((c, i) => (
        <div key={i} style={{ position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom, width: 22, height: 22, borderTop: c.bT ? `2px solid ${acc}50` : 'none', borderBottom: c.bB ? `2px solid ${acc}50` : 'none', borderLeft: c.bL ? `2px solid ${acc}50` : 'none', borderRight: c.bR ? `2px solid ${acc}50` : 'none', zIndex: 40, animation: `vr__glow 3s ease-in-out infinite`, animationDelay: `${i * 0.4}s`, pointerEvents: 'none' }} />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   INLINE PLOT VR
══════════════════════════════════════════════════════════════ */
interface InlinePlotVRProps {
  plot: Plot;
  acc?: string;
  height?: number;
}
const InlinePlotVR = ({ plot, acc = '#22C55E', height = 340 }: InlinePlotVRProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smooth = useRef({ x: 0.5, y: 0.5 });
  // FIX: useRef must have initial value
  const rafRef = useRef<number>(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [activeRoom, setActiveRoom] = useState(0);
  const [entering, setEntering] = useState(true);
  const [scanY, setScanY] = useState(0);
  const scanRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const ROOMS = [
    { label: 'Plot View', emoji: '📍', image: plot.image, hotspots: [{ x: 38, y: 55, label: 'Plot Boundary' }, { x: 68, y: 42, label: 'Road Access' }] },
    { label: 'Surroundings', emoji: '🌳', image: plot.vrImage, hotspots: [{ x: 50, y: 60, label: 'Neighbourhood' }, { x: 25, y: 45, label: 'Open Space' }] },
    { label: 'Aerial', emoji: '🚁', image: plot.image, hotspots: [{ x: 55, y: 50, label: `Plot #${plot.number}` }] },
  ];
  const room = ROOMS[activeRoom];

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 600);
    return () => clearTimeout(t);
  }, [activeRoom]);

  useEffect(() => {
    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.05;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.05;
      setParallax({ x: (smooth.current.x - 0.5) * 18, y: (smooth.current.y - 0.5) * 10 });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      scanRef.current = (scanRef.current + 1.4) % 100;
      setScanY(scanRef.current);
    }, 16);
    return () => clearInterval(iv);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  const changeRoom = (i: number) => { setEntering(true); setActiveRoom(i); setActiveHotspot(null); };

  const statusColorMap: Record<PlotStatus, string> = { available: '#22C55E', sold: '#EF4444', reserved: '#F59E0B' };
  const statusColor = (statusColorMap[plot.status] || acc) as string;

  return (
    <div ref={containerRef} onMouseMove={onMouseMove} onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
      style={{ position: 'relative', width: '100%', height, borderRadius: 16, overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', border: `1.5px solid ${acc}40`, boxShadow: `0 0 40px ${acc}20`, background: '#050d1a' }}>
      <style>{`
        @keyframes inlineVR__flash  { 0%{opacity:1} 100%{opacity:0} }
        @keyframes inlineVR__ripple { 0%{transform:scale(0.7);opacity:1} 100%{transform:scale(2.4);opacity:0} }
        @keyframes inlineVR__hs     { from{opacity:0;transform:translate(-50%,-50%) scale(0.7)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes inlineVR__blink  { 0%,100%{opacity:0.8} 50%{opacity:1;box-shadow:0 0 8px currentColor} }
        @keyframes inlineVR__glow   { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>

      <div style={{ position: 'absolute', inset: '-6%', backgroundImage: `url(${room.image})`, backgroundSize: 'cover', backgroundPosition: `${50 + parallax.x * 0.7}% ${50 + parallax.y * 0.7}%`, transform: `scale(1.1) translateX(${-parallax.x * 0.25}px) translateY(${-parallax.y * 0.25}px)`, filter: entering ? 'blur(16px) brightness(0.15)' : 'brightness(0.52) saturate(1.15)', opacity: entering ? 0 : 1, willChange: 'transform', transitionProperty: entering ? 'opacity, filter' : 'transform', transitionDuration: entering ? '0.5s' : '0.08s' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, backgroundImage: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.18) 3px,rgba(0,0,0,0.18) 4px)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, height: 2, top: `${scanY}%`, zIndex: 3, background: `linear-gradient(90deg,transparent,${acc}55,rgba(255,255,255,0.25),${acc}55,transparent)`, boxShadow: `0 0 8px ${acc}70`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 35%, rgba(0,0,0,0.88) 100%)' }} />

      {entering && <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', background: `radial-gradient(circle, ${acc}22 0%, transparent 70%)`, animation: 'inlineVR__flash 0.5s ease-out both' }} />}

      {!entering && room.hotspots.map((hs, i) => (
        <div key={i} onClick={() => setActiveHotspot(activeHotspot === hs.label ? null : hs.label)}
          style={{ position: 'absolute', left: `${hs.x + parallax.x * 0.07}%`, top: `${hs.y + parallax.y * 0.07}%`, transform: 'translate(-50%,-50%)', zIndex: 10, cursor: 'pointer', animation: `inlineVR__hs 0.4s ${i * 0.12}s ease both` }}>
          <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: `1px solid ${acc}50`, animation: 'inlineVR__ripple 2.8s ease-out infinite' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: `radial-gradient(circle, #fff 25%, ${acc} 100%)`, boxShadow: `0 0 0 3px ${acc}55, 0 0 16px ${acc}80`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: acc }} />
          </div>
          {activeHotspot === hs.label && (
            <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', padding: '5px 11px', borderRadius: 8, whiteSpace: 'nowrap', background: 'rgba(4,10,20,0.95)', backdropFilter: 'blur(16px)', border: `1px solid ${acc}55`, fontFamily: "'Orbitron',sans-serif", fontSize: 8.5, fontWeight: 700, color: acc, letterSpacing: '.1em', animation: 'inlineVR__hs 0.2s ease both' }}>
              {hs.label}
            </div>
          )}
        </div>
      ))}

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12, padding: '10px 12px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: 'rgba(4,10,20,0.88)', backdropFilter: 'blur(14px)', border: `1px solid ${acc}40` }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: acc, animation: 'inlineVR__blink 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 700, color: acc, letterSpacing: '.15em' }}>VR · PLOT #{plot.number}</span>
          </div>
          <div style={{ padding: '3px 8px', borderRadius: 6, background: `${statusColor}20`, border: `1px solid ${statusColor}50`, fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 700, color: statusColor, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            {plot.status}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[{ l: 'AREA', v: plot.area.split(' ')[0] }, { l: 'FACE', v: plot.direction.slice(0, 1) }, { l: 'PRICE', v: plot.price }].map(s => (
            <div key={s.l} style={{ padding: '3px 7px', borderRadius: 6, background: 'rgba(4,10,20,0.82)', backdropFilter: 'blur(12px)', border: `1px solid ${acc}18`, borderLeft: `2px solid ${acc}`, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 5.5, color: `${acc}70`, letterSpacing: '.15em' }}>{s.l}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 700, color: '#fff' }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 12, display: 'flex', gap: 6 }}>
        {ROOMS.map((r, i) => (
          <button key={i} onClick={() => changeRoom(i)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '5px 10px', borderRadius: 10, background: activeRoom === i ? `linear-gradient(135deg,${acc}35,${acc}18)` : 'rgba(4,10,20,0.78)', backdropFilter: 'blur(14px)', border: `1px solid ${activeRoom === i ? acc : 'rgba(255,255,255,0.1)'}`, boxShadow: activeRoom === i ? `0 0 16px ${acc}45` : 'none', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)' }}>
            <span style={{ fontSize: 14 }}>{r.emoji}</span>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 6, fontWeight: 700, color: activeRoom === i ? acc : 'rgba(255,255,255,0.4)', letterSpacing: '.06em' }}>{r.label.toUpperCase().slice(0, 8)}</span>
            {activeRoom === i && <div style={{ width: 12, height: 1.5, borderRadius: 1, background: acc }} />}
          </button>
        ))}
      </div>

      {[
        { top: 8, left: 8, bT: true, bL: true, bB: false, bR: false },
        { top: 8, right: 8, bT: true, bR: true, bB: false, bL: false },
        { bottom: 8, left: 8, bB: true, bL: true, bT: false, bR: false },
        { bottom: 8, right: 8, bB: true, bR: true, bT: false, bL: false },
      ].map((c, i) => (
        <div key={i} style={{ position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom, width: 16, height: 16, zIndex: 15, pointerEvents: 'none', borderTop: c.bT ? `1.5px solid ${acc}60` : 'none', borderBottom: c.bB ? `1.5px solid ${acc}60` : 'none', borderLeft: c.bL ? `1.5px solid ${acc}60` : 'none', borderRight: c.bR ? `1.5px solid ${acc}60` : 'none', animation: 'inlineVR__glow 3s ease-in-out infinite', animationDelay: `${i * 0.45}s` }} />
      ))}

      <div style={{ position: 'absolute', bottom: 50, right: 12, zIndex: 12, padding: '3px 8px', borderRadius: 6, background: 'rgba(4,10,20,0.7)', border: `1px solid ${acc}20`, fontFamily: "'Orbitron',sans-serif", fontSize: 6, color: `${acc}50`, letterSpacing: '.1em', pointerEvents: 'none' }}>
        DRAG TO LOOK
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PLOT DETAIL PANEL
══════════════════════════════════════════════════════════════ */
interface PlotDetailPanelProps {
  plot: Plot;
  property: Property;
  onLaunchFullVR: () => void;
  onEnquire: () => void;
  compact?: boolean;
}
const PlotDetailPanel = ({ plot, property, onLaunchFullVR, onEnquire, compact = false }: PlotDetailPanelProps) => {
  const [tab, setTab] = useState<'info' | 'gallery' | 'vr'>('info');
  const acc = '#22C55E';
  const statusColorMap: Record<PlotStatus, string> = { available: '#22C55E', sold: '#EF4444', reserved: '#F59E0B' };
  const statusColor = (statusColorMap[plot.status] || acc) as string;
  const TABS = [
    { id: 'info' as const, icon: '📋', label: 'Info' },
    { id: 'gallery' as const, icon: '📸', label: 'Gallery' },
    { id: 'vr' as const, icon: '🥽', label: 'VR View' },
  ];

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: `2px solid ${statusColor}40`, background: 'rgba(4,10,22,0.97)' }}>
      <div style={{ position: 'relative', height: compact ? 150 : 180 }}>
        <img src={plot.image} alt={`Plot ${plot.number}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(4,10,22,1) 100%)' }} />
        <div style={{ position: 'absolute', top: 10, left: 12, padding: '4px 11px', borderRadius: 100, background: `${statusColor}22`, border: `1px solid ${statusColor}`, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 700, color: statusColor, letterSpacing: '.1em', textTransform: 'uppercase' }}>{plot.status}</div>
        <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${acc}80`, letterSpacing: '.2em', marginBottom: 3 }}>{plot.direction.toUpperCase()} FACING</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: compact ? 18 : 22, fontWeight: 900, color: '#fff' }}>Plot #{plot.number}</div>
        </div>
        <div style={{ position: 'absolute', bottom: 12, right: 14, padding: '6px 12px', borderRadius: 10, background: 'rgba(4,10,20,0.9)', backdropFilter: 'blur(12px)', border: `1px solid ${acc}40` }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${acc}70`, letterSpacing: '.1em', marginBottom: 1 }}>PRICE</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 900, color: acc }}>{plot.price}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(34,197,94,0.12)', background: 'rgba(4,10,20,0.6)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: '10px 4px', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 8, letterSpacing: '.04em', background: tab === t.id ? `${acc}18` : 'transparent', color: tab === t.id ? acc : 'rgba(255,255,255,0.32)', borderBottom: tab === t.id ? `2px solid ${acc}` : '2px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: tab === 'vr' ? 12 : '14px 14px 12px' }}>
        {tab === 'info' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
              {([['Area', plot.area], ['Facing', plot.direction], ['Price', plot.price], ['Status', plot.status.toUpperCase()]] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ padding: '9px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 6.5, color: `${acc}60`, letterSpacing: '.14em', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, color: '#fff' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {['DTCP Approved', 'Clear Title', '30ft Road', 'Water & EB', plot.direction + ' Facing', 'Gated'].map((a, i) => (
                <span key={i} style={{ padding: '3px 9px', borderRadius: 100, fontSize: 9.5, background: `${acc}0d`, border: `1px solid ${acc}20`, color: `${acc}bb`, fontFamily: "'DM Sans',sans-serif" }}>✦ {a}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              {plot.status === 'available' && (
                <button onClick={onLaunchFullVR} style={{ flex: 2, padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#040C1A', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: '.1em', boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}>🥽 FULL VR MODE</button>
              )}
              <button onClick={onEnquire} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'transparent', border: '1.5px solid rgba(212,175,55,0.35)', color: '#D4AF37', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 600, fontSize: 9 }}>📞 ENQUIRE</button>
            </div>
          </div>
        )}

        {tab === 'gallery' && (
          <div>
            <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 8, border: `1px solid ${acc}25` }}>
              <img src={plot.image} alt="" style={{ width: '100%', height: compact ? 130 : 160, objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[plot.image, plot.vrImage, plot.image, plot.vrImage].map((img, i) => (
                <div key={i} style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '16/10', border: `1px solid ${acc}18` }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${0.65 + i * 0.07})` }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <button onClick={() => setTab('vr')} style={{ padding: '9px 20px', borderRadius: 10, background: `linear-gradient(135deg,${acc},${acc}cc)`, color: '#040C1A', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9 }}>🥽 Switch to VR View →</button>
            </div>
          </div>
        )}

        {tab === 'vr' && (
          <div>
            <InlinePlotVR plot={plot} acc={acc} height={compact ? 240 : 300} />
            <div style={{ marginTop: 10, display: 'flex', gap: 7 }}>
              {plot.status === 'available' ? (
                <button onClick={onLaunchFullVR} style={{ flex: 2, padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#040C1A', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: '.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 0 24px rgba(212,175,55,0.45)' }}>⛶ FULLSCREEN VR</button>
              ) : (
                <div style={{ flex: 2, padding: '11px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔒 {plot.status.toUpperCase()}</div>
              )}
              <button onClick={onEnquire} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'transparent', border: '1.5px solid rgba(212,175,55,0.35)', color: '#D4AF37', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 600, fontSize: 9 }}>📞 ENQUIRE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PLOT SITE MAP
══════════════════════════════════════════════════════════════ */
interface PlotSiteMapProps {
  onPlotSelect: (plot: Plot | null) => void;
  selectedPlot: Plot | null;
}
const PlotSiteMap = ({ onPlotSelect, selectedPlot }: PlotSiteMapProps) => {
  const statusColorMap: Record<PlotStatus, string> = { available: '#22C55E', sold: '#EF4444', reserved: '#F59E0B' };
  const available = ALL_PLOTS.filter(p => p.status === 'available').length;
  const sold = ALL_PLOTS.filter(p => p.status === 'sold').length;
  const reserved = ALL_PLOTS.filter(p => p.status === 'reserved').length;

  return (
    <div style={{ background: 'rgba(4,10,20,0.97)', borderRadius: 18, border: '1.5px solid rgba(212,175,55,0.2)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '.22em', color: 'rgba(212,175,55,0.6)', marginBottom: 3 }}>BIGWAY REALTY · SITE PLAN</div>
          <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1.1rem', color: '#fff', margin: 0 }}>Premium Residential Plots — 60 Units</h3>
        </div>
        {/* FIX: typed as [string, string, number][] to avoid string|number type errors */}
        <div style={{ display: 'flex', gap: 10 }}>
          {([['#22C55E', 'Available', available], ['#EF4444', 'Sold', sold], ['#F59E0B', 'Reserved', reserved]] as [string, string, number][]).map(([c, l, n]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 900, color: c }}>{n}</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: `${c}80`, letterSpacing: '.1em' }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 16px 8px', overflowX: 'auto' }}>
        <div style={{ minWidth: 680, position: 'relative' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', aspectRatio: '2/1', display: 'block' }} preserveAspectRatio="xMidYMid meet">
            <rect width="100" height="100" fill="#050d1a" rx="2" />
            <rect x="2" y="2" width="96" height="96" fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="0.4" strokeDasharray="1.5,0.8" rx="1.5" />
            <rect x="0" y="90" width="100" height="10" fill="#1a2a1a" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" />
            <text x="50" y="96" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="1.8" fontFamily="sans-serif">MAIN ENTRANCE ROAD (40ft)</text>
            <rect x="0" y="0" width="100" height="5.5" fill="#1a2a1a" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" />
            <text x="50" y="3.8" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="1.8" fontFamily="sans-serif">NORTH BOUNDARY ROAD (30ft)</text>
            <rect x="43.5" y="5" width="4.5" height="85" fill="#162416" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" />
            <line x1="45.75" y1="5" x2="45.75" y2="90" stroke="rgba(255,220,0,0.18)" strokeWidth="0.25" strokeDasharray="1.2,0.8" />
            <rect x="2" y="46" width="96" height="5" fill="#162416" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" />
            <line x1="2" y1="48.5" x2="98" y2="48.5" stroke="rgba(255,220,0,0.18)" strokeWidth="0.25" strokeDasharray="1.2,0.8" />
            {ALL_PLOTS.map((plot) => {
              let px = plot.x, py = plot.y, pw = plot.w, ph = plot.h;
              if (plot.col >= 5) px = plot.x + 4;
              if (plot.row >= 3) py = plot.y + 4.5;
              const isSelected = selectedPlot?.id === plot.id;
              const col = statusColorMap[plot.status];
              return (
                <g key={plot.id} style={{ cursor: 'pointer' }} onClick={() => onPlotSelect(plot)}>
                  <rect x={px} y={py} width={pw} height={ph} fill={isSelected ? `${col}45` : `${col}18`} stroke={isSelected ? col : `${col}70`} strokeWidth={isSelected ? 0.6 : 0.35} rx="0.4" />
                  <text x={px + pw / 2} y={py + ph / 2 - 1.2} textAnchor="middle" fill="#fff" fontSize="2.2" fontFamily="'Orbitron',sans-serif" fontWeight="bold">{plot.number}</text>
                  <text x={px + pw / 2} y={py + ph / 2 + 0.8} textAnchor="middle" fill={`${col}cc`} fontSize="1.5" fontFamily="sans-serif">{plot.area.replace(' sqft', '')}</text>
                  <text x={px + pw / 2} y={py + ph / 2 + 2.5} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="1.4" fontFamily="sans-serif">{plot.price}</text>
                </g>
              );
            })}
          </svg>
          <div style={{ display: 'flex', gap: 12, padding: '10px 4px 4px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {([['#22C55E', 'Available'], ['#EF4444', 'Sold'], ['#F59E0B', 'Reserved']] as [string, string][]).map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '.08em' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PLOT SITE DETAIL PAGE
══════════════════════════════════════════════════════════════ */
interface PlotSiteDetailPageProps {
  property: Property;
  onBack: () => void;
  onVR: (property: Property, plot: Plot) => void;
}
const PlotSiteDetailPage = ({ property, onBack, onVR }: PlotSiteDetailPageProps) => {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | PlotStatus>('all');
  const isMobile = useIsMobile();
  const statusColorMap: Record<PlotStatus, string> = { available: '#22C55E', sold: '#EF4444', reserved: '#F59E0B' };

  return (
    <div style={{ minHeight: '100vh', background: '#030A16', paddingTop: 72 }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(3,10,22,0.97)', backdropFilter: 'blur(28px)', borderBottom: '1px solid rgba(212,175,55,0.15)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={onBack} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '.1em' }}>← BACK</button>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1rem', color: '#fff', flex: 1 }}>{property.title}</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {(['all', 'available', 'sold', 'reserved'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, background: filterStatus === s ? 'rgba(212,175,55,0.2)' : 'transparent', color: filterStatus === s ? '#D4AF37' : 'rgba(255,255,255,0.35)', borderBottom: filterStatus === s ? '2px solid #D4AF37' : '2px solid transparent' }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 16px 80px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: 20 }}>
        <div>
          <PlotSiteMap onPlotSelect={setSelectedPlot} selectedPlot={selectedPlot} />
          <div style={{ marginTop: 20, background: 'rgba(4,10,20,0.97)', borderRadius: 18, border: '1.5px solid rgba(212,175,55,0.2)', padding: '16px' }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: '1rem', color: '#fff', marginBottom: 14 }}>All 60 Plots</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 5 }}>
              {ALL_PLOTS.filter(pl => filterStatus === 'all' || pl.status === filterStatus).map(plot => {
                const col = statusColorMap[plot.status];
                const isSelected = selectedPlot?.id === plot.id;
                return (
                  <button key={plot.id} onClick={() => setSelectedPlot(isSelected ? null : plot)}
                    style={{ aspectRatio: '1/1', borderRadius: 7, border: `2px solid ${isSelected ? col : col + '50'}`, background: isSelected ? `${col}30` : `${col}12`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, transition: 'all .2s', padding: 2, transform: isSelected ? 'scale(1.1)' : 'scale(1)' }}>
                    <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 900, color: '#fff' }}>{plot.number}</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6.5, color: col }}>{plot.status === 'available' ? '✓' : plot.status === 'sold' ? '✗' : '~'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ position: isMobile ? 'relative' : 'sticky', top: 90, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedPlot ? (
            <PlotDetailPanel plot={selectedPlot} property={property} onLaunchFullVR={() => onVR(property, selectedPlot)} onEnquire={() => {}} compact={isMobile} />
          ) : (
            <div style={{ borderRadius: 16, padding: '36px 20px', textAlign: 'center', background: 'rgba(4,10,22,0.9)', border: '1.5px solid rgba(212,175,55,0.12)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, color: 'rgba(212,175,55,0.5)', letterSpacing: '.15em', lineHeight: 2.2 }}>SELECT A PLOT</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>Click any numbered plot for details, gallery & inline VR preview</div>
            </div>
          )}

          <div style={{ borderRadius: 16, padding: '16px', background: 'rgba(4,10,22,0.97)', border: '1.5px solid rgba(212,175,55,0.15)' }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: 'rgba(212,175,55,0.55)', letterSpacing: '.18em', marginBottom: 10 }}>AVAILABILITY SUMMARY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {/* FIX: typed as [string, number, string][] to avoid string|number type errors */}
              {([['Total', 60, '#D4AF37'], ['Available', ALL_PLOTS.filter(u => u.status === 'available').length, '#22C55E'], ['Sold', ALL_PLOTS.filter(u => u.status === 'sold').length, '#EF4444'], ['Reserved', ALL_PLOTS.filter(u => u.status === 'reserved').length, '#F59E0B']] as [string, number, string][]).map(([l, n, c]) => (
                <div key={l} style={{ padding: '11px 12px', borderRadius: 10, background: `${c}0d`, border: `1px solid ${c}28`, textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, color: c }}>{n}</div>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: `${c}80`, letterSpacing: '.1em', marginTop: 2 }}>{l.toUpperCase()}</div>
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
   MOBILE BOTTOM SHEET
══════════════════════════════════════════════════════════════ */
interface MobileBottomSheetProps {
  p: Property;
  onClose: () => void;
  onVR: (p: Property) => void;
  onVideoTour: (p: Property) => void;
  onDetail: (p: Property) => void;
}
const MobileBottomSheet = ({ p, onClose, onVR, onVideoTour, onDetail }: MobileBottomSheetProps) => {
  const acc = p.accentColor || '#D4AF37';
  const [tab, setTab] = useState<'info' | 'gallery' | 'amenities' | 'nearby' | 'plots'>('info');
  const [imgIdx, setImgIdx] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const touchSwipeStart = useRef(0);
  const touchSwipeEnd = useRef(0);
  const [selectedMobilePlot, setSelectedMobilePlot] = useState<Plot | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const onDragStart = (e: React.TouchEvent) => { startY.current = e.targetTouches[0].clientY; };
  const onDragMove = (e: React.TouchEvent) => {
    currentY.current = e.targetTouches[0].clientY;
    const dy = currentY.current - startY.current;
    if (dy > 0 && sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onDragEnd = () => {
    const dy = currentY.current - startY.current;
    if (sheetRef.current) sheetRef.current.style.transform = '';
    if (dy > 100) onClose();
  };

  const TABS = [
    { id: 'info' as const, icon: 'ℹ️', label: 'Info' },
    { id: 'gallery' as const, icon: '📸', label: 'Gallery' },
    { id: 'amenities' as const, icon: '✨', label: 'Amenities' },
    { id: 'nearby' as const, icon: '📍', label: 'Nearby' },
    ...(p.hasPlotSite ? [{ id: 'plots' as const, icon: '🗺️', label: 'Plots' }] : []),
  ];

  const statusColorMap: Record<PlotStatus, string> = { available: '#22C55E', sold: '#EF4444', reserved: '#F59E0B' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,15,0.88)', backdropFilter: 'blur(12px)' }} />
      <div ref={sheetRef} style={{ position: 'relative', zIndex: 1, maxHeight: '92vh', borderRadius: '22px 22px 0 0', background: 'linear-gradient(180deg,#0D1E3A 0%,#060F1E 100%)', border: '1.5px solid rgba(212,175,55,0.28)', borderBottom: 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'mob__slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both', transition: 'transform 0.3s ease' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.7),transparent)', borderRadius: '22px 22px 0 0' }} />

        <div onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd} style={{ flexShrink: 0, padding: '14px 0 10px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(212,175,55,0.35)' }} />
        </div>

        <div style={{ flexShrink: 0, position: 'relative' }} onTouchStart={e => { touchSwipeStart.current = e.targetTouches[0].clientX; }} onTouchMove={e => { touchSwipeEnd.current = e.targetTouches[0].clientX; }} onTouchEnd={() => { const diff = touchSwipeStart.current - touchSwipeEnd.current; if (Math.abs(diff) > 40) { if (diff > 0) setImgIdx(i => Math.min(i + 1, p.images.length - 1)); else setImgIdx(i => Math.max(i - 1, 0)); } }}>
          <div style={{ overflow: 'hidden', height: 200 }}>
            <div style={{ display: 'flex', transition: 'transform 0.35s ease', transform: `translateX(-${imgIdx * 100}%)`, height: '100%' }}>
              {p.images.map((img, i) => (<img key={i} src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0 }} />))}
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(3,10,22,0.2) 0%,transparent 40%,rgba(3,10,22,0.85) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
            {p.images.map((_, i) => (<div key={i} style={{ width: i === imgIdx ? 16 : 5, height: 5, borderRadius: 3, background: i === imgIdx ? acc : 'rgba(212,175,55,0.4)', transition: 'all 0.3s' }} />))}
          </div>
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {p.featured && (<div style={{ padding: '4px 10px', borderRadius: 100, background: `linear-gradient(135deg,${acc},${acc}cc)`, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 800, color: '#040C1A' }}>⭐ FEATURED</div>)}
            {p.tag && (<div style={{ padding: '4px 10px', borderRadius: 100, background: `${p.tagColor}25`, border: `1px solid ${p.tagColor}60`, color: p.tagColor, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 700 }}>{p.tag}</div>)}
          </div>
          <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 6 }}>
            <button onClick={() => { onClose(); setTimeout(() => onVR(p), 200); }} style={{ padding: '5px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.82)', border: `1px solid ${acc}50`, fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, color: acc, cursor: 'pointer' }}>🥽 VR</button>
            <button onClick={() => { onClose(); setTimeout(() => onVideoTour(p), 200); }} style={{ padding: '5px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.82)', border: `1px solid ${acc}50`, fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, color: acc, cursor: 'pointer' }}>▶ VIDEO</button>
          </div>
          {/* FIX: removed duplicate border property */}
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', background: 'rgba(3,10,22,0.9)', border: `1px solid ${acc}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: acc, fontSize: 14 }}>✕</button>
        </div>

        <div style={{ flexShrink: 0, padding: '13px 16px 10px', borderBottom: `1px solid ${acc}12` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 16, color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>{p.title}</h2>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, color: 'rgba(199,209,219,0.55)' }}>📍 {p.location}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 17, fontWeight: 900, color: acc, lineHeight: 1 }}>{p.price}</div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, color: 'rgba(199,209,219,0.45)', marginTop: 2 }}>EMI {p.emi}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 120px', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'flex', gap: 7, padding: '12px 0', overflowX: 'auto' }}>
            {[
              p.bedrooms ? `🛏 ${p.bedrooms} BHK` : `🏷 ${p.type}`,
              `📐 ${p.area.split(' (')[0]}`, `🧭 ${p.facing}`, `✓ ${p.possession}`,
              ...(p.walkScore ? [`🚶 ${p.walkScore}`] : []),
            ].map((s, i) => (
              <div key={i} style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 10, background: `${acc}0d`, border: `1px solid ${acc}20`, fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${acc}cc`, whiteSpace: 'nowrap' }}>{s}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 5, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, background: tab === t.id ? `linear-gradient(135deg,${acc},${acc}cc)` : 'rgba(7,16,32,0.9)', color: tab === t.id ? '#040C1A' : `${acc}75`, transition: 'all 0.2s' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {tab === 'info' && (
            <div>
              <div style={{ background: `${acc}08`, border: `1px solid ${acc}18`, borderRadius: 14, padding: '14px', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, color: acc, marginBottom: 7 }}>About This Property</div>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12.5, lineHeight: 1.85, color: 'rgba(199,209,219,0.72)', margin: 0 }}>{p.description}</p>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                {p.highlights?.map((h, i) => (<span key={i} style={{ padding: '4px 10px', borderRadius: 7, background: `${acc}10`, border: `1px solid ${acc}22`, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: `${acc}aa` }}>✓ {h}</span>))}
              </div>
              {p.whyBuy && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${acc}60`, letterSpacing: '.15em', marginBottom: 2 }}>TOP REASONS TO BUY</div>
                  {p.whyBuy.map((reason, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 10, background: `${acc}08`, border: `1px solid ${acc}18` }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg,${acc},${acc}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 900, color: '#030A16' }}>{i + 1}</div>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, lineHeight: 1.6, color: 'rgba(220,230,240,0.8)' }}>{reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'gallery' && (
            <div>
              <div style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${acc}30`, marginBottom: 10 }}>
                <div style={{ overflow: 'hidden', height: 220 }}>
                  <div style={{ display: 'flex', transition: 'transform 0.35s ease', transform: `translateX(-${imgIdx * 100}%)`, height: '100%' }}>
                    {p.images.map((img, i) => (<img key={i} src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0 }} />))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 7 }}>
                {p.images.map((img, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{ borderRadius: 10, overflow: 'hidden', border: `2px solid ${i === imgIdx ? acc : 'transparent'}`, aspectRatio: '16/10', cursor: 'pointer' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'amenities' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {p.amenities.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: 'rgba(7,16,32,0.8)', border: `1px solid ${acc}14` }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: acc, flexShrink: 0, boxShadow: `0 0 8px ${acc}80` }} />
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, color: 'rgba(199,209,219,0.8)' }}>{a}</span>
                  </div>
                ))}
              </div>
              {p.specifications && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${acc}60`, letterSpacing: '.15em', marginBottom: 8 }}>SPECIFICATIONS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {Object.entries(p.specifications).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${acc}08` }}>
                        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: 'rgba(199,209,219,0.38)', letterSpacing: '.08em' }}>{k}</span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#fff', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'nearby' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {p.nearbyFacilities.map((f, i) => {
                const emoji = FACILITY_EMOJI[f.type] || '📍';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 13, background: 'rgba(7,16,32,0.8)', border: `1px solid ${acc}08` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${acc}15`, border: `1px solid ${acc}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>{emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{f.name}</div>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: 'rgba(199,209,219,0.45)' }}>{f.distance} · {f.time}</div>
                    </div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: `${acc}70` }}>{f.time}</div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'plots' && p.hasPlotSite && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: 'rgba(34,197,94,0.6)', letterSpacing: '.15em', marginBottom: 8 }}>SELECT A PLOT TO PREVIEW</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 5 }}>
                  {ALL_PLOTS.slice(0, 24).map(plot => {
                    const c = statusColorMap[plot.status];
                    const isSel = selectedMobilePlot?.id === plot.id;
                    return (
                      <button key={plot.id} onClick={() => setSelectedMobilePlot(isSel ? null : plot)}
                        style={{ aspectRatio: '1/1', borderRadius: 7, border: `2px solid ${isSel ? c : c + '50'}`, background: isSel ? `${c}30` : `${c}12`, cursor: plot.status === 'sold' ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', padding: 2, transform: isSel ? 'scale(1.12)' : 'scale(1)', boxShadow: isSel ? `0 0 10px ${c}60` : 'none', opacity: plot.status === 'sold' ? 0.5 : 1 }}>
                        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 900, color: '#fff' }}>{plot.number}</span>
                        <span style={{ fontSize: 6, color: c }}>{plot.status === 'available' ? '✓' : plot.status === 'sold' ? '✗' : '~'}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 10, justifyContent: 'center' }}>
                  {([['#22C55E', 'Avail'], ['#EF4444', 'Sold'], ['#F59E0B', 'Rsvd']] as [string, string][]).map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                      <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMobilePlot ? (
                <PlotDetailPanel plot={selectedMobilePlot} property={p} onLaunchFullVR={() => { onClose(); setTimeout(() => onVR(p), 200); }} onEnquire={() => {}} compact={true} />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>☝️</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>Tap any plot above to see details,<br />gallery & inline VR preview</div>
                  <div style={{ marginTop: 12 }}>
                    <button onClick={() => { onClose(); setTimeout(() => onDetail(p), 200); }} style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#22C55E,#22C55Ecc)', color: '#040C1A', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: '.1em' }}>🗺️ FULL SITE MAP</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '12px 16px 24px', background: `linear-gradient(0deg,rgba(6,15,30,1) 80%,rgba(6,15,30,0) 100%)`, display: 'flex', gap: 9 }}>
          <button style={{ flex: 1, padding: '13px', borderRadius: 13, border: 0, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, background: `linear-gradient(135deg,${acc},${acc}cc)`, color: '#040C1A', boxShadow: `0 4px 24px ${acc}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>🗓 Book Tour</button>
          <button style={{ flex: 1, padding: '13px', borderRadius: 13, border: `1.5px solid ${acc}50`, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, background: 'transparent', color: acc, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>📞 Call Now</button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   DESKTOP PROPERTY CARD
══════════════════════════════════════════════════════════════ */
interface DesktopPropertyCardProps {
  p: Property;
  onVR: () => void;
  onDetail: () => void;
  onVideoTour: () => void;
}
const DesktopPropertyCard = ({ p, onVR, onDetail, onVideoTour }: DesktopPropertyCardProps) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  // FIX: tab type union includes all valid values
  const [tab, setTab] = useState<'overview' | 'whybuy' | 'specs' | 'location' | 'plots'>('overview');
  const [showVideoHover, setShowVideoHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const acc = p.accentColor;
  const [cardPlot, setCardPlot] = useState<Plot | null>(() => {
    const samplePlots = ALL_PLOTS.filter(pl => pl.status === 'available').slice(0, 6);
    return samplePlots[0] || null;
  });

  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) { videoRef.current.play().catch(() => {}); }
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [hovered]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowVideoHover(false); }}
      style={{ borderRadius: 22, overflow: 'hidden', background: 'rgba(4,10,22,0.97)', border: `1.5px solid ${hovered ? acc + '60' : 'rgba(255,255,255,0.07)'}`, transition: 'all .35s cubic-bezier(0.22,1,0.36,1)', transform: hovered ? 'translateY(-6px)' : 'none', boxShadow: hovered ? `0 28px 70px rgba(0,0,0,0.75), 0 0 0 1px ${acc}30` : '0 12px 40px rgba(0,0,0,0.5)' }}
    >
      <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
        <img src={p.images[imgIdx]} alt={p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity .5s, transform .5s', opacity: hovered && showVideoHover ? 0 : 1, transform: hovered ? 'scale(1.04)' : 'scale(1)', filter: 'brightness(0.72)' }} />
        <video ref={videoRef} src={p.videoUrl} muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: hovered && showVideoHover ? 1 : 0, transition: 'opacity .6s' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 45%, rgba(4,10,22,1) 100%)', zIndex: 2 }} />

        <button onMouseEnter={() => setShowVideoHover(true)} onMouseLeave={() => setShowVideoHover(false)} onClick={onVideoTour}
          style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, padding: '5px 11px', borderRadius: 8, background: showVideoHover ? `${acc}cc` : 'rgba(0,0,0,0.75)', border: `1px solid ${acc}60`, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 700, color: showVideoHover ? '#030A16' : acc, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all .2s', backdropFilter: 'blur(8px)' }}>
          <span>▶</span> VIDEO TOUR
        </button>

        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {p.featured && (<span style={{ padding: '4px 10px', borderRadius: 100, background: `linear-gradient(135deg,${acc},${acc}aa)`, color: '#040C1A', fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 800, letterSpacing: '.08em' }}>⭐ FEATURED</span>)}
          {p.tag && (<span style={{ padding: '4px 10px', borderRadius: 100, background: `${p.tagColor}25`, border: `1px solid ${p.tagColor}60`, color: p.tagColor, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 700 }}>{p.tag}</span>)}
        </div>

        {p.images.length > 1 && (
          <>
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, zIndex: 5 }}>
              {p.images.map((_, i) => (<button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 16 : 5, height: 5, borderRadius: 3, border: 'none', cursor: 'pointer', background: i === imgIdx ? acc : `${acc}40`, transition: 'all .3s', padding: 0 }} />))}
            </div>
            <button onClick={() => setImgIdx(i => i === 0 ? p.images.length - 1 : i - 1)} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: `1px solid ${acc}30`, color: acc, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, zIndex: 5 }}>‹</button>
            <button onClick={() => setImgIdx(i => (i + 1) % p.images.length)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: `1px solid ${acc}30`, color: acc, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, zIndex: 5 }}>›</button>
          </>
        )}

        <button onClick={onVR} style={{ position: 'absolute', bottom: 10, right: 12, padding: '5px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.82)', border: `1px solid ${acc}50`, fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, color: acc, cursor: 'pointer', zIndex: 5 }}>🥽 VR</button>
      </div>

      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 'clamp(1rem,1.6vw,1.12rem)', color: '#fff', margin: '0 0 5px', lineHeight: 1.2 }}>{p.title}</h3>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: `${acc}80`, display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 10, height: 10 }}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              {p.location}
            </div>
          </div>
          {p.walkScore && <WalkScoreRing score={p.walkScore} acc={acc} />}
        </div>

        <div style={{ padding: '14px 16px', borderRadius: 14, background: `linear-gradient(135deg,${acc}14,${acc}07)`, border: `1px solid ${acc}28`, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.1rem,1.8vw,1.28rem)', fontWeight: 900, color: acc }}>{p.price}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: `${acc}60`, marginTop: 2 }}>{p.pricePerSqft}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>EMI from</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 800, color: '#fff' }}>{p.emi}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
          {[p.area.split(' ')[0] + ' sqft', ...(p.bedrooms ? [`${p.bedrooms} BHK`] : []), p.facing + ' Facing', p.possession, p.vastu ? '✓ Vastu' : '', p.floors !== 'N/A' ? p.floors : ''].filter(Boolean).map((s, i) => (
            <span key={i} style={{ padding: '4px 10px', borderRadius: 7, background: `${acc}0d`, border: `1px solid ${acc}20`, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: `${acc}cc` }}>{s}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
          {p.highlights?.map((h, i) => (<span key={i} style={{ padding: '3px 9px', borderRadius: 6, background: `${acc}10`, border: `1px solid ${acc}22`, fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: `${acc}aa` }}>✓ {h}</span>))}
        </div>

        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${acc}14`, marginBottom: 0, overflowX: 'auto' }}>
          {/* FIX: typed array as [typeof tab, string, string][] to ensure id is the correct union type */}
          {([
            ['overview', '📖', 'Overview'],
            ['whybuy', '💡', 'Why Buy'],
            ['specs', '🔧', 'Specs'],
            ['location', '📍', 'Nearby'],
            ...(p.hasPlotSite ? [['plots', '🗺️', 'Plots']] : []),
          ] as ['overview' | 'whybuy' | 'specs' | 'location' | 'plots', string, string][]).map(([id, icon, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, minWidth: 56, padding: '8px 4px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 7.5, letterSpacing: '.03em', background: tab === id ? `${acc}20` : 'transparent', color: tab === id ? acc : 'rgba(255,255,255,0.3)', borderBottom: tab === id ? `2px solid ${acc}` : '2px solid transparent', transition: 'all .2s', whiteSpace: 'nowrap' }}>
              {icon} {label}
            </button>
          ))}
        </div>

        <div style={{ padding: '14px 0 12px', minHeight: 120, maxHeight: tab === 'plots' ? 560 : 160, overflowY: 'auto', transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
          {tab === 'overview' && (
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, lineHeight: 1.85, color: 'rgba(199,209,219,0.62)', margin: '0 0 12px' }}>{p.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {p.amenities.map((a, i) => (<span key={i} style={{ padding: '4px 9px', borderRadius: 100, fontSize: 10, background: `${acc}0d`, border: `1px solid ${acc}1a`, color: `${acc}bb`, fontFamily: "'DM Sans',sans-serif" }}>✦ {a}</span>))}
              </div>
            </div>
          )}
          {tab === 'whybuy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, color: `${acc}60`, letterSpacing: '.15em', marginBottom: 3 }}>TOP REASONS TO BUY</div>
              {p.whyBuy?.map((reason, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 11px', borderRadius: 10, background: `${acc}08`, border: `1px solid ${acc}18` }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg,${acc},${acc}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 900, color: '#030A16' }}>{i + 1}</div>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, lineHeight: 1.6, color: 'rgba(220,230,240,0.8)' }}>{reason}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'specs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {p.specifications && Object.entries(p.specifications).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${acc}08` }}>
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: 'rgba(199,209,219,0.38)', letterSpacing: '.08em' }}>{k}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#fff', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {p.nearbyFacilities.map((f, i) => {
                const emoji = FACILITY_EMOJI[f.type] || '📍';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${acc}08` }}>
                    <span style={{ fontSize: 14 }}>{emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: '#fff' }}>{f.name}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9.5, color: 'rgba(199,209,219,0.35)' }}>{f.distance} · {f.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {tab === 'plots' && p.hasPlotSite && (
            <div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 10, overflowX: 'auto' }}>
                {ALL_PLOTS.slice(0, 10).map(plot => {
                  const statusColorMap: Record<PlotStatus, string> = { available: '#22C55E', sold: '#EF4444', reserved: '#F59E0B' };
                  const c = statusColorMap[plot.status];
                  const isSel = cardPlot?.id === plot.id;
                  return (
                    <button key={plot.id} onClick={() => setCardPlot(plot)}
                      style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 7, border: `2px solid ${isSel ? c : c + '40'}`, background: isSel ? `${c}30` : `${c}10`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', transform: isSel ? 'scale(1.12)' : 'scale(1)' }}>
                      <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 900, color: '#fff' }}>{plot.number}</span>
                    </button>
                  );
                })}
                <button onClick={onDetail} style={{ flexShrink: 0, padding: '0 10px', height: 34, borderRadius: 7, border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.08)', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontSize: 7, color: '#D4AF37', whiteSpace: 'nowrap' }}>ALL 60 →</button>
              </div>
              {cardPlot && (
                <PlotDetailPanel plot={cardPlot} property={p} onLaunchFullVR={() => onVR()} onEnquire={() => {}} compact={true} />
              )}
            </div>
          )}
        </div>

        <div style={{ padding: '0 0 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
          <button onClick={onVR} style={{ padding: '11px 6px', borderRadius: 11, background: `linear-gradient(135deg,${acc},${acc}cc)`, color: '#040C1A', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 8.5, letterSpacing: '.06em', boxShadow: `0 0 20px ${acc}30` }}>🥽 VR</button>
          <button onClick={onVideoTour} style={{ padding: '11px 6px', borderRadius: 11, background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${acc}38`, color: acc, cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 8.5, letterSpacing: '.06em' }}>▶ VIDEO</button>
          {p.hasPlotSite ? (
            <button onClick={onDetail} style={{ padding: '11px 6px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: `1.5px solid rgba(255,255,255,0.12)`, color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 600, fontSize: 8.5 }}>🗺️ MAP</button>
          ) : (
            <button style={{ padding: '11px 6px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: `1.5px solid rgba(255,255,255,0.12)`, color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 600, fontSize: 8.5 }}>📞 CALL</button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MOBILE CARD
══════════════════════════════════════════════════════════════ */
interface MobilePropertyCardProps {
  p: Property;
  onOpen: (p: Property) => void;
}
const MobilePropertyCard = ({ p, onOpen }: MobilePropertyCardProps) => {
  const acc = p.accentColor || '#D4AF37';
  return (
    <article onClick={() => onOpen(p)} style={{ borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(170deg,rgba(13,30,58,0.95),rgba(6,15,30,0.9))', border: `1.5px solid rgba(212,175,55,0.16)`, boxShadow: '0 8px 32px rgba(0,0,0,0.55)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
      <div style={{ position: 'relative' }}>
        <img src={p.image} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover', filter: 'brightness(0.65)', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(3,10,22,0.9) 100%)' }} />
        {p.featured && (<div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 100, background: `linear-gradient(135deg,${acc},${acc}cc)`, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 800, color: '#040C1A' }}>⭐ FEATURED</div>)}
        {p.tag && (<div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 100, background: `${p.tagColor}25`, border: `1px solid ${p.tagColor}60`, color: p.tagColor, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 700 }}>{p.tag}</div>)}
        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
          {['▶ VIDEO', '🥽 VR'].map(t => (<div key={t} style={{ padding: '4px 9px', borderRadius: 100, background: 'rgba(2,7,18,0.88)', border: `1px solid ${acc}35`, fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 700, color: acc }}>{t}</div>))}
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 800, fontSize: 15, color: '#fff', margin: '0 0 4px' }}>{p.title}</h3>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, color: 'rgba(199,209,219,0.55)', marginBottom: 12 }}>📍 {p.location}</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${acc}10` }}>
          {p.bedrooms ? (
            <><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: 'rgba(199,209,219,0.6)' }}>🛏 {p.bedrooms} BHK</span><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: 'rgba(199,209,219,0.6)' }}>🚿 {p.bathrooms} Bath</span></>
          ) : (
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: 'rgba(199,209,219,0.6)' }}>🏷 {p.type}</span>
          )}
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: 'rgba(199,209,219,0.6)' }}>📐 {p.area.split(' (')[0]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 17, fontWeight: 900, color: acc }}>{p.price}</div>
          <div style={{ padding: '8px 16px', borderRadius: 100, background: `linear-gradient(135deg,${acc},${acc}cc)`, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, color: '#040C1A' }}>Details →</div>
        </div>
      </div>
    </article>
  );
};

/* ══════════════════════════════════════════════════════════════
   CONTACT STRIP
══════════════════════════════════════════════════════════════ */
const ContactStrip = () => (
  <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(3,10,22,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(212,175,55,0.18)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'bwPulse 2s ease-out infinite' }} />
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Our agents are online — get instant answers</div>
    </div>
    <div style={{ display: 'flex', gap: 7 }}>
      <button style={{ padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#030A16', border: 'none', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '.08em' }}>📞 CALL NOW</button>
      <button style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(34,197,94,0.15)', border: '1.5px solid rgba(34,197,94,0.5)', color: '#22C55E', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9 }}>💬 WHATSAPP</button>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   HERO HEADER
══════════════════════════════════════════════════════════════ */
interface HeroHeaderProps {
  visible: boolean;
  search: string;
  setSearch: (value: string) => void;
  selType: string;
  setSelType: (value: string) => void;
  filtered: Property[];
  isMobile: boolean;
}
const HeroHeader = ({ visible, search, setSearch, selType, setSelType, filtered, isMobile }: HeroHeaderProps) => {
  const types = ['All', 'Villa', 'Plot', 'Land'];
  const fadeUp = (delay: number = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(36px)',
    transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay * 110}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay * 110}ms`,
  });

  return (
    <header style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#030A16' }}>
      <div style={{ position: 'absolute', top: '-12%', left: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%)', filter: 'blur(70px)', animation: 'driftA 28s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-12%', right: '-8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,201,122,0.04) 0%,transparent 62%)', filter: 'blur(90px)', animation: 'driftB 34s ease-in-out infinite 3s', pointerEvents: 'none', zIndex: 0 }} />
      <AnimatedGrid fixed={false} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: isMobile ? '80px 20px 60px' : '100px 24px 80px', maxWidth: 860, margin: '0 auto', width: '100%', ...fadeUp(0) }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: isMobile ? 20 : 28, padding: '10px 22px', borderRadius: 10, background: 'rgba(2,7,18,0.88)', backdropFilter: 'blur(28px)', border: '1px solid rgba(212,175,55,0.32)', boxShadow: '0 0 55px rgba(212,175,55,0.15)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', animation: 'pulseDot 2.4s ease-out infinite' }} />
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: isMobile ? 8 : 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D4AF37' }}>BIGWAY REAL ESTATE · COIMBATORE</span>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', animation: 'pulseDot 2.4s ease-out infinite 0.7s' }} />
        </div>

        <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? 'clamp(2.4rem,9vw,3.4rem)' : 'clamp(2.8rem,6.5vw,5.2rem)', lineHeight: 1.05, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Premium</h1>
        <span style={{ display: 'block', fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? 'clamp(2.4rem,9vw,3.4rem)' : 'clamp(2.8rem,6.5vw,5.2rem)', lineHeight: 1.05, margin: '0 0 12px', background: 'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 8s linear infinite', letterSpacing: '-0.03em' }}>Properties</span>

        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: isMobile ? 13 : 'clamp(1rem,1.7vw,1.18rem)', lineHeight: 2.0, color: 'rgba(199,209,219,0.68)', maxWidth: 520, margin: '0 auto 24px', fontWeight: 400 }}>
          {isMobile ? 'Plots · Villas · Agricultural Land · Coimbatore\'s Finest' : 'Video Tours · 360° VR Walkthroughs · 60-Plot Site Map.\nDiscover luxury villas, premium plots & agricultural land.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: isMobile ? 18 : 24 }}>
          <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)' }} />
          <div style={{ width: 7, height: 7, background: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 14px rgba(212,175,55,0.85)', animation: 'gemGlow 3.8s ease-in-out infinite' }} />
          <div style={{ height: 1, width: 80, background: 'linear-gradient(270deg,transparent,rgba(212,175,55,0.5),transparent)' }} />
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28, ...fadeUp(2) }}>
            {([['▶', 'Video Tour'], ['🥽', 'VR 360°'], ['🗺️', '60-Plot Map'], ['💡', 'Why Buy'], ['📐', 'Walk Score'], ['📞', 'Live Support']] as [string, string][]).map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)', cursor: 'default' }}>
                <span style={{ fontSize: 12 }}>{icon}</span>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, color: 'rgba(212,175,55,0.8)', letterSpacing: '.07em' }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ maxWidth: 520, margin: '0 auto 16px', position: 'relative', ...fadeUp(3) }}>
          <div style={{ position: 'absolute', inset: -1, borderRadius: 100, background: 'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37)', opacity: 0.25, filter: 'blur(12px)', zIndex: -1 }} />
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(2,7,18,0.92)', backdropFilter: 'blur(20px)', borderRadius: 100, border: '1.5px solid rgba(212,175,55,0.3)', overflow: 'hidden' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" style={{ width: 16, height: 16, flexShrink: 0, marginLeft: 18, opacity: 0.7 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by location, type, price…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '14px 16px', fontFamily: "'Poppins',sans-serif", fontSize: 14, color: '#fff' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', flexWrap: 'wrap', marginBottom: isMobile ? 16 : 20, ...fadeUp(4) }}>
          {types.map(t => (
            <button key={t} onClick={() => setSelType(t)}
              style={{ padding: '8px 20px', borderRadius: 100, cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', background: selType === t ? 'linear-gradient(135deg,#D4AF37,#F5C97A)' : 'rgba(7,16,32,0.9)', color: selType === t ? '#040C1A' : 'rgba(212,175,55,0.65)', boxShadow: selType === t ? '0 6px 28px rgba(212,175,55,0.45)' : 'none', border: selType === t ? 'none' : '1px solid rgba(212,175,55,0.18)', transform: selType === t ? 'scale(1.06)' : 'scale(1)', transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)' }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', marginBottom: 0, ...fadeUp(5) }}>
          {[{ n: '4', l: 'Properties' }, { n: '60', l: 'Plots' }, { n: '3', l: 'Locations' }, { n: '₹2.5Cr', l: 'From' }].map((s, i, arr) => (
            <div key={s.l} style={{ textAlign: 'center', padding: isMobile ? '11px 16px' : '14px 24px', background: 'rgba(4,10,22,0.82)', backdropFilter: 'blur(16px)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: i === 0 ? '12px 0 0 12px' : i === arr.length - 1 ? '0 12px 12px 0' : '0', borderRight: i !== arr.length - 1 ? 'none' : '1px solid rgba(212,175,55,0.18)' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: isMobile ? 18 : 22, fontWeight: 900, color: '#D4AF37', lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, color: 'rgba(212,175,55,0.55)', letterSpacing: '.1em' }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, fontFamily: "'Poppins',sans-serif", fontSize: 12, color: 'rgba(199,209,219,0.38)', ...fadeUp(6) }}>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: isMobile ? 15 : 18, fontWeight: 800, color: '#D4AF37' }}>{filtered.length}</span> properties found
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, #030A16)', zIndex: 5, pointerEvents: 'none' }} />
    </header>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function BigwayPropertiesResponsive() {
  const [search, setSearch] = useState('');
  const [selType, setSelType] = useState('All');
  const [visible, setVisible] = useState(false);
  const [vrState, setVrState] = useState<{ property: Property; plotOverride?: Plot | null } | null>(null);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [videoTourProperty, setVideoTourProperty] = useState<Property | null>(null);
  const [mobileModal, setMobileModal] = useState<Property | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  const filtered = PROPERTIES.filter(p => {
    const mt = selType === 'All' || p.type === selType;
    const mq = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return mt && mq;
  });

  const launchVR = (property: Property, plotOverride: Plot | null = null) => setVrState({ property, plotOverride });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&family=Lato:wght@300;400;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; -webkit-font-smoothing:antialiased; }
        html { scroll-behavior:smooth; }
        body { background:#030A16; overflow-x:hidden; }

        @keyframes driftA      { 0%,100%{transform:translate(0,0)}  50%{transform:translate(22px,-30px)} }
        @keyframes driftB      { 0%,100%{transform:translate(0,0)}  50%{transform:translate(-18px,24px)} }
        @keyframes shimmer     { 0%{background-position:-200%}       100%{background-position:200%} }
        @keyframes bwPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.7)} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0)} }
        @keyframes pulseDot    { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.7)} 60%{box-shadow:0 0 0 9px rgba(212,175,55,0)} }
        @keyframes gemGlow     { 0%,100%{box-shadow:0 0 10px rgba(212,175,55,0.65)} 50%{box-shadow:0 0 32px rgba(212,175,55,1)} }
        @keyframes mob__slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes mob__fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(212,175,55,0.2); border-radius:2px; }

        .prop__grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        @media(max-width:1100px){ .prop__grid{ grid-template-columns:repeat(2,1fr); gap:18px; } }
        @media(max-width:640px){ .prop__grid{ grid-template-columns:1fr; } }

        input::placeholder { color:rgba(255,255,255,0.3); }
        input:focus { outline:none; }
      `}</style>

      {vrState && <VRViewer property={vrState.property} plotOverride={vrState.plotOverride} onClose={() => setVrState(null)} />}
      {videoTourProperty && <VideoTourModal property={videoTourProperty} onClose={() => setVideoTourProperty(null)} />}

      {isMobile && mobileModal && !vrState && !videoTourProperty && (
        <MobileBottomSheet
          p={mobileModal}
          onClose={() => setMobileModal(null)}
          onVR={(p) => { setMobileModal(null); setTimeout(() => launchVR(p), 200); }}
          onVideoTour={(p) => { setMobileModal(null); setTimeout(() => setVideoTourProperty(p), 200); }}
          onDetail={(p) => { setMobileModal(null); setTimeout(() => setDetailProperty(p), 200); }}
        />
      )}

      {detailProperty && !vrState && (
        <PlotSiteDetailPage
          property={detailProperty}
          onBack={() => setDetailProperty(null)}
          onVR={(prop, plot) => launchVR(prop, plot)}
        />
      )}

      {!detailProperty && !vrState && (
        <div style={{ background: '#030A16', minHeight: '100vh', position: 'relative', paddingBottom: 80 }}>
          <HeroHeader
            visible={visible}
            search={search}
            setSearch={setSearch}
            selType={selType}
            setSelType={setSelType}
            filtered={filtered}
            isMobile={isMobile}
          />

          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <AnimatedGrid fixed={true} />
          </div>
          <div style={{ position: 'fixed', top: '-8%', right: '-8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 65%)', filter: 'blur(90px)', animation: 'driftA 26s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 }} />

          <main style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto', padding: isMobile ? '40px 16px 40px' : '60px 24px 40px' }}>
            <div className={isMobile ? '' : 'prop__grid'} style={isMobile ? { display: 'flex', flexDirection: 'column', gap: 14 } : {}}>
              {filtered.map((p, idx) => (
                <div key={p.id} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : `translateY(${30 + idx * 6}px)`, transition: `opacity .6s ${idx * 0.08}s ease, transform .6s ${idx * 0.08}s ease` }}>
                  {isMobile ? (
                    <MobilePropertyCard p={p} onOpen={(prop) => setMobileModal(prop)} />
                  ) : (
                    <DesktopPropertyCard
                      p={p}
                      onVR={() => launchVR(p)}
                      onDetail={() => setDetailProperty(p)}
                      onVideoTour={() => setVideoTourProperty(p)}
                    />
                  )}
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 800, color: 'rgba(212,175,55,0.35)', marginBottom: 8 }}>No properties found</div>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: 'rgba(199,209,219,0.35)' }}>Try adjusting your search or filters</div>
              </div>
            )}
          </main>

          <ContactStrip />
        </div>
      )}
    </>
  );
}