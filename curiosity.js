const hero = document.querySelector(".curiosity-hero");
const stage = document.querySelector("[data-curiosity-stage]");
const canvas = document.querySelector("[data-curiosity-canvas]");

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hero && stage) {
  const layers = Array.from(stage.querySelectorAll(".pop-layer, .pop-pencil, .pop-spark"));
  let pointerX = 0;
  let pointerY = 0;

  const setScene = () => {
    const rect = hero.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const progress = clamp((viewport * 0.82 - rect.top) / (viewport * 0.9));
    const open = prefersReduced ? 1 : progress;

    hero.style.setProperty("--open", open.toFixed(3));
    hero.style.setProperty("--tilt", `${(open - 0.5) * 10}deg`);
    hero.style.setProperty("--pointer-x", pointerX.toFixed(3));
    hero.style.setProperty("--pointer-y", pointerY.toFixed(3));

    layers.forEach((layer, index) => {
      const float = prefersReduced ? 0 : Math.sin(performance.now() / 900 + index * 0.85) * (4 + open * 8);
      layer.style.translate = `0 ${float}px`;
      layer.style.opacity = `${0.25 + open * 0.75}`;
    });
  };

  const onPointerMove = (event) => {
    const rect = hero.getBoundingClientRect();
    pointerX = clamp((event.clientX - rect.left) / rect.width, 0, 1) - 0.5;
    pointerY = clamp((event.clientY - rect.top) / rect.height, 0, 1) - 0.5;
    setScene();
  };

  const tick = () => {
    setScene();
    if (!prefersReduced) requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", setScene, { passive: true });
  window.addEventListener("resize", setScene);
  hero.addEventListener("pointermove", onPointerMove);
  tick();
}

if (canvas && !prefersReduced) {
  const context = canvas.getContext("2d");
  const particles = Array.from({ length: 68 }, (_, index) => ({
    angle: index * 0.52,
    orbit: 70 + (index % 11) * 24,
    speed: 0.00018 + (index % 7) * 0.000035,
    size: 1.2 + (index % 5) * 0.45,
  }));

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (time) => {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    const cx = rect.width * 0.72;
    const cy = rect.height * 0.48;

    context.lineWidth = 1;
    context.strokeStyle = "rgba(0, 113, 227, 0.12)";
    for (let ring = 0; ring < 4; ring += 1) {
      context.beginPath();
      context.ellipse(cx, cy, 120 + ring * 56, 48 + ring * 26, -0.22, 0, Math.PI * 2);
      context.stroke();
    }

    particles.forEach((particle) => {
      const angle = particle.angle + time * particle.speed;
      const x = cx + Math.cos(angle) * particle.orbit;
      const y = cy + Math.sin(angle) * particle.orbit * 0.42;
      context.beginPath();
      context.fillStyle = angle % 1.7 > 0.85 ? "rgba(52, 199, 89, 0.55)" : "rgba(0, 113, 227, 0.5)";
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
}
