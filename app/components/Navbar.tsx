"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EnquiryModal from './EnquiryModal';

interface DropdownItem { name: string; href: string; emoji: string; }
interface MenuItem { name: string; href: string; dropdown?: DropdownItem[]; }

const menuItems: MenuItem[] = [
  { name: 'Home',       href: '/' },
  { name: 'About Us',   href: '/Aboutus' },
  { name: 'Properties', href: '/Properties' },
  { name: 'Projects',   href: '/Project' },
  {
    name: 'Services', href: '/Service',
    dropdown: [
      { name: 'Property Selling',     href: '/Service/property-selling',    emoji: '🏠' },
      { name: 'Land Selling',         href: '/Service/land-selling',        emoji: '🌳' },
      { name: 'Construction',         href: '/Service/construction',        emoji: '🏗️' },
      { name: 'Flats & Apartments',   href: '/Service/flats-apartments',    emoji: '🏢' },
      { name: 'Villas & Independent', href: '/Service/villas-independent',  emoji: '🏡' },
      { name: 'Commercial',           href: '/Service/commercial',          emoji: '🏪' },
    ],
  },
  { name: 'Gallery',    href: '/Gallery' },
  { name: 'Blog',       href: '/Blog' },
  { name: 'Contact Us', href: '/Contact' },
];

