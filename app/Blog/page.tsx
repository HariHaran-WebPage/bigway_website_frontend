'use client';
import React, { useState, useEffect, useRef, RefObject } from 'react';


interface Breakpoint {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  w: number;
}

interface Blog {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  thumb: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorInitial: string;
  seoKeywords: string[];
  excerpt: string;
  content: Array<{ heading: string; body: string }>;
}

type Blip = {
  col: number;
  progress: number;
  speed: number;
  alpha: number;
};

/* ============================================================
   RESPONSIVE HOOK
============================================================ */
function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>({ isMobile: false, isTablet: false, isDesktop: true, w: 1200 });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp({ isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, w });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return bp;
}

/* ============================================================
   ANIMATED GRID CANVAS (desktop only for perf)
============================================================ */
interface AnimatedGridProps {
  enabled: boolean;
}

const AnimatedGrid: React.FC<AnimatedGridProps> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const frame = useRef(0);
  const blips = useRef<Blip[]>([]);

  useEffect(() => {
    if (!enabled) return;
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

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const blipInterval = setInterval(() => {
      const cols = 14;
      blips.current.push({
        col: Math.floor(Math.random() * cols),
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        alpha: 0.7 + Math.random() * 0.3,
      });
    }, 900);

    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W, H);
      const COLS = 14, ROWS = 10;
      const cellW = W / COLS, cellH = H / ROWS;
      const t = frame.current * 0.012;

      for (let c = 0; c <= COLS; c++) {
        const x = c * cellW;
        const proximity = Math.max(0, 1 - Math.sqrt((x - mouse.current.x) ** 2 + (H / 2 - mouse.current.y) ** 2) / 300);
        const a = 0.06 + proximity * 0.22;
        const g = ctx.createLinearGradient(x, 0, x, H);
        g.addColorStop(0, `rgba(212,175,55,0)`); g.addColorStop(0.3, `rgba(212,175,55,${a})`);
        g.addColorStop(0.7, `rgba(212,175,55,${a})`); g.addColorStop(1, `rgba(212,175,55,0)`);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.strokeStyle = g; ctx.lineWidth = proximity > 0.4 ? 1.5 : 0.8; ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        const y = r * cellH;
        const proximity = Math.max(0, 1 - Math.sqrt((W / 2 - mouse.current.x) ** 2 + (y - mouse.current.y) ** 2) / 300);
        const a = 0.06 + proximity * 0.22;
        const g = ctx.createLinearGradient(0, y, W, y);
        g.addColorStop(0, `rgba(212,175,55,0)`); g.addColorStop(0.2, `rgba(212,175,55,${a})`);
        g.addColorStop(0.8, `rgba(212,175,55,${a})`); g.addColorStop(1, `rgba(212,175,55,0)`);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = g; ctx.lineWidth = proximity > 0.4 ? 1.5 : 0.8; ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        for (let r = 0; r <= ROWS; r++) {
          const x = c * cellW, y = r * cellH;
          const dist = Math.sqrt((x - mouse.current.x) ** 2 + (y - mouse.current.y) ** 2);
          const proximity = Math.max(0, 1 - dist / 200);
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + c * 0.5 + r * 0.7);
          const size = 1.2 + pulse * 0.6 + proximity * 4;
          ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${0.12 + pulse * 0.1 + proximity * 0.65})`; ctx.fill();
        }
      }
      const scanY = (Math.sin(t * 0.3) * 0.5 + 0.5) * H;
      const lineG = ctx.createLinearGradient(0, 0, W, 0);
      lineG.addColorStop(0, 'rgba(212,175,55,0)'); lineG.addColorStop(0.1, 'rgba(212,175,55,0.25)');
      lineG.addColorStop(0.5, 'rgba(245,201,122,0.55)'); lineG.addColorStop(0.9, 'rgba(212,175,55,0.25)');
      lineG.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY);
      ctx.strokeStyle = lineG; ctx.lineWidth = 1.5; ctx.stroke();

      blips.current = blips.current.filter(b => b.progress < 1);
      for (const blip of blips.current) {
        blip.progress += blip.speed;
        const x = blip.col * cellW, y = blip.progress * H, trail = 60;
        const bg = ctx.createLinearGradient(x, y - trail, x, y + 10);
        bg.addColorStop(0, 'rgba(212,175,55,0)'); bg.addColorStop(1, `rgba(255,220,100,${blip.alpha})`);
        ctx.beginPath(); ctx.moveTo(x, y - trail); ctx.lineTo(x, y);
        ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,100,${blip.alpha})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(blipInterval);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

/* ============================================================
   ICONS
============================================================ */
const IconClock: React.FC = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconArrow: React.FC = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IconArrowLeft: React.FC = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
const IconSearch: React.FC = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconShare: React.FC = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
const IconBookmark: React.FC = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>;
const IconMenu: React.FC = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 20, height: 20 }}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
const IconClose: React.FC = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 20, height: 20 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

/* ============================================================
   BLOG DATA
═══════════════════════════════════════════════════ */
const BLOGS = [
  {
    id: 1, slug: 'best-areas-buy-property-chennai',
    title: 'Best Areas to Buy Property in Chennai',
    subtitle: 'A complete locality guide for smart investors and homebuyers in 2025',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=85',
    category: 'Market Guide', readTime: '9 min read', date: 'February 10, 2025',
    author: 'Bigway Research Team', authorInitial: 'BR',
    seoKeywords: ['best areas Chennai', 'investment localities', 'property guide 2025', 'OMR real estate', 'Anna Nagar property'],
    excerpt: "Chennai is one of South India's fastest-growing real estate markets. With the right locality knowledge, you can secure exceptional returns and an ideal lifestyle.",
    content: [
      { heading: 'Why Chennai Real Estate Is Booming', body: `Chennai has consistently ranked among India's top-performing real estate cities, driven by a thriving IT corridor, robust automobile manufacturing hubs, and world-class healthcare infrastructure. With the metro rail expansion, improved OMR flyovers, and the Chennai Peripheral Ring Road project, connectivity across the city has transformed dramatically.\n\nFor buyers in 2025, Chennai offers a rare combination of affordability compared to Mumbai or Bengaluru, strong rental yields averaging 3–5%, and steady capital appreciation of 8–12% annually in premium corridors.` },
      { heading: '1. OMR — The IT Corridor', body: `OMR stretches from Madhya Kailash to Siruseri — Chennai's most dynamic residential belt. Hosting IT parks of Infosys, TCS, Wipro, and Cognizant, this corridor supports enormous demand for both rental and owner-occupied housing.\n\n**Key localities:** Perungudi, Sholinganallur, Karapakkam, Thoraipakkam, Navalur, Perumbakkam\n\n**Why invest:** Rental yields of 4–5.5%, steady appreciation. Prices: ₹5,500–₹9,500 per sq ft.\n\n**Best for:** IT professionals, rental investors seeking consistent occupancy.` },
      { heading: '2. Anna Nagar — The Evergreen Hub', body: `Anna Nagar remains one of Chennai's most prestigious addresses, combining excellent civic infrastructure, top-tier schools, hospitals, and retail.\n\n**Key localities:** Anna Nagar West, East, Arumbakkam, Kilpauk\n\n**Why invest:** High NRI demand, established infrastructure. Prices: ₹9,000–₹16,000 per sq ft.\n\n**Best for:** End-users seeking prestigious addresses, NRI investors.` },
      { heading: '3. Porur & Velachery — Growth Zones', body: `Porur has emerged as Chennai's western investment hotspot, benefiting from the Salem NH bypass and upcoming metro phase 2. Velachery sits at the intersection of OMR, GST Road, and the metro corridor.\n\n**Porur pricing:** ₹5,000–₹7,500 per sq ft. **Velachery pricing:** ₹7,000–₹11,000 per sq ft.\n\n**Best for:** Budget investors with 5–7 year horizon.` },
      { heading: 'Investment Evaluation Checklist', body: `Before finalising any Chennai locality, carefully evaluate: RERA registration, title clarity, proximity to employment hubs, historical appreciation data, water infrastructure quality, flood zone classification, and the builder's delivery track record.\n\nAt Bigway Real Estate, our team provides detailed market intelligence across Tamil Nadu. Contact us for a free, no-obligation consultation.` },
    ],
  },
  {
    id: 2, slug: 'home-loan-process-india',
    title: 'Home Loan Process in India: Step-by-Step Guide',
    subtitle: 'Everything you need to know — from eligibility to disbursement',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=85',
    category: 'Finance Guide', readTime: '8 min read', date: 'January 28, 2025',
    author: 'Bigway Finance Desk', authorInitial: 'FD',
    seoKeywords: ['home loan India', 'housing finance', 'CIBIL score', 'EMI calculator', 'SBI HDFC loan'],
    excerpt: 'Navigating the home loan process can feel overwhelming. This comprehensive step-by-step guide walks you through every stage — from eligibility check to final disbursement.',
    content: [
      { heading: 'Understanding Home Loans in India', body: `A home loan is a secured credit facility offered by banks and NBFCs to purchase, construct, or renovate residential property. Home loan interest rates in 2025 range from 8.35% to 10.5% per annum, linked to the RBI repo rate. For a ₹50 lakh loan at 8.75% for 20 years, the monthly EMI is approximately ₹44,200.` },
      { heading: 'Step 1: Assess Eligibility', body: `**Income & Employment:** Salaried applicants need minimum 2 years of stable employment. Self-employed need 3 years of ITR filing. Most lenders permit up to 60–65% of net income as total EMI.\n\n**Credit Score:** A CIBIL score of 750+ unlocks best rates. Below 650 makes approval significantly harder.\n\n**LTV Ratio:** Banks fund up to 90% for loans up to ₹30 lakhs, 80% for ₹30–75 lakhs, 75% above ₹75 lakhs.` },
      { heading: 'Step 2: Compare Lenders', body: `Don't compare interest rates alone. Evaluate: processing fees (0.25–1%), prepayment penalties, legal charges, turnaround time, and digital service quality.\n\nAt Bigway, we maintain tie-ups with 15+ banks and NBFCs. Our clients consistently save 0.15%–0.5% on interest rates — translating to lakhs in savings over a 20-year tenure.` },
      { heading: 'Step 3–4: Documents & Disbursement', body: `**For Salaried:** Last 3 months' salary slips, Form 16, 6 months' bank statements, PAN + Aadhaar.\n\n**For Self-Employed:** Last 3 years' ITR, 12 months' business account statement, GST registration.\n\nLegal Verification and Technical Valuation take 3–7 working days. A Sanction Letter is issued valid for 3–6 months.\n\n**Tax Benefits:** Section 80C: ₹1.5 lakh on principal. Section 24(b): ₹2 lakh on interest.` },
    ],
  },
  {
    id: 3, slug: 'documents-required-property-purchase',
    title: 'Documents Required for Property Purchase in India',
    subtitle: 'The definitive checklist to ensure a legally safe and seamless transaction',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=85',
    category: 'Legal Guide', readTime: '7 min read', date: 'January 15, 2025',
    author: 'Bigway Legal Team', authorInitial: 'LT',
    seoKeywords: ['property documents India', 'sale deed checklist', 'encumbrance certificate', 'RERA check', 'property registration'],
    excerpt: "Missing even one key document can lead to legal disputes, delayed registration, or loan rejection. Here is Bigway's definitive document checklist.",
    content: [
      { heading: 'Why Verification Is Non-Negotiable', body: `Property transactions in India are governed by the Transfer of Property Act 1882 and the Registration Act 1908. Failure to verify documents can expose buyers to ownership disputes, mortgage fraud, loan rejection, and significant regulatory penalties.\n\nReal estate fraud is prevalent — a thorough checklist is your first line of defence.` },
      { heading: 'Title & Ownership Documents', body: `**Sale Deed (Registered):** The most critical document — establishes transfer of ownership. Must be registered at the Sub-Registrar's office.\n\n**Mother Deed:** Chain of title tracing back 30 years. Reveals historical disputes or encumbrances.\n\n**Encumbrance Certificate (EC):** Shows all registered transactions — mortgages, liens, and legal charges. A clean EC for 13–30 years is a green signal.` },
      { heading: 'Approvals & RERA Compliance', body: `**Approved Building Plan:** Sanctioned by local planning authority. Confirms construction is legal and within FSI limits.\n\n**Completion & Occupancy Certificates:** Required for home loan disbursement and confirming structural safety.\n\n**RERA Registration:** Mandatory for all projects after May 2017. Verify on tnrera.in for Tamil Nadu.` },
      { heading: 'KYC, Stamp Duty & Registration', body: `**Identity Documents:** PAN Card (mandatory above ₹50,000), Aadhaar, photographs, address proof.\n\n**Stamp Duty:** Tamil Nadu imposes 7% stamp duty plus 4% registration charges on market value.\n\nBigway's legal team conducts comprehensive title searches and 30-year encumbrance verification — included free for all clients.` },
    ],
  },
  {
    id: 4, slug: 'real-estate-investment-tips-2025',
    title: 'Real Estate Investment Tips for 2025',
    subtitle: 'Expert-backed strategies to maximise returns in a dynamic property market',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=85',
    category: 'Investment', readTime: '10 min read', date: 'January 5, 2025',
    author: 'Bigway Investment Advisory', authorInitial: 'IA',
    seoKeywords: ['investment tips 2025', 'rental yield India', 'property ROI', 'RERA projects', 'Coimbatore real estate'],
    excerpt: '2025 presents compelling real estate opportunities across India. Here are the expert-backed strategies that separate successful investors from those who miss the cycle.',
    content: [
      { heading: "Why Real Estate Remains India's Top Investment", body: `Real estate continues to attract the largest share of household savings: tangible ownership, dual returns from rent plus appreciation, home loan leverage, tax benefits under Sections 80C and 24(b), and natural inflation hedging.\n\nIn Tamil Nadu, real estate has delivered 8–14% per annum over the past decade.` },
      { heading: 'Tip 1: Location Over Luxury', body: `A modest apartment in a well-connected locality always outperforms a luxury villa in a remote area. Prioritise proximity to employment hubs, planned infrastructure upgrades, social infrastructure, and reliable utilities.\n\nIn Coimbatore: Saravanampatti, Peelamedu, Ganapathy, and Singanallur deliver above-average appreciation.` },
      { heading: 'Tip 2: RERA-Only Investments', body: `RERA provides critical protections: legally binding completion timelines, 70% of buyer payments held in escrow, and an accessible regulatory authority for disputes.\n\nAlways verify on tnrera.in. Check the developer's delivery history, delay track record, and pending complaints before committing.` },
      { heading: 'Tip 3–4: Yield & Exit Planning', body: `**Gross Rental Yield = (Annual Rent ÷ Purchase Price) × 100**\n\nTarget 3.5%+ gross yield. Commercial properties yield 5–8%, 2BHK apartments yield 3.5–5%.\n\nKeep EMI-to-income ratio below 40%. After 24 months, LTCG tax applies at 12.5% without indexation.` },
    ],
  },
];

