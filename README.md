# DSK for MSX

## usage

```sh
deno -A https://code4fukui.github.io/DSK/dskdecoder.js sample.dsk
```


## memo

```
// 2 sides * 80 tracks * 9 sectors per track * 512 bytes per sector = 737280 Bytes (720kB)

0	ブートセクタ	BPB（BIOS Parameter Block）含む
1–9	FAT1	通常9セクタ
10–18	FAT2	通常9セクタ（FAT1のコピー）
19–32	ルートディレクトリ領域	14セクタ×16エントリ/セクタ
33以降	データ領域	実データ（クラスタ単位）

ルートディレクトリエントリ（1エントリ＝32バイト）
オフセット	内容	備考
0x00	ファイル名（8バイト）	半角英数大文字＋スペース
0x08	拡張子（3バイト）	同上
0x0B	属性	0x10=ディレクトリなど
0x1A	開始クラスタ番号	FATでの先頭位置 (2から始まる)
0x1C	ファイルサイズ（4B）	バイト単位

sector
0 BOOT
1 FAT1
2 FAT1
3 FAT1
4 FAT2
5 FAT2
6 FAT2
7 ROOT
8
9
10
11
12
13
14 DATA

0xe00 データ領域
```
