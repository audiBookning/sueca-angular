# Thinking about the game AI

Limit the evaluation to the ply and at least calculate the influence of the teamate.
Avoid strategying the following plies for now and for simplicity.

Another alternative to the following would be to get all the permutation of the possible card play and calculate their respective values.

- then filter and sort by worse/best outcome
- Example quick hack: multiply them (?) to reduce to zero a card play if one of the possibilities gives a zero value? Note that this doesn't give the "real" expectancy.
- Or just give negative values?

Use min max heuristics and alpha beta prunning?

## Game AI 01

use expected value as heuristic?

use probabilistic distribution of cards in the players hands?

## Game AI 02

- track all cards

  - remove cards already played

  - gives probability of outcome for each card being in the hand of a particular player

- before each card play in a ply give an expected value to each possible cards in the hand of the turn player.

  - choose better expected value

- Each card played change the probability of the other cards

- divide all the remaining cards (not of the turn player) into 3 categories depending on their influence on the ply given that evaluated player card:

  - Higher: can win the ply
  - equal
  - inferior

- those cards will influence the categories with positive or negative values depending on the probability of belonguing to the player team or the adversary

- several situations will influence the final value

  - being the first in the ply
    - the adversary (at least one of them, but all must be counted) has card of the suit played
      - the available card are higher of inferior in rank
      - the cards value count as an outcome
    - the adv. doesn't have the suit
    - the teamate has suit
    - the teamate doesn't have suit
    - in case of no suit, do they have trump?
    - teamate with no suit can give a card of value if the ply is won
      - or discard a strategic card

- some sequences to consider and categorize the cards

  Pi: player n in the ply order
  Ai: adversary n in order
  S: plays a particular suit
  nS: doesn't plays in the suit
  T: plays a trump
  nT: doesn't play a trump
  Sp: plays a suit with higher rank than the previous
  Spg: plays a suit with higher rank than the all the previous
  Sm: plays a suit with minor rank than the previous
  Smg: plays a suit with minor rank than the all the previous

      - P1-S,
          - A1-S,
              - P2-S,
                  - A2-S
                  - A2-nS/T
                  - A2-nS/nT
              - P2-nS/T
              - P2-nS/nT
          - A1-nS/T
          - A1-nS/nT
