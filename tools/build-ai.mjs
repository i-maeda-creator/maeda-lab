import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const catalog=JSON.parse(fs.readFileSync(path.join(root,'content/ai/catalog.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(url,title)=>`<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(title)} ↗</a>`;
const current=catalog.editions.at(-1), selected=new Set(current.featured);
const get=id=>catalog.tools.find(t=>t.id===id);
const cards=ids=>ids.map(id=>{const t=get(id);return `<a href="${esc(t.url)}" target="_blank" rel="noreferrer"><strong>${esc(t.name)}</strong><small>${esc(t.tagline)}</small></a>`;}).join('\n');
const home=`<!-- AI-CATALOG:START -->
<article class="tool-group dark wide ai-creation" id="ai-creation" aria-labelledby="ai-creation-title">
<span id="ai-creation-title">AI / Creation</span>
<div class="ai-intro"><h3>いまのAIで、何をつくる？</h3><p>開発・制作、そして判断の自動化へ。目的から選ぶ${current.featured.length}の入口。</p><p class="ai-updated">編集・確認日：<time datetime="${catalog.updated}">${catalog.updated.replaceAll('-','.')}</time> · 編集セレクション</p></div>
${catalog.categories.filter(c=>current.featured.some(id=>get(id).category===c.id)).sort((a,b)=>a.id==='decision'?-1:b.id==='decision'?1:0).map(c=>`<section class="ai-category" aria-labelledby="home-${c.id}"><h4 id="home-${c.id}"><span>${c.id==='decision'?'NEW / 新着を追う':esc(c.id.toUpperCase())}</span>${esc(c.title)}</h4><div class="tool-links">${cards(current.featured.filter(id=>get(id).category===c.id))}</div>${c.id==='decision'?'<p class="ai-context">Jev：9月15日に早期アクセスを発表。アプリの中で分類や振り分けを行う判断用モデル。</p>':''}</section>`).join('\n')}
<p class="ai-archive-link"><a href="ai/index.html">各AIの短い解説・掲載履歴・流れを読む →</a></p>
</article>
<!-- AI-CATALOG:END -->`;
const hp=path.join(root,'index.html');let html=fs.readFileSync(hp,'utf8');
if(html.includes('<!-- AI-CATALOG:START -->'))html=html.replace(/<!-- AI-CATALOG:START -->[\s\S]*?<!-- AI-CATALOG:END -->/,home);
else html=html.replace(/<article class="tool-group dark wide ai-creation"[\s\S]*?<\/article>/,home);
fs.writeFileSync(hp,html);
const editions=[...catalog.editions].reverse().map(e=>{const i=catalog.editions.indexOf(e),previous=new Set(catalog.editions[i-1]?.featured||[]);const added=e.featured.filter(id=>!previous.has(id));const removed=[...previous].filter(id=>!e.featured.includes(id));const names=ids=>ids.map(id=>`<a href="#${id}">${esc(e.names?.[id]||get(id).name)}</a>`).join('、');return `<article class="edition"><time>${esc(e.date)}</time><h3>${esc(e.title)}</h3><p>${esc(e.reason)}</p>${i?`<p><b>追加：</b>${names(added)||'なし'}</p><p><b>ホームから外したもの：</b>${names(removed)||'なし'}</p>`:''}<details><summary>この時点の掲載一覧（${e.featured.length}件）</summary><p>${names(e.featured)}</p></details></article>`;}).join('');
const entries=[...catalog.tools].sort((a,b)=>Number(selected.has(b.id))-Number(selected.has(a.id)) || (a.id==='jev'?-1:b.id==='jev'?1:a.name.localeCompare(b.name))).map(t=>`<article class="ai-entry" id="${t.id}" data-status="${selected.has(t.id)?'current':'past'}" data-category="${t.category}"><div class="entry-meta"><span>${selected.has(t.id)?'ホーム掲載中':'過去の掲載'}</span><span>${esc(catalog.categories.find(c=>c.id===t.category).title)}</span></div><h3>${esc(t.name)}</h3><p>${esc(t.summary)}</p>${t.note?`<p class="entry-note">${esc(t.note)}</p>`:''}<p class="checked">${t.verified?`情報確認：${t.verified}`:'掲載当時の用途を保存。現在の提供状況は未確認。'}</p><details><summary>公式リンク・掲載の記録</summary><ul>${t.sources.map(s=>`<li>${link(s.url,s.title)}</li>`).join('')}</ul><p>${catalog.editions.filter(e=>e.featured.includes(t.id)).map(e=>`${esc(e.date)}：${esc(e.title)}`).join('<br>')}</p></details></article>`).join('');
const page=`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AIの解説・履歴・流れ | Maeda Lab</title><meta name="description" content="いま紹介しているAIと過去の掲載ツールを、短い解説と公式資料、掲載履歴で振り返る。"><link rel="stylesheet" href="ai.css"></head><body>
<a class="skip" href="#main">本文へ</a><header><a href="../index.html">Maeda Lab</a><nav aria-label="このページ"><a href="#trends">流れ</a><a href="#directory">AI図鑑</a><a href="#history">掲載履歴</a></nav></header>
<main id="main"><div class="intro"><p class="eyebrow">AI FIELD NOTES / ${catalog.updated}</p><h1>AIのいまを選び、<br>変化を残す。</h1><p>ホームは、いま試したいもの。ここは、それぞれの役割と、入れ替わりを振り返るノート。</p><a href="../index.html#ai-creation">ホームのAI / Creationへ →</a></div>
<section id="trends"><p class="eyebrow">01 / OBSERVATION</p><h2>「答える」から「つくる・動く・判断する」へ</h2><p>以下は公式発表を手がかりにした編集上の考察です。利用者数や市場シェアを測った人気ランキングではありません。各方向は置き換わるのではなく、重なって進んでいます。</p>
<div class="trend-map" aria-label="AIの役割の広がり"><article><span>対話</span><h3>人が相談する</h3><p>ChatGPT・Claude・Gemini</p></article><article><span>制作・実行</span><h3>作業を進める</h3><p>開発エージェント・Flow</p></article><article><span>判断の部品化</span><h3>処理の行き先を選ぶ</h3><p>Jevなどの判断用モデル</p></article></div>
<aside class="analysis"><h3>今回の読み取り：万能さに加えて、役割の分担を見る</h3><p>文章を作るAI、分類するAI、実際に操作するコードを組み合わせると、作業ごとに速度・費用・確かさを検討できます。Jevはこの方向を見るための新着例です。既存のLLMも分類や構造化出力を扱えるため、すべてを新しいモデルへ置き換えるという話ではありません。</p><p><b>次に追う点：</b>提供元以外の実例、同じ条件での精度と費用、長く運用した結果。公開直後の話題性と、継続利用が定着することを分けて観察します。</p></aside>
<h3 class="subheading">公式発表からたどる節目</h3><ol class="timeline">${catalog.timeline.map(e=>`<li><time>${e.date}</time><h3>${esc(e.title)}</h3><p><b>発表：</b>${esc(e.fact)}</p><p><b>読み取り：</b>${esc(e.analysis)}</p>${link(e.url,'公式発表')}</li>`).join('')}</ol></section>
<section id="directory"><p class="eyebrow">02 / DIRECTORY</p><h2>AIの短い解説</h2><p>ホームから外したものも残します。「過去の掲載」はサービス終了や人気低下を意味しません。</p><form class="filters" role="search"><label>名前・用途で探す<input id="search" type="search" placeholder="例：Jev、動画、コード"></label><label>掲載状況<select id="status"><option value="all">すべて</option><option value="current">ホーム掲載中</option><option value="past">過去の掲載</option></select></label><label>用途<select id="category"><option value="all">すべて</option>${catalog.categories.map(c=>`<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></label><button type="reset">リセット</button></form><p id="result-count" role="status">${catalog.tools.length}件を表示</p><p id="empty" hidden>該当するAIがありません。検索語や絞り込みを変えてください。</p><div class="directory">${entries}</div><noscript><p>JavaScriptが無効な場合も、全件の解説と履歴をこのまま読めます。</p></noscript></section>
<section id="history"><p class="eyebrow">03 / EDITORIAL HISTORY</p><h2>ホームの掲載履歴</h2><p>このサイトが何を選んだかの記録です。製品の発売履歴や市場全体の流行とは分けて扱います。最初の記録より前の初回掲載日は推定しません。</p>${editions}</section>
</main><footer>Maeda Lab · AI Field Notes · <a href="../index.html#ai-creation">ホームへ</a></footer><script src="ai.js" defer></script></body></html>`;
fs.mkdirSync(path.join(root,'ai'),{recursive:true});fs.writeFileSync(path.join(root,'ai/index.html'),page);
console.log(`Built AI directory: ${catalog.tools.length} entries, ${current.featured.length} featured, ${catalog.editions.length} editions.`);
