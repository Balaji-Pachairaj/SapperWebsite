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
  
    let activeTestimonial = 0;
  
    function nextTestimonial() {
      activeTestimonial = (activeTestimonial + 1) % Object.keys(testimonials).length;
    }
  
    function prevTestimonial() {
      activeTestimonial = (activeTestimonial - 1 + Object.keys(testimonials).length) % Object.keys(testimonials).length;
    }
  </script>
  
  <section class="feedback-section-three position-relative mt-170 xl-mt-150 lg-mt-100 mb-100">
    <div class="container position-relative">
      <div class="row">
        <div class="col-xl-6 col-lg-7 col-md-8 m-auto">
          <div class="title-two text-center">
            <img src="images/icon/icon_22.svg" alt="" class="lazy-img me-auto ms-auto mb-10" style="">
            <h2 class="fw-600 color-blue" style="font-size: 1.6rem; line-height: 1.3; letter-spacing: 0.01em;">Check what our users have to say.</h2>
          </div>
        </div>
      </div>
  
      <div id="feedBack_carousel" class="carousel slide mt-55 lg-mt-30" data-bs-ride="carousel">
        <div class="row">
          <div class="col-xxl-9 col-lg-8 col-md-10 m-auto">
            <div class="carousel-inner text-center">
              {#each Object.entries(testimonials) as [index, testimonial]}
                <div class="carousel-item {index == activeTestimonial ? 'active' : ''}" data-bs-interval="1000000">
                  <p class="testimonial-text" style="font-size: 1.5rem;">{testimonial}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>
        <button on:click={prevTestimonial} class="carousel-control-prev carousel-btn" type="button" data-bs-target="#feedBack_carousel" data-bs-slide="prev" fdprocessedid="v6nrsk">
          <i class="bi bi-chevron-left"></i>
          <span class="visually-hidden">Previous</span>
        </button>
        <button on:click={nextTestimonial} class="carousel-control-next carousel-btn" type="button" data-bs-target="#feedBack_carousel" data-bs-slide="next" fdprocessedid="ndgwpm">
          <i class="bi bi-chevron-right"></i>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </section>