import { Card } from '../../cards/Card';
import { CardEval, CardProp, PlyTemp } from '../../cards/GameEval';

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

export const ModuloEasy = (playerIndex: number) =>
  ModuloUtil(playerIndex, [0, 2]) * -2 + 1;

// Util to help debug
export const FormatedCardsUtil = (arr: CardProp[] | PlyTemp[]) =>
  arr.map((card) => {
    return [
      Card.toconvertToSvgName(card.suit, card.cardName),
      card.expectedValue,
    ];
  });

export const FormatedCardUtil = (card: Card | CardProp | PlyTemp) =>
  Card.toconvertToSvgName(card.suit, card.cardName);

export const FormatCardsEval = (arr: CardEval[]) => {
  return arr.map((cardEval) => {
    const temp = cardEval.card;
    return {
      card: FormatedCardUtil(cardEval.card),
      probability: cardEval.probability.join(', '),
    };
  });
};
