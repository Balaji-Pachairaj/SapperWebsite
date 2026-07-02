<svelte:head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign up at Kurudhi.com to become a donor candidate for Empower Change.</title>
  <meta name="description" content="Join the mission of saving lives by registering as a donor candidate at Kurudhi.com">
  <meta name="author" content="J S Raghavan">
  <meta name="copyright" content="Bumble Bees IT Solutions">
  <meta name="robots" content="index, follow">

  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">

  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<script>
  import { onMount } from "svelte";
  import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    fetchSignInMethodsForEmail,
    sendEmailVerification,
  } from "firebase/auth";
  import { getDatabase, ref, set } from "firebase/database";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Toastify from "toastify-js";
  import toastr from "toastr";
  import { goto } from "@sapper/app";
  import { writable } from 'svelte/store';

  import { firebaseApp } from "../firebase";

  const auth = getAuth(firebaseApp);
  const db = getDatabase(firebaseApp);

  let email = "";
  let password = "";
  let fullName = "";
  let gender = "";
  let bloodGroup = "";
  let dateOfBirth = "";
  let phoneNumber = "";
  let pincode = "";
  let country = "India";
  let state = "";
  let division = "";
  let city = "";
  let error = "";
  let area = "";
  let isSubmitDisabled = true;
  let isBelow18 = false;
  let age;
  let remember = false;
  let selectedOption = '';

  toastr.options = {
    closeButton: true,
    debug: true,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: 0,
    extendedTimeOut: 0,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    tapToDismiss: false
  };

  function handleInput(event) {
    fullName = event.target.value.replace(/[^a-zA-Z\s]/g, '');
  }

  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) {
      age--;
    }
    isSubmitDisabled = age < 18;
    isBelow18 = age < 18;
  }

  function handleDateChange(event) {
    dateOfBirth = event.target.value;
    calculateAge(dateOfBirth);
  }

  function handlePhoneInput(event) {
    phoneNumber = event.target.value.replace(/[^0-9]/g, '');
  }

  async function handlePincodeInput(event) {
    const input = event.target;
    pincode = input.value.replace(/[^0-9]/g, '');
    if (pincode.length === 6) {
      await fetchAddressData();
    } else {
      error = "Invalid pincode. Please enter a valid 6-digit pincode.";
    }
  }

  let dropdownOptions = [];

  async function fetchAddressData() {
    try {
      const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
      const response = await axios.get(apiUrl);

      if (response.data.length > 0 && response.data[0].Status === "Success") {
        const postOffice = response.data[0].PostOffice[0];
        state = postOffice.State;
        division = postOffice.Name;
        city = postOffice.District;
        error = "";
        dropdownOptions = response.data[0].PostOffice.map(po => po.Name);
      } else {
        throw new Error("Invalid pincode. Please enter a valid 6-digit pincode.");
      }
    } catch (err) {
      error = err.message || "An error occurred while fetching data. Please try again.";
      Toastify({
        text: error,
        duration: 3000,
        gravity: 'top',
        position: 'left',
        backgroundColor: '#ff4d4d',
      }).showToast();
    }
  }

  let showPassword = false;
  let showSuccessAlert = false;

  const passwordStrength = writable(null);

  function checkPasswordStrength() {
    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (password.length >= 2 && password.length <= 3) {
      passwordStrength.set("Weak");
    } else if (password.length > 3) {
      passwordStrength.set(strongPasswordRegex.test(password) ? "Strong" : "Weak");
    } else {
      passwordStrength.set(null);
    }
  }

  $: pwBars = $passwordStrength === "Strong" ? 3 : ($passwordStrength === "Weak" ? 1 : 0);

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  const currentDate = getCurrentDate();
  let profile_created = currentDate;

  async function handleRegistration() {
    if (!email || !password || !pincode || !phoneNumber || !dateOfBirth || !bloodGroup || !fullName || !gender) {
      toastr.error("Please fill in all required fields.");
      return;
    }

    if (!remember) {
      toastr.error("Please accept the terms and conditions.");
      return;
    }

    try {
      const providers = await fetchSignInMethodsForEmail(auth, email);

      if (providers.length > 0) {
        toastr.error("Email already exists. Please contact the admin.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const uid = user.uid;
      const userRef = ref(db, "users/" + uid);
      const timestamp = new Date();
      const formattedTimestamp = `${timestamp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })} ${timestamp.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        weekday: "long",
      })}`;

      const userData = {
        uid: uid,
        email: email,
        fullName: fullName,
        gender: gender,
        bloodGroup: bloodGroup,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        pincode: pincode,
        city: city,
        state: state,
        age: age,
        country: country,
        division: division,
        profile_created: profile_created,
        area: selectedOption,
        created_at: formattedTimestamp,
        updated_at: formattedTimestamp,
      };

      await set(userRef, userData);

      await updateProfile(user, {
        displayName: fullName,
      });

      await sendEmailVerification(user);

      Swal.fire({
        icon: "success",
        title: "🎉 Registration Successful 🎉",
        html: `
          <p>Thank you for being a superhero!</p>
          <p>Your blood donation will save lives, and we can't thank you enough.</p>
          <p>Get ready to wear your cape (or bandage) with pride! 💪🩸</p>
        `,
        showConfirmButton: false,
        timer: 7000,
      });

      setTimeout(() => {
        goto("/profile");
      }, 7000);

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toastr.error("Email already exists. Please contact the admin.");
      } else {
        toastr.error("Registration failed. Please try again later.");
      }
    }
  }

  let alertColor = "black";

  import Banner from "../components/InnerBanner.svelte";
  import InformationOne from "../components/InformationOne.svelte";

  let pageLinks = [{ text: "Home", url: "/" }, { text: "Registration" }];

  let loading = false;

  onMount(() => {
    const inputFields = document.querySelectorAll('input[autocomplete="off"]');
    inputFields.forEach((input) => {
      input.setAttribute("autocomplete", "new-password");
    });
  });
</script>

<div class="main-page-wrapper">
  <div>
    <Banner title="Donor Candidates Registration" />
  </div>

  <section class="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
    <div class="container">
      <div class="reg-shell m-auto">

        <div class="reg-head">
          <span class="eyebrow mono">DONOR REGISTRATION</span>
          <h2>Create your account</h2>
          <p class="sub">It takes about 3 minutes. We'll only contact you when someone nearby needs your blood type.</p>
        </div>

        <div class="card">
          <form on:submit|preventDefault={handleRegistration}>

            <!-- SECTION: About you -->
            <div class="section-label">
              <i class="fas fa-user" aria-hidden="true" />
              <span>About you</span>
            </div>

            <div class="field">
              <label for="fullName">Full name*</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your name"
                bind:value={fullName}
                on:input={handleInput}
                pattern="[A-Za-z]+"
                autocomplete="off"
              />
            </div>

            <div class="field">
              <label>Gender*</label>
              <div class="gender-grid">
                <input type="radio" id="male" name="gender" value="male" bind:group={gender} autocomplete="off" class="visually-hidden" />
                <label for="male" class="gender-card">
                  <i class="fas fa-mars" aria-hidden="true" />
                  <span>Male</span>
                </label>

                <input type="radio" id="female" name="gender" value="female" bind:group={gender} autocomplete="off" class="visually-hidden" />
                <label for="female" class="gender-card">
                  <i class="fas fa-venus" aria-hidden="true" />
                  <span>Female</span>
                </label>
              </div>
            </div>

            <div class="two-col">
              <div class="field">
                <label for="dateOfBirth">
                  Date of Birth*
                  {#if age > 18}
                    <span class="age-badge">· {age} yrs 🎉</span>
                  {/if}
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  on:input={handleDateChange}
                  bind:value={dateOfBirth}
                  autocomplete="off"
                />
              </div>

              <div class="field">
                <label for="bloodGroup">Blood Group*</label>
                <select id="bloodGroup" bind:value={bloodGroup} class="form-select" name="bloodGroupType">
                  <option disabled hidden style="display:none" value="">Choose blood group</option>
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

            {#if isBelow18}
              <div class="below-18">
                Oops! We love your energy, but our <strong>kurudhi.com</strong>
                community is strictly for 18 and above. Check back when you're a year wiser! 🎂
              </div>
            {:else}

              <!-- SECTION: Contact details -->
              <div class="section-label section-label-spaced">
                <i class="fas fa-address-book" aria-hidden="true" />
                <span>Contact details</span>
              </div>

              <div class="two-col">
                <div class="field">
                  <label for="phoneNumber">Phone Number*</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    maxlength="10"
                    minlength="10"
                    placeholder="10-digit number"
                    bind:value={phoneNumber}
                    on:input={handlePhoneInput}
                    autocomplete="off"
                  />
                </div>

                <div class="field">
                  <label for="email">Email*</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    bind:value={email}
                    autocomplete="off"
                  />
                </div>
              </div>

              <div class="field">
                <label for="pincode">Pincode*</label>
                <input
                  type="text"
                  id="pincode"
                  on:input={handlePincodeInput}
                  inputmode="numeric"
                  minlength="5"
                  maxlength="6"
                  pattern="[0-9]*"
                  placeholder="Enter your pincode"
                  bind:value={pincode}
                  autocomplete="off"
                />
                {#if error}
                  <div class="hint error">{error}</div>
                {:else if city}
                  <div class="hint ok">Detected — feel free to edit if needed.</div>
                {:else}
                  <div class="hint">We'll auto-fill your city and state.</div>
                {/if}
              </div>

              <div class="two-col">
                <div class="field">
                  <label for="country">Country</label>
                  <input type="text" id="country" disabled bind:value={country} autocomplete="off" />
                </div>
                <div class="field">
                  <label for="state">State</label>
                  <input type="text" id="state" disabled placeholder="State" bind:value={state} autocomplete="off" />
                </div>
              </div>

              {#if division}
                <div class="two-col">
                  <div class="field">
                    <label for="city">City</label>
                    <input type="text" id="city" disabled placeholder="City" bind:value={city} autocomplete="off" />
                  </div>

                  <div class="field">
                    <label for="dropdown">Area</label>
                    <select id="dropdown" bind:value={selectedOption}>
                      <option disabled hidden style="display:none" value="">Select your area</option>
                      {#each dropdownOptions as option (option)}
                        <option value={option}>{option}</option>
                      {/each}
                    </select>
                  </div>
                </div>
              {/if}

              <!-- SECTION: Account security -->
              <div class="section-label section-label-spaced">
                <i class="fas fa-lock" aria-hidden="true" />
                <span>Account security</span>
              </div>

              <div class="field">
                <label for="password">
                  Password*
                  {#if $passwordStrength !== null}
                    <span class="password-strength {$passwordStrength === 'Strong' ? 'strong-password' : ''}">
                      {$passwordStrength}
                    </span>
                  {/if}
                </label>
                <div class="pw-row">
                  {#if showPassword}
                    <input
                      type="text"
                      id="password"
                      placeholder="At least 8 characters"
                      bind:value={password}
                      on:input={checkPasswordStrength}
                      autocomplete="off"
                    />
                  {:else}
                    <input
                      type="password"
                      id="password"
                      placeholder="At least 8 characters"
                      bind:value={password}
                      on:input={checkPasswordStrength}
                      autocomplete="off"
                    />
                  {/if}
                  <button type="button" class="eye-btn" on:click={togglePasswordVisibility} aria-label="Toggle password visibility">
                    <i class="fas {showPassword ? 'fa-eye-slash' : 'fa-eye'}" />
                  </button>
                </div>
                <div class="pw-meter">
                  <i class:filled={pwBars >= 1} class:weak={pwBars === 1}></i>
                  <i class:filled={pwBars >= 2} class:mid={pwBars === 2}></i>
                  <i class:filled={pwBars >= 3} class:strong={pwBars === 3}></i>
                </div>

                {#if showSuccessAlert}
                  <div class="alert alert-info alert-dismissible fade show" role="alert">
                    Congratulations! Your password is hacker-proof. 🚀💪
                    <button style="padding: 6px 4px;" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" />
                  </div>
                {/if}
              </div>

              <div class="cf-turnstile" data-sitekey="0x4AAAAAAACC60E1r0uX5QL4" data-theme="light" data-callback="initializeTurnstile" />

              <div class="consent">
                <input type="checkbox" bind:checked={remember} id="remember">
                <label for="remember">Clicking 'Register' means you <a href="/privacy">accept terms</a>. I allow displaying my name and phone for emergencies.</label>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-full {remember ? '' : 'disabled'}"
              >Register</button>
            {/if}
          </form>
        </div>

        <div class="d-flex align-items-center mt-30 mb-10">
          <div class="line" />
          <span class="pe-3 ps-3">OR</span>
          <div class="line" />
        </div>

        <p class="text-center mt-10">
          Have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>

    <div class="mt-50 rounded container text-black" style="text-align:justify;">
      <div class="position-relative">
        <div class="row px-lg-5 px-auto pt-3">
          <InformationOne {alertColor} />
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  :root {
    --crimson: #C41230;
    --crimson-dark: #7A0F22;
    --ivory: #FBF6F0;
    --card: #FFFFFF;
    --ink: #2B1416;
    --ink-soft: #7A6467;
    --vital: #1F8A5F;
    --sand: #E7A94C;
    --border: #EEE0DD;
    --blush: #F7E2E1;
  }

  .reg-shell { max-width: 560px; font-family: 'Inter', sans-serif; color: var(--ink); }

  .reg-head { margin-bottom: 22px; }
  .eyebrow {
    display: block; font-size: 12px; letter-spacing: .14em; color: var(--crimson);
    margin-bottom: 10px; font-weight: 600;
  }
  .mono { font-family: 'IBM Plex Mono', monospace; }
  .reg-head h2 { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; margin: 0; }
  .reg-head .sub { font-size: 14px; color: var(--ink-soft); margin-top: 8px; line-height: 1.5; }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 34px 32px;
    box-shadow: 0 20px 45px -22px rgba(122,15,34,0.2);
  }

  .section-label {
    display: flex; align-items: center; gap: 9px;
    font-size: 12.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
    color: var(--crimson); margin-bottom: 18px;
  }
  .section-label-spaced { margin-top: 32px; padding-top: 26px; border-top: 1px solid var(--border); }
  .section-label i { font-size: 13px; }

  .field { margin-bottom: 20px; }
  .field label { display: block; font-size: 12.5px; font-weight: 600; margin-bottom: 8px; color: var(--ink); }
  .age-badge { color: var(--vital); font-weight: 600; }

  .field input[type="text"],
  .field input[type="email"],
  .field input[type="tel"],
  .field input[type="password"],
  .field input[type="date"],
  .field select {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: #FDFAF8;
    padding: 0 15px;
    font-size: 14.5px;
    font-family: 'Inter', sans-serif;
    color: var(--ink);
    outline: none;
    transition: border-color .18s, box-shadow .18s, background .18s;
  }
  .field input:focus, .field select:focus {
    border-color: var(--crimson);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(196,18,48,0.10);
  }
  .field input:disabled { color: var(--ink-soft); background: #F3EDEA; }

  .hint { font-size: 12px; color: var(--ink-soft); margin-top: 6px; }
  .hint.error { color: #B5342F; font-weight: 600; }
  .hint.ok { color: var(--vital); font-weight: 600; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .visually-hidden { position: absolute; opacity: 0; width: 1px; height: 1px; overflow: hidden; }

  .gender-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .gender-card {
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    background: #FDFAF8;
    transition: all .16s ease;
    margin-bottom: 0 !important;
    font-weight: 400 !important;
  }
  .gender-card i { font-size: 18px; }
  .gender-card span { font-size: 14px; font-weight: 600; }
  input:checked + .gender-card {
    border-color: var(--crimson);
    background: var(--blush);
    box-shadow: 0 0 0 3px rgba(196,18,48,0.08);
    color: var(--crimson);
  }

  .pw-row { position: relative; }
  .pw-row input { padding-right: 46px; }
  .eye-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--ink-soft); padding: 4px;
  }
  .pw-meter { display: flex; gap: 5px; margin-top: 9px; }
  .pw-meter i { height: 4px; flex: 1; background: var(--border); border-radius: 3px; display: block; }
  .pw-meter i.weak.filled { background: #D24545; }
  .pw-meter i.mid.filled { background: var(--sand); }
  .pw-meter i.strong.filled { background: var(--vital); }

  .password-strength { font-weight: bold; color: #D24545; font-size: 12px; margin-left: 6px; }
  .strong-password { color: var(--vital); }

  .below-18 {
    background: var(--blush);
    border: 1px solid #F0C4C4;
    color: #8C2A2A;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 13px;
    line-height: 1.5;
    margin-top: 6px;
  }

  .cf-turnstile { margin-top: 4px; margin-bottom: 6px; }

  .consent { display: flex; gap: 12px; align-items: flex-start; margin: 18px 0 24px; font-size: 12.8px; color: var(--ink-soft); line-height: 1.55; }
  .consent input { margin-top: 3px; accent-color: var(--crimson); width: 16px; height: 16px; flex-shrink: 0; }
  .consent a { color: var(--crimson); font-weight: 600; text-decoration: none; }

  .btn {
    height: 50px;
    border-radius: 12px;
    border: none;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    padding: 0 24px;
    transition: all .15s ease;
  }
  .btn-primary { background: var(--crimson); color: #fff; box-shadow: 0 10px 22px -10px rgba(196,18,48,.6); }
  .btn-primary:hover { background: var(--crimson-dark); }
  .btn-primary.disabled { background: #E7C7CC; box-shadow: none; cursor: not-allowed; }
  .btn-full { width: 100%; }

  @media (max-width: 640px) {
    .card { padding: 26px 20px; }
    .two-col { grid-template-columns: 1fr; }
  }
</style>
