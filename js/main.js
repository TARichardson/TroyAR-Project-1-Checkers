//////////////////////////////////////////////////
////////// Author - Troy A. Richardson
//////////

/////////////////////////////////////////////////
/////////// Model


class Pieces {
  constructor(id){
    this._id=         id;     // player id may not be needed
    this._king=       false;  // king has different move logic
    this._location=   String;    //'A0' // location on board.
    this._direction=  id;    // are your pieces moving 'up' = 1, 'down' = 2, or 'both' = 3 on the board.
    this._captured=   false;  // if captured that pieces is removed from the board.
  }
}
const colCheckers = ['black','red'];
const maxPlayers = 2; // per game
const maxPieces = 12; // per player.
class Player {
  constructor(id, name, color) {
    this._id = id;              // player id will be use on the internal board
    this._name = name;          // player name that is displayed.
    this._color = color;        // player color of checkers.
    this._score = 0;            // pieces captured from opponent
    this._pieces = [maxPieces];  // has the 12 pieces
    for(let i = 0; i < maxPieces; i += 1){
      this._pieces[i] = new Pieces(this._id);
    }
  }
}

// class GameBoard {
//   A:[0,0,0];
//   B:[0,0,0];
//   C:[0,0,0];
// }

class GameState {
  static get _instance () {    // Create a singleton
    return this;
  }
  constructor() {

    // if created return the instance
    if(typeof this._instance == "object")
    {
      console.log("same");
      return this._instance;
    }
    // else create the GameState obj
    this._instance = this;
    this._gameRunning = true;
    this._winner = false;
    this._p1Turn = true;       // true if player 1 turn, false if player 2 turn.
    this._player = [maxPlayers];
    for(let i = 0; i < maxPlayers; i += 1){
      let id = i + 1;
      this._player[i] = new Player( id,`Player ${id}` , colCheckers[i]);
    }

    return this._instance;

  }

}

const gameUpdate = () => {
  if(gameState.gameRunning){
    checkWin();
    displayGame();
  }
}

/////////////////////////////////////////////////
////////// Control



////////////////////////////////////////////////
///////// View
// tip use  "let src = elem.nodeValue;" research
