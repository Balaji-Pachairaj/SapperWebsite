<script>
  let browserVersion = "";
  let browserLanguage = "";
  let osplatform = "";

  // Check if this code is executed on the client side
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent;
    browserVersion = userAgent.substring(userAgent.lastIndexOf(") ") + 2);
    browserLanguage = navigator.language;
    osplatform = navigator.platform;
  }

  let services = [
    { text: "Become a Donor", link: "/register" },
    { text: "Find Donor with pincode", link: "/donor/search-blood-donors-by-pincode" },
    { text: "Find Local Donor", link: "/donor/find-local-donor" },
    { text: "Donate", link: "/login" },
  ];

  let company = [
    { text: "Legal & Financials", link: "/legal" },
    { text: "Accessibility", link: "/accessibility" },
    { text: "Sitemap", link: "/sitemap" },
    { text: "Mission & Vision", link: "/mission-and-vision" },
    { text: "Programs", link: "/programs" },
  ];

  let support = [
    { text: "Privacy Notice", link: "/privacy" },
    { text: "Site Terms", link: "/site-terms" },
    { text: "Cookie Policy", link: "/cookie-policy" },
    { text: "Do Not Share My Data (DPDP)", link: "/cookie-policy" }, // Remove duplicate
  ];

  let newsletter = {
    title: "Newsletter",
    description: "Join & get important news regularly",
  };

  let bottomLinks = [
    { text: "Privacy & Terms.", link: "contact.html" },
    { text: "Contact Us", link: "contact.html" },
  ];

  let currentYear = new Date().getFullYear();
  let copyright = `Copyright @2020 - ${currentYear} kurudhi.com`;

  // Newsletter form — wired up to the `newsletter` object above,
  // which was already defined but not yet rendered anywhere.
  let email = "";
  let subscribed = false;

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to Firebase / mailing list backend
    subscribed = true;
    email = "";
    setTimeout(() => (subscribed = false), 4000);
  }

  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css"
    integrity="sha512-oAvZuuYVzkcTc2dH5z1ZJup5OmSQ000qlfRvuoTTiyTBjwX1faoyearj8KdMq0LgsBTHMrRuMek7s+CxF8yE+w=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500&display=swap"
  />
</svelte:head>

