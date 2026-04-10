"use client"

import React, { useState } from 'react';
import LoadingPage from './LoadingPage';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* ── Website-open splash: shows once, then unmounts ── */}
      {loading && (
        <LoadingPage
          duration={3400}
          onComplete={() => setLoading(false)}
        />
      )}

      {/* ── Main site content (Navbar + page + Footer) ── */}
      <div
        style={{
          opacity:    loading ? 0 : 1,
          transition: 'opacity 0.5s ease 0.1s',
          // prevent interaction while loading screen is visible
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        {children}
      </div>
    </>
  );
}