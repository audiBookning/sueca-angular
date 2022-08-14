export const RangeFromToUtil = (from: number, to: number, step: number) =>
  [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);

// Util
// REF: https://stackoverflow.com/a/50055050/3658510
// exemple: wrapNum0(2, [0,9], false)
// x: number to wrap
// range: min max of the range
// includeMax: if true, the max is included in the range
export const ModuloUtil = (
  x: number,
  range: number[],
  includeMax: boolean = false
) => {
  var max = range[1],
    min = range[0],
    d = max - min;
  return x === max && includeMax ? x : ((((x - min) % d) + d) % d) + min;
};
