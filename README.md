# cromulence

A small, puzzlehunt-tuned, word frequency library.

Inspired by [Solvertools](https://github.com/rspeer/solvertools). The wordlist itself is 713 kB gzipped; the rest of the library is 5 kB.

## Usage

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

The `Cromulence` class needs a wordlist. The `loadWordlist` function will try to load the default wordlist: on Node, it will use Node APIs to open the file; on the browser, it will download the file from jsDelivr.

## Data

The default wordlist, `data/wordlist`, are the entries in the Solvertools combined wordlist with no spaces and weighted frequency at least one million.

See the blog post [cromulence: a small word frequency library](https://blog.cjquines.com/post/cromulence) for more information on the cromulence function and how the wordlist was chosen.
