import { Deck } from './Deck';
import { Player } from './Player';

export class Team {
  players: Player[];
  winDeck: Deck;

  constructor(players: Player[]) {
    this.players = players;
    this.players.forEach((player) => {
      player.setTeam(this);
    });
    this.winDeck = new Deck();
  }

  getPoints(): number {
    const points = this.winDeck.getCards().reduce((acc, card) => {
      return acc + card.value;
    }, 0);
    return points;
  }
}
