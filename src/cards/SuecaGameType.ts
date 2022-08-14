import { BaseGameType } from './BaseGameType';
import { Card } from './Card';
import { CardName, Suit } from './Enums';

export class SuecaGameType extends BaseGameType {
  public override cardsAllowed: Card[] = [
    new Card(CardName.two, Suit.club, 2, 0),
    new Card(CardName.three, Suit.club, 3, 0),
    new Card(CardName.four, Suit.club, 4, 0),
    new Card(CardName.five, Suit.club, 5, 0),
    new Card(CardName.six, Suit.club, 6, 0),
    new Card(CardName.queen, Suit.club, 8, 2),
    new Card(CardName.jack, Suit.club, 9, 3),
    new Card(CardName.king, Suit.club, 10, 4),
    new Card(CardName.seven, Suit.club, 11, 10),
    new Card(CardName.ace, Suit.club, 12, 11),

    new Card(CardName.two, Suit.spade, 2, 0),
    new Card(CardName.three, Suit.spade, 3, 0),
    new Card(CardName.four, Suit.spade, 4, 0),
    new Card(CardName.five, Suit.spade, 5, 0),
    new Card(CardName.six, Suit.spade, 6, 0),
    new Card(CardName.queen, Suit.spade, 8, 2),
    new Card(CardName.jack, Suit.spade, 9, 3),
    new Card(CardName.king, Suit.spade, 10, 4),
    new Card(CardName.seven, Suit.spade, 11, 10),
    new Card(CardName.ace, Suit.spade, 12, 11),

    new Card(CardName.two, Suit.diamond, 2, 0),
    new Card(CardName.three, Suit.diamond, 3, 0),
    new Card(CardName.four, Suit.diamond, 4, 0),
    new Card(CardName.five, Suit.diamond, 5, 0),
    new Card(CardName.six, Suit.diamond, 6, 0),
    new Card(CardName.queen, Suit.diamond, 8, 2),
    new Card(CardName.jack, Suit.diamond, 9, 3),
    new Card(CardName.king, Suit.diamond, 10, 4),
    new Card(CardName.seven, Suit.diamond, 11, 10),
    new Card(CardName.ace, Suit.diamond, 12, 11),

    new Card(CardName.two, Suit.heart, 2, 0),
    new Card(CardName.three, Suit.heart, 3, 0),
    new Card(CardName.four, Suit.heart, 4, 0),
    new Card(CardName.five, Suit.heart, 5, 0),
    new Card(CardName.six, Suit.heart, 6, 0),
    new Card(CardName.queen, Suit.heart, 8, 2),
    new Card(CardName.jack, Suit.heart, 9, 3),
    new Card(CardName.king, Suit.heart, 10, 4),
    new Card(CardName.seven, Suit.heart, 11, 10),
    new Card(CardName.ace, Suit.heart, 12, 11),
  ];
}