const CATEGORIES = ['All', 'Market Guide', 'Finance Guide', 'Legal Guide', 'Investment'];

/* ============================================================
   UTILS
============================================================ */
function useFadeIn<T extends HTMLElement = HTMLElement>(threshold = 0.05): [RefObject<T | null>, boolean] {
  const [vis, setVis] = useState(false);
  const ref = useRef<T>(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, vis];
}

interface RichParaProps {
  text: string;
  style?: React.CSSProperties;
}

const RichPara: React.FC<RichParaProps> = ({ text, style }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <p style={style}>
      {parts.map((p, k) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={k} style={{ color: '#F5C97A', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : p
      )}
    </p>
  );
};

/* ============================================================
   ANIMATED DECORATIONS
============================================================ */
interface AnimatedLineProps {
  delay?: number;
}
const AnimatedLine: React.FC<AnimatedLineProps> = ({ delay = 0 }) => (
  <div style={{ width: 1, height: 60, background: 'linear-gradient(180deg,transparent,rgba(212,175,55,0.5),transparent)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-40%', left: 0, width: '100%', height: '40%', background: 'linear-gradient(180deg,transparent,rgba(255,220,100,0.95),transparent)', animation: 'lineTravelV 2.4s ease-in-out infinite', animationDelay: `${delay}s` }} />
  </div>
);

interface PulsingOrbProps {
  size?: number;
  delay?: number;
}
const PulsingOrb: React.FC<PulsingOrbProps> = ({ size = 6, delay = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle,#F5C97A 0%,#D4AF37 60%,transparent 100%)', boxShadow: `0 0 ${size * 2}px rgba(212,175,55,0.9),0 0 ${size * 4}px rgba(212,175,55,0.3)`, animation: 'orbPulse 2s ease-in-out infinite', animationDelay: `${delay}s` }} />
);

interface RotatingDiamondProps {
  delay?: number;
}
const RotatingDiamond: React.FC<RotatingDiamondProps> = ({ delay = 0 }) => (
  <div style={{ position: 'relative', width: 22, height: 22, margin: '2px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(212,175,55,0.5)', transform: 'rotate(45deg)', animation: 'diamondSpin 7s linear infinite', animationDelay: `${delay}s` }} />
    <div style={{ width: 8, height: 8, background: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 14px rgba(212,175,55,0.9)' }} />
  </div>
);

interface AnimatedStatCardProps {
  value: string;
  label: string;
  delay?: number;
  icon?: React.ReactNode;
}
const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({ value, label, delay = 0, icon }) => (
  <div style={{ padding: '14px 18px', background: 'rgba(2,7,18,0.96)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 14, textAlign: 'center', position: 'relative', overflow: 'hidden', minWidth: 120, animation: 'cardFloat 4s ease-in-out infinite', animationDelay: `${delay}s`, boxShadow: '0 8px 32px rgba(0,0,0,0.45)' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.6),transparent)' }} />
    {icon && <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{icon}</div>}
    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 800, color: '#D4AF37', lineHeight: 1, marginBottom: 5 }}>{value}</div>
    <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(199,209,219,0.6)' }}>{label}</div>
  </div>
);

/* ============================================================
   LEFT / RIGHT PANELS
============================================================ */
interface BlogLeftPanelProps {
  isVisible: boolean;
}
const BlogLeftPanel: React.FC<BlogLeftPanelProps> = ({ isVisible }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 'calc((100% - min(1000px,90vw)) / 2)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-60px)', transition: 'opacity 1.4s cubic-bezier(.22,1,.36,1) 0.3s,transform 1.4s cubic-bezier(.22,1,.36,1) 0.3s', padding: '0 20px', pointerEvents: 'none' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>
      <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg,transparent,rgba(212,175,55,0.4))' }} />
      <AnimatedStatCard value="15+" label="Articles" delay={0.2} icon={<svg width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} />
      <AnimatedLine delay={0} />
      <PulsingOrb size={6} delay={0} />
      <AnimatedLine delay={0.3} />
      <AnimatedStatCard value="4" label="Categories" delay={0.6} icon={<svg width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>} />
      <AnimatedLine delay={0.6} />
      <RotatingDiamond delay={0} />
      <AnimatedLine delay={0.9} />
      <div style={{ padding: '8px 16px', background: 'rgba(2,7,18,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 50, animation: 'cardFloat 5s ease-in-out infinite 1s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4AF37', animation: 'orbPulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>MONTHLY UPDATES</span>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4AF37', animation: 'orbPulse 1.5s ease-in-out infinite 0.7s' }} />
        </div>
      </div>
      <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg,rgba(212,175,55,0.4),transparent)' }} />
    </div>
    <div style={{ position: 'absolute', bottom: '12%', left: 14, transform: 'rotate(-90deg)', transformOrigin: 'center center', fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.35)', whiteSpace: 'nowrap' }}>BIGWAY · BLOG</div>
    <div style={{ position: 'absolute', top: '8%', left: 12, width: 18, height: 18, borderLeft: '1.5px solid rgba(212,175,55,0.4)', borderTop: '1.5px solid rgba(212,175,55,0.4)' }} />
    <div style={{ position: 'absolute', bottom: '8%', left: 12, width: 18, height: 18, borderLeft: '1.5px solid rgba(212,175,55,0.4)', borderBottom: '1.5px solid rgba(212,175,55,0.4)' }} />
  </div>
);

interface BlogRightPanelProps {
  isVisible: boolean;
}
const BlogRightPanel: React.FC<BlogRightPanelProps> = ({ isVisible }) => (
  <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 'calc((100% - min(1000px,90vw)) / 2)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(60px)', transition: 'opacity 1.4s cubic-bezier(.22,1,.36,1) 0.3s,transform 1.4s cubic-bezier(.22,1,.36,1) 0.3s', padding: '0 20px', pointerEvents: 'none' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>
      <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg,transparent,rgba(212,175,55,0.4))' }} />
      <AnimatedStatCard value="10 min" label="Avg. Read" delay={0.4} icon={<svg width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
      <AnimatedLine delay={1.1} />
      <RotatingDiamond delay={1} />
      <AnimatedLine delay={1.4} />
      <div style={{ padding: '10px 15px', background: 'rgba(2,7,18,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.28)', borderRadius: 12, animation: 'cardFloat 5s ease-in-out infinite 2s', minWidth: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <svg width="12" height="12" fill="none" stroke="#D4AF37" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
          <div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 700, letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase' }}>EXPERT AUTHORS</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 6, letterSpacing: '0.15em', color: 'rgba(212,175,55,0.55)', textTransform: 'uppercase' }}>BIGWAY TEAM</div>
          </div>
        </div>
      </div>
      <AnimatedLine delay={1.7} />
      <PulsingOrb size={6} delay={0.8} />
      <AnimatedStatCard value="100%" label="Original" delay={1.0} icon={<svg width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>} />
      <div style={{ width: 1, height: 50, background: 'linear-gradient(180deg,rgba(212,175,55,0.4),transparent)' }} />
    </div>
    <div style={{ position: 'absolute', bottom: '12%', right: 14, transform: 'rotate(90deg)', transformOrigin: 'center center', fontFamily: "'Orbitron',sans-serif", fontSize: 7, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.35)', whiteSpace: 'nowrap' }}>KNOWLEDGE · HUB</div>
    <div style={{ position: 'absolute', top: '8%', right: 12, width: 18, height: 18, borderRight: '1.5px solid rgba(212,175,55,0.4)', borderTop: '1.5px solid rgba(212,175,55,0.4)' }} />
    <div style={{ position: 'absolute', bottom: '8%', right: 12, width: 18, height: 18, borderRight: '1.5px solid rgba(212,175,55,0.4)', borderBottom: '1.5px solid rgba(212,175,55,0.4)' }} />
  </div>
);

/* ============================================================
   HERO HEADER — fully responsive
============================================================ */
interface BlogHeroHeaderProps {
  isVisible: boolean;
  isMobile: boolean;
  isTablet: boolean;
}
const BlogHeroHeader: React.FC<BlogHeroHeaderProps> = ({ isVisible, isMobile, isTablet }) => {
  const showPanels = !isMobile && !isTablet;
  return (
    <header style={{
      position: 'relative',
      minHeight: isMobile ? '60vh' : isTablet ? '75vh' : '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: '#030A16',
    }}>
      <div style={{ position: 'absolute', top: -180, left: -160, width: isMobile ? 350 : 650, height: isMobile ? 350 : 650, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%)', filter: 'blur(70px)', animation: 'au__driftA 28s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -200, right: -160, width: isMobile ? 300 : 580, height: isMobile ? 300 : 580, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,201,122,0.04) 0%,transparent 62%)', filter: 'blur(90px)', animation: 'au__driftB 34s ease-in-out infinite 3s', pointerEvents: 'none', zIndex: 0 }} />

      {showPanels && <BlogLeftPanel isVisible={isVisible} />}
      {showPanels && <BlogRightPanel isVisible={isVisible} />}

      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        padding: isMobile ? '100px 20px 50px' : isTablet ? '120px 40px 64px' : '100px 24px 64px',
        maxWidth: isMobile ? '100%' : 900, margin: '0 auto',
        opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(44px)',
        transition: 'opacity 1s cubic-bezier(.22,1,.36,1),transform 1s cubic-bezier(.22,1,.36,1)',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 20 : 28, padding: isMobile ? '10px 20px' : '12px 32px', borderRadius: 10, background: 'rgba(2,7,18,0.88)', backdropFilter: 'blur(28px)', border: '1.5px solid rgba(212,175,55,.36)', boxShadow: '0 0 56px rgba(212,175,55,.16)' }}>
          <div className="pulse-dot" />
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: isMobile ? 9 : 11, fontWeight: 700, letterSpacing: isMobile ? '.18em' : '.26em', textTransform: 'uppercase', color: '#D4AF37' }}>BIGWAY · BLOG</span>
          <div className="pulse-dot" style={{ animationDelay: '.7s' }} />
        </div>

        {!isMobile && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 8, background: 'rgba(212,175,55,.09)', border: '1px solid rgba(212,175,55,.28)', fontFamily: "'Orbitron',sans-serif", fontSize: isTablet ? 9 : 11, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: '#D4AF37' }}>INSIGHTS & EXPERTISE · SINCE 2009</div>
          </div>
        )}

        <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? 'clamp(2.5rem,10vw,3.2rem)' : isTablet ? 'clamp(3rem,6vw,4rem)' : 'clamp(3.2rem,6.5vw,5.6rem)', lineHeight: 1.04, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Real Estate</h1>
        <span style={{ display: 'block', fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? 'clamp(2.5rem,10vw,3.2rem)' : isTablet ? 'clamp(3rem,6vw,4rem)' : 'clamp(3.2rem,6.5vw,5.6rem)', lineHeight: 1.04, margin: '0 0 24px', background: 'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'au__shimmer 8s linear infinite', letterSpacing: '-0.03em' }}>Expert Blog</span>

        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: isMobile ? '0.95rem' : isTablet ? '1.05rem' : 'clamp(1.1rem,1.9vw,1.3rem)', lineHeight: isMobile ? 1.8 : 2.0, color: 'rgba(199,209,219,.72)', maxWidth: isMobile ? '100%' : 600, margin: '0 auto 30px', fontWeight: 400 }}>
          Deep dives into property buying, legal documentation, home loans, and investment strategies — from Bigway's experienced professionals.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ height: 1, width: isMobile ? 60 : 100, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.5),transparent)' }} />
          <div style={{ width: 7, height: 7, background: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 14px rgba(212,175,55,.85)', animation: 'au__gemGlow 3.8s ease-in-out infinite' }} />
          <div style={{ height: 1, width: isMobile ? 60 : 100, background: 'linear-gradient(270deg,transparent,rgba(212,175,55,.5),transparent)' }} />
        </div>

        {isMobile && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {[['15+', 'Articles'], ['4', 'Categories'], ['10 min', 'Avg Read']].map(([v, l]) => (
              <div key={l} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 800, color: '#D4AF37' }}>{v}</div>
                <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(199,209,219,0.5)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom,transparent,#030A16)', pointerEvents: 'none', zIndex: 3 }} />
    </header>
  );
};

/* ============================================================
   MOBILE FILTER DRAWER
============================================================ */
interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  search: string;
  setSearch: (val: string) => void;
}
const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ open, onClose, activeCategory, setActiveCategory, search, setSearch }) => (
  <>
    {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(3,10,22,0.85)', backdropFilter: 'blur(8px)' }} />}
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 350,
      background: 'linear-gradient(180deg,#0D1E3A,#060F1E)',
      borderRadius: '20px 20px 0 0', border: '1.5px solid rgba(212,175,55,0.25)', borderBottom: 'none',
      padding: '20px 20px 36px',
      transform: open ? 'translateY(0)' : 'translateY(110%)',
      transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(212,175,55,0.3)', margin: '0 auto 20px' }} />
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '.24em', color: 'rgba(212,175,55,0.5)', marginBottom: 14 }}>FILTER BY CATEGORY</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setActiveCategory(cat); onClose(); }} style={{
            padding: '9px 18px', borderRadius: 100, cursor: 'pointer',
            fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
            background: activeCategory === cat ? 'linear-gradient(135deg,#D4AF37,#F5C97A)' : 'rgba(212,175,55,0.07)',
            border: activeCategory === cat ? 'none' : '1px solid rgba(212,175,55,0.2)',
            color: activeCategory === cat ? '#0A1628' : 'rgba(212,175,55,0.7)',
            boxShadow: activeCategory === cat ? '0 6px 20px rgba(212,175,55,0.35)' : 'none',
          }}>{cat}</button>
        ))}
      </div>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '.24em', color: 'rgba(212,175,55,0.5)', marginBottom: 10 }}>SEARCH</div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(212,175,55,0.4)' }}><IconSearch /></div>
        <input
          placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: 'rgba(3,10,22,0.9)', border: '1.5px solid rgba(212,175,55,0.2)', borderRadius: 10, padding: '13px 16px 13px 44px', fontFamily: "'Lato',sans-serif", fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>
    </div>
  </>
);

