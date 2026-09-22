# Windowsで続きを編集する

このサイトは静的HTMLです。Windowsでも同じ編集元・生成コマンドを使えます。
端末間ではGitHubのコミットを共有します。未コミットの変更やブラウザ内の既読状態は自動同期されません。

## このノートで再開

Codexでこのリポジトリのフォルダーをプロジェクトとして開きます。
現在の場所は `C:\Users\kyomi\Documents\Codex\2026-09-19\wata\work\maeda-lab` です。
「AGENTS.mdと関連する編集方針を読んで、続きを更新して」と依頼すれば編集元を確認できます。

PowerShellでリポジトリに移動し、作業開始時に以下を実行します。

```powershell
git status
git pull --ff-only
```

未コミットの変更があるときは、先に内容を確認してコミットしてください。
同期が失敗した場合、強制上書きせず変更を確認します。

## 別のWindows端末で初めて開く

GitとNode.jsを用意し、GitHubにログインして次を実行します。
追加のnpmパッケージは不要です。

```powershell
git clone https://github.com/i-maeda-creator/maeda-lab.git
cd maeda-lab
```

Codexでこのフォルダーを開きます。会話履歴がなくても、`AGENTS.md` と `docs/` の編集方針から引き継げます。

## 編集元と確認

| 分野 | 編集元 | 方針 |
| --- | --- | --- |
| Cloud | `content/cloud/` | `docs/cloud-editorial.md` |
| Accounting | `content/accounting/catalog.json`、`challenges.json` | `docs/accounting-editorial.md` |
| AI | `content/ai/catalog.json` | `docs/ai-editorial.md` |
| ホーム | `index.html`、`styles.css` | 関連分野の方針も確認 |

変更した分野のコマンドを実行します。

```powershell
node tools/build-cloud.mjs
node tools/check-cloud.mjs
node tools/check-accounting.mjs
node tools/check-ai.mjs
```

AccountingとAIのcheckコマンドは生成も行います。編集元と生成されたHTMLを一緒にコミットしてください。
表示確認は `index.html` をブラウザで開けます。HTTPで確認する場合はPythonがある環境で次を実行します。

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

ブラウザで `http://127.0.0.1:8765/` を開きます。終了はCtrl+Cです。

## 保存と本番公開

変更を確認して作業ブランチにコミット・pushし、GitHubでPRを作成します。
検証後にmainへマージするとGitHub Pagesの公開が始まります。
ユーザーから本番公開の許可は得ています。公開処理の成功と本番の表示を確認して完了とします。

端末を切り替える前にpushし、次の端末でpullしてください。同じブランチを複数端末で同時編集しないようにします。
ネット接続がない間もローカル編集はできますが、同期と公開には接続が必要です。

本番: https://i-maeda-creator.github.io/maeda-lab/
