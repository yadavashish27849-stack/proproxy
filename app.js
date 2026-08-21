/**
 * ==========================================================
 * RENZO PRO PROXY — BIG SERVER CYBER TRIAL PORTAL SCRIPT
 * Canvas Cyber Particles | 10s Multi-Step Console | 1.5H Lock
 * ==========================================================
 */

(function () {
  'use strict';

  // ==========================================
  // 1. REALTIME FIREBASE CONFIGURATION
  // ==========================================
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAiYUF8AGSywwZcT7v97nZJkqXniZYWSSI",
    authDomain: "proxy-2-d749a.firebaseapp.com",
    databaseURL: "https://proxy-2-d749a-default-rtdb.firebaseio.com",
    projectId: "proxy-2-d749a",
    storageBucket: "proxy-2-d749a.firebasestorage.app",
    messagingSenderId: "198043412525",
    appId: "1:198043412525:web:f1679870bbce2adbd070a4",
    measurementId: "G-MZFWQE8QCJ"
  };

  let db = null;
  let isFirebaseReady = false;

  // Session Storage Keys (and Legacy Keys)
  const STORAGE_KEY_ACTIVE_KEY = 'rpp_web_active_key_v2';
  const STORAGE_KEY_EXPIRY = 'rpp_web_active_expiry_v2';
  const STORAGE_KEY_CREATED = 'rpp_web_active_created_v2';

  const ALL_STORAGE_KEYS = [
    'rpp_web_active_key_v2',
    'rpp_web_active_expiry_v2',
    'rpp_web_active_created_v2',
    'rpp_web_trial_active_key',
    'rpp_web_trial_expiry_ts',
    'rpp_web_trial_created_ts',
    'rpp_web_active_trial_key',
    'rpp_web_active_trial_expiry'
  ];

  function getStoredActiveKey() {
    for (const k of ['rpp_web_active_key_v2', 'rpp_web_trial_active_key', 'rpp_web_active_trial_key']) {
      const val = localStorage.getItem(k);
      if (val && val.trim().length > 0) return val.trim();
    }
    return null;
  }

  function clearAllStoredTrialKeys() {
    ALL_STORAGE_KEYS.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  // Duration: 1.5 Hours in Milliseconds
  const DURATION_1_5_HOURS_MS = 1.5 * 60 * 60 * 1000;

  // Timers & Intervals
  let countdownInterval = null;
  let progressInterval = null;

  // DOM Elements
  const stateReady = document.getElementById('state-ready');
  const stateProgress = document.getElementById('state-progress');
  const stateActiveKey = document.getElementById('state-active-key');

  const btnStartGen = document.getElementById('btn-start-gen');
  const btnCopyCode = document.getElementById('btn-copy-code');
  const btnCheckRefresh = document.getElementById('btn-check-refresh');

  const activeKeyText = document.getElementById('active-key-text');
  const liveTimerDigits = document.getElementById('live-timer-digits');

  const cyberProgressBar = document.getElementById('cyber-progress-bar');
  const countdownSecNum = document.getElementById('countdown-sec-num');
  const scanTitle = document.getElementById('scan-title');
  const currentLogText = document.getElementById('current-log-text');
  const terminalLogs = document.getElementById('terminal-logs');

  const liveUserCounter = document.getElementById('live-user-counter');
  const cyberToast = document.getElementById('cyber-toast');
  const toastMsgText = document.getElementById('toast-msg-text');

  // ==========================================
  // 2. APP INITIALIZATION
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initCyberCanvas();
    initFirebase();
    initLiveUserCounter();
    initEventListeners();
    checkExistingSession();
  });

  function initFirebase() {
    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        db = firebase.database();
        isFirebaseReady = true;
      }
    } catch (e) {
      console.error('Firebase init error:', e);
    }
  }

  function initEventListeners() {
    if (btnStartGen) {
      btnStartGen.addEventListener('click', start10SecondVerificationFlow);
    }

    if (btnCopyCode) {
      btnCopyCode.addEventListener('click', copyKeyToClipboard);
    }

    if (btnCheckRefresh) {
      btnCheckRefresh.addEventListener('click', () => {
        checkExistingSession();
        showToast('Session status verified! 🔄');
      });
    }
  }

  // ==========================================
  // 3. SESSION & STRICT TIMER VERIFICATION (WITH LIVE ADMIN SYNC)
  // ==========================================
  let activeKeySafeName = null;

  function listenToActiveKeyStatus(keyCode) {
    if (activeKeySafeName && db) {
      try { db.ref(`gx_licenses/${activeKeySafeName}`).off(); } catch (e) {}
      activeKeySafeName = null;
    }

    if (!isFirebaseReady || !db || !keyCode) return;
    const safeKey = keyCode.replace(/[.#$[\]]/g, '_');
    activeKeySafeName = safeKey;

    db.ref(`gx_licenses/${safeKey}`).on('value', (snapshot) => {
      const val = snapshot.val();
      const currentSaved = getStoredActiveKey();
      if (currentSaved !== keyCode) return;

      // If key was deleted by admin from database OR status changed to blocked/banned/expired
      if (!val || val.status === 'blocked' || val.status === 'banned' || val.status === 'expired') {
        console.log('Key deleted/blocked by admin in Firebase. Releasing web lock immediately.');
        if (countdownInterval) clearInterval(countdownInterval);
        clearAllStoredTrialKeys();
        showToast('⚠️ Key was deleted/blocked in Admin Panel! You can now generate a new key.');
        showReadySection();
      }
    });
  }

  function checkExistingSession() {
    const savedKey = getStoredActiveKey();
    const savedExpiry = parseInt(localStorage.getItem(STORAGE_KEY_EXPIRY) || localStorage.getItem('rpp_web_trial_expiry_ts') || '0', 10);
    const now = Date.now();

    if (!savedKey) {
      clearAllStoredTrialKeys();
      showReadySection();
      return;
    }

    // Always verify with Firebase Realtime Database first!
    if (isFirebaseReady && db) {
      const safeKey = savedKey.replace(/[.#$[\]]/g, '_');
      db.ref(`gx_licenses/${safeKey}`).once('value').then((snapshot) => {
        const val = snapshot.val();
        if (!val || val.status === 'blocked' || val.status === 'banned' || val.status === 'expired' || (val.expiryTimestamp && val.expiryTimestamp <= now)) {
          console.log('Key not in database or blocked/expired. Clearing lock.');
          clearAllStoredTrialKeys();
          showReadySection();
        } else {
          const exp = val.expiryTimestamp || savedExpiry || (now + DURATION_1_5_HOURS_MS);
          showActiveKeySection(savedKey, exp);
        }
      }).catch(() => {
        if (savedExpiry > now) {
          showActiveKeySection(savedKey, savedExpiry);
        } else {
          clearAllStoredTrialKeys();
          showReadySection();
        }
      });
    } else {
      if (savedExpiry > now) {
        showActiveKeySection(savedKey, savedExpiry);
      } else {
        clearAllStoredTrialKeys();
        showReadySection();
      }
    }
  }

  function showReadySection() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (activeKeySafeName && db) {
      try { db.ref(`gx_licenses/${activeKeySafeName}`).off(); } catch (e) {}
      activeKeySafeName = null;
    }
    stateReady.classList.remove('hidden');
    stateProgress.classList.add('hidden');
    stateActiveKey.classList.add('hidden');
  }

  function showActiveKeySection(keyCode, expiryTimestamp) {
    stateReady.classList.add('hidden');
    stateProgress.classList.add('hidden');
    stateActiveKey.classList.remove('hidden');

    if (activeKeyText) {
      activeKeyText.textContent = keyCode;
    }

    startRealtimeCountdown(expiryTimestamp, keyCode);
    listenToActiveKeyStatus(keyCode);
  }

  // ==========================================
  // 4. 10-SECOND REALTIME RADAR & MULTI-STEP CONSOLE
  // ==========================================
  function start10SecondVerificationFlow() {
    // Strict Lock Check: Don't allow generation if already active
    const savedExpiry = parseInt(localStorage.getItem(STORAGE_KEY_EXPIRY) || '0', 10);
    if (savedExpiry > Date.now()) {
      showToast('⚠️ You already have an active 1.5-Hour VIP Key!');
      checkExistingSession();
      return;
    }

    stateReady.classList.add('hidden');
    stateProgress.classList.remove('hidden');
    stateActiveKey.classList.add('hidden');

    let secondsLeft = 10;
    cyberProgressBar.style.width = '0%';
    countdownSecNum.textContent = secondsLeft;

    const consoleSteps = [
      { sec: 10, title: 'Scanning Anti-Abuse Gateway...', log: 'Probing Cloud Firewall & Anti-Abuse Gateway...' },
      { sec: 8, title: 'Fingerprinting Device Entropy...', log: 'Performing IP Geolocation & Threat Scoring (0.0ms)...' },
      { sec: 6, title: 'Validating Hardware Signatures...', log: 'Validating Hardware Fingerprint & Browser Entropy...' },
      { sec: 4, title: 'Routing Private VIP Node...', log: 'Routing to Low-Latency Cloud Proxy Cluster...' },
      { sec: 2, title: 'Encrypting VIP Token...', log: 'Generating Encrypted Single-Device Token [WEB-XXXX]...' },
      { sec: 0, title: 'Finalizing Database Sync...', log: 'Committing License Hash to Realtime Database...' }
    ];

    if (progressInterval) clearInterval(progressInterval);

    // Initial log
    addTerminalLog(consoleSteps[0].log);

    progressInterval = setInterval(() => {
      secondsLeft--;

      const percent = Math.round(((10 - secondsLeft) / 10) * 100);
      cyberProgressBar.style.width = percent + '%';
      countdownSecNum.textContent = secondsLeft;

      for (const step of consoleSteps) {
        if (secondsLeft === step.sec) {
          scanTitle.textContent = step.title;
          addTerminalLog(step.log);
          break;
        }
      }

      if (secondsLeft <= 0) {
        clearInterval(progressInterval);
        setTimeout(finalizeAndCommitKey, 400);
      }
    }, 1000);
  }

  function addTerminalLog(msg) {
    if (!currentLogText) return;
    currentLogText.textContent = msg;
  }

  // ==========================================
  // 5. GENERATE KEY WITH 'WEB-' PREFIX & SAVE
  // ==========================================
  async function finalizeAndCommitKey() {
    const keyCode = generateWebVIPKey();
    const now = Date.now();
    const expiryTimestamp = now + DURATION_1_5_HOURS_MS;

    const licenseObject = {
      key: keyCode,
      status: 'unused',
      createdAt: now,
      expiryTimestamp: expiryTimestamp,
      durationHours: 1.5,
      durationDays: 0.0625,
      durationLabel: '1.5 Hours Trial',
      hwid: null,
      boundHwid: 'null',
      maxDevices: 1,
      max_devices: 1,
      is_unlimited_devices: false,
      clientNote: 'Web Trial Generated',
      notes: 'Web 1.5H Trial (Auto-Generated)',
      generatedFrom: 'web_portal',
      features: {
        drag90: true,
        drag60: true,
        bypass: true
      }
    };

    // 1. Save locally for strict 1.5-hour lock
    localStorage.setItem(STORAGE_KEY_ACTIVE_KEY, keyCode);
    localStorage.setItem(STORAGE_KEY_EXPIRY, expiryTimestamp.toString());
    localStorage.setItem(STORAGE_KEY_CREATED, now.toString());

    // 2. Commit live to Firebase Realtime Database
    if (isFirebaseReady && db) {
      try {
        const safeKey = keyCode.replace(/[.#$[\]]/g, '_');
        await db.ref(`gx_licenses/${safeKey}`).set(licenseObject);
        console.log('Key successfully committed to Firebase:', safeKey);
      } catch (err) {
        console.error('Firebase commit error:', err);
      }
    }

    // 3. Display Active Key & Countdown
    showActiveKeySection(keyCode, expiryTimestamp);
    showToast('🎉 1.5-Hour VIP Key Generated & Active!');
  }

  function generateWebVIPKey() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randSeg = (len = 4) => {
      let str = '';
      for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return str;
    };
    return `WEB-${randSeg(4)}-${randSeg(4)}-${randSeg(4)}`;
  }

  // ==========================================
  // 6. REALTIME COUNTDOWN & AUTO-CLEANUP ON EXPIRY
  // ==========================================
  function startRealtimeCountdown(expiryTimestamp, keyCode) {
    if (countdownInterval) clearInterval(countdownInterval);

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = expiryTimestamp - now;

      if (diffMs <= 0) {
        clearInterval(countdownInterval);
        liveTimerDigits.textContent = '00:00:00';
        showToast('⚠️ Your 1.5-Hour Trial has expired! Cleaned from database.');

        // Clean expired key from Firebase & Local Storage
        cleanExpiredKeyFromDatabase(keyCode);
        localStorage.removeItem(STORAGE_KEY_ACTIVE_KEY);
        localStorage.removeItem(STORAGE_KEY_EXPIRY);
        localStorage.removeItem(STORAGE_KEY_CREATED);

        setTimeout(showReadySection, 2500);
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (n) => String(n).padStart(2, '0');
      liveTimerDigits.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  }

  function cleanExpiredKeyFromDatabase(key) {
    if (!key) return;
    if (isFirebaseReady && db) {
      try {
        const safeKey = key.replace(/[.#$[\]]/g, '_');
        db.ref(`gx_licenses/${safeKey}`).remove();
        console.log('Expired key cleaned from Firebase:', safeKey);
      } catch (ignored) {}
    }
  }

  // ==========================================
  // 7. COPY TO CLIPBOARD
  // ==========================================
  function copyKeyToClipboard() {
    const key = activeKeyText ? activeKeyText.textContent.trim() : '';
    if (!key || key.includes('XXXX')) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(key).then(() => {
        showToast('📋 Key copied to clipboard!');
      }).catch(() => {
        fallbackCopy(key);
      });
    } else {
      fallbackCopy(key);
    }
  }

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('📋 Key copied to clipboard!');
  }

  function showToast(msg) {
    if (!cyberToast || !toastMsgText) return;
    toastMsgText.textContent = msg;
    cyberToast.classList.add('show');
    setTimeout(() => {
      cyberToast.classList.remove('show');
    }, 3200);
  }

  function initLiveUserCounter() {
    let count = 2840 + Math.floor(Math.random() * 50);
    if (liveUserCounter) {
      liveUserCounter.textContent = `🟢 ${count.toLocaleString()} Active Proxies`;
    }

    setInterval(() => {
      const delta = Math.floor(Math.random() * 9) - 4;
      count = Math.max(2500, count + delta);
      if (liveUserCounter) {
        liveUserCounter.textContent = `🟢 ${count.toLocaleString()} Active Proxies`;
      }
    }, 4500);
  }

  // ==========================================
  // 8. INTERACTIVE CYBER CANVAS PARTICLES
  // ==========================================
  function initCyberCanvas() {
    const canvas = document.getElementById('cyber-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particleCount = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(255, 107, 0, ' : 'rgba(56, 189, 248, '
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 107, 0, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and move particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.6)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FF6B00';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

})();
