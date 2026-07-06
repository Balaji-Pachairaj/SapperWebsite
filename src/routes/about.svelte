<svelte:head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>About Kurudhi.com — Empowering Lives Through Blood Donation</title>
  <meta name="description" content="Discover the heart behind Kurudhi.com – your go-to platform connecting blood donors with recipients. Join our mission of saving lives and fostering hope.">
  <meta name="author" content="J S Raghavan">
  <meta name="copyright" content="J S Raghavan">
  <meta name="robots" content="index, follow">
</svelte:head>

<script>
  import BloodCta from "../components/BloodCTA.svelte"
  import HowWorks from "../components/HowWorks.svelte";
  import Banner from "../components/InnerBanner.svelte";
  import Team from "../components/Team.svelte";

  let openItem = 'ac1';

  let accordionItems = [
    {
      id: 'ac1',
      title: "What is Kurudhi.com?",
      description: "Kurudhi.com is a dedicated online platform designed to revolutionize blood donation and supply by connecting donors and recipients in a streamlined, efficient, and user-friendly manner. The name Kurudhi itself is derived from the Tamil word for blood, emphasizing the primary focus of the website."
    },
    {
      id: 'ac2',
      title: "Why Choose Kurudhi.com?",
      description: "Kurudhi.com is built with a user-centric approach, making it easy for blood donors and recipients to find the right match quickly. By utilizing modern technology, we reduce the time and effort needed to arrange blood donations."
    },
    {
      id: 'ac3',
      title: "What is the Impact of Kurudhi.com?",
      description: "Through Kurudhi.com, countless lives have been saved by connecting donors with recipients during emergencies, surgeries, and medical treatments. Every donation matters, and every connection we make brings hope to those in need."
    }
  ];

  function toggle(id) {
    openItem = openItem === id ? null : id;
  }

  let teamMembers = [
    { name: "Mr. Hajee Sharif", role: "Founder", org: "Kurudhi" },
    { name: "Mr. Arjun", role: "Marketing Specialist", org: "" },
    { name: "Mr. Elango", role: "Website Developer", org: "" },
  ];

  let stats = [
    { value: "10K+", label: "Registered Donors" },
    { value: "5K+", label: "Lives Saved" },
    { value: "25+", label: "Cities Covered" },
  ];
</script>

