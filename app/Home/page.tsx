"use client";
import { useEffect, useRef } from "react";
import React from "react";
import HeroSection from "../components/HeroSection";
import AboutUsSection from "../components/AboutUs";
import FeaturedProperties from "../components/FeaturedProperties";
import WhyChooseUs from "../components/Service";
import Testimonials from "../components/Testimonials";
import ServiceLocations from "../components/ServiceLocations";
import CTA from "../components/CTA";
import Contact from "../components/Contact";

// ─── Scroll Animation + Full-Screen Styles ───────────────────────────────────
function useScrollAnimation() {
  useEffect(() => {
    const STYLE_ID = "scroll-animations";
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0; padding: 0;
          width: 100%; overflow-x: hidden;
        }

        /* ── Full-screen section ── */
        .full-screen-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
        }
        .full-screen-section > * {
          flex: 1;
          width: 100%;
          min-height: 0;
        }

        /* ── Reveal base ── */
        .reveal {
          opacity: 0;
          transition-property: opacity, transform, filter;
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }

        /* ── Variants ── */
        .reveal-fade-up    { transform: translateY(48px); }
        .reveal-fade-down  { transform: translateY(-48px); }
        .reveal-fade-left  { transform: translateX(-60px); }
        .reveal-fade-right { transform: translateX(60px); }
        .reveal-zoom-in    { transform: scale(0.88); }
        .reveal-zoom-out   { transform: scale(1.1); }
        .reveal-flip-up    { transform: perspective(600px) rotateX(20deg) translateY(32px); }
        .reveal-blur       { filter: blur(12px); transform: translateY(24px); }
        .reveal-slide-skew { transform: translateX(-50px) skewX(5deg); }

        .reveal.is-visible {
          opacity: 1;
          transform: none !important;
          filter: none !important;
        }

        /* ── Stagger children ── */
        .stagger-children > * {
          opacity: 0;
          transform: translateY(40px);
          transition-property: opacity, transform;
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          transition-duration: 0.7s;
          will-change: opacity, transform;
        }
        .stagger-children.is-visible > *:nth-child(1) { transition-delay: 0.05s; }
        .stagger-children.is-visible > *:nth-child(2) { transition-delay: 0.15s; }
        .stagger-children.is-visible > *:nth-child(3) { transition-delay: 0.25s; }
        .stagger-children.is-visible > *:nth-child(4) { transition-delay: 0.35s; }
        .stagger-children.is-visible > *:nth-child(5) { transition-delay: 0.45s; }
        .stagger-children.is-visible > *:nth-child(6) { transition-delay: 0.55s; }
        .stagger-children.is-visible > * {
          opacity: 1;
          transform: none !important;
        }

        /* ── Durations ── */
        .dur-300  { transition-duration: 0.3s; }
        .dur-500  { transition-duration: 0.5s; }
        .dur-700  { transition-duration: 0.7s; }
        .dur-900  { transition-duration: 0.9s; }
        .dur-1100 { transition-duration: 1.1s; }
        .dur-1400 { transition-duration: 1.4s; }

        /* ── Delays ── */
        .del-0   { transition-delay: 0s; }
        .del-100 { transition-delay: 0.1s; }
        .del-200 { transition-delay: 0.2s; }
        .del-300 { transition-delay: 0.3s; }
        .del-500 { transition-delay: 0.5s; }
        .del-700 { transition-delay: 0.7s; }

        /* ── Smaller motion on phones ── */
        @media (max-width: 480px) {
          .reveal-slide-skew { transform: translateX(-28px) skewX(3deg); }
          .reveal-flip-up    { transform: perspective(400px) rotateX(12deg) translateY(18px); }
          .reveal-blur       { filter: blur(6px); transform: translateY(14px); }
          .reveal-fade-left  { transform: translateX(-32px); }
          .reveal-fade-right { transform: translateX(32px); }
          .reveal-fade-up    { transform: translateY(30px); }
        }

        /* ── Prefers reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .reveal,
          .stagger-children > * {
            transition-duration: 0.01ms !important;
            transition-delay:    0.01ms !important;
            transform: none !important;
            filter:    none !important;
            opacity:   1   !important;
          }
        }

        /* ── Hero entrance ── */
        @keyframes heroEnter {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .hero-enter {
          animation: heroEnter 1s cubic-bezier(0.22,1,0.36,1) both;
        }
      `;
      document.head.appendChild(style);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );

    const timer = setTimeout(() => {
      document
        .querySelectorAll(".reveal, .stagger-children")
        .forEach((el) => observer.observe(el));
    }, 120);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}

// ─── AnimSection ─────────────────────────────────────────────────────────────
interface AnimSectionProps {
  children: React.ReactNode;
  animation?: string;
  duration?: string;
  delay?: string;
  stagger?: boolean;
  className?: string;
  id?: string;
}

function AnimSection({
  children,
  animation = "reveal-fade-up",
  duration = "dur-900",
  delay = "del-0",
  stagger = false,
  className = "",
  id,
}: AnimSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animClasses = stagger
    ? `stagger-children ${duration}`
    : `reveal ${animation} ${duration} ${delay}`;

  return (
    <section
      ref={ref}
      id={id}
      className={["full-screen-section", animClasses, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  useScrollAnimation();

  return (
    <>
      {/* Hero — full screen, immediate entrance */}
      <section className="full-screen-section hero-enter" id="hero">
        <HeroSection />
      </section>

      {/* About — slides in from left */}
      <AnimSection id="about" animation="reveal-fade-left" duration="dur-1100" delay="del-100">
        <AboutUsSection />
      </AnimSection>

      {/* Featured Properties — zooms in */}
      <AnimSection id="properties" animation="reveal-zoom-in" duration="dur-900" delay="del-0">
        <FeaturedProperties />
      </AnimSection>

      {/* Why Choose Us — staggered children */}
      <AnimSection id="why-choose-us" stagger duration="dur-700" delay="del-0">
        <WhyChooseUs />
      </AnimSection>

      {/* Testimonials — blur reveal */}
      <AnimSection id="testimonials" animation="reveal-blur" duration="dur-1100" delay="del-200">
        <Testimonials />
      </AnimSection>

      {/* Service Locations — skew slide */}
      <AnimSection id="locations" animation="reveal-slide-skew" duration="dur-1100" delay="del-0">
        <ServiceLocations />
      </AnimSection>

      {/* CTA — flip up */}
      <AnimSection id="cta" animation="reveal-flip-up" duration="dur-900" delay="del-100">
        <CTA />
      </AnimSection>

      {/* Contact — slides in from right */}
      <AnimSection id="contact" animation="reveal-fade-right" duration="dur-1100" delay="del-0">
        <Contact />
      </AnimSection>
    </>
  );
}