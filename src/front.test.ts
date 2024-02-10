import { expect, test } from "vitest";
import { compress, expand, expandMap, pack, unpack } from "./front.js";

test("compress, expand", () => {
  const obj = {
    c: 1,
    ca: 1.34,
    cat: 1,
    d: 1.34,
    do: 1.34,
    dog: 1.34,
    dub: 1.34,
  };

  expect(expand(compress(obj))).toEqual(obj);

  expect(Object.fromEntries(expandMap(compress(obj)).entries())).toEqual(obj);
});

test("pack, unpack", () => {
  const obj = new Map([
    [100, ["c", "ca", "cast", "cat"]],
    [134, ["d", "do", "dog", "dub"]],
    [200, ["echo"]],
    [245, ["fox", "foxtrot"]],
  ]);

  expect(pack(obj)).toMatchInlineSnapshot(`
    "100 c1a2st2t
    134 d1o2g1ub
    200 echo
    245 fox3trot
    "
  `);
  expect(unpack(pack(obj))).toEqual(obj);
});
