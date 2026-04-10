'use client';
import React, { useState, useEffect, useRef } from 'react';


interface Blip {
  col: number;
  progress: number;
  speed: number;
  alpha: number;
}

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

/* ══ ANIMATED GRID CANVAS ══ */
const AnimatedGrid: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const fr = useRef<number>(0);
  const blips = useRef<Blip[]>([]);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    let raf: number, W: number, H: number;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; });
    const iv = setInterval(() => blips.current.push({ col: Math.floor(Math.random()*14), progress:0, speed:0.002+Math.random()*0.003, alpha:0.5+Math.random()*0.4 }), 1200);
    const draw = () => {
      fr.current++; ctx.clearRect(0, 0, W, H);
      const COLS=14,ROWS=10,cW=W/COLS,cH=H/ROWS,t=fr.current*0.01;
      for(let col=0;col<=COLS;col++){const x=col*cW,dx=x-mouse.current.x,dy=H/2-mouse.current.y,pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/350),ba=0.05+pr*0.2;const g=ctx.createLinearGradient(x,0,x,H);g.addColorStop(0,'rgba(212,175,55,0)');g.addColorStop(0.3,`rgba(212,175,55,${ba})`);g.addColorStop(0.7,`rgba(212,175,55,${ba})`);g.addColorStop(1,'rgba(212,175,55,0)');ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle=g;ctx.lineWidth=pr>0.3?1.2:0.6;ctx.stroke();}
      for(let row=0;row<=ROWS;row++){const y=row*cH,dx=W/2-mouse.current.x,dy=y-mouse.current.y,pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/350),ba=0.05+pr*0.2;const g=ctx.createLinearGradient(0,y,W,y);g.addColorStop(0,'rgba(212,175,55,0)');g.addColorStop(0.2,`rgba(212,175,55,${ba})`);g.addColorStop(0.8,`rgba(212,175,55,${ba})`);g.addColorStop(1,'rgba(212,175,55,0)');ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle=g;ctx.lineWidth=pr>0.3?1.2:0.6;ctx.stroke();}
      for(let col=0;col<=COLS;col++)for(let row=0;row<=ROWS;row++){const x=col*cW,y=row*cH,dx=x-mouse.current.x,dy=y-mouse.current.y,pr=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/220),pulse=0.5+0.5*Math.sin(t*1.2+col*0.6+row*0.8);ctx.beginPath();ctx.arc(x,y,1+pulse*0.5+pr*3.5,0,Math.PI*2);ctx.fillStyle=`rgba(212,175,55,${0.1+pulse*0.08+pr*0.6})`;ctx.fill();}
      blips.current = blips.current.filter((b: Blip) => b.progress < 1);
      for(const b of blips.current){b.progress+=b.speed;const x=b.col*cW,y=b.progress*H;const bg=ctx.createLinearGradient(x,y-80,x,y+4);bg.addColorStop(0,'rgba(212,175,55,0)');bg.addColorStop(1,`rgba(255,220,100,${b.alpha})`);ctx.beginPath();ctx.moveTo(x,y-80);ctx.lineTo(x,y);ctx.strokeStyle=bg;ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fillStyle=`rgba(255,220,100,${b.alpha})`;ctx.fill();}
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); clearInterval(iv); };
  }, []);
  return <canvas ref={ref} style={{position:'absolute',inset:0,zIndex:0,pointerEvents:'none'}}/>;
};

