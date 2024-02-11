# cromulence

A small, puzzlehunt-tuned, word frequency library. Basically a port of the wordlist part of [Solvertools](https://github.com/rspeer/solvertools). The default wordlist is 713 kB gzipped; the library itself is 5 kB.

## Usage

Install with `npm install cromulence`. This is an ES6 only library.

```ts
import { Cromulence, loadWordlist } from "cromulence";

const cromulence = Cromulence(await loadWordlist());

cromulence.cromulence("carl_t_on_fisk"); // 9.9

cromulence.info("carl_t_on_fisk");
// {
//   cromulence: 9.9,
//   logProb: -28.344822494756706,
//   slug: 'carltonfisk',
//   spacing: 'CARLTON FISK',
//   zipf: -3.3,
// }
```

### Wordlist

The `Cromulence` constructor takes `wordlist`, an object with slug keys and Zipf frequency values:

- A *slug* is a string of lowercase English letters.
- The *Zipf frequency* of a text is the base-10 logarithm of the number of times it appears per billion words; for single words it usually ranges from 0 to 8. cromulence always rounds Zipf frequencies to one decimal place.

The default wordlist, `data/wordlist`, are the entries in the Solvertools combined wordlist with no spaces and weighted frequency at least one million.

It can be loaded with `loadWordlist`. On Node, it will use the Node APIs to open the wordlist distributed with the package. On the browser, it will use `fetch` to download the wordlist from [jsDelivr](https://cdn.jsdelivr.net/npm/cromulence/dist/wordlist.txt). If you're using cromulence in a webapp, you may want to host the wordlist on your own servers.

See the blog post [cromulence: a small word frequency library](https://blog.cjquines.com/post/cromulence) for more information on how the wordlist was chosen.

### Cromulence

Instances of `Cromulence` have a `wordlist` property, which is the wordlist it was constructed with.

They also have the following methods, each which take a single string parameter `text`:

- `cromulence`: Returns the cromulence of `text`, using the Solvertools algorithm. Cromulence is a measure of how likely the text is to be a puzzlehunt answer, and it usually ranges from -45 to 35, with positive cromulences corresponding to real answers.
- `logProb`: The log probability of `text` appearing when words are drawn independently from the wordlist.
- `zipf`: The log probability of `text`, as a Zipf frequency. The Zipf frequency of a phrase is the base-10 logarithm of the number of times it appears per billion words; for single words it usually ranges from 0 to 8.

There's also the `info` method, which includes each of these, along with the `slug` of `text`, and the likeliest `spacing`.

### Utilities

Other exported utility functions:

- `slugify`: Converts a string to a slug.
- `logProbToZipf`, `zipfToLogProb`: Converts between log probabilities and Zipf frequencies.
- `zipfToCromulence`: Converts a Zipf frequency to cromulence. Cromulence takes into account the length of the text.
