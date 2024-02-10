import { pack } from "efrt";
import fs from "node:fs/promises";
import path from "node:path";

const INPUT = path.join("data", "wordlist");
const OUTPUT = path.join("dist", "wordlist.efrt");

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
  const wordlist = await readWordlist();

  const LOG_BILLION = 9;
  const logTotalCount = Math.log10(
    wordlist.reduce((acc, cur) => acc + cur.count, 0)
  );
  const countToZipf = (count: number) =>
    Math.round(100 * (LOG_BILLION + Math.log10(count) - logTotalCount)) / 100;

  const data = Object.fromEntries(
    wordlist.map(({ slug, count: freq }) => [slug, countToZipf(freq)])
  );
  const packed = pack(data);
  await fs.writeFile(OUTPUT, packed, "utf-8");
};

main();
