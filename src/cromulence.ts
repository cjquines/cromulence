const NULL_HYPOTHESIS_ENTROPY = -3.5 * Math.LOG10E;
const DECIBEL_SCALE = 20;

/** Converts a word to a slug: a string of only lowercase English letters. */
export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z]/g, "");
}

/** Add spaces to a text at the given indices. */
function spaceAt(text: string, indices: number[]) {
  const result: string[] = [];
  for (let i = 0; i < indices.length - 1; i++) {
    result.push(text.slice(indices[i], indices[i + 1]));
  }
  return result.join(" ");
}

/** Convert a log probability to a Zipf frequency. */
export function logProbToZipf(logProb: number) {
  return logProb * Math.LOG10E + 9;
}

/** Convert a Zipf frequency to log probability. */
export function zipfToLogProb(zipf: number) {
  return (zipf - 9) / Math.LOG10E;
}

/** Convert a Zipf frequency to the cromulence scale. */
export function zipfToCromulence(zipf: number, length: number) {
  const entropy = (zipf - 9) / (length + 1);
  const cromulence = DECIBEL_SCALE * (entropy - NULL_HYPOTHESIS_ENTROPY);
  return Math.round(10 * cromulence) / 10;
}

export class Cromulence {
  private cache: Map<string, number>;

  /**
   * Constructs an object for looking up cromulences.
   *
   * @param wordlist - An object with slug keys and Zipf frequency values.
   */
  constructor(public wordlist: Record<string, number>) {
    this.cache = new Map();
  }

  /**
   * Returns the Zipf frequency of a slug; defaults to -1000. We use a cache
   * here because many applications look up the same slug over and over.
   */
  private slugZipf(slug: string): number {
    const value = this.cache.get(slug);
    if (value !== undefined) {
      return value;
    }
    const result = this.wordlist[slug] ?? -1000;
    this.cache.set(slug, result);
    return result;
  }

  /**
   * Returns the Zipf frequency of a text, along with its most likely splits.
   * The algorithm is directly stolen from solvertools.
   */
  private textZipf(slug: string) {
    const bestSplit = [[0]];
    const bestZipf = [0];

    for (let j = 1; j <= slug.length; j++) {
      bestSplit.push([0]);
      bestZipf.push(this.slugZipf(slug.slice(0, j)));

      for (let i = 1; i < j; i++) {
        const lZipf = bestZipf[i];
        const rZipf = this.slugZipf(slug.slice(i, j));
        const zipf = lZipf + rZipf - 10;

        if (zipf > bestZipf[j]) {
          bestZipf[j] = zipf;
          bestSplit[j] = bestSplit[i].concat(i);
        }
      }
    }

    return {
      zipf: bestZipf[slug.length],
      splits: bestSplit[slug.length].concat(slug.length),
    };
  }

  /**
   * Get the frequency info and likeliest spacing for a piece of text.
   *
   * See individual functions for documentation.
   */
  public info(text: string) {
    const slug = slugify(text);

    // Special case for the empty string.
    if (slug.length === 0) {
      return {
        cromulence: 0.0,
        logProb: 0.0,
        slug: "",
        spacing: "",
        zipf: 0.0,
      };
    }

    const { zipf, splits } = this.textZipf(slug);

    return {
      cromulence: zipfToCromulence(zipf, slug.length),
      logProb: zipfToLogProb(zipf),
      slug,
      spacing: spaceAt(slug.toUpperCase(), splits),
      zipf: Math.round(10 * zipf) / 10,
    };
  }

  /**
   * A measure of how likely a string of letters is to be an answer. Positive
   * values correspond to real answers. Range is around -45 to 35. Rounded to
   * one decimal place.
   */
  public cromulence(text: string) {
    return this.info(text).cromulence;
  }

  /**
   * The log probability of this phrase appearing in the corpus, assuming words
   * are drawn independently.
   */
  public logProb(text: string) {
    return this.info(text).logProb;
  }

  /**
   * The Zipf probability of this text appearing in the corpus, assuming words
   * are drawn independently. The Zipf scale is the log base 10 frequency per
   * billion words. For single words, the range is around 0 to 8.
   */
  public zipf(text: string) {
    return this.info(text).zipf;
  }
}
