import { Card } from './Card';
import { Deck } from './Deck';

export class BaseGameType {
  public cardsAllowed: Card[] = [];

  public createDeck(): Deck {
    return Deck.BuildFrom(this.cardsAllowed);
  }
}
