import { Subject } from 'rxjs';

import { Card } from './Card';
import { Player } from './Player';

export class Slot {
  private _card!: Card | null;
  public get card(): Card | null {
    return this._card;
  }
  public set card(value: Card | null) {
    this._card = value;
    if (value) {
      this.available = false;
    }
  }
  player: Player | null;
  private _available!: boolean;
  public get available(): boolean {
    return this._available;
  }
  public set available(value: boolean) {
    this._available = value;

    if (this && value) this.changeAvailabilty();
  }
  slotObservable: Subject<Slot>;

  async changeAvailabilty() {
    const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
    await sleep(2000);
    this.slotObservable.next(this);
  }

  constructor(
    card: Card | null = null,
    player: Player | null = null,
    available: boolean = false
  ) {
    this.slotObservable = new Subject<Slot>();
    this.card = card;
    this.player = player;
    this.available = available;
  }
}
