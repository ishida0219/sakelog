# sakelog 作業メモ

## 現在までの対応内容

`html` 配下の Node.js アプリを Docker で起動できるように、以下を追加しました。

- `docker/docker-compose.yml`
- `docker/nodejs/Dockerfile`
- `docker/nodejs/entrypoint.sh`
- `docker/nodejs/logs/.gitkeep`

構成の要点:

- Node.js 22 ベースの開発用コンテナ
- `pnpm dev` でアプリを起動
- `html` ディレクトリを `/app` にマウント
- `node_modules` と `pnpm` ストアは Docker volume で保持
- Vite のブラウザログ出力先 `html/.manus-logs` を `docker/nodejs/logs` に永続化
- `html/.env` を `env_file` として compose から読み込み

## 起動手順

リポジトリ直下で以下を実行します。

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

アクセス先:

```text
http://localhost:3000/
```

LAN 内からアクセスする場合は、Docker ホストの IP を使って以下のようにアクセスします。

```text
http://<dockerホストIP>:3000/
```

## DB 設定

MySQL 接続用に `html/.env` を作成済みです。

設定対象:

```env
DATABASE_URL=mysql://mysql:mysql@192.168.100.32:3306/sakelog_db
```

テーブルはまだ未作成の場合、以下で Drizzle のスキーマを反映できます。

```bash
docker compose -f docker/docker-compose.yml exec nodejs pnpm db:push
```

作成対象テーブル:

- `users`
- `sake_records`
- `ratings`

## 環境変数

雛形は `html/.env.example` に記載しています。

```env
DATABASE_URL=mysql://mysql:mysql@192.168.100.32:3306/sakelog_db
VITE_APP_ID=your-app-id
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.example.com
OAUTH_SERVER_URL=https://your-oauth-api.example.com
JWT_SECRET=replace-with-a-long-random-string
OWNER_OPEN_ID=
```

## 発生した問題と対応

### 1. OAuth 環境変数未設定時のフロントエラー

`VITE_OAUTH_PORTAL_URL` と `VITE_APP_ID` が未設定の状態でアクセスすると、`new URL(...)` 実行時に `TypeError: Invalid URL` が発生していました。

対応内容:

- `html/client/src/const.ts` を修正
- OAuth 関連の環境変数が未設定でも画面全体が即時クラッシュしないように変更
- 未設定時はログイン URL を `#` にフォールバックし、警告を出す動作に変更

## 現在の制約

DB 接続だけでは SNS ログインは動きません。認証を有効化するには以下が必要です。

- `VITE_APP_ID`
- `VITE_OAUTH_PORTAL_URL`
- `OAUTH_SERVER_URL`
- `JWT_SECRET`

これらが未設定の場合:

- 画面表示は可能
- OAuth ログインは利用不可

## ログ確認

アプリの標準出力:

```bash
docker compose -f docker/docker-compose.yml logs -f
```

ブラウザログ保存先:

```text
docker/nodejs/logs/
```
