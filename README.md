# duelma-3

## dist以下にsymbolic linkを作成
```
$ ln -s ~/projects/duelma/statics ./dist
$ unlink ./dist/statics
```
シンボリックリンクを使って、VUE_APP_IMAGE_HOST=/staticsとすると、
このプロジェクトのサーバーからカード画像ファイルを返せるようになった。
ngrokを使いたいときに便利。

## mjsファイル
ファイルをnodeで直接実行した時、
`SyntaxError: Cannot use import statement outside a module`を
避けるためには、ファイルの拡張子をmjsにする。そのファイルを普通のjsファイルに取り込むには、
`db = import('./test.mjs')`

## typescript
orugauiのカスタマイズのために使用。
https://cli.vuejs.org/core-plugins/typescript.html#configuration

## 準備
db.jsonを作成する。
```
{
  "rooms": {}
}
```

## herokuでの設定
https://devcenter.heroku.com/articles/node-websockets
以下の環境変数を設定する。
```
VUE_APP_IMAGE_HOST=
DECK_URL=
```

```
$ heroku features:enable http-session-affinity -a duelma-3
$ heroku features -a duelma-3
```
CLI は、将来使用できるように、メールアドレスと API トークンを ~/.netrcに保存します。

```
heroku ps:scale worker=1
heroku ps -a duelma-3
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
