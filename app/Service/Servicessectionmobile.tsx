'use client';
import React, { useState, useEffect, useRef } from 'react';

/*
 * ServicesSectionMobile.tsx  —  Screens < 640px
 */

/* ══ TYPES ══ */
interface ServiceType {
  e: string;
  l: string;
}

interface Service {
  id: string;
  title: string;
  sub: string;
  icon: React.FC;
  img: string;
  accent: string;
  stat: string;
  statLbl: string;
  desc: string;
  types: ServiceType[];
}

interface Stat {
  num: number;
  suf: string;
  pre: string;
  lbl: string;
  sub: string;
  icon: React.FC;
  dur: number;
}

/* ══ ICONS ══ */
const icons = {
  sell:  (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  land:  (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M2 20h20M7 20V10l5-5 5 5v10"/><path d="M10 20v-5h4v5"/></svg>,
  build: (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M2 15h20M9 3v18M15 3v18"/></svg>,
  flat:  (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="3" y="2" width="18" height="20" rx="2"/><path d="M3 8h18M3 14h18M9 2v20M15 2v20"/></svg>,
  villa: (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-8h6v8"/></svg>,
  comm:  (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  phone: (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63a19.79 19.79 0 01-3-8.59A2 2 0 012.08 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.46a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  close: (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{width:14,height:14}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  star:  (): React.ReactElement => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:'100%',height:'100%'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  bldg:  (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  cal:   (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  rupee: (): React.ReactElement => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><line x1="6" y1="5" x2="18" y2="5"/><line x1="6" y1="10" x2="18" y2="10"/><path d="M6 10c0 5 4 9 9 9"/><line x1="6" y1="10" x2="15" y2="21"/></svg>,
};

/* ══ DATA ══ */
const SERVICES: Service[] = [
  { id:'01', title:'Property Selling', sub:'Sell Fast · Best Price', icon:icons.sell, img:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80', accent:'#D4AF37', stat:'500+', statLbl:'Properties Sold', desc:'Expert valuation, targeted marketing & direct access to 5,000+ verified buyers. We close at the best price — fast.', types:[{e:'🏠',l:'Houses'},{e:'🏢',l:'Apartments'},{e:'🌳',l:'Agri Land'},{e:'📐',l:'Plots'},{e:'🏪',l:'Shops'},{e:'🏭',l:'Industrial'}] },
  { id:'02', title:'Land Selling', sub:'Plots · Sites · Farm', icon:icons.land, img:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', accent:'#C8964A', stat:'300+', statLbl:'Plots Listed', desc:'Clear-title land across Coimbatore — from residential plots to agricultural farmland and industrial zones.', types:[{e:'📐',l:'Res. Plots'},{e:'🌾',l:'Agri Land'},{e:'🏭',l:'Industrial'},{e:'🏪',l:'Comm. Plots'},{e:'🌳',l:'Farm Land'},{e:'🛣️',l:'Highway'}] },
  { id:'03', title:'Construction', sub:'Design · Build · Deliver', icon:icons.build, img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', accent:'#D4AF37', stat:'150+', statLbl:'Projects Built', desc:'Turnkey construction from architectural design to final finishes. Your vision, engineered to perfection.', types:[{e:'🏠',l:'Houses'},{e:'🏘️',l:'Row Houses'},{e:'🏢',l:'Apartments'},{e:'🏪',l:'Commercial'},{e:'🏭',l:'Sheds'},{e:'🏡',l:'Villas'}] },
  { id:'04', title:'Flats & Apartments', sub:'Buy · Sell · Rent', icon:icons.flat, img:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', accent:'#E8C547', stat:'200+', statLbl:'Units Listed', desc:"1BHK to luxury penthouses — curated listings across Coimbatore's most sought-after residential neighbourhoods.", types:[{e:'🛏️',l:'1 BHK'},{e:'🛏️',l:'2 BHK'},{e:'🛏️',l:'3 BHK'},{e:'🛏️',l:'4 BHK+'},{e:'🏢',l:'Studio'},{e:'🌟',l:'Penthouse'}] },
  { id:'05', title:'Villas & Independent', sub:'Exclusive Properties', icon:icons.villa, img:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80', accent:'#D4AF37', stat:'80+', statLbl:'Premium Listings', desc:"Gated villas, luxury bungalows & independent houses in Coimbatore's finest addresses.", types:[{e:'🏡',l:'Gated Villas'},{e:'🏠',l:'Ind. Houses'},{e:'🌿',l:'Farm Houses'},{e:'🏘️',l:'Duplex'},{e:'🏰',l:'Bungalows'},{e:'✨',l:'Luxury'}] },
  { id:'06', title:'Commercial', sub:'Offices · Shops · Sheds', icon:icons.comm, img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', accent:'#C8964A', stat:'120+', statLbl:'Deals Closed', desc:'High-ROI commercial spaces across Coimbatore — from retail frontage to Grade-A office suites.', types:[{e:'🏢',l:'Offices'},{e:'🏪',l:'Retail'},{e:'🏭',l:'Warehouses'},{e:'🍽️',l:'Restaurants'},{e:'🏬',l:'Showrooms'},{e:'📦',l:'Storage'}] },
];

const STATS: Stat[] = [
  { num:500, suf:'+', pre:'', lbl:'Properties Sold', sub:'Across Coimbatore', icon:icons.bldg, dur:2000 },
  { num:98,  suf:'%', pre:'', lbl:'Client Satisfaction', sub:'Verified Reviews', icon:icons.star, dur:1800 },
  { num:15,  suf:'+', pre:'', lbl:'Years Experience', sub:'In Real Estate', icon:icons.cal, dur:1600 },
  { num:200, suf:'Cr+', pre:'₹', lbl:'Value Closed', sub:'Total Deals', icon:icons.rupee, dur:2200 },
];

/* ══ HOOK ══ */
function useCountUp(target: number, dur: number, active: boolean): number {
  const [v, setV] = useState<number>(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setV(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, dur]);
  return v;
}

/* ══ CANVAS ══ */
const MobileGrid: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const fr = useRef<number>(0);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    let raf: number, W: number, H: number;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const draw = () => {
      fr.current++; ctx.clearRect(0,0,W,H);
      const COLS=7,ROWS=12,cW=W/COLS,cH=H/ROWS,t=fr.current*0.008;
      for(let col=0;col<=COLS;col++){const x=col*cW;const g=ctx.createLinearGradient(x,0,x,H);g.addColorStop(0,'rgba(212,175,55,0)');g.addColorStop(0.4,'rgba(212,175,55,0.055)');g.addColorStop(0.6,'rgba(212,175,55,0.055)');g.addColorStop(1,'rgba(212,175,55,0)');ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle=g;ctx.lineWidth=0.5;ctx.stroke();}
      for(let row=0;row<=ROWS;row++){const y=row*cH;const g=ctx.createLinearGradient(0,y,W,y);g.addColorStop(0,'rgba(212,175,55,0)');g.addColorStop(0.3,'rgba(212,175,55,0.04)');g.addColorStop(0.7,'rgba(212,175,55,0.04)');g.addColorStop(1,'rgba(212,175,55,0)');ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle=g;ctx.lineWidth=0.5;ctx.stroke();}
      for(let col=0;col<=COLS;col+=2)for(let row=0;row<=ROWS;row+=2){const x=col*cW,y=row*cH,pulse=0.5+0.5*Math.sin(t+col*0.8+row*0.6);ctx.beginPath();ctx.arc(x,y,0.7+pulse*0.3,0,Math.PI*2);ctx.fillStyle=`rgba(212,175,55,${0.07+pulse*0.05})`;ctx.fill();}
      raf=requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,zIndex:0,pointerEvents:'none'}}/>;
};

/* ══ SLIDE-UP FREE CONSULT BOTTOM SHEET ══ */
interface SlideUpConsultProps {
  visible: boolean;
  accent: string;
  title: string;
  onClose: () => void;
}
const SlideUpConsult: React.FC<SlideUpConsultProps> = ({ visible, accent, title, onClose }) => (
  <>
    <div
      onClick={onClose}
      style={{
        position:'fixed',inset:0,zIndex:998,
        background:'rgba(0,0,0,0.68)',
        backdropFilter:'blur(5px)',
        WebkitBackdropFilter:'blur(5px)',
        opacity:visible?1:0,
        pointerEvents:visible?'auto':'none',
        transition:'opacity 0.3s ease',
      }}
    />
    <div style={{
      position:'fixed',bottom:0,left:0,right:0,zIndex:999,
      background:'linear-gradient(170deg,#0C1D3A 0%,#060F1E 55%,#030A15 100%)',
      borderRadius:'22px 22px 0 0',
      borderTop:`2px solid ${accent}`,
      boxShadow:`0 -20px 80px rgba(0,0,0,0.88), 0 0 100px ${accent}18`,
      transform:visible?'translateY(0)':'translateY(110%)',
      transition:'transform 0.46s cubic-bezier(0.22,1,0.36,1)',
      pointerEvents:visible?'auto':'none',
    }}>
      <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:2,background:`linear-gradient(90deg,transparent,${accent},transparent)`}}/>
      <div style={{display:'flex',justifyContent:'center',padding:'12px 0 2px'}}>
        <div style={{width:38,height:4,borderRadius:100,background:`${accent}50`}}/>
      </div>
      <div style={{padding:'10px 22px 40px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:accent,boxShadow:`0 0 10px ${accent}`,animation:'pulseDot 2.2s ease-out infinite'}}/>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:`${accent}CC`}}>FREE CONSULTATION</span>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:'50%',border:`1px solid ${accent}44`,background:`${accent}18`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:accent,WebkitTapHighlightColor:'transparent'}}>
            <icons.close/>
          </button>
        </div>
        <div style={{marginBottom:14,display:'inline-flex',alignItems:'center',gap:7,padding:'7px 14px',borderRadius:10,background:`${accent}18`,border:`1px solid ${accent}38`}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:accent,opacity:0.75}}/>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:12.5,fontWeight:700,color:'#FFF'}}>{title}</span>
        </div>
        <p style={{fontFamily:"'Lato',sans-serif",fontSize:13.5,lineHeight:1.78,color:'rgba(199,209,219,0.55)',fontWeight:300,margin:'0 0 22px'}}>
          Speak with our property experts — completely free, zero commitment.
        </p>
        <div style={{display:'flex',gap:10,marginBottom:14}}>
          <button onTouchStart={(e: React.TouchEvent<HTMLButtonElement>)=>e.currentTarget.style.transform='scale(0.95)'} onTouchEnd={(e: React.TouchEvent<HTMLButtonElement>)=>e.currentTarget.style.transform='scale(1)'} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'15px 10px',borderRadius:100,border:0,cursor:'pointer',fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,background:`linear-gradient(135deg,${accent},#F5C97A,${accent})`,backgroundSize:'200% auto',color:'#040C1A',boxShadow:`0 6px 28px ${accent}55`,transition:'transform 0.14s ease',WebkitTapHighlightColor:'transparent'}}>
            <icons.phone/> Call Now
          </button>
          <button onTouchStart={(e: React.TouchEvent<HTMLButtonElement>)=>e.currentTarget.style.transform='scale(0.95)'} onTouchEnd={(e: React.TouchEvent<HTMLButtonElement>)=>e.currentTarget.style.transform='scale(1)'} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'15px 10px',borderRadius:100,border:`1.5px solid ${accent}65`,background:'transparent',cursor:'pointer',fontFamily:"'Poppins',sans-serif",fontWeight:600,fontSize:13.5,color:accent,transition:'transform 0.14s ease',WebkitTapHighlightColor:'transparent'}}>
            Enquire
          </button>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:16,flexWrap:'wrap'}}>
          {['No spam','No commitment','Expert advice'].map((t: string, i: number)=>(
            <span key={i} style={{fontFamily:"'Lato',sans-serif",fontSize:10,color:'rgba(199,209,219,0.32)',display:'flex',alignItems:'center',gap:4}}>
              <span style={{color:accent,fontSize:10}}>✓</span>{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </>
);

/* ══ SERVICE CARD ══ */
interface MobileServiceCardProps {
  svc: Service;
  index: number;
  visible: boolean;
}
const MobileServiceCard: React.FC<MobileServiceCardProps> = ({ svc, index, visible }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [consultOpen, setConsultOpen] = useState<boolean>(false);

  return (
    <>
      <div style={{
        opacity:visible?1:0,
        transform:visible?'none':`translateY(${20+index*6}px)`,
        transition:`opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${index*70}ms,transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index*70}ms`,
      }}>
        <div style={{
          position:'relative',borderRadius:16,overflow:'hidden',
          background:'linear-gradient(165deg,#0D1E3A 0%,#060F1E 55%,#030A15 100%)',
          border:`1px solid ${expanded?svc.accent+'95':'rgba(212,175,55,0.14)'}`,
          boxShadow:expanded?`0 20px 60px rgba(0,0,0,0.72),0 0 50px ${svc.accent}18`:'0 4px 18px rgba(0,0,0,0.42)',
          transition:'border-color 0.3s,box-shadow 0.3s',
        }}>
          {/* ── IMAGE AREA ── */}
          <div style={{position:'relative',height:200,overflow:'hidden',pointerEvents:'none',userSelect:'none'}}>
            <img src={svc.img} alt={svc.title} style={{width:'100%',height:'100%',objectFit:'cover',filter:expanded?'brightness(0.65) saturate(0.9)':'brightness(0.22) saturate(0.35)',transform:'scale(1.04)',transition:'filter 0.8s ease'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(3,10,22,0.05) 0%,rgba(3,10,22,0.28) 38%,rgba(3,10,22,1) 100%)'}}/>
            {expanded&&<div style={{position:'absolute',top:0,left:'-100%',width:'65%',height:2,background:`linear-gradient(90deg,transparent,${svc.accent},transparent)`,animation:'sweepLine 1.1s ease-out forwards'}}/>}
            <div style={{position:'absolute',top:13,left:13,zIndex:4}}>
              <div style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:100,background:`linear-gradient(135deg,${svc.accent},${svc.accent}BB)`,fontFamily:"'Orbitron',sans-serif",fontSize:8,fontWeight:800,letterSpacing:'0.16em',color:'#040C1A'}}>
                <div style={{width:3,height:3,borderRadius:'50%',background:'#040C1A',opacity:0.6}}/>{svc.id}
              </div>
            </div>
            <div style={{position:'absolute',top:13,right:13,zIndex:4}}>
              <div style={{padding:'6px 11px',background:'rgba(2,7,18,0.92)',backdropFilter:'blur(14px)',border:`1px solid ${svc.accent}48`,borderRadius:9,textAlign:'center'}}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:16,fontWeight:900,color:svc.accent,lineHeight:1}}>{svc.stat}</div>
                <div style={{fontFamily:"'Lato',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(199,209,219,0.38)',marginTop:2}}>{svc.statLbl}</div>
              </div>
            </div>
            <div style={{position:'absolute',bottom:14,left:15,right:15,zIndex:4,display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:40,height:40,borderRadius:10,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:`${svc.accent}22`,border:`1.5px solid ${svc.accent}58`,color:svc.accent,backdropFilter:'blur(10px)',transform:expanded?'rotate(8deg) scale(1.08)':'none',transition:'transform 0.35s cubic-bezier(0.22,1,0.36,1)'}}>
                <div style={{width:17,height:17}}><svc.icon/></div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:`${svc.accent}72`,marginBottom:3}}>{svc.sub}</div>
                <h3 style={{fontFamily:"'Cinzel',serif",fontWeight:800,fontSize:'1.05rem',color:'#FFF',margin:0,lineHeight:1.2,textShadow:'0 2px 18px rgba(0,0,0,0.9)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{svc.title}</h3>
              </div>
            </div>
          </div>

          {/* ══ DOWN ARROW TOGGLE BAR ══ */}
          <button
            onClick={() => setExpanded(e => !e)}
            aria-label={expanded?'Hide details':'View details'}
            style={{
              display:'flex',alignItems:'center',justifyContent:'space-between',
              width:'100%',padding:'12px 18px',border:0,cursor:'pointer',
              background:expanded
                ?`linear-gradient(90deg,${svc.accent}1C,${svc.accent}35,${svc.accent}1C)`
                :'rgba(255,255,255,0.028)',
              borderTop:`1px solid ${expanded?svc.accent+'65':'rgba(212,175,55,0.12)'}`,
              transition:'background 0.32s,border-color 0.32s',
              WebkitTapHighlightColor:'transparent',
            }}
          >
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <div style={{width:3,height:18,borderRadius:2,background:expanded?svc.accent:'rgba(212,175,55,0.28)',transition:'background 0.3s',flexShrink:0}}/>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:expanded?svc.accent:'rgba(212,175,55,0.42)',transition:'color 0.3s'}}>
                {expanded?'HIDE DETAILS':'VIEW DETAILS'}
              </span>
            </div>
            <div style={{
              width:38,height:38,borderRadius:'50%',flexShrink:0,
              border:`1.5px solid ${expanded?svc.accent:svc.accent+'50'}`,
              background:expanded?`${svc.accent}2A`:`${svc.accent}0C`,
              display:'flex',alignItems:'center',justifyContent:'center',
              color:svc.accent,
              transform:expanded?'rotate(180deg)':'rotate(0deg)',
              transition:'transform 0.44s cubic-bezier(0.22,1,0.36,1),border-color 0.3s,background 0.3s,box-shadow 0.3s',
              boxShadow:expanded?`0 0 20px ${svc.accent}55`:'none',
              animation:expanded?'none':'arrowBounce 2.6s ease-in-out infinite',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17,display:'block'}}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </button>

          {/* ── EXPANDABLE CONTENT ── */}
          <div style={{maxHeight:expanded?640:0,overflow:'hidden',transition:'max-height 0.52s cubic-bezier(0.22,1,0.36,1)'}}>
            <div style={{padding:'18px 16px 20px'}}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:14}}>
                <div style={{height:2,width:22,borderRadius:2,background:`linear-gradient(90deg,${svc.accent},transparent)`}}/>
                <div style={{height:1,flex:1,background:'rgba(255,255,255,0.04)'}}/>
              </div>
              <p style={{fontFamily:"'Lato',sans-serif",fontSize:13.5,lineHeight:1.82,color:'rgba(199,209,219,0.62)',fontWeight:300,margin:'0 0 18px'}}>{svc.desc}</p>
              <div style={{marginBottom:20}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                  <div style={{width:9,height:1,background:`${svc.accent}60`}}/>
                  <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,fontWeight:800,letterSpacing:'0.26em',textTransform:'uppercase',color:`${svc.accent}55`}}>PROPERTY TYPES</span>
                  <div style={{flex:1,height:1,background:`linear-gradient(90deg,${svc.accent}18,transparent)`}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'7px'}}>
                  {svc.types.map((t: ServiceType, i: number)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 9px',borderRadius:9,background:`${svc.accent}13`,border:`1px solid ${svc.accent}2E`,animation:'fadeUpIn 0.38s ease both',animationDelay:`${i*45}ms`}}>
                      <span style={{fontSize:13,lineHeight:1,flexShrink:0}}>{t.e}</span>
                      <span style={{fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:600,lineHeight:1.2,color:'#EDD98A'}}>{t.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={()=>setConsultOpen(true)}
                onTouchStart={(e: React.TouchEvent<HTMLButtonElement>)=>e.currentTarget.style.transform='scale(0.96)'}
                onTouchEnd={(e: React.TouchEvent<HTMLButtonElement>)=>e.currentTarget.style.transform='scale(1)'}
                style={{
                  display:'flex',alignItems:'center',justifyContent:'center',
                  gap:9,width:'100%',padding:'15px 22px',
                  borderRadius:100,border:0,cursor:'pointer',
                  fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,
                  background:`linear-gradient(135deg,${svc.accent},#F5C97A,${svc.accent})`,
                  backgroundSize:'200% auto',color:'#040C1A',
                  boxShadow:`0 6px 30px ${svc.accent}55`,
                  transition:'transform 0.15s ease',
                  WebkitTapHighlightColor:'transparent',
                  animation:'consultGlow 2.8s ease-in-out infinite',
                }}>
                <icons.phone/> Free Consult
              </button>
            </div>
          </div>

          <div style={{position:'absolute',bottom:0,left:'6%',right:'6%',height:1,background:`linear-gradient(90deg,transparent,${svc.accent},transparent)`,opacity:expanded?1:0.07,transition:'opacity 0.45s'}}/>
          <div style={{position:'absolute',top:'12%',left:0,width:3,height:expanded?'88%':'18%',background:`linear-gradient(180deg,transparent,${svc.accent},transparent)`,borderRadius:'0 2px 2px 0',transition:'height 0.55s cubic-bezier(0.22,1,0.36,1)',opacity:0.7}}/>
        </div>
      </div>

      <SlideUpConsult
        visible={consultOpen}
        accent={svc.accent}
        title={svc.title}
        onClose={()=>setConsultOpen(false)}
      />
    </>
  );
};

/* ══ STAT CARD ══ */
interface MobileStatCardProps {
  s: Stat;
  i: number;
  active: boolean;
}
const MobileStatCard: React.FC<MobileStatCardProps> = ({ s, i, active }) => {
  const count = useCountUp(s.num, s.dur, active);
  return (
    <div style={{position:'relative',overflow:'hidden',borderRadius:13,padding:'20px 14px 17px',textAlign:'center',background:'rgba(7,16,32,0.95)',border:'1px solid rgba(212,175,55,0.13)',boxShadow:'0 3px 18px rgba(0,0,0,0.38)',animation:'fadeUpIn 0.55s cubic-bezier(0.22,1,0.36,1) both',animationDelay:`${i*90}ms`,flex:'0 0 calc(50% - 6px)'}}>
      <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1.5,background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.38),transparent)',borderRadius:2}}/>
      <div style={{width:42,height:42,borderRadius:11,margin:'0 auto 12px',background:'linear-gradient(135deg,#D4AF37,#F5C97A)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 18px rgba(212,175,55,0.28)'}}>
        <div style={{width:19,height:19,color:'#040C1A'}}><s.icon/></div>
      </div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'1.55rem',fontWeight:900,lineHeight:1,marginBottom:5,background:'linear-gradient(135deg,#D4AF37,#F5C97A)',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.pre}{count}{s.suf}</div>
      <div style={{fontFamily:"'Poppins',sans-serif",fontSize:10,color:'#fff',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:700,marginBottom:3}}>{s.lbl}</div>
      <div style={{fontFamily:"'Lato',sans-serif",fontSize:9,color:'rgba(199,209,219,0.3)'}}>{s.sub}</div>
    </div>
  );
};

/* ══ FLOATING FREE CONSULT PILL ══ */
const FloatingConsult: React.FC = () => {
  const [vis, setVis]             = useState<boolean>(false);
  const [pressed, setPressed]     = useState<boolean>(false);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  useEffect(() => {
    const h = () => setVis(window.scrollY > 200);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <div style={{
        position:'fixed', bottom:24, left:'50%',
        transform: vis
          ? 'translateX(-50%) translateY(0) scale(1)'
          : 'translateX(-50%) translateY(120%) scale(0.85)',
        zIndex:990,
        opacity: vis ? 1 : 0,
        transition:'transform 0.46s cubic-bezier(0.22,1,0.36,1), opacity 0.36s ease',
        pointerEvents: vis ? 'auto' : 'none',
      }}>
        <div style={{position:'absolute',inset:-10,borderRadius:100,background:'radial-gradient(ellipse,rgba(212,175,55,0.2) 0%,transparent 68%)',pointerEvents:'none',animation:'ringPulse 2.6s ease-in-out infinite'}}/>
        <button
          onTouchStart={()=>setPressed(true)}
          onTouchEnd={()=>{setPressed(false);setSheetOpen(true);}}
          onClick={()=>setSheetOpen(true)}
          style={{
            position:'relative',
            display:'flex',alignItems:'center',gap:9,
            padding:'14px 30px',borderRadius:100,border:0,cursor:'pointer',
            fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,
            background:'linear-gradient(135deg,#D4AF37,#F5C97A,#D4AF37)',
            backgroundSize:'200% auto', color:'#040C1A',
            boxShadow:'0 8px 34px rgba(212,175,55,0.58), 0 2px 12px rgba(0,0,0,0.45)',
            transform: pressed ? 'scale(0.93)' : 'scale(1)',
            transition:'transform 0.14s ease',
            WebkitTapHighlightColor:'transparent',
            animation:'consultGlow 2.8s ease-in-out infinite',
            whiteSpace:'nowrap',
          }}>
          <icons.phone/> Free Consult
        </button>
      </div>

      <SlideUpConsult
        visible={sheetOpen}
        accent="#D4AF37"
        title="Bigway Real Estate"
        onClose={()=>setSheetOpen(false)}
      />
    </>
  );
};

/* ══ MAIN PAGE ══ */
export default function ServicesSectionMobile() {
  const [heroVis,     setHeroVis]     = useState<boolean>(false);
  const [secVis,      setSecVis]      = useState<boolean>(false);
  const [statsActive, setStatsActive] = useState<boolean>(false);
  const secRef   = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{const t=setTimeout(()=>setHeroVis(true),150);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    const o1=new IntersectionObserver(([e])=>{if(e.isIntersecting)setSecVis(true);},{threshold:0.05});
    const o2=new IntersectionObserver(([e])=>{if(e.isIntersecting)setStatsActive(true);},{threshold:0.1});
    if(secRef.current)o1.observe(secRef.current);
    if(statsRef.current)o2.observe(statsRef.current);
    return()=>{o1.disconnect();o2.disconnect();};
  },[]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Lato:wght@300;400;600;700&family=Poppins:wght@500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        html{scroll-behavior:smooth;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{overflow-x:hidden;background:#030A16;}
        @keyframes shimmerText  {0%{background-position:-200%}100%{background-position:200%}}
        @keyframes pulseDot     {0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.7)}60%{box-shadow:0 0 0 7px rgba(212,175,55,0)}}
        @keyframes gemGlow      {0%,100%{box-shadow:0 0 7px rgba(212,175,55,.55)}50%{box-shadow:0 0 20px rgba(212,175,55,.95)}}
        @keyframes driftA       {0%,100%{transform:translate(0,0)}50%{transform:translate(14px,-20px)}}
        @keyframes driftB       {0%,100%{transform:translate(0,0)}50%{transform:translate(-11px,17px)}}
        @keyframes fadeUpIn     {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes floatBadge   {0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes sweepLine    {0%{left:-100%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:140%;opacity:0}}
        @keyframes arrowBounce  {0%,55%,100%{transform:translateY(0)}27%{transform:translateY(6px)}}
        @keyframes consultGlow  {0%,100%{box-shadow:0 6px 28px rgba(212,175,55,.50)}50%{box-shadow:0 6px 46px rgba(212,175,55,.88)}}
        @keyframes ringPulse    {0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
      `}</style>

      {/* ── HERO ── */}
      <header style={{position:'relative',minHeight:'100svh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',background:'#030A16',padding:'80px 18px 60px'}}>
        <div style={{position:'absolute',top:-90,left:-70,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(212,175,55,0.06) 0%,transparent 65%)',filter:'blur(45px)',animation:'driftA 20s ease-in-out infinite',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-100,right:-70,width:250,height:250,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,201,122,0.05) 0%,transparent 62%)',filter:'blur(55px)',animation:'driftB 26s ease-in-out infinite 2s',pointerEvents:'none'}}/>
        <MobileGrid/>
        <div style={{position:'relative',zIndex:5,textAlign:'center',opacity:heroVis?1:0,transform:heroVis?'none':'translateY(28px)',transition:'opacity 0.85s cubic-bezier(0.22,1,0.36,1),transform 0.85s cubic-bezier(0.22,1,0.36,1)',width:'100%',maxWidth:390,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,marginBottom:22,padding:'8px 16px',borderRadius:9,background:'rgba(2,7,18,0.9)',backdropFilter:'blur(18px)',border:'1px solid rgba(212,175,55,0.28)',boxShadow:'0 0 30px rgba(212,175,55,0.1)'}}>
            <div style={{width:5,height:5,borderRadius:'50%',background:'#D4AF37',animation:'pulseDot 2.4s ease-out infinite'}}/>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'#D4AF37'}}>Bigway Real Estate · CBE</span>
            <div style={{width:5,height:5,borderRadius:'50%',background:'#D4AF37',animation:'pulseDot 2.4s ease-out infinite 0.7s'}}/>
          </div>
          <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:'2.35rem',lineHeight:1.1,color:'#fff',marginBottom:4,letterSpacing:'-0.02em'}}>Everything<br/>You Need,</h1>
          <span style={{display:'block',fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:'2.35rem',lineHeight:1.1,marginBottom:18,background:'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',animation:'shimmerText 7s linear infinite',letterSpacing:'-0.02em'}}>Under One Roof</span>
          <p style={{fontFamily:"'Lato',sans-serif",fontSize:14,lineHeight:1.82,color:'rgba(199,209,219,0.58)',maxWidth:300,margin:'0 auto 24px',fontWeight:300}}>From land to luxury villas — Bigway is Coimbatore's complete real estate partner.</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:26}}>
            <div style={{height:1,width:52,background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)'}}/>
            <div style={{width:6,height:6,background:'#D4AF37',transform:'rotate(45deg)',boxShadow:'0 0 11px rgba(212,175,55,0.8)',animation:'gemGlow 3.5s ease-in-out infinite'}}/>
            <div style={{height:1,width:52,background:'linear-gradient(270deg,transparent,rgba(212,175,55,0.5),transparent)'}}/>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:9,flexWrap:'wrap'}}>
            {[{n:'500+',l:'Sold'},{n:'15+',l:'Years'},{n:'₹200Cr',l:'Closed'}].map((s,i)=>(
              <div key={i} style={{padding:'8px 14px',background:'rgba(2,7,18,0.85)',backdropFilter:'blur(14px)',border:'1px solid rgba(212,175,55,0.18)',borderRadius:9,textAlign:'center',animation:'floatBadge 4s ease-in-out infinite',animationDelay:`${i*0.5}s`}}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:800,color:'#D4AF37',lineHeight:1}}>{s.n}</div>
                <div style={{fontFamily:"'Lato',sans-serif",fontSize:8.5,fontWeight:700,letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(199,209,219,0.4)',marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{position:'absolute',bottom:20,left:'50%',transform:'translateX(-50%)',zIndex:5,opacity:heroVis?0.55:0,transition:'opacity 1s 1.4s',display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:6.5,fontWeight:700,letterSpacing:'0.28em',textTransform:'uppercase',color:'rgba(212,175,55,0.55)'}}>SCROLL</span>
          <div style={{width:1,height:24,background:'linear-gradient(180deg,rgba(212,175,55,0.48),transparent)'}}/>
        </div>
      </header>

      {/* ── SERVICES ── */}
      <section ref={secRef} style={{position:'relative',overflow:'hidden',background:'#030A16',padding:'52px 0 44px'}}>
        <div style={{position:'absolute',top:-80,left:-60,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(212,175,55,0.048) 0%,transparent 65%)',filter:'blur(70px)',animation:'driftA 18s ease-in-out infinite',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:5,padding:'0 14px'}}>
          <div style={{textAlign:'center',marginBottom:28,opacity:secVis?1:0,transform:secVis?'none':'translateY(22px)',transition:'opacity 0.65s,transform 0.65s'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 13px',borderRadius:7,marginBottom:12,background:'rgba(212,175,55,0.07)',border:'1px solid rgba(212,175,55,0.2)'}}>
              <svg width="9" height="9" fill="#D4AF37" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,fontWeight:700,letterSpacing:'0.24em',textTransform:'uppercase',color:'#D4AF37'}}>What We Offer</span>
            </div>
            <h2 style={{fontFamily:"'Cinzel',serif",fontWeight:800,fontSize:'1.65rem',color:'#fff',margin:'0 0 9px',lineHeight:1.2}}>
              Our <span style={{background:'linear-gradient(90deg,#F5C97A,#D4AF37)',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent'}}>6 Services</span>
            </h2>
            <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:'rgba(199,209,219,0.48)',lineHeight:1.78,fontWeight:300,maxWidth:280,margin:'0 auto'}}>
              Tap the <span style={{color:'rgba(212,175,55,0.9)',fontWeight:600}}>↓ VIEW DETAILS</span> arrow on any card to expand.
            </p>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:52}}>
            {SERVICES.map((svc: Service, i: number)=><MobileServiceCard key={svc.id} svc={svc} index={i} visible={secVis}/>)}
          </div>

          <div ref={statsRef}>
            <div style={{textAlign:'center',marginBottom:18,opacity:secVis?1:0,transition:'opacity 0.65s 0.25s'}}>
              <div style={{display:'flex',alignItems:'center',gap:9,justifyContent:'center'}}>
                <div style={{height:1,width:36,background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.38))'}}/>
                <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase',color:'rgba(212,175,55,0.5)'}}>OUR NUMBERS</span>
                <div style={{height:1,width:36,background:'linear-gradient(270deg,transparent,rgba(212,175,55,0.38))'}}/>
              </div>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:11,justifyContent:'center'}}>
              {STATS.map((s: Stat, i: number)=><MobileStatCard key={i} s={s} i={i} active={statsActive}/>)}
            </div>
          </div>

          <div style={{marginTop:36,padding:'26px 18px',borderRadius:14,background:'linear-gradient(150deg,#0D1E3A,#05101D)',border:'1px solid rgba(212,175,55,0.18)',textAlign:'center',position:'relative',overflow:'hidden',opacity:secVis?1:0,transition:'opacity 0.65s 0.45s'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1.5,background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.45),transparent)'}}/>
            <div style={{width:48,height:48,borderRadius:12,margin:'0 auto 13px',background:'linear-gradient(135deg,#D4AF37,#F5C97A)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 24px rgba(212,175,55,0.32)',color:'#040C1A'}}><icons.phone/></div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(212,175,55,0.42)',marginBottom:7}}>FREE CONSULTATION</div>
            <p style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:'1.05rem',color:'#fff',margin:'0 0 6px',lineHeight:1.25}}>Not Sure Where to Start?</p>
            <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:'rgba(199,209,219,0.4)',lineHeight:1.7,fontWeight:300,margin:'0 0 16px'}}>Talk to our experts — free, no commitment.</p>
            <button onTouchStart={(e: React.TouchEvent<HTMLButtonElement>)=>e.currentTarget.style.transform='scale(0.95)'} onTouchEnd={(e: React.TouchEvent<HTMLButtonElement>)=>e.currentTarget.style.transform='scale(1)'} style={{display:'inline-flex',alignItems:'center',gap:7,padding:'13px 28px',borderRadius:100,border:0,cursor:'pointer',fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:13.5,background:'linear-gradient(135deg,#D4AF37,#F5C97A)',color:'#040C1A',boxShadow:'0 5px 24px rgba(212,175,55,0.46)',transition:'transform 0.14s ease',WebkitTapHighlightColor:'transparent'}}>
              <icons.phone/> Call Now
            </button>
          </div>
          <div style={{textAlign:'center',marginTop:24,paddingBottom:80,opacity:0.28}}>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:6.5,fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase',color:'#D4AF37'}}>COIMBATORE · EST. 2009 · BIGWAY</span>
          </div>
        </div>
      </section>

      <FloatingConsult/>
    </>
  );
}