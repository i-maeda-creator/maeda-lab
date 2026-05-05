const detailTitle = document.querySelector("#detailTitle");
const detailText = document.querySelector("#detailText");

const trackDetails = {
  IT: {
    text: "Computer science, security, databases, and algorithms.",
  },
  Accounting: {
    text: "Bookkeeping, statements, cost, and finance.",
  },
  Mathematics: {
    text: "Proofs, numbers, probability, and linear algebra.",
  },
  Competition: {
    text: "AtCoder, Kaggle, notebooks, and experiments.",
  },
  Works: {
    text: "Videos, web projects, analysis, and prototypes.",
  },
};

function setTrackDetail(track) {
  const item = trackDetails[track];
  if (!item) return;
  detailTitle.textContent = track;
  detailText.textContent = item.text;
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
