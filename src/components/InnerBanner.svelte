<script>
    export let title = 'About us'; // Default title
    export let pageLinks = []; // Default page links
  </script>
  
  <svelte:head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css" integrity="sha512-oAvZuuYVzkcTc2dH5z1ZJup5OmSQ000qlfRvuoTTiyTBjwX1faoyearj8KdMq0LgsBTHMrRuMek7s+CxF8yE+w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  </svelte:head>
  
  <div class="inner-banner-one position-relative">
    <div class="container">
      <div class="position-relative">
        <div class="row">
          <div class="col-xl-8 m-auto text-center">
            <div class="title-two">
              <h2 class="text-black" style="font-size: 2rem; line-height: 1.3;">{title}</h2>
            </div>
            <ul class="style-none d-flex justify-content-center page-pagination mt-15 text-black" style="font-size: 0.95rem;">
              {#each pageLinks as link (link)}
                <li class="text-black">
                  {#if link.url}
                    <a href={link.url}>{link.text}</a>
                  {:else}
                    {link.text}
                  {/if}
                </li>
                {#if link.url}<li><i style="color:#000;" class="bi bi-chevron-right"></i></li>{/if}
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>
   
  </div>
  