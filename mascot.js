const mascot = document.querySelector(".lab-girl");

if (mascot) {
  const turn = mascot.querySelector(".lab-girl__turn");
  const writing = mascot.querySelector(".lab-girl__writing");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const niceMessage = "Have a nice day!";
  const state = {
    paused: reduceMotion.matches,
    falling: false,
    writing: false,
    speeding: false,
    speed: 1,
    typeTimer: 0,
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

  function setSpeed(nextSpeed) {
    const now = performance.now();
    const oldDuration = 54000 / state.speed;
    const progress = ((now - state.startedAt) % oldDuration) / oldDuration;
    state.speed = nextSpeed;
    state.startedAt = now - progress * (54000 / state.speed);
  }

  function pathPoint(time) {
    const s = scale();
    const { width, height } = mascotSize(s);
    const inset = 18;
    const top = 62;
    const left = -width - 18;
    const right = window.innerWidth - width + 18;
    const bottom = window.innerHeight - height - inset;
    const duration = 54000 / state.speed;
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

  function isOnTopEdge() {
    return state.y < 90 && Math.abs(Math.abs(state.rotation) - 180) < 38;
  }

  function isOnSideEdge() {
    return state.y > 92 && Math.abs(Math.abs(state.rotation) - 90) < 38;
  }

  function isOnBottomEdge() {
    const s = state.scale;
    const { height } = mascotSize(s);
    const bottom = window.innerHeight - height - 18;
    return Math.abs(state.y - bottom) < 42 && Math.abs(state.rotation) < 38;
  }

  function clearWriting() {
    window.clearTimeout(state.typeTimer);
    state.writing = false;
    mascot.classList.remove("is-writing", "is-writing-left", "is-writing-right");
    if (writing) writing.textContent = "";
  }

  function writeNiceMessage() {
    if (state.writing || state.falling || reduceMotion.matches) return;
    state.writing = true;
    state.paused = true;
    state.pausedAt = performance.now();
    mascot.classList.remove("is-paused");
    mascot.classList.add("is-writing");
    mascot.classList.toggle("is-writing-right", state.x > window.innerWidth / 2);
    mascot.classList.toggle("is-writing-left", state.x <= window.innerWidth / 2);
    if (writing) writing.textContent = "";

    let index = 0;
    function typeLetter() {
      if (!state.writing) return;
      if (writing) writing.textContent = niceMessage.slice(0, index);
      index += 1;
      if (index <= niceMessage.length) {
        state.typeTimer = window.setTimeout(typeLetter, 95);
        return;
      }
      state.typeTimer = window.setTimeout(() => {
        clearWriting();
        state.paused = reduceMotion.matches;
        state.startedAt += performance.now() - state.pausedAt;
      }, 1300);
    }

    place({ x: state.x, y: state.y, rotation: state.rotation, scale: state.scale });
    typeLetter();
  }

  function speedUpAndDropPencil() {
    if (state.speeding || state.falling || state.writing || reduceMotion.matches) return;
    state.speeding = true;
    setSpeed(3.8);
    mascot.classList.add("is-speeding");

    window.setTimeout(() => {
      mascot.classList.add("is-pencil-dropped");
    }, 520);

    window.setTimeout(() => {
      mascot.classList.remove("is-pencil-dropped");
      mascot.classList.remove("is-speeding");
      setSpeed(1);
      state.speeding = false;
    }, 2500);
  }

  function fallFromTop() {
    if (state.falling || reduceMotion.matches) return;
    clearWriting();
    state.falling = true;
    state.paused = true;
    mascot.classList.remove("is-paused");
    mascot.classList.add("is-falling");

    const start = performance.now();
    const duration = 920;
    const s = state.scale;
    const { height } = mascotSize(s);
    const from = { x: state.x, y: state.y, rotation: state.rotation };
    const toY = window.innerHeight - height - 18;
    const toX = Math.min(Math.max(18, state.x + 22), window.innerWidth - 132 * s - 18);

    function animateFall(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = t * t;
      const bounce = Math.sin(t * Math.PI) * 34;
      const point = {
        x: from.x + (toX - from.x) * t,
        y: from.y + (toY - from.y) * eased - bounce,
        rotation: from.rotation + 540 * t,
        scale: s,
      };
      place(point);

      if (t < 1) {
        requestAnimationFrame(animateFall);
        return;
      }

      mascot.classList.remove("is-falling");
      mascot.classList.add("is-crashed");
      place({ x: toX, y: toY, rotation: 88, scale: s });

      setTimeout(() => {
        mascot.classList.remove("is-crashed");
        mascot.classList.add("is-crying");
        place({ x: toX, y: toY, rotation: 0, scale: s }, true);

        setTimeout(() => {
          mascot.classList.remove("is-crying");
          state.falling = false;
          state.paused = reduceMotion.matches;
          state.startedAt = performance.now();
          if (state.paused) mascot.classList.add("is-paused");
        }, 1500);
      }, 720);
    }

    requestAnimationFrame(animateFall);
  }

  function tick(time) {
    if (!state.paused && !state.falling && !state.writing && !reduceMotion.matches) {
      place(pathPoint(time));
    }
    requestAnimationFrame(tick);
  }

  mascot.addEventListener("mouseenter", () => {
    if (isOnTopEdge()) {
      fallFromTop();
      return;
    }
    if (isOnSideEdge()) {
      writeNiceMessage();
      return;
    }
    if (isOnBottomEdge()) {
      speedUpAndDropPencil();
      return;
    }
    if (state.falling || state.writing || state.speeding) return;
    state.paused = true;
    state.pausedAt = performance.now();
    mascot.classList.add("is-paused");
    place({ x: state.x, y: state.y, rotation: state.rotation, scale: state.scale }, true);
  });

  mascot.addEventListener("mouseleave", () => {
    if (state.falling || state.speeding) return;
    if (state.writing) return;
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
