import { bin2short, bin2s, bin2i } from "https://code4fukui.github.io/binutil/binutil.js";

const N_SECTOR = 512;

export const decode = (dsk) => {
  const sectorsize = bin2short(dsk, 11, true);
  if (sectorsize != N_SECTOR) throw new Error("sector size is not " + N_SECTO + ": " + sectorsize);
  const nroot = bin2short(dsk, 0x11, true);
  const nfat = bin2short(dsk, 0x16, true);
  const csize = dsk[0x0d] * sectorsize;
  //console.log("nroot", nroot, "nfat", nfat, "csize", csize);
  const nrootsector = nroot / (sectorsize / 32);
    
  // decode FAT12
  const fat = [];
  for (let i = 0; i < nfat; i++) {
    let idx = sectorsize + i * sectorsize;
    for (let j = 0; j < 512 / 3; j++) {
      const b1 = dsk[idx++];
      const b2 = dsk[idx++];
      const b3 = dsk[idx++];
      const n1 = b1 | ((b2 & 0xf) << 8);
      const n2 = (b2 >> 4) | (b3 << 4);
      fat.push(n1);
      fat.push(n2);
    }
  }
  //console.log(fat);

  const files = [];
  for (let i = 0; i < nroot; i++) {
    const proot = (1 + nfat * 2) * sectorsize + 32 * i;
    const name = bin2s(dsk, proot, 8).replace(/\0/g, "").trim();
    const ext = bin2s(dsk, proot + 8, 3).replace(/\0/g, "").trim();
    const fn = name + "." + ext;
    const att = dsk[proot + 0xb];
    const ifat = bin2short(dsk, proot + 0x1a, true);
    const size = bin2i(dsk, proot + 0x1c, true);
    if (fn == ".") continue;
    //console.log(fn, "att", att, "ifat", ifat, "size", size);

    const data = new Uint8Array(size);
    let idx = 0;
    let curfat = ifat;
    let rem = size;
    for (;;) {
      const len = Math.min(csize, rem);
      const off = (1 + nfat * 2 + nrootsector) * sectorsize + (curfat - 2) * csize;
      //console.log(fn, curfat, rem);
      //console.log("off", off.toString(16), dsk[off])
      for (let i = 0; i < len; i++) {
        data[idx++] = dsk[off + i];
      }
      rem -= len;
      if (!rem) break;
      curfat = fat[curfat];
      if (curfat >= 0xff8) throw new Error("file error");
    }
    const file = {
      fn,
      att,
      size,
      data,
    };
    files.push(file);
  }
  return files;
};

export const DSK = { decode };
