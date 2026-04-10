"use client"
import React, { useState, useRef, useEffect } from 'react';

/* ─── Chatbot Q&A Data ─────────────────────────────────────────────────── */
const QA: { q: string; a: string }[] = [
  {
    q: "How do I start the property buying process?",
    a: "It's simple! Start by browsing our Properties page to find listings that match your budget and location. Once you shortlist a property, our team will schedule a site visit and guide you through the legal and financial steps.",
  },
  {
    q: "What types of properties does Bigway offer?",
    a: "Bigway offers residential apartments, luxury villas, commercial spaces, and plotted developments — across ready-to-move and under-construction categories to suit every need.",
  },
  {
    q: "Where are Bigway's projects located?",
    a: "Our projects are spread across prime locations including the city's IT corridors, emerging suburbs, and waterfront zones. Visit our Projects page for detailed maps and location highlights.",
  },
  {
    q: "What is the price range of properties?",
    a: "Our portfolio ranges from affordable homes starting at ₹35 Lakhs to ultra-luxury residences above ₹5 Crores. We have options for first-time buyers as well as seasoned investors.",
  },
  {
    q: "Do you offer home loan assistance?",
    a: "Yes! We have tie-ups with leading banks and NBFCs offering pre-approved loans, competitive interest rates, and end-to-end documentation support — all at zero extra cost to you.",
  },
  {
    q: "What services does Bigway provide?",
    a: "Beyond buying and selling, we offer property management, legal advisory, interior design consultation, NRI property services, and investment portfolio planning.",
  },
  {
    q: "How can I schedule a site visit?",
    a: "You can click 'Contact Us' in the menu, WhatsApp us directly using the button on this page, or call our helpline. We'll arrange a personalized site visit at your convenience.",
  },
  {
    q: "Are your projects RERA registered?",
    a: "Absolutely. All Bigway projects are RERA registered and fully compliant with local real estate regulations, ensuring your investment is legally protected.",
  },
  {
    q: "Can NRIs buy properties through Bigway?",
    a: "Yes! We have a dedicated NRI Desk that handles everything remotely — from virtual tours and digital documentation to power of attorney services and repatriation guidance.",
  },
  {
    q: "How do I contact the Bigway team?",
    a: "You can reach us via the Contact Us page, send us a WhatsApp message using the chat button, email us at info@bigway.in, or call our 24/7 helpline. We typically respond within 30 minutes.",
  },
];

type Message = { role: 'bot' | 'user'; text: string };

const WHATSAPP_NUMBER = '919999999999'; // ← Replace with real number
const WHATSAPP_MSG    = encodeURIComponent('Hello! I found you on your website and would like to know more about your properties.');

