"use client";
import React, { useState, useEffect } from "react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [visible, setVisible] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Only allow digits, max 10
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, phone: digits });

      if (digits.length > 0 && digits.length < 10) {
        setPhoneError("Enter a valid 10-digit Indian mobile number");
      } else {
        setPhoneError("");
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    console.log("Enquiry submitted:", {
      ...formData,
      phone: `+91${formData.phone}`,
    });
    onClose();
    setFormData({ name: "", email: "", phone: "", city: "" });
    setPhoneError("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Google Fonts - Poppins */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .eq-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 10, 22, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 999;
          transition: opacity 0.35s ease;
          opacity: ${visible ? 1 : 0};
        }

        .eq-modal {
          font-family: 'Poppins', sans-serif;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, ${visible ? "-50%" : "-42%"});
          opacity: ${visible ? 1 : 0};
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
          background: linear-gradient(160deg, #0B1D35 0%, #0D2040 60%, #0A1828 100%);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 28px;
          padding: 40px 36px 36px;
          max-width: 460px;
          width: 92%;
          z-index: 1000;
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(212, 175, 55, 0.12),
            inset 0 1px 0 rgba(212, 175, 55, 0.15);
          color: #fff;
        }

        /* Decorative glow orb */
        .eq-modal::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .eq-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: rgba(212, 175, 55, 0.7);
          font-size: 18px;
          cursor: pointer;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.25s;
          font-family: 'Poppins', sans-serif;
          line-height: 1;
        }
        .eq-close:hover {
          background: rgba(212, 175, 55, 0.18);
          color: #F5E27A;
          transform: rotate(90deg);
          border-color: rgba(212,175,55,0.5);
        }

        .eq-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .eq-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D4AF37;
          animation: eq-pulse 2s infinite;
        }
        @keyframes eq-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .eq-badge-text {
          font-family: 'Poppins', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #D4AF37;
          opacity: 0.8;
        }

        .eq-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.9rem;
          font-weight: 800;
          margin-bottom: 6px;
          background: linear-gradient(135deg, #F5E27A 0%, #D4AF37 50%, #C9A227 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          line-height: 1.2;
        }
        .eq-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          text-align: center;
          margin-bottom: 28px;
          font-weight: 400;
        }

        .eq-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent);
          margin-bottom: 28px;
        }

        .eq-form-group {
          margin-bottom: 20px;
        }
        .eq-label {
          display: block;
          margin-bottom: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(212, 175, 55, 0.9);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .eq-input-wrap {
          position: relative;
        }

        .eq-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          transition: all 0.25s;
        }
        .eq-input::placeholder {
          color: rgba(255,255,255,0.2);
          font-weight: 300;
        }
        .eq-input:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.6);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12), 0 0 20px rgba(212,175,55,0.05);
          background: rgba(255, 255, 255, 0.07);
        }

        /* Phone input with flag */
        .eq-phone-wrap {
          display: flex;
          align-items: stretch;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.25s;
        }
        .eq-phone-wrap:focus-within {
          border-color: rgba(212, 175, 55, 0.6);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12), 0 0 20px rgba(212,175,55,0.05);
          background: rgba(255, 255, 255, 0.07);
        }
        .eq-phone-prefix {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          border-right: 1px solid rgba(212,175,55,0.2);
          background: rgba(212,175,55,0.05);
          white-space: nowrap;
          user-select: none;
        }
        .eq-flag {
          font-size: 1.3rem;
          line-height: 1;
        }
        .eq-country-code {
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(212,175,55,0.9);
          letter-spacing: 0.03em;
        }
        .eq-phone-input {
          flex: 1;
          padding: 13px 16px;
          background: transparent;
          border: none;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 0.05em;
        }
        .eq-phone-input::placeholder {
          color: rgba(255,255,255,0.2);
          font-weight: 300;
          letter-spacing: normal;
        }
        .eq-phone-input:focus {
          outline: none;
        }

        .eq-phone-counter {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(212,175,55,0.5);
          pointer-events: none;
        }

        .eq-error {
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem;
          color: #FF6B6B;
          margin-top: 6px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .eq-error::before {
          content: '⚠';
          font-size: 0.7rem;
        }

        .eq-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .eq-submit {
          width: 100%;
          padding: 15px;
          margin-top: 8px;
          background: linear-gradient(135deg, #C9A227 0%, #F5E27A 50%, #D4AF37 100%);
          background-size: 200% auto;
          border: none;
          border-radius: 14px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0A192F;
          cursor: pointer;
          transition: all 0.35s;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.3);
          position: relative;
          overflow: hidden;
        }
        .eq-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 60%, transparent 80%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .eq-submit:hover::after {
          transform: translateX(100%);
        }
        .eq-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(212, 175, 55, 0.5);
          background-position: right center;
        }
        .eq-submit:active {
          transform: translateY(0);
        }

        .eq-privacy {
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
          text-align: center;
          margin-top: 14px;
          font-weight: 400;
        }
        .eq-privacy span {
          color: rgba(212,175,55,0.5);
        }
      `}</style>

      <div className="eq-overlay" onClick={onClose} />

      <div className="eq-modal">
        <button className="eq-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="eq-badge">
          <div className="eq-badge-dot" />
          <span className="eq-badge-text">Get in Touch</span>
          <div className="eq-badge-dot" />
        </div>

        <h2 className="eq-title">Enquiry Form</h2>
        <p className="eq-subtitle">We'll get back to you within 24 hours</p>

        <div className="eq-divider" />

        <form onSubmit={handleSubmit}>
          <div className="eq-row">
            <div className="eq-form-group">
              <label className="eq-label" htmlFor="name">Full Name</label>
              <input
                className="eq-input"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
              />
            </div>
            <div className="eq-form-group">
              <label className="eq-label" htmlFor="city">City</label>
              <input
                className="eq-input"
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                required
              />
            </div>
          </div>

          <div className="eq-form-group">
            <label className="eq-label" htmlFor="email">Email Address</label>
            <input
              className="eq-input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
              required
            />
          </div>

          <div className="eq-form-group">
            <label className="eq-label" htmlFor="phone">Mobile Number</label>
            <div style={{ position: "relative" }}>
              <div className="eq-phone-wrap">
                <div className="eq-phone-prefix">
                  <span className="eq-flag">🇮🇳</span>
                  <span className="eq-country-code">+91</span>
                </div>
                <input
                  className="eq-phone-input"
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98765 43210"
                  maxLength={10}
                  inputMode="numeric"
                  required
                />
                {formData.phone.length > 0 && (
                  <span className="eq-phone-counter">{formData.phone.length}/10</span>
                )}
              </div>
              {phoneError && <p className="eq-error">{phoneError}</p>}
            </div>
          </div>

          <button type="submit" className="eq-submit">
            Submit Enquiry →
          </button>

          <p className="eq-privacy">
            🔒 Your data is safe with us. We respect your <span>privacy</span>.
          </p>
        </form>
      </div>
    </>
  );
};

export default EnquiryModal;