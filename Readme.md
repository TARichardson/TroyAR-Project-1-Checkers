# Project 1 Checkers Proposal/MVP

_Introduction_
This is a basic game of the checkers board game, American checkers. Using rules from the website https://www.itsyourturn.com/t_helptopic2030.html. Tutorial Section:

## Project Risks.
  - The jumping the opponent.
  - The Crowning the the checker.
  - Multi-jumps.
## solving.
  - Depending on the direction the piece is going the location on the board will hold possibles jumps from that spot.
  - The crowned checker piece will need to move in both direction. I will store a bool to let the move logic know to let the crowned piece move and jump in both direction.
  - Should it be auto after the 1st jump, because the rules said you must take all possibles jumps.


### Specifications
- Start button > select what color you want.
- Setup Board: needs 32x32 board - 32 dark squares.
- 2 players needed: with 12 pieces each on 3 rows each the player's side.
- player pieces: 'red' or 'black' color.
- win condition: Capture other player pieces or leave your opponent with no available moves
- lose condition: All 12 pieces from your side have been captured.
- draw condition: Both players are left with no available moves for any pieces on the board.
- progress is made by: the player will mark progress by the total pieces captured.
- captured pieces will be scored for each player.
- valid move 1a: It's when a player clicks there own piece then click on an open spot.
- valid move 1b: basic movement is to move a checker one space diagonal forward.
- valid move 1c: Can't move a checker backward until it becomes a king.
- valid move 1d: If jump is available you must take the jump.
- valid jump 2a: If one of your opponent's checker is on a forward diagonal nest to one of your checker, and the next space beyond the opponent's checker is empty.
- valid jump 2b: After making one jump, your checker might have another jump available from its new position. Your checker must take that jump too.
- valid jump 2c: Must continue to jump until there are no more jumps available.
- valid jump rule: If you have a valid jump, you must jump.
- invalid move - is when a player clicks on any non-open -spot and no jump possibles are available.
- invalid jump - the next space beyond the opponent is not empty when jumping.
- The player will get a message "invalid move Player#" when make invalid moves.
- Message using the DOM
- Crowning 3a: When one of your checkers reaches the opposite side of the board, it is crowned and become a king. Your turn ends when kinged.
- Crowning 3b: A king can move backward and forward one space at a time.

### MVP
- Setup Board: needs 32x32 board - 32 dark squares.
- 2 players needed: with 12 pieces each on 3 rows each the player's side.
- player pieces: 'red' or 'black' color.
- message using console
- win condition: Capture other player pieces or leave your opponent with no available moves
- lose condition: All 12 pieces from your side have been captured.
- draw condition: Both players are left with no available moves for any pieces on the board.
- progress is made by: the player will mark progress by the total pieces captured.
- valid move 1a: It's when a player clicks there own piece then click on an open spot.
- valid move 1b: basic movement is to move a checker one space diagonal forward.
- valid move 1c: Can't move a checker backward until it becomes a king.
- valid move 1d: If jump is available you must take the jump.
- valid jump 2a: If one of your opponent's checker is on a forward diagonal nest to one of your checker, and the next space beyond the opponent's checker is empty.
- valid jump rule: If you have a valid jump, you must jump.
- invalid move - is when a player clicks on any non-open -spot and no jump possibles are available.
- invalid jump - the next space beyond the opponent is not empty when jumping.
- Crowning 3a: When one of your checkers reaches the opposite side of the board, it is crowned and become a king. Your turn ends when kinged.
- Crowning 3b: A king can move backward and forward one space at a time.

### Tasks
- see specifications, each on should take an 2 hr 30 min

```javascript
- const gameState = {
  gameRunning: true,
  winner: false,
  p1Turn: true,             // true if player 1 turn, false if player 2 turn.
  Player: [
    {
      id: 1,                // player id will be use on the internal board
      name: 'Player 1',     // player name that is displayed.
      color: 'red',         // player color of checkers.
      score: 0,             // pieces captured from opponent
      pieces: [             // has the 12 pieces
        {
          king: false,      // king has different move logic
          location: 'A0',   // location on board.
          direction: 'down',// are your pieces moving 'up', 'down', or 'both' on the board.
          captured: false,  // if captured that pieces is removed from the board.
        },
          {}]
    },
    {
      id: 2,
      name: 'Player 1',
      color: 'black',
      Score: 0,
      pieces:
    }],
  gameBoard: {
    A:[0,0,0.....],
    B:[0,0,0.....],
    C:[0,0,0.....]
  }

}
```

```javascript
- const gameUpdate = () => {
  if(gameState.gameRunning){
    checkWin();
    displayGame();
  }
}
```
Log         | Task
----------- | ---------------------------------------------------------------
Oct 24 2018 | fill out the jumps for each spot. Move pieces on board. jumping
Oct 25 2018 | working on HTML and updating the DOM with game data.
Oct 26 2018 | processing user input.
codePen     | https://codepen.io/TARichardson/pen/pxGrpK?editors=1111
codePen2    | https://codepen.io/TARichardson/pen/ePxezg?editors=1111
