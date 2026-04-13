# Codex 作業記録

## 実施内容

### Docker 化

`html` 配下の Node.js アプリを起動するため、Docker 関連ファイルを新規作成しました。

- `docker/docker-compose.yml`
- `docker/nodejs/Dockerfile`
- `docker/nodejs/entrypoint.sh`
- `docker/nodejs/logs/.gitkeep`

### コンテナ構成

- ベースイメージ: `node:22-bookworm-slim`
- 作業ディレクトリ: `/app`
- 起動コマンド: `pnpm dev`
- 公開ポート: `3000:3000`
- `CHOKIDAR_USEPOLLING=true` を設定
- `html/.env` を compose の `env_file` として読込

### ボリューム構成

- `../html:/app`
- `nodejs_node_modules:/app/node_modules`
- `nodejs_pnpm_store:/pnpm/store`
- `./nodejs/logs:/app/.manus-logs`

この構成により、Vite のログ保存先 `.manus-logs` はホスト側の `docker/nodejs/logs` に永続化されます。

## DB 対応

MySQL 接続情報に基づいて `html/.env` を作成しました。

設定内容:

```env
DATABASE_URL=mysql://mysql:mysql@192.168.100.32:3306/sakelog_db
```

加えて `html/.env.example` を作成し、認証系を含む必要な環境変数の雛形を整理しました。

## 認証関連の整理

フロントエンドは以下の環境変数を前提に OAuth ログイン URL を生成しています。

- `VITE_APP_ID`
- `VITE_OAUTH_PORTAL_URL`

サーバサイドでは以下も必要です。

- `OAUTH_SERVER_URL`
- `JWT_SECRET`
- `OWNER_OPEN_ID` 任意

## 不具合修正

### `TypeError: Invalid URL` の暫定対応

対象ファイル:

- `html/client/src/const.ts`

修正内容:

- `VITE_OAUTH_PORTAL_URL` または `VITE_APP_ID` が空のときに `new URL()` を呼ばないよう修正
- 未設定時は警告を出しつつ `#` を返すよう変更

これにより、OAuth 設定未完了でも画面表示自体は継続できます。

## 現在の未完了事項

### 1. DB テーブル作成

未実施の場合は以下で反映します。

```bash
docker compose -f docker/docker-compose.yml exec nodejs pnpm db:push
```

### 2. OAuth 実値の設定

SNS アカウント等でログインを利用するには、以下の実値が必要です。

- `VITE_APP_ID`
- `VITE_OAUTH_PORTAL_URL`
- `OAUTH_SERVER_URL`
- `JWT_SECRET`

### 3. 必要に応じた認証回避モード

認証基盤の実値が無い場合は、ローカル確認用に未ログインでも主要画面を使えるようにコード変更する余地があります。

## 参考コマンド

起動:

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

ログ確認:

```bash
docker compose -f docker/docker-compose.yml logs -f
```

ブラウザログ保存先:

```text
docker/nodejs/logs/
```
