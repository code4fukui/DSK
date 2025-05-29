import { DSK } from "./DSK.js";

const fn = Deno.args[0];
if (!fn) {
  console.log("dskencoder [fn] [file] ...");
  Deno.exit(1);
}

const files = [];
for (let i = 1; i < Deno.args.length; i++) {
  const fn = Deno.args[i];
  const data = await Deno.readFile(fn);
  files.push({ fn, data });
}

const bin = DSK.encode(files);
await Deno.writeFile(fn, bin);
