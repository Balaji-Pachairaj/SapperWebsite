<svelte:head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login for Donor Candidates - Empowering Lives at Kurudhi.com</title>
  <meta name="description" content="Join Kurudhi.com as a donor candidate and save lives. Log in as a donor candidate at Kurudhi.com and unlock the power to save lives.">
  <meta name="author" content="J S Raghavan">
  <meta name="copyright" content="Bumble Bees IT Solutions">
  <meta name="robots" content="index, follow">
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
  import Swal from 'sweetalert2';
  import { goto } from '@sapper/app';
  import UAParser from 'ua-parser-js';
  import Banner from '../components/InnerBanner.svelte';
  import { firebaseApp } from '../firebase';

  const auth = getAuth(firebaseApp);

  let email = '';
  let password = '';
  let rememberMe = true;
  let showPassword = false;
  let isLoading = false;

  let emailError = '';
  let passwordError = '';

  onMount(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn) {
      goto('/profile');
    }
  });

  function validate() {
    emailError = '';
    passwordError = '';
    let ok = true;

    if (!email) {
      emailError = 'Enter your email to continue';
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError = 'That email address doesn\u2019t look right';
      ok = false;
    }

    if (!password) {
      passwordError = 'Enter your password';
      ok = false;
    }

    return ok;
  }

  const kh_swalTheme = {
    confirmButtonColor: '#C41E3A',
    background: '#FFFFFF',
    color: '#1A1A1A',
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      isLoading = true;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        localStorage.setItem('userLoggedIn', true);
      }
      localStorage.setItem('loggedIn', true);

      const timestamp = new Date().toLocaleString();
      const device = window.navigator.userAgent;

      isLoading = false;

      Swal.fire({
        icon: 'success',
        title: 'Welcome back',
        text: 'You\u2019re logged in. Redirecting to your profile\u2026',
        showConfirmButton: false,
        timer: 1600,
        ...kh_swalTheme,
      }).then(async () => {
        const parser = new UAParser();
        const browser = parser.getBrowser().name + ' ' + parser.getBrowser().version;

        await fetch('https://send-bulk-mail-kurudhi.onrender.com/sendMail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: userCredential.user.email,
            subject: 'Login Successful',
            message: `
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; }
    header { background-color: #222222; color: #ffffff; padding: 20px; text-align: center; }
    header img { max-width: 100%; height: auto; }
    footer { background-color: #f6f6f6; padding: 20px; text-align: center; }
    footer p { margin: 0; }
    .content { padding: 20px; }
    .content p { margin-bottom: 15px; }
    ul { list-style-type: none; padding: 0; margin: 0; }
    ul li { margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <img src="https://mcolfw.stripocdn.email/content/guids/CABINET_39254364a214f8068da04f2ed695900b7184bdb10d1b1fcfa5d66b206aab1e38/images/untitled2.png" alt="Logo">
    </header>
    <div class="content">
      <p>Hello,</p>
      <p>You have successfully logged in. Here are the details:</p>
      <ul>
        <li><strong>Timestamp:</strong> ${timestamp}</li>
        <li><strong>Login Device:</strong> ${device}</li>
        <li><strong>Browser:</strong> ${browser}</li>
      </ul>
      <p>If you did not perform this login, please contact us immediately.</p>
      <p>Thank you for using our service!</p>
    </div>
    <footer>
      <p>This message was sent from Bumble Bees IT Solutions, Chennai</p>
    </footer>
  </div>
</body>
</html>
            `,
          }),
        });

        goto('/profile');
      });

    } catch (error) {
      isLoading = false;
      let errorMessage = 'We couldn\u2019t log you in. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'We can\u2019t find an account with that email.';
        emailError = 'No account with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'That password isn\u2019t right. Please try again.';
        passwordError = 'Incorrect password';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email or password is incorrect.';
      } else {
        console.error(error);
      }

      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: errorMessage,
        ...kh_swalTheme,
      });
    }
  };

  const showForgotPassword = async () => {
    const { value: resetEmail } = await Swal.fire({
      title: 'Reset your password',
      html: '<input id="swal-input1" class="swal2-input" placeholder="Enter your email" value="' + (email || '') + '">',
      focusConfirm: false,
      confirmButtonText: 'Send reset link',
      ...kh_swalTheme,
      preConfirm: () => document.getElementById('swal-input1').value,
    });

    if (resetEmail) {
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        Swal.fire({
          icon: 'success',
          title: 'Check your inbox',
          text: 'We\u2019ve sent password reset instructions to ' + resetEmail + '.',
          ...kh_swalTheme,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Couldn\u2019t send reset email',
          text: error.message,
          ...kh_swalTheme,
        });
      }
    }
  };

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') handleLogin();
  }
</script>

