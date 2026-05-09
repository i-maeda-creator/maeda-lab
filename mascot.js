const mascot = document.querySelector(".lab-girl");

if (mascot) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    paused: reduceMotion.matches,
    startedAt: performance.now(),
    pausedAt: 0,
    x: 18,
    y: 18,
    rotation: 0,
    scale: 1,
  };

  function scale() {
    return window.innerWidth <= 760 ? 0.82 : 1;
  }

  function pathPoint(time) {
    const s = scale();
    const width = 108 * s;
    const height = 122 * s;
    const inset = 18;
    const top = 62;
    const left = -width - 18;
    const right = window.innerWidth - width + 18;
    const bottom = window.innerHeight - height - inset;
    const duration = 54000;
    const progress = ((time - state.startedAt) % duration) / duration;
    const bottomLen = right - left;
    const rightLen = bottom - top;
    const topLen = right;
    const leftLen = bottom - top;
    const total = bottomLen + rightLen + topLen + leftLen;
    let d = progress * total;

    if (d <= bottomLen) {
      return { x: left + d, y: bottom, rotation: 0, scale: s };
    }
    d -= bottomLen;

    if (d <= rightLen) {
      return { x: right, y: bottom - d, rotation: -90, scale: s };
    }
    d -= rightLen;

    if (d <= topLen) {
      return { x: right - d, y: top, rotation: 180, scale: s };
    }
    d -= topLen;

    return { x: 0, y: top + d, rotation: 90, scale: s };
  }

  function place(point, front = false) {
    state.x = point.x;
    state.y = point.y;
    state.rotation = front ? 0 : point.rotation;
    state.scale = point.scale;
    mascot.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg) scale(${state.scale})`;
  }

  function tick(time) {
    if (!state.paused && !reduceMotion.matches) {
      place(pathPoint(time));
    }
    requestAnimationFrame(tick);
  }

  mascot.addEventListener("mouseenter", () => {
    state.paused = true;
    state.pausedAt = performance.now();
    mascot.classList.add("is-paused");
    place({ x: state.x, y: state.y, rotation: state.rotation, scale: state.scale }, true);
  });

  mascot.addEventListener("mouseleave", () => {
    state.paused = reduceMotion.matches;
    state.startedAt += performance.now() - state.pausedAt;
    mascot.classList.remove("is-paused");
  });

  reduceMotion.addEventListener("change", () => {
    state.paused = reduceMotion.matches;
    if (state.paused) {
      mascot.classList.add("is-paused");
      place({ x: window.innerWidth - 126, y: window.innerHeight - 146, rotation: 0, scale: scale() }, true);
    } else {
      mascot.classList.remove("is-paused");
      state.startedAt = performance.now();
    }
  });

  if (state.paused) {
    mascot.classList.add("is-paused");
    place({ x: window.innerWidth - 126, y: window.innerHeight - 146, rotation: 0, scale: scale() }, true);
  } else {
    place(pathPoint(performance.now()));
  }

  requestAnimationFrame(tick);
}
