const quizBanks = {
  "network-l1.html": [
    [{ question: "L1の観点で、カフェのWi-Fi接続直後にまず見るものはどれでしょうか。", choices: [["電波がアクセスポイントへ届いているか", true], ["HTTPステータスコード", false], ["HTMLの構造", false], ["Webサーバーの言語", false]], explanation: "正解です。L1では、まず電波やケーブルなど、信号が物理的に届くかを確認します。" }, { question: "スマホがWi-Fiに接続できないとき、L1の原因として近いものはどれでしょうか。", choices: [["壁や距離で電波が弱い", true], ["URLのスペルミス", false], ["HTTPのPOSTとGET", false], ["CSSの読み込み順", false]], explanation: "正解です。Wi-Fiは電波なので、壁、距離、混雑、障害物の影響を受けます。" }],
    [{ question: "L1が直接扱うものとして近いものはどれでしょうか。", choices: [["電気信号や光信号", true], ["IPアドレス", false], ["JSON", false], ["HTTPヘッダー", false]], explanation: "正解です。L1は、電気・光・電波などの物理信号を扱います。" }],
    [{ question: "リンクランプが消えているとき、まず疑いやすいものはどれでしょうか。", choices: [["ケーブルやポートの物理接続", true], ["Webアプリのログイン処理", false], ["SQLのWHERE句", false], ["画像サイズ", false]], explanation: "正解です。リンクランプが消えているなら、まず物理接続を見ます。" }],
    [{ question: "MDFの説明として近いものはどれでしょうか。", choices: [["建物内外の通信配線をまとめる場所", true], ["Webページを保存する場所", false], ["パスワードを暗号化する仕組み", false], ["ブラウザの機能", false]], explanation: "正解です。MDFは、建物に入る回線と各部屋への配線をつなぐ場所です。" }],
    [{ question: "会議室だけWi-Fiが弱いとき、L1として考えやすい原因はどれでしょうか。", choices: [["壁や距離による電波の減衰", true], ["HTMLのDOCTYPE", false], ["DBの正規化", false], ["HTTPのステータスコード", false]], explanation: "正解です。場所によって違うなら、電波の届き方をまず考えます。" }],
  ],
  "network-l2.html": [
    [{ question: "L2で同じLAN内の相手を見分ける手がかりはどれでしょうか。", choices: [["MACアドレス", true], ["IPアドレス", false], ["URL", false], ["電圧", false]], explanation: "正解です。同じLAN内では、MACアドレスを使ってフレームを届けます。" }],
    [{ question: "スイッチがMACアドレス表を作るとき、学習の手がかりにするものはどれでしょうか。", choices: [["送信元MACアドレス", true], ["HTMLのtitle", false], ["DNS名", false], ["画像形式", false]], explanation: "正解です。送信元MACを見て、このMACはこのポートにいる、と覚えます。" }],
    [{ question: "宛先MACをまだ知らないとき、スイッチが行うことがある動作はどれでしょうか。", choices: [["フラッディング", true], ["NAT", false], ["暗号化", false], ["圧縮", false]], explanation: "正解です。知らない宛先には、必要な範囲へ広く流すことがあります。" }],
    [{ question: "ARPの役割として近いものはどれでしょうか。", choices: [["IPアドレスからMACアドレスを知る", true], ["電波を強くする", false], ["HTMLを作る", false], ["画像を圧縮する", false]], explanation: "正解です。ARPはL3のIPとL2のMACをつなぐ橋渡しです。" }],
    [{ question: "VLANでできることとして近いものはどれでしょうか。", choices: [["L2ネットワークを論理的に分ける", true], ["LANケーブルを光らせる", false], ["HTTPを高速化する", false], ["IPを暗号化する", false]], explanation: "正解です。VLANは同じ物理機器上でもL2ネットワークを分けられます。" }],
  ],
  "network-l3.html": [
    [{ question: "L3で主に使われる住所のようなものはどれでしょうか。", choices: [["IPアドレス", true], ["MACアドレス", false], ["電圧", false], ["HTMLタグ", false]], explanation: "正解です。L3ではIPアドレスを使ってネットワークをまたぎます。" }],
    [{ question: "同じネットワーク内かどうかの判断に関係が深いものはどれでしょうか。", choices: [["IPアドレスとサブネットマスク", true], ["HTTPヘッダーだけ", false], ["HTMLの見出し", false], ["電源ランプの色だけ", false]], explanation: "正解です。IPアドレスとサブネットマスクからネットワーク範囲を判断します。" }],
    [{ question: "デフォルトゲートウェイは、ざっくり何のために使うものでしょうか。", choices: [["外のネットワークへ出る入口", true], ["画像を保存する場所", false], ["電波の種類", false], ["ブラウザの履歴", false]], explanation: "正解です。外のネットワークへ向かうとき、まずデフォルトゲートウェイへ渡します。" }],
    [{ question: "ルーターが経路判断で主に参照するものはどれでしょうか。", choices: [["宛先IPアドレス", true], ["HTMLの文字色", false], ["キーボード配列", false], ["ファイル名の長さ", false]], explanation: "正解です。ルーターはL3機器なので、IPアドレスをもとに経路を決めます。" }],
    [{ question: "NATの説明として近いものはどれでしょうか。", choices: [["内側のIPを外向きのIPに変換する", true], ["MAC表を作る", false], ["光信号を増幅する", false], ["HTMLを翻訳する", false]], explanation: "正解です。NATはプライベートIPと外向きIPの変換として理解できます。" }],
  ],
};

