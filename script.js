const detailTitle = document.querySelector("#detailTitle");
const detailText = document.querySelector("#detailText");
const detailLink = document.querySelector("#detailLink");

const trackDetails = {
  IT: {
    text: "Network, cloud, security, programming, data, and computer science.",
    href: "it/",
    linkText: "IT Notes",
  },
  Accounting: {
    text: "Bookkeeping, statements, cost, and finance.",
  },
  Mathematics: {
    text: "Proofs, numbers, probability, and linear algebra.",
    href: "math/regression/",
    linkText: "Regression Analysis",
  },
  Physics: {
    text: "Mechanics, electromagnetism, simulations, and experiments.",
  },
};

function setTrackDetail(track) {
  const item = trackDetails[track];
  if (!item) return;
  detailTitle.textContent = track;
  detailText.textContent = item.text;
  if (item.href) {
    detailLink.hidden = false;
    detailLink.href = item.href;
    detailLink.textContent = item.linkText;
  } else {
    detailLink.hidden = true;
  }
}

document.querySelectorAll(".track-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".track-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    setTrackDetail(card.dataset.track);
  });
});

document.querySelector(".track-card")?.classList.add("active");
setTrackDetail("IT");
