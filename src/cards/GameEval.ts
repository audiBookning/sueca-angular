import {
  FormatCardsEval,
  FormatedCardsUtil,
  FormatedCardUtil,
  ModuloEasy,
  ModuloUtil,
  RangeFromToUtil,
} from '../app/utils/utils';
import { Card } from './Card';
import { Deck } from './Deck';
import { CardName, Suit } from './Enums';
import { Player } from './Player';
import { PlyStack } from './PlyStack';

// TODO: needs to have a card probability of for each players.
// Not good. Probably needs to refactor the overall structure of all the classes?
// each player's card probabilities should be only be accessible to the player.
// should they be contained in the brain class?

export class GameEval {
  cardsEval: CardEval[] = [];

  playerHand: Deck;
  players: Player[] = [];
  player: Player;

  public get trumpSuit(): Suit {
    return this.plyStack.trumpSuit;
  }

  public get plySuit(): Suit | null {
    return this.plyStack.plySuit;
  }

  plyStack: PlyStack;

  cardsNotRemoved: CardEval[] = [];
  // receive all the cards when the main deck is instantiated.
  constructor(
    cards: Card[],
    player: Player,
    playerHand: Deck,
    plyStack: PlyStack,
    players: Player[]
  ) {
    cards.forEach((card) => {
      this.cardsEval.push({ card, probability: [0, 0, 0, 0] });
    });

    this.player = player;
    this.playerHand = playerHand;
    this.plyStack = plyStack;
    this.players = players;
  }

  // not working yet
  // Cannot get the values from the other players
  // reevaluate after a card is played.
  evaluateCardsWithOwnHand() {
    const playerCards = this.playerHand.getCards();
    this.cardsNotRemoved = this.getCardsNotRemoved();
    this.cardsNotRemoved.forEach((card, index) => {
      [0, 1, 2, 3].forEach((playerIdx) => {
        // TODO: the include check is not working correctly

        if (
          this.player.position === playerIdx &&
          this.includesCard(card.card, playerCards)
        ) {
          card.probability[playerIdx] = 1;
        } else if (
          this.player.position !== playerIdx &&
          this.includesCard(card.card, playerCards)
        ) {
          card.probability[playerIdx] = 0;
        } else if (
          this.player.position !== playerIdx &&
          !this.includesCard(card.card, playerCards)
        ) {
          card.probability[playerIdx] =
            this.getProbabilityOtherHands(playerCards);
        }
      });
    });
  }

  includesCard(card: Card, cards: Card[]) {
    return !!cards.find((c) => c.toSvgName() === card.toSvgName());
  }

  // TODO: Maybe refactor into a getter of this.cardsEval?
  getCardsNotRemoved() {
    const notRemoved = this.cardsEval.filter((card) => !card.card.removed);

    return notRemoved;
  }

  // not working yet
  // probability of being in either of the other players hands.
  getProbabilityOtherHands(playerCards: Card[]) {
    return 1 / (this.cardsNotRemoved.length - playerCards.length);
  }

  /*
   ****************************************
   ****************************************
   */

  minMax() {
    let card: Card | undefined;
    const cardProp = this.evalCard();

    if (cardProp) {
      card = this.cardsEval.find(
        (c) =>
          c.card.suit === cardProp.suit && c.card.cardName === cardProp.cardName
      )?.card;
    }
    return card;
  }

  // min max
  evalCard(gameState = this.createGameState(this.player)): CardProp {
    //if (gameState.playerIndex > 3) return null;
    const modulo = ModuloUtil(gameState.player.position, [0, 2]) * -2 + 1;

    const candidateCards: CardProp[] = this.getCandidateCards(gameState);

    const ss: CardProp[] = candidateCards.map((card) => {
      const newGameState = structuredClone(gameState) as GameState;
      const cardProbabilities = [...card.probability];

      newGameState.plyArray.push({
        suit: card.suit,
        rank: card.rank,
        value: card.value,
        cardName: card.cardName,
        player: gameState.player,
      });
      // change cardProps and PlyArray since the card is played.
      this.reEvalCardsProbabilities(newGameState, card);
      //

      /* let expectedValue2: number =
        card.probability[newGameState.playerIndex] * card.value +
        (temp ? temp.expectedValue : 0); */

      const isWinning = this.checkIfWinning(newGameState);

      let plyValue = newGameState.plyArray.reduce<number>(
        (a, b) => a + b.value,
        0
      );
      const checkTeam =
        ModuloEasy(isWinning.player.position) ===
        ModuloEasy(this.player.position);

      if (checkTeam) {
        plyValue *= 1;
      } else {
        plyValue *= -1;
      }
      let expectedValue: number =
        cardProbabilities[newGameState.player.position] * plyValue;

      const newPlayer = this.players.find((plr) => {
        return plr.playerIndex === newGameState.player.playerIndex + 1;
      });
      let addedExpValue: number = 0;
      if (newPlayer) {
        newGameState.player = newPlayer;
        addedExpValue = this.evalCard(newGameState).expectedValue;
      }

      expectedValue += addedExpValue;
      card.expectedValue = expectedValue;
      return card;
    });

    const hh2 = ss.sort((a, b) => {
      return modulo > 0
        ? a.expectedValue - b.expectedValue
        : b.expectedValue - a.expectedValue;
    });
    let mTemp = modulo;
    if (gameState.player.playerIndex === this.player.playerIndex) {
      mTemp = 1;
    } else {
      mTemp = -1;
    }
    const hh = ss.sort((a, b) => {
      return b.expectedValue - a.expectedValue * mTemp;
    });

    return hh[0];
  }

