// progress bar
const progressBar = document.querySelector(".progress-bar");
function updateProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = height > 0 ? Math.min(1, scrollTop / height) : 0;
  progressBar.style.transform = `scaleX(${ratio})`;
}
document.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// scroll reveal
const revealTargets = document.querySelectorAll(".content > *, .diagram-card, .quiz-card, .ai-voice, .story-block");
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
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in-view"));
}

// quiz scoring
const quizzes = Array.from(document.querySelectorAll("[data-quiz]"));
const score = { answered: 0, correct: 0, total: quizzes.length };

const scoreCorrect = document.querySelector("[data-score-correct]");
const scoreTotal = document.querySelector("[data-score-total]");
const scoreRate = document.querySelector("[data-score-rate]");
const scoreMessage = document.querySelector("[data-score-message]");

function updateScore() {
  if (!scoreCorrect || !scoreTotal || !scoreRate || !scoreMessage) return;
  const rate = score.answered ? score.correct / score.answered : 0;
  const percent = Math.round(rate * 100);

  scoreCorrect.textContent = score.correct;
  scoreTotal.textContent = score.total;
  scoreRate.textContent = `${percent}%`;

  if (!score.answered) {
    scoreMessage.textContent = "クイズに答えると、このページ内での正答率が出ます。";
  } else if (score.answered < score.total) {
    scoreMessage.textContent = `${score.answered}問回答済みです。あと${score.total - score.answered}問あります。`;
  } else if (rate >= 0.8) {
    scoreMessage.textContent = "いい感じです。仕組みのイメージがつかめています。";
  } else {
    scoreMessage.textContent = "解説を読み返すと、つながりがもう少し見えてきます。";
  }
}
updateScore();

quizzes.forEach((quiz) => {
  const result = quiz.querySelector(".quiz-result");
  const explanation = quiz.querySelector(".quiz-explain");

  quiz.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const correct = button.dataset.correct === "true";
      score.answered += 1;
      if (correct) score.correct += 1;

      quiz.querySelectorAll("button").forEach((item) => {
        item.disabled = true;
        item.classList.toggle("is-correct", item.dataset.correct === "true");
      });

      if (!correct) button.classList.add("is-wrong");
      result.textContent = correct ? "正解です。" : "惜しいです。正解は緑の選択肢です。";
      result.classList.add(correct ? "is-correct" : "is-wrong");
      explanation.hidden = false;
      updateScore();
    });
  });
});
