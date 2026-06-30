<svelte:head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kurudhi.com India's No 1 Blood Donor Platform</title>
  <meta name="description" content="Connecting blood donors with recipients – Kurudhi.com, the pioneering website in India. Join the lifesaving community today.">
  <meta name="author" content="J S Raghavan">
  <meta name="copyright" content="J S Raghavan">
  <meta name="robots" content="index, follow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<script>
  import BloodCta from "../components/BloodCTA.svelte";
  import HomeComponentOne from "../components/HomeComponentOne.svelte";
  import Testmonial from "../components/Testmonial.svelte";

  import { onMount } from 'svelte';

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Mumbai','Delhi','Chennai','Bangalore','Kolkata','Hyderabad','Pune','Coimbatore','Jaipur','Ahmedabad','Surat','Lucknow'];

  let selectedType = '';
  let selectedCity = '';
  let dotActive = true;

  onMount(() => {
    const interval = setInterval(() => { dotActive = !dotActive; }, 1000);
    return () => clearInterval(interval);
  });
</script>

<style>
  /* ── PAGE RESET for hero scope ── */
  .k-hero {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #fff;
  }

  /* ── HERO ── */
  .k-hero {
    display: grid;
    grid-template-columns: 1fr 420px;
    align-items: center;
    gap: 60px;
    padding: 135px 7vw 135px;
    background: #ffffff;
    position: relative;
    overflow: hidden;
  }

  .k-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 70% at 90% 40%, rgba(200,16,46,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 40% 50% at 10% 80%, rgba(200,16,46,0.03) 0%, transparent 60%);
    pointer-events: none;
  }

  /* left */
  .kh-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #FFF0F2;
    border: 1px solid #F4C5CC;
    color: #C8102E;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 14px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-bottom: 28px;
  }

  .kh-dot {
    width: 6px;
    height: 6px;
    background: #C8102E;
    border-radius: 50%;
    display: inline-block;
    animation: kdot 2s ease-in-out infinite;
  }

  @keyframes kdot {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.3; transform:scale(0.7); }
  }

  .kh-h1 {
    font-family: Inter, Georgia, serif;
    font-size: clamp(38px, 4.5vw, 64px);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: #1a1a1a;
    margin: 0 0 22px 0;
  }

  .kh-h1 em {
    font-style: italic;
    color: #C8102E;
  }

  .kh-sub {
    font-size: 16px;
    color: #6b6b68;
    line-height: 1.7;
    max-width: 440px;
    margin: 0 0 36px 0;
  }

  .kh-btns {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 48px;
  }

  .kh-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #C8102E;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 600;
    padding: 13px 26px;
    border-radius: 999px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .kh-btn-primary:hover { background: #a50d25; transform: translateY(-1px); }

  .kh-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: #3d3d3a;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 500;
    padding: 13px 26px;
    border-radius: 999px;
    border: 1.5px solid rgba(0,0,0,0.18);
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .kh-btn-secondary:hover { background: #f5f4f0; }

  .kh-trust {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .kh-avatars {
    display: flex;
  }

  .kh-av {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #f0eeea;
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #3d3d3a;
    margin-left: -8px;
  }

  .kh-av:first-child { margin-left: 0; }

  .kh-trust-text {
    font-size: 13px;
    color: #9c9c99;
  }

  .kh-trust-text strong { color: #3d3d3a; font-weight: 600; }

  /* RIGHT — search card */
  .kh-card {
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 4px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
    position: relative;
  }

  .kh-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #C8102E, #e8627a);
    border-radius: 20px 20px 0 0;
  }

  .kh-card-title {
  font-family: 'Inter', sans-serif;
    font-size: 22px;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 6px 0;
  }

  .kh-card-sub {
    font-size: 13px;
    color: #9c9c99;
    margin: 0 0 24px 0;
    line-height: 1.5;
  }

  .kh-label {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #9c9c99;
    margin-bottom: 10px;
  }

  .kh-types {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }

  .kh-type-btn {
    border: 1.5px solid rgba(0,0,0,0.15);
    background: #fff;
    border-radius: 8px;
    padding: 10px 4px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #3d3d3a;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }

  .kh-type-btn:hover {
    border-color: #C8102E;
    color: #C8102E;
    background: #FFF0F2;
  }

  .kh-type-btn.sel {
    background: #C8102E;
    border-color: #C8102E;
    color: #fff;
  }

  .kh-select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid rgba(0,0,0,0.15);
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #1a1a1a;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b6b68' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center;
    appearance: none;
    cursor: pointer;
    margin-bottom: 18px;
    transition: border-color 0.15s;
  }

  .kh-select:focus {
    outline: none;
    border-color: #C8102E;
    box-shadow: 0 0 0 3px rgba(200,16,46,0.1);
  }

  .kh-search-btn {
    width: 100%;
    padding: 13px;
    background: #C8102E;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .kh-search-btn:hover { background: #a50d25; transform: translateY(-1px); }

  .kh-urgency {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fffbea;
    border: 1px solid #fde68a;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 12px;
    color: #78350f;
    margin-top: 14px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
  }

  /* ── STATS ── */
  .k-stats {
    background: #1a1a1a;
    padding: 56px 7vw;
  }

  .k-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    max-width: 880px;
    margin: 0 auto;
  }

  .k-stat {
    text-align: center;
    padding: 20px 16px;
    border-right: 1px solid rgba(255,255,255,0.08);
  }

  .k-stat:last-child { border-right: none; }

  .k-stat-icon {
    font-size: 18px;
    color: #C8102E;
    display: block;
    margin-bottom: 10px;
    line-height: 1;
  }

  .k-stat-val {
  font-family: 'Inter', sans-serif;
    font-size: 34px;
    font-weight: 400;
    color: #ffffff;
    line-height: 1;
    margin-bottom: 6px;
    font-style: italic;
    display: block;
  }

  .k-stat-lbl {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.03em;
    font-family: 'Inter', sans-serif;
    display: block;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .k-hero {
      grid-template-columns: 1fr;
      padding: 120px 5vw 140px;
      gap: 40px;
    }
    .k-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .k-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .k-stat:nth-child(2n) { border-right: none; }
    .k-stat:last-child { border-bottom: none; }
  }

  @media (max-width: 560px) {
    .kh-card { padding: 22px; }
    .kh-btns { flex-direction: column; align-items: flex-start; }
    .k-stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>


<!-- ═══════════════════════════════════════
     HERO
════════════════════════════════════════ -->
<section class="k-hero">

  <!-- LEFT -->
  <div>
    <div class="kh-badge">
      <span class="kh-dot"></span>
      India's No. 1 Network
    </div>

    <h1 class="kh-h1">
      Every drop of blood<br>
      <em>saves</em> a life.
    </h1>

    <p class="kh-sub">
      Find compatible donors near you in under three minutes. Kurudhi connects hospitals, families, and volunteers across 620+ Indian cities — instantly.
    </p>

    <div class="kh-btns">
      <a href="/register" class="kh-btn-primary">Register as a Donor</a>
      <a href="/find" class="kh-btn-secondary">Find a Donor →</a>
    </div>

    <div class="kh-trust">
      <div class="kh-avatars">
        {#each ['RK','PM','SN','AV','DJ'] as av}
          <div class="kh-av">{av}</div>
        {/each}
      </div>
      <span class="kh-trust-text">Joined by <strong>1.4 lakh+</strong> donors across India</span>
    </div>
  </div>

  <!-- RIGHT: search card -->
  <div class="kh-card">
    <p class="kh-card-title">Find a donor now</p>
    <p class="kh-card-sub">Pick a blood group and your city — verified donors appear instantly.</p>

    <span class="kh-label">Blood group needed</span>
    <div class="kh-types">
      {#each bloodTypes as bt}
        <button
          class="kh-type-btn"
          class:sel={selectedType === bt}
          on:click={() => selectedType = selectedType === bt ? '' : bt}
        >{bt}</button>
      {/each}
    </div>

    <label class="kh-label" for="kh-city">Your city</label>
    <select id="kh-city" class="kh-select" bind:value={selectedCity}>
      <option value="">Select city…</option>
      {#each cities as c}
        <option value={c}>{c}</option>
      {/each}
    </select>

    <button
      class="kh-search-btn"
      on:click={() => {
        if (selectedType && selectedCity) {
          window.location.href = `/find?type=${encodeURIComponent(selectedType)}&city=${encodeURIComponent(selectedCity)}`;
        }
      }}
    >
      Search Donors →
    </button>

    <div class="kh-urgency">
      ⚡ 247 urgent requests matched in the last hour
    </div>
  </div>

</section>


<!-- ═══════════════════════════════════════
     STATS BAR
════════════════════════════════════════ -->
<div class="k-stats">
  <div class="k-stats-grid">
    <div class="k-stat">
      <span class="k-stat-icon">♥</span>
      <span class="k-stat-val">1,40,000+</span>
      <span class="k-stat-lbl">Registered donors</span>
    </div>
    <div class="k-stat">
      <span class="k-stat-icon">✦</span>
      <span class="k-stat-val">52,000+</span>
      <span class="k-stat-lbl">Lives saved</span>
    </div>
    <div class="k-stat">
      <span class="k-stat-icon">◉</span>
      <span class="k-stat-val">620+</span>
      <span class="k-stat-lbl">Cities covered</span>
    </div>
    <div class="k-stat">
      <span class="k-stat-icon">◷</span>
      <span class="k-stat-val">&lt;3 min</span>
      <span class="k-stat-lbl">Avg. response time</span>
    </div>
  </div>
</div>


<!-- ═══════════════════════════════════════
     ORIGINAL COMPONENTS (unchanged)
════════════════════════════════════════ -->
<HomeComponentOne />
<Testmonial />
<BloodCta />