/* ============================================================
   FEATURED CARD — responsive
   FIX: useFadeIn<HTMLElement> (was HTMLArticleElement — does not exist in TS DOM lib)
============================================================ */
interface FeaturedCardProps {
  blog: Blog;
  onOpen: (blog: Blog) => void;
  isMobile: boolean;
  isTablet: boolean;
}
const FeaturedCard: React.FC<FeaturedCardProps> = ({ blog, onOpen, isMobile, isTablet }) => {
  const [ref, vis] = useFadeIn<HTMLElement>(0.04); // ← FIXED
  const [hov, setHov] = useState(false);
  const imgH = isMobile ? 260 : isTablet ? 380 : 520;
  return (
    <article ref={ref as RefObject<HTMLElement>} onClick={() => onOpen(blog)}
      onMouseEnter={() => !isMobile && setHov(true)} onMouseLeave={() => !isMobile && setHov(false)}
      style={{
        opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(50px)',
        transition: 'opacity .95s cubic-bezier(.22,1,.36,1),transform .95s cubic-bezier(.22,1,.36,1),border-color .4s,box-shadow .4s',
        position: 'relative', borderRadius: isMobile ? 16 : 24, overflow: 'hidden', cursor: 'pointer', marginBottom: isMobile ? 16 : 28,
        border: `1.5px solid ${hov ? 'rgba(212,175,55,.65)' : 'rgba(212,175,55,.22)'}`,
        boxShadow: hov ? '0 40px 120px rgba(0,0,0,.8),0 0 80px rgba(212,175,55,.12)' : '0 12px 60px rgba(0,0,0,.6)',
      }}>
      <div style={{ position: 'relative', height: imgH, overflow: 'hidden' }}>
        <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform 1.4s cubic-bezier(.22,1,.36,1)', filter: hov ? 'brightness(1.08)' : 'brightness(.9)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(3,10,22,1) 0%,rgba(3,10,22,.9) 28%,rgba(3,10,22,.25) 68%,transparent 100%)' }} />
        <div style={{ position: 'absolute', top: isMobile ? 14 : 26, left: isMobile ? 14 : 26, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ padding: isMobile ? '5px 12px' : '7px 18px', borderRadius: 6, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', fontFamily: "'Poppins',sans-serif", fontSize: isMobile ? 8 : 9.5, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0A1628', boxShadow: '0 6px 28px rgba(212,175,55,.65)' }}>{blog.category}</div>
          <div style={{ padding: isMobile ? '5px 10px' : '7px 16px', borderRadius: 6, background: 'rgba(3,10,22,.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,.3)', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Lato',sans-serif", fontSize: isMobile ? 10 : 11, color: 'rgba(212,175,55,.9)' }}>
            <div style={{ width: isMobile ? 10 : 12, height: isMobile ? 10 : 12 }}><IconClock /></div>{blog.readTime}
          </div>
          {!isMobile && <div style={{ padding: '7px 16px', borderRadius: 6, background: 'rgba(212,175,55,.12)', border: '1px solid rgba(212,175,55,.28)', fontFamily: "'Poppins',sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(212,175,55,.88)' }}>★ Featured</div>}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: isMobile ? '0 16px 20px' : isTablet ? '0 28px 32px' : '0 44px 44px' }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: isMobile ? 7 : 8.5, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(212,175,55,.5)', marginBottom: isMobile ? 8 : 14 }}>{blog.date}</div>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? 'clamp(1.2rem,5vw,1.5rem)' : isTablet ? 'clamp(1.4rem,3vw,2rem)' : 'clamp(1.55rem,3vw,2.6rem)', lineHeight: 1.1, color: '#fff', marginBottom: isMobile ? 10 : 16, letterSpacing: '-.015em' }}>{blog.title}</h2>
          {!isMobile && <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 'clamp(.88rem,1.35vw,1rem)', color: 'rgba(199,209,219,.72)', lineHeight: 1.76, marginBottom: 26, maxWidth: 640, fontWeight: 300 }}>{blog.excerpt}</p>}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: isMobile ? 30 : 38, height: isMobile ? 30 : 38, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: isMobile ? 11 : 14, color: '#0A1628' }}>{blog.authorInitial}</div>
              <div>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: isMobile ? 11 : 12, fontWeight: 600, color: '#fff' }}>{blog.author}</div>
                {!isMobile && <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 10, color: 'rgba(199,209,219,.38)' }}>Bigway Real Estate</div>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: isMobile ? '9px 18px' : '13px 30px', borderRadius: 8, background: hov ? 'linear-gradient(135deg,#D4AF37,#F5C97A)' : 'rgba(212,175,55,.12)', border: `1.5px solid ${hov ? 'transparent' : 'rgba(212,175,55,.42)'}`, color: hov ? '#0A1628' : '#D4AF37', fontFamily: "'Poppins',sans-serif", fontSize: isMobile ? 11 : 12.5, fontWeight: 700, transition: 'all .4s cubic-bezier(.22,1,.36,1)' }}>
              Read Full Article <IconArrow />
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#B8941F 25%,#F5C97A 50%,#D4AF37 75%,transparent)', backgroundSize: '200% 100%', opacity: hov ? 1 : 0.3, transition: 'opacity .4s', animation: 'shimmerLine 3s linear infinite' }} />
    </article>
  );
};

