import { ThisReceiver } from '@angular/compiler';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Brain } from '../../cards/Brain';
import { Card } from '../../cards/Card';
import { Deck } from '../../cards/Deck';
import { Suit } from '../../cards/Enums';
import { Player } from '../../cards/Player';
import { PlyStack } from '../../cards/PlyStack';
import { SuecaGameType } from '../../cards/SuecaGameType';
import { Team } from '../../cards/Team';
import { SuecaService, ViewPlayer } from '../sueca.service';
import { ModuloUtil } from '../utils/utils';

@Component({
  selector: 'app-show-cards',
  templateUrl: './show-cards.component.html',
  styleUrls: ['./show-cards.component.scss'],
})
export class ShowCardsComponent implements OnInit, AfterViewInit {
  // SVG
  @ViewChild('svgEl', { static: true })
  svgEl!: ElementRef<HTMLElement>;
  svgWidth = 700;
  svgHeight = 600;
  svgUrl: string = 'assets/svg-cards.svg#';
  cardDefaultWidth = 169.075;
  cardDefaultHeight = 244.64;

  viewBox = '0 0 ' + this.svgWidth + ' ' + this.svgHeight;
  // svg group transforms
  transforms = [
    // Players
    'scale(0.5) translate(410 840)',
    'scale(0.3) translate(1650 740)',
    'scale(0.3) translate(830 140)',
    'scale(0.3)  translate(60 740)',
    // PlyStack
    'scale(0.3)  translate(1090 940)',
    'scale(0.3)  translate(1350 740)',
    'scale(0.3)  translate(1090 540)',
    'scale(0.3)  translate(820 740)',
    // Total Points
    'scale(0.3)  translate(120 240)',
  ];

  // defaults
  numberOfCards = 10;

  // Stacks
  mainDeck!: Deck;
  plyStack!: PlyStack;

  // Players
  players: Player[] = [];
  teams: Team[] = [];
  brains: Brain[] = [];

  // INFO: who is the player who has the turn
  playerTurn: number = 0;
  trumpSuit: Suit = Suit.spade;
  humanPlayer!: Player;

  constructor(private suecaSvc: SuecaService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initPlayersAndTeams();
    this.initStacks();

    this.players.forEach((player, index) => {
      // TODO: do not send the maindeck, but only its cards and they should be sorted
      // to obsure the order of the player cards
      // or just implement a random deal of cards to each player
      const newBrain = new Brain(player, index, this.mainDeck, this.plyStack);
      this.brains.push(newBrain);
    });

    this.players.forEach((player) => {
      this.mainDeck.deal(player.getHand(), this.numberOfCards);
    });

    // ************* */
    this.cd.detectChanges();
  }

  initPlayersAndTeams() {
    // Create Players
    this.humanPlayer = new Player('Bob', 0, 0, true);
    const player2 = new Player('Alice', 1, 1);
    const player3 = new Player('Carol', 2, 2);
    const player4 = new Player('Dave', 3, 3);
    this.players = [this.humanPlayer, player2, player3, player4];

    const team1 = new Team([this.humanPlayer, player3]);
    const team2 = new Team([player2, player4]);
    this.teams = [team1, team2];
  }

  initStacks() {
    this.mainDeck = new SuecaGameType().createDeck();
    this.mainDeck.shuffle();

    // PlyStack
    this.plyStack = new PlyStack(this.players);
    this.players.forEach((player) => {
      this.plyStack.getSlotObservable(player.position).subscribe((slot) => {
        const playerHandLengh = player.getHand().getCards().length;
        if (playerHandLengh < 1) this.setNewGame();

        this.playerTurn = player.position;

        if (player.position !== 0) {
          this.playNextCard();
          return;
        }

        // this.cd.detectChanges();
      });
    });
  }

  setNewGame() {
    // TODO: reset the game
  }

  async onCardClick(playerIndex: number, index: any) {
    if (this.playerTurn !== playerIndex) return;

    if (this.playerTurn === 0) {
      const hand = this.humanPlayer.getHand();
      const card = hand.getCardAtIndex(index);
      const check = this.plyStack.checkIfValidCard(hand.getCards(), card);

      if (check) {
        const removed = hand.removeCardByIndex(index);
        this.plyStack.addCardToSlot(playerIndex, card);
        return;
      }
      // TODO: validation
    }
  }

  async playNextCard() {
    if (this.playerTurn === this.humanPlayer.playerIndex) {
      return; // human player turn to play
    }

    const player = await this.brains[this.playerTurn].playEvaluatedCard();
  }

  getTeamPoints(teamIndex: number) {
    if (!this.teams[teamIndex]) return 0;
    return this.teams[teamIndex].getPoints();
  }

  // TODO
  checkFinalWinner() {}
  checkPlayedCardIsLegal = (card: Card) => {};

  getSvgCardName(playerPosition: number, index: number) {
    if (!this.players) return '';
    return (
      this.svgUrl +
      this.players[playerPosition].getHand().getCards()[index].toSvgName()
    );
  }

  getSvgPlyStackCardName(index: number) {
    if (!this.plyStack || this.plyStack.getCardInSlot(index) === null)
      return this.svgUrl + 'card-base';
    const card = this.plyStack.getCardInSlot(index);
    if (card === null) return this.svgUrl + 'card-base';
    return this.svgUrl + card.toSvgName();
  }

  getSvgX(index: number) {
    return 25 + index * 40;
  }

  getPlayerCards(playerIndex: number): Card[] {
    if (this.players.length === 0) return [];
    return this.players[playerIndex].getHand().getCards();
  }
}
