// scroll reveal
const revealTargets = document.querySelectorAll(".content > *, .profile-grid, .timeline, .compare-table, .note-box, .chapter-card");
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in-view"));
}

// accordion
document.querySelectorAll(".accordion-item").forEach((item) => {
  const button = item.querySelector("button");
  const panel = item.querySelector(".panel");
  if (!button || !panel) return;

  button.addEventListener("click", () => {
    const isOpen = item.dataset.open === "true";
    item.dataset.open = isOpen ? "false" : "true";
    panel.style.maxHeight = isOpen ? "0px" : `${panel.scrollHeight}px`;
  });
});
