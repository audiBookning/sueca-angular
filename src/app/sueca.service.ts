import { ElementRef, Injectable } from '@angular/core';

import { Deck } from '../cards/Deck';
import { Player } from '../cards/Player';
import { PlyStack } from '../cards/PlyStack';
import { SuecaGameType } from '../cards/SuecaGameType';
import { Team } from '../cards/Team';

interface ViewPile {
  cards: string[];
  numberOfCards: number;
  svgEl: ElementRef<HTMLElement> | undefined;
}

export interface ViewPlayer {
  player: Player;
  cards?: string[];
  numberOfCards: number;
}

export interface ViewStackInput {
  player: Player;

  numberOfCards: number;
}

@Injectable({
  providedIn: 'root',
})
export class SuecaService {
  //

  constructor() {}
}
