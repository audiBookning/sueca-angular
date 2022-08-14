import { Card } from './Card';
import { Suit } from './Enums';
import { MapExtensions } from './mapExtensions';

export class Deck {
  cards: Card[];

  // Hand properties
  public suitOrder: Suit[] = [Suit.heart, Suit.spade, Suit.diamond, Suit.club];

  constructor(cards: Card[] = []) {
    this.cards = cards;
  }

  /*
    ADD
  */
  public addCard(card: Card): this {
    return this.addCards([card]);
  }

  public addCards(cards: Card[]): this {
    this.getCards().unshift(...cards);
    return this;
  }

  // Basic Operations
  public addCardsToBottom(cards: Card[]): void {
    this.setCards(this.getCards().concat(cards));
  }

  /*
    REMOVE
  */

  public removeCards(cards: Card[]): this {
    cards.forEach((card) => {
      const position: number = this.getIndexOfCard(card);
      if (position > -1) {
        this.getCards().splice(position, 1);
      } else {
        throw new Error('Card does not exist in collection');
      }
    });
    return this;
  }

  public removeCardByIndex(index: number): Card {
    //const position: number = this.indexOfCard(card);

    if (index > -1) {
      const card: Card = this.getCards().splice(index, 1)[0];
      return card;
    } else {
      throw new Error('Card does not exist in collection');
    }
  }

  removeCard(card: Card): this {
    const position: number = this.getIndexOfCard(card);
    if (position > -1) {
      const card = this.getCards().splice(position, 1);
    } else {
      throw new Error('Card does not exist in collection');
    }
    return this;
  }

  /*
    GET
  */
  public getCards(): Card[] {
    return this.cards;
  }

  getCardsBySuit(suit: Suit): Card[] {
    return this.getCards().filter((card) => card.suit === suit);
  }

  // INFO: Used to get the total value of the stack of cards.
  // useful for the team ply stack
  getCardsTotalValue() {
    return this.getCards().reduce((total, card) => total + card.value, 0);
  }

  public getCount(): number {
    return this.getCards().length;
  }

  public getCardAtIndex(index: number): Card {
    if (index >= 0 && index <= this.getCount() - 1) {
      return this.getCards()[index];
    } else {
      throw new Error('Card collection does not contain card at index');
    }
  }

  public getIndexOfCard(card: Card): number {
    for (let i = 0; i < this.getCount(); i++) {
      const loopCard = this.getCards()[i];
      if (this.areEquivalent(card, loopCard)) {
        return i;
      }
    }
    return -1;
  }

  /*
    TAKE
  */

  public takeCard(): Card {
    if (!this.isEmpty()) {
      return this.getCards().shift() as Card;
    }
    throw new Error('No cards remaining in pile');
  }

  public takeCardFromBottom(): Card {
    if (!this.isEmpty()) {
      return this.getCards().pop() as Card;
    }
    throw new Error('No cards remaining in pile');
  }

  public takeCardsFromBottom(amount: number): Card[] {
    let pulledCards: Card[] = [];
    while (!this.isEmpty() && pulledCards.length < amount) {
      pulledCards.push(this.getCards().pop() as Card);
    }
    return pulledCards;
  }

  /**
   * Remove cards from hand.
   * @param amount Amount of cards to remove from Hand. If less than 1, all cards are taken.
   */
  public takeCards(amount: number): Card[] {
    if (!amount || amount < 1) {
      amount = this.getCount();
    }
    // tslint:disable-next-line:prefer-const
    let pulledCards: Card[] = [];
    while (!this.isEmpty() && pulledCards.length < amount) {
      pulledCards.push(this.getCards().shift() as Card);
    }
    return pulledCards;
  }

  /*
    TOString*
  */

  toString(): string[] {
    return this.getCards().map((card) => card.toStringAll());
  }

  /*
    SET
  */

  public setCards(cards: Card[]): this {
    this.cards = cards;
    return this;
  }

  /*
    HAS
  */

  public hasCard(card: Card): boolean {
    return this.getCards().some((c: Card) => c.getIndex() === card.getIndex());
  }

  public hasCards(cards: Card[]): boolean {
    if (!this.hasCard(cards.shift() as Card)) {
      return false;
    }
    if (cards && cards.length > 0) {
      return this.hasCards(cards);
    } else {
      return true;
    }
  }

  /*
    CHECK
  */

  public isEmpty(): boolean {
    return this.getCount() === 0;
  }

  public areEquivalent(objA: any, objB: any): boolean {
    return JSON.stringify(objA) === JSON.stringify(objB);
  }

  /*
    OPERATIONS
  */
  // Advanced Operations
  public shuffle(): void {
    this.setCards(this.durstenfeldshuffle(this.getCards()));
  }

  /**
   * Shuffle one card to a random location
   * for each card in the deck.
   *
   * If one card or less is provided, an Error
   * will throw that the cards could not be shuffled.
   */

  /**
   * Durstenfeld shuffle algorithm
   */
  public durstenfeldshuffle(cards: Card[]): Card[] {
    const length = cards.length;
    if (length < 2) {
      throw new Error('Not enough cards to shuffle');
    }
    for (let i = length; i; i--) {
      const n = Math.floor(Math.random() * i);
      [cards[i - 1], cards[n]] = [cards[n], cards[i - 1]];
    }
    return cards;
  }

  // Hand Methods
  public createHand(size: number): Deck {
    const hand = new Deck();
    this.deal(hand, size, false);
    return hand;
  }

  public deal(
    hand: Deck,
    /** Amount of cards to deal into Hand */ size: number,
    /** Deal cards to top of hand */ frontOfHand: boolean = false
  ): this {
    if (frontOfHand) {
      hand.addCards(this.takeCards(size));
    } else {
      hand.addCardsToBottom(this.takeCards(size));
    }
    return this;
  }

  /**
   * Performs action of removing a card from player hand.
   *
   * Throws error if `Card` played is not in player's hand.
   * @param card - Card being played
   */
  public playCard(card: Card): void {
    this.removeCards([card]);
  }

  /**
   * Order cards in Hand by Rank and Suit
   * @see Hand.suitOrder
   */
  public sortCards(): this {
    const cards = this.getCards();
    if (this.isEmpty()) {
      throw new Error('No cards to sort');
    }
    if (this.suitOrder.length === 0) {
      throw new Error('No suit order defined');
    }

    let sortedCardsBySuit: Card[] = [];
    const cardsBySuit = new Map<Suit, Card[]>(
      Array.from(
        MapExtensions.GroupBy(cards, (card: any) =>
          this.suitOrder.indexOf(card.suit)
        ).entries()
      ).sort()
    );

    cardsBySuit.forEach((suitCards: Card[]) => {
      sortedCardsBySuit = sortedCardsBySuit.concat(
        suitCards.sort((a: Card, b: Card) => {
          return a.rank - b.rank;
        })
      );
    });

    this.setCards(sortedCardsBySuit);
    return this;
  }

  /*
  // Static Methods
  */
  public static BuildFrom(cards: Card[] = []): Deck {
    return new Deck(cards);
  }
}