const Navbar: React.FC = () => {
  const [isMenuOpen,     setIsMenuOpen]     = useState(false);
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [activeItem,     setActiveItem]     = useState('Home');
  const [openDropdown,   setOpenDropdown]   = useState<string | null>(null);
  const [mobileServices, setMobileServices] = useState(false);
  const [showEnquiry,    setShowEnquiry]    = useState(false);
  const [ripples,        setRipples]        = useState<{ id: number; x: number; y: number }[]>([]);
  const [enquiryRipples, setEnquiryRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const rippleCount        = useRef(0);
  const enquiryRippleCount = useRef(0);
  const dropdownTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const triggerRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++rippleCount.current;
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rpl => rpl.id !== id)), 700);
  };

  const triggerEnquiryRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++enquiryRippleCount.current;
    setEnquiryRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setEnquiryRipples(r => r.filter(rpl => rpl.id !== id)), 700);
  };

  const handleEnquiryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerEnquiryRipple(e);
    setShowEnquiry(true);
  };

  const handleMouseEnterDropdown = (name: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(name);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: isScrolled ? '10px 0' : '22px 0',
        transition: 'padding 0.45s ease, background 0.45s ease, box-shadow 0.45s ease',
        backgroundColor: isScrolled ? 'rgba(6,15,30,0.97)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(22px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(22px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(212,175,55,0.22)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 8px 50px rgba(0,0,0,0.5)' : 'none',
      }}>
        <div className="navbar-container">

          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <Image src="/menu_logo.png" alt="Bigway Logo" width={140} height={52} className="navbar-logo-img" priority />
          </Link>

          {/* Desktop Menu */}
          <ul className="navbar-desktop-menu">
            {menuItems.map((item) => {
              const isActive = activeItem === item.name;
              const hasDD    = !!item.dropdown;
              const ddOpen   = openDropdown === item.name;

              return (
                <li key={item.name} style={{ position: 'relative' }}
                  onMouseEnter={() => hasDD && handleMouseEnterDropdown(item.name)}
                  onMouseLeave={() => hasDD && handleMouseLeaveDropdown()}
                  onClick={e => e.stopPropagation()}
                >
                  <Link href={item.href} onClick={() => setActiveItem(item.name)}>
                    <span className={`navbar-link ${isActive ? 'navbar-link--active' : ''}`}>
                      {item.name}
                      {hasDD && (
                        /* ── BIG VISIBLE CHEVRON ── */
                        <span className={`dd-chevron-wrap ${ddOpen ? 'dd-chevron-wrap--open' : ''}`}>
                          <svg className="dd-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </span>
                      )}
                      <span className="navbar-link-bar" />
                    </span>
                  </Link>

                  {hasDD && (
                    <div className={`nav-dropdown ${ddOpen ? 'nav-dropdown--open' : ''}`}>
                      <div className="nav-dropdown-tip" />
                      <div className="nav-dropdown-inner">
                        <div className="nav-dropdown-header">
                          <div className="nav-dropdown-dot" />
                          <span className="nav-dropdown-label">OUR SERVICES</span>
                          <div className="nav-dropdown-dot" />
                        </div>
                        {item.dropdown!.map((sub) => (
                          <Link key={sub.name} href={sub.href} className="nav-dropdown-item"
                            onClick={() => { setActiveItem(item.name); setOpenDropdown(null); }}>
                            <span className="nav-dd-emoji">{sub.emoji}</span>
                            <span className="nav-dd-text">{sub.name}</span>
                            <svg className="nav-dd-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                          </Link>
                        ))}
                        <Link href="/Service" className="nav-dropdown-all"
                          onClick={() => { setActiveItem('Services'); setOpenDropdown(null); }}>
                          ✦ View All Services
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop Buttons */}
          <div className="navbar-desktop-buttons">
            <button className={`login-btn ${isScrolled ? 'login-btn--solid' : 'login-btn--ghost'}`} onClick={handleEnquiryClick}>
              <span className="login-btn__shimmer" />
              {enquiryRipples.map(r => <span key={r.id} className="login-btn__ripple" style={{ left: r.x, top: r.y }} />)}
              <span className="login-btn__label">Enquiry</span>
            </button>
            <button className={`login-btn ${isScrolled ? 'login-btn--solid' : 'login-btn--ghost'}`} onClick={triggerRipple}>
              <span className="login-btn__shimmer" />
              {ripples.map(r => <span key={r.id} className="login-btn__ripple" style={{ left: r.x, top: r.y }} />)}
              <span className="login-btn__label">Login</span>
            </button>
          </div>

          {/* Hamburger */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="navbar-hamburger">
            {[0, 1, 2].map((i) => (
              <span key={i} className="hamburger-line" style={{
                transform: isMenuOpen
                  ? i === 0 ? 'translateY(8px) rotate(45deg)'
                  : i === 2 ? 'translateY(-8px) rotate(-45deg)' : 'none'
                  : 'none',
                opacity: i === 1 && isMenuOpen ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ── MOBILE OVERLAY ── */}
      <div aria-hidden={!isMenuOpen} className={`mobile-overlay ${isMenuOpen ? 'mobile-overlay--open' : ''}`}>

        {/* Mobile Header */}
        <div className="mobile-header">
          <button onClick={() => setIsMenuOpen(false)} className="mobile-close" aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <Image src="/menu_logo.png" alt="Bigway Logo" width={120} height={44} style={{ objectFit: 'contain', opacity: 0.92 }} />
          <div style={{ width: 40 }} />
        </div>

        {/* Gold divider */}
        <div className="mobile-divider" />

        <div className="mobile-scroll">
          {menuItems.map((item) => {
            const isActive = activeItem === item.name;
            const hasDD    = !!item.dropdown;

            if (hasDD) {
              return (
                <div key={item.name} className="mobile-accordion">
                  <button
                    className={`mobile-accordion-trigger ${mobileServices ? 'mobile-accordion-trigger--open' : ''} ${isActive ? 'mobile-accordion-trigger--active' : ''}`}
                    onClick={() => setMobileServices(s => !s)}
                  >
                    <div className="mobile-acc-left">
                      <span className="mobile-acc-icon">🏛️</span>
                      <span>{item.name}</span>
                    </div>
                    <div className={`mobile-acc-chevron ${mobileServices ? 'mobile-acc-chevron--open' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </button>

                  <div className={`mobile-acc-body ${mobileServices ? 'mobile-acc-body--open' : ''}`}>
                    <div className="mobile-acc-content">
                      {item.dropdown!.map((sub, idx) => (
                        <Link key={sub.name} href={sub.href} className="mobile-sub-link"
                          style={{ animationDelay: `${idx * 50}ms` }}
                          onClick={() => { setIsMenuOpen(false); setActiveItem(item.name); }}>
                          <span className="mobile-sub-emoji">{sub.emoji}</span>
                          <span className="mobile-sub-text">{sub.name}</span>
                          <svg className="mobile-sub-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </Link>
                      ))}
                      <Link href="/Service" className="mobile-view-all"
                        onClick={() => { setIsMenuOpen(false); setActiveItem('Services'); }}>
                        View All Services →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.name} href={item.href}
                className={`mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                onClick={() => { setIsMenuOpen(false); setActiveItem(item.name); }}>
                <span>{item.name}</span>
                <svg className="mobile-nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            );
          })}

          {/* Mobile Buttons */}
          <div className="mobile-btns">
            <button className="login-btn login-btn--solid mobile-btn-full" onClick={handleEnquiryClick}>
              <span className="login-btn__shimmer" />
              {enquiryRipples.map(r => <span key={r.id} className="login-btn__ripple" style={{ left: r.x, top: r.y }} />)}
              <span className="login-btn__label">📩 Enquiry</span>
            </button>
            <button className="login-btn login-btn--ghost mobile-btn-full" onClick={triggerRipple}>
              <span className="login-btn__shimmer" />
              {ripples.map(r => <span key={r.id} className="login-btn__ripple" style={{ left: r.x, top: r.y }} />)}
              <span className="login-btn__label">🔑 Login</span>
            </button>
          </div>

          <div className="mobile-footer">
            <span>⭐ Bigway Real Estate · Coimbatore · Est. 2009</span>
          </div>
        </div>
      </div>

      <EnquiryModal isOpen={showEnquiry} onClose={() => setShowEnquiry(false)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;600;700;800&family=Orbitron:wght@600;700;800&family=Poppins:wght@500;600;700&display=swap');

        /* ════ NAVBAR CONTAINER ════ */
        .navbar-container {
          max-width: 84rem; margin: 0 auto; padding: 0 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .navbar-logo { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
        .navbar-logo-img { object-fit: contain; display: block; width: 140px; height: auto; }

        /* ════ DESKTOP MENU ════ */
        .navbar-desktop-menu {
          display: none; align-items: center; list-style: none; margin: 0; padding: 0; gap: 0;
        }
        .navbar-link {
          position: relative; display: flex; align-items: center; gap: 4px;
          padding: 10px 13px; color: rgba(255,255,255,0.80);
          font-family: "Lato",sans-serif; font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.13em; text-transform: uppercase;
          cursor: pointer; border-radius: 8px; text-decoration: none;
          transition: color 0.28s ease, background 0.28s ease, text-shadow 0.28s ease;
        }
        .navbar-link--active { color: #F5E27A; font-weight: 800; text-shadow: 0 0 18px rgba(245,226,122,0.55); }
        .navbar-link-bar {
          position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          height: 2px; width: 0%; border-radius: 99px;
          background: linear-gradient(90deg,#B8960C,#D4AF37,#F5E27A,#D4AF37,#B8960C);
          transition: width 0.32s ease; box-shadow: 0 0 10px rgba(212,175,55,0.6);
        }
        .navbar-link--active .navbar-link-bar { width: 60%; }
        .navbar-link:hover { color: #F5E27A !important; background: rgba(212,175,55,0.09) !important; text-shadow: 0 0 22px rgba(245,226,122,0.6) !important; }
        .navbar-link:hover .navbar-link-bar { width: 62% !important; }

        /* ── BIG CHEVRON ── */
        .dd-chevron-wrap {
          display: inline-flex; align-items: center; justify-content: center;
          width: 22px; height: 22px; border-radius: 6px;
          background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.28);
          margin-left: 4px; flex-shrink: 0;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.3s ease;
        }
        .dd-chevron-wrap--open {
          background: rgba(212,175,55,0.22); border-color: rgba(212,175,55,0.6);
          transform: rotate(180deg);
        }
        .navbar-link:hover .dd-chevron-wrap {
          background: rgba(212,175,55,0.2); border-color: rgba(212,175,55,0.5);
        }
        .dd-chevron { width: 13px; height: 13px; color: #D4AF37; display: block; }

        /* ════ DROPDOWN ════ */
        .nav-dropdown {
          position: absolute; top: calc(100% + 12px); left: 50%;
          transform: translateX(-50%) translateY(-10px);
          min-width: 240px;
          background: rgba(4,10,22,0.99);
          backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(212,175,55,0.25); border-radius: 16px;
          box-shadow: 0 24px 70px rgba(0,0,0,0.82), 0 0 0 1px rgba(212,175,55,0.05), 0 0 60px rgba(212,175,55,0.06);
          opacity: 0; pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1);
          z-index: 200;
        }
        .nav-dropdown--open {
          opacity: 1; pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .nav-dropdown-tip {
          position: absolute; top: -7px; left: 50%; transform: translateX(-50%) rotate(45deg);
          width: 12px; height: 12px;
          background: rgba(4,10,22,0.99);
          border-top: 1px solid rgba(212,175,55,0.25); border-left: 1px solid rgba(212,175,55,0.25);
        }
        .nav-dropdown-inner { padding: 8px; }
        .nav-dropdown-header {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px 10px; margin-bottom: 3px;
          border-bottom: 1px solid rgba(212,175,55,0.1);
        }
        .nav-dropdown-dot {
          width: 4px; height: 4px; border-radius: 50%; background: #D4AF37; opacity: 0.5; flex-shrink: 0;
        }
        .nav-dropdown-label {
          font-family: "'Orbitron',sans-serif"; font-size: 7.5px; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase; color: rgba(212,175,55,0.55); flex: 1;
        }
        .nav-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          color: rgba(199,209,219,0.75);
          font-family: "Lato",sans-serif; font-size: 0.73rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
          transition: all 0.22s ease; cursor: pointer; position: relative; overflow: hidden;
        }
        .nav-dropdown-item::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0;
          background: linear-gradient(90deg,rgba(212,175,55,0.18),transparent);
          border-radius: 10px; transition: width 0.22s ease;
        }
        .nav-dropdown-item:hover { color: #F5E27A; padding-left: 16px; }
        .nav-dropdown-item:hover::before { width: 100%; }
        .nav-dd-emoji { font-size: 16px; line-height: 1; flex-shrink: 0; position: relative; z-index: 1; }
        .nav-dd-text { flex: 1; position: relative; z-index: 1; }
        .nav-dd-arrow {
          width: 11px; height: 11px; opacity: 0; flex-shrink: 0;
          color: #D4AF37; position: relative; z-index: 1;
          transition: opacity 0.22s ease, transform 0.22s ease;
        }
        .nav-dropdown-item:hover .nav-dd-arrow { opacity: 1; transform: translateX(4px); }
        .nav-dropdown-all {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin: 6px 0 2px; padding: 10px 12px;
          text-align: center; border-radius: 10px;
          border: 1px solid rgba(212,175,55,0.22);
          background: linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.04));
          color: rgba(212,175,55,0.75);
          font-family: "Lato",sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase; text-decoration: none;
          transition: all 0.22s ease;
        }
        .nav-dropdown-all:hover { background: rgba(212,175,55,0.15); color: #F5E27A; border-color: rgba(212,175,55,0.4); }

        /* ════ DESKTOP BUTTONS ════ */
        .navbar-desktop-buttons { display: none; align-items: center; gap: 12px; }

        /* ════ HAMBURGER ════ */
        .navbar-hamburger {
          background: rgba(212,175,55,0.07); border: 1px solid rgba(212,175,55,0.32);
          border-radius: 10px; width: 46px; height: 46px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px; cursor: pointer; transition: all 0.3s ease;
        }
        .navbar-hamburger:hover { background: rgba(212,175,55,0.18); box-shadow: 0 0 20px rgba(212,175,55,0.2); }
        .hamburger-line {
          display: block; width: 22px; height: 2px; border-radius: 2px;
          background-color: #D4AF37; box-shadow: 0 0 6px rgba(212,175,55,0.5);
          transition: transform 0.35s ease, opacity 0.35s ease; transform-origin: center;
        }

        /* ════ MOBILE OVERLAY ════ */
        .mobile-overlay {
          position: fixed; inset: 0; z-index: 49;
          display: flex; flex-direction: column;
          background: linear-gradient(175deg,#040B18 0%,#060F22 50%,#030810 100%);
          opacity: 0; pointer-events: none;
          transform: translateX(100%);
          transition: opacity 0.38s ease, transform 0.42s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-overlay--open {
          opacity: 1; pointer-events: auto; transform: translateX(0);
        }

        /* Mobile header bar */
        .mobile-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-bottom: 1px solid rgba(212,175,55,0.15);
          background: rgba(4,10,22,0.8); flex-shrink: 0;
        }
        .mobile-close {
          width: 42px; height: 42px; border-radius: 10px;
          background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.28);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #D4AF37; transition: all 0.25s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .mobile-close svg { width: 18px; height: 18px; }
        .mobile-close:active { background: rgba(212,175,55,0.2); transform: scale(0.92); }
        .mobile-divider {
          height: 2px; flex-shrink: 0;
          background: linear-gradient(90deg,transparent,#D4AF37,#F5E27A,#D4AF37,transparent);
          opacity: 0.5;
        }

        /* Scrollable content */
        .mobile-scroll {
          flex: 1; overflow-y: auto; padding: 12px 16px 32px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .mobile-scroll::-webkit-scrollbar { width: 3px; }
        .mobile-scroll::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 2px; }

        /* Regular nav link */
        .mobile-nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px; border-radius: 12px;
          color: rgba(255,255,255,0.78);
          font-family: "Lato",sans-serif; font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.22s ease; -webkit-tap-highlight-color: transparent;
        }
        .mobile-nav-link:active { transform: scale(0.97); background: rgba(212,175,55,0.08); }
        .mobile-nav-link--active {
          color: #F5E27A; font-weight: 800;
          background: rgba(212,175,55,0.09); border-color: rgba(212,175,55,0.24);
          text-shadow: 0 0 18px rgba(245,226,122,0.45);
        }
        .mobile-nav-arrow {
          width: 16px; height: 16px; color: rgba(212,175,55,0.35); flex-shrink: 0;
          transition: transform 0.22s ease, color 0.22s ease;
        }
        .mobile-nav-link:active .mobile-nav-arrow { transform: translateX(4px); color: #D4AF37; }

        /* ── ACCORDION (Services) ── */
        .mobile-accordion { display: flex; flex-direction: column; }
        .mobile-accordion-trigger {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 16px 18px; border-radius: 12px;
          background: transparent; border: 1px solid transparent;
          color: rgba(255,255,255,0.78);
          font-family: "Lato",sans-serif; font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .mobile-accordion-trigger--open,
        .mobile-accordion-trigger:active {
          background: rgba(212,175,55,0.09); border-color: rgba(212,175,55,0.24); color: #F5E27A;
        }
        .mobile-accordion-trigger--active { color: #F5E27A; font-weight: 800; }
        .mobile-acc-left { display: flex; align-items: center; gap: 10px; }
        .mobile-acc-icon { font-size: 18px; line-height: 1; }

        /* Big chevron inside accordion */
        .mobile-acc-chevron {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3);
          color: #D4AF37; transition: all 0.32s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-acc-chevron svg { width: 18px; height: 18px; display: block; }
        .mobile-acc-chevron--open {
          background: rgba(212,175,55,0.22); border-color: rgba(212,175,55,0.6);
          transform: rotate(180deg); box-shadow: 0 0 16px rgba(212,175,55,0.35);
        }

        /* Accordion body slide */
        .mobile-acc-body {
          max-height: 0; overflow: hidden;
          transition: max-height 0.44s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-acc-body--open { max-height: 600px; }
        .mobile-acc-content {
          padding: 6px 0 10px 8px;
          display: flex; flex-direction: column; gap: 5px;
          border-left: 2px solid rgba(212,175,55,0.2);
          margin-left: 20px;
        }

        /* Sub-link */
        .mobile-sub-link {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 16px; border-radius: 10px;
          background: rgba(212,175,55,0.04); border: 1px solid rgba(212,175,55,0.1);
          color: rgba(199,209,219,0.8); text-decoration: none;
          font-family: "Lato",sans-serif; font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          transition: all 0.22s ease; -webkit-tap-highlight-color: transparent;
          animation: slideInLeft 0.3s ease both;
        }
        .mobile-sub-link:active {
          background: rgba(212,175,55,0.14); border-color: rgba(212,175,55,0.35);
          color: #F5E27A; transform: translateX(4px);
        }
        .mobile-sub-emoji { font-size: 18px; line-height: 1; flex-shrink: 0; }
        .mobile-sub-text { flex: 1; }
        .mobile-sub-arrow {
          width: 13px; height: 13px; color: rgba(212,175,55,0.35); flex-shrink: 0;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .mobile-sub-link:active .mobile-sub-arrow { color: #D4AF37; transform: translateX(4px); }

        /* View all */
        .mobile-view-all {
          display: flex; align-items: center; justify-content: center;
          margin-top: 4px; padding: 11px 16px; border-radius: 10px;
          border: 1px solid rgba(212,175,55,0.2);
          background: linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.04));
          color: rgba(212,175,55,0.8); text-decoration: none;
          font-family: "Lato",sans-serif; font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          transition: all 0.22s ease; -webkit-tap-highlight-color: transparent;
        }
        .mobile-view-all:active { background: rgba(212,175,55,0.18); color: #F5E27A; }

        /* Mobile CTA buttons */
        .mobile-btns {
          display: flex; flex-direction: column; gap: 10px;
          margin-top: 20px; padding-top: 20px;
          border-top: 1px solid rgba(212,175,55,0.12);
        }
        .mobile-btn-full {
          width: 100%; padding: 16px 24px !important;
          border-radius: 14px !important; font-size: 0.82rem !important;
          letter-spacing: 0.18em !important; min-width: unset !important;
        }
        .mobile-footer {
          text-align: center; padding: 20px 0 8px;
          font-family: "Orbitron",sans-serif; font-size: 7px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase; color: rgba(212,175,55,0.22);
        }

        /* ════ SHARED BUTTONS ════ */
        .login-btn {
          position: relative; overflow: hidden; display: inline-flex;
          align-items: center; justify-content: center;
          padding: 10px 28px; border-radius: 10px; cursor: pointer;
          font-family: "Lato",sans-serif; font-size: 0.74rem; font-weight: 800;
          letter-spacing: 0.20em; text-transform: uppercase;
          transition: all 0.35s ease; min-width: 100px; border: none; outline: none;
        }
        .login-btn--ghost {
          background: transparent; border: 1.5px solid rgba(212,175,55,0.70);
          color: #D4AF37; text-shadow: 0 0 12px rgba(212,175,55,0.3);
          animation: btn-pulse-ghost 2.8s ease-in-out infinite;
        }
        .login-btn--ghost:hover {
          background: rgba(212,175,55,0.12); border-color: #F5E27A; color: #F5E27A;
          box-shadow: 0 0 22px rgba(212,175,55,0.45); transform: translateY(-2px) scale(1.05); animation: none;
        }
        .login-btn--solid {
          background: linear-gradient(135deg,#C9A227 0%,#F5E27A 45%,#B8960C 100%);
          border: 1px solid rgba(212,175,55,0.5); color: #0A192F;
          box-shadow: 0 4px 22px rgba(212,175,55,0.35);
          animation: btn-pulse-solid 2.8s ease-in-out infinite;
        }
        .login-btn--solid:hover {
          background: linear-gradient(135deg,#D4AF37 0%,#FFF0A0 45%,#C9A227 100%);
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 10px 38px rgba(212,175,55,0.60); animation: none;
        }
        .login-btn__shimmer {
          position: absolute; top: 0; left: -110%; width: 60%; height: 100%;
          background: linear-gradient(120deg,transparent 20%,rgba(255,255,255,0.38) 50%,transparent 80%);
          transform: skewX(-20deg); pointer-events: none;
        }
        .login-btn:hover .login-btn__shimmer { animation: shimmer-sweep 0.6s ease forwards; }
        .login-btn__ripple {
          position: absolute; width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.55);
          transform: translate(-50%,-50%) scale(0); pointer-events: none;
          animation: ripple-expand 0.7s ease-out forwards;
        }
        .login-btn__label { position: relative; z-index: 1; }

        /* ════ KEYFRAMES ════ */
        @keyframes shimmer-sweep { 0%{left:-110%} 100%{left:130%} }
        @keyframes ripple-expand { 0%{transform:translate(-50%,-50%) scale(0);opacity:1} 100%{transform:translate(-50%,-50%) scale(22);opacity:0} }
        @keyframes btn-pulse-ghost { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0);border-color:rgba(212,175,55,0.70)} 50%{box-shadow:0 0 14px 3px rgba(212,175,55,0.28);border-color:rgba(212,175,55,1)} }
        @keyframes btn-pulse-solid { 0%,100%{box-shadow:0 4px 22px rgba(212,175,55,0.35)} 50%{box-shadow:0 4px 28px rgba(212,175,55,0.60)} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }

        /* ════ RESPONSIVE ════ */
        @media (min-width: 768px) {
          .navbar-desktop-menu { display: flex; }
          .navbar-desktop-buttons { display: flex; }
          .navbar-hamburger { display: none; }
        }
        @media (min-width: 768px) and (max-width: 1100px) {
          .navbar-container { padding: 0 1.2rem; }
          .navbar-link { padding: 8px 9px; font-size: 0.66rem; letter-spacing: 0.09em; }
          .login-btn { padding: 8px 16px; font-size: 0.66rem; min-width: 70px; }
          .navbar-logo-img { width: 110px; }
          .dd-chevron-wrap { width: 18px; height: 18px; }
          .dd-chevron { width: 10px; height: 10px; }
        }
        @media (max-width: 480px) {
          .navbar-container { padding: 0 1.2rem; }
          .navbar-logo-img { width: 110px; }
          .navbar-hamburger { width: 40px; height: 40px; gap: 5px; }
          .hamburger-line { width: 20px; }
          .mobile-nav-link, .mobile-accordion-trigger { padding: 14px 16px; font-size: 0.82rem; }
          .mobile-sub-link { padding: 12px 14px; font-size: 0.78rem; }
        }
        @media (max-width: 360px) {
          .navbar-container { padding: 0 0.8rem; }
          .navbar-logo-img { width: 90px; }
          .mobile-nav-link, .mobile-accordion-trigger { padding: 12px 14px; font-size: 0.76rem; }
        }
      `}</style>
    </>
  );
};

export default Navbar;