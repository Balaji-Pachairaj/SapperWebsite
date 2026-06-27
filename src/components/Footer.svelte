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
    { text: "Covid-19", link: "/CovidChart" },
    { text: "Refer Your Friends", link: "/refer" },
    { text: "Donate", link: "/program/donate" },
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
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css"
    integrity="sha512-oAvZuuYVzkcTc2dH5z1ZJup5OmSQ000qlfRvuoTTiyTBjwX1faoyearj8KdMq0LgsBTHMrRuMek7s+CxF8yE+w=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</svelte:head>

<div class="footer-one">
  <div class="container">
    <div class="inner-wrapper">
      <div class="row">
        <div class="col-lg-3 col-md-3 footer-intro mb-6">
          <div class="logo mb-15">
            <a href="index.html" class="d-flex align-items-center">
              <img src="/images/logo/logo.png" alt="Logo" style="height: auto; width: 14rem;" />
            </a>
            <div class="mt-4">
              <p>{browserVersion}</p>
              <p class="showos">{browserLanguage} | {osplatform}</p>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 mb-6">
          <h5 class="footer-title">Services​</h5>
          <ul class="footer-nav-link style-none">
            {#each services as service (service.text)}
              <li key={service.text}><a href={service.link}>{service.text}</a></li>
            {/each}
          </ul>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 mb-6">
          <h5 class="footer-title">Company</h5>
          <ul class="footer-nav-link style-none">
            {#each company as c (c.text)}
              <li><a href={c.link}>{c.text}</a></li>
            {/each}
          </ul>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 mb-6">
          <h5 class="footer-title">Support</h5>
          <ul class="footer-nav-link style-none">
            {#each support as s (s.text)}
              <li key={s.text}><a href={s.link}>{s.text}</a></li>
            {/each}
          </ul>
        </div>
               <!-- <div class="col-lg-3 mb-6 footer-newsletter">
                <p style="font-size: 1.1rem; font-family: 'McLaren', sans-serif;">
                  Powered by
                </p>
                <img
                  style="width: 8rem; height:auto;"
                  src="images/f-logo.svg"
                  alt="Company Logo"
                  class="company-logo"
                />
              </div> -->
      </div>
    </div>
    <!-- /.inner-wrapper -->
  </div>
  <div class="bottom-footer">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-4 order-lg-3 mb-15">
          <ul
            class="style-none d-flex order-lg-last justify-content-center justify-content-lg-end social-icon"
          >
            <li><a href="/"><i class="bi bi-whatsapp" /></a></li>
            <li><a href="/"><i class="bi bi-facebook" /></a></li>
            <li><a href="/"><i class="bi bi-twitter-x" /></a></li>
            <li><a href="/"><i class="bi bi-instagram" /></a></li>
          </ul>
        </div>
        <div class="col-lg-4 order-lg-1 mb-15">
          <ul
            class="d-flex style-none bottom-nav justify-content-center justify-content-lg-start"
          >
            {#each bottomLinks as link (link.text)}
              <li><a href={link.link}>{link.text}</a></li>
            {/each}
          </ul>
        </div>
        <div class="col-lg-4 order-lg-2">
          <p class="text-center mb-15">{copyright}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=McLaren&display=swap");

  /* Style for the p tag */
  .showos {
    font-size: 16px; /* Adjust the font size as needed */
    color: #333; /* Text color */
    margin: 0; /* Remove any default margins */
    display: inline; /* Display the p tags inline */
  }

  /* Style for the separator (|) between browserLanguage and osplatform */
  .showos::before {
    /* Separator content */
    margin: 0 8px; /* Adjust the spacing as needed */
    color: #666; /* Separator color */
  }
</style>
