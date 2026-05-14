# DSK for MSX

MSXコンピュータプラットフォーム用のディスクイメージファイルであるDSKファイルをデコードおよびエンコードするためのプロジェクトです。

## 機能

- DSKファイルをデコードし、内部の個々のファイルを抽出
- 複数のファイルからDSKファイルをエンコード
- BASICプログラムからDSKファイルを作成するシンプルなWebベースのツールを同梱

## 使い方

### DSKファイルのデコード

```sh
deno -A https://code4fukui.github.io/DSK/dskdecoder.js sample.dsk
```

### DSKファイルのエンコード

```sh
deno -A https://code4fukui.github.io/DSK/dskencoder.js hello.dsk AUTOEXEC.BAS
```
→ [bas2dsk](https://code4fukui.github.io/DSK/) - AUTOEXEC.BASを含むシンプルなDSKファイルを作成

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
