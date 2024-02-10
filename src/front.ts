/**
 * Keys are hZipfs, values are slugs with that hZipf. An hZipf is 100 times the
 * Zipf frequency, rounded to the nearest integer; we stole the idea from
 * wordfreq. Keys should be stored in order from highest to lowest; values
 * should be non-empty and sorted in alphabetical order.
 */
type WordBins = Map<number, string[]>;

/** wordlist should have slug keys and Zipf frequency values. */
export function compress(wordlist: Record<string, number>): WordBins {
  const hZipfs = Array.from(
    new Set(Object.values(wordlist).map((zipf) => Math.round(100 * zipf)))
  ).sort((a, b) => b - a);

  const bins: WordBins = new Map();
  for (const hZipf of hZipfs) {
    bins.set(hZipf, []);
  }

  for (const [word, zipf] of Object.entries(wordlist)) {
    const hZipf = Math.round(100 * zipf);
    bins.get(hZipf)!.push(word);
  }

  for (const hZipf of hZipfs) {
    bins.get(hZipf)!.sort();
  }

  return bins;
}

/** Expand to a record from slugs to Zipf frequencies. */
export function expand(bins: WordBins): Record<string, number> {
  const wordlist: Record<string, number> = {};
  for (const [hZipf, bin] of bins) {
    for (const word of bin) {
      wordlist[word] = hZipf / 100;
    }
  }
  return wordlist;
}

/** Expand to a map from slugs to Zipf frequencies. */
export function expandMap(bins: WordBins): Map<string, number> {
  const wordlist: Map<string, number> = new Map();
  for (const [hZipf, bin] of bins) {
    for (const word of bin) {
      wordlist.set(word, hZipf / 100);
    }
  }
  return wordlist;
}

/**
 * Front-encode each value in words, store it in a packed string. The bin
 * 100: [d, do, dog, dub] packs to 100 d1o2g1ub.
 */
export function pack(bins: WordBins): string {
  const prepack: string[] = [];

  for (const [hZipf, bin] of bins) {
    prepack.push(hZipf.toString());
    prepack.push(" ");

    let prev = bin[0];
    prepack.push(prev);

    for (let i = 1; i < bin.length; i++) {
      const word = bin[i];

      // Get common prefix:
      let j = 0;
      while (j < prev.length && j < word.length && prev[j] === word[j]) {
        j++;
      }
      prepack.push(j.toString());
      prepack.push(word.slice(j));

      prev = word;
    }

    prepack.push("\n");
  }

  return prepack.join("");
}

const DIGIT = /\d/;
const DIGIT_OR_NEWLINE = /[\d\n]/;

/** Decodes a packed string; inverse to pack. */
export function unpack(packed: string): WordBins {
  const bins: WordBins = new Map();
  let i = 0;

  while (i < packed.length) {
    // Read a number.
    let hZipfStr: string[] = [];
    while (packed[i] !== " ") {
      hZipfStr.push(packed[i]);
      i++;
    }
    const hZipf = parseInt(hZipfStr.join(""), 10);
    const bin: string[] = [];

    // Skip the space.
    i++;

    // Get the first word.
    let word: string[] = [];
    while (!DIGIT_OR_NEWLINE.test(packed[i])) {
      word.push(packed[i]);
      i++;
    }
    bin.push(word.join(""));

    while (packed[i] !== "\n") {
      // Get the common prefix length.
      let jStr: string[] = [];
      while (DIGIT.test(packed[i])) {
        jStr.push(packed[i]);
        i++;
      }
      const j = parseInt(jStr.join(""), 10);

      // Get the common prefix.
      while (word.length > j) {
        word.pop();
      }

      // Get the rest of the word.
      while (!DIGIT_OR_NEWLINE.test(packed[i])) {
        word.push(packed[i]);
        i++;
      }
      bin.push(word.join(""));
    }

    bins.set(hZipf, bin);

    // Skip the new line.
    i++;
  }

  return bins;
}
