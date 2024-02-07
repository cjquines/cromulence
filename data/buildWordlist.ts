import { pack } from "efrt";
import fs from "node:fs/promises";
import path from "node:path";

const INPUT = path.join("data", "wordlist");
const OUTPUT = `${INPUT}.efrt`;

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z]/g, "");

const readWordlist = async () => {
  const file = await fs.readFile(INPUT, "utf-8");
  return file
    .split("\n")
    .map((line) => {
      const [text, freqStr] = line.split(",");
      const slug = slugify(text);
      const freq = parseInt(freqStr);
      return { slug, freq };
    })
    .filter(({ slug, freq }) => slug && freq);
};

const main = async () => {
  const wordlist = await readWordlist();

  const LOG_BILLION = 9;
  const logTotalFreq = Math.log10(
    wordlist.reduce((acc, cur) => acc + cur.freq, 0)
  );
  const freqToZipf = (freq: number) =>
    Math.round(100 * (LOG_BILLION + Math.log10(freq) - logTotalFreq));

  const data = Object.fromEntries(
    wordlist.map(({ slug, freq }) => [slug, freqToZipf(freq)])
  );
  const packed: string = pack(data);
  await fs.writeFile(OUTPUT, packed, "utf-8");
};

main();