/* ============================================================
   BLOG CARD
   FIX: useFadeIn<HTMLElement> (was HTMLArticleElement — does not exist in TS DOM lib)
============================================================ */
interface BlogCardProps {
  blog: Blog;
  index: number;
  onOpen: (blog: Blog) => void;
  isMobile: boolean;
}
const BlogCard: React.FC<BlogCardProps> = ({ blog, index, onOpen, isMobile }) => {
  const [ref, vis] = useFadeIn<HTMLElement>(0.05); // ← FIXED
  const [hov, setHov] = useState(false);
  return (
    <article ref={ref as RefObject<HTMLElement>} onClick={() => onOpen(blog)}
      onMouseEnter={() => !isMobile && setHov(true)} onMouseLeave={() => !isMobile && setHov(false)}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? (hov ? 'translateY(-8px)' : 'translateY(0)') : 'translateY(52px)',
        transition: `opacity .85s cubic-bezier(.22,1,.36,1) ${index * 120}ms,transform .5s cubic-bezier(.22,1,.36,1),border-color .3s,box-shadow .3s`,
        position: 'relative', borderRadius: isMobile ? 14 : 20, overflow: 'hidden',
        background: 'linear-gradient(155deg,rgba(7,18,36,.92) 0%,rgba(4,11,22,.96) 55%,rgba(3,10,22,.98) 100%)',
        cursor: 'pointer',
        border: `1.5px solid ${hov ? 'rgba(212,175,55,.55)' : 'rgba(212,175,55,.14)'}`,
        boxShadow: hov ? '0 32px 90px rgba(0,0,0,.75),0 0 60px rgba(212,175,55,.08)' : '0 4px 28px rgba(0,0,0,.45)',
        display: 'flex', flexDirection: 'column',
      }}>
      <div style={{ position: 'relative', height: isMobile ? 190 : 215, overflow: 'hidden', flexShrink: 0 }}>
        <img src={blog.thumb} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.1)' : 'scale(1)', transition: 'transform .95s cubic-bezier(.22,1,.36,1)', filter: hov ? 'brightness(1.06)' : 'brightness(.86)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(3,10,22,1) 0%,rgba(3,10,22,.6) 45%,transparent 100%)' }} />
        <div style={{ position: 'absolute', top: 12, left: 12, padding: '5px 12px', borderRadius: 6, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', fontFamily: "'Poppins',sans-serif", fontSize: 8.5, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0A1628' }}>{blog.category}</div>
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: 'rgba(3,10,22,.85)', backdropFilter: 'blur(14px)', border: '1px solid rgba(212,175,55,.22)', fontFamily: "'Lato',sans-serif", fontSize: 10, color: 'rgba(212,175,55,.82)' }}>
          <div style={{ width: 10, height: 10 }}><IconClock /></div>{blog.readTime}
        </div>
        {!isMobile && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hov ? 1 : 0, transition: 'opacity .35s' }}>
          <div style={{ padding: '10px 22px', borderRadius: 8, background: 'rgba(212,175,55,.93)', fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, color: '#0A1628', display: 'flex', alignItems: 'center', gap: 7, transform: hov ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.88)', transition: 'transform .38s cubic-bezier(.22,1,.36,1)' }}>Read Article <IconArrow /></div>
        </div>}
      </div>
      <div style={{ padding: isMobile ? '16px 16px 20px' : '22px 24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 7.5, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(212,175,55,.38)', marginBottom: 9 }}>{blog.date}</div>
        <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: isMobile ? '1rem' : 'clamp(.95rem,1.5vw,1.12rem)', lineHeight: 1.32, color: hov ? '#F5C97A' : '#fff', marginBottom: 10, transition: 'color .3s', letterSpacing: '-.005em' }}>{blog.title}</h3>
        <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 12.5, color: 'rgba(199,209,219,.55)', lineHeight: 1.75, marginBottom: 14, fontWeight: 300, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.excerpt}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {blog.seoKeywords.slice(0, 2).map((kw, i) => <span key={i} style={{ padding: '3px 9px', borderRadius: 5, background: 'rgba(212,175,55,.06)', border: '1px solid rgba(212,175,55,.16)', fontFamily: "'Lato',sans-serif", fontSize: 9.5, color: 'rgba(212,175,55,.46)', fontWeight: 500 }}>{kw}</span>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(212,175,55,.09)', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#B8941F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 9, color: '#0A1628' }}>{blog.authorInitial}</div>
            <span style={{ fontFamily: "'Lato',sans-serif", fontSize: 10.5, color: 'rgba(199,209,219,.38)' }}>{blog.author}</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Poppins',sans-serif", fontSize: 10.5, fontWeight: 700, color: hov ? '#F5C97A' : 'rgba(212,175,55,.5)', transition: 'color .3s' }}>Read <IconArrow /></span>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#D4AF37 35%,#F5C97A 55%,transparent)', opacity: hov ? 1 : 0, transition: 'opacity .4s' }} />
    </article>
  );
};

