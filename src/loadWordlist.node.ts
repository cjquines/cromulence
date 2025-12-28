import { expand, unpack } from "./front.js";

/**
 * A function that loads the default wordlist via the Node APIs.
 */
export async function loadWordlist() {
  const { readFile } = await import("node:fs/promises");
  const { dirname, join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const wordlist = await readFile(
    join(dirname(fileURLToPath(import.meta.url)), "wordlist.txt"),
    "utf8",
  );

  return expand(unpack(wordlist));
}
