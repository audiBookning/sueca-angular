import {
  CardName,
  CardNameString,
  CardNameTranslation,
  Suit,
  SuitTranslation,
} from './Enums';

export class Card {
  suit: Suit;
  cardName: CardName;

  // hierarchy in the ply
  rank: number;
  // value when counting points
  value: number;
  removed: boolean = false; // already played card

  constructor(cardName: CardName, suit: Suit, rank: number, value: number) {
    this.suit = suit;
    this.rank = rank;
    this.cardName = cardName;
    this.value = value;
  }

  public toString(): string {
    const ff = `${CardName[this.cardName]}`;

    const gg = `${CardName[this.cardName]} of ${Suit[this.suit]}`;

    return gg;
  }

  public toStringAll(): string {
    const ff = `${CardName[this.cardName]} of ${Suit[this.suit]}`;

    return ff;
  }

  public toSvgName(): string {
    const ff = `${Suit[this.suit]}_${
      // @ts-ignore
      CardNameString[CardName[this.cardName]]
    }`;

    return ff;
  }

  public toTranslationStringAll(): string {
    // TODO: need a keyof type
    // @ts-ignore
    const translatedSuit = SuitTranslation[Suit[this.suit]];
    // @ts-ignore
    const translatedCardName = CardNameTranslation[CardName[this.cardName]];

    return `${translatedCardName} de ${translatedSuit}`;
  }

  public getIndex(): string {
    return this.toString();
  }

  static toconvertToSvgName(suit: Suit, cardName: CardName): string {
    const ff = `${Suit[suit]}_${
      // @ts-ignore
      CardNameString[CardName[cardName]]
    }`;

    return ff;
  }
}
