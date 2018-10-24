//////////////////////////////////////////////////
////////// Author - Troy A. Richardson
//////////

/////////////////////////////////////////////////
/////////// Model

class Piece {
  constructor(id){
    this._id =         id;     // player id may not be needed
    this._king =       false;  // king has different move logic
    this._location =   String; //'A0' // location on board.
    this._direction =  id;     // are your pieces moving 'up' = 1, 'down' = 2, or 'both' = 3 on the board.
    this._captured =   false;  // if captured that pieces is removed from the board.
  }
}
const colCheckers = ['black','red'];
const maxPlayers = 2;     // per game
const maxPieces = 12;     // per player.
const maxBoardSize = 8;   // 8x8 = 64
const utfA = 65;          // UTF-16 'A'
const moveUp = 1;
const moveDown = 2;
const moveBoth = 3;

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
  checkerId: [-1,-1],
  isEmpty: true,
  topSpots: [],
  bottomSpots: []
};


class GameBoard {
  constructor(BoardSize){
    // if there is no instance of class make one
    if(!GameBoard._instance)
    {
      this._board = [];
      for(let i = 0; i < BoardSize; i += 1){
        let key = String.fromCharCode(utfA + i);
        //let tempObj = Object.create(spot);
        Object.defineProperty(this._board, key,
          {
        value: this.fillBoardSpots(i ,BoardSize),
        writable: true
        });
      }
      GameBoard._instance =  this;
      Object.freeze(GameBoard._instance);
    }
    return GameBoard._instance;
  }

  fillBoardSpots( index, BoardSize) {
    let tempArr = [];
    for(let j = 0; j < BoardSize; j += 1) {
      let tempObj = Object.create(spot);
      tempObj.id = String.fromCharCode(utfA + index) + j;
      tempObj.checkerId =     [-1,-1],
      tempObj.isEmpty =       true,
      tempObj.topSpots =      ['none','none'],
      tempObj.bottomSpots =   ['none','none']
      tempArr[j] = tempObj;
    }
    return tempArr;
  }

  // fill out the jumps for each spot.
  createJumps() {
    for(let offset = 0; offset < maxBoardSize; offset += 1) {
      for(let j = 0; j < maxBoardSize; j += 1) {
        let key = String.fromCharCode(utfA + offset);
        let topCheck = (utfA + (offset - 1));
        let bottomCheck = (utfA + (offset + 1));
        let leftCheck = j-1;
        let rightCheck = j+1;

        if(topCheck >= utfA) { // checking for the top of the board boundary
          let topKey = String.fromCharCode(topCheck);
          // left board boundary
          if(leftCheck > -1){
            this._board[key][j].topSpots[0] = this._board[topKey][leftCheck].id;
          }
          // right board boundary
          if(rightCheck < maxBoardSize){
            this._board[key][j].topSpots[1] = this._board[topKey][rightCheck].id;
          }
        }
        if(bottomCheck < utfA + maxBoardSize) { // checking for the bottom of the board boundary
          let bottomKey = String.fromCharCode(bottomCheck);
          // left board boundary
          if(leftCheck > -1){
            this._board[key][j].bottomSpots[0] = this._board[bottomKey][leftCheck].id;
          }
          // right board boundary
          if(rightCheck < maxBoardSize){
            this._board[key][j].bottomSpots[1] = this._board[bottomKey][rightCheck].id;
          }
        }
      }
    }
  }

