/* =========================================================
   MAX VIP 2026 - CRIMSON RED KEY GENERATOR ENGINE
   ========================================================= */

// --- TARGET VIP KEY CONSTANT ---
const VIP_KEY = 'MAX-VIP#2026@PRO!';
const COUNTDOWN_DURATION = 5000; // 5 seconds

// --- DOM ELEMENTS ---
const idleState = document.getElementById('idleState');
const generatingState = document.getElementById('generatingState');
const revealedState = document.getElementById('revealedState');

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const copyBtnText = document.getElementById('copyBtnText');
const copyIcon = document.getElementById('copyIcon');
const checkIcon = document.getElementById('checkIcon');
const regenerateBtn = document.getElementById('regenerateBtn');

const countdownSeconds = document.getElementById('countdownSeconds');
const progressRingCircle = document.getElementById('progressRingCircle');
const linearProgressBar = document.getElementById('linearProgressBar');
const cipherScramble = document.getElementById('cipherScramble');
const statusMessage = document.getElementById('statusMessage');
const finalKeyText = document.getElementById('finalKeyText');

const card3d = document.getElementById('card3d');
const cardWrapper = document.getElementById('cardWrapper');
const toast = document.getElementById('toast');

// --- BACKGROUND MUSIC & AUDIO CONTROLLER ---
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicStatusText = document.getElementById('musicStatusText');

let isMusicPlaying = false;

// Configure loop and optimal volume
if (bgMusic) {
  bgMusic.loop = true;
  bgMusic.volume = 0.9;
  
  // Continuous loop listener
  bgMusic.addEventListener('ended', () => {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  });
}

// Function to immediately trigger music playback
function attemptPlayMusic() {
  if (!bgMusic) return;
  
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isMusicPlaying = true;
      if (musicToggle) {
        musicToggle.classList.add('playing');
        musicToggle.classList.remove('paused');
      }
      if (musicStatusText) {
        musicStatusText.textContent = 'VIP AUDIO ON';
      }
    }).catch(() => {
      // Browser blocked without first gesture - will auto-unlock on first pointer move/scroll
    });
  }
}

// Immediate attempt on script load
attemptPlayMusic();

// Immediate attempt on DOM load and window load
document.addEventListener('DOMContentLoaded', attemptPlayMusic);
window.addEventListener('load', attemptPlayMusic);

// Auto-trigger on any user arrival gestures (movement, hover, scroll, touch)
const autoPlayTriggers = ['pointermove', 'mousemove', 'mouseenter', 'touchstart', 'scroll', 'keydown', 'click'];
function autoPlayOnArrival() {
  if (!isMusicPlaying && bgMusic) {
    attemptPlayMusic();
  }
  // Once playing, remove these arrival triggers
  if (isMusicPlaying) {
    autoPlayTriggers.forEach(evt => window.removeEventListener(evt, autoPlayOnArrival));
  }
}

autoPlayTriggers.forEach(evt => {
  window.addEventListener(evt, autoPlayOnArrival, { passive: true });
});

// Manual Toggle handler (Play / Pause)
function toggleMusic(e) {
  if (e) e.stopPropagation();
  if (!bgMusic) return;
  initAudio();
  
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      musicToggle.classList.add('playing');
      musicToggle.classList.remove('paused');
      musicStatusText.textContent = 'VIP AUDIO ON';
      playSound('click');
    }).catch(() => {});
  } else {
    bgMusic.pause();
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
    musicToggle.classList.add('paused');
    musicStatusText.textContent = 'VIP AUDIO OFF';
  }
}

if (musicToggle) {
  musicToggle.addEventListener('click', toggleMusic);
}

// --- SOUND ENGINE (WEB AUDIO SYNTHESIZER FX) ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  if (type === 'click') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'tick') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.05);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'unlock') {
    // Crimson Fanfare chords
    const freqs = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + idx * 0.07);
      gain.gain.setValueAtTime(0.15, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.65);
    });
  } else if (type === 'copy') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

// --- AMBIENT RED PARTICLES SYSTEM (BACKGROUND CANVAS) ---
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];

function resizeBg() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBg);
resizeBg();

