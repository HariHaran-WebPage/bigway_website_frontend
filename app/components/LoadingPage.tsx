"use client"
import React, { useState, useEffect } from 'react';

interface LoadingPageProps {
  onComplete?: () => void;
  duration?: number;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  onComplete,
  duration = 3400,
}) => {
  const [phase, setPhase]       = useState<'draw' | 'pulse' | 'exit'>('draw');
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(true);

  useEffect(() => {
    const start   = Date.now();
    const drawEnd = duration * 0.65;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / drawEnd) * 100, 100);
      setProgress(Math.round(pct));
      if (elapsed < drawEnd) raf = requestAnimationFrame(tick);
      else setProgress(100);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('pulse'), duration * 0.65);
    const t2 = setTimeout(() => setPhase('exit'),  duration * 0.85);
    const t3 = setTimeout(() => { setVisible(false); onComplete?.(); }, duration);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [duration, onComplete]);

  if (!visible) return null;

  const ROOF_LEN = 141;
  const U_LEN    = 195;

  const roofDraw = ROOF_LEN * Math.min(progress, 100) / 100;
  const uDraw    = U_LEN    * Math.max(Math.min(progress - 45, 55), 0) / 55;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Lato:wght@300;400;700&display=swap');

        @keyframes scanLine {
          0%   { top: -2px;  opacity: 0; }
          5%   {             opacity: 1; }
          95%  {             opacity: 1; }
          100% { top: 100vh; opacity: 0; }
        }

        @keyframes logoPulse {
          0%   { transform: scale(1);    filter: drop-shadow(0 0 0px  rgba(212,175,55,0));   }
          100% { transform: scale(1.04); filter: drop-shadow(0 0 20px rgba(212,175,55,0.5)); }
        }

        .lp-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #060e1c;
          /* Prevent content from overflowing on very small screens */
          padding: 16px;
          box-sizing: border-box;
        }

        .lp-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 55% 45% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%);
        }

        .lp-scan {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg,transparent,rgba(212,175,55,0.55) 30%,rgba(255,235,120,0.9) 50%,rgba(212,175,55,0.55) 70%,transparent);
          box-shadow: 0 0 18px 4px rgba(212,175,55,0.3);
          animation: scanLine 2.4s linear infinite;
        }

        .lp-logo-wrap {
          position: relative;
          /* Fluid logo size: clamp(min, preferred, max) */
          width: clamp(140px, 40vw, 220px);
          height: clamp(140px, 40vw, 220px);
          flex-shrink: 0;
        }

        .lp-logo-wrap svg {
          width: 100%;
          height: 100%;
        }

        .lp-brand {
          margin-top: clamp(14px, 3vw, 24px);
          font-family: 'Cinzel', serif;
          font-size: clamp(1rem, 4vw, 1.5rem);
          font-weight: 900;
          letter-spacing: 0.38em;
          background: linear-gradient(135deg, #D4AF37, #F5E27A, #D4AF37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: opacity 0.6s ease, transform 0.6s ease;
          white-space: nowrap;
        }

        .lp-tagline {
          margin-top: clamp(4px, 1.5vw, 8px);
          font-family: 'Lato', sans-serif;
          font-size: clamp(0.55rem, 1.8vw, 0.72rem);
          letter-spacing: clamp(0.2em, 2vw, 0.42em);
          color: rgba(212,175,55,0.55);
          text-transform: uppercase;
          text-align: center;
          transition: opacity 0.6s ease;
          /* Prevent overflow on very narrow screens */
          max-width: 90vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lp-bar-track {
          margin-top: clamp(20px, 5vw, 36px);
          width: clamp(120px, 50vw, 180px);
          height: 1px;
          border-radius: 99px;
          background-color: rgba(255,255,255,0.08);
          overflow: visible;
          position: relative;
          flex-shrink: 0;
        }

        .lp-bar-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #B8960C, #F5E27A, #D4AF37);
          box-shadow: 0 0 10px rgba(212,175,55,0.7);
          transition: width 0.1s linear;
        }

        .lp-bar-dot {
          position: absolute;
          top: -3px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FFFACD;
          box-shadow: 0 0 8px 3px rgba(255,250,150,0.8);
          transition: left 0.1s linear;
        }

        .lp-percent {
          margin-top: clamp(8px, 2vw, 12px);
          font-family: 'Lato', sans-serif;
          font-size: clamp(0.6rem, 1.8vw, 0.7rem);
          font-weight: 700;
          letter-spacing: 0.22em;
          color: rgba(212,175,55,0.5);
        }


        /* ─── Tablet ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .lp-tagline {
            letter-spacing: 0.25em;
          }
        }

        /* ─── Small mobile (< 375px) ─────────────────────── */
        @media (max-width: 374px) {
          .lp-tagline {
            font-size: 0.5rem;
            letter-spacing: 0.15em;
          }
          .lp-brand {
            letter-spacing: 0.22em;
          }
        }

        /* ─── Landscape phones ───────────────────────────── */
        @media (max-height: 500px) and (orientation: landscape) {
          .lp-logo-wrap {
            width: clamp(80px, 20vh, 140px);
            height: clamp(80px, 20vh, 140px);
          }
          .lp-brand {
            margin-top: 8px;
            font-size: clamp(0.85rem, 3vh, 1.2rem);
          }
          .lp-tagline {
            margin-top: 4px;
          }
          .lp-bar-track {
            margin-top: 12px;
          }
          .lp-percent {
            margin-top: 6px;
          }
        }
      `}</style>

      <div
        className="lp-root"
        style={{
          opacity:    phase === 'exit' ? 0 : 1,
          transition: phase === 'exit' ? 'opacity 0.6s ease' : undefined,
        }}
      >
        {/* radial glow */}
        <div className="lp-glow" />

        {/* scanning line */}
        <div
          className="lp-scan"
          style={{
            opacity:    phase !== 'exit' ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Logo */}
        <div
          className="lp-logo-wrap"
          style={{
            animation: phase === 'pulse' ? 'logoPulse 0.7s ease-in-out infinite alternate' : undefined,
          }}
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="lGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="lGlowS" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="6" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <linearGradient id="lGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#B8960C"/>
                <stop offset="45%"  stopColor="#F5E27A"/>
                <stop offset="100%" stopColor="#D4AF37"/>
              </linearGradient>
            </defs>

            {/* ROOF */}
            <polyline
              points="52,118 100,58 148,118"
              stroke="url(#lGold)" strokeWidth="14"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              filter="url(#lGlow)"
              style={{
                strokeDasharray:  ROOF_LEN,
                strokeDashoffset: ROOF_LEN - roofDraw,
                transition: 'stroke-dashoffset 0.08s linear',
              }}
            />

            {/* U BODY */}
            <path
              d="M 95,130 L 95,168 Q 95,194 132,194 Q 170,194 170,168 L 170,130"
              stroke="url(#lGold)" strokeWidth="14"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              filter="url(#lGlow)"
              style={{
                strokeDasharray:  U_LEN,
                strokeDashoffset: U_LEN - uDraw,
                transition: 'stroke-dashoffset 0.08s linear',
              }}
            />

            {/* DOT */}
            <circle
              cx="170" cy="92" r="9"
              fill="url(#lGold)" filter="url(#lGlowS)"
              style={{
                opacity:         progress >= 85 ? 1 : 0,
                transform:       progress >= 85 ? 'scale(1)' : 'scale(0)',
                transformOrigin: '170px 92px',
                transition:      'opacity 0.3s ease, transform 0.4s cubic-bezier(.34,1.56,.64,1)',
              }}
            />
          </svg>


        </div>

        {/* Brand name */}
        <div
          className="lp-brand"
          style={{
            opacity:   progress > 20 ? 1 : 0,
            transform: progress > 20 ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          BIGWAY
        </div>

        {/* Tagline */}
        <div
          className="lp-tagline"
          style={{ opacity: progress > 40 ? 1 : 0 }}
        >
          Luxury · Architecture · Real Estate
        </div>

        {/* Progress bar */}
        <div className="lp-bar-track">
          <div className="lp-bar-fill" style={{ width: `${progress}%` }} />
          <div className="lp-bar-dot"  style={{ left: `calc(${progress}% - 3px)` }} />
        </div>

        {/* Percentage */}
        <div className="lp-percent">{progress}%</div>
      </div>
    </>
  );
};

export default LoadingPage;