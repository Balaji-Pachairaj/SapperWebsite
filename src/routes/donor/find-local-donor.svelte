<svelte:head>
  <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Easily Find Blood Donors Near You on Kurudhi.com</title>
<meta name="description" content="Search for blood donors in your location effortlessly with Kurudhi.com">
<meta name="author" content="J S Raghavan">
<meta name="copyright" content="Bumble Bees IT Solutions">
<meta name="robots" content="index, follow">
</svelte:head>

<script>
  import { getDatabase, ref, get } from "firebase/database";
  import { onMount, afterUpdate } from "svelte";
  import axios from "axios";
  import { firebaseApp } from "../../firebase";
  import _ from "lodash";
  import { readable } from "svelte/store";
  import { goto } from "@sapper/app";

  import toastr from "toastr";

  onMount(() => {
  const params = new URLSearchParams(window.location.search);

  inputValue = params.get("city") || "";
  selectedSuggestion = params.get("city") || null;
  bloodGroup = params.get("type") || "";

  if (inputValue && bloodGroup) {
    applyFilter();
  }
});

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-bottom-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
  };


  // Import Banner if it's a component
  import Banner from "../../components/InnerBanner.svelte";

  const db = getDatabase(firebaseApp);

  let noimage = { img: "./images/no-data-pana.svg" };

  let isLoading = false;
  let error = "";
  let noofresults = 0;
  let currentPage = 1;
  let itemsPerPage = 20;
  let pages = [];
  let filteredDataArray = [];



  // Function to show success notification
  const showSuccessNotification = (message) => {
    toastr.success(message);
  };

  // Function to show error notification
  const showErrorNotification = (message) => {
    toastr.error(message);
  };



  // Define the filteredData store
  function viewUserProfile(uid) {
    event.preventDefault();
    goto(`donor/${uid}`, { state: { value: uid } });
  }

  // Helper for the donor avatar initials
  function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  // Let the person clear their chosen area and pick again
  function clearSelectedLocation() {
    inputValue = "";
    selectedSuggestion = null;
    suggestions = [];
  }

  const applyFilter = async (event) => {
    if (!selectedSuggestion || !bloodGroup) {
      toastr.error("Please fill in all required fields.");
      return;
    }

    isLoading = true;

    try {
      const snapshot = await get(ref(db, "users"));

      filteredDataArray = [];

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();

        if (
          ((data.city && data.city.includes(selectedSuggestion)) ||
            (data.area && data.area.includes(selectedSuggestion))) &&
          data.bloodGroup === bloodGroup
        ) {
          filteredDataArray.push({
            uid: data.uid,
            fullName: data.fullName,
            age: data.age,
            gender: data.gender,
            email: data.email,
            phoneNumber: data.phoneNumber,
            whatsapp: data.whatsapp,
          });
        }
      });

      // Shuffle the filteredDataArray
      shuffleArray(filteredDataArray);

      noofresults = filteredDataArray.length;

      // Update the store
    } catch (err) {
      error = err.message || "Error fetching data from Firebase";
    } finally {
      isLoading = false;
    }
  };

  // Function to shuffle array elements
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };


  const filteredData = readable([], (set) => {
    // Initial call to applyFilter
    applyFilter();

    // Return cleanup function
    return () => {};
  });



  $: noofresults = filteredDataArray.length;
  $: pages = Array.from(
    { length: Math.ceil(noofresults / itemsPerPage) },
    (_, index) => index + 1
  );



  let inputValue = "";
  let suggestions = [];
  let selectedSuggestion = null;
  let bloodGroup = ""; // Assuming bloodGroup should be declared
 // Declaring applyFilter function

  const debouncedFetchLocationSuggestions = _.debounce(
    fetchLocationSuggestions,
    300
  );

  const nominatimApiUrl = "https://nominatim.openstreetmap.org/search";

  async function fetchLocationSuggestions() {
    try {
      if (!inputValue) {
        suggestions = [];
        return;
      }

      const response = await axios.get(nominatimApiUrl, {
        params: {
          q: inputValue,
          format: "json",
          limit: 5,
        },
      });

      if (response.data && response.data.length > 0) {
        suggestions = response.data.map((result, index) => ({
          name: result.display_name.split(",").shift(),
          key: `${result.display_name}-${index}`,
        }));
      } else {
        suggestions = [{ name: inputValue, key: `custom-${inputValue}` }];
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }

  function handleSuggestionClick(city) {
    inputValue = city;
    selectedSuggestion = city;
    suggestions = [];
  }

  function handleKeyDown(event, suggestion) {
    if (event.key === "Enter") {
      handleSuggestionClick(suggestion);
    }
  }

  function goToNextPage() {
    if (currentPage < pages.length) {
      currentPage += 1;
      applyFilter();
    }
  }

  function goToPage(page) {
    currentPage = page;
    applyFilter();
  }

  afterUpdate(() => {
    debouncedFetchLocationSuggestions();
  });

  let visiblePages;

  $: visiblePages = pages.slice(currentPage - 1, currentPage + 4);
</script>


<div class="main-page-wrapper">
  <div>
    <Banner title="Search blood donors near you using a Location" />
  </div>

  <section class="ksd-search-section">
    <div class="container">
      <div class="row">
        <div class="col-12">

          <div class="ksd-card">
            <div class="ksd-card-head">
              <span class="ksd-eyebrow">Search</span>
              <h3 class="ksd-title">Find a donor near you</h3>
              <p class="ksd-subtitle">Type your city or area, then choose a blood group.</p>
            </div>

            <div class="ksd-fields">

              <div class="ksd-field ksd-field-location">
                <label class="ksd-label" for="ksd-location">
                  <i class="bi bi-radar"></i> 1. Your location
                </label>

                {#if selectedSuggestion}
                  <div class="ksd-chosen-chip">
                    <i class="bi bi-geo-alt-fill"></i>
                    <span>{selectedSuggestion}</span>
                    <button type="button" class="ksd-chip-clear" on:click={clearSelectedLocation} aria-label="Change location">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                {:else}
                  <div class="ksd-input-wrap">
                    <input
                      id="ksd-location"
                      class="ksd-input"
                      type="text"
                      bind:value={inputValue}
                      placeholder="e.g. Coimbatore"
                      on:input={debouncedFetchLocationSuggestions}
                      autocomplete="off"
                    />

                    {#if suggestions.length > 0}
                      <div class="ksd-suggestions">
                        {#each suggestions as { name, key }}
                          <div
                            class="ksd-suggestion-item"
                            on:click={() => handleSuggestionClick(name)}
                            on:keydown={(event) => handleKeyDown(event, name)}
                            tabindex="0"
                            role="button"
                            aria-label={`Select ${name}`}
                            {key}
                          >
                            <i class="bi bi-geo-alt"></i> {name}
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>

              <div class="ksd-field">
                <label class="ksd-label" for="ksd-bloodgroup">
                  <i class="bi bi-droplet"></i> 2. Blood group
                </label>
                <select
                  id="ksd-bloodgroup"
                  class="ksd-input"
                  bind:value={bloodGroup}
                  name="bloodGroupType"
                  required
                >
                  <option disabled hidden value="">Choose blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="A1+">A1+</option>
                  <option value="A1-">A1-</option>
                  <option value="A1B+">A1B+</option>
                  <option value="A1B-">A1B-</option>
                  <option value="A2+">A2+</option>
                  <option value="A2-">A2-</option>
                  <option value="A2B+">A2B+</option>
                  <option value="A2B-">A2B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="Bombay Blood Group">Bombay Blood Group</option>
                  <option value="INRA">INRA</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

            </div>

            {#if error}
              <p class="ksd-error-text"><i class="bi bi-exclamation-circle"></i> {error}</p>
            {/if}

            <div class="ksd-action-row">
              <a href
                on:click={(event) => { event.preventDefault(); applyFilter(); }}
                class="ksd-search-btn">
                <i class="bi bi-search"></i> Search donors
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <section class="ksd-results-section">
    <div class="container">
      <div class="row">
        <div class="col-xl-12 col-lg-8">

          {#if isLoading}
            <div class="ksd-status-block">
              <i class="bi bi-arrow-repeat ksd-spin"></i>
              <p>Looking for donors…</p>
            </div>
          {:else if noofresults > 0}

            <div class="ksd-results-count">
              <span class="ksd-results-count-num">{noofresults}</span> donor{noofresults === 1 ? '' : 's'} found
            </div>

            <div class="ksd-results-grid">
              {#each filteredDataArray as {uid, fullName, age, gender, email, phoneNumber, whatsapp}}
                <div class="ksd-donor-card">
                  <button
                    type="button"
                    class="ksd-donor-save"
                    aria-label="Save donor"
                  ><i class="bi bi-heart"></i></button>

                  <div class="ksd-donor-avatar">{getInitials(fullName)}</div>

                  <button
                    type="button"
                    class="ksd-donor-name"
                    on:click={() => viewUserProfile(uid)}
                  >{fullName}</button>
                  <div class="ksd-donor-meta">{age} yrs &middot; {gender}</div>
                  <div class="ksd-donor-email">{email}</div>

                  <div class="ksd-donor-contact-row">
                    <a href="tel:{phoneNumber}" class="ksd-contact-pill">
                      <i class="bi bi-telephone-fill"></i> Call
                    </a>
                    <a href="https://wa.me/{whatsapp}" class="ksd-contact-pill ksd-contact-pill-whatsapp" target="_blank" rel="noopener">
                      <i class="bi bi-whatsapp"></i> WhatsApp
                    </a>
                  </div>

                  <button
                    type="button"
                    class="ksd-donor-view-btn"
                    on:click={() => viewUserProfile(uid)}
                  >View full profile</button>
                </div>
              {/each}
            </div>

            {#if pages.length > 1}
              <div class="ksd-pagination-row">
                <p class="ksd-pagination-summary">
                  Showing <strong>1 to {Math.min(itemsPerPage, filteredDataArray.length)}</strong>
                  of <strong>{filteredDataArray.length}</strong>
                </p>
                <ul class="ksd-pagination">
                  {#if currentPage > 1}
                    <li>
                      <button type="button" class="ksd-page-btn" on:click={() => goToPage(currentPage - 1)}>
                        <i class="bi bi-chevron-left"></i> Prev
                      </button>
                    </li>
                  {/if}
                  {#each visiblePages as page}
                    <li>
                      <button
                        type="button"
                        class="ksd-page-btn"
                        class:ksd-page-btn-active={page === currentPage}
                        on:click={() => goToPage(page)}
                      >{page}</button>
                    </li>
                  {/each}
                  {#if currentPage < pages.length}
                    <li>
                      <button type="button" class="ksd-page-btn" on:click={() => goToPage(currentPage + 1)}>
                        Next <i class="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  {/if}
                </ul>
              </div>
            {/if}

          {:else}
            <div class="ksd-status-block">
              <img src="{noimage.img}" alt="No donors found" class="ksd-status-img" />
              <p>No donors found. Try a different area or blood group.</p>
            </div>
          {/if}

        </div>
      </div>
    </div>
  </section>
</div>

<style>
  /* ===== Layout sections ===== */
  .ksd-search-section {
    padding: 60px 0 30px;
  }
  .ksd-results-section {
    padding: 10px 0 100px;
  }

  /* ===== Search card ===== */
  .ksd-card {
    background: #FFFFFF;
    border: 1px solid #F0DEDE;
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 10px 30px rgba(196, 30, 58, 0.07);
  }

  .ksd-card-head {
    margin-bottom: 28px;
  }

  .ksd-eyebrow {
    display: inline-block;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #C41E3A;
    margin-bottom: 8px;
  }

  .ksd-title {
    font-size: 26px;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0 0 6px 0;
  }

  .ksd-subtitle {
    font-size: 16px;
    color: #6B6060;
    margin: 0;
  }

  /* ===== Fields ===== */
  .ksd-fields {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 900px) {
    .ksd-fields {
      grid-template-columns: 1fr;
    }
  }

  .ksd-field {
    display: flex;
    flex-direction: column;
  }

  .ksd-field-location {
    position: relative;
  }

  .ksd-label {
    font-size: 15px;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 8px;
  }

  .ksd-label i {
    color: #C41E3A;
    margin-right: 4px;
  }

  .ksd-input-wrap {
    position: relative;
  }

  .ksd-input {
    width: 100%;
    height: 56px;
    font-size: 16px;
    border: 1.5px solid #E6DADA;
    border-radius: 12px;
    padding: 0 16px;
    color: #1A1A1A;
    background: #FFF9F9;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .ksd-input::placeholder {
    color: #A69A9A;
  }

  .ksd-input:focus {
    outline: none;
    border-color: #C41E3A;
    background: #FFFFFF;
  }

  select.ksd-input {
    padding-right: 16px;
  }

  .ksd-error-text {
    color: #C41E3A;
    font-size: 15px;
    margin: 0 0 16px 0;
  }

  .ksd-error-text i {
    margin-right: 4px;
  }

  /* ===== Location suggestions dropdown ===== */
  .ksd-suggestions {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #FFFFFF;
    border: 1px solid #F0DEDE;
    border-radius: 12px;
    box-shadow: 0 12px 28px rgba(26, 26, 26, 0.12);
    overflow: hidden;
    z-index: 20;
  }

  .ksd-suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    font-size: 16px;
    color: #1A1A1A;
    cursor: pointer;
  }

  .ksd-suggestion-item i {
    color: #C41E3A;
  }

  .ksd-suggestion-item:hover,
  .ksd-suggestion-item:focus {
    background: #FFF5F5;
    outline: none;
  }

  .ksd-suggestion-item + .ksd-suggestion-item {
    border-top: 1px solid #F5EAEA;
  }

  /* ===== Chosen location chip ===== */
  .ksd-chosen-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 56px;
    border: 1.5px solid #2F9E58;
    background: #F3FBF6;
    border-radius: 12px;
    padding: 0 14px;
    font-size: 16px;
    color: #1A1A1A;
  }

  .ksd-chosen-chip i.bi-geo-alt-fill {
    color: #2F9E58;
  }

  .ksd-chosen-chip span {
    flex: 1;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ksd-chip-clear {
    background: #FFFFFF;
    border: 1px solid #E6DADA;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: #6B6060;
    cursor: pointer;
  }

  .ksd-chip-clear:hover {
    color: #C41E3A;
    border-color: #C41E3A;
  }

  /* ===== Search button ===== */
  .ksd-action-row {
    display: flex;
    justify-content: center;
    padding-top: 8px;
    border-top: 1px solid #F5EAEA;
  }

  .ksd-search-btn {
    margin-top: 20px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #C41E3A;
    color: #FFFFFF;
    font-size: 17px;
    font-weight: 600;
    border-radius: 999px;
    padding: 16px 40px;
    text-decoration: none;
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .ksd-search-btn:hover {
    background: #A01729;
    color: #FFFFFF;
    transform: translateY(-1px);
  }

  /* ===== Results ===== */
  .ksd-results-count {
    font-size: 17px;
    color: #6B6060;
    padding: 20px 4px;
  }

  .ksd-results-count-num {
    font-weight: 700;
    color: #1A1A1A;
    font-size: 19px;
  }

  .ksd-results-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @media (max-width: 1200px) {
    .ksd-results-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media (max-width: 900px) {
    .ksd-results-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    .ksd-results-grid {
      grid-template-columns: 1fr;
    }
  }

  .ksd-donor-card {
    position: relative;
    background: #FFFFFF;
    border: 1px solid #F0DEDE;
    border-radius: 18px;
    padding: 24px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 6px 18px rgba(26, 26, 26, 0.05);
  }

  .ksd-donor-save {
    position: absolute;
    top: 14px;
    right: 14px;
    background: #FFF5F5;
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    color: #C41E3A;
    font-size: 15px;
    cursor: pointer;
  }

  .ksd-donor-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #FFF5F5;
    color: #C41E3A;
    font-size: 22px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }

  .ksd-donor-name {
    background: none;
    border: none;
    padding: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1A1A1A;
    cursor: pointer;
  }

  .ksd-donor-name:hover {
    color: #C41E3A;
  }

  .ksd-donor-meta {
    font-size: 15px;
    color: #6B6060;
    margin-top: 4px;
  }

  .ksd-donor-email {
    font-size: 14px;
    color: #A69A9A;
    margin-top: 6px;
    word-break: break-word;
  }

  .ksd-donor-contact-row {
    display: flex;
    gap: 8px;
    margin-top: 18px;
    width: 100%;
  }

  .ksd-contact-pill {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 8px;
    border-radius: 999px;
    text-decoration: none;
    background: #FFF5F5;
    color: #C41E3A;
  }

  .ksd-contact-pill-whatsapp {
    background: #EAF9EF;
    color: #2F9E58;
  }

  .ksd-donor-view-btn {
    margin-top: 14px;
    width: 100%;
    background: #1A1A1A;
    color: #FFFFFF;
    border: none;
    border-radius: 10px;
    padding: 12px 0;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }

  .ksd-donor-view-btn:hover {
    background: #C41E3A;
  }

  /* ===== Pagination ===== */
  .ksd-pagination-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    margin-top: 40px;
  }

  .ksd-pagination-summary {
    font-size: 15px;
    color: #6B6060;
    margin: 0;
  }

  .ksd-pagination {
    display: flex;
    align-items: center;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ksd-page-btn {
    min-width: 44px;
    height: 44px;
    padding: 0 14px;
    border-radius: 10px;
    border: 1.5px solid #E6DADA;
    background: #FFFFFF;
    color: #1A1A1A;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }

  .ksd-page-btn:hover {
    border-color: #C41E3A;
    color: #C41E3A;
  }

  .ksd-page-btn-active {
    background: #C41E3A;
    border-color: #C41E3A;
    color: #FFFFFF;
  }

  /* ===== Empty / loading states ===== */
  .ksd-status-block {
    text-align: center;
    padding: 60px 20px;
    color: #6B6060;
    font-size: 16px;
  }

  .ksd-status-img {
    max-width: 220px;
    margin: 0 auto 20px;
  }

  .ksd-spin {
    font-size: 30px;
    color: #C41E3A;
    display: inline-block;
    margin-bottom: 10px;
    animation: ksd-spin 1s linear infinite;
  }

  @keyframes ksd-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>