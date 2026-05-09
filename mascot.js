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
    magic: false,
    speed: 1,
    direction: 1,
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

  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
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
    const rawProgress = ((time - state.startedAt) % duration) / duration;
    const progress = state.direction === -1 ? (1 - rawProgress) % 1 : rawProgress;
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
      return orient({ x: left + d, y: bottom, rotation, scale: s });
    }
    d -= bottomLen;

    if (d <= rightLen) {
      const rotation = d > rightLen * (1 - corner)
        ? angleBetween(-90, 180, ease((d - rightLen * (1 - corner)) / (rightLen * corner)))
        : -90;
      return orient({ x: right, y: bottom - d, rotation, scale: s });
    }
    d -= rightLen;

    if (d <= topLen) {
      const rotation = d > topLen * (1 - corner)
        ? angleBetween(180, 90, ease((d - topLen * (1 - corner)) / (topLen * corner)))
        : 180;
      return orient({ x: right - d, y: top, rotation, scale: s });
    }
    d -= topLen;

    const rotation = d > leftLen * (1 - corner)
      ? angleBetween(90, 0, ease((d - leftLen * (1 - corner)) / (leftLen * corner)))
      : 90;
    return orient({ x: 0, y: top + d, rotation, scale: s });
  }

  function orient(point) {
    return point;
  }

  function syncPathTo(point) {
    const now = performance.now();
    const s = point.scale || state.scale || scale();
    const { width, height } = mascotSize(s);
    const inset = 18;
    const top = 62;
    const left = -width - 18;
    const right = window.innerWidth - width + 18;
    const bottom = window.innerHeight - height - inset;
    const bottomLen = right - left;
    const rightLen = bottom - top;
    const topLen = right;
    const leftLen = bottom - top;
    const total = bottomLen + rightLen + topLen + leftLen;
    let d;

    if (Math.abs(point.y - bottom) < 54) {
      d = Math.min(Math.max(point.x - left, 0), bottomLen);
    } else if (Math.abs(point.x - right) < 54) {
      d = bottomLen + Math.min(Math.max(bottom - point.y, 0), rightLen);
    } else if (Math.abs(point.y - top) < 54) {
      d = bottomLen + rightLen + Math.min(Math.max(right - point.x, 0), topLen);
    } else {
      d = bottomLen + rightLen + topLen + Math.min(Math.max(point.y - top, 0), leftLen);
    }

    const forwardProgress = d / total;
    const rawProgress = state.direction === -1 ? (1 - forwardProgress) % 1 : forwardProgress;
    state.startedAt = now - rawProgress * (54000 / state.speed);
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
    return state.y < 90;
  }

  function isOnSideEdge() {
    return state.y > 92 && (state.x < 54 || state.x > window.innerWidth - 190);
  }

  function isOnLeftSideEdge() {
    return state.x < 54 && state.y > 92;
  }

  function isOnBottomEdge() {
    const s = state.scale;
    const { height } = mascotSize(s);
    const bottom = window.innerHeight - height - 18;
    return Math.abs(state.y - bottom) < 42;
  }

  function clearWriting() {
    window.clearTimeout(state.typeTimer);
    state.writing = false;
    mascot.classList.remove("is-writing", "is-writing-left", "is-writing-right");
    if (writing) writing.textContent = "";
  }

  function writeNiceMessage() {
    if (state.writing || state.falling || state.magic || reduceMotion.matches) return;
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
    if (state.speeding || state.falling || state.writing || state.magic || reduceMotion.matches) return;
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
          state.direction *= -1;
          syncPathTo({ x: toX, y: toY, rotation: 0, scale: s });
          if (state.paused) mascot.classList.add("is-paused");
        }, 1500);
      }, 720);
    }

    requestAnimationFrame(animateFall);
  }

  function landingPoint() {
    const s = state.scale;
    const { width, height } = mascotSize(s);
    const heroTitle = document.querySelector(".hero h1");
    const brand = document.querySelector(".brand");
    const target = heroTitle && heroTitle.getBoundingClientRect().top > -20
      ? heroTitle
      : brand;
    const rect = target.getBoundingClientRect();
    const letterX = rect.left + Math.min(rect.width * 0.06, 34);
    const letterTop = rect.top + Math.min(rect.height * 0.18, 18);
    return {
      x: Math.min(Math.max(8, letterX - width * 0.42), window.innerWidth - width - 8),
      y: Math.min(Math.max(8, letterTop - height + 12), window.innerHeight - height - 18),
      scale: s,
    };
  }

  function magicFlightFromLeft() {
    if (state.magic || state.falling || state.writing || state.speeding || reduceMotion.matches) return;
    clearWriting();
    state.magic = true;
    state.paused = true;
    mascot.classList.remove("is-paused", "is-crying", "is-crashed", "is-falling");
    mascot.classList.add("is-magic-flying");

    const start = performance.now();
    const s = state.scale;
    const { height } = mascotSize(s);
    const from = { x: state.x, y: state.y };
    const land = landingPoint();
    const centerX = window.innerWidth * 0.52;
    const centerY = Math.max(92, window.innerHeight * 0.37);
    const radiusX = Math.max(180, window.innerWidth * 0.38);
    const radiusY = Math.max(110, window.innerHeight * 0.26);
    const liftDuration = 1450;
    const loopDuration = 5200;
    const landDuration = 1350;

    function fly(now) {
      const elapsed = now - start;

      if (elapsed < liftDuration) {
        const t = ease(elapsed / liftDuration);
        const wave = Math.sin(t * Math.PI * 2) * 14;
        place({
          x: from.x + (window.innerWidth * 0.18 - from.x) * t + wave,
          y: from.y - Math.min(240, from.y - 30) * t - Math.sin(t * Math.PI) * 62,
          rotation: 48 - 25 * t,
          scale: s,
        });
        requestAnimationFrame(fly);
        return;
      }

      if (elapsed < liftDuration + loopDuration) {
        const t = (elapsed - liftDuration) / loopDuration;
        const angle = Math.PI * 1.15 + Math.PI * 2.12 * t;
        const wobble = Math.sin(t * Math.PI * 10) * 8;
        place({
          x: centerX + Math.cos(angle) * radiusX - 66 * s,
          y: centerY + Math.sin(angle) * radiusY - height * 0.54 + wobble,
          rotation: 18 + Math.cos(angle) * 13,
          scale: s,
        });
        requestAnimationFrame(fly);
        return;
      }

      const t = Math.min(1, (elapsed - liftDuration - loopDuration) / landDuration);
      const eased = easeOutBack(t);
      const currentAngle = Math.PI * 1.15 + Math.PI * 2.12;
      const sx = centerX + Math.cos(currentAngle) * radiusX - 66 * s;
      const sy = centerY + Math.sin(currentAngle) * radiusY - height * 0.54;
      place({
        x: sx + (land.x - sx) * eased,
        y: sy + (land.y - sy) * ease(t) - Math.sin(t * Math.PI) * 44,
        rotation: angleBetween(14, 0, ease(t)),
        scale: s,
      }, t > 0.86);

      if (t < 1) {
        requestAnimationFrame(fly);
        return;
      }

      place({ x: land.x, y: land.y, rotation: 0, scale: s }, true);
      mascot.classList.remove("is-magic-flying");
      mascot.classList.add("is-waving");

      window.setTimeout(() => {
        mascot.classList.remove("is-waving");
        mascot.classList.add("is-jumping");
        const jumpStart = performance.now();
        const bottomY = window.innerHeight - height - 18;
        const startPoint = { x: land.x, y: land.y };
        const jumpX = Math.min(window.innerWidth - 132 * s - 18, land.x + 96);

        function jump(nowJump) {
          const jumpT = Math.min(1, (nowJump - jumpStart) / 820);
          place({
            x: startPoint.x + (jumpX - startPoint.x) * jumpT,
            y: startPoint.y + (bottomY - startPoint.y) * (jumpT * jumpT) - Math.sin(jumpT * Math.PI) * 58,
            rotation: 24 + 250 * jumpT,
            scale: s,
          });

          if (jumpT < 1) {
            requestAnimationFrame(jump);
            return;
          }

          mascot.classList.remove("is-jumping");
          mascot.classList.add("is-crashed");
          place({ x: jumpX, y: bottomY, rotation: 88, scale: s });

          window.setTimeout(() => {
            mascot.classList.remove("is-crashed");
            mascot.classList.add("is-laughing");
            place({ x: jumpX, y: bottomY, rotation: 0, scale: s }, true);

            window.setTimeout(() => {
              mascot.classList.remove("is-laughing");
              state.magic = false;
              state.paused = reduceMotion.matches;
              state.direction *= -1;
              syncPathTo({ x: jumpX, y: bottomY, rotation: 0, scale: s });
              if (state.paused) mascot.classList.add("is-paused");
            }, 1700);
          }, 560);
        }

        requestAnimationFrame(jump);
      }, 3000);
    }

    requestAnimationFrame(fly);
  }

  function tick(time) {
    if (!state.paused && !state.falling && !state.writing && !state.magic && !reduceMotion.matches) {
      place(pathPoint(time));
    }
    requestAnimationFrame(tick);
  }

  mascot.addEventListener("mouseenter", () => {
    if (isOnTopEdge()) {
      fallFromTop();
      return;
    }
    if (isOnLeftSideEdge()) {
      magicFlightFromLeft();
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
    if (state.falling || state.writing || state.speeding || state.magic) return;
    state.paused = true;
    state.pausedAt = performance.now();
    mascot.classList.add("is-paused");
    place({ x: state.x, y: state.y, rotation: state.rotation, scale: state.scale }, true);
  });

  mascot.addEventListener("mouseleave", () => {
    if (state.falling || state.speeding || state.magic) return;
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