<div class="kab-wrapper">

  <!-- ── HERO ─────────────────────────────────────────── -->
  <section class="kab-hero">
    <div class="kab-hero-bg-text" aria-hidden="true">இரத்தம்</div>
    <div class="kab-container">
      <div class="kab-hero-eyebrow">Our story</div>
      <h1 class="kab-hero-title">Connecting donors.<br>Saving lives.</h1>
      <p class="kab-hero-sub">Kurudhi — the Tamil word for blood — is a platform built on the belief that no one should struggle to find a donor in a moment of crisis.</p>
    </div>
  </section>

  <!-- ── STATS STRIP ────────────────────────────────────── -->
  <section class="kab-stats-strip">
    <div class="kab-container">
      <div class="kab-stats-row">
        {#each stats as stat}
          <div class="kab-stat">
            <span class="kab-stat-value">{stat.value}</span>
            <span class="kab-stat-label">{stat.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ── MISSION + FAQ ──────────────────────────────────── -->
  <section class="kab-mission">
    <div class="kab-container">
      <div class="kab-mission-grid">

        <div class="kab-mission-left">
          <div class="kab-section-label">Our mission</div>
          <h2 class="kab-mission-title">We've been helping donors connect globally.</h2>
          <p class="kab-mission-body">Blood is something only people can give. We built Kurudhi to make that act of giving as frictionless as possible — for the donor, and for the family waiting.</p>
          <div class="kab-drop-accent" aria-hidden="true">
            <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path d="M30 4 C30 4 4 36 4 52 A26 26 0 0 0 56 52 C56 36 30 4 30 4Z" fill="#C8102E" opacity="0.12"/>
              <path d="M30 18 C30 18 12 44 12 54 A18 18 0 0 0 48 54 C48 44 30 18 30 18Z" fill="#C8102E" opacity="0.18"/>
            </svg>
          </div>
        </div>

        <div class="kab-faq">
          {#each accordionItems as item}
            <div class="kab-faq-item" class:kab-faq-open={openItem === item.id}>
              <button class="kab-faq-trigger" on:click={() => toggle(item.id)} aria-expanded={openItem === item.id}>
                <span>{item.title}</span>
                <span class="kab-faq-icon">{openItem === item.id ? '−' : '+'}</span>
              </button>
              {#if openItem === item.id}
                <div class="kab-faq-body">
                  <p>{item.description}</p>
                </div>
              {/if}
            </div>
          {/each}
        </div>

      </div>
    </div>
  </section>

  <!-- ── VALUES STRIP ───────────────────────────────────── -->
  <section class="kab-values">
    <div class="kab-container">
      <div class="kab-values-grid">
        <div class="kab-value-card">
          <div class="kab-value-icon">◎</div>
          <h3>Transparent</h3>
          <p>No middlemen, no hidden steps. Donors and recipients connect directly.</p>
        </div>
        <div class="kab-value-card">
          <div class="kab-value-icon">◈</div>
          <h3>Community-driven</h3>
          <p>Built by and for the communities we serve across Tamil Nadu and beyond.</p>
        </div>
        <div class="kab-value-card">
          <div class="kab-value-icon">◉</div>
          <h3>Always available</h3>
          <p>Blood emergencies don't wait. Neither do we — 24/7, year-round.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── TEAM ───────────────────────────────────────────── -->
  <section class="kab-team">
    <div class="kab-container">
      <div class="kab-section-label">The people behind it</div>
      <h2 class="kab-team-title">People Behind Kurudhi</h2>
      <div class="kab-team-grid">
        {#each teamMembers as member}
          <div class="kab-team-card">
            <div class="kab-team-avatar">
              {member.name.charAt(0)}
            </div>
            <div class="kab-team-info">
              <div class="kab-team-name">{member.name}</div>
              {#if member.role}
                <div class="kab-team-role">{member.role}{member.org ? ` · ${member.org}` : ''}</div>
              {:else}
                <div class="kab-team-role">{member.org}</div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <BloodCta />

</div>

<style>
  /* ── Base ─────────────────────────── */
  .kab-wrapper {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #1a1a1a;
    background: #fff;
  }

  .kab-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .kab-section-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #C8102E;
    margin-bottom: 16px;
  }

  /* ── HERO ─────────────────────────── */
  .kab-hero {
    position: relative;
    background: linear-gradient(  to bottom,  #FF4400 0%,  #FF4400 90%,  #ff0000 100%);
    color: #fff;
    padding: 120px 0 100px;
    overflow: hidden;
  }

  .kab-hero-bg-text {
    position: absolute;
    top: 50%;
    right: -40px;
    transform: translateY(-50%);
    font-size: clamp(100px, 18vw, 240px);
    font-weight: 900;
    color: #fff;
    opacity: 0.20;
    line-height: 1;
    pointer-events: none;
    white-space: nowrap;
    user-select: none;
  }

  .kab-hero-eyebrow {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #C8102E;
    margin-bottom: 24px;
  }

  .kab-hero-title {
    font-size: clamp(2.4rem, 5vw, 4.2rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 28px;
    letter-spacing: -0.02em;
  }

  .kab-hero-sub {
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(255,255,255,0.65);
    max-width: 520px;
    margin: 0;
  }

  /* ── STATS ────────────────────────── */
  .kab-stats-strip {
    background: #1a1a1a;
    padding: 40px 0;
  }

  .kab-stats-row {
    display: flex;
    gap: 0;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .kab-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 32px;
  }

  .kab-stat-value {
    font-size: 2.4rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .kab-stat-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* ── MISSION ──────────────────────── */
  .kab-mission {
    padding: 100px 0;
    background: #fff;
  }

  .kab-mission-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }

  .kab-mission-left {
    position: relative;
  }

  .kab-mission-title {
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0 0 20px;
  }

  .kab-mission-body {
    font-size: 1rem;
    line-height: 1.75;
    color: #555;
    margin: 0;
  }

  .kab-drop-accent {
    position: absolute;
    bottom: -40px;
    right: 20px;
    width: 80px;
    opacity: 0.6;
  }

  /* ── FAQ ──────────────────────────── */
  .kab-faq {
    border-top: 1px solid #eee;
  }

  .kab-faq-item {
    border-bottom: 1px solid #eee;
  }

  .kab-faq-trigger {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 22px 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    text-align: left;
    gap: 16px;
    transition: color 0.15s;
  }

  .kab-faq-trigger:hover {
    color: #C8102E;
  }

  .kab-faq-icon {
    font-size: 1.4rem;
    font-weight: 300;
    color: #C8102E;
    flex-shrink: 0;
    line-height: 1;
  }

  .kab-faq-body {
    padding: 0 0 22px;
  }

  .kab-faq-body p {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.75;
    color: #555;
  }

  /* ── VALUES ───────────────────────── */
  .kab-values {
    background: #EDE9E6;
    padding: 80px 0;
  }

  .kab-values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  .kab-value-card {
    background: #fff;
    border-radius: 12px;
    padding: 36px 28px;
    border: 1px solid #ebebeb;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .kab-value-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.07);
    transform: translateY(-3px);
  }

  .kab-value-icon {
    font-size: 1.6rem;
    color: #C8102E;
    margin-bottom: 16px;
    line-height: 1;
  }

  .kab-value-card h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 10px;
  }

  .kab-value-card p {
    font-size: 0.88rem;
    line-height: 1.7;
    color: #666;
    margin: 0;
  }

  /* ── TEAM ─────────────────────────── */
  .kab-team {
    padding: 100px 0;
    background: #fff;
  }

  .kab-team-title {
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 56px;
  }

  .kab-team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .kab-team-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .kab-team-card:hover {
    border-color: #C8102E;
    box-shadow: 0 4px 20px rgba(200,16,46,0.08);
  }

  .kab-team-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #FFF5F5;
    color: #C8102E;
    font-size: 1.1rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .kab-team-name {
    font-size: 0.92rem;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 3px;
  }

  .kab-team-role {
    font-size: 0.78rem;
    color: #888;
    line-height: 1.4;
  }

  /* ── RESPONSIVE ───────────────────── */
  @media (max-width: 768px) {
    .kab-mission-grid {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    .kab-values-grid {
      grid-template-columns: 1fr;
    }

    .kab-team-grid {
      grid-template-columns: 1fr;
    }

    .kab-stats-row {
      gap: 16px;
    }

    .kab-hero {
      padding: 80px 0 70px;
    }

    .kab-drop-accent {
      display: none;
    }
  }
</style>
