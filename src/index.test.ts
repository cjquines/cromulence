import { expect, test } from "vitest";
import { Cromulence } from "./index.js";

test("Cromulence", () => {
  const cromulence = new Cromulence({
    a: 7.37,
    at: 6.7,
    c: 5.4,
    ca: 4.61,
    cat: 4.78,
    e: 5.34,
    ec: 3.79,
    eca: 2.6,
    h: 5.06,
    he: 6.7,
    hec: 2.63,
    t: 5.39,
    th: 4.15,
    the: 7.78,
    theca: 1.46,
  });

  expect(cromulence.info("")).toEqual({
    cromulence: expect.closeTo(0.0),
    logProb: expect.closeTo(0.0),
    slug: "",
    spacing: "",
    zipf: expect.closeTo(0.0),
  });

  expect(cromulence.info("The cat")).toEqual({
    cromulence: expect.closeTo(12.0),
    logProb: expect.closeTo(-14.83),
    slug: "thecat",
    spacing: "THE CAT",
    zipf: expect.closeTo(2.6),
  });

  expect(cromulence.info("a ca't t'he cat")).toEqual({
    cromulence: expect.closeTo(4.4),
    logProb: expect.closeTo(-32.9),
    slug: "acatthecat",
    spacing: "A CAT THE CAT",
    zipf: expect.closeTo(-5.3),
  });
});
