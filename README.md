# DSK for MSX

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A project for decoding and encoding DSK files, which are disk image files for the MSX computer platform.

## Features

- Decode DSK files to extract the individual files within
- Encode DSK files from a set of files
- Includes a simple web-based tool to create a DSK file from a BASIC program

## Usage

### Decode DSK file

```sh
deno -A https://code4fukui.github.io/DSK/dskdecoder.js sample.dsk
```

### Encode DSK file

```sh
deno -A https://code4fukui.github.io/DSK/dskencoder.js hello.dsk AUTOEXEC.BAS
```
→ [bas2dsk](https://code4fukui.github.io/DSK/) - make a simple DSK file with AUTOEXEC.BAS

## License

MIT License — see [LICENSE](LICENSE).