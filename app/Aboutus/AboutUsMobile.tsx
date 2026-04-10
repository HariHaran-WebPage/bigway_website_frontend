'use client';
import React, { useState, useEffect, useRef } from 'react';

/* ══ MOBILE COUNTER HOOK ══ */
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

/* ══ MOBILE SCROLL REVEAL HOOK ══ */
function useScrollReveal() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .mob-reveal { opacity:0; transform:translateY(32px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
      .mob-reveal.mob-visible { opacity:1; transform:none; }
      .mob-reveal-left  { opacity:0; transform:translateX(-28px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
      .mob-reveal-left.mob-visible { opacity:1; transform:none; }
      .mob-reveal-right { opacity:0; transform:translateX(28px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
      .mob-reveal-right.mob-visible { opacity:1; transform:none; }
      .mob-delay-1 { transition-delay:0.1s!important; }
      .mob-delay-2 { transition-delay:0.2s!important; }
      .mob-delay-3 { transition-delay:0.3s!important; }
      .mob-delay-4 { transition-delay:0.4s!important; }
    `;
    document.head.appendChild(style);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('mob-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin:'0px 0px -40px 0px' });

    const observe = () => document.querySelectorAll('.mob-reveal,.mob-reveal-left,.mob-reveal-right').forEach(el => obs.observe(el));
    const t = setTimeout(observe, 80);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, []);
}

/* ══ DATA ══ */
const STATS = [
  { num:50,  suf:'+',   pre:'',  lbl:'Properties Sold',     sub:'Across Coimbatore', dur:1600 },
  { num:100, suf:'%',   pre:'',  lbl:'Client Satisfaction', sub:'Verified Reviews',  dur:1800 },
  { num:350, suf:'+',   pre:'',  lbl:'Happy Families',      sub:'Trusted Clients',   dur:2000 },
  { num:200, suf:'Cr+', pre:'₹', lbl:'Value Closed',        sub:'Total Deals',       dur:2200 },
];

const MILESTONES = [
  { year:'2024', num:'01', title:'Foundation',        desc:"BIGWAY was born to revolutionize Coimbatore's luxury real estate market.", color:'#D4AF37' },
  { year:'2025', num:'02', title:'Tech Integration',  desc:'Launched AI-powered matching, VR tours, and blockchain verification.', color:'#F5C97A' },
  { year:'2025', num:'03', title:'Market Leadership', desc:"Became Coimbatore's most trusted luxury property platform.", color:'#D4AF37' },
  { year:'2026', num:'04', title:'Future Vision',     desc:'Expanding with smart contracts and advanced analytics.', color:'#F5C97A' },
];

const VALUES = [
  { title:'Excellence',      icon:'⭐', desc:'Finest properties and exceptional service at every touchpoint.' },
  { title:'Innovation',      icon:'🔬', desc:'AI, VR, and blockchain to pioneer the future of real estate.' },
  { title:'Transparency',    icon:'🔍', desc:'Complete honesty and clarity in every transaction.' },
  { title:'Personalization', icon:'💎', desc:'Recommendations that reflect your individual dreams.' },
];

const PHOTOS = [
  { src:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',  label:'Interior',     tag:'Premium',   span:'tall' },
  { src:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', label:'Residential',  tag:'Exclusive', span:'normal' },
  { src:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80', label:'Villa',        tag:'Luxury',    span:'normal' },
  { src:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', label:'Architecture', tag:'Signature', span:'wide' },
  { src:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80', label:'Exterior',     tag:'Elite',     span:'normal' },
  { src:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', label:'Estate',       tag:'Prime',     span:'normal' },
];

/* ══ MOBILE STAT CARD ══ */
const MobStatCard = ({ s, i, active }: { s:any; i:number; active:boolean }) => {
  const count = useCountUp(s.num, s.dur, active);
  return (
    <div style={{
      background:'linear-gradient(135deg,rgba(13,30,58,0.95),rgba(6,15,30,0.98))',
      border:'1px solid rgba(212,175,55,0.18)', borderRadius:20,
      padding:'24px 16px', textAlign:'center',
      boxShadow:'0 4px 24px rgba(0,0,0,0.4)',
      animation:`mobStatIn 0.6s cubic-bezier(0.22,1,0.36,1) ${i*100}ms both`,
    }}>
      <style>{`@keyframes mobStatIn{ from{opacity:0;transform:translateY(20px) scale(0.94)} to{opacity:1;transform:none} }`}</style>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(1.8rem,7vw,2.4rem)', fontWeight:900, lineHeight:1, marginBottom:8, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>
        {s.pre}{count}{s.suf}
      </div>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, fontWeight:700, color:'#fff', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>{s.lbl}</div>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, color:'rgba(199,209,219,0.4)', fontWeight:400 }}>{s.sub}</div>
    </div>
  );
};

/* ══ MOBILE MOSAIC PHOTO CARD ══ */
const MobPhoto = ({ p, height = 180 }: { p: typeof PHOTOS[0]; height?: number }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onTouchStart={() => setHov(true)}
      onTouchEnd={() => setTimeout(() => setHov(false), 400)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', height, borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${hov ? 'rgba(212,175,55,0.55)' : 'rgba(212,175,55,0.16)'}`,
        transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        boxShadow: hov ? '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.2)' : '0 4px 20px rgba(0,0,0,0.45)',
        transform: hov ? 'scale(1.02)' : 'scale(1)',
        cursor: 'pointer', width: '100%',
      }}
    >
      <img src={p.src} alt={p.label} style={{
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        filter: hov ? 'brightness(0.9) saturate(1.15)' : 'brightness(0.6) saturate(0.8)',
        transform: hov ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(3,10,22,0.04) 0%, rgba(3,10,22,0.75) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div style={{
        position: 'absolute', bottom: 10, left: 10, right: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        opacity: hov ? 1 : 0.7, transform: hov ? 'translateY(0)' : 'translateY(3px)',
        transition: 'all 0.35s ease',
      }}>
        <span style={{ fontFamily: "'Lato',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>{p.label}</span>
        <span style={{ padding: '3px 8px', borderRadius: 100, background: 'linear-gradient(135deg,#D4AF37,#F5C97A)', fontFamily: "'Orbitron',sans-serif", fontSize: 6.5, fontWeight: 800, letterSpacing: '0.14em', color: '#040C1A' }}>{p.tag}</span>
      </div>
      <div style={{ position: 'absolute', top: 8, right: 8, width: 12, height: 12, borderTop: '1.5px solid rgba(212,175,55,0.7)', borderRight: '1.5px solid rgba(212,175,55,0.7)', opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 12, height: 12, borderBottom: '1.5px solid rgba(212,175,55,0.7)', borderLeft: '1.5px solid rgba(212,175,55,0.7)', opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
    </div>
  );
};

/* ══ MAIN MOBILE PAGE ══ */
export default function AboutUsMobile() {
  const [visible, setVisible]         = useState(false);
  const [activeTab, setActiveTab]     = useState<'mission'|'vision'|'values'>('mission');
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  useEffect(() => { const t = setTimeout(() => setVisible(true), 150); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsActive(true); }, { threshold:0.1 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background:'#030A16', minHeight:'100vh', fontFamily:"'Poppins',sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Lato:wght@400;600;700&family=Poppins:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        @keyframes mob__shimmer    { 0%{background-position:-200%} 100%{background-position:200%} }
        @keyframes mob__pulseDot   { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.7)} 60%{box-shadow:0 0 0 8px rgba(212,175,55,0)} }
        @keyframes mob__floatUp    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes mob__gemGlow    { 0%,100%{box-shadow:0 0 8px rgba(212,175,55,0.5)} 50%{box-shadow:0 0 24px rgba(212,175,55,1)} }
        @keyframes mob__driftBg    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(15px,-20px)} }
        @keyframes mob__particleUp { 0%{opacity:0;transform:translateY(0)} 15%{opacity:0.5} 85%{opacity:0.5} 100%{opacity:0;transform:translateY(-60vh)} }
        @keyframes mob__tabEnter   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes mob__lineGrow   { from{width:0} to{width:100%} }

        /* Swipe scrollable row */
        .mob-scroll-row { display:flex; gap:14px; overflow-x:auto; padding-bottom:8px; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
        .mob-scroll-row::-webkit-scrollbar { display:none; }
        .mob-scroll-row > * { flex-shrink:0; }

        /* Mobile stat grid */
        .mob-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

        /* Mobile value list */
        .mob-value-card { display:flex; align-items:flex-start; gap:14px; padding:20px 18px; background:rgba(13,30,58,0.6); border:1px solid rgba(212,175,55,0.14); border-radius:18px; transition:all 0.3s; }

        /* Timeline vertical */
        .mob-timeline { display:flex; flex-direction:column; gap:0; position:relative; }
        .mob-timeline::before { content:''; position:absolute; left:24px; top:24px; bottom:24px; width:1px; background:linear-gradient(180deg,transparent,rgba(212,175,55,0.3),rgba(212,175,55,0.3),transparent); }

        /* Ripple on tap */
        .mob-btn-tap { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ position:'relative', minHeight:'100svh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', padding:'80px 20px 60px' }}>
        {/* BG blobs */}
        <div style={{ position:'absolute', top:'-15%', left:'-20%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 65%)', filter:'blur(50px)', animation:'mob__driftBg 24s ease-in-out infinite', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-15%', right:'-20%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,201,122,0.055) 0%,transparent 60%)', filter:'blur(60px)', animation:'mob__driftBg 30s ease-in-out infinite 3s', pointerEvents:'none' }}/>

        {/* Particle dots */}
        {[{l:'8%',t:'15%',d:'0s'},{l:'25%',t:'8%',d:'1.2s'},{l:'72%',t:'12%',d:'2s'},{l:'88%',t:'22%',d:'0.6s'},{l:'5%',t:'75%',d:'3s'},{l:'90%',t:'70%',d:'1.8s'}].map((p,i)=>(
          <div key={i} style={{ position:'absolute', width:3, height:3, borderRadius:'50%', background:'#D4AF37', opacity:0.4, left:p.l, top:p.t, animation:`mob__particleUp 10s linear infinite`, animationDelay:p.d, pointerEvents:'none' }}/>
        ))}

        {/* Grid lines */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.035, pointerEvents:'none' }}>
          {Array.from({length:8}).map((_,i)=><line key={i} x1={`${(i+1)*12.5}%`} y1="0" x2={`${(i+1)*12.5}%`} y2="100%" stroke="#D4AF37" strokeWidth="1"/>)}
          {Array.from({length:10}).map((_,i)=><line key={i+8} x1="0" y1={`${(i+1)*10}%`} x2="100%" y2={`${(i+1)*10}%`} stroke="#D4AF37" strokeWidth="1"/>)}
        </svg>

        {/* Badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:28, padding:'9px 20px', borderRadius:10, background:'rgba(2,7,18,0.9)', backdropFilter:'blur(20px)', border:'1px solid rgba(212,175,55,0.3)', boxShadow:'0 0 30px rgba(212,175,55,0.12)', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(-20px)', transition:'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#D4AF37', animation:'mob__pulseDot 2.4s ease-out infinite' }}/>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'#D4AF37' }}>Bigway Real Estate</span>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#D4AF37', animation:'mob__pulseDot 2.4s ease-out infinite 0.7s' }}/>
        </div>

        {/* Tag line */}
        <div style={{ marginBottom:16, opacity:visible?1:0, transition:'opacity 0.8s 0.1s' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:8, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.25)', fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'#D4AF37' }}>
            OUR STORY · SINCE 2024
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign:'center', opacity:visible?1:0, transform:visible?'none':'translateY(24px)', transition:'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s' }}>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(3rem,13vw,5rem)', lineHeight:1.05, color:'#fff', letterSpacing:'-0.02em', marginBottom:2 }}>About</h1>
          <span style={{ display:'block', fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(3rem,13vw,5rem)', lineHeight:1.05, letterSpacing:'-0.02em', background:'linear-gradient(90deg,#B8941F,#F5C97A,#D4AF37,#F5C97A,#B8941F)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', animation:'mob__shimmer 8s linear infinite', marginBottom:24 }}>BIGWAY</span>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, lineHeight:1.85, color:'rgba(199,209,219,0.68)', fontWeight:400, maxWidth:320, margin:'0 auto 32px' }}>
            Revolutionizing Coimbatore's luxury real estate with AI, VR tours &amp; blockchain. 350+ families served since 2024.
          </p>
        </div>

        {/* Gem divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, opacity:visible?1:0, transition:'opacity 0.8s 0.4s' }}>
          <div style={{ height:1, width:60, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.5))' }}/>
          <div style={{ width:8, height:8, background:'#D4AF37', transform:'rotate(45deg)', animation:'mob__gemGlow 3.8s ease-in-out infinite' }}/>
          <div style={{ height:1, width:60, background:'linear-gradient(270deg,transparent,rgba(212,175,55,0.5))' }}/>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:0.5 }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, letterSpacing:'0.2em', color:'#D4AF37', textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:1, height:24, background:'linear-gradient(180deg,#D4AF37,transparent)' }}/>
        </div>
      </section>

      {/* ══ QUICK STATS BANNER ══ */}
      <div style={{ padding:'0 20px 0', marginTop:-20, position:'relative', zIndex:10 }}>
        <div style={{ background:'linear-gradient(135deg,rgba(13,30,58,0.98),rgba(6,15,30,0.99))', border:'1px solid rgba(212,175,55,0.22)', borderRadius:22, padding:'20px', boxShadow:'0 8px 48px rgba(0,0,0,0.6)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0 }}>
            {[{n:'350+',l:'Families'},{n:'₹200Cr',l:'Value'},{n:'2024',l:'Est.'}].map((m,i)=>(
              <div key={i} style={{ textAlign:'center', padding:'8px 0', borderRight: i<2 ? '1px solid rgba(212,175,55,0.12)' : 'none' }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:900, color:'#D4AF37', lineHeight:1, marginBottom:4 }}>{m.n}</div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(199,209,219,0.45)' }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ OUR STORY ══ */}
      <section style={{ padding:'56px 20px 48px' }}>
        {/* Label */}
        <div className="mob-reveal" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <div style={{ height:2, width:24, background:'linear-gradient(90deg,#D4AF37,transparent)', borderRadius:2 }}/>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(212,175,55,0.6)' }}>Who We Are</span>
        </div>

        <h2 className="mob-reveal mob-delay-1" style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(1.9rem,8vw,2.6rem)', color:'#fff', lineHeight:1.15, marginBottom:20 }}>
          Born to Redefine<br/>
          <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Luxury Living</span>
        </h2>

        <p className="mob-reveal mob-delay-2" style={{ fontSize:14.5, lineHeight:1.9, color:'rgba(199,209,219,0.68)', fontWeight:400, marginBottom:16 }}>
          BIGWAY emerged from a simple belief: acquiring a luxury property should be as exceptional as the property itself. We revolutionize Coimbatore's real estate by blending tradition with cutting-edge innovation.
        </p>

        <p className="mob-reveal mob-delay-3" style={{ fontSize:14.5, lineHeight:1.9, color:'rgba(199,209,219,0.68)', fontWeight:400, marginBottom:24 }}>
          Our platform leverages AI, virtual reality, and blockchain to provide unprecedented transparency. Every property is meticulously curated and verified.
        </p>

        {/* Quote block */}
        <div className="mob-reveal" style={{ borderLeft:'3px solid #D4AF37', paddingLeft:18, marginBottom:32, background:'rgba(212,175,55,0.05)', padding:'16px 18px', borderRadius:'0 14px 14px 0' }}>
          <p style={{ fontSize:15, fontWeight:600, color:'#D4AF37', lineHeight:1.7, margin:0, fontStyle:'italic' }}>
            "We don't just sell properties — we forge lasting relationships and create legacies."
          </p>
        </div>

        {/* ══ PHOTO MOSAIC GRID ══ */}
        <div className="mob-reveal" style={{ marginTop: 8, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
          {/* ROW 1: tall left + 2 stacked right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {/* Tall hero photo */}
            <div style={{ gridRow: 'span 2' }}>
              <MobPhoto p={PHOTOS[0]} height={290} />
            </div>
            {/* Top right */}
            <MobPhoto p={PHOTOS[1]} height={138} />
            {/* Bottom right */}
            <MobPhoto p={PHOTOS[2]} height={138} />
          </div>
          {/* ROW 2: wide full-width */}
          <div style={{ marginBottom: 10 }}>
            <MobPhoto p={PHOTOS[3]} height={145} />
          </div>
          {/* ROW 3: 2 equal side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MobPhoto p={PHOTOS[4]} height={140} />
            <MobPhoto p={PHOTOS[5]} height={140} />
          </div>
        </div>

        {/* CTA button */}
        <button className="mob-reveal mob-btn-tap" style={{ width:'100%', marginTop:28, padding:'16px', borderRadius:100, border:0, cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', color:'#040C1A', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 24px rgba(212,175,55,0.42)' }}>
          Explore Properties
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:16,height:16}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </section>

      {/* ══ MISSION / VISION / VALUES ══ */}
      <section style={{ padding:'48px 20px' }}>
        <div className="mob-reveal" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 16px', borderRadius:8, marginBottom:16, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.22)' }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.24em', textTransform:'uppercase', color:'#D4AF37' }}>Our Foundation</span>
        </div>
        <h2 className="mob-reveal mob-delay-1" style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(1.9rem,8vw,2.6rem)', color:'#fff', lineHeight:1.15, marginBottom:28 }}>
          What <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Drives Us</span>
        </h2>

        {/* Tab switcher */}
        <div className="mob-reveal" style={{ display:'flex', gap:8, marginBottom:24, overflowX:'auto', scrollbarWidth:'none', paddingBottom:4 }}>
          {(['mission','vision','values'] as const).map(tab=>(
            <button key={tab} className="mob-btn-tap" onClick={()=>setActiveTab(tab)} style={{ flexShrink:0, padding:'11px 24px', borderRadius:100, border:'none', cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12.5, letterSpacing:'0.06em', textTransform:'uppercase', background:activeTab===tab?'linear-gradient(135deg,#D4AF37,#F5C97A)':'rgba(13,30,58,0.9)', color:activeTab===tab?'#040C1A':'rgba(212,175,55,0.7)', outline: activeTab===tab?'none':'1px solid rgba(212,175,55,0.2)', boxShadow:activeTab===tab?'0 4px 20px rgba(212,175,55,0.42)':'none', transition:'all 0.28s ease' }}>
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ background:'linear-gradient(170deg,#0D1E3A,#060F1E)', border:'1px solid rgba(212,175,55,0.16)', borderRadius:22, padding:'28px 22px', position:'relative', overflow:'hidden', animation:'mob__tabEnter 0.4s ease both' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)' }}/>

          {activeTab==='mission' && (
            <div>
              <div style={{ width:52, height:52, borderRadius:15, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, boxShadow:'0 0 28px rgba(212,175,55,0.5)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#040C1A" strokeWidth="2.5" style={{width:24,height:24}}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:20, color:'#fff', marginBottom:14 }}>Our Mission</h3>
              <p style={{ fontSize:14.5, lineHeight:1.9, color:'rgba(199,209,219,0.7)', fontWeight:400 }}>To revolutionize Coimbatore's luxury real estate market through innovative technology, transparent processes, and personalized service — empowering clients to find properties aligned with their dreams.</p>
            </div>
          )}
          {activeTab==='vision' && (
            <div>
              <div style={{ width:52, height:52, borderRadius:15, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, boxShadow:'0 0 28px rgba(212,175,55,0.5)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#040C1A" strokeWidth="2.5" style={{width:24,height:24}}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </div>
              <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:20, color:'#fff', marginBottom:14 }}>Our Vision</h3>
              <p style={{ fontSize:14.5, lineHeight:1.9, color:'rgba(199,209,219,0.7)', fontWeight:400 }}>To become India's most trusted luxury real estate platform, where AI-powered insights, blockchain verification, and immersive VR experiences set new industry standards.</p>
            </div>
          )}
          {activeTab==='values' && (
            <div>
              <h3 style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:20, color:'#fff', marginBottom:20 }}>Core Values</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {VALUES.map((v,i)=>(
                  <div key={i} className="mob-value-card">
                    <span style={{ fontSize:22, flexShrink:0, marginTop:2 }}>{v.icon}</span>
                    <div>
                      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:700, color:'#F5C97A', marginBottom:6 }}>{v.title}</div>
                      <div style={{ fontSize:13, color:'rgba(199,209,219,0.6)', lineHeight:1.7 }}>{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section style={{ padding:'48px 20px' }}>
        <div className="mob-reveal" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 16px', borderRadius:8, marginBottom:16, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.22)' }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.24em', textTransform:'uppercase', color:'#D4AF37' }}>Our Journey</span>
        </div>
        <h2 className="mob-reveal mob-delay-1" style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(1.9rem,8vw,2.6rem)', color:'#fff', lineHeight:1.15, marginBottom:36 }}>
          Key <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Milestones</span>
        </h2>

        <div className="mob-timeline">
          {MILESTONES.map((m,i)=>(
            <div key={i} className="mob-reveal" style={{ display:'flex', gap:16, paddingBottom: i<MILESTONES.length-1 ? 32 : 0, position:'relative' }}>
              {/* Node */}
              <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', width:48 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px rgba(212,175,55,0.42)', zIndex:1 }}>
                  <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, fontWeight:900, color:'#040C1A' }}>{m.num}</span>
                </div>
              </div>
              {/* Content */}
              <div style={{ paddingTop:10, flex:1 }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:26, fontWeight:900, color:'rgba(212,175,55,0.15)', lineHeight:1, marginBottom:4 }}>{m.year}</div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:'#fff', marginBottom:8 }}>{m.title}</div>
                <div style={{ fontSize:13.5, color:'rgba(199,209,219,0.58)', lineHeight:1.75 }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section ref={statsRef} style={{ padding:'48px 20px' }}>
        <div className="mob-reveal" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 16px', borderRadius:8, marginBottom:16, background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.22)' }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'0.24em', textTransform:'uppercase', color:'#D4AF37' }}>By The Numbers</span>
        </div>
        <h2 className="mob-reveal mob-delay-1" style={{ fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(1.9rem,8vw,2.6rem)', color:'#fff', lineHeight:1.15, marginBottom:28 }}>
          Our <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Track Record</span>
        </h2>
        <div className="mob-stat-grid">
          {STATS.map((s,i)=><MobStatCard key={i} s={s} i={i} active={statsActive}/>)}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding:'56px 20px 72px', position:'relative', overflow:'hidden' }}>
        {/* BG image */}
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&fit=crop&q=80" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.15) saturate(0.6)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#030A16 0%,rgba(3,10,22,0.85) 50%,#030A16 100%)' }}/>
        </div>

        {/* Particles */}
        {[{l:'12%',d:'0s'},{l:'38%',d:'1.4s'},{l:'62%',d:'0.8s'},{l:'82%',d:'2.1s'}].map((p,i)=>(
          <div key={i} style={{ position:'absolute', width:3, height:3, borderRadius:'50%', background:'#D4AF37', opacity:0.4, left:p.l, top:'20%', animation:`mob__particleUp 10s linear infinite`, animationDelay:p.d, zIndex:1, pointerEvents:'none' }}/>
        ))}

        <div style={{ position:'relative', zIndex:2, textAlign:'center' }}>
          <h2 className="mob-reveal" style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:'clamp(2rem,9vw,3rem)', color:'#fff', lineHeight:1.1, marginBottom:16 }}>
            Begin Your{' '}
            <span style={{ background:'linear-gradient(90deg,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>Luxury Journey</span>
          </h2>
          <p className="mob-reveal mob-delay-1" style={{ fontSize:14.5, color:'rgba(199,209,219,0.6)', lineHeight:1.85, marginBottom:32, maxWidth:280, margin:'0 auto 32px' }}>
            Experience the perfect blend of technology and personalized service.
          </p>

          {/* Buttons */}
          <div className="mob-reveal" style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
            <button className="mob-btn-tap" style={{ width:'100%', padding:'16px', borderRadius:100, border:0, cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, background:'linear-gradient(135deg,#D4AF37,#F5C97A)', color:'#040C1A', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 24px rgba(212,175,55,0.45)' }}>
              Schedule Consultation
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <button className="mob-btn-tap" style={{ width:'100%', padding:'16px', borderRadius:100, border:'1.5px solid rgba(212,175,55,0.45)', cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, background:'transparent', color:'#D4AF37' }}>
              View Properties
            </button>
          </div>

          {/* Contact cards */}
          <div className="mob-reveal" style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { icon:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label:'Call Us', value:'+91 90000 00000', href:'tel:+919000000000' },
              { icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label:'Email Us', value:'hello@bigway.com', href:'mailto:hello@bigway.com' },
              { icon:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', label:'Visit Us', value:'Coimbatore, Tamil Nadu', href:null },
            ].map((c,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', background:'rgba(7,16,32,0.92)', backdropFilter:'blur(16px)', border:'1px solid rgba(212,175,55,0.16)', borderRadius:16 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.24)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" style={{width:20,height:20}}><path strokeLinecap="round" strokeLinejoin="round" d={c.icon}/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(199,209,219,0.4)', marginBottom:4 }}>{c.label}</div>
                  {c.href ? <a href={c.href} style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:700, color:'#D4AF37', textDecoration:'none' }}>{c.value}</a>
                    : <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:700, color:'#D4AF37' }}>{c.value}</div>}
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="2" style={{width:16,height:16}}><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            ))}
          </div>

          {/* Footer line */}
          <div style={{ marginTop:40, display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
            <div style={{ height:1, width:40, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.4))' }}/>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:7, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(212,175,55,0.35)' }}>COIMBATORE · EST. 2024</span>
            <div style={{ height:1, width:40, background:'linear-gradient(270deg,transparent,rgba(212,175,55,0.4))' }}/>
          </div>
        </div>
      </section>
    </div>
  );
}