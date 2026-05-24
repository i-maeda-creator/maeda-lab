const stage = document.querySelector("[data-curiosity-stage]");

if (stage) {
  const layers = Array.from(stage.querySelectorAll(".pop-layer, .pop-pencil, .pop-spark"));

  const animate = () => {
    const rect = stage.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const progress = Math.max(0, Math.min(1, 1 - rect.top / viewport));

    stage.style.setProperty("--tilt", `${(progress - 0.5) * 8}deg`);
    layers.forEach((layer, index) => {
      const lift = Math.sin(progress * Math.PI + index * 0.7) * 10;
      layer.style.translate = `0 ${lift}px`;
    });
  };

  animate();
  window.addEventListener("scroll", animate, { passive: true });
  window.addEventListener("resize", animate);
}
