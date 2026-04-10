'use client';
import { useEffect, useState } from 'react';
import AboutUsPage from './AboutUs';
import AboutUsMobile from './AboutUsMobile';

export default function AboutUsWrapper() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    setIsMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Prevent flash during hydration
  if (isMobile === null) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#030A16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#D4AF37',
          boxShadow: '0 0 24px rgba(212,175,55,0.8)',
          animation: 'spin 1.2s ease-in-out infinite',
        }}/>
        <style>{`
          @keyframes spin {
            0%,100%{ transform:scale(1); opacity:1; }
            50%{ transform:scale(1.8); opacity:0.4; }
          }
        `}</style>
      </div>
    );
  }

  return isMobile ? <AboutUsMobile /> : <AboutUsPage />;
}