class RedEmber {
  constructor() {
    this.reset(true);
  }
  
  reset(init = false) {
    this.x = Math.random() * bgCanvas.width;
    this.y = init ? Math.random() * bgCanvas.height : bgCanvas.height + 20;
    this.size = Math.random() * 3 + 1;
    this.speedY = -(Math.random() * 1.8 + 0.6);
    this.speedX = (Math.random() - 0.5) * 1.2;
    this.life = 0;
    this.maxLife = Math.random() * 180 + 100;
    this.alpha = 0;
    this.color = ['#ff003c', '#ff1a4a', '#ff4d6d', '#ff0055', '#ffffff'][Math.floor(Math.random() * 5)];
  }
  
  update() {
    this.life++;
    this.x += this.speedX + Math.sin(this.life * 0.05) * 0.4;
    this.y += this.speedY;
    
    // Alpha fade in and out
    if (this.life < 30) {
      this.alpha = this.life / 30;
    } else if (this.life > this.maxLife - 40) {
      this.alpha = (this.maxLife - this.life) / 40;
    } else {
      this.alpha = 0.8;
    }
    
    if (this.life >= this.maxLife || this.y < -20) {
      this.reset();
    }
  }
  
  draw() {
    bgCtx.save();
    bgCtx.globalAlpha = Math.max(0, this.alpha * 0.7);
    bgCtx.fillStyle = this.color;
    bgCtx.shadowBlur = 10;
    bgCtx.shadowColor = this.color;
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    bgCtx.fill();
    bgCtx.restore();
  }
}

for (let i = 0; i < 55; i++) {
  particles.push(new RedEmber());
}

function animateBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  for (let p of particles) {
    p.update();
    p.draw();
  }
  requestAnimationFrame(animateBackground);
}
animateBackground();

// --- 3D PERSPECTIVE TILT PHYSICS ---
let targetTiltX = 0, targetTiltY = 0;
let currentTiltX = 0, currentTiltY = 0;

document.addEventListener('mousemove', (e) => {
  const rect = cardWrapper.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
  const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);
  
  targetTiltY = deltaX * 14; // Max 14 deg tilt
  targetTiltX = -deltaY * 14;
  
  // Hologram glare position
  const glareX = ((e.clientX - rect.left) / rect.width) * 100;
  const glareY = ((e.clientY - rect.top) / rect.height) * 100;
  card3d.style.setProperty('--mouse-x', `${glareX}%`);
  card3d.style.setProperty('--mouse-y', `${glareY}%`);
});

// Mobile gyroscope tilt support
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma !== null && e.beta !== null) {
      targetTiltY = Math.min(Math.max(e.gamma / 3, -15), 15);
      targetTiltX = Math.min(Math.max((e.beta - 45) / 3, -15), 15);
    }
  });
}

function update3DTilt() {
  currentTiltX += (targetTiltX - currentTiltX) * 0.1;
  currentTiltY += (targetTiltY - currentTiltY) * 0.1;
  
  card3d.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
  requestAnimationFrame(update3DTilt);
}
update3DTilt();

// Reset tilt on mouse leave
document.addEventListener('mouseleave', () => {
  targetTiltX = 0;
  targetTiltY = 0;
});

// --- CIPHER SCRAMBLER EFFECT ---
const CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!$%&*';
let cipherInterval = null;

function startCipherScramble() {
  clearInterval(cipherInterval);
  cipherInterval = setInterval(() => {
    let scrambled = '';
    for (let i = 0; i < 16; i++) {
      scrambled += CIPHER_CHARS.charAt(Math.floor(Math.random() * CIPHER_CHARS.length));
    }
    cipherScramble.textContent = scrambled;
  }, 45);
}

function stopCipherScramble() {
  clearInterval(cipherInterval);
}

// --- 5-SECOND KEY GENERATION WORKFLOW ---
const STATUS_STAGES = [
  { time: 0, text: 'Connecting to Crimson 2026 Core Server...' },
  { time: 1000, text: 'Bypassing Quantum Security Node...' },
  { time: 2000, text: 'Generating AES-512 VIP Hash...' },
  { time: 3200, text: 'Injecting Lifetime License Pass...' },
  { time: 4200, text: 'Finalizing Cryptographic Key...' }
];

