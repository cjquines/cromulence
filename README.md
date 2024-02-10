# cromulence

A small, puzzlehunt-tuned, word frequency library. It's less than 1 MB gzipped.

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

The `Cromulence` class needs a wordlist. The `loadWordlist` function will try to load the default wordlist: on Node, it will use Node APIs to open the file; on the browser, it will fetch the file from jsDelivr.

## Wordlists

`data/wordlist` is the entries in the [solvertools](https://github.com/rspeer/solvertools) WORDS wordlist with no spaces and weighted frequency at least one million. TODO link explainer
