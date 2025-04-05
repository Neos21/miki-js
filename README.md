# Miki.js

Wiki System With Misskey Login


## 開発

### 起動方法

```bash
# Docker Compose で PostgreSQL を立ち上げておく
$ docker compose up -d

# バックエンドサーバを起動する
$ cd ./backend/
$ npm run dev

# フロントエンドを起動する
$ cd ./frontend/
$ npm run dev
# 起動した開発用フロントエンドサーバの URL にアクセスして動作確認する
```

### 本番起動

```bash
$ cd ./frontend/
$ npm run build

$ cd ./backend/
$ npm run build
$ npm start
# バックエンドサーバの URL にアクセスする
```

### デフォルトのポート番号

- `2180` : バックエンドサーバ
- `2181` : プレビュー用フロントエンドサーバ
- `2182` : 開発用フロントエンドサーバ
- `2183` : PostgreSQL


## 参考

- [Wiki.js](https://docs.requarks.io) ([GitHub](https://github.com/Requarks/wiki))
- [Outline](https://demo-ail7218.getoutline.com) ([GitHub](https://github.com/outline/outline))
