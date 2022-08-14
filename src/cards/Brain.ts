import { Card } from './Card';
import { Deck } from './Deck';
import { Suit } from './Enums';
import { GameEval } from './GameEval';
import { Player } from './Player';
import { PlyStack } from './PlyStack';

export class Brain {
  player: Player;
  // order of play, not the slot number

  plyStack: PlyStack;
  mainDeck: Deck;

  gameEval: GameEval;

  constructor(
    player: Player,
    playerIndex: number,
    mainDeck: Deck,
    plyStack: PlyStack
  ) {
    this.player = player;

    this.plyStack = plyStack;
    this.mainDeck = mainDeck;

    this.gameEval = new GameEval(
      mainDeck.getCards(),
      playerIndex,
      player.getHand(),
      plyStack
    );
    //this.gameEval.evaluateCardsWithOwnHand()
  }

  // Random strategy
  public playRandomCard(): { card: Card } {
    const card: Card = this.getValidCard();
    this.plyStack.addCardToSlot(this.player.position + 1, card);
    return { card };
  }

  async playEvaluatedCard() {
    this.gameEval.evaluateCardsWithOwnHand();
    //const card: Card = this.gameEval.calculateOwnPlayer().card;
    const card: Card | undefined = this.gameEval.minMax();
    if (!card) return;
    this.getPlayerHand().removeCard(card);
    const player = await this.plyStack.addCardToSlot(
      this.player.position,
      card
    );
    return { card, player };
  }

  // first card of the stack is the plySuit
  // every card after that must try to play in that suit
  getValidCard() {
    let card: Card;

    if (this.plyStack.plySuit !== null) {
      card = this.getCardsBySuit(this.plyStack.plySuit);
    } else {
      card = this.getPlayerHand().takeCardFromBottom();
    }
    return card;
  }

  getCardsBySuit(suit: Suit): Card {
    const card = this.getPlayerHand().getCardsBySuit(suit);
    if (card.length === 0) return this.getPlayerHand().takeCardFromBottom();

    this.getPlayerHand().removeCard(card[0]);
    return card[0];
  }

  getPlayerHand(): Deck {
    return this.player.getHand();
  }
}

/*
  NOTES:
    For this class to be smarter, it will need more info.
      - The team's stack of cards and their total value.
      - The cards in the player's hand and their total value.
        - He cannot know the cards in the other player's hand.
        - So does it mean that we will have 4 brains, one for each player?
        - So include the ply stack and the brain as player properties? A better API?
      - the cards in the Ply stack (the cards that were played) and their total value
*/
