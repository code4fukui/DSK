import { DSK } from "./DSK.js";

const fn = Deno.args[0];
if (!fn) {
  console.log("dskdecoder [fn]");
  Deno.exit(1);
}

const bin = await Deno.readFile(fn);
const files = DSK.decode(bin);
for (const file of files) {
  console.log("file", file.fn)
  await Deno.writeFile(file.fn, file.data);
}
