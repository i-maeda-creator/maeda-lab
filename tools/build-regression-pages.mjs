import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("C:/Users/kyomi/Documents/Codex/2026-05-06/maeda-lab");
const sourceRoot = path.resolve("C:/Users/kyomi/Documents/Codex/2026-05-08/md-pdf-a-b-r-c");
const outRoot = path.join(siteRoot, "math", "regression");
const figureOut = path.join(outRoot, "figures");
const assetVersion = "20260509-quiz";

const lessons = [
  ["01_regression_ols.md", "回帰分析と最小二乗法"],
  ["02_standardized_coefficients.md", "標準化回帰係数"],
  ["03_error_ranges.md", "回帰係数の誤差範囲、残差の誤差範囲"],
  ["04_residual_diagnostics.md", "残差分析"],
  ["05_r2_adjusted_r2.md", "R²値 / 自由度調整済みR²値"],
  ["06_pvalue_t_chisq.md", "P値、t値、t分布、カイ二乗分布"],
];

const roadmap = [
  "多重共線性",
  "外れ値と強影響点",
  "交互作用",
  "F検定",
  "AIC",
  "回帰評価指標 MSE / RMSE / MAE / RMSLE / R²",
];

const figureNotes = {
  "01_scatter_fit.svg": "横軸は月間架電数、縦軸は月間契約数。点は担当者、線は最小二乗法で引いた回帰直線。",
  "01_sim_scatter_fit.svg": "横軸は月間架電数、縦軸は月間契約数。真の傾き0.04を持つデータから推定した直線。",
  "01_residuals.svg": "横軸は予測値、縦軸は残差。0の上下にランダムに散るほど直線モデルとして自然。",
  "02_standardized_betas.svg": "縦軸は標準化回帰係数。0から遠いほど、他の変数を考慮した相対的な関係が大きい。",
  "02_pairs.svg": "各活動量と契約数の散布図。単位が違う変数同士を見比べる前に、関係の形を確認する。",
  "03_residual_hist.svg": "横軸は残差、縦軸は度数。残差が0付近に集まるか、極端なズレがないかを見る。",
  "03_residual_scatter.svg": "横軸は予測値、縦軸は残差。ばらつきが扇形に広がる場合は等分散性に注意。",
  "03_intervals.svg": "青の破線は平均予測の信頼区間、緑の点線は新しい観測値の予測区間。予測区間の方が広い。",
  "03_slope_distribution.svg": "横軸は推定された傾き。繰り返し標本を取ると係数推定値がどれくらい揺れるかを示す。",
  "04_homoscedasticity.svg": "横軸は予測値、縦軸は残差。予測値の大小で残差の幅が変わりすぎないかを見る。",
  "04_independence.svg": "横軸はデータの順番、縦軸は残差。連続してプラス/マイナスが続く場合は独立性に注意。",
  "04_residual_hist.svg": "横軸は残差、縦軸は度数。左右の歪みや極端な外れを確認する。",
  "04_qqplot.svg": "横軸は理論上の正規分位、縦軸は残差の分位。点が直線に近いほど正規性を仮定しやすい。",
  "05_r2_adjusted.svg": "縦軸は0から1の説明力。R²と調整済みR²を並べ、変数追加の効果を見比べる。",
  "05_variance_decomposition.svg": "縦軸は平方和。モデルで説明できた部分と説明できなかった残差部分を分けて見る。",
  "06_t_distribution.svg": "横軸はt値、縦軸は密度。赤い両端の面積が両側検定のp値。",
  "06_chisq_distribution.svg": "横軸はカイ二乗値、縦軸は密度。自由度が大きいほど山は右へ移動する。",
  "06_squared_deviations.svg": "横軸はデータ値、縦軸は平均との差の2乗。平均から遠い値ほど大きく効く。",
};

const quizzes = {
  "01_regression_ols.md": {
    question: "最小二乗法が最小にしようとしているものはどれですか？",
    choices: [
      "残差の合計",
      "残差の2乗の合計",
      "説明変数の平均",
      "契約数の最大値",
    ],
    answer: 1,
    explanation: "残差はプラスとマイナスで打ち消し合うため、2乗して合計したものを最小にする直線を選びます。",
  },
  "02_standardized_coefficients.md": {
    question: "標準化回帰係数を見る主な目的はどれですか？",
    choices: [
      "単位が違う説明変数の影響を比べやすくする",
      "回帰式の切片を必ず0にする",
      "p値を計算しないで済ませる",
      "外れ値を自動で削除する",
    ],
    answer: 0,
    explanation: "標準化すると平均0・標準偏差1の尺度にそろうため、単位が違う変数同士を比較しやすくなります。",
  },
  "03_error_ranges.md": {
    question: "一般に、信頼区間と予測区間ではどちらが広くなりやすいですか？",
    choices: [
      "信頼区間",
      "予測区間",
      "必ず同じ幅",
      "標本数と無関係に決まる",
    ],
    answer: 1,
    explanation: "予測区間は新しい1人のばらつきまで含むため、平均の推定範囲である信頼区間より広くなりやすいです。",
  },
  "04_residual_diagnostics.md": {
    question: "残差分析でまず見たいこととして最も近いものはどれですか？",
    choices: [
      "残差に規則的な形が出ていないか",
      "説明変数の単位が全部同じか",
      "R²が必ず1に近いか",
      "係数がすべて正か",
    ],
    answer: 0,
    explanation: "残差が0の周りにランダムに散っているかを見ます。規則的な形があると、モデルが何かを見落としている可能性があります。",
  },
  "05_r2_adjusted_r2.md": {
    question: "自由度調整済みR²値が必要になる理由はどれですか？",
    choices: [
      "説明変数を増やすだけでR²が上がりやすいから",
      "R²は必ずマイナスになるから",
      "残差分析が不要になるから",
      "目的変数の単位を消すため",
    ],
    answer: 0,
    explanation: "R²は説明変数を追加すると下がりにくいため、変数を増やしたコストも考える調整済みR²が役立ちます。",
  },
  "06_pvalue_t_chisq.md": {
    question: "回帰係数のt値は、ざっくり何を表しますか？",
    choices: [
      "係数が標準誤差の何個分だけ0から離れているか",
      "目的変数の平均値",
      "説明変数の個数",
      "残差の最大値",
    ],
    answer: 0,
    explanation: "t値は 推定された係数 / 係数の標準誤差 です。0からどれくらい離れているかを標準誤差単位で見ます。",
  },
};

