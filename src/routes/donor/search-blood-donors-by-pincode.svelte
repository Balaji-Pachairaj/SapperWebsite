<svelte:head>
  <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Easily Find Blood Donors Near You with Pincode Search - Kurudhi.com.</title>
<meta name="description" content="Looking for local blood donors near you? Visit Kurudhi.com and find donors using our pincode search. Make a lifesaving impact today!">
<meta name="author" content="J S Raghavan">
<meta name="copyright" content="Bumble Bees IT Solutions">
<meta name="robots" content="index, follow">
</svelte:head>

<script>
  import Banner from "../../components/InnerBanner.svelte";
  import { getDatabase, ref, get } from "firebase/database";
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';
  import toastr from "toastr";

  // Firebase initialization
  import { firebaseApp } from "../../firebase";

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

  const noimage = {
    img: "./images/no-data-pana.svg"
  };

  const db = getDatabase(firebaseApp);
  let pincode = "";
  let state = "";
  let division = "";
  let city = "";
  let error = "";
  let bloodGroup = "";
  let filteredData = [];

  let selectedOption = '';
  let dropdownOptions = [];
  let isLoading = false;

  // Navigation function
  function viewUserProfile(uid) {
    event.preventDefault();
    goto(`donor/${uid}`, { state: { value: uid } });
  }

  // Apply filter function
  const applyFilter = async () => {

    if (!pincode || !bloodGroup) {
      toastr.error("Please fill in all required fields.");
      return;
    }

    isLoading = true;

    try {
      const snapshot = await get(ref(db, 'users'));
      const tempData = [];

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();

        if (data.pincode === pincode && data.bloodGroup === bloodGroup) {
          tempData.push({
            uid: data.uid,
            fullName: data.fullName,
            age: data.age,
            gender: data.gender,
            email: data.email,
            phoneNumber: data.phoneNumber,
            whatsapp: data.whatsapp
          });
        }
      });

      // Shuffle the filteredData array
      shuffleArray(tempData);

      // Update filteredData with the shuffled array
      filteredData = tempData;

      resetAddressData();
    } catch (err) {
      error = err.message || 'Error fetching data from Firebase';
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

  // Reactive update of results count
  $: noofresults = filteredData.length;

  // Whether the pincode looks valid and address data has been resolved
  $: pincodeConfirmed = pincode.length === 6 && dropdownOptions.length > 0 && !error;

  // Initials helper for the donor avatar
  function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  // Fetch initial data on component mount
  onMount(() => {
    applyFilter();
  });

  // Handle pincode input
  async function handlePincodeInput(event) {
    pincode = event.target.value;

    if (pincode.length === 6) {
      await fetchAddressData();
    } else {
      resetAddressData();
    }
  }

  // Fetch address data based on pincode
  async function fetchAddressData() {
    try {
      const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Invalid pincode. Please enter a valid 6-digit pincode.");
      }

      const data = await response.json();

      if (data.length > 0 && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        state = postOffice.State;
        division = postOffice.Division;
        city = postOffice.Name;
        dropdownOptions = data[0].PostOffice.map(po => po.Name);
        error = ""; // Reset the error if data is fetched successfully
      } else {
        throw new Error("Invalid pincode. Please enter a valid 6-digit pincode.");
      }
    } catch (err) {
      resetAddressData(); // Reset address data if an error occurs
      error = err.message || "An error occurred while fetching data. Please try again.";
    }
  }

  // Reset address data function
  function resetAddressData() {
    state = "";
    division = "";
    city = "";
    dropdownOptions = [];
    error = "";
  }
</script>


<div class="main-page-wrapper">
  <div>
    <Banner title="Search blood donors near you using a pincode" />
  </div>

  <section class="ksd-search-section">
    <div class="container">
      <div class="row">
        <div class="col-12">

          <div class="ksd-card">
            <div class="ksd-card-head">
              <span class="ksd-eyebrow">Search</span>
              <h3 class="ksd-title">Find a donor near you</h3>
              <p class="ksd-subtitle">Enter your pincode, then pick your area and blood group.</p>
            </div>

            <div class="ksd-fields">

              <div class="ksd-field">
                <label class="ksd-label" for="ksd-pincode">
                  <i class="bi bi-signpost"></i> 1. Pincode
                </label>
                <div class="ksd-input-wrap">
                  <input
                    id="ksd-pincode"
                    class="ksd-input"
                    class:ksd-input-valid={pincodeConfirmed}
                    type="text"
                    on:input={handlePincodeInput}
                    inputmode="numeric"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    minlength="5"
                    maxlength="6"
                    pattern="[0-9]*"
                    placeholder="e.g. 641001"
                    bind:value={pincode}
                    autocomplete="off"
                  />
                  {#if pincodeConfirmed}
                    <i class="bi bi-check-circle-fill ksd-valid-icon"></i>
                  {/if}
                </div>
              </div>

              <div class="ksd-field">
                <label class="ksd-label" for="ksd-area">
                  <i class="bi bi-radar"></i> 2. Your area
                </label>
                <select
                  id="ksd-area"
                  class="ksd-input"
                  bind:value={selectedOption}
                  disabled={dropdownOptions.length === 0}
                >
                  <option disabled hidden value="">
                    {dropdownOptions.length === 0 ? "Enter pincode first" : "Select your area"}
                  </option>
                  {#each dropdownOptions as option (option)}
                    <option value={option}>{option}</option>
                  {/each}
                </select>
              </div>

              <div class="ksd-field">
                <label class="ksd-label" for="ksd-bloodgroup">
                  <i class="bi bi-droplet"></i> 3. Blood group
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
                on:click|preventDefault={applyFilter}
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
              {#each filteredData as {uid, fullName, age, gender, email, phoneNumber, whatsapp}}
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

          {:else}
            <div class="ksd-status-block">
              <img src="{noimage.img}" alt="No donors found" class="ksd-status-img" />
              <p>No donors found. Try a different pincode or blood group.</p>
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
    grid-template-columns: repeat(3, 1fr);
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
    padding: 0 44px 0 16px;
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

  .ksd-input:disabled {
    background: #F5F1F1;
    color: #A69A9A;
    cursor: not-allowed;
  }

  select.ksd-input {
    padding-right: 16px;
  }

  .ksd-input-valid {
    border-color: #2F9E58;
    background: #F3FBF6;
  }

  .ksd-valid-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #2F9E58;
    font-size: 20px;
    pointer-events: none;
  }

  .ksd-error-text {
    color: #C41E3A;
    font-size: 15px;
    margin: 0 0 16px 0;
  }

  .ksd-error-text i {
    margin-right: 4px;
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