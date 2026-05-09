const mascot = document.querySelector(".lab-girl");

if (mascot) {
  const turn = mascot.querySelector(".lab-girl__turn");
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

  function mascotSize(s) {
    return {
      width: 132 * s,
      height: 154 * s,
    };
  }

  function angleBetween(from, to, t) {
    const delta = ((to - from + 540) % 360) - 180;
    return from + delta * t;
  }

  function ease(t) {
    return t * t * (3 - 2 * t);
  }

  function pathPoint(time) {
    const s = scale();
    const { width, height } = mascotSize(s);
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
    const corner = 0.1;
    const total = bottomLen + rightLen + topLen + leftLen;
    let d = progress * total;

    if (d <= bottomLen) {
      const rotation = d > bottomLen * (1 - corner)
        ? angleBetween(0, -90, ease((d - bottomLen * (1 - corner)) / (bottomLen * corner)))
        : 0;
      return { x: left + d, y: bottom, rotation, scale: s };
    }
    d -= bottomLen;

    if (d <= rightLen) {
      const rotation = d > rightLen * (1 - corner)
        ? angleBetween(-90, 180, ease((d - rightLen * (1 - corner)) / (rightLen * corner)))
        : -90;
      return { x: right, y: bottom - d, rotation, scale: s };
    }
    d -= rightLen;

    if (d <= topLen) {
      const rotation = d > topLen * (1 - corner)
        ? angleBetween(180, 90, ease((d - topLen * (1 - corner)) / (topLen * corner)))
        : 180;
      return { x: right - d, y: top, rotation, scale: s };
    }
    d -= topLen;

    const rotation = d > leftLen * (1 - corner)
      ? angleBetween(90, 0, ease((d - leftLen * (1 - corner)) / (leftLen * corner)))
      : 90;
    return { x: 0, y: top + d, rotation, scale: s };
  }

  function place(point, front = false) {
    state.x = point.x;
    state.y = point.y;
    state.rotation = front ? 0 : point.rotation;
    state.scale = point.scale;
    mascot.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    if (turn) {
      turn.style.transform = `rotate(${state.rotation}deg)`;
    }
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
      const s = scale();
      const { width, height } = mascotSize(s);
      place({ x: window.innerWidth - width - 18, y: window.innerHeight - height - 18, rotation: 0, scale: s }, true);
    } else {
      mascot.classList.remove("is-paused");
      state.startedAt = performance.now();
    }
  });

  if (state.paused) {
    mascot.classList.add("is-paused");
    const s = scale();
    const { width, height } = mascotSize(s);
    place({ x: window.innerWidth - width - 18, y: window.innerHeight - height - 18, rotation: 0, scale: s }, true);
  } else {
    place(pathPoint(performance.now()));
  }

  requestAnimationFrame(tick);
}
