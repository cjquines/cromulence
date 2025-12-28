import { expand, unpack } from "./front.js";

/**
 * A function that loads the default wordlist via fetch.
 */
export async function loadWordlist() {
  const resp = await fetch(
    "https://cdn.jsdelivr.net/npm/cromulence@0.3.2/dist/wordlist.txt",
  );
  const wordlist = await resp.text();

  return expand(unpack(wordlist));
}
