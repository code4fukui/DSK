import * as t from "https://deno.land/std/testing/asserts.ts";
import { DSK } from "./DSK.js";

Deno.test("simple", async () => {
  const fn = "sample.dsk";
  const bin = await Deno.readFile(fn);
  const files = DSK.decode(bin);
  //console.log(files, files.length);
  t.assertEquals(files.length, 1);
  t.assertEquals(files[0].fn, "KAWA-KDR.BAS");
});
