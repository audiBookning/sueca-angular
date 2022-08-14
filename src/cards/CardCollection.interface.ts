import { CardName } from './Enums';

// REF: https://github.com/mitch-b/typedeck
// INFO: for reference mainly

export interface ICardCollection {
  getCards(): ICard[];
  addCard(card: ICard): ICardCollection;
  addCards(cards: ICard[]): ICardCollection;
  removeCards(cards: ICard[]): ICardCollection;
  takeCard(): ICard;
  takeCards(amount: number): ICard[];
  getCount(): number;
  isEmpty(): boolean;
  hasCard(card: ICard): boolean;
  hasCards(cards: ICard[]): boolean;
  shuffle(): void;
  indexOfCard(card: ICard): number;
  cardAtIndex(index: number): ICard;
}

export interface ICard extends MapIndexable {
  cardName: CardName;
}

/**
 * Required to implement this class to shove
 * any extending class into an IndexedMap<T, U>
 */
export interface MapIndexable {
  getIndex(): string;
}

export interface ICardPile extends ICardCollection {
  addCardsToBottom(cards: ICard[]): void;
  takeCardFromBottom(): ICard;
  takeCardsFromBottom(amount: number): ICard[];
}

export interface IDeck extends ICardPile {
  createHand(options: HandOptions): IHand;
  deal(hand: IHand, size: number): IDeck;
}

export class HandOptions {
  public size = 7;
}

export interface IHand extends ICardPile {
  sortCards(cardRank: IRankSet): IHand;
  playCard(card: ICard): void;
}

export interface IRankSet {
  rankSet: CardName[];
  getRankValue(card: ICard): number;
  cardHigherThan(thisCard: ICard, compareCard: ICard): boolean;
}
