const root = document.querySelector("[data-experience]");
const book = document.querySelector("[data-book]");
const turnButton = document.querySelector("[data-turn]");
const soundButton = document.querySelector("[data-sound]");
const canvas = document.querySelector("[data-space]");
const pages = Array.from(document.querySelectorAll(".page"));

let pageIndex = 0;
let audioContext;
let musicTimer;
let soundOn = false;
let pointerX = 0;
let pointerY = 0;

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function ensureAudio() {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(frequency, start, duration, type = "sine", gain = 0.04) {
  const context = ensureAudio();
  const oscillator = context.createOscillator();
  const volume = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  volume.gain.setValueAtTime(0, start);
  volume.gain.linearRampToValueAtTime(gain, start + 0.01);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(volume).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function flipSound() {
  if (!soundOn) return;
  const now = ensureAudio().currentTime;
  tone(420, now, 0.07, "triangle", 0.05);
  tone(760, now + 0.035, 0.08, "sine", 0.035);
  tone(210, now + 0.08, 0.06, "square", 0.018);
}

function startMusic() {
  const context = ensureAudio();
  const notes = [523.25, 659.25, 783.99, 987.77, 880, 659.25, 587.33, 783.99];
  let step = 0;
  clearInterval(musicTimer);
  musicTimer = setInterval(() => {
    if (!soundOn) return;
    const now = context.currentTime;
    tone(notes[step % notes.length], now, 0.16, step % 3 === 0 ? "triangle" : "sine", 0.025);
    if (step % 4 === 0) tone(notes[(step + 3) % notes.length] / 2, now, 0.22, "sine", 0.018);
    step += 1;
  }, 180);
}

function setSound(next) {
  soundOn = next;
  soundButton?.classList.toggle("is-on", soundOn);
  if (soundOn) {
    startMusic();
    flipSound();
  } else {
    clearInterval(musicTimer);
  }
}

function turnPage() {
  if (!pages.length || book?.classList.contains("flipping")) return;
  const current = pages[pageIndex];
  pageIndex = (pageIndex + 1) % pages.length;
  const next = pages[pageIndex];

  book?.classList.add("flipping");
  current.classList.add("turning");
  current.classList.remove("active");
  next.classList.add("active");
  flipSound();

  window.setTimeout(() => {
    current.classList.remove("turning");
    book?.classList.remove("flipping");
  }, 840);
}

function updateOpen() {
  if (!root) return;
  const rect = root.getBoundingClientRect();
  const open = clamp((window.innerHeight * 0.72 - rect.top) / (window.innerHeight * 0.75));
  root.style.setProperty("--open", open.toFixed(3));
  root.style.setProperty("--tilt", `${(open - 0.5) * 10}deg`);
  root.style.setProperty("--mx", pointerX.toFixed(3));
  root.style.setProperty("--my", pointerY.toFixed(3));
}

book?.addEventListener("click", turnPage);
turnButton?.addEventListener("click", turnPage);
book?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    turnPage();
  }
});

soundButton?.addEventListener("click", () => setSound(!soundOn));

window.addEventListener("scroll", updateOpen, { passive: true });
window.addEventListener("resize", updateOpen);
window.addEventListener("pointermove", (event) => {
  pointerX = clamp(event.clientX / window.innerWidth) - 0.5;
  pointerY = clamp(event.clientY / window.innerHeight) - 0.5;
  updateOpen();
});
updateOpen();

if (canvas) {
  const context = canvas.getContext("2d");
  const particles = Array.from({ length: 120 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    size: 1 + Math.random() * 2.8,
    speed: 0.18 + Math.random() * 0.7,
    hue: index % 4,
  }));

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw(time) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      const x = (particle.x * window.innerWidth + Math.sin(time * 0.0002 * particle.speed + particle.y * 8) * 24) % window.innerWidth;
      const y = (particle.y * window.innerHeight + time * 0.018 * particle.speed) % window.innerHeight;
      const colors = ["rgba(8,119,255,.45)", "rgba(49,208,127,.42)", "rgba(255,202,58,.5)", "rgba(255,94,168,.38)"];
      context.fillStyle = colors[particle.hue];
      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
}