/* ============================================================
   TABLE OF CONTENTS
============================================================ */
interface TableOfContentsProps {
  sections: Array<{ heading: string; body: string }>;
  isMobile: boolean;
}
const TableOfContents: React.FC<TableOfContentsProps> = ({ sections, isMobile }) => {
  const [active, setActive] = useState(0);
  return (
    <div style={{ padding: isMobile ? '16px 18px' : '20px 24px', borderRadius: 14, background: 'rgba(7,18,36,.75)', border: '1px solid rgba(212,175,55,.16)', marginBottom: isMobile ? 24 : 36, backdropFilter: 'blur(20px)' }}>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(212,175,55,.45)', marginBottom: 12 }}>Contents</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sections.map((s, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ textAlign: 'left', background: active === i ? 'rgba(212,175,55,.1)' : 'none', border: 'none', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Lato',sans-serif", fontSize: isMobile ? 12 : 12.5, color: active === i ? '#F5C97A' : 'rgba(199,209,219,.5)', fontWeight: active === i ? 600 : 400, transition: 'all .25s' }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, background: active === i ? 'linear-gradient(135deg,#D4AF37,#F5C97A)' : 'rgba(212,175,55,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7.5, fontWeight: 800, color: active === i ? '#0A1628' : 'rgba(212,175,55,.45)', flexShrink: 0, fontFamily: "'Orbitron',sans-serif" }}>{i + 1}</span>
            {s.heading}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   BLOG ARTICLE — responsive
============================================================ */
interface BlogArticleProps {
  blog: Blog;
  onClose: () => void;
  isMobile: boolean;
  isTablet: boolean;
}
const BlogArticle: React.FC<BlogArticleProps> = ({ blog, onClose, isMobile, isTablet }) => {
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setScrollPct(Math.min(100, (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100));
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const px = isMobile ? '16px' : isTablet ? '28px' : '24px';

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: isMobile ? 60 : 0, left: 0, right: 0, height: 3, zIndex: 999, background: 'rgba(212,175,55,.1)' }}>
        <div style={{ height: '100%', width: `${scrollPct}%`, background: 'linear-gradient(90deg,#B8941F,#D4AF37,#F5C97A)', transition: 'width .1s linear', boxShadow: '0 0 14px rgba(212,175,55,.85)' }} />
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: `0 ${px}` }}>
        {!isMobile && (
          <button onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 38, background: 'rgba(212,175,55,.07)', border: '1px solid rgba(212,175,55,.24)', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontSize: 12.5, fontWeight: 700, color: '#D4AF37', transition: 'all .32s cubic-bezier(.22,1,.36,1)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,.14)'; e.currentTarget.style.border = '1px solid rgba(212,175,55,.52)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,.07)'; e.currentTarget.style.border = '1px solid rgba(212,175,55,.24)'; }}
          ><IconArrowLeft /> Back to Blog</button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16, paddingTop: isMobile ? 8 : 0 }}>
          <span style={{ padding: isMobile ? '5px 12px' : '6px 18px', borderRadius: 6, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', fontFamily: "'Poppins',sans-serif", fontSize: isMobile ? 8 : 9, fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: '#0A1628' }}>{blog.category}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(212,175,55,.62)', fontFamily: "'Lato',sans-serif", fontSize: 11.5 }}><div style={{ width: 12, height: 12 }}><IconClock /></div>{blog.readTime}</div>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8.5, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(199,209,219,.3)' }}>{blog.date}</span>
        </div>

        <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? 'clamp(1.5rem,6vw,2rem)' : isTablet ? 'clamp(1.8rem,4vw,2.5rem)' : 'clamp(1.8rem,4vw,3.1rem)', lineHeight: 1.1, color: '#fff', marginBottom: 12, letterSpacing: '-.02em' }}>{blog.title}</h1>
        <p style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? '0.9rem' : 'clamp(.95rem,1.5vw,1.08rem)', color: 'rgba(199,209,219,.6)', lineHeight: 1.75, marginBottom: 24, fontWeight: 300 }}>{blog.subtitle}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28, paddingBottom: 22, borderBottom: '1px solid rgba(212,175,55,.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: isMobile ? 38 : 48, height: isMobile ? 38 : 48, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: isMobile ? 14 : 18, color: '#0A1628' }}>{blog.authorInitial}</div>
            <div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#fff' }}>{blog.author}</div>
              <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 10, color: 'rgba(199,209,219,.33)' }}>Bigway Real Estate · Coimbatore</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ icon: <IconShare />, label: 'Share' }, { icon: <IconBookmark />, label: 'Save' }].map((btn, i) => (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: isMobile ? '7px 12px' : '8px 18px', borderRadius: 8, background: 'rgba(212,175,55,.07)', border: '1px solid rgba(212,175,55,.22)', fontFamily: "'Poppins',sans-serif", fontSize: isMobile ? 10.5 : 11.5, fontWeight: 600, color: 'rgba(212,175,55,.72)', cursor: 'pointer', transition: 'all .25s' }}>{btn.icon}{!isMobile && btn.label}</button>
            ))}
          </div>
        </div>

        <div style={{ borderRadius: isMobile ? 14 : 20, overflow: 'hidden', marginBottom: isMobile ? 24 : 36, border: '1.5px solid rgba(212,175,55,.18)', boxShadow: '0 28px 100px rgba(0,0,0,.75)' }}>
          <img src={blog.image} alt={blog.title} style={{ width: '100%', height: isMobile ? 200 : isTablet ? 300 : 380, objectFit: 'cover', display: 'block' }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 6 : 8, marginBottom: isMobile ? 24 : 36 }}>
          {blog.seoKeywords.map((kw, i) => <span key={i} style={{ padding: isMobile ? '4px 10px' : '5px 13px', borderRadius: 6, background: 'rgba(212,175,55,.07)', border: '1px solid rgba(212,175,55,.17)', fontFamily: "'Lato',sans-serif", fontSize: isMobile ? 10 : 11, color: 'rgba(212,175,55,.52)', fontWeight: 500 }}>#{kw.replace(/ /g, '_')}</span>)}
        </div>

        <TableOfContents sections={blog.content} isMobile={isMobile} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: isMobile ? 28 : 44 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(212,175,55,.45),transparent)' }} />
          <div style={{ width: 7, height: 7, background: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 20px rgba(212,175,55,.9)' }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.45))' }} />
        </div>

        {blog.content.map((section, i) => (
          <div key={i} style={{ marginBottom: isMobile ? 14 : 22, padding: isMobile ? '20px 18px' : '32px', borderRadius: isMobile ? 14 : 18, background: 'rgba(7,18,36,.6)', border: '1px solid rgba(212,175,55,.1)', backdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden' }}>
            {!isMobile && <div style={{ position: 'absolute', top: 14, right: 20, fontFamily: "'Orbitron',sans-serif", fontSize: 52, fontWeight: 900, color: 'rgba(212,175,55,.035)', lineHeight: 1, userSelect: 'none' }}>{String(i + 1).padStart(2, '0')}</div>}
            <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: isMobile ? '1rem' : 'clamp(1rem,1.85vw,1.32rem)', color: '#fff', lineHeight: 1.3, marginBottom: isMobile ? 14 : 20, paddingLeft: 16, borderLeft: '3px solid #D4AF37' }}>{section.heading}</h2>
            {section.body.split('\n\n').map((para, j) => (
              <RichPara key={j} text={para} style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? '0.85rem' : 'clamp(.87rem,1.3vw,.97rem)', color: 'rgba(199,209,219,.75)', lineHeight: 1.95, marginBottom: 12, fontWeight: 300 }} />
            ))}
          </div>
        ))}

        <div style={{ borderRadius: isMobile ? 16 : 24, padding: isMobile ? '32px 20px' : isTablet ? '42px 36px' : '50px 46px', marginTop: isMobile ? 16 : 24, marginBottom: 20, background: 'linear-gradient(145deg,rgba(7,18,36,.99),rgba(3,10,22,1))', border: '2px solid rgba(212,175,55,.25)', boxShadow: '0 28px 100px rgba(0,0,0,.7)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.55),transparent)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(212,175,55,.38)', marginBottom: 14 }}>Ready to Take the Next Step?</div>
            <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 800, fontSize: isMobile ? '1.15rem' : 'clamp(1.25rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 12, letterSpacing: '-.01em' }}>Talk to a Bigway Expert Today</h3>
            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: isMobile ? 13 : 14.5, color: 'rgba(199,209,219,.58)', lineHeight: 1.8, maxWidth: 420, margin: '0 auto 26px', fontWeight: 300 }}>Get personalised advice on property buying, legal verification, and home loans — completely free, zero commitment.</p>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: isMobile ? '12px 28px' : '14px 38px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: isMobile ? 13 : 14, letterSpacing: '.04em', background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', color: '#0A1628', boxShadow: '0 0 52px rgba(212,175,55,.54)', transition: 'all .35s cubic-bezier(.22,1,.36,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >Free Consultation <IconArrow /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN PAGE
