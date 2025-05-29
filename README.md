# DSK for MSX

## usage

```sh
deno -A https://code4fukui.github.io/DSK/dskdecoder.js sample.dsk
```

## memo

```
// 2 sides * 80 tracks * 9 sectors per track * 512 bytes per sector = 737280 Bytes (720kB)

BIOS Parameter Block（BPB）の例（ブートセクタ）
オフセット	内容	値（例）
0x0B	セクタサイズ	512
0x0D	セクタ/クラスタ数	2 = 1024byte
0x0E	予約セクタ数	1
0x10	FATの数	2
0x11	ルートディレクトリエントリ数	112
0x13	総セクタ数	720*1024/512 = 1440
0x16	FATのセクタ数	3
0x18	セクタ/トラック数	9
0x1A	ヘッド数（面数）	2
0x1C	隠しセクタ数	0

ルートディレクトリエントリ（1エントリ＝32バイト）
オフセット	内容	備考
0x00	ファイル名（8バイト）	半角英数大文字＋スペース
0x08	拡張子（3バイト）	同上
0x0B	属性	0x10=ディレクトリなど
0x1A	開始クラスタ番号	FATでの先頭位置 (2から始まる)
0x1C	ファイルサイズ（4B）	バイト単位

sector
0	ブートセクタ	BPB（BIOS Parameter Block）含む
1–3	FAT1  3セクタ
4–6	FAT2  3セクタ（FAT1のコピー）
7–13	ルートディレクトリ領域	7セクタ×16エントリ
14以降	データ領域	実データ（クラスタ単位 = 1024byte）
```
