import { expand, unpack } from "./front.js";

/** A function that returns the packed string via Node APIs. */
export async function loadPackedString() {
  const { readFile } = await import("node:fs/promises");
  const { dirname, join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  return await readFile(
    join(dirname(fileURLToPath(import.meta.url)), "wordlist.txt"),
    "utf8",
  );
}

/** A function that loads the default wordlist via the Node APIs. */
export async function loadWordlist() {
  return expand(unpack(await loadPackedString()));
}
