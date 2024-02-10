# cromulence

A small, puzzlehunt-tuned, word frequency library.

## Usage

Basic usage:

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

The `Cromulence` class needs a wordlist. Without a wordlist, it'll try to read the default wordlist from the filesystem (if running on Node or similar), or fetch it from a CDN.

## Wordlists

`data/wordlist` is the entries in the [solvertools](https://github.com/rspeer/solvertools) WORDS wordlist with no spaces and weighted frequency at least one million; TODO write explainer
