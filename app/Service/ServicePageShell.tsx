'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Service } from '../data/serviceData';

interface Props { service: Service; }

function useCountUp(target: number, dur: number, active: boolean): number {
  const [v, setV] = useState(0);
  const raf = useRef(0);
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

export default function ServicePageShell({ service: s }: Props) {
  const [visible, setVisible] = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const statNum = parseInt(s.stat.replace(/\D/g, '')) || 0;
  const statSuf = s.stat.replace(/[0-9]/g, '');
  const count = useCountUp(statNum, 2000, statsActive);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStatsActive(true);
    }, { threshold: 0.2 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const accent = s.accent;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Lato:wght@300;400;600;700&family=Poppins:wght@500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        body{background:#030A16;overflow-x:hidden;}
        @keyframes shimmerText{0%{background-position:-200%}100%{background-position:200%}}
        @keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.7)}60%{box-shadow:0 0 0 9px rgba(212,175,55,0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
        @keyframes driftA{0%,100%{transform:translate(0,0)}50%{transform:translate(25px,-35px)}}
        @keyframes driftB{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,28px)}}
        @keyframes scanLine{0%{top:-2px;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0}}
      `}</style>

      <main style={{ background: '#030A16', minHeight: '100vh', paddingTop: 80 }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', height: 'clamp(480px, 60vh, 680px)', overflow: 'hidden' }}>
          <img
            src={s.img} alt={s.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28) saturate(0.5)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(3,10,22,0.2) 0%, rgba(3,10,22,0.95) 100%)' }} />
          {/* scan line */}
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accent}BB, transparent)`, animation: 'scanLine 4s linear infinite', zIndex: 5 }} />

          {/* blobs */}
          <div style={{ position: 'absolute', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${accent}0C 0%, transparent 65%)`, filter: 'blur(60px)', animation: 'driftA 22s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -100, right: -80, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${accent}08 0%, transparent 62%)`, filter: 'blur(80px)', animation: 'driftB 28s ease-in-out infinite 3s', pointerEvents: 'none' }} />

          <div style={{
            position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto',
            padding: '0 clamp(18px, 5vw, 48px)',
            height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 52,
            opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)',
            transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
          }}>
            {/* breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Link href="/Service" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${accent}80`, textDecoration: 'none' }}>
                ← All Services
              </Link>
              <div style={{ width: 4, height: 4, background: accent, opacity: 0.4, transform: 'rotate(45deg)' }} />
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${accent}55` }}>{s.title}</span>
            </div>

            {/* badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 14, padding: '6px 14px', borderRadius: 8, background: 'rgba(2,7,18,0.88)', backdropFilter: 'blur(20px)', border: `1px solid ${accent}35`, alignSelf: 'flex-start' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent, animation: 'pulseDot 2.4s ease-out infinite' }} />
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: accent }}>{s.id} · {s.sub}</span>
            </div>

            <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.08, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.025em' }}>
              {s.title}
            </h1>
            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 'clamp(14px, 1.6vw, 17px)', lineHeight: 1.85, color: 'rgba(199,209,219,0.65)', maxWidth: 560, margin: 0, fontWeight: 300 }}>
              {s.desc}
            </p>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(18px, 5vw, 48px)' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, marginBottom: 56 }}>

            {/* Long description */}
            <div style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both', background: 'linear-gradient(160deg,#0D1E3A,#060F1E)', border: `1px solid ${accent}22`, borderRadius: 18, padding: 'clamp(22px,3vw,36px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 3, height: 24, borderRadius: 2, background: `linear-gradient(180deg, ${accent}, transparent)` }} />
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `${accent}80` }}>ABOUT THIS SERVICE</span>
              </div>
              <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 15, lineHeight: 1.9, color: 'rgba(199,209,219,0.72)', fontWeight: 300, margin: 0 }}>{s.longDesc}</p>
            </div>

            {/* Stat card */}
            <div ref={statsRef} style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both', background: `linear-gradient(160deg, ${accent}18, ${accent}08)`, border: `1px solid ${accent}45`, borderRadius: 18, padding: 'clamp(22px,3vw,36px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(3.2rem,6vw,5rem)', fontWeight: 900, lineHeight: 1, background: `linear-gradient(135deg,${accent},#F5C97A)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>{count}{statSuf}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 'clamp(1rem,1.6vw,1.25rem)', color: '#fff', marginBottom: 6 }}>{s.statLbl}</div>
              <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 12, color: 'rgba(199,209,219,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Bigway Real Estate · Coimbatore</div>
            </div>
          </div>

          {/* Property types */}
          <div style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 26, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: '0.32em', textTransform: 'uppercase', color: `${accent}70` }}>PROPERTY TYPES WE HANDLE</span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}20, transparent)` }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {s.types.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 14px', borderRadius: 10, background: `${accent}12`, border: `1px solid ${accent}2E`, animation: `fadeUp 0.4s ease ${i * 50}ms both` }}>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{t.e}</span>
                  <span style={{ fontFamily: "'Lato',sans-serif", fontSize: 12, fontWeight: 600, color: '#EDD98A' }}>{t.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features + Why Us */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 52 }}>

            {/* Features */}
            <div style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both', background: 'linear-gradient(160deg,#0D1E3A,#060F1E)', border: `1px solid ${accent}22`, borderRadius: 18, padding: 'clamp(20px,3vw,32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <div style={{ width: 3, height: 24, borderRadius: 2, background: `linear-gradient(180deg, ${accent}, transparent)` }} />
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `${accent}80` }}>WHAT WE PROVIDE</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {s.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0, boxShadow: `0 0 8px ${accent}80` }} />
                    <span style={{ fontFamily: "'Lato',sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(199,209,219,0.75)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Us */}
            <div style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both', background: 'linear-gradient(160deg,#0D1E3A,#060F1E)', border: `1px solid ${accent}22`, borderRadius: 18, padding: 'clamp(20px,3vw,32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <div style={{ width: 3, height: 24, borderRadius: 2, background: `linear-gradient(180deg, ${accent}, transparent)` }} />
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `${accent}80` }}>WHY BIGWAY</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {s.whyUs.map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: `${accent}25`, border: `1px solid ${accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontFamily: "'Lato',sans-serif", fontSize: 13.5, fontWeight: 500, color: 'rgba(199,209,219,0.75)', lineHeight: 1.6 }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.6s both', borderRadius: 20, overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg, ${accent}1A, ${accent}0A)`, border: `1px solid ${accent}40`, padding: 'clamp(28px,4vw,52px) clamp(22px,4vw,48px)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `${accent}70` }}>FREE CONSULTATION</div>
            <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 800, fontSize: 'clamp(1.3rem, 3vw, 2rem)', color: '#fff', margin: 0 }}>
              Ready to get started with {s.title}?
            </h3>
            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 15, color: 'rgba(199,209,219,0.55)', lineHeight: 1.8, maxWidth: 440, margin: 0, fontWeight: 300 }}>
              Talk to our property experts — completely free, zero commitment. We'll guide you every step of the way.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 30px', borderRadius: 100, border: 0, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, background: `linear-gradient(135deg, ${accent}, #F5C97A, ${accent})`, color: '#040C1A', boxShadow: `0 6px 28px ${accent}55` }}>
                📞 Call Now — Free
              </button>
              <Link href="/Contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 30px', borderRadius: 100, border: `1.5px solid ${accent}60`, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: accent, textDecoration: 'none' }}>
                Send Enquiry →
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['No spam', 'No commitment', 'Expert advice', 'Coimbatore specialists'].map((t, i) => (
                <span key={i} style={{ fontFamily: "'Lato',sans-serif", fontSize: 11, color: 'rgba(199,209,219,0.35)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: accent }}>✓</span>{t}
                </span>
              ))}
            </div>
          </div>

          {/* Other services */}
          <div style={{ marginTop: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 26, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.5)' }}>EXPLORE OTHER SERVICES</span>
            </div>
            <Link href="/Service" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 10, border: '1px solid rgba(212,175,55,0.22)', color: 'rgba(199,209,219,0.6)', fontFamily: "'Lato',sans-serif", fontSize: 13, fontWeight: 600, textDecoration: 'none', background: 'rgba(212,175,55,0.04)' }}>
              ← Back to All Services
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}