import { BehaviorSubject, Subject } from 'rxjs';

import { ModuloUtil } from '../app/utils/utils';
import { Card } from './Card';
import { Suit } from './Enums';
import { CardProp, GameState, ValidCardProps } from './GameEval';
import { Player } from './Player';
import { Slot } from './Slot';

export class PlyStack {
  slots: Slots;
  maximumSlots = 4;
  trumpSuit: Suit = Suit.spade;
  plySuit: Suit | null = null;
  players: Player[];

  constructor(players: Player[]) {
    if (players.length !== 4) throw new Error('PlyStack needs 4 players');
    this.players = players;
    this.slots = {
      '0': new Slot(null, players[0], true),
      '1': new Slot(null, players[1]),
      '2': new Slot(null, players[2]),
      '3': new Slot(null, players[3]),
    };
  }

  checkIfValidCard(handCards: Card[], card: Card): boolean {
    //
    const check = this.getCandidateCards(handCards).includes(card);

    return check;
  }

  getCandidateCards(handCards: Card[]): Card[] {
    //

    if (!this.plySuit) return handCards;
    else {
      return handCards.filter((card) => card.suit === this.plySuit);
    }
  }

  waitingKeypress() {
    return new Promise<Player | null>((resolve) => {
      const onKeyHandler = (e: { keyCode: number }) => {
        if (e.keyCode === 13) {
          document.removeEventListener('keydown', onKeyHandler);
          const player = this.getWinner();
          this.plySuit = null;
          resolve(player);
        }
      };
      document.addEventListener('keydown', onKeyHandler);
    });
  }

  /*
    GET
  */

  getCardsLength(): number {
    return this.getCards().length;
  }

  getCardInSlot(slot: keyof Slots): Card | null {
    if (!this.slots[slot]) return null;
    const card = this.slots[slot].card;
    if (card === null) return null;
    return card;
  }

  // TODO: Buggy
  async getWinner(): Promise<Player | null> {
    const fgh = Object.values<Slot>(this.slots).sort((a, b) => {
      if (a.card && b.card) {
        return this.getRankWithTrump(a.card, b.card);
      }
      return 0;
    });

    const winningPlayer = fgh.map((slot) => slot.player)[0];
    if (winningPlayer) {
      const windeck = winningPlayer.team?.winDeck;
      const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
      await sleep(4000);
      windeck?.addCards(this.getCards());
      await this.removeAllCardsFromSlot();
    }
    return winningPlayer;
  }

  getRankWithTrump(a: Card, b: Card) {
    const checksuit =
      -(a.suit === this.trumpSuit) - -(b.suit === this.trumpSuit);
    return checksuit || b.rank - a.rank;
  }

  // TODO: to test
  getCards(): Card[] {
    const cards: Card[] = [];
    for (const slot of Object.values(this.slots)) {
      if (slot.card) {
        cards.push(slot.card);
      }
    }
    return cards;
  }

  getSlotsArray(): Slot[] {
    return Object.values(this.slots);
  }

  getSlotObservable(slot: keyof Slots): Subject<Slot> {
    return this.slots[slot].slotObservable;
  }

  /*
    REMOVE
  */

  // TODO: to test
  removeCardFromSlot(slot: keyof Slots) {
    if (!this.slots[slot]) throw new Error('Slot not found');
    const card = this.slots[slot].card;
    this.slots[slot].card = null;
    return card;
  }

  // TODO: to test
  async removeAllCardsFromSlot() {
    for (const slot of Object.keys(this.slots)) {
      this.slots[slot as keyof Slots].card = null;
    }
  }

  /*
    ADD
  */

  // TODO: to test
  async addCardToSlot(
    slotArg: keyof Slots,
    card: Card
  ): Promise<Player | null> {
    let slot = slotArg;

    if (!this.slots[slot]) throw new Error('Slot not found');
    if (this.slots[slot].card) throw new Error('Slot already has a card');

    if (slot === 1) this.plySuit = card.suit;

    this.slots[slot].card = card;

    let returnFrom = null;

    card.removed = true;
    if (this.getCardsLength() >= this.maximumSlots) {
      //return this.waitingKeypress();
      const winningPlayer = await this.getWinner();
      this.plySuit = null;
      returnFrom = winningPlayer;

      if (winningPlayer) {
        slot = winningPlayer.position - 1;
      }
    }
    this.changeSlotAvailability(slot);

    return returnFrom;
  }

  changeSlotAvailability(slot: keyof Slots) {
    const previousSlot = ModuloUtil(
      +slot,
      [0, Object.values(this.slots).length],
      false
    );

    this.slots[previousSlot].available = false;
    const nextslot = ModuloUtil(
      +slot + 1,
      [0, Object.values(this.slots).length],
      false
    );

    this.slots[nextslot].available = true;
  }
}

interface Slots {
  [s: string]: Slot;
}
