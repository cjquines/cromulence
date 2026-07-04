The main `wordlist` is truncated from the [solvertools](https://github.com/rspeer/solvertools) `combined.freq.txt` wordlist, as discussed in [the cromulence blog post](https://blog.cjquines.com/post/cromulence/#shrinking-the-wordlist); `buildWordlist.ts` will do this to update `wordlist` if `combined.freq.txt` exists in that directory.

That wordlist itself is built using [scripts/build_combined.py](https://github.com/rspeer/solvertools/blob/master/scripts/build_combined.py).