export default function FloatingWidgets() {
  const [chatOpen,  setChatOpen]  = useState(false);
  const [messages,  setMessages]  = useState<Message[]>([
    { role: 'bot', text: "👋 Hi! I'm Bigway's assistant. Pick a question below or ask anything about our properties!" },
  ]);
  const [typing,    setTyping]    = useState(false);
  const [showHints, setShowHints] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleQuestion = (qa: { q: string; a: string }) => {
    setShowHints(false);
    setMessages((m) => [...m, { role: 'user', text: qa.q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: 'bot', text: qa.a }]);
      setTimeout(() => setShowHints(true), 300);
    }, 1100);
  };

  return (
    <>
      {/* ── FAB buttons — fixed bottom right, vertical stack ── */}
      <div
        style={{
          position:      'fixed',
          bottom:        28,
          right:         24,
          zIndex:        999,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           10,
        }}
      >
        {/* ── WhatsApp button (top) ── */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span className="fab-label">WhatsApp</span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fab fab-whatsapp"
            title="Chat on WhatsApp"
            style={{
              width:          56,
              height:         56,
              borderRadius:   18,
              background:     'linear-gradient(145deg,#25D366 0%,#128C7E 100%)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 6px 26px rgba(37,211,102,0.48)',
              textDecoration: 'none',
              transition:     'all 0.32s cubic-bezier(0.34,1.56,0.64,1)',
              position:       'relative',
              flexShrink:     0,
            }}
          >
            <span className="fab-pulse fab-pulse-green" />
            <svg width="29" height="29" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>

        {/* ── Chat Bot button (bottom) ── */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span className="fab-label">Live Chat</span>
          <button
            onClick={() => setChatOpen((o) => !o)}
            className="fab fab-chat"
            title="Chat with us"
            style={{
              width:          56,
              height:         56,
              borderRadius:   18,
              background:     chatOpen
                ? 'linear-gradient(145deg,#B8960C,#D4AF37)'
                : 'linear-gradient(145deg,#D4AF37,#F5E27A)',
              border:         'none',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      chatOpen
                ? '0 6px 26px rgba(184,150,12,0.55)'
                : '0 6px 26px rgba(212,175,55,0.52)',
              cursor:         'pointer',
              transition:     'all 0.32s cubic-bezier(0.34,1.56,0.64,1)',
              position:       'relative',
              flexShrink:     0,
            }}
          >
            {!chatOpen && <span className="fab-pulse fab-pulse-gold" />}
            <span style={{
              transition:     'transform 0.3s ease',
              transform:      chatOpen ? 'rotate(15deg) scale(0.88)' : 'rotate(0) scale(1)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              {chatOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#0A192F" strokeWidth="2.8" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="#0A192F"/>
                  <circle cx="8.5"  cy="11" r="1.3" fill="#D4AF37"/>
                  <circle cx="12"   cy="11" r="1.3" fill="#D4AF37"/>
                  <circle cx="15.5" cy="11" r="1.3" fill="#D4AF37"/>
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* ── CHATBOT PANEL — fixed, bottom-right, above FABs ── */}
      <div
        style={{
          position:             'fixed',
          bottom:               160,           /* sits just above the two FAB buttons */
          right:                24,
          zIndex:               998,
          width:                360,
          maxWidth:             'calc(100vw - 48px)',
          maxHeight:            'calc(100vh - 180px)', /* never taller than viewport */
          borderRadius:         20,
          overflow:             'hidden',
          display:              'flex',
          flexDirection:        'column',
          background:           'linear-gradient(160deg,rgba(6,14,30,0.98) 0%,rgba(10,22,46,0.98) 100%)',
          border:               '1px solid rgba(212,175,55,0.25)',
          boxShadow:            chatOpen
            ? '0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,55,0.1)'
            : '0 8px 30px rgba(0,0,0,0.3)',
          backdropFilter:       'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          /* ✅ key fix: origin bottom-right so it scales up from the FAB */
          transformOrigin:      'bottom right',
          transform:            chatOpen ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(16px)',
          opacity:              chatOpen ? 1 : 0,
          pointerEvents:        chatOpen ? 'auto' : 'none',
          transition:           'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          flexShrink:   0,
          padding:      '15px 18px',
          background:   'linear-gradient(135deg,rgba(212,175,55,0.16) 0%,rgba(184,150,12,0.06) 100%)',
          borderBottom: '1px solid rgba(212,175,55,0.18)',
          display:      'flex',
          alignItems:   'center',
          gap:          12,
        }}>
          <div style={{
            width:          40,
            height:         40,
            borderRadius:   13,
            background:     'linear-gradient(135deg,#D4AF37,#F5E27A)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
            boxShadow:      '0 4px 16px rgba(212,175,55,0.45)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8"  r="3.5"  fill="#0A192F"/>
              <rect   x="11" y="12"  width="2" height="5" rx="1" fill="#0A192F"/>
              <circle cx="12" cy="12" r="10" stroke="#0A192F" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ color: '#F5E27A', fontFamily: '"Lato",sans-serif', fontSize: '0.86rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              Bigway Assistant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.75)', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', fontFamily: '"Lato",sans-serif', letterSpacing: '0.04em' }}>
                Online · Replies instantly
              </span>
            </div>
          </div>

          <button
            onClick={() => setChatOpen(false)}
            className="chat-close-btn"
            style={{
              background:     'rgba(255,255,255,0.07)',
              border:         '1px solid rgba(255,255,255,0.1)',
              borderRadius:   9,
              width:          32,
              height:         32,
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          'rgba(255,255,255,0.55)',
              fontSize:       '1rem',
              transition:     'all 0.2s ease',
              flexShrink:     0,
            }}
          >✕</button>
        </div>

        {/* Messages — scrollable, flex-1 so it fills remaining space */}
        <div
          className="chat-scroll"
          style={{
            flex:          1,
            overflowY:     'auto',
            padding:       '16px 14px',
            display:       'flex',
            flexDirection: 'column',
            gap:           10,
            minHeight:     0,   /* critical for flex scroll */
          }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth:     '82%',
                padding:      '10px 14px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                background:   msg.role === 'user'
                  ? 'linear-gradient(135deg,#D4AF37,#F5E27A)'
                  : 'rgba(255,255,255,0.07)',
                border:       msg.role === 'user' ? 'none' : '1px solid rgba(212,175,55,0.15)',
                color:        msg.role === 'user' ? '#0A192F' : 'rgba(255,255,255,0.88)',
                fontFamily:   '"Lato",sans-serif',
                fontSize:     '0.8rem',
                fontWeight:   msg.role === 'user' ? 700 : 400,
                lineHeight:   1.6,
                boxShadow:    msg.role === 'user' ? '0 4px 16px rgba(212,175,55,0.28)' : 'none',
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding:      '12px 16px',
                borderRadius: '4px 16px 16px 16px',
                background:   'rgba(255,255,255,0.07)',
                border:       '1px solid rgba(212,175,55,0.15)',
                display:      'flex',
                gap:          5,
                alignItems:   'center',
              }}>
                {[0,1,2].map((d) => (
                  <span key={d} className="typing-dot" style={{ animationDelay: `${d * 0.18}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Q&A — fixed at bottom of panel */}
        {showHints && (
          <div style={{
            flexShrink:   0,
            padding:      '10px 14px 16px',
            borderTop:    '1px solid rgba(212,175,55,0.12)',
          }}>
            <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.35)', fontFamily: '"Lato",sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Quick questions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {QA.slice(0, 4).map((qa, i) => (
                <button
                  key={i}
                  onClick={() => handleQuestion(qa)}
                  className="chat-hint-btn"
                  style={{
                    background:    'rgba(212,175,55,0.06)',
                    border:        '1px solid rgba(212,175,55,0.18)',
                    borderRadius:  9,
                    padding:       '9px 12px',
                    color:         'rgba(255,255,255,0.75)',
                    fontFamily:    '"Lato",sans-serif',
                    fontSize:      '0.73rem',
                    fontWeight:    500,
                    textAlign:     'left',
                    cursor:        'pointer',
                    letterSpacing: '0.02em',
                    lineHeight:    1.45,
                    transition:    'all 0.2s ease',
                  }}
                >
                  {qa.q}
                </button>
              ))}
              <button
                className="chat-hint-btn"
                onClick={() => {
                  const pool = QA.slice(4);
                  handleQuestion(pool[Math.floor(Math.random() * pool.length)]);
                }}
                style={{
                  background:    'transparent',
                  border:        '1px dashed rgba(212,175,55,0.22)',
                  borderRadius:  9,
                  padding:       '8px 12px',
                  color:         'rgba(212,175,55,0.6)',
                  fontFamily:    '"Lato",sans-serif',
                  fontSize:      '0.7rem',
                  fontWeight:    600,
                  textAlign:     'center',
                  cursor:        'pointer',
                  letterSpacing: '0.07em',
                  transition:    'all 0.2s ease',
                }}
              >
                ✦ More questions →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Scoped Styles ─────────────────────────────────────────────── */}
      <style>{`
        .chat-scroll::-webkit-scrollbar       { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.25); border-radius: 99px; }

        .chat-close-btn:hover { background: rgba(255,255,255,0.14) !important; color: #fff !important; }

        .typing-dot {
          display: inline-block; width: 7px; height: 7px;
          border-radius: 50%; background: rgba(212,175,55,0.75);
          animation: typing-bounce 1s ease-in-out infinite;
        }
        @keyframes typing-bounce {
          0%,80%,100% { transform: translateY(0);   opacity: 0.45; }
          40%         { transform: translateY(-6px); opacity: 1;    }
        }

        .chat-hint-btn:hover {
          background:   rgba(212,175,55,0.14) !important;
          border-color: rgba(212,175,55,0.42) !important;
          color:        #F5E27A               !important;
        }

        /* FAB hover */
        .fab-whatsapp:hover {
          transform:  translateY(-5px) scale(1.09) !important;
          box-shadow: 0 14px 38px rgba(37,211,102,0.65) !important;
        }
        .fab-chat:hover {
          transform:  translateY(-5px) scale(1.09) !important;
          box-shadow: 0 14px 38px rgba(212,175,55,0.68) !important;
        }

        /* Tooltip label — slides in from right on parent hover */
        .fab-label {
          position:       absolute;
          right:          68px;
          top:            50%;
          transform:      translateY(-50%) translateX(6px);
          background:     rgba(6,14,30,0.92);
          border:         1px solid rgba(212,175,55,0.22);
          color:          rgba(255,255,255,0.85);
          font-family:    "Lato", sans-serif;
          font-size:      0.72rem;
          font-weight:    600;
          letter-spacing: 0.08em;
          padding:        5px 10px;
          border-radius:  8px;
          white-space:    nowrap;
          opacity:        0;
          pointer-events: none;
          transition:     opacity 0.22s ease, transform 0.22s ease;
          backdrop-filter: blur(12px);
        }
        div:hover > .fab-label {
          opacity:   1;
          transform: translateY(-50%) translateX(0);
        }

        /* Pulse rings */
        .fab-pulse {
          position: absolute; inset: -3px; border-radius: 21px;
          pointer-events: none;
          animation: pulse-ring 2.6s ease-out infinite;
        }
        .fab-pulse-green { border: 2px solid rgba(37,211,102,0.65); }
        .fab-pulse-gold  { border: 2px solid rgba(212,175,55,0.65); }

        @keyframes pulse-ring {
          0%   { transform: scale(1);    opacity: 0.85; }
          70%  { transform: scale(1.26); opacity: 0;    }
          100% { transform: scale(1.26); opacity: 0;    }
        }
      `}</style>
    </>
  );
}