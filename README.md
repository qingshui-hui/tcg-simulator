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

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
