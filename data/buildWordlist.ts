import fs from "node:fs/promises";
import path from "node:path";
import { compress, pack } from "../src/front.js";

const INPUT = path.join("data", "wordlist");
const OUTPUT = path.join("dist", "wordlist.txt");

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z]/g, "");

const readWordlist = async () => {
  const file = await fs.readFile(INPUT, "utf-8");
  return file
    .split("\n")
    .map((line) => {
      const [text, countStr] = line.split(",");
      const slug = slugify(text);
      const count = parseInt(countStr);
      return { slug, count };
    })
    .filter(({ slug, count }) => slug && count);
};

const main = async () => {
  console.log("reading");
  const wordlist = await readWordlist();

  console.log("processing");
  const LOG_BILLION = 9;
  const logTotalCount = Math.log10(
    wordlist.reduce((acc, cur) => acc + cur.count, 0)
  );
  const countToZipf = (count: number) =>
    LOG_BILLION + Math.log10(count) - logTotalCount;

  const data = Object.fromEntries(
    wordlist.map(({ slug, count: freq }) => [slug, countToZipf(freq)])
  );

  console.log("binning");
  const bins = compress(data);

  console.log("packing");
  const packed = pack(bins);

  console.log("writing");
  await fs.writeFile(OUTPUT, packed, "utf-8");

  console.log("done");
};

main();
