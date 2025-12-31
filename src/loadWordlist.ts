import { expand, unpack } from "./front.js";

/** A function that returns the packed string via fetch. */
export async function loadPackedString() {
  const resp = await fetch(
    "https://cdn.jsdelivr.net/npm/cromulence@0.3.2/dist/wordlist.txt",
  );
  return await resp.text();
}

/** A function that loads the default wordlist via fetch. */
export async function loadWordlist() {
  return expand(unpack(await loadPackedString()));
}