<footer class="kf-footer">
  <div class="kf-watermark" aria-hidden="true">குருதி</div>

  <div class="kf-pulse" aria-hidden="true">
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
      <path
        class="kf-pulse-line"
        d="M0 20 L260 20 L282 4 L306 36 L328 20 L1200 20"
        fill="none"
      />
    </svg>
  </div>

  <button class="kf-to-top" on:click={scrollToTop} aria-label="Back to top">
    <i class="bi bi-arrow-up" />
  </button>

  <div class="container">
    <div class="kf-grid">
      <div class="kf-brand">
        <a href="index.html" class="kf-logo">
          <img src="/images/logo/logo.PNG" alt="Kurudhi Logo" />
        </a>
        <div class="kf-meta">
          <span>{browserVersion}</span>
          <span class="kf-dot">•</span>
          <span>{browserLanguage} | {osplatform}</span>
        </div>
      </div>

      <div class="kf-col">
        <h5 class="kf-title">Services</h5>
        <ul class="kf-links">
          {#each services as service (service.text)}
            <li>
              <a href={service.link}><span>{service.text}</span></a>
            </li>
          {/each}
        </ul>
      </div>

    </div>

    <div class="kf-divider" />

    <div class="kf-bottom">
      <ul class="kf-bottom-links">
        {#each bottomLinks as link (link.text)}
          <li><a href={link.link}>{link.text}</a></li>
        {/each}
      </ul>

      <p class="kf-copyright">{copyright}</p>

      <ul class="kf-social">
        <li><a href="/" aria-label="WhatsApp"><i class="bi bi-whatsapp" /></a></li>
        <li><a href="/" aria-label="Facebook"><i class="bi bi-facebook" /></a></li>
        <li><a href="/" aria-label="Twitter / X"><i class="bi bi-twitter-x" /></a></li>
        <li><a href="/" aria-label="Instagram"><i class="bi bi-instagram" /></a></li>
      </ul>
    </div>
  </div>
</footer>

<style>
  /* ===================== Layout shell ===================== */
  .kf-footer {
    position: relative;
    background: linear-gradient(165deg, #1a1a1a 0%, #241014 100%);
    overflow: hidden;
    font-family: "Inter", sans-serif;
  }

  .kf-footer .kf-watermark {
    position: absolute;
    right: -20px;
    bottom: 10px;
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    font-size: 11rem;
    line-height: 1;
    color: #ffffff;
    opacity: 0.025;
    pointer-events: none;
    user-select: none;
  }

  .kf-footer .container {
    position: relative;
    z-index: 1;
  }

  /* ===================== Pulse divider ===================== */
  .kf-footer .kf-pulse {
    position: relative;
    z-index: 1;
    line-height: 0;
  }

  .kf-footer .kf-pulse svg {
    width: 100%;
    height: 34px;
    display: block;
  }

  .kf-footer .kf-pulse-line {
    stroke: #c41e3a;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.85;
    stroke-dasharray: 6 1400;
    animation: kf-heartbeat 4s linear infinite;
  }

  @keyframes kf-heartbeat {
    to {
      stroke-dashoffset: -1406;
    }
  }

  /* ===================== Back to top ===================== */
  .kf-footer .kf-to-top {
    position: absolute;
    top: 20px;
    right: 6%;
    z-index: 2;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: #c41e3a;
    color: #fff;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(196, 30, 58, 0.45);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .kf-footer .kf-to-top:hover {
    transform: translateY(2px);
    box-shadow: 0 12px 26px rgba(196, 30, 58, 0.55);
  }

  .kf-footer .kf-to-top:focus-visible {
    outline: 2px solid #fff5f5;
    outline-offset: 3px;
  }

  @media (max-width: 575px) {
    .kf-footer .kf-to-top {
      right: 24px;
    }
  }

  /* ===================== Main grid ===================== */
  .kf-footer .kf-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 1fr 1.3fr;
    gap: 40px;
    padding: 64px 0 46px;
  }

  .kf-footer .kf-brand .kf-logo {
    display: inline-block;
  }

  .kf-footer .kf-brand img {
    width: 13rem;
    height: auto;
  }

  .kf-footer .kf-meta {
    margin-top: 18px;
    font-size: 0.78rem;
    font-family: "Inter", monospace;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.01em;
  }

  .kf-footer .kf-dot {
    margin: 0 8px;
    color: rgba(255, 255, 255, 0.2);
  }

  .kf-footer .kf-title {
    position: relative;
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    font-size: 1rem;
    color: #ffffff;
    margin: 0 0 22px;
    padding-bottom: 12px;
  }

  .kf-footer .kf-title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 26px;
    height: 3px;
    border-radius: 2px;
    background: #c41e3a;
  }

  .kf-footer .kf-links {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .kf-footer .kf-links li {
    margin-bottom: 13px;
  }

  .kf-footer .kf-links a {
    position: relative;
    display: inline-block;
    color: rgba(255, 255, 255, 0.62);
    text-decoration: none;
    font-size: 0.92rem;
    transition: color 0.25s ease, transform 0.25s ease;
  }

  .kf-footer .kf-links a span::before {
    content: "›";
    display: inline-block;
    margin-right: 6px;
    opacity: 0;
    color: #c41e3a;
    transform: translateX(-6px);
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .kf-footer .kf-links a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0;
    height: 1px;
    background: #c41e3a;
    transition: width 0.25s ease;
  }

  .kf-footer .kf-links a:hover {
    color: #ffffff;
  }

  .kf-footer .kf-links a:hover span::before {
    opacity: 1;
    transform: translateX(0);
  }

  .kf-footer .kf-links a:hover::after {
    width: 100%;
  }

  .kf-footer .kf-links a:focus-visible {
    outline: 2px solid #c41e3a;
    outline-offset: 3px;
  }

  /* ===================== Newsletter ===================== */
  .kf-footer .kf-newsletter-desc {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 16px;
    line-height: 1.5;
  }

  .kf-footer .kf-newsletter-form {
    display: flex;
    border-radius: 999px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .kf-footer .kf-newsletter-form:focus-within {
    border-color: #c41e3a;
    box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.2);
  }

  .kf-footer .kf-newsletter-form input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    padding: 12px 16px;
    color: #fff;
    font-family: "Inter", sans-serif;
    font-size: 0.85rem;
  }

  .kf-footer .kf-newsletter-form input::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  .kf-footer .kf-newsletter-form button {
    border: none;
    background: #c41e3a;
    color: #fff;
    width: 46px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.25s ease;
  }

  .kf-footer .kf-newsletter-form button:hover {
    background: #a91830;
  }

  .kf-footer .kf-newsletter-success {
    margin: 10px 0 0;
    font-size: 0.82rem;
    color: #ffb3c1;
  }

  /* ===================== Divider + bottom bar ===================== */
  .kf-footer .kf-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  .kf-footer .kf-bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 26px 0;
  }

  .kf-footer .kf-bottom-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 22px;
  }

  .kf-footer .kf-bottom-links a {
    color: rgba(255, 255, 255, 0.55);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.25s ease;
  }

  .kf-footer .kf-bottom-links a:hover {
    color: #ffffff;
  }

  .kf-footer .kf-copyright {
    margin: 0;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
  }

  .kf-footer .kf-social {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 12px;
  }

  .kf-footer .kf-social a {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #ffffff;
    font-size: 0.95rem;
    transition: background 0.25s ease, border-color 0.25s ease,
      transform 0.25s ease, box-shadow 0.25s ease;
  }

  .kf-footer .kf-social a:hover {
    background: #c41e3a;
    border-color: #c41e3a;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(196, 30, 58, 0.4);
  }

  .kf-footer .kf-social a:focus-visible {
    outline: 2px solid #fff5f5;
    outline-offset: 3px;
  }

  /* ===================== Responsive ===================== */
  @media (max-width: 991px) {
    .kf-footer .kf-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 42px 24px;
    }
    .kf-footer .kf-brand,
    .kf-footer .kf-newsletter {
      grid-column: 1 / -1;
    }
    .kf-footer .kf-watermark {
      font-size: 8rem;
    }
  }

  @media (max-width: 575px) {
    .kf-footer .kf-grid {
      grid-template-columns: 1fr;
      text-align: center;
      padding: 56px 0 34px;
    }
    .kf-footer .kf-title::after {
      left: 50%;
      transform: translateX(-50%);
    }
    .kf-footer .kf-links a span::before {
      display: none;
    }
    .kf-footer .kf-newsletter-form {
      max-width: 340px;
      margin: 0 auto;
    }
    .kf-footer .kf-bottom {
      justify-content: center;
      text-align: center;
    }
    .kf-footer .kf-watermark {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .kf-footer .kf-pulse-line {
      animation: none;
    }
    .kf-footer .kf-to-top,
    .kf-footer .kf-social a,
    .kf-footer .kf-links a {
      transition: none;
    }
  }
</style>