function shuffle(items) {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.value);
}

function applyRandomQuestions() {
  const page = location.pathname.split("/").pop();
  const bank = quizBanks[page];
  if (!bank) return;

  document.querySelectorAll("[data-quiz]").forEach((quiz, index) => {
    const variants = bank[index];
    if (!variants || !variants.length) return;
    const variant = variants[Math.floor(Math.random() * variants.length)];
    const question = quiz.querySelector("h2");
    const options = quiz.querySelector(".quiz-options");
    const explanation = quiz.querySelector(".quiz-explain");
    if (!question || !options || !explanation) return;

    question.textContent = variant.question;
    options.innerHTML = "";
    shuffle(variant.choices).forEach(([text, correct]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.correct = correct ? "true" : "false";
      button.textContent = text;
      options.appendChild(button);
    });
    explanation.textContent = variant.explanation;
  });
}

applyRandomQuestions();

const quizzes = Array.from(document.querySelectorAll("[data-quiz]"));
const score = {
  answered: 0,
  correct: 0,
  total: quizzes.length,
};

const scoreCorrect = document.querySelector("[data-score-correct]");
const scoreTotal = document.querySelector("[data-score-total]");
const scoreRate = document.querySelector("[data-score-rate]");
const scoreDev = document.querySelector("[data-score-dev]");
const scoreMessage = document.querySelector("[data-score-message]");

function updateScore() {
  if (!scoreCorrect || !scoreTotal || !scoreRate || !scoreDev || !scoreMessage) return;

  const rate = score.answered ? score.correct / score.answered : 0;
  const percent = Math.round(rate * 100);
  const deviation = score.answered ? Math.round(Math.max(30, Math.min(70, 50 + (rate - 0.6) * 50))) : "--";

  scoreCorrect.textContent = score.correct;
  scoreTotal.textContent = score.total;
  scoreRate.textContent = `${percent}%`;
  scoreDev.textContent = deviation;

  if (!score.answered) {
    scoreMessage.textContent = "クイズに答えると、このページ内での正答率と偏差値風スコアが出ます。";
  } else if (score.answered < score.total) {
    scoreMessage.textContent = `${score.answered}問回答済みです。あと${score.total - score.answered}問あります。`;
  } else if (rate >= 0.8) {
    scoreMessage.textContent = "かなり良いです。現場で切り分ける感覚がつかめています。";
  } else if (rate >= 0.6) {
    scoreMessage.textContent = "いい感じです。間違えた問題の解説を読むと、理解がさらに安定します。";
  } else {
    scoreMessage.textContent = "まだ伸びます。まずは問いと図を行き来しながら、層ごとの役割を整えていきましょう。";
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

      button.classList.add(correct ? "selected-correct" : "is-wrong");
      result.textContent = correct ? "正解です。" : "惜しいです。正解は緑の選択肢です。";
      result.classList.add(correct ? "is-correct" : "is-wrong");
      explanation.hidden = false;
      updateScore();
    });
  });
});
