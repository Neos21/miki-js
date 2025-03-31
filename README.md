# Miki.js

Wiki Using Misskey MiAuth


## 開発

### 起動方法

```bash
# Docker Compose で PostgreSQL を立ち上げておく
$ cd ./
$ docker compose up -d

# バックエンドサーバを起動する
$ cd ./backend/
$ npm run dev
$ cd ../

# フロントエンドを起動する
$ cd ./frontend/
$ npm run dev
# 起動した開発用フロントエンドサーバの URL にアクセスして動作確認する
```

### デフォルトのポート番号

- `2180` : バックエンドサーバ
- `2181` : プレビュー用フロントエンドサーバ
- `2182` : 開発用フロントエンドサーバ
- `2183` : PostgreSQL


## 機能一覧

- [x] MiAuth でログインする
    - [x] MiAuth でログインしたユーザ情報を DB に保管する
    - [ ] ユーザ管理画面 : ユーザ情報を再取得して DB に反映させるなど
- [x] MiAuth をログアウトする
- 未ログインのユーザ (全ユーザ) ができること
    - [ ] メニューにページ階層を表示する
    - [x] ページを閲覧する
        - [ ] 最後にページを編集したユーザ名・更新日時を表示する
    - [ ] 全文検索ができる (PostgreSQL の `ILIKE` でひとまず)
- ログインしたユーザができること
    - [x] ルートページを新規作成する
    - [ ] 指定ページの配下にページを新規作成する
    - [x] ページを編集する
        - [x] Markdown 形式
        - [x] WYSIWYG エディタ UI ([ProseMirror](https://prosemirror.net) を使う)
        - [x] 同時編集が競合しないようにする
    - [ ] ページを削除する
    - [ ] ページに画像ファイルを添付する
- 管理ユーザができること
    - [ ] 管理用ユーザ ID・パスワードを設定する (環境変数注入)
    - [ ] Misskey ホスト URL を指定する

### 優先度低

- 表示機能
    - [ ] パンくずリスト表示
    - [ ] ToC 表示
    - [ ] 配下のページへのリンク
- 編集機能
    - [ ] ページごとの編集履歴を保持する
    - [ ] ページごとにコメントを投稿できる
    - [ ] コメント投稿者はコメントを削除できる
    - [ ] Notion・Outline のような `/` コマンドによる補完
    - [ ] MiAuth でログインしている人しか見られないページを作れる
- 管理機能
    - [ ] 複数の Misskey ホストからの MiAuth ログインを許可できるようにする
    - [ ] 迷惑ユーザによる編集を許可しないようにブロックする
- [ ] Misskey のテーマをそのままインポートして適用できるようにする (デザインの親和性向上)


## 参考

- [Wiki.js](https://docs.requarks.io) ([GitHub](https://github.com/Requarks/wiki))
- [Outline](https://demo-ail7218.getoutline.com) ([GitHub](https://github.com/outline/outline))
