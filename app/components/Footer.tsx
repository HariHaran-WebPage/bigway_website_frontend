"use client";
import { useState } from 'react';

export default function Footer() {
  const [hoveredLink, setHoveredLink]     = useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [email, setEmail]                 = useState('');

  const footerLinks = {
    company: [
      { name: 'About Us',            href: '#' },
      { name: 'Our Team',            href: '#' },
      { name: 'Careers',             href: '#' },
      { name: 'Press & Media',       href: '#' },
      { name: 'Investor Relations',  href: '#' },
    ],
    services: [
      { name: 'Property Sales',      href: '#' },
      { name: 'Property Management', href: '#' },
      { name: 'Home Loans',          href: '#' },
      { name: 'Legal Assistance',    href: '#' },
      { name: 'Interior Design',     href: '#' },
    ],
    locations: [
      { name: 'Chennai',     href: '#' },
      { name: 'Bangalore',   href: '#' },
      { name: 'Hyderabad',   href: '#' },
      { name: 'Coimbatore',  href: '#' },
      { name: 'Mumbai',      href: '#' },
    ],
    quickLinks: [
      { name: 'Privacy Policy',   href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'FAQ',              href: '#' },
      { name: 'Contact Us',       href: '#' },
      { name: 'Site Map',         href: '#' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: '#',
    },
    {
      name: 'Instagram',
      icon: (
        <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: '#',
    },
    {
      name: 'Twitter',
      icon: (
        <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: '#',
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: '#',
    },
    {
      name: 'YouTube',
      icon: (
        <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      url: '#',
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      url: '#',
    },
  ];

  const certifications = [
    'RERA Certified',
    'ISO 9001:2015',
    'CREDAI Member',
    'NAR Approved',
    '10+ Years Experience',
  ];

  return (
    <footer
      style={{
        position:   'relative',
        overflow:   'hidden',
        padding:    '48px 16px 32px',
        background: 'linear-gradient(180deg, #0A1628 0%, #081120 50%, #060C18 100%)',
      }}
    >
      {/* ── Background Effects ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>

        {/* Grid pattern */}
        <div style={{
          position:        'absolute',
          inset:           0,
          opacity:         0.03,
          backgroundImage: `linear-gradient(rgba(212,175,55,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.3) 1px,transparent 1px)`,
          backgroundSize:  '50px 50px',
        }} />

        {/* Gold orb top-left */}
        <div className="footer__orb-1" style={{
          position:   'absolute',
          top:        '-160px',
          left:       '25%',
          width:      600,
          height:     600,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(212,175,55,0.3) 0%,rgba(245,201,122,0.2) 30%,transparent 70%)',
          filter:     'blur(100px)',
          opacity:    0.1,
        }} />

        {/* Gold orb bottom-right */}
        <div className="footer__orb-2" style={{
          position:   'absolute',
          bottom:     '-160px',
          right:      '25%',
          width:      500,
          height:     500,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(212,175,55,0.25) 0%,rgba(184,148,31,0.15) 40%,transparent 70%)',
          filter:     'blur(80px)',
          opacity:    0.1,
        }} />

        {/* Top gold border */}
        <div style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     2,
          background: 'linear-gradient(90deg,transparent,#D4AF37 20%,#F5C97A 50%,#D4AF37 80%,transparent)',
          boxShadow:  '0 0 30px rgba(212,175,55,0.5)',
        }} />

        {/* Floating dots */}
        <div className="footer__dot-1" style={{ position:'absolute', top:'25%',  left:40,  width:12, height:12, borderRadius:'50%', background:'#D4AF37', opacity:0.2 }} />
        <div className="footer__dot-2" style={{ position:'absolute', bottom:'33%',right:80, width:8,  height:8,  borderRadius:'50%', background:'#F5C97A', opacity:0.3 }} />
        <div className="footer__dot-3" style={{ position:'absolute', top:'50%',  left:'25%',width:16, height:16, borderRadius:'50%', background:'#D4AF37', opacity:0.1 }} />
      </div>

      {/* ── Main Content ── */}
      <div style={{ position:'relative', maxWidth:'80rem', margin:'0 auto' }}>

        {/* Top grid: logo + 4 link columns */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(1,1fr)', gap:32, marginBottom:48 }} className="footer__top-grid">

          {/* Logo + newsletter */}
          <div>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
              <div style={{
                width:46, height:46, display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:12,
                background: 'rgba(212,175,55,0.15)',
                border:     '2px solid rgba(212,175,55,0.55)',
                boxShadow:  '0 8px 25px rgba(212,175,55,0.3)',
              }}>
                <svg style={{ width:24, height:24, color:'#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <h2 style={{ margin:0, fontFamily:'Cinzel,serif', fontSize:'1.4rem', fontWeight:700, background:'linear-gradient(to right,#F5C97A,#D4AF37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  BIGWAY
                </h2>
                <p style={{ margin:0, fontFamily:'Lato,sans-serif', fontSize:'0.65rem', color:'#C7D1DB', letterSpacing:'0.15em' }}>
                  REAL ESTATE
                </p>
              </div>
            </div>

            <p style={{ fontFamily:'Lato,sans-serif', fontSize:'0.85rem', color:'#A0AEC0', lineHeight:1.7, marginBottom:24 }}>
              Redefining luxury living across South India with premium properties and exceptional service since 2010.
            </p>

            {/* Newsletter */}
            <p style={{ fontFamily:'Lato,sans-serif', fontSize:'0.8rem', fontWeight:700, color:'#F5C97A', marginBottom:10 }}>
              Subscribe to Newsletter
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex:            1,
                  borderRadius:    10,
                  padding:         '10px 14px',
                  fontSize:        '0.82rem',
                  background:      'rgba(10,22,40,0.8)',
                  border:          '1.5px solid rgba(212,175,55,0.3)',
                  color:           '#fff',
                  fontFamily:      'Lato,sans-serif',
                  outline:         'none',
                }}
              />
              <button
                className="footer__subscribe-btn"
                style={{
                  padding:      '10px 14px',
                  borderRadius: 10,
                  border:       'none',
                  cursor:       'pointer',
                  background:   'linear-gradient(135deg,#D4AF37,#F5C97A)',
                  color:        '#0A1628',
                  transition:   'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <svg style={{ width:16, height:16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links], idx) => (
            <div key={category}>
              <h3 style={{
                fontFamily:    'Cinzel,serif',
                fontSize:      '0.75rem',
                fontWeight:    700,
                color:         '#F5C97A',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom:  16,
                textShadow:    '0 0 10px rgba(245,201,122,0.3)',
              }}>
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:8 }}>
                {links.map((link, index) => {
                  const key = idx * 10 + index;
                  const hovered = hoveredLink === key;
                  return (
                    <li key={index}>
                      <a
                        href={link.href}
                        onMouseEnter={() => setHoveredLink(key)}
                        onMouseLeave={() => setHoveredLink(null)}
                        style={{ textDecoration:'none', position:'relative', display:'inline-block' }}
                      >
                        <span style={{
                          display:       'flex',
                          alignItems:    'center',
                          gap:           6,
                          fontFamily:    'Lato,sans-serif',
                          fontSize:      '0.84rem',
                          color:         hovered ? '#F5C97A' : '#C7D1DB',
                          transform:     hovered ? 'translateX(6px)' : 'translateX(0)',
                          transition:    'all 0.25s ease',
                        }}>
                          <svg
                            style={{ width:11, height:11, color:'#D4AF37', opacity: hovered ? 1 : 0, transition:'opacity 0.25s ease', flexShrink:0 }}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                          {link.name}
                        </span>
                        {hovered && (
                          <div style={{
                            position:   'absolute',
                            bottom:     -2,
                            left:       0,
                            height:     2,
                            width:      '100%',
                            borderRadius: 99,
                            background: 'linear-gradient(to right,#D4AF37,#F5C97A)',
                          }} />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.3) 20%,rgba(212,175,55,0.3) 80%,transparent)', marginBottom:32 }} />

        {/* Middle: certifications + contact */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(1,1fr)', gap:32, marginBottom:40 }} className="footer__mid-grid">

          {/* Certifications */}
          <div>
            <h4 style={{ fontFamily:'Lato,sans-serif', fontSize:'0.68rem', fontWeight:700, color:'#F5C97A', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12 }}>
              Certifications &amp; Memberships
            </h4>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {certifications.map((cert, i) => (
                <span
                  key={i}
                  className="footer__cert-badge"
                  style={{
                    padding:      '6px 12px',
                    borderRadius: 8,
                    fontSize:     '0.72rem',
                    fontFamily:   'Lato,sans-serif',
                    fontWeight:   600,
                    color:        '#F5C97A',
                    background:   'rgba(212,175,55,0.1)',
                    border:       '1px solid rgba(212,175,55,0.3)',
                    cursor:       'default',
                    transition:   'transform 0.2s ease',
                  }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="footer__contact-span">
            <h4 style={{ fontFamily:'Lato,sans-serif', fontSize:'0.68rem', fontWeight:700, color:'#F5C97A', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12 }}>
              Contact Information
            </h4>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(1,1fr)', gap:16 }} className="footer__contact-grid">
              {[
                { icon:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', label:'Corporate Office', value:'Chennai, Tamil Nadu' },
                { icon:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label:'Call Us', value:'+91 90000 00000' },
                { icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label:'Email', value:'info@bigway.com' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.3)', flexShrink:0 }}>
                    <svg style={{ width:16, height:16, color:'#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ margin:0, fontFamily:'Lato,sans-serif', fontSize:'0.7rem', color:'#C7D1DB' }}>{item.label}</p>
                    <p style={{ margin:0, fontFamily:'Lato,sans-serif', fontSize:'0.84rem', fontWeight:600, color:'#fff' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: copyright + social + payment */}
        <div style={{
          display:        'flex',
          flexWrap:       'wrap',
          justifyContent: 'space-between',
          alignItems:     'center',
          gap:            16,
          paddingTop:     24,
          borderTop:      '1px solid rgba(212,175,55,0.2)',
        }}>
          {/* Copyright */}
          <p style={{ margin:0, fontFamily:'Lato,sans-serif', fontSize:'0.75rem', color:'#A0AEC0' }}>
            © 2024 <span style={{ color:'#F5C97A', fontWeight:700 }}>BIGWAY Real Estate.</span> All rights reserved.
          </p>

          {/* Social icons */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontFamily:'Lato,sans-serif', fontSize:'0.72rem', fontWeight:700, color:'#F5C97A', marginRight:4 }}>Follow Us:</span>
            <div style={{ display:'flex', gap:8 }}>
              {socialLinks.map((social, index) => {
                const active = hoveredSocial === index;
                return (
                  <a
                    key={index}
                    href={social.url}
                    aria-label={social.name}
                    onMouseEnter={() => setHoveredSocial(index)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    style={{ position:'relative', textDecoration:'none' }}
                  >
                    <div style={{
                      width:          32,
                      height:         32,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      borderRadius:   9,
                      background:     active ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.1)',
                      border:         `1px solid ${active ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)'}`,
                      color:          active ? '#F5C97A' : '#D4AF37',
                      boxShadow:      active ? '0 0 20px rgba(212,175,55,0.4)' : 'none',
                      transform:      active ? 'translateY(-3px) scale(1.1)' : 'none',
                      transition:     'all 0.25s ease',
                    }}>
                      {social.icon}
                    </div>
                    {/* Tooltip */}
                    <div style={{
                      position:        'absolute',
                      bottom:          '110%',
                      left:            '50%',
                      transform:       active ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(5px)',
                      background:      'rgba(10,22,40,0.95)',
                      border:          '1px solid rgba(212,175,55,0.5)',
                      borderRadius:    6,
                      padding:         '4px 8px',
                      fontSize:        '0.68rem',
                      fontFamily:      'Lato,sans-serif',
                      fontWeight:      600,
                      color:           '#D4AF37',
                      whiteSpace:      'nowrap',
                      opacity:         active ? 1 : 0,
                      pointerEvents:   'none',
                      transition:      'all 0.22s ease',
                    }}>
                      {social.name}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Payment badges */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {['VISA','MC','PP'].map((label) => (
              <div key={label} style={{ width:30, height:20, borderRadius:4, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(212,175,55,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:'0.55rem', fontWeight:700, color:'#fff' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop:24, textAlign:'center' }}>
          <p style={{ fontFamily:'Lato,sans-serif', fontSize:'0.72rem', color:'#718096', maxWidth:'48rem', margin:'0 auto', lineHeight:1.7 }}>
            This website is for informational purposes only. All property information, including but not limited to square footage, lot size, and pricing, is deemed reliable but not guaranteed. All measurements are approximate. Photos may be virtually staged or enhanced.
          </p>
        </div>
      </div>

      {/* ── ALL styles scoped with footer__ prefix — zero global leakage ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lato:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap');

        /* Responsive grid — scoped inside footer__ wrapper */
        @media (min-width: 1024px) {
          .footer__top-grid { grid-template-columns: repeat(5, 1fr) !important; }
          .footer__mid-grid { grid-template-columns: 1fr 2fr !important; }
          .footer__contact-span { /* spans 2 cols naturally via grid */ }
          .footer__contact-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (min-width: 768px) {
          .footer__mid-grid   { grid-template-columns: 1fr 2fr !important; }
          .footer__contact-grid { grid-template-columns: repeat(3,1fr) !important; }
        }

        /* Orbs — scoped animation names with footer__ prefix */
        .footer__orb-1 { animation: footer__pulse-glow 6s ease-in-out infinite; }
        .footer__orb-2 { animation: footer__pulse-glow 8s ease-in-out infinite 2s; }

        .footer__dot-1 { animation: footer__float   8s  ease-in-out infinite; }
        .footer__dot-2 { animation: footer__float-b 10s ease-in-out infinite 1s; }
        .footer__dot-3 { animation: footer__float-c 12s ease-in-out infinite; }

        @keyframes footer__float {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(5px,-5px); }
        }
        @keyframes footer__float-b {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(-5px,5px); }
        }
        @keyframes footer__float-c {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(10px,-10px); }
        }
        @keyframes footer__pulse-glow {
          0%,100% { opacity:0.1; transform:scale(1); }
          50%     { opacity:0.16; transform:scale(1.05); }
        }

        /* Subscribe button hover */
        .footer__subscribe-btn:hover {
          transform:  scale(1.07) !important;
          box-shadow: 0 6px 20px rgba(212,175,55,0.45) !important;
        }

        /* Cert badge hover */
        .footer__cert-badge:hover { transform: scale(1.05); }
      `}</style>
    </footer>
  );
}