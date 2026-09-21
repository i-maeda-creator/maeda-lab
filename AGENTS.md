# このリポジトリの編集

静的サイトです。既存のURLや他分野のページを保ち、変更を必要な範囲に限定してください。

クラウド教材を編集する場合は、まず `docs/cloud-editorial.md` と `docs/cloud-learning-log.md` を読みます。
問題は知識発見の入力として扱い、既存の概念へ統合します。問題解説を時系列に追加しません。
本文の編集元は `content/cloud/`。`node tools/build-cloud.mjs` で静的ページを生成し、
`node tools/check-cloud.mjs` で前提の順序・内部リンク・シナリオの整合性を検査します。
生成ファイルもコミットし、UI変更はブラウザで確認してください。

AI / CreationやAI解説・履歴を編集する場合は `docs/ai-editorial.md` を読みます。
編集元は `content/ai/catalog.json`。ホームの入れ替えはeditionを追記し、過去の項目・掲載名を残します。
`node tools/check-ai.mjs` でホームと解説ページを生成・検証し、生成ファイルもコミットします。

Accountingを編集する場合は `docs/accounting-editorial.md` を読みます。
編集元は `content/accounting/catalog.json` と `challenges.json`。図・説明・具体例を中心にし、漫画は難しい概念だけに使います。科目末に発展問題を置きます。
`node tools/check-accounting.mjs` で生成と短さ・図の合計・内部リンクを検証し、生成ページもコミットします。
