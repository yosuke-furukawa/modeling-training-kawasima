# 複雑さの取り扱い TypeScript版

WEB+DB PRESS vol.130の特集1「実践データモデル」の5章 ドメインモデルの応用で述べられている、Simpleな設計とその対義語の意味でのComplexな設計のサンプルコードをTypeScriptで実装したものです。

`src/complex/Order.ts` は、注文に注文ステータスを属性として持ち込み、1つのOrderクラスで様々な注文の状態を表現する実装です。

`src/simple/Order.ts` は、注文の各ステータスに応じて型を個別に作った実装です。

## 使い方

依存ライブラリをインストールする。

```
% npm install
```

テストを実行する。(jest watchモード)

```
% npm t -- --watch
```