<div class="main-page-wrapper">
  <Banner title="Donor Candidates Login" />

  <section class="kh-login-section">
    <div class="kh-login-card">
      <h2 class="kh-login-title">Login to your Account</h2>

      <form on:submit|preventDefault={handleLogin} novalidate>

        <div class="kh-field" class:kh-field-error={emailError}>
          <label class="kh-label" for="kh-email">Email*</label>
          <input
            id="kh-email"
            class="kh-input"
            type="email"
            placeholder="Enter your Email"
            bind:value={email}
            on:keydown={handleKeydown}
            autocomplete="email"
          />
          {#if emailError}
            <span class="kh-field-msg">{emailError}</span>
          {/if}
        </div>

        <div class="kh-field" class:kh-field-error={passwordError}>
          <label class="kh-label" for="kh-password">Password*</label>
          <div class="kh-input-wrap">
            {#if showPassword}
              <input
                id="kh-password"
                class="kh-input kh-input-pw"
                type="text"
                placeholder="Enter Password"
                bind:value={password}
                on:keydown={handleKeydown}
                autocomplete="current-password"
              />
            {:else}
              <input
                id="kh-password"
                class="kh-input kh-input-pw"
                type="password"
                placeholder="Enter Password"
                bind:value={password}
                on:keydown={handleKeydown}
                autocomplete="current-password"
              />
            {/if}
            <button
              type="button"
              class="kh-eye-btn"
              on:click={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {#if showPassword}
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              {:else}
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              {/if}
            </button>
          </div>
          {#if passwordError}
            <span class="kh-field-msg">{passwordError}</span>
          {/if}
        </div>

        <div class="kh-row">
          <label class="kh-checkbox">
            <input type="checkbox" bind:checked={rememberMe} />
            <span class="kh-checkbox-box"></span>
            <span class="kh-checkbox-label">Keep me logged in</span>
          </label>
          <button type="button" class="kh-link-btn" on:click={showForgotPassword}>Forgot password?</button>
        </div>

        <button type="submit" class="kh-submit-btn" disabled={isLoading}>
          {#if isLoading}
            <span class="kh-spinner"></span> Logging in\u2026
          {:else}
            Login
          {/if}
        </button>
      </form>

      <div class="kh-divider">
        <span class="kh-divider-line"></span>
        <span class="kh-divider-text">OR</span>
        <span class="kh-divider-line"></span>
      </div>

      <p class="kh-footer-text">
        Don\u2019t have an account? <a href="/register" class="kh-footer-link">Sign Up</a>
      </p>
    </div>
  </section>
</div>

<style>
  .kh-login-section {
    background: #FFF5F5;
    padding: 70px 20px 100px 20px;
    display: flex;
    justify-content: center;
  }

  .kh-login-card {
    width: 100%;
    max-width: 440px;
    background: #FFFFFF;
    border-radius: 20px;
    padding: 44px 40px;
    box-shadow: 0 20px 50px rgba(26, 26, 26, 0.08);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .kh-login-title {
    font-family: 'Poppins', 'Inter', sans-serif;
    font-weight: 600;
    font-size: 26px;
    color: #1A1A1A;
    margin: 0 0 30px 0;
    text-align: center;
  }

  .kh-field {
    margin-bottom: 20px;
  }

  .kh-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #1A1A1A;
    margin-bottom: 7px;
  }

  .kh-input {
    width: 100%;
    box-sizing: border-box;
    padding: 13px 16px;
    border: 1.5px solid #E8E0E0;
    border-radius: 10px;
    font-size: 14.5px;
    color: #1A1A1A;
    background: #FFF5F5;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .kh-input::placeholder {
    color: #B8ADAD;
  }

  .kh-input:focus {
    outline: none;
    border-color: #C41E3A;
    background: #FFFFFF;
  }

  .kh-field-error .kh-input {
    border-color: #C41E3A;
    background: #FFF0F0;
  }

  .kh-field-msg {
    display: block;
    margin-top: 6px;
    font-size: 12.5px;
    color: #C41E3A;
  }

  .kh-input-wrap {
    position: relative;
  }

  .kh-input-pw {
    padding-right: 44px;
  }

  .kh-eye-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .kh-eye-btn:hover {
    background: rgba(196, 30, 58, 0.08);
  }

  .kh-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 26px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .kh-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .kh-checkbox input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .kh-checkbox-box {
    width: 17px;
    height: 17px;
    border-radius: 5px;
    border: 1.5px solid #D8CACA;
    background: #FFFFFF;
    display: inline-block;
    position: relative;
    flex-shrink: 0;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .kh-checkbox input:checked + .kh-checkbox-box {
    background: #C41E3A;
    border-color: #C41E3A;
  }

  .kh-checkbox input:checked + .kh-checkbox-box::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1.5px;
    width: 4px;
    height: 9px;
    border: solid #FFFFFF;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .kh-checkbox-label {
    font-size: 13px;
    color: #4A4A4A;
  }

  .kh-link-btn {
    background: none;
    border: none;
    padding: 0;
    font-size: 13px;
    color: #C41E3A;
    font-weight: 500;
    cursor: pointer;
  }

  .kh-link-btn:hover {
    text-decoration: underline;
  }

  .kh-submit-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 10px;
    background: #C41E3A;
    color: #FFFFFF;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .kh-submit-btn:hover:not(:disabled) {
    background: #A81830;
  }

  .kh-submit-btn:active:not(:disabled) {
    transform: scale(0.99);
  }

  .kh-submit-btn:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .kh-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #FFFFFF;
    border-radius: 50%;
    animation: kh-spin 0.7s linear infinite;
  }

  @keyframes kh-spin {
    to { transform: rotate(360deg); }
  }

  .kh-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 20px 0;
  }

  .kh-divider-line {
    flex: 1;
    height: 1px;
    background: #EEE4E4;
  }

  .kh-divider-text {
    font-size: 12px;
    color: #B0A5A5;
  }

  .kh-footer-text {
    text-align: center;
    font-size: 13.5px;
    color: #6E6E6E;
    margin: 0;
  }

  .kh-footer-link {
    color: #C41E3A;
    font-weight: 500;
    text-decoration: none;
  }

  .kh-footer-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 500px) {
    .kh-login-section {
      padding: 40px 16px 70px 16px;
    }

    .kh-login-card {
      padding: 32px 24px;
    }
  }
</style>
