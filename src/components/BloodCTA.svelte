<!--
  HeroBanner.svelte
  Replacement for the "fancy-banner-five" section.

  Setup:
  1. Save the attached horse illustration to: static/images/kurudhi-hero-horse.png
     (kurudhi-hero-horse.png is included alongside this file — just drop it in.)
  2. Drop this component wherever the old <section class="fancy-banner-five">
     lived (e.g. index.svelte), and update the two href values below if your
     actual routes differ:
       - "/blood-request" -> point this at your real Blood Request route
  3. No Bootstrap classes are used here — everything is self-contained, so it
     won't be affected by (or bleed into) other Bootstrap-based sections.
  4. Sample numbers (12,400+ Lives Saved, 3,200+ Active Donors, 12.4k, etc.)
     are placeholders — swap in real figures whenever you have them, or wire
     them to Firebase if you're already tracking these counts.
-->

<section class="kh-cta">
  <div class="kh-cta-ekg" aria-hidden="true">
    <svg class="kh-cta-ekg-track" viewBox="0 0 2400 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,40 L60,40 L75,10 L90,70 L105,15 L120,40 L300,40 L360,40 L375,10 L390,70 L405,15 L420,40 L600,40 L660,40 L675,10 L690,70 L705,15 L720,40 L900,40 L960,40 L975,10 L990,70 L1005,15 L1020,40 L1200,40 L1260,40 L1275,10 L1290,70 L1305,15 L1320,40 L1500,40 L1560,40 L1575,10 L1590,70 L1605,15 L1620,40 L1800,40 L1860,40 L1875,10 L1890,70 L1905,15 L1920,40 L2100,40 L2160,40 L2175,10 L2190,70 L2205,15 L2220,40 L2400,40" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  <div class="kh-cta-container">
    <span class="kh-cta-eyebrow">Right now, somewhere nearby</span>
    <h3 class="kh-cta-heading">Every drop carries a heartbeat.<br>Someone nearby needs it right now.</h3>
    <div class="kh-cta-actions">
      <a href="/register" class="kh-btn kh-btn-cta-primary">Register as a Donor</a>
      <a href="/blood-request" class="kh-btn kh-btn-cta-secondary">Request Blood</a>
    </div>
  </div>
</section>