/* ══ ICONS ══ */
const icons = {
  sell:  ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  land:  ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M2 20h20M7 20V10l5-5 5 5v10"/><path d="M10 20v-5h4v5"/></svg>,
  build: ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M2 15h20M9 3v18M15 3v18"/></svg>,
  flat:  ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="3" y="2" width="18" height="20" rx="2"/><path d="M3 8h18M3 14h18M9 2v20M15 2v20"/></svg>,
  villa: ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-8h6v8"/></svg>,
  comm:  ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  arrow: ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:11,height:11}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  phone: ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63a19.79 19.79 0 01-3-8.59A2 2 0 012.08 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.46a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  star:  ():React.ReactElement=><svg viewBox="0 0 24 24" fill="currentColor" style={{width:'100%',height:'100%'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  bldg:  ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  cal:   ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  rupee: ():React.ReactElement=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><line x1="6" y1="5" x2="18" y2="5"/><line x1="6" y1="10" x2="18" y2="10"/><path d="M6 10c0 5 4 9 9 9"/><line x1="6" y1="10" x2="15" y2="21"/></svg>,
};

const SERVICES: Service[] = [
  { id:'01', title:'Property Selling', sub:'Sell Fast · Best Price', icon:icons.sell, img:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=85', accent:'#D4AF37', stat:'500+', statLbl:'Properties Sold', desc:'Expert valuation, targeted marketing & direct access to 5,000+ verified buyers. We close at the best price — fast.', types:[{e:'🏠',l:'Houses'},{e:'🏢',l:'Apartments'},{e:'🌳',l:'Agri Land'},{e:'📐',l:'Plots'},{e:'🏪',l:'Shops'},{e:'🏭',l:'Industrial'}] },
  { id:'02', title:'Land Selling', sub:'Plots · Sites · Farm', icon:icons.land, img:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=85', accent:'#C8964A', stat:'300+', statLbl:'Plots Listed', desc:'Clear-title land across Coimbatore — from residential plots to agricultural farmland and industrial zones.', types:[{e:'📐',l:'Res. Plots'},{e:'🌾',l:'Agri Land'},{e:'🏭',l:'Industrial'},{e:'🏪',l:'Comm. Plots'},{e:'🌳',l:'Farm Land'},{e:'🛣️',l:'Highway'}] },
  { id:'03', title:'Construction', sub:'Design · Build · Deliver', icon:icons.build, img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=85', accent:'#D4AF37', stat:'150+', statLbl:'Projects Built', desc:'Turnkey construction from architectural design to final finishes. Your vision, engineered to perfection.', types:[{e:'🏠',l:'Houses'},{e:'🏘️',l:'Row Houses'},{e:'🏢',l:'Apartments'},{e:'🏪',l:'Commercial'},{e:'🏭',l:'Sheds'},{e:'🏡',l:'Villas'}] },
  { id:'04', title:'Flats & Apartments', sub:'Buy · Sell · Rent', icon:icons.flat, img:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85', accent:'#E8C547', stat:'200+', statLbl:'Units Listed', desc:"1BHK to luxury penthouses — curated listings across Coimbatore's most sought-after residential neighbourhoods.", types:[{e:'🛏️',l:'1 BHK'},{e:'🛏️',l:'2 BHK'},{e:'🛏️',l:'3 BHK'},{e:'🛏️',l:'4 BHK+'},{e:'🏢',l:'Studio'},{e:'🌟',l:'Penthouse'}] },
  { id:'05', title:'Villas & Independent', sub:'Exclusive Properties', icon:icons.villa, img:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=85', accent:'#D4AF37', stat:'80+', statLbl:'Premium Listings', desc:"Gated villas, luxury bungalows & independent houses in Coimbatore's finest addresses.", types:[{e:'🏡',l:'Gated Villas'},{e:'🏠',l:'Ind. Houses'},{e:'🌿',l:'Farm Houses'},{e:'🏘️',l:'Duplex'},{e:'🏰',l:'Bungalows'},{e:'✨',l:'Luxury'}] },
  { id:'06', title:'Commercial', sub:'Offices · Shops · Sheds', icon:icons.comm, img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85', accent:'#C8964A', stat:'120+', statLbl:'Deals Closed', desc:'High-ROI commercial spaces across Coimbatore — from retail frontage to Grade-A office suites.', types:[{e:'🏢',l:'Offices'},{e:'🏪',l:'Retail'},{e:'🏭',l:'Warehouses'},{e:'🍽️',l:'Restaurants'},{e:'🏬',l:'Showrooms'},{e:'📦',l:'Storage'}] },
];

const STATS: Stat[] = [
  { num:500, suf:'+', pre:'', lbl:'Properties Sold', sub:'Across Coimbatore', icon:icons.bldg, dur:2000 },
  { num:98,  suf:'%', pre:'', lbl:'Client Satisfaction', sub:'Verified Reviews', icon:icons.star, dur:1800 },
  { num:15,  suf:'+', pre:'', lbl:'Years Experience', sub:'In Real Estate', icon:icons.cal, dur:1600 },
  { num:200, suf:'Cr+', pre:'₹', lbl:'Value Closed', sub:'Total Deals', icon:icons.rupee, dur:2200 },
];

/* ══ HOOKS ══ */
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

function useWindowWidth(): number {
  const [w, setW] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1440);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

/* ══ CORNER ACCENTS ══ */
interface CornerAccentsProps {
  size?: number;
  color?: string;
  hov?: boolean;
}
const CornerAccents: React.FC<CornerAccentsProps> = ({ size=16, color='rgba(212,175,55,0.4)', hov=false }) => (
  <>{[['top','left','borderTop','borderLeft'],['top','right','borderTop','borderRight'],['bottom','left','borderBottom','borderLeft'],['bottom','right','borderBottom','borderRight']].map(([v,h,bt,bl],i)=>(
    <div key={i} style={{position:'absolute',[v as string]:0,[h as string]:0,width:hov?size+7:size,height:hov?size+7:size,[bt as string]:`1.5px solid ${color}`,[bl as string]:`1.5px solid ${color}`,transition:'all 0.4s ease',zIndex:10,pointerEvents:'none'}}/>
  ))}</>
);

/* ══ SERVICE CARD ══ */
interface ServiceCardProps {
  svc: Service;
  variant?: string;
}
const ServiceCard: React.FC<ServiceCardProps> = ({ svc, variant='standard' }) => {
  const [hov, setHov] = useState<boolean>(false);
  const w = useWindowWidth();
  const isHero = variant === 'hero';
  const imgPct = isHero ? '58%' : '52%';
  const cardRadius = w>=1200?20:w>=900?16:14;
  const pad = isHero?(w>=1200?'20px 24px 24px':'16px 20px 20px'):(w>=900?'16px 20px 20px':'14px 16px 18px');
  const titleSize = isHero?(w>=1440?'1.35rem':w>=1200?'1.2rem':'1.05rem'):(w>=1200?'1.05rem':'.95rem');
  const statFontSize = isHero?(w>=1440?20:17):(w>=1200?16:14);
  const iconBoxSize = isHero?(w>=1440?46:40):(w>=1200?38:34);
  const iconSize = isHero?(w>=1440?20:17):(w>=1200?16:14);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{position:'relative',width:'100%',height:'100%',borderRadius:cardRadius,overflow:'hidden',background:'linear-gradient(170deg,#0D1E3A 0%,#060F1E 55%,#030A15 100%)',border:`1px solid ${hov?svc.accent+'BB':'rgba(212,175,55,0.12)'}`,boxShadow:hov?`0 44px 110px rgba(0,0,0,0.88),0 0 90px ${svc.accent}20`:'0 6px 32px rgba(0,0,0,0.52)',transform:hov?'translateY(-7px) scale(1.008)':'none',transition:'all 0.55s cubic-bezier(0.22,1,0.36,1)',cursor:'pointer',display:'flex',flexDirection:'column'}}>
      <div style={{position:'relative',overflow:'hidden',height:imgPct,flexShrink:0}}>
        <img src={svc.img} alt={svc.title} style={{width:'100%',height:'100%',objectFit:'cover',filter:hov?'brightness(0.68) saturate(0.9)':'brightness(0.25) saturate(0.4)',transform:hov?'scale(1.07)':'scale(1.02)',transition:'all 1.3s cubic-bezier(0.22,1,0.36,1)'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(3,10,22,0.08) 0%,rgba(3,10,22,0.22) 42%,rgba(3,10,22,1) 100%)'}}/>
        {hov&&<div style={{position:'absolute',left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${svc.accent}FF,transparent)`,animation:'scanLine 2s linear infinite',zIndex:5}}/>}
        <div style={{position:'absolute',bottom:-18,right:10,fontFamily:"'Orbitron',sans-serif",fontSize:isHero?120:90,fontWeight:900,lineHeight:1,color:hov?`${svc.accent}2A`:'rgba(212,175,55,0.07)',pointerEvents:'none',userSelect:'none',transition:'color 0.7s',letterSpacing:'-0.06em'}}>{svc.id}</div>
        <div style={{position:'absolute',top:14,left:14,zIndex:4}}>
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'4px 11px',borderRadius:100,background:`linear-gradient(135deg,${svc.accent},${svc.accent}BB)`,fontFamily:"'Orbitron',sans-serif",fontSize:8,fontWeight:800,letterSpacing:'0.18em',color:'#040C1A'}}><div style={{width:4,height:4,borderRadius:'50%',background:'#040C1A',opacity:0.6}}/>{svc.id}</div>
        </div>
        <div style={{position:'absolute',top:14,right:14,zIndex:4}}>
          <div style={{padding:`${w>=1200?8:6}px ${w>=1200?14:10}px`,background:'rgba(2,7,18,0.93)',backdropFilter:'blur(16px)',border:`1px solid ${svc.accent}55`,borderRadius:10,textAlign:'center'}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:statFontSize,fontWeight:900,color:svc.accent,lineHeight:1}}>{svc.stat}</div>
            <div style={{fontFamily:"'Lato',sans-serif",fontSize:8,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(199,209,219,0.38)',marginTop:3}}>{svc.statLbl}</div>
          </div>
        </div>
        <div style={{position:'absolute',bottom:16,left:16,zIndex:4,display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:iconBoxSize,height:iconBoxSize,borderRadius:11,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:`${svc.accent}25`,border:`1.5px solid ${svc.accent}65`,color:svc.accent,backdropFilter:'blur(10px)',transform:hov?'rotate(9deg) scale(1.14)':'none',transition:'transform 0.45s cubic-bezier(0.22,1,0.36,1)'}}>
            <div style={{width:iconSize,height:iconSize}}><svc.icon/></div>
          </div>
          <div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:`${svc.accent}80`,marginBottom:3}}>{svc.sub}</div>
            <h3 style={{fontFamily:"'Cinzel',serif",fontWeight:800,fontSize:titleSize,color:'#FFFFFF',margin:0,lineHeight:1.18,textShadow:'0 2px 24px rgba(0,0,0,0.85)'}}>{svc.title}</h3>
          </div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',padding:pad}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <div style={{height:2,width:24,borderRadius:2,background:`linear-gradient(90deg,${svc.accent},transparent)`}}/>
          <div style={{height:1,flex:1,background:'rgba(255,255,255,0.045)'}}/>
          <div style={{height:2,width:8,borderRadius:2,background:svc.accent,opacity:0.45}}/>
        </div>
        <p style={{fontFamily:"'Lato',sans-serif",fontSize:isHero?13:11.5,lineHeight:1.8,color:'rgba(199,209,219,0.56)',fontWeight:300,margin:'0 0 14px'}}>{svc.desc}</p>
        <div style={{marginTop:'auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
            <div style={{width:10,height:1,background:`${svc.accent}70`}}/>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,fontWeight:800,letterSpacing:'0.32em',textTransform:'uppercase',color:`${svc.accent}55`}}>PROPERTY TYPES</span>
            <div style={{flex:1,height:1,background:`linear-gradient(90deg,${svc.accent}20,transparent)`}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px',marginBottom:18}}>
            {svc.types.map((t: ServiceType, i: number)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:5,padding:`${w>=1200?7:6}px ${w>=1200?10:8}px`,borderRadius:8,background:hov?`${svc.accent}16`:'rgba(255,255,255,0.038)',border:`1px solid ${hov?svc.accent+'3C':'rgba(255,255,255,0.075)'}`,transition:`all 0.35s ease ${i*35}ms`}}>
                <span style={{fontSize:12,lineHeight:1,flexShrink:0}}>{t.e}</span>
                <span style={{fontFamily:"'Lato',sans-serif",fontSize:9.5,fontWeight:600,lineHeight:1.25,color:hov?'#EDD98A':'rgba(199,209,219,0.52)',transition:`color 0.3s ease ${i*35}ms`}}>{t.l}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>)=>{e.currentTarget.style.boxShadow=`0 0 38px ${svc.accent}78`;e.currentTarget.style.transform='scale(1.06)';}} onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>)=>{e.currentTarget.style.boxShadow=`0 4px 22px ${svc.accent}48`;e.currentTarget.style.transform='scale(1)';}} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'10px 20px',borderRadius:100,border:0,cursor:'pointer',fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:11,background:`linear-gradient(135deg,${svc.accent},#F5C97A,${svc.accent})`,backgroundSize:'200% auto',color:'#040C1A',boxShadow:`0 4px 22px ${svc.accent}48`,transition:'all 0.3s'}}>Enquire Now <icons.arrow/></button>
            <span style={{fontFamily:"'Lato',sans-serif",fontSize:9.5,fontWeight:600,color:`${svc.accent}50`,letterSpacing:'0.12em',textTransform:'uppercase'}}>Free Consult</span>
          </div>
        </div>
      </div>
      <CornerAccents size={14} color={hov?`${svc.accent}82`:'rgba(212,175,55,0.18)'} hov={hov}/>
      <div style={{position:'absolute',bottom:0,left:'8%',right:'8%',height:1,background:`linear-gradient(90deg,transparent,${svc.accent},transparent)`,opacity:hov?1:0.1,transition:'opacity 0.5s'}}/>
      <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% -5%,${svc.accent}18 0%,transparent 55%)`,opacity:hov?1:0,transition:'opacity 0.55s',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'18%',left:0,width:3,height:hov?'65%':'28%',background:`linear-gradient(180deg,transparent,${svc.accent},transparent)`,borderRadius:'0 2px 2px 0',transition:'height 0.65s cubic-bezier(0.22,1,0.36,1)',opacity:0.75}}/>
    </div>
  );
};

/* ══ STAT CARD ══ */
interface StatCardProps {
  s: Stat;
  i: number;
  active: boolean;
}
const StatCard: React.FC<StatCardProps> = ({ s, i, active }) => {
  const count = useCountUp(s.num, s.dur, active);
  const [hov, setHov] = useState<boolean>(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{position:'relative',overflow:'hidden',borderRadius:16,padding:'28px 18px 24px',textAlign:'center',background:'rgba(7,16,32,0.93)',backdropFilter:'blur(24px)',border:`1px solid ${hov?'rgba(212,175,55,0.62)':'rgba(212,175,55,0.12)'}`,boxShadow:hov?'0 26px 64px rgba(0,0,0,0.62)':'0 4px 24px rgba(0,0,0,0.38)',transform:hov?'translateY(-7px)':'none',transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)',animation:'fadeUpIn 0.7s cubic-bezier(0.22,1,0.36,1) both',animationDelay:`${i*130}ms`}}>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(212,175,55,0.07),transparent)',opacity:hov?1:0,transition:'opacity 0.5s'}}/>
      <div style={{width:50,height:50,borderRadius:13,margin:'0 auto 16px',background:'linear-gradient(135deg,#D4AF37,#F5C97A)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:hov?'0 0 48px rgba(212,175,55,0.72)':'0 0 24px rgba(212,175,55,0.28)',transform:hov?'scale(1.13) rotate(7deg)':'none',transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)'}}>
        <div style={{width:22,height:22,color:'#040C1A'}}><s.icon/></div>
      </div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(1.6rem,2.2vw,2.2rem)',fontWeight:900,lineHeight:1,marginBottom:8,background:'linear-gradient(135deg,#D4AF37,#F5C97A,#B8941F)',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.pre}{count}{s.suf}</div>
      <div style={{fontFamily:"'Poppins',sans-serif",fontSize:11,color:'#fff',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:700,marginBottom:4}}>{s.lbl}</div>
      <div style={{fontFamily:"'Lato',sans-serif",fontSize:10,color:'rgba(199,209,219,0.34)'}}>{s.sub}</div>
    </div>
  );
};

/* ══ FLOAT CHIP ══ */
interface FloatChipProps {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}
const FloatChip: React.FC<FloatChipProps> = ({ children, delay=0, style={} }) => (
  <div style={{padding:'12px 16px',background:'rgba(2,7,18,0.96)',backdropFilter:'blur(20px)',border:'1px solid rgba(212,175,55,0.22)',borderRadius:12,textAlign:'center',animation:'floatDrift 4.5s ease-in-out infinite',animationDelay:`${delay}s`,boxShadow:'0 10px 36px rgba(0,0,0,0.58)',...style}}>{children}</div>
);
const chipNum: React.CSSProperties = {fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:800,color:'#D4AF37',lineHeight:1,marginBottom:4};
const chipLbl: React.CSSProperties = {fontFamily:"'Lato',sans-serif",fontSize:8,fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(199,209,219,0.5)'};
const vLine = (op: number = 0.25): React.CSSProperties => ({width:1,height:28,background:`rgba(212,175,55,${op})`});
const orbDot = (d: number = 0): React.CSSProperties => ({width:5,height:5,borderRadius:'50%',background:'#D4AF37',boxShadow:'0 0 10px rgba(212,175,55,0.8)',animation:'orbPulse 2s ease-in-out infinite',animationDelay:`${d}s`});

interface DiamondProps {
  d?: number;
}
const Diamond: React.FC<DiamondProps> = ({ d=0 }) => (
  <div style={{position:'relative',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{position:'absolute',inset:0,border:'1px solid rgba(212,175,55,0.45)',transform:'rotate(45deg)',animation:`spinDiamond 8s linear infinite`,animationDelay:`${d}s`}}/>
    <div style={{width:6,height:6,background:'#D4AF37',transform:'rotate(45deg)',boxShadow:'0 0 10px rgba(212,175,55,0.9)'}}/>
  </div>
);

/* ══ SIDE PANELS ══ */
interface PanelProps {
  visible: boolean;
}
const LeftPanel: React.FC<PanelProps> = ({ visible }) => (
  <div style={{position:'absolute',left:0,top:0,bottom:0,width:'calc((100% - clamp(700px,76vw,960px))/2)',zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 12px',opacity:visible?1:0,transform:visible?'translateX(0)':'translateX(-52px)',transition:'opacity 1.2s .3s,transform 1.2s .3s',pointerEvents:'none'}}>
    <div style={{width:1,height:44,background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.35))'}}/>
    <FloatChip delay={0.3} style={{minWidth:110}}><div style={chipNum}>6+</div><div style={chipLbl}>Services</div></FloatChip>
    <div style={vLine()}/><div style={orbDot(0)}/><div style={vLine()}/>
    <FloatChip delay={0.8} style={{minWidth:110}}><div style={chipNum}>500+</div><div style={chipLbl}>Deals Closed</div></FloatChip>
    <div style={vLine()}/><Diamond d={0}/><div style={vLine()}/>
    <div style={{padding:'6px 12px',border:'1px solid rgba(212,175,55,0.28)',borderRadius:100,animation:'floatDrift 5.5s ease-in-out infinite 1.2s'}}>
      <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'#D4AF37'}}>FULL SERVICE</span>
    </div>
    <div style={{width:1,height:44,background:'linear-gradient(180deg,rgba(212,175,55,0.35),transparent)'}}/>
    <div style={{position:'absolute',bottom:'12%',left:8,transform:'rotate(-90deg)',transformOrigin:'center',fontFamily:"'Orbitron',sans-serif",fontSize:6.5,fontWeight:700,letterSpacing:'0.3em',color:'rgba(212,175,55,0.3)',whiteSpace:'nowrap'}}>COIMBATORE · EST. 2009</div>
  </div>
);

const RightPanel: React.FC<PanelProps> = ({ visible }) => (
  <div style={{position:'absolute',right:0,top:0,bottom:0,width:'calc((100% - clamp(700px,76vw,960px))/2)',zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 12px',opacity:visible?1:0,transform:visible?'translateX(0)':'translateX(52px)',transition:'opacity 1.2s .3s,transform 1.2s .3s',pointerEvents:'none'}}>
    <div style={{width:1,height:44,background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.35))'}}/>
    <div style={{width:110,height:72,borderRadius:9,overflow:'hidden',border:'1px solid rgba(212,175,55,0.25)',animation:'floatDrift 4s ease-in-out infinite 0.5s',flexShrink:0,position:'relative'}}>
      <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80" alt="premium" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.5) saturate(0.7)'}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 30%,rgba(4,10,20,0.9) 100%)'}}/>
      <div style={{position:'absolute',bottom:5,left:7}}><span style={{fontFamily:"'Orbitron',sans-serif",fontSize:6.5,fontWeight:700,letterSpacing:'0.14em',color:'#D4AF37',textTransform:'uppercase'}}>Premium</span></div>
    </div>
    <div style={vLine()}/><div style={orbDot(0.5)}/><div style={vLine()}/>
    <FloatChip delay={0.5} style={{minWidth:110}}><div style={chipNum}>15+</div><div style={chipLbl}>Bank Tie-ups</div></FloatChip>
    <div style={vLine()}/><Diamond d={2}/><div style={vLine()}/>
    <FloatChip delay={1.0} style={{minWidth:110}}><div style={{...chipNum,fontSize:15}}>₹200Cr+</div><div style={chipLbl}>Value Closed</div></FloatChip>
    <div style={{width:1,height:44,background:'linear-gradient(180deg,rgba(212,175,55,0.35),transparent)'}}/>
    <div style={{position:'absolute',bottom:'12%',right:8,transform:'rotate(90deg)',transformOrigin:'center',fontFamily:"'Orbitron',sans-serif",fontSize:6.5,fontWeight:700,letterSpacing:'0.3em',color:'rgba(212,175,55,0.3)',whiteSpace:'nowrap'}}>LUXURY · REAL · ESTATE</div>
  </div>
);

/* ══ CTA TILE ══ */
const CTATile: React.FC = () => {
  const [hov, setHov] = useState<boolean>(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{position:'relative',borderRadius:20,overflow:'hidden',background:'linear-gradient(165deg,#0D1E3A,#05101D)',border:`1px solid ${hov?'rgba(212,175,55,0.58)':'rgba(212,175,55,0.16)'}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 22px',textAlign:'center',boxShadow:hov?'0 28px 75px rgba(0,0,0,0.78)':'0 6px 30px rgba(0,0,0,0.48)',transform:hov?'translateY(-7px)':'none',transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)',cursor:'pointer',height:'100%'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 0%,rgba(212,175,55,0.13) 0%,transparent 62%)',opacity:hov?1:0.22,transition:'opacity 0.5s'}}/>
      <CornerAccents size={13} color={hov?'rgba(212,175,55,0.68)':'rgba(212,175,55,0.26)'} hov={hov}/>
      <div style={{position:'relative',zIndex:2}}>
        <div style={{width:54,height:54,borderRadius:14,margin:'0 auto 16px',background:'linear-gradient(135deg,#D4AF37,#F5C97A)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:hov?'0 0 48px rgba(212,175,55,0.65)':'0 0 26px rgba(212,175,55,0.32)',transform:hov?'scale(1.11) rotate(7deg)':'none',transition:'all 0.45s',color:'#040C1A'}}><icons.phone/></div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:'0.28em',textTransform:'uppercase',color:'rgba(212,175,55,0.48)',marginBottom:8}}>FREE CONSULTATION</div>
        <p style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:'1rem',color:'#fff',margin:'0 0 8px',lineHeight:1.3}}>Not Sure Where to Start?</p>
        <p style={{fontFamily:"'Lato',sans-serif",fontSize:11.5,color:'rgba(199,209,219,0.42)',lineHeight:1.75,fontWeight:300,margin:'0 0 20px'}}>Our experts guide you — free, no commitment.</p>
        <button onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>)=>{e.currentTarget.style.boxShadow='0 0 42px rgba(212,175,55,0.78)';e.currentTarget.style.transform='scale(1.07)';}} onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>)=>{e.currentTarget.style.boxShadow='0 4px 24px rgba(212,175,55,0.48)';e.currentTarget.style.transform='scale(1)';}} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 22px',borderRadius:100,border:0,cursor:'pointer',fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:11.5,background:'linear-gradient(135deg,#D4AF37,#F5C97A)',color:'#040C1A',boxShadow:'0 4px 24px rgba(212,175,55,0.48)',transition:'all 0.3s'}}><icons.phone/> Call Now</button>
      </div>
    </div>
  );
};

/* ══ MAIN EXPORT ══ */
export default function ServicesSectionDesktop() {
  const [heroVisible, setHeroVisible] = useState<boolean>(false);
  const [sectionVisible, setSectionVisible] = useState<boolean>(false);
  const [statsActive, setStatsActive] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const w = useWindowWidth();

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 200); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const o1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSectionVisible(true); }, { threshold: 0.04 });
    const o2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsActive(true); }, { threshold: 0.15 });
    if (sectionRef.current) o1.observe(sectionRef.current);
    if (statsRef.current) o2.observe(statsRef.current);
    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);

  const fadeUp = (delay: number = 0): React.CSSProperties => ({
    opacity: sectionVisible ? 1 : 0,
    transform: sectionVisible ? 'none' : 'translateY(36px)',
    transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay*110}ms,transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay*110}ms`,
  });

  /* Breakpoints */
  const xl = w >= 1440;
  const lg = w >= 1200;
  const md = w >= 900;

  /* Grid row heights */
  const r1 = xl?640:lg?580:md?520:460;
  const r2 = xl?580:lg?520:md?460:420;
  const r3 = xl?540:lg?490:md?430:400;

  const showPanels = w >= 1300;
  const maxW = xl?1440:lg?1280:md?1100:900;
  const px = md?28:20;
  const sectionPy = xl?92:lg?80:md?68:52;
  const headingSize = xl?'3.1rem':lg?'2.7rem':md?'2.2rem':'1.8rem';
  const heroFontSize = xl?'4.6rem':lg?'4rem':md?'3.4rem':'2.6rem';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Lato:wght@300;400;600;700&family=Poppins:wght@500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        body{overflow-x:hidden;background:#030A16;}
        @keyframes scanLine{0%{top:-2px;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0}}
        @keyframes floatDrift{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes orbPulse{0%,100%{transform:scale(1);opacity:0.8}50%{transform:scale(1.65);opacity:1}}
        @keyframes spinDiamond{from{transform:rotate(45deg)}to{transform:rotate(405deg)}}
        @keyframes shimmerText{0%{background-position:-200%}100%{background-position:200%}}
        @keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.7)}60%{box-shadow:0 0 0 9px rgba(212,175,55,0)}}
        @keyframes gemGlow{0%,100%{box-shadow:0 0 10px rgba(212,175,55,0.65)}50%{box-shadow:0 0 32px rgba(212,175,55,1)}}
        @keyframes driftA{0%,100%{transform:translate(0,0)}50%{transform:translate(25px,-35px)}}
        @keyframes driftB{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,28px)}}
        @keyframes fadeUpIn{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
      `}</style>

      {/* ── HERO ── */}
      <header style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',background:'#030A16'}}>
        <div style={{position:'absolute',top:-180,left:-160,width:xl?700:500,height:xl?700:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%)',filter:'blur(70px)',animation:'driftA 28s ease-in-out infinite',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-200,right:-160,width:xl?640:480,height:xl?640:480,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,201,122,0.04) 0%,transparent 62%)',filter:'blur(90px)',animation:'driftB 34s ease-in-out infinite 3s',pointerEvents:'none'}}/>
        <AnimatedGrid/>
        {showPanels && <LeftPanel visible={heroVisible}/>}
        {showPanels && <RightPanel visible={heroVisible}/>}
        <div style={{position:'relative',zIndex:10,textAlign:'center',padding:`100px ${px*1.5}px 64px`,maxWidth:xl?960:lg?880:md?780:680,margin:'0 auto',opacity:heroVisible?1:0,transform:heroVisible?'none':'translateY(40px)',transition:'opacity 1s,transform 1s',width:'100%'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:24,padding:'9px 22px',borderRadius:10,background:'rgba(2,7,18,0.88)',backdropFilter:'blur(28px)',border:'1px solid rgba(212,175,55,0.32)',boxShadow:'0 0 55px rgba(212,175,55,0.15)'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#D4AF37',animation:'pulseDot 2.4s ease-out infinite'}}/>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:md?10:9,fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase',color:'#D4AF37'}}>⭐ Bigway Real Estate · Coimbatore</span>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#D4AF37',animation:'pulseDot 2.4s ease-out infinite 0.7s'}}/>
          </div>
          <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:heroFontSize,lineHeight:1.06,color:'#fff',margin:'0 0 4px',letterSpacing:'-0.025em'}}>Everything You Need,</h1>
          <span style={{display:'block',fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:heroFontSize,lineHeight:1.06,margin:'0 0 24px',background:'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',animation:'shimmerText 8s linear infinite',letterSpacing:'-0.025em'}}>Under One Roof</span>
          <p style={{fontFamily:"'Lato',sans-serif",fontSize:md?'1.08rem':'1rem',lineHeight:1.9,color:'rgba(199,209,219,0.62)',maxWidth:520,margin:'0 auto 28px',fontWeight:300}}>From land to luxury villas, construction to commercial — Bigway is Coimbatore's complete real estate partner.</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14}}>
            <div style={{height:1,width:80,background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)'}}/>
            <div style={{width:7,height:7,background:'#D4AF37',transform:'rotate(45deg)',boxShadow:'0 0 14px rgba(212,175,55,0.85)',animation:'gemGlow 3.8s ease-in-out infinite'}}/>
            <div style={{height:1,width:80,background:'linear-gradient(270deg,transparent,rgba(212,175,55,0.5),transparent)'}}/>
          </div>
        </div>
        <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:5,opacity:heroVisible?0.5:0,transition:'opacity 1s 1.5s',display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:6.5,fontWeight:700,letterSpacing:'0.3em',textTransform:'uppercase',color:'rgba(212,175,55,0.55)'}}>SCROLL</span>
          <div style={{width:1,height:26,background:'linear-gradient(180deg,rgba(212,175,55,0.48),transparent)'}}/>
        </div>
      </header>

      {/* ── SERVICES SECTION ── */}
      <section ref={sectionRef} style={{position:'relative',overflow:'hidden',background:'#030A16',padding:`${sectionPy}px 0 ${sectionPy-8}px`}}>
        <div style={{position:'absolute',top:-220,left:-200,width:900,height:900,borderRadius:'50%',background:'radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%)',filter:'blur(120px)',animation:'driftA 24s ease-in-out infinite',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-250,right:-200,width:800,height:800,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,201,122,0.045) 0%,transparent 62%)',filter:'blur(140px)',animation:'driftB 30s ease-in-out infinite 2.5s',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:10,maxWidth:maxW,margin:'0 auto',padding:`0 ${px}px`}}>

          {/* Header */}
          <div style={{...fadeUp(0),textAlign:'center',marginBottom:md?56:40}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 16px',borderRadius:8,marginBottom:14,background:'rgba(212,175,55,0.07)',border:'1px solid rgba(212,175,55,0.24)'}}>
              <svg width="10" height="10" fill="#D4AF37" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:9.5,fontWeight:700,letterSpacing:'0.28em',textTransform:'uppercase',color:'#D4AF37'}}>What We Offer</span>
            </div>
            <h2 style={{fontFamily:"'Cinzel',serif",fontWeight:800,fontSize:headingSize,color:'#fff',margin:'0 0 12px',lineHeight:1.15}}>
              Our <span style={{background:'linear-gradient(90deg,#F5C97A,#D4AF37)',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent'}}>6 Real Estate Services</span>
            </h2>
            <p style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:'rgba(199,209,219,0.52)',lineHeight:1.85,fontWeight:300,maxWidth:460,margin:'0 auto'}}>Each service shows exactly what property types we handle — hover any card to explore.</p>
          </div>

          {/* SERVICE GRID */}
          {md ? (
            /* 3-col bento: Laptop / Desktop / Large Desktop */
            <div style={{...fadeUp(1),marginBottom:60,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gridTemplateRows:`${r1}px ${r2}px ${r3}px`,gap:xl?20:lg?18:16}}>
              <div style={{gridColumn:'1/3',gridRow:1}}><ServiceCard svc={SERVICES[0]} variant="hero"/></div>
              <div style={{gridColumn:3,gridRow:1}}><ServiceCard svc={SERVICES[1]} variant="tall"/></div>
              <div style={{gridColumn:1,gridRow:2}}><ServiceCard svc={SERVICES[2]} variant="standard"/></div>
              <div style={{gridColumn:'2/4',gridRow:2}}><ServiceCard svc={SERVICES[3]} variant="hero"/></div>
              <div style={{gridColumn:1,gridRow:3}}><ServiceCard svc={SERVICES[4]} variant="standard"/></div>
              <div style={{gridColumn:2,gridRow:3}}><ServiceCard svc={SERVICES[5]} variant="standard"/></div>
              <div style={{gridColumn:3,gridRow:3}}><CTATile/></div>
            </div>
          ) : (
            /* 2-col: Tablet (640–899px) */
            <div style={{...fadeUp(1),marginBottom:40,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div style={{gridColumn:'1/3',minHeight:440}}><ServiceCard svc={SERVICES[0]} variant="hero"/></div>
              <div style={{minHeight:420}}><ServiceCard svc={SERVICES[1]} variant="standard"/></div>
              <div style={{minHeight:420}}><ServiceCard svc={SERVICES[2]} variant="standard"/></div>
              <div style={{gridColumn:'1/3',minHeight:420}}><ServiceCard svc={SERVICES[3]} variant="hero"/></div>
              <div style={{minHeight:420}}><ServiceCard svc={SERVICES[4]} variant="standard"/></div>
              <div style={{minHeight:420}}><ServiceCard svc={SERVICES[5]} variant="standard"/></div>
              <div style={{gridColumn:'1/3',minHeight:220}}><CTATile/></div>
            </div>
          )}

          {/* STATS */}
          <div ref={statsRef} style={{...fadeUp(2),display:'grid',gridTemplateColumns:md?'repeat(4,1fr)':'1fr 1fr',gap:md?16:12}}>
            {STATS.map((s: Stat, i: number) => <StatCard key={i} s={s} i={i} active={statsActive}/>)}
          </div>
        </div>
      </section>
    </>
  );
}