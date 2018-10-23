//////////////////////////////////////////////////
////////// Author - Troy A. Richardson
//////////

/////////////////////////////////////////////////
/////////// Model

class Piece {
  constructor(id){
    this._id=         id;     // player id may not be needed
    this._king=       false;  // king has different move logic
    this._location=   String; //'A0' // location on board.
    this._direction=  id;     // are your pieces moving 'up' = 1, 'down' = 2, or 'both' = 3 on the board.
    this._captured=   false;  // if captured that pieces is removed from the board.
  }
}
const colCheckers = ['black','red'];
const maxPlayers = 2;     // per game
const maxPieces = 12;     // per player.
const maxBoardSize = 8;   // 8x8 = 64
const utfA = 65;          // UTF-16 'A'
class Player {
  constructor(id, name, color) {
    this._id = id;              // player id will be use on the internal board
    this._name = name;          // player name that is displayed.
    this._color = color;        // player color of checkers.
    this._score = 0;            // pieces captured from opponent
    this._pieces = [maxPieces];  // has the 12 pieces
    for(let i = 0; i < maxPieces; i += 1){
      this._pieces[i] = new Piece(this._id);
    }
  }
}

const spot = { // object template
  id: String,
  checkerId: Number,
  isEmpty: true,
  topSpots: [],
  bottomSpots: []
};

const fillBoardSpots = ( index, size) => {
  let tempArr = [];
  for(let j = 0; j < size; j += 1) {
    let tempObj = Object.create(spot);
    tempObj.id = String.fromCharCode(utfA + index) + j;
    tempArr[j] = tempObj;
  }
  return tempArr;
}

const resetBoardSpots = () => {

  console.log("in reset board spot");
}



class GameBoard {
  constructor(size){
    this._board = [];
    for(let i = 0; i < size; i += 1){
      let key = String.fromCharCode(utfA + i);
      //let tempObj = Object.create(spot);
      Object.defineProperty(this._board, key,
        {
      value: fillBoardSpots(i ,size),
      writable: true
    });
  }
}
}
class GameState {
   // Create a singleton
  constructor() {
    // if there is no instance of class make one
    if(!GameState._instance)
    {
      // create the GameState obj
      this._instance = this;
      this._gameRunning = true;
      this._winner = false;
      this._p1Turn = true;       // true if player 1 turn, false if player 2 turn.
      this._players = [maxPlayers];
      for(let i = 0; i < maxPlayers; i += 1){
        let id = i + 1;
        this._players[i] = new Player( id,`Player ${id}` , colCheckers[i]);
      }
      this._gameBoard = new GameBoard(maxBoardSize)

      GameState._instance =  this;
    }
    else{
      console.log("same class"); // for testing delete later.
    }

    return GameState._instance;

  }

}

const gameUpdate = () => {
  if(gameState.gameRunning){
    checkWin();
    displayGame();
  }
}

const gameState = new GameState();
// freeze its methods from being changed, prevent new methods or properties from being added.
Object.freeze(gameState);

/////////////////////////////////////////////////
////////// Control



////////////////////////////////////////////////
///////// View
// tip use  "let src = elem.nodeValue;" research
