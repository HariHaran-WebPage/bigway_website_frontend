'use client';
import React, { useState, useEffect } from 'react';
import ServicesSectionMobile from './Servicessectionmobile';
import ServicesSectionDesktop from './Servicessection';



function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return w;
}

export default function Page() {
  const width = useWindowWidth();

  // Avoid hydration mismatch: render nothing until width is known client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div style={{ background: '#030A16', minHeight: '100vh' }} />;
  }

  const isMobile = width < 640;

  return isMobile ? <ServicesSectionMobile /> : <ServicesSectionDesktop />;
}