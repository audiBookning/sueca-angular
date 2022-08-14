# Angular version of the card game Sueca.

Some of what i call "scratchCode/scrapCode", so it is just chaotic random code with the aim of trying things with little to no structure or "good code" (hobby code with too much planning makes me sleepy). That also means that there is no idea or turning this in a complete/clean app.

Anyone is welcome to copy or fork this repo. But beware to beginners. This is an example of how not to do a project. Be warned.

I made this public because i think that i may be of help to someone in any way. And also because i am shameless...

An Angular light version of a team card playing game popular in Brasil, Portugal, and portuguese countries named [Sueca](<https://en.wikipedia.org/wiki/Sueca_(card_game)>)

Use:

- [SVG-cards](https://github.com/htdebeer/SVG-cards)

- various classes code extracted from [TypeDeck](https://github.com/mitch-b/typedeck) a card playing library.

## Notes

Implemented a form of min max search but it is still not very smart, although it has some interesting plays sometimes.

use svg temporarly, then change to png for pergormance reasons. In this case Svg doesn't seem to bring any advantages.

The classes are extremely coupled to each other in an almost recursive way. For this use case, it is not important, but for a ore complex app, this type of pattern will kill the future of the app.

There is an angular service that isn't doing anything at the moment, but the code should be rewriten for the service to be an adapter to all the classes and to refactor the classes structure later (or not...)

## TODOS

- Add tests

- rare bugs in sorting human player cards?

- Change first to play to the winner of the previous hand

- smarter choosing of the playing of cards

- Dealing with the ending of the game

- add tournament of n whole game winnings max

- add feedback validation and interaction to the user

- use a service for any components to interface with game engine

- plugin ai architecture that can accept modular strategies?

## Usefull Angular cli commands for dev

Add `--dry-run` flag to only test the command without creating any files

### modules

- generate a lazy loaded module with a default fooMod component and with routing for that component inside the fooMod module.

  - `--route` is to add the module fooMod with a lazy route named 'fooModRoute' to the routes array of the -m module

  `ng g m fooMod --route fooModRoute -m app`

### components

- generate a component at the root project and imported by the root module

  `ng g c fooComp`

- generate a component inside the threejs folder and imported by

  - the root module if no foo module exist
  - the foo module if it exist

  `ng g c foo/barComp`

- generate a component at the root project and imported by the -m module

  `ng g c fooComp -m fooMod`

- generate a component inside the -m module and imported by the same module

  `ng g c foo/fooComp -m fooMod`
