<!--
  Route: /learn-about-blood
  Sapper page — place this file at: src/routes/learn-about-blood.svelte

  ASSUMPTIONS (please check against your actual codebase):
  1. `InnerBanner` lives at `../components/InnerBanner.svelte` and accepts
     `title` / `subtitle` props, matching the pattern used on your other pages.
     If the prop names differ, just adjust the two lines below where it's used.
  2. The "Become a donor" button links to `/donor-registration`.
     Swap that href for whatever your real registration route is called.
  3. Poppins, Inter, and Baloo 2 are already loaded globally (as on your other
     pages), so this file only references the font-family names, no @import.
-->
<script>
  import InnerBanner from '../components/InnerBanner.svelte';

  // ---- Flashcard quiz data: the 12 core facts, framed as question + answer ----
  const facts = [
    { id: 1, q: 'What kind of tissue is blood, really?', a: 'Blood is a liquid connective tissue — it carries oxygen, nutrients, and waste to and from every cell in your body.' },
    { id: 2, q: 'How much blood does an adult carry?', a: 'About 4.5–5.5 litres — roughly 7–8% of your total body weight.' },
    { id: 3, q: 'How far does your blood travel in a day?', a: 'Around 19,000 km, pushed non-stop by your heart — like driving from Chennai to Coimbatore and back nearly 19 times, without a single break.' },
    { id: 4, q: 'How many main blood groups exist?', a: 'Four — A, B, AB, and O — and each one is either Rh positive or Rh negative.' },
    { id: 5, q: 'Which blood type is the universal donor?', a: 'O negative. In an emergency it can be given to almost anyone, regardless of their own blood type.' },
    { id: 6, q: 'Which blood type is the universal recipient?', a: 'AB positive — the one type that can safely receive blood from every other group.' },
    { id: 7, q: 'Why is blood red?', a: 'Hemoglobin, the protein that carries oxygen inside red cells, contains iron — and that iron is what gives blood its colour.' },
    { id: 8, q: 'What do white blood cells actually do?', a: "They're your body's soldiers, constantly on patrol — fighting infection and keeping disease at bay." },
    { id: 9, q: 'What stops a small cut from turning serious?', a: 'Platelets. These tiny cell fragments rush to a wound and clot the blood to seal it.' },
    { id: 10, q: 'Where does your body actually make blood?', a: 'Your bone marrow — a soft tissue that manufactures millions of new blood cells every single second.' },
    { id: 11, q: 'How many lives can one donation save?', a: 'Up to 3. A single donation can be separated into red cells, plasma, and platelets, each going to a different patient.' },
    { id: 12, q: 'Does blood remember past infections?', a: "In a way, yes. Antibodies circulating in your blood carry a record of infections your immune system has already fought off." }
  ];

  let flipped = {};
  $: exploredCount = Object.values(flipped).filter(Boolean).length;
  $: progressPct = Math.round((exploredCount / facts.length) * 100);

  function toggleCard(id) {
    flipped = { ...flipped, [id]: !flipped[id] };
  }

  // ---- Blood type compatibility explorer ----
  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const compatibility = {
    'O-':  { donatesTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], receivesFrom: ['O-'] },
    'O+':  { donatesTo: ['O+', 'A+', 'B+', 'AB+'], receivesFrom: ['O-', 'O+'] },
    'A-':  { donatesTo: ['A-', 'A+', 'AB-', 'AB+'], receivesFrom: ['O-', 'A-'] },
    'A+':  { donatesTo: ['A+', 'AB+'], receivesFrom: ['O-', 'O+', 'A-', 'A+'] },
    'B-':  { donatesTo: ['B-', 'B+', 'AB-', 'AB+'], receivesFrom: ['O-', 'B-'] },
    'B+':  { donatesTo: ['B+', 'AB+'], receivesFrom: ['O-', 'O+', 'B-', 'B+'] },
    'AB-': { donatesTo: ['AB-', 'AB+'], receivesFrom: ['O-', 'A-', 'B-', 'AB-'] },
    'AB+': { donatesTo: ['AB+'], receivesFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] }
  };

  let selectedType = 'O-';
  function selectType(type) {
    selectedType = type;
  }

  // ---- Blood volume calculator (7-8% of body weight) ----
  let weightKg = '';
  $: hasWeight = weightKg && weightKg > 0;
  $: avgVol = hasWeight ? weightKg * 0.075 : 0;
  $: lowVol = hasWeight ? (weightKg * 0.07).toFixed(1) : null;
  $: highVol = hasWeight ? (weightKg * 0.08).toFixed(1) : null;
  $: fillHeight = Math.min(100, (avgVol / 8) * 100);