<style>
  /* ============ HERO ============ */
  .kh-hero {
    position: relative;
    overflow: hidden;
    padding: 110px 24px 100px;
    background: linear-gradient(135deg, #1A1A1A 0%, #2B1014 55%, #3D0F1A 100%);
    font-family: 'Inter', sans-serif;
  }
  .kh-hero .kh-hero-watermark {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Baloo 2', sans-serif;
    font-size: clamp(120px, 22vw, 280px);
    font-weight: 700; color: #FFFFFF; opacity: 0.035;
    white-space: nowrap; pointer-events: none; user-select: none;
    letter-spacing: 4px;
  }
  .kh-hero .kh-hero-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .kh-hero .kh-hero-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 56px; align-items: center; }
  .kh-hero .kh-hero-content { animation: kh-fade-up 0.8s ease both; }

  .kh-hero .kh-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Baloo 2', sans-serif; font-weight: 600;
    font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase;
    color: #E8C9A0; background: rgba(232,201,160,0.1);
    border: 1px solid rgba(232,201,160,0.35);
    padding: 8px 16px; border-radius: 999px; margin-bottom: 24px;
  }
  .kh-hero .kh-hero-eyebrow-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #C41E3A;
    animation: kh-dot-pulse 1.8s infinite;
  }
  .kh-hero .kh-hero-heading {
    font-family: 'Poppins', sans-serif; font-weight: 700;
    font-size: clamp(2rem, 3.4vw, 2.7rem); line-height: 1.25;
    color: #FFFFFF; margin: 0 0 20px;
  }
  .kh-hero .kh-hero-heading-accent {
    color: #FF6B7A;
    background: linear-gradient(90deg, #FF6B7A, #E8C9A0);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .kh-hero .kh-hero-sub {
    font-size: 1.05rem; line-height: 1.75; color: rgba(255,255,255,0.72);
    max-width: 480px; margin: 0 0 36px;
  }
  .kh-hero .kh-hero-actions { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 44px; }

  .kh-hero .kh-btn, .kh-cta .kh-btn {
    position: relative; display: inline-flex; align-items: center; justify-content: center;
    gap: 10px; min-height: 52px; padding: 0 30px; border-radius: 999px;
    font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.98rem;
    text-decoration: none; cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.3s ease;
    white-space: nowrap;
  }
  .kh-hero .kh-btn:focus-visible, .kh-cta .kh-btn:focus-visible { outline: 3px solid #E8C9A0; outline-offset: 3px; }

  .kh-hero .kh-btn-primary { background: linear-gradient(135deg, #C41E3A, #8B1329); color: #fff; box-shadow: 0 8px 24px rgba(196,30,58,0.35); }
  .kh-hero .kh-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(196,30,58,0.5); }
  .kh-hero .kh-btn-primary:active { transform: translateY(0); }
  .kh-hero .kh-btn-pulse-ring {
    position: absolute; inset: 0; border-radius: 999px; border: 2px solid #C41E3A;
    animation: kh-heartbeat-ring 1.8s ease-out infinite; pointer-events: none;
  }
  .kh-hero .kh-btn-icon { flex-shrink: 0; }

  .kh-hero .kh-btn-secondary { background: transparent; color: #FFFFFF; border: 1.5px solid rgba(255,255,255,0.4); isolation: isolate; }
  .kh-hero .kh-btn-secondary::before {
    content: ''; position: absolute; inset: 0; border-radius: 999px;
    background: linear-gradient(135deg, #C41E3A, #8B1329);
    transform: scaleX(0); transform-origin: left; transition: transform 0.35s ease; z-index: -1;
  }
  .kh-hero .kh-btn-secondary:hover { border-color: transparent; }
  .kh-hero .kh-btn-secondary:hover::before { transform: scaleX(1); }
  .kh-hero .kh-btn-arrow { transition: transform 0.3s ease; }
  .kh-hero .kh-btn-secondary:hover .kh-btn-arrow { transform: translateX(4px); }

  .kh-hero .kh-hero-stats { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
  .kh-hero .kh-hero-stat { display: flex; flex-direction: column; }
  .kh-hero .kh-hero-stat strong { font-family: 'Poppins', sans-serif; font-size: 1.3rem; font-weight: 700; color: #fff; }
  .kh-hero .kh-hero-stat span { font-size: 0.8rem; color: rgba(255,255,255,0.55); }
  .kh-hero .kh-hero-stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.18); }

  .kh-hero .kh-hero-visual {
    position: relative; display: flex; align-items: center; justify-content: center;
    min-height: 440px; animation: kh-fade-up 1s ease 0.15s both;
  }
  .kh-hero .kh-hero-ring { position: absolute; width: min(420px, 90%); height: min(420px, 90%); animation: kh-rotate 30s linear infinite; }
  .kh-hero .kh-hero-blob {
    position: relative; width: min(360px, 78%); aspect-ratio: 1;
    border-radius: 48% 52% 55% 45% / 55% 45% 55% 45%;
    background: linear-gradient(150deg, #FFF5F5, #E8C9A0 120%);
    display: flex; align-items: flex-end; justify-content: center; overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.4), 0 30px 60px rgba(0,0,0,0.35);
  }
  .kh-hero .kh-hero-horse { width: 78%; height: auto; filter: drop-shadow(0 18px 24px rgba(0,0,0,0.35)); }

  .kh-hero .kh-hero-card {
    position: absolute; display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.97); border-radius: 16px; padding: 12px 16px;
    box-shadow: 0 14px 30px rgba(0,0,0,0.25); animation: kh-float 4s ease-in-out infinite;
  }
  .kh-hero .kh-hero-card-icon { font-size: 1.3rem; }
  .kh-hero .kh-hero-card div strong { display: block; font-family: 'Poppins', sans-serif; font-size: 0.95rem; color: #1A1A1A; }
  .kh-hero .kh-hero-card div span { font-size: 0.72rem; color: #6b6b6b; }
  .kh-hero .kh-hero-card-top { top: 6%; left: -6%; animation-delay: 0s; }
  .kh-hero .kh-hero-card-bottom { bottom: 8%; right: -8%; animation-delay: 1.4s; }

  @keyframes kh-fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes kh-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes kh-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes kh-dot-pulse {
    0% { box-shadow: 0 0 0 0 rgba(196,30,58,0.6); }
    70% { box-shadow: 0 0 0 8px rgba(196,30,58,0); }
    100% { box-shadow: 0 0 0 0 rgba(196,30,58,0); }
  }
  @keyframes kh-heartbeat-ring {
    0% { opacity: 0.7; transform: scale(1); }
    14% { opacity: 0.35; transform: scale(1.08); }
    28% { opacity: 0.6; transform: scale(1.02); }
    45% { opacity: 0; transform: scale(1.18); }
    100% { opacity: 0; transform: scale(1.18); }
  }

  /* ============ CTA BAND ============ */
  .kh-cta {
    position: relative; overflow: hidden; padding: 90px 24px;
    background: linear-gradient(120deg, #8B1329 0%, #C41E3A 55%, #7A0F24 100%);
    text-align: center;
    font-family: 'Inter', sans-serif;
  }
  .kh-cta .kh-cta-ekg { position: absolute; top: 22px; left: 0; width: 100%; height: 60px; overflow: hidden; opacity: 0.35; }
  .kh-cta .kh-cta-ekg-track { width: 2400px; height: 60px; animation: kh-ekg-scroll 7s linear infinite; }
  @keyframes kh-ekg-scroll { from { transform: translateX(0); } to { transform: translateX(-1200px); } }

  .kh-cta .kh-cta-container { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }
  .kh-cta .kh-cta-eyebrow {
    display: inline-block; font-family: 'Baloo 2', sans-serif; font-weight: 600;
    font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(255,255,255,0.85); margin-bottom: 18px;
  }
  .kh-cta .kh-cta-heading {
    font-family: 'Poppins', sans-serif; font-weight: 700;
    font-size: clamp(1.6rem, 3vw, 2.2rem); color: #fff; line-height: 1.4; margin: 0 0 36px;
  }
  .kh-cta .kh-cta-actions { display: flex; justify-content: center; gap: 18px; flex-wrap: wrap; }
  .kh-cta .kh-btn-cta-primary { background: #fff; color: #8B1329; }
  .kh-cta .kh-btn-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,0,0,0.25); }
  .kh-cta .kh-btn-cta-secondary { background: transparent; border: 1.5px solid rgba(255,255,255,0.6); color: #fff; }
  .kh-cta .kh-btn-cta-secondary:hover { background: rgba(255,255,255,0.15); }

  @media (max-width: 900px) {
    .kh-hero .kh-hero-grid { grid-template-columns: 1fr; text-align: center; }
    .kh-hero .kh-hero-sub { margin-left: auto; margin-right: auto; }
    .kh-hero .kh-hero-actions, .kh-hero .kh-hero-stats { justify-content: center; }
    .kh-hero .kh-hero-visual { margin-top: 40px; min-height: 360px; }
    .kh-hero .kh-hero-card-top { left: 2%; }
    .kh-hero .kh-hero-card-bottom { right: 2%; }
  }
  @media (max-width: 560px) {
    .kh-hero { padding: 70px 18px; }
    .kh-hero .kh-btn, .kh-cta .kh-btn { width: 100%; }
    .kh-hero .kh-hero-actions { flex-direction: column; }
    .kh-cta .kh-cta-actions { flex-direction: column; }
    .kh-hero .kh-hero-stat-divider { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .kh-hero .kh-hero-content, .kh-hero .kh-hero-visual, .kh-hero .kh-hero-ring, .kh-hero .kh-hero-card,
    .kh-hero .kh-btn-pulse-ring, .kh-hero .kh-hero-eyebrow-dot, .kh-cta .kh-cta-ekg-track { animation: none !important; }
  }
</style>
