import {
  bin2short, bin2s, bin2i,
  short2bin, s2bin, i2bin,
} from "https://code4fukui.github.io/binutil/binutil.js";

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
  console.log(fat, fat.length);

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
    console.log(fn, "att", att, "ifat", ifat, "size", size);

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
      //att,
      data,
    };
    files.push(file);
  }
  return files;
};

export const encode = (files) => {
  const dsk = new Uint8Array(720 * 1024);
  const sectorsize = 512;
  short2bin(dsk, 0x0b, sectorsize, true);
  const csize = 1024;
  dsk[0x0d] = csize / sectorsize; // 2
  dsk[0x0e] = 1;
  dsk[0x10] = 2;
  const nroot = 112;
  short2bin(dsk, 0x11, nroot, true);
  short2bin(dsk, 0x13, dsk.length / sectorsize, true);
  const nfat = 3;
  short2bin(dsk, 0x16, nfat, true);
  const nrootsector = nroot / (sectorsize / 32);

  // encode FAT12
  const fat = new Uint16Array(716);
  fat[0] = 0xff9;
  fat[1] = 0xfff;
  let curfat = 2;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const proot = (1 + nfat * 2) * sectorsize + 32 * i;
    const fn = file.fn.toUpperCase();
    const n = fn.indexOf(".");
    const name = n >= 0 ? fn.substring(0, n) : fn;
    const ext = n >= 0 ? fn.substring(n + 1) : "";
    const fit = (s, n) => {
      s += "                ";
      return s.substring(0, n);
    };
    s2bin(dsk, proot, fit(name, 8));
    s2bin(dsk, proot + 8, fit(ext, 3));
    //const att = 32;
    const att = 0;
    dsk[proot + 0xb] = att;
    short2bin(dsk, proot + 0x1a, curfat, true);
    i2bin(dsk, proot + 0x1c, file.data.length, true);

    let rem = file.data.length;
    let idx = 0;
    for (;;) {
      const len = Math.min(csize, rem);
      const off = (1 + nfat * 2 + nrootsector) * sectorsize + (curfat - 2) * csize;
      for (let i = 0; i < len; i++) {
        dsk[off + i] = file.data[idx++];
      }
      rem -= len;
      if (!rem) {
        fat[curfat] = 0xfff;
        curfat++;
        break;
      }
      fat[curfat] = curfat + 1;
      curfat++;
    }
  }
  //console.log(fat);

  let ifat = 0;
  const offat = nfat * sectorsize;
  A: for (let i = 0; i < nfat; i++) {
    let idx = sectorsize + i * sectorsize;
    for (let j = 0; j < 512 / 3; j++) {
      const n1 = fat[ifat++];
      const n2 = fat[ifat++];
      
      dsk[offat + idx] = dsk[idx] = n1;
      dsk[offat + idx + 1] = dsk[idx + 1] = ((n1 >> 8) << 4) | (n2 & 0xf);
      dsk[offat + idx + 2] = dsk[idx + 2] = n2 >> 4;
      idx += 3;
      if (ifat == fat.length) break A;
    }
  }

  return dsk;
};

export const DSK = { decode, encode };