</script>

<svelte:head>
  <title>Learn About Blood | Kurudhi.com</title>
  <meta name="description" content="Fascinating facts about blood, an interactive blood type compatibility guide, and a personal blood volume calculator — from Kurudhi.com." />
</svelte:head>

<div class="klb-page">

  <InnerBanner title="Learn About Blood" subtitle="The science behind every drop you give" />

  <section class="klb-intro">
    <div class="klb-intro-inner">
      <span class="klb-eyebrow">குருதி · இரத்தம்</span>
      <p class="klb-intro-text">
        Blood looks simple — a red liquid under your skin. Up close, it's one of the most
        remarkable systems in the human body: a moving organ that feeds every cell, fights
        every infection, and seals every wound. Tap through the flashcards below and see how
        much you already know.
      </p>
      <div class="klb-progress" aria-live="polite">
        <div class="klb-progress-track">
          <div class="klb-progress-fill" style="width: {progressPct}%"></div>
        </div>
        <span class="klb-progress-label">{exploredCount} of {facts.length} facts explored</span>
      </div>
    </div>
  </section>

  <section class="klb-quiz" aria-label="Blood facts flashcards">
    <h2 class="klb-section-title">Test what you know</h2>
    <p class="klb-section-sub">Tap a card to reveal the answer</p>

    <div class="klb-pulse-bg" aria-hidden="true">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path d="M0,30 L500,30 L525,8 L550,52 L575,30 L700,30 L725,8 L750,52 L775,30 L1200,30" />
      </svg>
    </div>

    <div class="klb-fact-grid">
      {#each facts as fact (fact.id)}
        <button
          type="button"
          class="klb-fact-card"
          class:is-flipped={flipped[fact.id]}
          aria-pressed={!!flipped[fact.id]}
          on:click={() => toggleCard(fact.id)}
        >
          <span class="klb-fact-card-inner">
            <span class="klb-fact-face klb-fact-face--front">
              <span class="klb-fact-drop" aria-hidden="true">🩸</span>
              <span class="klb-fact-question">{fact.q}</span>
              <span class="klb-fact-hint">Tap to reveal</span>
            </span>
            <span class="klb-fact-face klb-fact-face--back">
              <span class="klb-fact-answer">{fact.a}</span>
            </span>
          </span>
        </button>
      {/each}
    </div>
  </section>

  <section class="klb-compat">
    <h2 class="klb-section-title">Who can you help — and who can help you?</h2>
    <p class="klb-section-sub">Choose a blood type to see its matches</p>

    <div class="klb-compat-chips" role="group" aria-label="Select a blood type">
      {#each bloodTypes as type}
        <button
          type="button"
          class="klb-chip"
          class:is-selected={selectedType === type}
          on:click={() => selectType(type)}
        >
          {type}
        </button>
      {/each}
    </div>

    <div class="klb-compat-result">
      <div class="klb-compat-col">
        <h3 class="klb-compat-heading klb-compat-heading--donate">Can donate to</h3>
        <div class="klb-compat-tags">
          {#each compatibility[selectedType].donatesTo as t}
            <span class="klb-tag klb-tag--donate">{t}</span>
          {/each}
        </div>
      </div>
      <div class="klb-compat-col">
        <h3 class="klb-compat-heading klb-compat-heading--receive">Can receive from</h3>
        <div class="klb-compat-tags">
          {#each compatibility[selectedType].receivesFrom as t}
            <span class="klb-tag klb-tag--receive">{t}</span>
          {/each}
        </div>
      </div>
    </div>

    <p class="klb-compat-note">
      {#if selectedType === 'O-'}
        O negative is the universal donor — safe for almost any patient in an emergency.
      {:else if selectedType === 'AB+'}
        AB positive is the universal recipient — it can take blood from every other type.
      {:else}
        Compatibility runs both ways — check what {selectedType} can give, and what it can safely receive.
      {/if}
    </p>
  </section>

  <section class="klb-numbers">
    <h2 class="klb-section-title">Blood, by the numbers</h2>

    <div class="klb-numbers-grid">
      <div class="klb-calc-card">
        <h3 class="klb-card-title">How much blood do you carry?</h3>
        <p class="klb-card-copy">Blood makes up about 7–8% of body weight. Enter yours to estimate.</p>

        <div class="klb-calc-row">
          <label class="klb-calc-label" for="klb-weight">Your weight</label>
          <div class="klb-calc-input-wrap">
            <input
              id="klb-weight"
              type="number"
              inputmode="numeric"
              min="1"
              max="200"
              placeholder="e.g. 65"
              bind:value={weightKg}
              class="klb-calc-input"
            />
            <span class="klb-calc-unit">kg</span>
          </div>
        </div>

        <div class="klb-drop-visual" aria-hidden="true">
          <div class="klb-drop-shape">
            <div class="klb-drop-fill" style="height: {fillHeight}%"></div>
          </div>
        </div>

        <p class="klb-calc-result">
          {#if hasWeight}
            Roughly <strong>{lowVol}–{highVol} litres</strong> of blood.
          {:else}
            Enter your weight to see your estimate.
          {/if}
        </p>
      </div>

      <div class="klb-stat-card">
        <h3 class="klb-card-title">19,000 km a day</h3>
        <p class="klb-card-copy">
          That's how far your blood travels every single day, pushed continuously by your
          heart — about 19 round trips between Chennai and Coimbatore, without ever stopping
          for a break.
        </p>
      </div>

      <div class="klb-stat-card">
        <h3 class="klb-card-title">1 donation, 3 lives</h3>
        <p class="klb-card-copy">
          A single donation is separated into red cells, plasma, and platelets, each one
          going to a different patient who needs it.
        </p>
      </div>
    </div>

    <div class="klb-bonus">
      <span class="klb-bonus-label">Bonus fact</span>
      <div class="klb-bonus-compare">
        <div class="klb-bonus-item">
          <div class="klb-cup klb-cup--small" aria-hidden="true"></div>
          <span class="klb-bonus-caption">Newborn baby<br /><strong>~1 cup</strong></span>
        </div>
        <div class="klb-bonus-item">
          <div class="klb-cup klb-cup--large" aria-hidden="true"></div>
          <span class="klb-bonus-caption">Adult<br /><strong>~35 cups</strong></span>
        </div>
      </div>
    </div>
  </section>

  <section class="klb-cta">
    <h2 class="klb-cta-title">Now you know what's inside. Ready to share it?</h2>
    <p class="klb-cta-copy">Every donation is up to 3 lives waiting for a match.</p>
    <a href="/register" class="klb-cta-btn">Become a donor</a>
  </section>

</div>

<style>
  .klb-page {
    font-family: 'Inter', sans-serif;
    color: #1A1A1A;
    background: #FFFFFF;
    overflow-x: hidden;
  }

  /* ---------- Intro ---------- */
  .klb-page .klb-intro {
    padding: 56px 24px 40px;
  }
  .klb-page .klb-intro-inner {
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
  }
  .klb-page .klb-eyebrow {
    display: inline-block;
    font-family: 'Baloo 2', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.03em;
    color: #C41E3A;
    background: #FFF5F5;
    padding: 4px 14px;
    border-radius: 20px;
    margin-bottom: 18px;
  }
  .klb-page .klb-intro-text {
    font-size: 1.05rem;
    line-height: 1.7;
    color: #3A3A3A;
    margin: 0 0 28px;
  }
  .klb-page .klb-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .klb-page .klb-progress-track {
    width: 100%;
    max-width: 320px;
    height: 8px;
    background: #FFF5F5;
    border-radius: 999px;
    overflow: hidden;
  }
  .klb-page .klb-progress-fill {
    height: 100%;
    background: #C41E3A;
    border-radius: 999px;
    transition: width 0.4s ease;
  }
  .klb-page .klb-progress-label {
    font-size: 0.85rem;
    color: #5C5C5C;
  }

  /* ---------- Shared section heading ---------- */
  .klb-page .klb-section-title {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    color: #1A1A1A;
    text-align: center;
    margin: 0 0 6px;
  }
  .klb-page .klb-section-sub {
    text-align: center;
    color: #5C5C5C;
    margin: 0 0 32px;
    font-size: 0.95rem;
  }

  /* ---------- Quiz / flashcards ---------- */
  .klb-page .klb-quiz {
    position: relative;
    padding: 48px 24px 64px;
    background: #FFF5F5;
  }
  .klb-page .klb-pulse-bg {
    position: absolute;
    top: 92px;
    left: 0;
    right: 0;
    height: 60px;
    opacity: 0.3;
    pointer-events: none;
  }
  .klb-page .klb-pulse-bg svg {
    width: 100%;
    height: 100%;
  }
  .klb-page .klb-pulse-bg path {
    fill: none;
    stroke: #C41E3A;
    stroke-width: 2;
    stroke-dasharray: 6 6;
    animation: klb-pulse-move 3s linear infinite;
  }
  @keyframes klb-pulse-move {
    to { stroke-dashoffset: -120; }
  }
  .klb-page .klb-fact-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    max-width: 1100px;
    margin: 0 auto;
  }
  .klb-page .klb-fact-card {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    perspective: 1200px;
    height: 190px;
    font: inherit;
    text-align: left;
  }
  .klb-page .klb-fact-card:focus-visible .klb-fact-card-inner {
    outline: 3px solid #C41E3A;
    outline-offset: 3px;
  }
  .klb-page .klb-fact-card-inner {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
    transform-style: preserve-3d;
    border-radius: 16px;
  }
  .klb-page .klb-fact-card.is-flipped .klb-fact-card-inner {
    transform: rotateY(180deg);
  }
  .klb-page .klb-fact-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 10px rgba(26, 26, 26, 0.08);
  }
  .klb-page .klb-fact-face--front {
    background: #FFFFFF;
    border: 1px solid #F1D9DC;
    justify-content: space-between;
  }
  .klb-page .klb-fact-face--back {
    background: #C41E3A;
    color: #FFFFFF;
    transform: rotateY(180deg);
    justify-content: center;
  }
  .klb-page .klb-fact-drop {
    font-size: 1.4rem;
  }
  .klb-page .klb-fact-question {
    font-family: 'Baloo 2', sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.35;
    color: #1A1A1A;
  }
  .klb-page .klb-fact-hint {
    font-size: 0.75rem;
    color: #B0555F;
    align-self: flex-end;
  }
  .klb-page .klb-fact-answer {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  /* ---------- Compatibility explorer ---------- */
  .klb-page .klb-compat {
    padding: 64px 24px;
    max-width: 800px;
    margin: 0 auto;
  }
  .klb-page .klb-compat-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 36px;
  }
  .klb-page .klb-chip {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 10px 18px;
    border-radius: 999px;
    border: 2px solid #C41E3A;
    background: #FFFFFF;
    color: #C41E3A;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  }
  .klb-page .klb-chip.is-selected {
    background: #1A1A1A;
    border-color: #1A1A1A;
    color: #FFFFFF;
    transform: scale(1.05);
  }
  .klb-page .klb-chip:focus-visible {
    outline: 3px solid #C41E3A;
    outline-offset: 2px;
  }
  .klb-page .klb-compat-result {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 20px;
  }
  .klb-page .klb-compat-heading {
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    margin: 0 0 12px;
    text-align: center;
  }
  .klb-page .klb-compat-heading--donate { color: #C41E3A; }
  .klb-page .klb-compat-heading--receive { color: #1A1A1A; }
  .klb-page .klb-compat-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  .klb-page .klb-tag {
    font-size: 0.85rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 8px;
  }
  .klb-page .klb-tag--donate { background: #C41E3A; color: #FFFFFF; }
  .klb-page .klb-tag--receive { background: #FFF5F5; color: #1A1A1A; border: 1px solid #C41E3A; }
  .klb-page .klb-compat-note {
    text-align: center;
    color: #5C5C5C;
    font-size: 0.9rem;
    max-width: 480px;
    margin: 0 auto;
  }

  /* ---------- Numbers section ---------- */
  .klb-page .klb-numbers {
    padding: 64px 24px;
    background: #FFF5F5;
  }
  .klb-page .klb-numbers-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 24px;
    max-width: 1100px;
    margin: 0 auto 48px;
  }
  .klb-page .klb-calc-card,
  .klb-page .klb-stat-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 2px 10px rgba(26, 26, 26, 0.06);
  }
  .klb-page .klb-card-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.15rem;
    color: #1A1A1A;
    margin: 0 0 10px;
  }
  .klb-page .klb-card-copy {
    font-size: 0.92rem;
    color: #4A4A4A;
    line-height: 1.55;
    margin: 0;
  }
  .klb-page .klb-calc-row {
    margin: 16px 0;
  }
  .klb-page .klb-calc-label {
    display: block;
    font-size: 0.85rem;
    color: #5C5C5C;
    margin-bottom: 6px;
  }
  .klb-page .klb-calc-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .klb-page .klb-calc-input {
    width: 100px;
    padding: 8px 10px;
    border: 2px solid #F1D9DC;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Inter', sans-serif;
  }
  .klb-page .klb-calc-input:focus {
    outline: none;
    border-color: #C41E3A;
  }
  .klb-page .klb-calc-unit {
    color: #5C5C5C;
    font-size: 0.9rem;
  }
  .klb-page .klb-drop-visual {
    display: flex;
    justify-content: center;
    margin: 14px 0;
  }
  .klb-page .klb-drop-shape {
    position: relative;
    width: 46px;
    height: 62px;
    background: #FFF5F5;
    clip-path: polygon(50% 0%, 90% 65%, 50% 100%, 10% 65%);
    overflow: hidden;
  }
  .klb-page .klb-drop-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #C41E3A;
    transition: height 0.4s ease;
  }
  .klb-page .klb-calc-result {
    margin-top: 12px;
    font-size: 0.92rem;
    color: #1A1A1A;
    text-align: center;
  }

  /* ---------- Bonus fact ---------- */
  .klb-page .klb-bonus {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    background: #FFFFFF;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 2px 10px rgba(26, 26, 26, 0.06);
  }
  .klb-page .klb-bonus-label {
    display: inline-block;
    font-family: 'Baloo 2', sans-serif;
    font-size: 0.8rem;
    color: #C41E3A;
    background: #FFF5F5;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 18px;
  }
  .klb-page .klb-bonus-compare {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 40px;
  }
  .klb-page .klb-bonus-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .klb-page .klb-cup {
    background: #C41E3A;
    border-radius: 4px 4px 10px 10px;
  }
  .klb-page .klb-cup--small { width: 22px; height: 26px; }
  .klb-page .klb-cup--large { width: 22px; height: 90px; }
  .klb-page .klb-bonus-caption {
    font-size: 0.85rem;
    color: #4A4A4A;
    line-height: 1.4;
  }
  .klb-page .klb-bonus-caption strong { color: #1A1A1A; }

  /* ---------- CTA ---------- */
  .klb-page .klb-cta {
    padding: 72px 24px;
    text-align: center;
    background: #1A1A1A;
  }
  .klb-page .klb-cta-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(1.4rem, 2.4vw, 1.9rem);
    color: #FFFFFF;
    margin: 0 0 10px;
  }
  .klb-page .klb-cta-copy {
    color: #D9B7BC;
    margin: 0 0 28px;
  }
  .klb-page .klb-cta-btn {
    display: inline-block;
    background: #C41E3A;
    color: #FFFFFF;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    padding: 14px 36px;
    border-radius: 999px;
    text-decoration: none;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .klb-page .klb-cta-btn:hover {
    background: #8B1128;
    transform: translateY(-2px);
  }
  .klb-page .klb-cta-btn:focus-visible {
    outline: 3px solid #FFFFFF;
    outline-offset: 3px;
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 720px) {
    .klb-page .klb-numbers-grid { grid-template-columns: 1fr; }
    .klb-page .klb-compat-result { grid-template-columns: 1fr; }
    .klb-page .klb-fact-card { height: 210px; }
  }

  /* ---------- Reduced motion ---------- */
  @media (prefers-reduced-motion: reduce) {
    .klb-page .klb-fact-card-inner { transition: none; }
    .klb-page .klb-pulse-bg path { animation: none; }
    .klb-page .klb-progress-fill,
    .klb-page .klb-drop-fill,
    .klb-page .klb-chip,
    .klb-page .klb-cta-btn { transition: none; }
  }
</style>