============================================================ */
const BlogPage: React.FC = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openBlog, setOpenBlog] = useState<Blog | null>(null);
  const [search, setSearch] = useState<string>('');
  const [headerVisible, setHeaderVisible] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [filtersRef, filtersVis] = useFadeIn<HTMLDivElement>(0.02);

  useEffect(() => { const t = setTimeout(() => setHeaderVisible(true), 200); return () => clearTimeout(t); }, []);

  const filtered = BLOGS.filter(b => {
    const catOk = activeCategory === 'All' || b.category === activeCategory;
    const q = search.toLowerCase();
    return catOk && (!q || b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
  });
  const featuredBlog = filtered[0];
  const gridBlogs = filtered.slice(1);

  const handleOpenBlog = (blog: Blog) => {
    setOpenBlog(blog);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCloseBlog = () => {
    setOpenBlog(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes au__driftA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-35px)} }
        @keyframes au__driftB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,28px)} }
        @keyframes au__shimmer { 0%{background-position:-200%} 100%{background-position:200%} }
        @keyframes au__gemGlow { 0%,100%{box-shadow:0 0 10px rgba(212,175,55,.65)} 50%{box-shadow:0 0 32px rgba(212,175,55,1)} }
        @keyframes shimmerLine { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.7)} 60%{box-shadow:0 0 0 10px rgba(212,175,55,0)} }
        @keyframes lineTravelV { 0%{top:-40%} 100%{top:140%} }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.5);opacity:1} }
        @keyframes diamondSpin { from{transform:rotate(45deg)} to{transform:rotate(405deg)} }
        @keyframes cardFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }

        .pulse-dot { display:inline-block;width:7px;height:7px;border-radius:50%;background:#D4AF37;box-shadow:0 0 8px rgba(212,175,55,.8);animation:pdot 2.4s ease-out infinite; }
        .sec-label { font-family:'Orbitron',sans-serif;font-size:8px;font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:rgba(212,175,55,.35);display:flex;align-items:center;gap:14px;margin-bottom:16px; }
        .sec-label::after { content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(212,175,55,.2),transparent); }

        .blog-grid { display:grid; gap:16px; grid-template-columns:1fr; }
        @media(min-width:480px) { .blog-grid { grid-template-columns:repeat(2,1fr); gap:16px; } }
        @media(min-width:900px) { .blog-grid { grid-template-columns:repeat(3,1fr); gap:22px; } }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#030A16; }
        ::-webkit-scrollbar-thumb { background:rgba(212,175,55,.24);border-radius:3px; }

        .mob-filter-sticky { position:sticky;top:60px;z-index:100;background:rgba(3,10,22,0.97);backdrop-filter:blur(24px);border-bottom:1px solid rgba(212,175,55,0.1); }

        @media(max-width:639px) { button { min-height:40px; } }
      `}</style>

      <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: '#030A16', color: '#C7D1DB' }}>
        <div style={{ position: 'fixed', top: '-10%', right: '-8%', width: isMobile ? 300 : 600, height: isMobile ? 300 : 600, borderRadius: '50%', zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(circle,rgba(212,175,55,0.04) 0%,transparent 65%)', filter: 'blur(100px)', animation: 'au__driftA 26s ease-in-out infinite' }} />
        <div style={{ position: 'fixed', bottom: '-10%', left: '-8%', width: isMobile ? 280 : 550, height: isMobile ? 280 : 550, borderRadius: '50%', zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(circle,rgba(245,201,122,0.035) 0%,transparent 60%)', filter: 'blur(120px)', animation: 'au__driftB 32s ease-in-out infinite 3s' }} />

        <AnimatedGrid enabled={isDesktop} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <BlogHeroHeader isVisible={headerVisible} isMobile={isMobile} isTablet={isTablet} />

          {!openBlog && (
            <>
              {isMobile ? (
                <div className="mob-filter-sticky">
                  <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
                    <button onClick={() => setDrawerOpen(true)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 100, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: '.1em', whiteSpace: 'nowrap' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                      FILTER
                    </button>
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setActiveCategory(cat)} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 100, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, background: activeCategory === cat ? 'linear-gradient(135deg,#D4AF37,#F5C97A)' : 'rgba(212,175,55,0.07)', border: activeCategory === cat ? 'none' : '1px solid rgba(212,175,55,0.15)', color: activeCategory === cat ? '#0A1628' : 'rgba(212,175,55,0.6)', transition: 'all .25s', whiteSpace: 'nowrap' }}>{cat}</button>
                    ))}
                  </div>
                  <div style={{ padding: '0 16px 10px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 30, top: '50%', transform: 'translateY(-60%)', color: 'rgba(212,175,55,0.4)' }}><IconSearch /></div>
                    <input placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)}
                      style={{ width: '100%', background: 'rgba(3,10,22,0.9)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 100, padding: '10px 16px 10px 40px', fontFamily: "'Lato',sans-serif", fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              ) : (
                <div ref={filtersRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 28px', opacity: filtersVis ? 1 : 0, transform: filtersVis ? 'none' : 'translateY(26px)', transition: 'opacity .85s ease .25s,transform .85s ease .25s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, padding: '16px 22px', borderRadius: 14, background: 'rgba(3,10,22,.88)', backdropFilter: 'blur(28px)', border: '1px solid rgba(212,175,55,.14)', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                          padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
                          fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700,
                          letterSpacing: '.1em', textTransform: 'uppercase',
                          background: activeCategory === cat ? 'linear-gradient(135deg,#D4AF37,#F5C97A)' : 'rgba(212,175,55,.07)',
                          border: activeCategory === cat ? 'none' : '1px solid rgba(212,175,55,.2)',
                          color: activeCategory === cat ? '#0A1628' : 'rgba(212,175,55,.62)',
                          boxShadow: activeCategory === cat ? '0 6px 24px rgba(212,175,55,.42)' : 'none',
                          transition: 'all .38s cubic-bezier(.22,1,.36,1)'
                        }}
                          onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                        >{cat}</button>
                      ))}
                    </div>
                    <div style={{ position: 'relative', minWidth: 220, maxWidth: 300, flex: '1 1 220px' }}>
                      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(212,175,55,.38)' }}><IconSearch /></div>
                      <input placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)}
                        style={{ background: 'rgba(3,10,22,.92)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(212,175,55,.2)', borderRadius: 10, padding: '12px 18px 12px 44px', width: '100%', fontFamily: "'Lato',sans-serif", fontSize: 13, color: '#fff', outline: 'none', transition: 'border-color .3s,box-shadow .3s' }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,.58)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(212,175,55,.2)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 11, color: 'rgba(199,209,219,.28)', paddingLeft: 4 }}>
                    {filtered.length} article{filtered.length !== 1 ? 's' : ''}{activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
                  </p>
                </div>
              )}

              <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 14px 100px' : '0 24px 120px' }}>
                {filtered.length > 0 ? (
                  <>
                    {featuredBlog && (
                      <>
                        <div className="sec-label"><span>Featured Article</span></div>
                        <FeaturedCard blog={featuredBlog} onOpen={handleOpenBlog} isMobile={isMobile} isTablet={isTablet} />
                      </>
                    )}
                    {gridBlogs.length > 0 && (
                      <>
                        <div className="sec-label" style={{ marginTop: 8 }}><span>More Articles</span></div>
                        <div className="blog-grid">
                          {gridBlogs.map((blog, i) => <BlogCard key={blog.id} blog={blog} index={i} onOpen={handleOpenBlog} isMobile={isMobile} />)}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: isMobile ? '60px 20px' : '90px 20px' }}>
                    <div style={{ width: 8, height: 8, background: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 16px rgba(212,175,55,.85)', margin: '0 auto 24px' }} />
                    <p style={{ fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: 'rgba(212,175,55,.32)', marginBottom: 10 }}>No articles found.</p>
                    <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
                      style={{ background: 'transparent', border: '1px solid rgba(212,175,55,.3)', borderRadius: 8, padding: '10px 26px', color: '#D4AF37', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '.08em' }}>Clear Filters</button>
                  </div>
                )}
              </div>
            </>
          )}

          {openBlog && (
            <div style={{ paddingBottom: 80, paddingTop: isMobile ? 24 : 12 }}>
              <BlogArticle blog={openBlog} onClose={handleCloseBlog} isMobile={isMobile} isTablet={isTablet} />
            </div>
          )}
        </div>

        {isMobile && (
          <MobileFilterDrawer
            open={drawerOpen} onClose={() => setDrawerOpen(false)}
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            search={search} setSearch={setSearch}
          />
        )}

        {isMobile && !openBlog && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150, padding: '12px 16px 24px', background: 'linear-gradient(0deg,rgba(3,10,22,1) 70%,transparent)', pointerEvents: 'none' }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ pointerEvents: 'auto', width: '100%', padding: '13px', borderRadius: 13, border: '1px solid rgba(212,175,55,0.35)', background: 'rgba(3,10,22,0.92)', backdropFilter: 'blur(16px)', color: '#D4AF37', cursor: 'pointer', fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '.15em' }}>↑ BACK TO TOP</button>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPage;