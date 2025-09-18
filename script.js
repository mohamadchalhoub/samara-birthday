// Birthday web app
// Customize knobs below:
const FRIEND_NAME = 'Bestie'; // Change your friend's display name
const CONFETTI_BURSTS = 3;    // How many confetti bursts after opening
const BALLOON_COUNT = 10;     // How many balloons to float
const SHAKE_MS = 700;         // Shake duration when clicking gift

// Audio: use local happy-birthday.mp3 placed in the project folder
// Playback will be started by the same user click that opens the gift.
const AUDIO_SRC = 'happy-birthday.mp3';

const app = document.getElementById('app');
const gift = document.getElementById('gift');
const reveal = document.getElementById('reveal');
const friendNameSpan = document.getElementById('friendName');
// Removed audio toggle button per new requirements

// Set friend name in UI
friendNameSpan.textContent = FRIEND_NAME;

// Prepare audio element
const audio = new Audio(AUDIO_SRC);
audio.loop = true; // set false if you prefer play once

// Gift interaction: shake, then reveal message with effects
let opened = false;
gift.addEventListener('click', () => {
  if (opened) return;
  opened = true;

  // Trigger shake
  gift.style.animation = `shake ${SHAKE_MS}ms ease-in-out`;

  // Start audio immediately on the same user gesture for autoplay compliance
  // Start muted to avoid abrupt start during the shake; we'll unmute on reveal
  try {
    audio.muted = true;
    audio.currentTime = 0;
    audio.play();
  } catch (e) {
    // Some browsers may still block, but this is tied to click so should pass
  }

  // After shake, transition to reveal state
  window.setTimeout(() => {
    gift.remove();
    reveal.hidden = false;

    // Confetti celebration
    celebrateWithConfetti();

    // Balloons rise
    spawnBalloons(BALLOON_COUNT);

    // Unmute now that the reveal is visible
    audio.muted = false;
  }, SHAKE_MS);
});

// Confetti using canvas-confetti (loaded via CDN in index.html)
function celebrateWithConfetti() {
  if (typeof confetti !== 'function') return;
  const defaults = { origin: { y: 0.7 }, spread: 70, gravity: 0.9, scalar: 1 };

  // Fire several bursts for a richer effect
  for (let i = 0; i < CONFETTI_BURSTS; i++) {
    window.setTimeout(() => {
      confetti({ ...defaults, particleCount: 80, startVelocity: 40 });
      confetti({ ...defaults, particleCount: 40, startVelocity: 55, scalar: 0.9 });
    }, i * 350);
  }
}

// Balloons: create DOM elements that float up and then clean up
function spawnBalloons(count) {
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const color = `hsl(${hue} 85% 65%)`;

    const x = Math.random() * 100; // vw
    const duration = 8 + Math.random() * 6; // seconds
    const delay = Math.random() * 1.2; // seconds

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${x}vw`;
    balloon.style.background = color;
    balloon.style.animation = `floatUp ${duration}s ease-in ${delay}s forwards`;

    const stringEl = document.createElement('div');
    stringEl.className = 'string';
    stringEl.style.left = `calc(${x}vw + 11px)`;
    stringEl.style.bottom = '-160px';
    stringEl.style.height = '120px';
    stringEl.style.animation = `floatUp ${duration}s ease-in ${delay}s forwards`;

    document.body.appendChild(balloon);
    document.body.appendChild(stringEl);

    // Cleanup after animation
    window.setTimeout(() => {
      balloon.remove();
      stringEl.remove();
    }, (duration + delay) * 1000 + 200);
  }
}



