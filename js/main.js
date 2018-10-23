//////////////////////////////////////////////////
////////// Author - Troy A. Richardson
//////////

/////////////////////////////////////////////////
/////////// Model

class Pieces {
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
      this._pieces[i] = new Pieces(this._id);
    }
  }
}
const fillArr = ( val, size) =>{
  let tempArr = [];
  for(let i = 0; i < size; i += 1){
    tempArr[i] = val;
  }
  return tempArr;
}

class GameBoard {
  constructor(size){
    this._board = {};
    for(let i = 0; i < size; i += 1)
      Object.defineProperty(this._board, String.fromCharCode(utfA + i),{
      value: fillArr(0,size),
      writable: true
    });
  }
      // const object1 = {};
      //
      // Object.defineProperty(object1, 'property1', {
      //   value: 42,
      //   writable: false
      // });

//   A:[0,0,0];
//   B:[0,0,0];
//   C:[0,0,0];
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
      this._player = [maxPlayers];
      for(let i = 0; i < maxPlayers; i += 1){
        let id = i + 1;
        this._player[i] = new Player( id,`Player ${id}` , colCheckers[i]);
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

console.log('A'.charCodeAt());
console.log('B'.charCodeAt());
console.log('C'.charCodeAt());
console.log('D'.charCodeAt());
console.log(String.fromCharCode(65));
console.log(String.fromCharCode(66));
console.log(String.fromCharCode(67));
console.log(String.fromCharCode(68));
/////////////////////////////////////////////////
////////// Control



////////////////////////////////////////////////
///////// View
// tip use  "let src = elem.nodeValue;" research
