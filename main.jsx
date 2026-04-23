import { h, render } from 'https://esm.sh/preact@10.19.2';
import { useState, useEffect, useRef } from 'https://esm.sh/preact@10.19.2/hooks';

/* ─── DESIGN TOKENS ──────────────────────────────────────── */
const T = {
  bg0: '#0e0e0e',
  bg1: '#121212',
  bg2: '#1a1a1a',
  bg3: '#222222',
  border: '#2a2a2a',
  orange: '#ff6200',
  orangeDim: '#cc4e00',
  orangeGlow: 'rgba(255,98,0,0.18)',
  text: '#e8e8e8',
  muted: '#888',
  mono: "'Roboto Mono', monospace",
  head: "'Montserrat', sans-serif",
};

/* ─── SCOPED STYLES ──────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Roboto+Mono:wght@400;500;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: ${T.bg0};
      color: ${T.text};
      font-family: ${T.head};
      overflow-x: hidden;
    }

    ::selection { background: ${T.orange}; color: #000; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${T.bg1}; }
    ::-webkit-scrollbar-thumb { background: ${T.orange}; }

    /* NAVBAR */
    .nav-root {
      position: sticky;
      top: 0;
      z-index: 999;
      background: rgba(14,14,14,0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid ${T.border};
      padding: 0 2rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      font-family: ${T.head};
      font-weight: 900;
      font-size: 1.35rem;
      letter-spacing: 0.12em;
      color: ${T.orange};
      text-decoration: none;
      text-transform: uppercase;
    }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a {
      font-family: ${T.head};
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${T.muted};
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: ${T.text}; }
    .btn-orange {
      background: ${T.orange};
      color: #000;
      border: none;
      padding: 0.6rem 1.4rem;
      font-family: ${T.head};
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    }
    .btn-orange:hover {
      background: #ff8a00;
      box-shadow: 0 0 20px ${T.orangeGlow};
    }
    .btn-outline {
      background: transparent;
      color: ${T.orange};
      border: 1px solid ${T.orange};
      padding: 0.6rem 1.4rem;
      font-family: ${T.head};
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-outline:hover { background: ${T.orangeGlow}; }

    /* HERO */
    .hero {
      position: relative;
      min-height: 92vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 6rem 2rem 4rem;
    }
    .hero-grid-bg {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,98,0,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,98,0,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }
    .hero-glow {
      position: absolute;
      top: -20%;
      right: -10%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255,98,0,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-inner { position: relative; max-width: 900px; }
    .hero-label {
      font-family: ${T.mono};
      font-size: 0.72rem;
      color: ${T.orange};
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .hero-label::before {
      content: '';
      display: block;
      width: 32px;
      height: 1px;
      background: ${T.orange};
    }
    .hero-h1 {
      font-family: ${T.head};
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 900;
      line-height: 0.9;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin-bottom: 1.5rem;
    }
    .hero-h1 span { color: ${T.orange}; }
    .hero-sub {
      font-size: 1rem;
      color: ${T.muted};
      max-width: 520px;
      line-height: 1.7;
      margin-bottom: 2.5rem;
      font-weight: 400;
    }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .hero-stat-row {
      position: absolute;
      bottom: 3rem;
      right: 2rem;
      display: flex;
      gap: 3rem;
    }
    .hero-stat-item { text-align: right; }
    .hero-stat-value {
      font-family: ${T.mono};
      font-size: 1.8rem;
      font-weight: 700;
      color: ${T.orange};
    }
    .hero-stat-label {
      font-size: 0.68rem;
      color: ${T.muted};
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 0.15rem;
    }

    /* SECTION COMMON */
    .section { padding: 6rem 2rem; }
    .section-label {
      font-family: ${T.mono};
      font-size: 0.68rem;
      color: ${T.orange};
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }
    .section-title {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.01em;
      margin-bottom: 0.5rem;
    }
    .section-title em { color: ${T.orange}; font-style: normal; }
    .section-sub {
      color: ${T.muted};
      font-size: 0.9rem;
      margin-bottom: 3rem;
      max-width: 500px;
    }
    .divider-line {
      width: 48px;
      height: 2px;
      background: ${T.orange};
      margin: 1rem 0 2rem;
    }

    /* FLIP CARDS */
    .flip-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .flip-card {
      height: 380px;
      perspective: 1200px;
      cursor: pointer;
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .flip-card:hover .flip-card-inner,
    .flip-card.flipped .flip-card-inner {
      transform: rotateY(180deg);
    }
    .flip-front, .flip-back {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 1px solid ${T.border};
    }
    .flip-front {
      background: ${T.bg2};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
    }
    .flip-front-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${T.orangeGlow};
      border: 1px solid rgba(255,98,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${T.orange};
    }
    .flip-front-title {
      font-size: 1.2rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    .flip-front-hint {
      font-family: ${T.mono};
      font-size: 0.65rem;
      color: ${T.muted};
      letter-spacing: 0.1em;
    }
    .flip-back {
      background: ${T.bg3};
      transform: rotateY(180deg);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-top: 2px solid ${T.orange};
    }
    .flip-back-title {
      font-family: ${T.mono};
      font-size: 0.7rem;
      color: ${T.orange};
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }
    .flip-back-specs {
      font-family: ${T.mono};
      font-size: 0.78rem;
      color: ${T.muted};
      line-height: 2;
    }
    .flip-back-specs span { color: ${T.text}; }
    .flip-back-price {
      font-family: ${T.mono};
      font-size: 1.1rem;
      font-weight: 700;
      color: ${T.orange};
      border-top: 1px solid ${T.border};
      padding-top: 1rem;
      margin-top: 1rem;
    }

    /* TESTIMONIALS BENTO */
    .bento-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: auto auto;
      gap: 1rem;
    }
    .bento-card {
      background: ${T.bg2};
      border: 1px solid ${T.border};
      padding: 1.75rem;
      position: relative;
      overflow: hidden;
    }
    .bento-card::before {
      content: '"';
      position: absolute;
      top: -0.5rem;
      left: 1.25rem;
      font-size: 6rem;
      color: ${T.orange};
      opacity: 0.08;
      font-family: Georgia, serif;
      line-height: 1;
    }
    .bento-card.featured {
      grid-row: span 2;
      border-left: 2px solid ${T.orange};
    }
    .bento-quote {
      font-size: 0.9rem;
      line-height: 1.75;
      color: ${T.text};
      margin-bottom: 1.25rem;
    }
    .bento-rider {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .bento-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${T.orange}, ${T.orangeDim});
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: #000;
    }
    .bento-name { font-weight: 700; font-size: 0.82rem; }
    .bento-sub {
      font-family: ${T.mono};
      font-size: 0.65rem;
      color: ${T.muted};
    }

    /* METRICS */
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: ${T.border};
      border: 1px solid ${T.border};
      margin-top: 3rem;
    }
    .metric-cell {
      background: ${T.bg2};
      padding: 2.5rem 2rem;
      text-align: center;
    }
    .metric-value {
      font-family: ${T.mono};
      font-size: 3rem;
      font-weight: 700;
      color: ${T.orange};
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    .metric-label {
      font-size: 0.72rem;
      color: ${T.muted};
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    /* GALLERY */
    .gallery-masonry {
      columns: 3;
      column-gap: 1rem;
    }
    @media (max-width: 768px) { .gallery-masonry { columns: 2; } }
    @media (max-width: 480px) { .gallery-masonry { columns: 1; } }
    .gallery-item {
      break-inside: avoid;
      margin-bottom: 1rem;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    .gallery-item img {
      width: 100%;
      display: block;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      filter: grayscale(20%);
    }
    .gallery-item:hover img { transform: scale(1.06); filter: grayscale(0%); }
    .gallery-item-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      align-items: flex-end;
      padding: 1rem;
    }
    .gallery-item:hover .gallery-item-overlay { opacity: 1; }
    .gallery-item-label {
      font-family: ${T.mono};
      font-size: 0.7rem;
      color: ${T.orange};
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    /* LIGHTBOX */
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    .lightbox-content { position: relative; max-width: 90vw; max-height: 90vh; }
    .lightbox-content img { max-width: 90vw; max-height: 85vh; object-fit: contain; display: block; }
    .lightbox-close {
      position: absolute;
      top: -2rem;
      right: 0;
      background: none;
      border: none;
      color: ${T.orange};
      font-size: 1.5rem;
      cursor: pointer;
      font-family: ${T.mono};
    }
    .lightbox-caption {
      font-family: ${T.mono};
      font-size: 0.72rem;
      color: ${T.muted};
      text-align: center;
      margin-top: 0.75rem;
      letter-spacing: 0.1em;
    }

    /* TERMINAL CHAT */
    .contact-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
    .terminal-wrap {
      background: #0a0a0a;
      border: 1px solid ${T.border};
      border-top: 2px solid ${T.orange};
      overflow: hidden;
    }
    .terminal-header {
      background: ${T.bg2};
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid ${T.border};
    }
    .terminal-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .terminal-title {
      font-family: ${T.mono};
      font-size: 0.68rem;
      color: ${T.muted};
      margin-left: 0.5rem;
      letter-spacing: 0.1em;
    }
    .terminal-progress-bar {
      height: 2px;
      background: ${T.border};
      position: relative;
    }
    .terminal-progress-fill {
      height: 100%;
      background: ${T.orange};
      transition: width 0.4s ease;
      box-shadow: 0 0 8px ${T.orange};
    }
    .terminal-messages {
      padding: 1.25rem;
      min-height: 300px;
      max-height: 350px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      font-family: ${T.mono};
    }
    .terminal-messages::-webkit-scrollbar { width: 2px; }
    .terminal-messages::-webkit-scrollbar-thumb { background: ${T.orange}; }
    .msg-system {
      font-size: 0.72rem;
      color: ${T.orange};
    }
    .msg-system::before { content: '> '; }
    .msg-user {
      font-size: 0.75rem;
      color: #00e5ff;
      align-self: flex-end;
    }
    .msg-user::before { content: '$ '; }
    .msg-data {
      font-size: 0.7rem;
      color: #4caf50;
    }
    .msg-data::before { content: '// '; }
    .terminal-input-row {
      border-top: 1px solid ${T.border};
      padding: 1rem 1.25rem;
      display: flex;
      gap: 0.75rem;
    }
    .terminal-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-family: ${T.mono};
      font-size: 0.8rem;
      color: ${T.text};
      caret-color: ${T.orange};
    }
    .terminal-input::placeholder { color: ${T.muted}; }
    .terminal-send {
      background: ${T.orange};
      border: none;
      color: #000;
      padding: 0.4rem 0.9rem;
      font-family: ${T.mono};
      font-size: 0.7rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.08em;
      transition: background 0.2s;
    }
    .terminal-send:hover { background: #ff8a00; }
    .terminal-options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding: 0 1.25rem 1.25rem;
    }
    .terminal-option {
      font-family: ${T.mono};
      font-size: 0.68rem;
      background: transparent;
      border: 1px solid ${T.border};
      color: ${T.muted};
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.06em;
    }
    .terminal-option:hover {
      border-color: ${T.orange};
      color: ${T.orange};
    }

    /* WORKSHOP INFO */
    .info-block {
      background: ${T.bg2};
      border: 1px solid ${T.border};
      padding: 2rem;
    }
    .info-row {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .info-item { flex: 1; min-width: 130px; }
    .info-item-label {
      font-family: ${T.mono};
      font-size: 0.62rem;
      color: ${T.orange};
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .info-item-value {
      font-size: 0.85rem;
      color: ${T.text};
      line-height: 1.6;
    }
    .info-item-value span {
      font-family: ${T.mono};
      font-size: 0.78rem;
      color: ${T.muted};
    }
    .map-placeholder {
      background: ${T.bg3};
      border: 1px dashed ${T.border};
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: border-color 0.2s;
      margin-top: 1.5rem;
    }
    .map-placeholder:hover { border-color: ${T.orange}; }
    .map-placeholder-label {
      font-family: ${T.mono};
      font-size: 0.7rem;
      color: ${T.muted};
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .contact-btns {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }
    .contact-btn {
      flex: 1;
      padding: 0.7rem;
      text-align: center;
      font-family: ${T.mono};
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    .contact-btn.whatsapp { background: #25d366; color: #000; }
    .contact-btn.email { background: ${T.bg3}; color: ${T.text}; border: 1px solid ${T.border}; }
    .contact-btn.email:hover { border-color: ${T.orange}; color: ${T.orange}; }

    /* MODAL */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.88);
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    .modal-box {
      background: ${T.bg1};
      border: 1px solid ${T.border};
      border-top: 2px solid ${T.orange};
      width: 100%;
      max-width: 520px;
      padding: 2rem;
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: ${T.muted};
      cursor: pointer;
      font-size: 1.2rem;
      transition: color 0.2s;
    }
    .modal-close:hover { color: ${T.orange}; }
    .modal-step-label {
      font-family: ${T.mono};
      font-size: 0.65rem;
      color: ${T.orange};
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .modal-title {
      font-size: 1.3rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
    }
    .modal-sub {
      font-size: 0.8rem;
      color: ${T.muted};
      margin-bottom: 2rem;
    }
    .modal-stepper {
      display: flex;
      gap: 4px;
      margin-bottom: 2rem;
    }
    .modal-step-dot {
      flex: 1;
      height: 3px;
      background: ${T.border};
      transition: background 0.3s;
    }
    .modal-step-dot.active { background: ${T.orange}; }
    .brand-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .brand-btn {
      background: ${T.bg2};
      border: 1px solid ${T.border};
      color: ${T.text};
      padding: 0.9rem;
      text-align: center;
      font-family: ${T.head};
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      cursor: pointer;
      transition: all 0.15s;
      text-transform: uppercase;
    }
    .brand-btn:hover, .brand-btn.selected {
      border-color: ${T.orange};
      color: ${T.orange};
      background: ${T.orangeGlow};
    }
    .modal-input {
      width: 100%;
      background: ${T.bg2};
      border: 1px solid ${T.border};
      color: ${T.text};
      padding: 0.85rem 1rem;
      font-family: ${T.mono};
      font-size: 0.82rem;
      outline: none;
      transition: border-color 0.2s;
      margin-bottom: 0.75rem;
    }
    .modal-input:focus { border-color: ${T.orange}; }
    .modal-input::placeholder { color: ${T.muted}; }
    .modal-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
    }
    .btn-back {
      background: none;
      border: 1px solid ${T.border};
      color: ${T.muted};
      padding: 0.6rem 1.2rem;
      font-family: ${T.head};
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-back:hover { border-color: ${T.muted}; color: ${T.text}; }

    /* FOOTER */
    .footer {
      background: ${T.bg1};
      border-top: 1px solid ${T.border};
      padding: 4rem 2rem 2rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
    }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
    .footer-col-title {
      font-family: ${T.mono};
      font-size: 0.65rem;
      color: ${T.orange};
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .footer-links a {
      font-size: 0.82rem;
      color: ${T.muted};
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: ${T.orange}; }
    .footer-social { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .social-btn {
      width: 36px; height: 36px;
      border: 1px solid ${T.border};
      background: ${T.bg2};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${T.muted};
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .social-btn:hover { border-color: ${T.orange}; color: ${T.orange}; }
    .newsletter-input-row {
      display: flex;
      margin-top: 0.5rem;
    }
    .newsletter-input {
      flex: 1;
      background: ${T.bg3};
      border: 1px solid ${T.border};
      border-right: none;
      color: ${T.text};
      padding: 0.65rem 0.9rem;
      font-family: ${T.mono};
      font-size: 0.75rem;
      outline: none;
    }
    .newsletter-input::placeholder { color: ${T.muted}; }
    .newsletter-btn {
      background: ${T.orange};
      border: none;
      color: #000;
      padding: 0.65rem 1rem;
      font-family: ${T.mono};
      font-size: 0.7rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.06em;
      transition: background 0.2s;
    }
    .newsletter-btn:hover { background: #ff8a00; }
    .footer-bottom {
      border-top: 1px solid ${T.border};
      padding-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .footer-copy {
      font-family: ${T.mono};
      font-size: 0.68rem;
      color: ${T.muted};
      letter-spacing: 0.08em;
    }
    .footer-logo-mark {
      font-family: ${T.head};
      font-weight: 900;
      font-size: 0.9rem;
      color: ${T.orange};
      letter-spacing: 0.12em;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    .cursor-blink {
      display: inline-block;
      width: 7px;
      height: 13px;
      background: ${T.orange};
      margin-left: 2px;
      animation: blink 1s step-end infinite;
      vertical-align: text-bottom;
    }
    .animate-up { animation: slideUp 0.5s ease both; }

    .services-section { background: ${T.bg1}; }
    .testimonials-section { background: ${T.bg0}; }
    .gallery-section { background: ${T.bg2}; }
    .contact-section { background: ${T.bg1}; }

    .orange-text { color: ${T.orange}; }
    .mono-text { font-family: ${T.mono}; }
  `}</style>
);

/* ─── SVG ICONS (inlined) ───────────────────────────────── */
const IconWrench = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);
const IconGauge = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10"/>
    <path d="M12 12 18 6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconDisc = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 9v-6M12 21v-6M9 12H3M21 12h-6"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconRadar = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M5.5 5.5A8 8 0 0 1 19.5 19.5"/>
    <path d="M2 2a14 14 0 0 1 20 20"/>
    <circle cx="12" cy="12" r="3"/>
    <circle cx="12" cy="12" r="0.5" fill="currentColor"/>
  </svg>
);
const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconZoomIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);

/* ─── COMPONENTS ─────────────────────────────────────────── */

function Navbar({ onBooking }) {
  return (
    <nav class="nav-root">
      <a class="nav-logo" href="#">MOTOAPP</a>
      <ul class="nav-links">
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#taller">El Taller</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
      <button class="btn-orange" onClick={onBooking}>RESERVAR CITA</button>
    </nav>
  );
}

function Hero({ onBooking }) {
  return (
    <section class="hero">
      <div class="hero-grid-bg" />
      <div class="hero-glow" />
      <div class="hero-inner animate-up">
        <div class="hero-label">Neiva, Huila — Colombia</div>
        <h1 class="hero-h1">
          PRECISIÓN.<br/>
          <span>VELOCIDAD.</span><br/>
          DOMINIO.
        </h1>
        <p class="hero-sub">
          Ingeniería de alto cilindraje para verdaderos entusiastas. Telemetría avanzada y tuning de élite en el corazón del sur de Colombia.
        </p>
        <div class="hero-actions">
          <button class="btn-orange" onClick={onBooking}>AGENDAR SERVICIO</button>
          <a href="#taller"><button class="btn-outline">VER ESPECIFICACIONES</button></a>
        </div>
      </div>
      <div class="hero-stat-row">
        <div class="hero-stat-item">
          <div class="hero-stat-value">+500</div>
          <div class="hero-stat-label">Mapeos</div>
        </div>
        <div class="hero-stat-item">
          <div class="hero-stat-value">15</div>
          <div class="hero-stat-label">Años</div>
        </div>
        <div class="hero-stat-item">
          <div class="hero-stat-value">300+</div>
          <div class="hero-stat-label">km/h</div>
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    icon: <IconWrench />,
    title: 'Mantenimiento',
    hint: '// preventive & corrective',
    specs: [
      ['Intervalo', '5,000 km'],
      ['Aceite', 'Sintético 10W-40'],
      ['Filtros', 'K&N / OEM'],
      ['Sincronización', 'Carburadores / TBI'],
      ['Diagnóstico', 'ECU Scan'],
    ],
    base: '$180,000 COP',
  },
  {
    icon: <IconGauge />,
    title: 'Tuning',
    hint: '// performance mapping',
    specs: [
      ['ECU', 'Remap avanzado'],
      ['Potencia', '+15–25% torque'],
      ['Mapeo', 'Dyno + telemetría'],
      ['Escape', 'Full system'],
      ['Filtro', 'Aire de alto flujo'],
    ],
    base: '$350,000 COP',
  },
  {
    icon: <IconDisc />,
    title: 'Frenos',
    hint: '// brake engineering',
    specs: [
      ['Pastillas', 'Ferodo / Brembo'],
      ['Discos', 'Flotantes / sólidos'],
      ['Líquido', 'DOT 5.1 racing'],
      ['Caliper', 'Overhaul completo'],
      ['ABS', 'Calibración'], 
    ],
    base: '$220,000 COP',
  },
];

function FlipCard({ service }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div class={`flip-card${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
      <div class="flip-card-inner">
        <div class="flip-front">
          <div class="flip-front-icon">{service.icon}</div>
          <div class="flip-front-title">{service.title}</div>
          <div class="flip-front-hint">{service.hint}</div>
        </div>
        <div class="flip-back">
          <div>
            <div class="flip-back-title">ESPECIFICACIONES // {service.title.toUpperCase()}</div>
            <div class="flip-back-specs">
              {service.specs.map(([k, v]) => (
                <div key={k}>{k}: <span>{v}</span></div>
              ))}
            </div>
          </div>
          <div class="flip-back-price">Base: {service.base}</div>
        </div>
      </div>
    </div>
  );
}

function Servicios() {
  return (
    <section class="section services-section" id="servicios">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div class="section-label">// Capacidades del taller</div>
        <h2 class="section-title">NUESTROS <em>SERVICIOS</em></h2>
        <div class="divider-line" />
        <p class="section-sub">Precisión mecánica y telemetría avanzada. Explorando los límites del rendimiento en el corazón de Neiva.</p>
        <div class="flip-grid">
          {SERVICES.map(s => <FlipCard key={s.title} service={s} />)}
        </div>
      </div>
    </section>
  );
}

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return [count, ref];
}

function MetricCell({ prefix = '', value, suffix = '', label }) {
  const [count, ref] = useCountUp(value);
  return (
    <div class="metric-cell" ref={ref}>
      <div class="metric-value">{prefix}{count}{suffix}</div>
      <div class="metric-label">{label}</div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote: 'El mejor tuning que le han hecho a mi moto. La respuesta en bajas revoluciones es increíble y la entrega de potencia lineal me quitó 2 segundos en el circuito.',
    name: 'Carlos M.',
    bike: 'Kawasaki ZX-10R',
    initial: 'C',
    featured: true,
  },
  {
    quote: 'Mantenimiento impecable. Salen de aquí sin que nada quede al aire. Confíen en el taller para moto.',
    name: 'Andrés G.',
    bike: 'Yamaha R6',
    initial: 'A',
  },
  {
    quote: 'No le dejo mi moto a nadie más. El dyno muestra exactamente lo que le hacen a tu moto, pura transparencia y resultados reales en cada marcha.',
    name: 'Felipe G.',
    bike: 'BMW S1000RR',
    initial: 'F',
  },
];

function Testimonials() {
  return (
    <section class="section testimonials-section">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div class="section-label">// Lo que dicen nuestros pilotos</div>
        <h2 class="section-title">PRUEBA SOCIAL: <em>TESTIMONIOS DEL PADDOCK</em></h2>
        <div class="divider-line" />
        <div class="bento-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} class={`bento-card${t.featured ? ' featured' : ''}`}>
              <p class="bento-quote">"{t.quote}"</p>
              <div class="bento-rider">
                <div class="bento-avatar">{t.initial}</div>
                <div>
                  <div class="bento-name">{t.name}</div>
                  <div class="bento-sub">{t.bike}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div class="metrics-row">
          <MetricCell prefix="+" value={500} label="Mapeos completados" />
          <MetricCell value={15} suffix=" Años" label="De experiencia técnica" />
          <MetricCell value={300} suffix="km/h+" label="Velocidad máxima validada" />
        </div>
      </div>
    </section>
  );
}

const GALLERY_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', label: 'BMW S1000RR — Tuning ECU' },
  { src: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80', label: 'Yamaha R1 — Suspensión' },
  { src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80', label: 'Kawasaki ZX-10R — Frenos Brembo' },
  { src: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80', label: 'Ducati V4 — Mapeo Dyno' },
  { src: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=600&q=80', label: 'Honda CBR — Mantenimiento' },
  { src: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=600&q=80', label: 'Suzuki GSX-R — Full Service' },
];

function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section class="section gallery-section" id="taller">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div class="section-label">// Proyectos recientes</div>
        <h2 class="section-title">EL <em>TALLER</em></h2>
        <div class="divider-line" />
        <p class="section-sub">Cada moto que entra al paddock recibe atención de nivel competitivo.</p>
        <div class="gallery-masonry">
          {GALLERY_ITEMS.map((item, i) => (
            <div key={i} class="gallery-item" onClick={() => setLightbox(item)}>
              <img src={item.src} alt={item.label} loading="lazy" />
              <div class="gallery-item-overlay">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconZoomIn />
                  <div class="gallery-item-label">{item.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {lightbox && (
        <div class="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div class="lightbox-content" onClick={e => e.stopPropagation()}>
            <button class="lightbox-close" onClick={() => setLightbox(null)}>✕ CERRAR</button>
            <img src={lightbox.src} alt={lightbox.label} />
            <div class="lightbox-caption">{lightbox.label}</div>
          </div>
        </div>
      )}
    </section>
  );
}

const CHAT_STEPS = [
  {
    key: 'name',
    prompt: 'CONEXIÓN INICIADA. Para comenzar, ¿cuál es tu nombre, piloto?',
    placeholder: 'Tu nombre...',
    options: null,
  },
  {
    key: 'service',
    prompt: 'Bienvenido al sistema MOTOAPP. Selecciona el servicio requerido:',
    placeholder: 'O escribe tu servicio...',
    options: ['MANTENIMIENTO', 'TUNING ECU', 'SISTEMA DE FRENOS', 'DIAGNÓSTICO'],
  },
  {
    key: 'issue',
    prompt: 'Describe brevemente el problema o requerimiento de tu moto:',
    placeholder: 'Detalla el síntoma o trabajo...',
    options: null,
  },
  {
    key: 'contact',
    prompt: 'Casi listo. ¿Cuál es tu número o email para confirmar la cita?',
    placeholder: 'Teléfono o email...',
    options: null,
  },
];

function TerminalChat() {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    { type: 'system', text: 'MOTOAPP TELEMETRÍA v2.4.1 — Sistema activo' },
    { type: 'system', text: CHAT_STEPS[0].prompt },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [completed, setCompleted] = useState(false);
  const [userData, setUserData] = useState({});
  const msgRef = useRef(null);

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [messages]);

  const send = (val) => {
    const value = val || inputVal.trim();
    if (!value) return;
    const currentStep = CHAT_STEPS[step];
    const newUserData = { ...userData, [currentStep.key]: value };
    setUserData(newUserData);

    const newMessages = [
      ...messages,
      { type: 'user', text: value },
    ];

    if (step < CHAT_STEPS.length - 1) {
      const nextStep = step + 1;
      newMessages.push({ type: 'data', text: `${currentStep.key.toUpperCase()} registrado: "${value}"` });
      newMessages.push({ type: 'system', text: CHAT_STEPS[nextStep].prompt });
      setStep(nextStep);
    } else {
      newMessages.push({ type: 'data', text: `TRANSMISIÓN COMPLETA — Datos recibidos` });
      newMessages.push({ type: 'system', text: `Confirmación enviada. Te contactamos pronto, ${newUserData.name}. ¡Al paddock!` });
      setCompleted(true);
    }

    setMessages(newMessages);
    setInputVal('');
  };

  const progress = ((step + (completed ? 1 : 0)) / CHAT_STEPS.length) * 100;

  return (
    <div class="terminal-wrap">
      <div class="terminal-header">
        <div class="terminal-dot" style={{ background: '#ff5f57' }} />
        <div class="terminal-dot" style={{ background: '#febc2e' }} />
        <div class="terminal-dot" style={{ background: '#28c840' }} />
        <div class="terminal-title">MOTOAPP_TELEMETRÍA — CANAL SEGURO</div>
      </div>
      <div class="terminal-progress-bar">
        <div class="terminal-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div class="terminal-messages" ref={msgRef}>
        {messages.map((m, i) => (
          <div key={i} class={`msg-${m.type}`}>{m.text}</div>
        ))}
        {!completed && <div class="cursor-blink" />}
      </div>
      {!completed && CHAT_STEPS[step].options && (
        <div class="terminal-options">
          {CHAT_STEPS[step].options.map(opt => (
            <button key={opt} class="terminal-option" onClick={() => send(opt)}>{opt}</button>
          ))}
        </div>
      )}
      {!completed && (
        <div class="terminal-input-row">
          <input
            class="terminal-input"
            value={inputVal}
            onInput={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={CHAT_STEPS[step].placeholder}
          />
          <button class="terminal-send" onClick={() => send()}>ENVIAR</button>
        </div>
      )}
    </div>
  );
}

function WorkshopInfo() {
  return (
    <div>
      <div class="info-block">
        <div class="info-row">
          <div class="info-item">
            <div class="info-item-label">
              <span style={{ color: T.orange, marginRight: '0.4rem' }}>◉</span>
              Coordenadas
            </div>
            <div class="info-item-value">
              Zona Industrial Sur<br/>
              <span>Calle 6 Sur #10-46</span><br/>
              Neiva, Huila
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">
              <span style={{ color: T.orange, marginRight: '0.4rem' }}>◎</span>
              Horario Operativo
            </div>
            <div class="info-item-value">
              <span>LUN–VIE</span>&nbsp; 08:00 – 18:00<br/>
              <span>SAB</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 08:00 – 14:00<br/>
              <span>DOM</span>&nbsp;&nbsp;&nbsp;&nbsp; Cerrado
            </div>
          </div>
        </div>
        <div class="contact-btns">
          <button class="contact-btn whatsapp">WhatsApp Directo</button>
          <button class="contact-btn email">Email Soporte</button>
        </div>
        <div class="map-placeholder">
          <div style={{ color: T.orange }}><IconRadar /></div>
          <div class="map-placeholder-label">Activar Radar de Ubicación</div>
          <div style={{ fontFamily: T.mono, fontSize: '0.62rem', color: T.muted }}>2.927° N, 75.282° W</div>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <section class="section contact-section" id="contacto">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div class="section-label">// Canal de comunicación directa</div>
        <h2 class="section-title">INICIA LA <em>TELEMETRÍA</em></h2>
        <div class="divider-line" />
        <p class="section-sub">Ponte en contacto con nuestro equipo de ingenieros para programar tu servicio o consultar sobre preparaciones específicas de alto rendimiento.</p>
        <div class="contact-grid">
          <TerminalChat />
          <WorkshopInfo />
        </div>
      </div>
    </section>
  );
}

/* ─── BOOKING MODAL ─────────────────────────────────────── */
const BRANDS = ['DUCATI', 'BMW', 'KTM', 'YAMAHA', 'TRIUMPH', 'SUZUKI', 'HONDA', 'KAWASAKI', 'OTRO'];
const MOTIVOS = ['MANTENIMIENTO PREVENTIVO', 'TUNING ECU / MAPEO', 'FRENOS', 'DIAGNÓSTICO', 'PREPARACIÓN CIRCUITO', 'OTRO'];

function BookingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ brand: '', motivo: '', fecha: '', nombre: '', telefono: '', modelo: '' });

  const update = (key, val) => setData(d => ({ ...d, [key]: val }));

  const steps = [
    { label: 'PASO 01', title: 'SELECCIONA LA MARCA', sub: 'Elige la marca de tu moto' },
    { label: 'PASO 02', title: 'MOTIVO DE INGRESO', sub: 'Define el tipo de servicio requerido' },
    { label: 'PASO 03', title: 'FECHA Y MODELO', sub: 'Agenda tu cita con nosotros' },
    { label: 'PASO 04', title: 'DATOS DEL PILOTO', sub: 'Información para confirmar tu reserva' },
  ];

  const canNext = () => {
    if (step === 0) return !!data.brand;
    if (step === 1) return !!data.motivo;
    if (step === 2) return !!data.fecha && !!data.modelo;
    if (step === 3) return !!data.nombre && !!data.telefono;
    return false;
  };

  const [done, setDone] = useState(false);

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal-box" onClick={e => e.stopPropagation()}>
        <button class="modal-close" onClick={onClose}><IconX /></button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: T.orange, fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
            <div class="modal-title">CITA CONFIRMADA</div>
            <p style={{ color: T.muted, fontSize: '0.85rem', marginTop: '0.75rem', fontFamily: T.mono }}>
              Recibirás confirmación en breve, {data.nombre}. ¡Nos vemos en el paddock!
            </p>
            <button class="btn-orange" style={{ marginTop: '1.5rem' }} onClick={onClose}>CERRAR</button>
          </div>
        ) : (
          <>
            <div class="modal-stepper">
              {steps.map((_, i) => (
                <div key={i} class={`modal-step-dot${i <= step ? ' active' : ''}`} />
              ))}
            </div>
            <div class="modal-step-label">{steps[step].label} / {steps.length}</div>
            <div class="modal-title">{steps[step].title}</div>
            <p class="modal-sub">{steps[step].sub}</p>

            {step === 0 && (
              <div class="brand-grid">
                {BRANDS.map(b => (
                  <button
                    key={b}
                    class={`brand-btn${data.brand === b ? ' selected' : ''}`}
                    onClick={() => update('brand', b)}
                  >{b}</button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {MOTIVOS.map(m => (
                  <button
                    key={m}
                    class={`brand-btn${data.motivo === m ? ' selected' : ''}`}
                    style={{ textAlign: 'left', padding: '0.85rem 1rem' }}
                    onClick={() => update('motivo', m)}
                  >{m}</button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div>
                <input
                  class="modal-input"
                  placeholder="Modelo y cilindraje (ej: BMW S1000RR 2022)"
                  value={data.modelo}
                  onInput={e => update('modelo', e.target.value)}
                />
                <input
                  class="modal-input"
                  type="date"
                  value={data.fecha}
                  onInput={e => update('fecha', e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <input
                  class="modal-input"
                  placeholder="Nombre completo"
                  value={data.nombre}
                  onInput={e => update('nombre', e.target.value)}
                />
                <input
                  class="modal-input"
                  placeholder="Teléfono o WhatsApp"
                  value={data.telefono}
                  onInput={e => update('telefono', e.target.value)}
                />
              </div>
            )}

            <div class="modal-actions">
              {step > 0
                ? <button class="btn-back" onClick={() => setStep(s => s - 1)}>← ATRÁS</button>
                : <div />
              }
              {step < steps.length - 1
                ? <button class="btn-orange" disabled={!canNext()} onClick={() => setStep(s => s + 1)} style={{ opacity: canNext() ? 1 : 0.4 }}>SIGUIENTE →</button>
                : <button class="btn-orange" disabled={!canNext()} onClick={() => setDone(true)} style={{ opacity: canNext() ? 1 : 0.4 }}>CONFIRMAR CITA</button>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer class="footer">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div class="footer-grid">
          <div>
            <div class="footer-col-title">MOTOAPP LAB</div>
            <ul class="footer-links">
              <li><a href="#">Servicios</a></li>
              <li><a href="#taller">El Taller</a></li>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="#">Blog Técnico</a></li>
            </ul>
          </div>
          <div>
            <div class="footer-col-title">LEGAL</div>
            <ul class="footer-links">
              <li><a href="#">Términos y Condiciones</a></li>
              <li><a href="#">Política de Privacidad</a></li>
              <li><a href="#">Garantía de Servicio</a></li>
            </ul>
          </div>
          <div>
            <div class="footer-col-title">REDES</div>
            <div class="footer-social">
              <div class="social-btn">IG</div>
              <div class="social-btn">FB</div>
              <div class="social-btn">YT</div>
              <div class="social-btn">TK</div>
            </div>
          </div>
          <div>
            <div class="footer-col-title">ÚNETE AL PADDOCK</div>
            <p style={{ fontSize: '0.78rem', color: T.muted, marginBottom: '0.75rem', lineHeight: 1.6 }}>
              Noticias técnicas, promociones y novedades del taller directo a tu inbox.
            </p>
            <div class="newsletter-input-row">
              <input
                class="newsletter-input"
                placeholder="tu@email.com"
                value={email}
                onInput={e => setEmail(e.target.value)}
              />
              <button class="newsletter-btn">→</button>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-copy">© 2025 MOTOAPP. Neiva, Huila — Colombia. Todos los derechos reservados.</div>
          <div class="footer-logo-mark">MOTOAPP</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────── */
function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <GlobalStyles />
      <Navbar onBooking={() => setShowModal(true)} />
      <Hero onBooking={() => setShowModal(true)} />
      <Servicios />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
      {showModal && <BookingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

render(<App />, document.getElementById('root'));
