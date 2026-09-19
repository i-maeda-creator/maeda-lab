# このリポジトリの編集

静的サイトです。既存のURLや他分野のページを保ち、変更を必要な範囲に限定してください。

クラウド教材を編集する場合は、まず `docs/cloud-editorial.md` と `docs/cloud-learning-log.md` を読みます。
問題は知識発見の入力として扱い、既存の概念へ統合します。問題解説を時系列に追加しません。
本文の編集元は `content/cloud/`。`node tools/build-cloud.mjs` で静的ページを生成し、
`node tools/check-cloud.mjs` で前提の順序・内部リンク・シナリオの整合性を検査します。
生成ファイルもコミットし、UI変更はブラウザで確認してください。