let generationTimer = null;
let lastTickSecond = 5;

function startGenerating() {
  playSound('click');
  initAudio();
  attemptPlayMusic();
  
  // Transition to Generating State
  idleState.classList.remove('active-state');
  idleState.classList.add('hidden');
  revealedState.classList.add('hidden');
  revealedState.classList.remove('active-state');
  
  generatingState.classList.remove('hidden');
  generatingState.classList.add('active-state');
  
  // Reset Progress Elements
  const circumference = 2 * Math.PI * 50; // r=50 -> ~314.159
  progressRingCircle.style.strokeDasharray = `${circumference}`;
  progressRingCircle.style.strokeDashoffset = '0';
  linearProgressBar.style.width = '0%';
  countdownSeconds.textContent = '5';
  lastTickSecond = 5;
  
  startCipherScramble();
  
  const startTime = Date.now();
  
  if (generationTimer) clearInterval(generationTimer);
  
  generationTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, COUNTDOWN_DURATION - elapsed);
    const progress = Math.min(1, elapsed / COUNTDOWN_DURATION);
    
    // Update Radial Circle Offset
    const offset = circumference * progress;
    progressRingCircle.style.strokeDashoffset = `${offset}`;
    
    // Update Linear Bar
    linearProgressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    
    // Update Countdown Seconds (5, 4, 3, 2, 1)
    const currentSec = Math.ceil(remainingTime / 1000);
    if (currentSec !== lastTickSecond && currentSec > 0) {
      countdownSeconds.textContent = currentSec;
      lastTickSecond = currentSec;
      playSound('tick');
    }
    
    // Update Dynamic Status Messages
    for (let i = STATUS_STAGES.length - 1; i >= 0; i--) {
      if (elapsed >= STATUS_STAGES[i].time) {
        statusMessage.textContent = STATUS_STAGES[i].text;
        break;
      }
    }
    
    // Completed 5 Seconds
    if (elapsed >= COUNTDOWN_DURATION) {
      clearInterval(generationTimer);
      stopCipherScramble();
      revealKey();
    }
  }, 30);
}

// Reveal Key State
function revealKey() {
  playSound('unlock');
  
  generatingState.classList.remove('active-state');
  generatingState.classList.add('hidden');
  
  revealedState.classList.remove('hidden');
  revealedState.classList.add('active-state');
  
  // Character laser glitch reveal of the key
  finalKeyText.textContent = '';
  let idx = 0;
  const revealInterval = setInterval(() => {
    if (idx < VIP_KEY.length) {
      finalKeyText.textContent += VIP_KEY[idx];
      idx++;
    } else {
      clearInterval(revealInterval);
    }
  }, 40);
  
  // Reset copy button state
  copyBtn.classList.remove('copied');
  copyIcon.classList.remove('hidden');
  checkIcon.classList.add('hidden');
  copyBtnText.textContent = 'COPY KEY';
}

// --- COPY TO CLIPBOARD HANDLER ---
function copyKeyToClipboard() {
  playSound('copy');
  
  // Use modern Clipboard API with fallback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(VIP_KEY).then(() => {
      handleCopySuccess();
    }).catch(() => {
      fallbackCopy(VIP_KEY);
    });
  } else {
    fallbackCopy(VIP_KEY);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    handleCopySuccess();
  } catch (err) {
    console.error('Copy fallback failed', err);
  }
  document.body.removeChild(tempInput);
}

let toastTimeout = null;

function handleCopySuccess() {
  // Update button visual
  copyBtn.classList.add('copied');
  copyIcon.classList.add('hidden');
  checkIcon.classList.remove('hidden');
  copyBtnText.textContent = 'COPIED! ✓';
  
  // Show toast notification
  toast.classList.remove('hidden');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

// Regenerate Key Handler
function handleRegenerate() {
  playSound('click');
  startGenerating();
}

// --- ATTACH EVENT LISTENERS ---
generateBtn.addEventListener('click', startGenerating);
copyBtn.addEventListener('click', copyKeyToClipboard);
regenerateBtn.addEventListener('click', handleRegenerate);
