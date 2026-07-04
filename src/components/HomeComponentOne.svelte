<script>
  // Edit copy here without touching the markup below
  export let bannerImageUrl = '/images/icon-192x192.png';
  export let horseImageUrl = '/images/kurudhi-hero-horse.png';
  export let bannerTitle = "Join the Life Saver Mission — Let's Unite to Save Lives";
  export let bannerSubtitle =
    'Unite with millions of Indians to become Life Savers and join the mission of saving lives – a powerful movement of compassion and solidarity.';
</script>

<section class="kh-banner">
  <div class="kh-banner__bg" style="background-image: url('{bannerImageUrl}')" aria-hidden="true" />
  <div class="kh-banner__overlay" aria-hidden="true" />

  <div class="kh-banner__inner">
    <div class="kh-banner__text">
      <h2 class="kh-banner__title">{bannerTitle}</h2>
      <p class="kh-banner__subtitle">{bannerSubtitle}</p>
    </div>
    <div class="kh-banner__horse">
      <img src="{horseImageUrl}" alt="Kurudhi horse mascot" />
    </div>
  </div>


</section>

<style>
  .kh-banner {
    position: relative;
    min-height: 440px;
    display: flex;
    align-items: center;
    margin: 40px 0;
    overflow: hidden;
  }

  .kh-banner .kh-banner__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-color: #1a1a1a;
  }

  .kh-banner .kh-banner__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      100deg,
      rgba(26, 26, 26, 0.1) 0%,
      rgba(26, 26, 26, 0.5) 40%,
      rgba(139, 15, 38, 0.85) 100%
    );
  }

  .kh-banner .kh-banner__inner {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 60px;
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .kh-banner .kh-banner__text {
    max-width: 560px;
    flex: 1;
  }

  .kh-banner .kh-banner__title {
    margin: 0 0 18px;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: clamp(26px, 3.2vw, 40px);
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: #ffffff;
  }

  .kh-banner .kh-banner__subtitle {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.85);
  }

  .kh-banner .kh-banner__horse {
    flex-shrink: 0;
    width: 100%;
    max-width: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kh-banner .kh-banner__horse img {
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
  }

  @media (max-width: 900px) {
    .kh-banner {
      min-height: 0;
      padding: 60px 0;
    }
    .kh-banner .kh-banner__inner {
      padding: 0 32px;
      flex-direction: column;
      gap: 30px;
    }
    .kh-banner .kh-banner__overlay {
      background: linear-gradient(
        180deg,
        rgba(26, 26, 26, 0.55) 0%,
        rgba(139, 15, 38, 0.85) 100%
      );
    }
    .kh-banner .kh-banner__text {
      max-width: 100%;
    }
    .kh-banner .kh-banner__horse {
      max-width: 280px;
    }
  }

  @media (max-width: 560px) {
    .kh-banner .kh-banner__inner {
      padding: 0 20px;
    }
  }
</style>