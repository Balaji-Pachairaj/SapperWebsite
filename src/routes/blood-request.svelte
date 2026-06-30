<svelte:head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Need blood urgently? Get quick and easy help at Kurudhi.com</title>
  <meta name="description" content="Need blood urgently? Get quick and easy help at Kurudhi.com with just one click. You can easily request blood on their website.">
  <meta name="author" content="J S Raghavan">
  <meta name="copyright" content="Bumble Bees IT Solutions">
  <meta name="robots" content="index, follow">
</svelte:head>

<script>
  import Banner from '../components/InnerBanner.svelte';
  import { onMount } from 'svelte';
  import _ from 'lodash';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import Toastify from "toastify-js";
  import { goto } from '@sapper/app';
  import toastr from "toastr";

  let city = '';
  let suggestions = [];
  let selectedSuggestion = null;
  let fetchError = null;
  let checkboxChecked = false;
  let lastFetchId = 0;
  let isSubmitting = false;

  let AttenderName = "";
  let patentName = "";
  let AttePhoneNumber = "";
  let bloodGroup = "";
  let Unit = "";
  let bloodRequiredDate = "";

  // touched state — drives inline validation styling without being noisy on first paint
  let touched = {
    patentName: false,
    AttenderName: false,
    AttePhoneNumber: false,
    bloodGroup: false,
    Unit: false,
    bloodRequiredDate: false,
    city: false,
  };

  const bloodGroups = [
    "A+", "A-", "A1+", "A1-", "A1B+", "A1B-", "A2+", "A2-",
    "A2B+", "A2B-", "AB+", "AB-", "B+", "B-",
    "Bombay Blood Group", "INRA", "O+", "O-"
  ];

  const debouncedFetchLocationSuggestions = _.debounce(fetchLocationSuggestions, 300);

  const nominatimApiUrl = 'https://nominatim.openstreetmap.org/search';
  const indiaBoundingBox = '-68.18,6.75,97.4,35.9';

  async function fetchLocationSuggestions() {
    try {
      fetchError = null;

      if (!city) {
        suggestions = [];
        return;
      }

      const fetchId = ++lastFetchId;

      const response = await axios.get(nominatimApiUrl, {
        params: {
          q: city,
          format: 'json',
          limit: 5,
          bounded: 1,
          viewbox: indiaBoundingBox,
          countrycodes: 'IN',
        },
      });

      if (fetchId === lastFetchId) {
        if (response.data && response.data.length > 0) {
          suggestions = response.data.map((result, index) => ({
            name: result.display_name.split(',').shift(),
            key: `${result.display_name}-${index}`,
          }));
        } else {
          suggestions = [{ name: city, key: `custom-${city}` }];
        }
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      suggestions = [];
      fetchError = 'Could not fetch location suggestions. Please try again.';
    }
  }

  function handleSuggestionClick(selectedCity) {
    city = selectedCity;
    selectedSuggestion = selectedCity;
    suggestions = [];
  }

  function handleKeyDown(event, suggestion) {
    if (event.key === 'Enter') {
      handleSuggestionClick(suggestion);
    }
  }

  function handleCityInput() {
    selectedSuggestion = null;
    debouncedFetchLocationSuggestions();
  }

  function markTouched(field) {
    touched[field] = true;
  }

  // --- validation (kept logically identical to original, surfaced inline) ---
  $: errors = {
    patentName: !patentName ? 'Patient name is required.' : '',
    AttenderName: !AttenderName ? 'Attendee name is required.' : '',
    AttePhoneNumber: !AttePhoneNumber
      ? 'Attendee mobile number is required.'
      : (AttePhoneNumber.length !== 10 ? 'Enter a valid 10-digit mobile number.' : ''),
    bloodGroup: !bloodGroup ? 'Please choose a blood group.' : '',
    Unit: !Unit ? 'Quantity / unit is required.' : (Number(Unit) <= 0 ? 'Quantity must be greater than 0.' : ''),
    bloodRequiredDate: !bloodRequiredDate ? 'Required date is required.' : '',
    city: !city ? 'Address / location is required.' : '',
  };

  $: requiredFields = ['patentName', 'AttenderName', 'AttePhoneNumber', 'bloodGroup', 'Unit', 'bloodRequiredDate', 'city'];
  $: completedCount = requiredFields.filter((f) => !errors[f]).length;
  $: progressPct = Math.round((completedCount / requiredFields.length) * 100);
  $: formIsValid = completedCount === requiredFields.length;

  const toastrOptions = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: 'toast-bottom-full-width',
    preventDuplicates: true,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };

  const sendRequest = async () => {
    // mark everything touched so inline errors surface
    Object.keys(touched).forEach((k) => (touched[k] = true));

    if (!checkboxChecked) {
      toastr.options = toastrOptions;
      toastr.info('Please confirm that the provided information is accurate and correct.', 'Notification');
      return;
    }

    if (!formIsValid) {
      toastr.options = toastrOptions;
      toastr.info('All input fields are required.', 'Notification');
      return;
    }

    isSubmitting = true;

    try {
      Swal.fire({
        title: 'Request Sending ...!',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch('https://send-bulk-mail-kurudhi.onrender.com/send-bulk-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AttenderName,
          patentName,
          AttePhoneNumber,
          bloodGroup,
          Unit,
          bloodRequiredDate,
          city,
        }),
      });

      Swal.close();

      const result = await response.text();
      Swal.fire({
        icon: 'success',
        title: 'Your Request has been sent Successfully!',
        text: result,
        showConfirmButton: true,
        confirmButtonText: 'Go to Donor Search',
        allowOutsideClick: false,
      }).then((res) => {
        if (res.isConfirmed) {
          goto('donor/search-blood-donors-by-pincode');
        }
      });

      console.log(result);
    } catch (err) {
      console.error('Error sending email:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while sending the email. Please try again.',
      });
    } finally {
      isSubmitting = false;
    }
  };