  checkIfWinning(gameState: GameState): PlyTemp {
    const sorted = gameState.plyArray.sort((a, b) =>
      this.getRanWithTrump(a, b)
    );

    return sorted[0];
  }

  // TODO: do not cut unless necessary.
  //   - cut over the teamate cut
  //   - cut over the teammate's "winning"? ply
  // do not give points to the adversary.
  // give points to the teammate's "winning" ply.

  reEvalCardsProbabilities(gameState: GameState, card: CardProp): void {
    // set removed card
    const tempCard = gameState.cardProps.find(
      (cardProp) =>
        cardProp.cardName === card.cardName && cardProp.suit === card.suit
    );
    if (tempCard) tempCard.removed = true;
    // update probabilities
    // card is a trump card
    if (
      gameState.plyArray.length < 1 ||
      card.suit !== gameState.plyArray[0].suit
    ) {
      gameState.cardProps
        .filter((cardProp) => cardProp.suit === card.suit)
        .forEach((cardProp) => {
          cardProp.probability[gameState.player.position] = 0;
        });
    }
  }

  // TODO: refactor to a static method in PlyStack.
  getCandidateCards(gameState: GameState): CardProp[] {
    //
    const newCardProps: CardProp[] = gameState.cardProps.filter(
      (card) =>
        card.removed === false &&
        card.probability[gameState.player.position] > 0
    );
    if (gameState.plyArray.length < 1) return newCardProps;
    const gg = newCardProps.reduce<ValidCardProps>(
      (acc, curr) => {
        //if (!curr) return acc;
        const withSuit = curr.suit === gameState.plyArray[0].suit ? curr : null;
        const withoutSuit =
          curr.suit !== gameState.plyArray[0].suit ? curr : null;
        if (withSuit) {
          acc.withSuit.push(withSuit);
        }
        if (withoutSuit) {
          acc.withoutSuit.push(withoutSuit);
        }
        return acc;
      },
      { withSuit: [], withoutSuit: [] }
    );
    if (gg.withSuit.length > 0) {
      return gg.withSuit;
    } else {
      return gg.withoutSuit;
    }
  }

  getRanWithTrump(a: PlyTemp, b: PlyTemp) {
    const checksuit =
      -(a.suit === this.trumpSuit) - -(b.suit === this.trumpSuit);
    return checksuit || b.rank - a.rank;
  }

  createGameState(player: Player): GameState {
    const plyArray: PlyTemp[] = this.plyStack
      .getSlotsArray()
      .reduce<PlyTemp[]>((acum, { card, player: plr }) => {
        if (!card || !plr) return acum;
        const temp = {
          suit: card.suit,
          rank: card.rank,
          value: card.value,
          player: plr,
          cardName: card.cardName,
        };
        acum.push(temp);
        return acum;
      }, []);

    const cardProps: CardProp[] = this.cardsEval
      // do the filter later in the candidate search
      //.filter(card => card.card.removed === false)
      .map((card) => {
        return {
          suit: card.card.suit,
          value: card.card.value,
          probability: card.probability,
          cardName: card.card.cardName,
          removed: card.card.removed,
          rank: card.card.rank,
          expectedValue: 0,
        };
      });

    return {
      player,
      plyArray,
      cardProps,
    };
  }
}

// INFO: smaller interface for better performance in cloning inside the search tree
export interface GameState {
  cardProps: CardProp[];
  player: Player;
  plyArray: PlyTemp[];
}

export interface PlyTemp {
  suit: Suit;
  cardName: CardName;
  rank: number;
  value: number;
  player: Player;
  expectedValue?: number;
}

export interface CardProp {
  suit: Suit;
  rank: number;
  value: number;
  cardName: CardName;
  removed: boolean;
  probability: number[];
  expectedValue: number;
}

export interface ValidCardProps {
  withSuit: CardProp[];
  withoutSuit: CardProp[];
}

export interface CardEval {
  card: Card;
  probability: number[]; // of being in a array of players hands
}