  setBoard(Player1Arr, Player2Arr) {
      let pieceCounter = 0;
      for(let offset = 0; offset < 3; offset += 1) {
        for(let j = 0; j < maxBoardSize; j += 1) {
          ///////////////////////////
          // set Player 2 side a - c
          let keyABC = String.fromCharCode(utfA + offset);

          // place in row1  and row3 if odds.
          if( (j + 1) % 2 != 0 && (offset + 1) % 2 != 0)  {
            this._board[keyABC][j].checkerId =     [Player2Arr[pieceCounter]._id,pieceCounter];
            this._board[keyABC][j].isEmpty =       false;
            Player2Arr[pieceCounter]._location =   keyABC + j; //'A0' // location on board.
            pieceCounter++;
          }

          if( (j + 1) % 2 == 0 && (offset + 1) % 2 == 0)  {
            // place in row2 if evens.
            this._board[keyABC][j].checkerId =      [Player2Arr[pieceCounter]._id,pieceCounter];
            this._board[keyABC][j].isEmpty =        false;
            Player2Arr[pieceCounter]._location =    keyABC + j; //'A0' // location on board.
            pieceCounter++;
          }
        }
      }
      pieceCounter = 0;
      for(let offset = 5; offset < 8; offset += 1) {
        for(let j = 0; j < maxBoardSize; j += 1) {
          ///////////////////////////
          // set Player 1 side f - h
          let keyFGH = String.fromCharCode(utfA + offset);

          // place in row7 if odds.
          if( (j + 1) % 2 != 0 && (offset + 1) % 2 != 0)  {
            this._board[keyFGH][j].checkerId =      [Player1Arr[pieceCounter]._id,pieceCounter];
            this._board[keyFGH][j].isEmpty =        false;
            Player1Arr[pieceCounter]._location =    keyFGH + j;
            pieceCounter++;
          }
          // place in row6 & row8 if evens.
          if( (j + 1) % 2 == 0 && (offset + 1) % 2 == 0)  {
            this._board[keyFGH][j].checkerId =     [Player1Arr[pieceCounter]._id,pieceCounter];
            this._board[keyFGH][j].isEmpty =       false;
            Player1Arr[pieceCounter]._location =   keyFGH + j;
            pieceCounter++;
          }
      }
    }
}


  resetBoardSpots(Player1Arr, Player2Arr) {
    for(let i = 0; i < maxBoardSize; i += 1){
      for(let j = 0; j < maxBoardSize; j += 1) {
        let key = String.fromCharCode(utfA + i);
        this._board[key][j].checkerId =     [-1,-1];
        this._board[key][j].isEmpty =       true;
      }
    }
    this.setBoard(Player1Arr,Player2Arr);
  }

  // send back a array of possible move or jumps from location
  actionPossible(id, fromLo) {}
  // send back array of move
  jumpTo(id, fromLoc, toLoc) {}

  // valid Selection
  // return: true if player id  and checker id on the board match
  //         false if mismatch
  validSelection(playerId, checkerId) {
    return playerId == checkerId[0] ? true : false;
  }

  // valid Move
  // return: true if player move is valid
  //         false if invalid move
  validMove(direction,fromLoc, toLoc) {
    let size = this._board[fromLoc[0]][fromLoc[1]].topSpots.length;
    // spot id
    let id = this._board[toLoc[0]][toLoc[1]].id
    if(this._board[toLoc[0]][toLoc[1]].isEmpty){
      if(direction == moveUp) {
        for(let i = 0; i < size; i += 1){
          console.log(id);
          console.log(this._board[fromLoc[0]][fromLoc[1]].topSpots[i])
          if(id == this._board[fromLoc[0]][fromLoc[1]].topSpots[i]) {
            return true;
          }
        }
      }
      else if (direction == moveDown) {
        for(let i = 0; i < size; i += 1){
          if(id == this._board[fromLoc[0]][fromLoc[1]].bottomSpots[i]) {
            return true;
          }

        }
      }
      else {
        for(let i = 0; i < size; i += 1){
          if(id == this._board[fromLoc[0]][fromLoc[1]].topSpots[i]
            || id == this._board[fromLoc[0]][fromLoc[1]].bottomSpots[i]){
              return true;
            }
        }
      }
    }
    return false;
  }

  // move pieces
  // return: true if moved
  //         false if piece wasn't moved
  moveTo(id, direction, fromLoc, toLoc) {
    if(this.validSelection(id,this._board[fromLoc[0]][fromLoc[1]].checkerId)) { // is valid Selection?
      if(this.validMove(direction, fromLoc, toLoc)) {
        this._board[toLoc[0]][toLoc[1]].checkerId = this._board[fromLoc[0]][fromLoc[1]].checkerId;
        this._board[toLoc[0]][toLoc[1]].isEmpty   = false;

        this._board[fromLoc[0]][fromLoc[1]].checkerId = [-1,-1];
        this._board[fromLoc[0]][fromLoc[1]].isEmpty = true;

        return true;
      } else return false;
    }
    else return false;
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
