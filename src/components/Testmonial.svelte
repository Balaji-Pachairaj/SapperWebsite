<script>
  let testimonials = {
    0: "Registering as a blood donor on Kurudhi was incredibly simple. The platform made the entire process hassle-free, and I feel empowered knowing I can contribute to saving lives.",
    1: "I'm impressed by the user-friendly setup of Kurudhi. Being a first-time donor, the website guided me through the process, making it accessible and straightforward.",
    2: "Kurudhi has made connecting blood donors with recipients seamless. The platform's intuitive design and features ensure a smooth experience for both donors and those in need.",
    3: "Kurudhi is doing a fantastic job in bridging the gap between donors and recipients. I appreciate the effort put into creating an efficient and effective blood donation platform.",
    4: "The experience with Kurudhi has been outstanding. From registration to finding donation opportunities, the platform is well-designed, making it a go-to for blood donation initiatives.",
    5: "I commend Kurudhi for its commitment to saving lives. The platform's simplicity and effectiveness have created a positive impact on the blood donation community.",
    6: "Kurudhi has successfully created a user-friendly space for blood donors. The website's features and testimonials inspire confidence in its mission to facilitate life-saving donations."
  };

  let keys = Object.keys(testimonials).map(Number);
  let total = keys.length;
  let activeTestimonial = 0;

  // How many cards to show at once (2 on desktop, 1 on small screens is handled purely via CSS)
  function getVisiblePair(start) {
    return [start % total, (start + 1) % total];
  }

  $: visiblePair = getVisiblePair(activeTestimonial);

  function nextTestimonial() {
    activeTestimonial = (activeTestimonial + 1) % total;
  }

  function prevTestimonial() {
    activeTestimonial = (activeTestimonial - 1 + total) % total;
  }
</script>

<section class="kt-feedback-section position-relative mt-170 xl-mt-150 lg-mt-100 mb-100">
  <div class="container position-relative testimonial-container">
    <div class="row">
      <div class="col-xl-6 col-lg-7 col-md-8 m-auto">
        <div class="title-two text-center testimonial-title">
          <h2 class="kt-heading fw-600">Check what our users have to say.</h2>
        </div>
      </div>
    </div>

    <div class="kt-carousel-wrap mt-55 lg-mt-30">
      <button
        on:click={prevTestimonial}
        class="kt-nav-btn kt-nav-prev"
        type="button"
        aria-label="Previous testimonial"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <div class="kt-cards-row">
        {#each visiblePair as idx (idx)}
          <div class="kt-card">
            <p class="kt-quote">{testimonials[idx]}</p>
          </div>
        {/each}
      </div>

      <button
        on:click={nextTestimonial}
        class="kt-nav-btn kt-nav-next"
        type="button"
        aria-label="Next testimonial"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</section>

<style>
  .kt-feedback-section .kt-heading {
    font-family: 'Poppins', sans-serif;
    font-size: 1.6rem;
    line-height: 1.3;
    letter-spacing: 0.01em;
    color: #1A1A1A;
  }

  .kt-feedback-section .testimonial-title {
    margin-bottom: 2rem;
  }

  .kt-feedback-section .kt-carousel-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 10px;
  }

  .kt-feedback-section .kt-cards-row {
    display: flex;
    gap: 24px;
    flex: 1;
    justify-content: center;
  }

  .kt-feedback-section .kt-card {
    background-color: #FFF5F5;
    border-radius: 16px;
    padding: 32px 28px;
    flex: 1 1 0;
    min-width: 0;
    max-width: 460px;
    text-align: left;
    display: flex;
    align-items: center;
    box-shadow: 0 20px 25px rgba(200, 16, 46, 0.25);
    border: 1px solid rgba(200, 16, 46, 0.08);
  }

  .kt-feedback-section .kt-quote {
    font-family: 'Inter', sans-serif;
    font-size: 0.92rem;
    line-height: 1.65;
    color: #1A1A1A;
    font-weight: 400;
    letter-spacing: 0.01em;
    margin: 0;
  }

  .kt-feedback-section .kt-nav-btn {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 1px solid #E5E5E5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .kt-feedback-section .kt-nav-btn:hover {
    background-color: #FFF5F5;
    border-color: #C8102E;
  }

  .kt-feedback-section .kt-nav-btn i {
    font-size: 1.1rem;
    color: #1A1A1A;
  }

  @media (max-width: 900px) {
    .kt-feedback-section .kt-cards-row {
      flex-direction: column;
    }

    .kt-feedback-section .kt-card {
      max-width: 100%;
    }

    .kt-feedback-section .kt-carousel-wrap {
      align-items: flex-start;
    }
  }
</style>