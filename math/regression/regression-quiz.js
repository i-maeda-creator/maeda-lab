document.querySelectorAll(".lesson-quiz").forEach((quiz) => {
  const answer = Number(quiz.dataset.answer);
  const result = quiz.querySelector(".quiz-result");
  const explanation = quiz.querySelector(".quiz-explanation");
  const buttons = [...quiz.querySelectorAll("button[data-choice]")];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = Number(button.dataset.choice);
      const correct = selected === answer;

      buttons.forEach((item) => {
        item.disabled = true;
        item.classList.toggle("is-correct", Number(item.dataset.choice) === answer);
        item.classList.toggle("is-wrong", item === button && !correct);
      });

      result.textContent = correct ? "正解です。" : "不正解です。";
      result.className = `quiz-result ${correct ? "is-correct" : "is-wrong"}`;
      explanation.hidden = false;
    });
  });
});
