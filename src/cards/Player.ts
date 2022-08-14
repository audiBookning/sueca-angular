import { v4 as UUIDV4 } from 'uuid';

import { Deck } from './Deck';
import { Team } from './Team';

export class Player {
  public id: string;
  public score: number = 0;
  private hand: Deck;
  team: Team | undefined;
  position: number; // position at the table
  playerIndex: number;

  constructor(
    public name: string = '',
    position: number,
    playerIndex: number,
    isHuman: boolean = false
  ) {
    this.id = UUIDV4();
    this.hand = new Deck();
    this.position = position;
    this.playerIndex = playerIndex;
  }

  setTeam(team: Team): this {
    this.team = team;
    return this;
  }

  public updateScore(score: number): this {
    this.score = score;

    return this;
  }

  public getHand(): Deck {
    return this.hand;
  }

  public setHand(hand: Deck): this {
    this.hand = hand;
    return this;
  }

  public toString(): string {
    return `${this.name}`;
  }

  public getIndex(): string {
    return this.id;
  }
}
