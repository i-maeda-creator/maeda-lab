# Maeda Lab

情報、会計、数学、競技、制作物をまとめる個人ホームページの初期案です。

GitHub: https://github.com/i-maeda-creator

## 開き方

`index.html` をブラウザで開くとそのまま表示できます。GitHub Pages では、このフォルダをリポジトリにして `main` ブランチの root から公開するだけで動きます。

## 更新する場所

- 日替わり問題: `script.js` の `dailySets`
- 見出しやリンク: `index.html`
- 配色や余白: `styles.css`

## クラウド教科書

入口は `it/cloud.html`。静的HTMLなのでGitHub Pagesでそのまま読めます。
本文の編集元は `content/cloud/topics/*.json`、章構成は `content/cloud/catalog.json`、
サクセスモードは `content/cloud/scenarios.json` です。生成後のHTMLもコミットします。

```sh
node tools/build-cloud.mjs
node tools/check-cloud.mjs
```

追加のパッケージは不要です。Node.jsでリポジトリの場所に依存せず実行できます。
生成された `it/cloud.html`、各トピックHTML、`search-index.js`、`scenarios.js` は直接編集しません。
見た目と操作は `it/cloud/cloud.css`、`book.js`、`success.js` を編集します。

新しい学習問題の統合は [編集方針](docs/cloud-editorial.md) に従い、
[統合記録](docs/cloud-learning-log.md) に学びと変更先を記録してください。
既読状態はブラウザ内だけに保存されます。サクセスモードの選択履歴はページを離れるとリセットされます。