fs.mkdirSync(outRoot, { recursive: true });
fs.mkdirSync(figureOut, { recursive: true });

for (const file of fs.readdirSync(path.join(sourceRoot, "figures"))) {
  if (file.endsWith(".svg")) {
    fs.copyFileSync(path.join(sourceRoot, "figures", file), path.join(figureOut, file));
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inline(value) {
  return escapeHtml(value)
    .replaceAll(/`([^`]+)`/g, "<code>$1</code>")
    .replaceAll(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function slugFromFile(file) {
  return file.replace(/^\d+_/, "").replace(/\.md$/, "").replaceAll("_", "-");
}

function parseMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = [];
  let code = [];
  let inCode = false;
  let codeLang = "";

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
    list = [];
  };
  const flushCode = () => {
    html.push(`<pre><code class="language-${escapeHtml(codeLang)}">${escapeHtml(code.join("\n"))}</code></pre>`);
    code = [];
    codeLang = "";
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        inCode = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }
    if (inCode) {
      code.push(line);
      continue;
    }
    const image = trimmed.match(/^!\[(.*)]\((.*)\)$/);
    if (image) {
      flushParagraph();
      flushList();
      const alt = escapeHtml(image[1]);
      const srcName = path.basename(image[2]);
      const note = figureNotes[srcName] ?? "図のタイトル、軸、凡例を見ながら、何を比較している図か確認する。";
      html.push(`
        <figure class="lesson-figure">
          <img src="figures/${srcName}" alt="${alt}">
          <figcaption>
            <strong>${alt}</strong>
            <span>${inline(note)}</span>
          </figcaption>
        </figure>`);
      continue;
    }
    if (trimmed === "---") {
      flushParagraph();
      flushList();
      html.push("<hr>");
      continue;
    }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
      continue;
    }
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushList();
  return html.join("\n");
}

function quizHtml(file) {
  const quiz = quizzes[file];
  if (!quiz) return "";
  return `<section class="lesson-quiz" data-answer="${quiz.answer}">
    <p class="quiz-kicker">Check</p>
    <h2>まとめテスト</h2>
    <p class="quiz-question">${inline(quiz.question)}</p>
    <div class="quiz-choices">
      ${quiz.choices.map((choice, index) => `<button type="button" data-choice="${index}">${inline(choice)}</button>`).join("")}
    </div>
    <p class="quiz-result" aria-live="polite"></p>
    <p class="quiz-explanation" hidden>${inline(quiz.explanation)}</p>
  </section>`;
}

function layout({ title, body, nav = "" }) {
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | Maeda Lab</title>
    <link rel="stylesheet" href="../../styles.css">
    <link rel="stylesheet" href="regression.css?v=${assetVersion}">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="../../index.html"><span class="brand-mark">ML</span><span>Maeda Lab</span></a>
      <nav class="nav" aria-label="Primary navigation">
        <a href="../../index.html#notes">Notes</a>
        <a href="./">Regression</a>
        <a href="https://github.com/i-maeda-creator" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </header>
    <main class="lesson-shell">
      ${body}
      ${nav}
    </main>
    <script src="regression-quiz.js?v=${assetVersion}"></script>
  </body>
</html>`;
}

const lessonLinks = lessons.map(([file, title], index) => {
  const href = `${slugFromFile(file)}.html`;
  return `<a href="${href}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(title)}</a>`;
}).join("");

const overviewBody = `
  <section class="lesson-hero">
    <p class="lesson-kicker">Mathematics</p>
    <h1>回帰分析</h1>
    <p>回帰分析とは、ある変数の変化から別の変数の動きを説明・予測するための方法です。</p>
  </section>
  <section class="lesson-index">
    <h2>Contents</h2>
    <div class="lesson-list">${lessonLinks}</div>
  </section>
  <section class="lesson-index planned">
    <h2>Next</h2>
    <div class="planned-grid">${roadmap.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
  </section>`;

fs.writeFileSync(path.join(outRoot, "index.html"), layout({ title: "回帰分析", body: overviewBody }), "utf8");

for (let index = 0; index < lessons.length; index++) {
  const [file, shortTitle] = lessons[index];
  const markdown = fs.readFileSync(path.join(sourceRoot, file), "utf8");
  const content = parseMarkdown(markdown);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const nav = `<nav class="lesson-pager">
    ${prev ? `<a href="${slugFromFile(prev[0])}.html">← ${escapeHtml(prev[1])}</a>` : "<span></span>"}
    <a href="./">目次</a>
    ${next ? `<a href="${slugFromFile(next[0])}.html">${escapeHtml(next[1])} →</a>` : "<span></span>"}
  </nav>`;
  const body = `<article class="lesson-article">${content}${quizHtml(file)}</article>`;
  fs.writeFileSync(path.join(outRoot, `${slugFromFile(file)}.html`), layout({ title: shortTitle, body, nav }), "utf8");
}
