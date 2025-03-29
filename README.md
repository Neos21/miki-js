# Miki.js

Wiki Using Misskey MiAuth


## 機能一覧

- [ ] MiAuth でログインする
- [ ] MiAuth をログアウトする
- 未ログインのユーザ (全ユーザ) ができること
    - [ ] ページを閲覧する
        - [ ] 最後にページを編集したユーザ名・更新日時を表示する
    - [ ] 全文検索ができる (PostgreSQL の `ILIKE` でひとまず)
- ログインしたユーザができること
    - [ ] ページを新規作成する
        - 階層構造を作れる
        - ページ固有の URL が発行される
    - [ ] ページを編集する
        - Markdown 形式
        - WYSIWYG エディタ UI
        - 同時編集が競合しないようにする
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