</script>

<div class="main-page-wrapper">
  <div>
    <Banner title="Post your Blood Request" />
  </div>

  <section class="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
    <div class="container">
      <div class="kr-form-shell">

        <!-- left: context / signature element -->
        <aside class="kr-aside">
          <div class="kr-pulse-wrap" aria-hidden="true">
            <svg class="kr-drop" viewBox="0 0 64 80" style="--fill:{progressPct}%">
              <defs>
                <clipPath id="dropClip">
                  <path d="M32 2C32 2 8 34 8 52a24 24 0 0 0 48 0C56 34 32 2 32 2Z" />
                </clipPath>
              </defs>
              <path class="kr-drop-outline" d="M32 2C32 2 8 34 8 52a24 24 0 0 0 48 0C56 34 32 2 32 2Z" />
              <g clip-path="url(#dropClip)">
                <rect class="kr-drop-fill" x="0" y="0" width="64" height="80" />
              </g>
            </svg>
            <span class="kr-pulse-pct">{progressPct}%</span>
          </div>
          <h2 class="kr-aside-title">Every detail<br />gets you closer<br />to a donor.</h2>
          <p class="kr-aside-copy">
            Requests are matched against nearby registered donors in real time.
            Accurate details — group, quantity, and date — speed up the match.
          </p>
          <ul class="kr-aside-list">
            <li><span class="kr-dot"></span>Verified donor network</li>
            <li><span class="kr-dot"></span>Location-aware matching</li>
            <li><span class="kr-dot"></span>Instant request alerts</li>
          </ul>
        </aside>

        <!-- right: form -->
        <div class="kr-form-card">
          <div class="kr-form-head">
            <span class="kr-eyebrow">Blood Request</span>
            <h1 class="kr-title">Tell us who needs help</h1>
            <p class="kr-subtitle">Fill in the details below — every field marked * is required.</p>
          </div>

          <div class="kr-progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin="0" aria-valuemax="100">
            <div class="kr-progress-fill" style="width:{progressPct}%"></div>
          </div>

          <form on:submit|preventDefault={sendRequest} novalidate>
            <div class="kr-grid">

              <div class="kr-field" class:has-error={touched.patentName && errors.patentName} class:is-valid={patentName && !errors.patentName}>
                <label for="patentName">Patient Name <span class="req">*</span></label>
                <div class="kr-input-wrap">
                  <svg class="kr-icon" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.6-8 6v1h16v-1c0-3.4-3.6-6-8-6Z"/></svg>
                  <input
                    id="patentName"
                    type="text"
                    placeholder="Enter patient's full name"
                    bind:value={patentName}
                    on:blur={() => markTouched('patentName')}
                    autocomplete="off"
                  />
                </div>
                {#if touched.patentName && errors.patentName}
                  <span class="kr-error">{errors.patentName}</span>
                {/if}
              </div>

              <div class="kr-field" class:has-error={touched.AttenderName && errors.AttenderName} class:is-valid={AttenderName && !errors.AttenderName}>
                <label for="attenderName">Attendee Name <span class="req">*</span></label>
                <div class="kr-input-wrap">
                  <svg class="kr-icon" viewBox="0 0 24 24"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h8v-2.5C9 15 8.79 14.45 8 13.99V13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z"/></svg>
                  <input
                    id="attenderName"
                    type="text"
                    placeholder="Enter attendee's full name"
                    bind:value={AttenderName}
                    on:blur={() => markTouched('AttenderName')}
                    autocomplete="off"
                  />
                </div>
                {#if touched.AttenderName && errors.AttenderName}
                  <span class="kr-error">{errors.AttenderName}</span>
                {/if}
              </div>

              <div class="kr-field" class:has-error={touched.AttePhoneNumber && errors.AttePhoneNumber} class:is-valid={AttePhoneNumber && !errors.AttePhoneNumber}>
                <label for="attePhone">Attendee Mobile <span class="req">*</span></label>
                <div class="kr-input-wrap">
                  <svg class="kr-icon" viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.33 2.3.5 3.6.5a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.5 21 3 13.5 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.17 2.5.5 3.6a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>
                  <input
                    id="attePhone"
                    type="tel"
                    maxlength="10"
                    minlength="10"
                    placeholder="10-digit phone number"
                    bind:value={AttePhoneNumber}
                    on:input={(e) => (AttePhoneNumber = e.target.value.replace(/[^0-9]/g, ''))}
                    on:blur={() => markTouched('AttePhoneNumber')}
                    autocomplete="off"
                  />
                </div>
                {#if touched.AttePhoneNumber && errors.AttePhoneNumber}
                  <span class="kr-error">{errors.AttePhoneNumber}</span>
                {/if}
              </div>

              <div class="kr-field" class:has-error={touched.bloodGroup && errors.bloodGroup} class:is-valid={bloodGroup && !errors.bloodGroup}>
                <label for="bloodGroup">Blood Group <span class="req">*</span></label>
                <div class="kr-input-wrap">
                  <svg class="kr-icon" viewBox="0 0 24 24"><path d="M12 2C12 2 5 11 5 16a7 7 0 0 0 14 0c0-5-7-14-7-14Z"/></svg>
                  <select
                    id="bloodGroup"
                    bind:value={bloodGroup}
                    on:blur={() => markTouched('bloodGroup')}
                  >
                    <option disabled hidden value="">Choose blood group…</option>
                    {#each bloodGroups as group}
                      <option value={group}>{group}</option>
                    {/each}
                  </select>
                  <svg class="kr-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                </div>
                {#if touched.bloodGroup && errors.bloodGroup}
                  <span class="kr-error">{errors.bloodGroup}</span>
                {/if}
              </div>

              <div class="kr-field" class:has-error={touched.Unit && errors.Unit} class:is-valid={Unit && !errors.Unit}>
                <label for="unit">Quantity / Unit <span class="req">*</span></label>
                <div class="kr-input-wrap">
                  <svg class="kr-icon" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"/></svg>
                  <input
                    id="unit"
                    type="number"
                    min="1"
                    placeholder="Number of units needed"
                    bind:value={Unit}
                    on:blur={() => markTouched('Unit')}
                  />
                </div>
                {#if touched.Unit && errors.Unit}
                  <span class="kr-error">{errors.Unit}</span>
                {/if}
              </div>

              <div class="kr-field" class:has-error={touched.bloodRequiredDate && errors.bloodRequiredDate} class:is-valid={bloodRequiredDate && !errors.bloodRequiredDate}>
                <label for="txtDate">Required Date <span class="req">*</span></label>
                <div class="kr-input-wrap">
                  <svg class="kr-icon" viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 6h14v12H5V8Z"/></svg>
                  <input
                    id="txtDate"
                    type="date"
                    autocomplete="off"
                    bind:value={bloodRequiredDate}
                    on:blur={() => markTouched('bloodRequiredDate')}
                  />
                </div>
                {#if touched.bloodRequiredDate && errors.bloodRequiredDate}
                  <span class="kr-error">{errors.bloodRequiredDate}</span>
                {/if}
              </div>

              <div class="kr-field kr-field-full" class:has-error={touched.city && errors.city} class:is-valid={city && !errors.city}>
                <label for="location">Address / Location <span class="req">*</span></label>
                <div class="kr-input-wrap">
                  <svg class="kr-icon" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>
                  <input
                    type="text"
                    placeholder="Enter address or area / city"
                    id="location"
                    bind:value={city}
                    on:input={handleCityInput}
                    on:blur={() => markTouched('city')}
                    autocomplete="off"
                  />
                </div>
                {#if touched.city && errors.city}
                  <span class="kr-error">{errors.city}</span>
                {/if}
                {#if fetchError}
                  <span class="kr-error">{fetchError}</span>
                {/if}
                {#if suggestions.length > 0 && !selectedSuggestion}
                  <div class="kr-suggestions">
                    {#each suggestions as { name, key } (key)}
                      <div
                        class="kr-suggestion-item"
                        on:click={() => handleSuggestionClick(name)}
                        on:keydown={(event) => handleKeyDown(event, name)}
                        tabindex="0"
                        role="button"
                        aria-label={`Select ${name}`}
                      >
                        <svg class="kr-icon-sm" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>
                        {name}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>

              <div class="kr-field-full">
                <label class="kr-checkbox">
                  <input type="checkbox" bind:checked={checkboxChecked} />
                  <span class="kr-checkbox-box"></span>
                  <span class="kr-checkbox-text">I confirm that the provided information is accurate and correct</span>
                </label>
              </div>

              <div class="kr-field-full">
                <button type="submit" class="kr-submit" disabled={isSubmitting}>
                  {#if isSubmitting}
                    <span class="kr-spinner"></span> Sending…
                  {:else}
                    Send Request
                    <svg class="kr-send-icon" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7Z"/></svg>
                  {/if}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  :root {
    --kr-ink: #1c1326;
    --kr-muted: #6b6577;
    --kr-rose: #e11d48;
    --kr-rose-dark: #9f1239;
    --kr-cream: #fff8f6;
    --kr-line: rgba(28, 19, 38, 0.1);
    --kr-success: #0f9d6e;
  }

  .main-page-wrapper {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--kr-ink);
    background: var(--kr-cream);
  }

  .registration-section {
    background: var(--kr-cream);
  }

  .kr-form-shell {
    display: grid;
    grid-template-columns: 0.85fr 1.4fr;
    gap: 0;
    max-width: 1080px;
    margin: 0 auto;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 30px 70px -25px rgba(225, 29, 72, 0.25), 0 2px 8px rgba(28, 19, 38, 0.06);
    background: #fff;
  }

  /* --- Aside / signature element --- */
  .kr-aside {
    background: linear-gradient(165deg, #1c1326 0%, #3a1224 55%, #6b1027 100%);
    color: #fdf2f4;
    padding: 48px 38px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .kr-pulse-wrap {
    position: relative;
    width: 88px;
    height: 110px;
    margin-bottom: 28px;
  }

  .kr-drop {
    width: 64px;
    height: 80px;
  }

  .kr-drop-outline {
    fill: rgba(255, 255, 255, 0.08);
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1.5;
  }

  .kr-drop-fill {
    fill: #ff5470;
    transform: translateY(calc(80px - 80px * var(--fill, 0%) / 100));
    transition: transform 0.5s cubic-bezier(.4,0,.2,1);
  }

  .kr-pulse-pct {
    position: absolute;
    bottom: -2px;
    left: 0;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #ffd7dd;
  }

  .kr-aside-title {
    font-size: 30px;
    line-height: 1.2;
    font-weight: 700;
    margin: 0 0 14px;
    letter-spacing: -0.01em;
    color: white;
  }

  .kr-aside-copy {
    font-size: 14.5px;
    line-height: 1.6;
    color: #e6c3cb;
    margin: 0 0 26px;
  }

  .kr-aside-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 13.5px;
    color: #f6dee2;
  }

  .kr-aside-list li {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .kr-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ff5470;
    flex-shrink: 0;
    box-shadow: 0 0 0 4px rgba(255, 84, 112, 0.18);
  }

  /* --- Form card --- */
  .kr-form-card {
    padding: 48px 44px 40px;
  }

  .kr-form-head {
    margin-bottom: 22px;
  }

  .kr-eyebrow {
    display: inline-block;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--kr-rose);
    background: rgba(225, 29, 72, 0.08);
    padding: 5px 11px;
    border-radius: 999px;
    margin-bottom: 14px;
  }

  .kr-title {
    font-size: 27px;
    font-weight: 700;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }

  .kr-subtitle {
    font-size: 14px;
    color: var(--kr-muted);
    margin: 0;
  }

  .kr-progress-track {
    height: 5px;
    border-radius: 999px;
    background: rgba(28, 19, 38, 0.07);
    overflow: hidden;
    margin-bottom: 30px;
  }

  .kr-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--kr-rose), #ff5470);
    transition: width 0.4s cubic-bezier(.4,0,.2,1);
  }

  .kr-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 18px;
  }

  .kr-field-full {
    grid-column: 1 / -1;
  }

  .kr-field {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .kr-field label {
    font-size: 13px;
    font-weight: 600;
    color: var(--kr-ink);
    margin-bottom: 7px;
  }

  .req {
    color: var(--kr-rose);
  }

  .kr-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .kr-icon {
    position: absolute;
    left: 14px;
    width: 17px;
    height: 17px;
    fill: var(--kr-muted);
    pointer-events: none;
    transition: fill 0.2s;
  }

  .kr-icon-sm {
    width: 14px;
    height: 14px;
    fill: var(--kr-rose);
    flex-shrink: 0;
  }

  .kr-chevron {
    position: absolute;
    right: 14px;
    width: 16px;
    height: 16px;
    fill: var(--kr-muted);
    pointer-events: none;
  }

  input[type="text"],
  input[type="tel"],
  input[type="number"],
  input[type="date"],
  select {
    width: 100%;
    height: 50px;
    font-size: 14.5px;
    font-family: inherit;
    color: var(--kr-ink);
    background: #faf8f7;
    border: 1.5px solid var(--kr-line);
    border-radius: 12px;
    padding: 0 16px 0 42px;
    appearance: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }

  input::placeholder {
    color: #b5adbd;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: var(--kr-rose);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.1);
  }

  .kr-field:focus-within .kr-icon {
    fill: var(--kr-rose);
  }

  .kr-field.has-error input,
  .kr-field.has-error select {
    border-color: #e0455a;
    background: #fff4f5;
  }

  .kr-field.is-valid input,
  .kr-field.is-valid select {
    border-color: rgba(15, 157, 110, 0.4);
  }

  .kr-error {
    margin-top: 6px;
    font-size: 12px;
    color: #d9314a;
    font-weight: 500;
  }

  .kr-suggestions {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    max-height: 220px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid var(--kr-line);
    border-radius: 12px;
    box-shadow: 0 14px 32px -8px rgba(28, 19, 38, 0.18);
    z-index: 50;
    padding: 6px;
  }

  .kr-suggestion-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13.5px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .kr-suggestion-item:hover,
  .kr-suggestion-item:focus {
    background: rgba(225, 29, 72, 0.07);
    outline: none;
  }

  /* checkbox */
  .kr-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
    font-size: 13.5px;
    color: var(--kr-ink);
    user-select: none;
  }

  .kr-checkbox input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .kr-checkbox-box {
    width: 19px;
    height: 19px;
    flex-shrink: 0;
    border: 1.5px solid var(--kr-line);
    border-radius: 6px;
    background: #faf8f7;
    margin-top: 1px;
    position: relative;
    transition: background 0.15s, border-color 0.15s;
  }

  .kr-checkbox input:checked + .kr-checkbox-box {
    background: var(--kr-rose);
    border-color: var(--kr-rose);
  }

  .kr-checkbox input:checked + .kr-checkbox-box::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1px;
    width: 6px;
    height: 10px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .kr-checkbox input:focus-visible + .kr-checkbox-box {
    box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.25);
  }

  /* submit */
  .kr-submit {
    width: 100%;
    height: 52px;
    border: none;
    border-radius: 13px;
    background: linear-gradient(135deg, var(--kr-rose) 0%, var(--kr-rose-dark) 100%);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    cursor: pointer;
    margin-top: 6px;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 14px 28px -10px rgba(225, 29, 72, 0.55);
  }

  .kr-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 18px 34px -10px rgba(225, 29, 72, 0.6);
  }

  .kr-submit:active:not(:disabled) {
    transform: translateY(0);
  }

  .kr-submit:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .kr-send-icon {
    width: 16px;
    height: 16px;
    fill: #fff;
  }

  .kr-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: kr-spin 0.7s linear infinite;
  }

  @keyframes kr-spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 860px) {
    .kr-form-shell {
      grid-template-columns: 1fr;
    }
    .kr-aside {
      display: none;
    }
    .kr-form-card {
      padding: 34px 22px 30px;
    }
  }

  @media (max-width: 560px) {
    .kr-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .kr-drop-fill,
    .kr-progress-fill,
    .kr-submit {
      transition: none;
    }
    .kr-spinner {
      animation: none;
    }
  }
</style>