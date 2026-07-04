# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # full build: wordlist + TypeScript
npm run build:ts       # TypeScript only (tsc)
npm run build:wordlist # regenerate dist/wordlist.txt from data/wordlist
npm test               # run all tests (vitest)
npx vitest run src/cromulence.test.ts  # run a single test file
```

## Architecture

**cromulence** is a puzzlehunt-tuned word frequency library (ESM-only, zero runtime deps).

### Core concepts
- **Slug**: lowercase English letters only (no spaces/punctuation)
- **Zipf frequency**: base-10 log of occurrences per billion words (roughly 0–8)
- **hZipf**: Zipf × 100, rounded — used internally for compact storage
- **cromulence score**: heuristic quality score for a phrase split into words

### Dual entry points
- `src/index.ts` → `dist/index.js` — browser build; fetches wordlist from jsDelivr CDN
- `src/index.node.ts` → `dist/index.node.js` — Node build; reads wordlist from `dist/wordlist.txt`

The package exports map selects the node build when `require.resolve` or Node conditions are present; bundlers/browsers get the default build.

### Wordlist pipeline
```
data/wordlist (CSV: word,count)
  → data/buildWordlist.ts (compress + pack)
  → dist/wordlist.txt (packed string, 1.3 MB)
  → loadWordlist[.node].ts (unpack → Map<string, number>)
  → Cromulence class
```

### Key source files
| File | Role |
|------|------|
| `src/cromulence.ts` | `Cromulence` class (DP word splitting), utility converters |
| `src/front.ts` | Compression utilities: `compress`/`expand` (hZipf bins), `pack`/`unpack` (front-encoding) |
| `src/loadWordlist.ts` | Browser wordlist loader (CDN fetch) |
| `src/loadWordlist.node.ts` | Node wordlist loader (filesystem read) |

### Compression scheme (`front.ts`)
Words are grouped by hZipf bin. Within each bin they are front-encoded (shared prefix compression) and packed into a single string. The format is `"<hZipf> <encoded-words>\n"` per line. This scheme keeps the distributed wordlist small without a build step on the consumer side.
