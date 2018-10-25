//////////////////////////////////////////////////
////////// Author - Troy A. Richardson


//////////  Global

const colCheckers = ['black','red'];
const maxPlayers = 2;     // per game
const maxPieces = 12;     // per player.
const maxBoardSize = 8;   // 8x8 = 64
const utfA = 65;          // UTF-16 'A'
const moveUp = 1;
const moveDown = 2;
const moveBoth = 3;       // Kings can move in both directions.

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
};

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
};

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
  };

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
    };


  resetBoardSpots(Player1Arr, Player2Arr) {
    for(let i = 0; i < maxBoardSize; i += 1){
      for(let j = 0; j < maxBoardSize; j += 1) {
        let key = String.fromCharCode(utfA + i);
        this._board[key][j].checkerId =     [-1,-1];
        this._board[key][j].isEmpty =       true;
      }
    }
    this.setBoard(Player1Arr,Player2Arr);
  };

  // send back a array of possible jumps from location
  possibleJumps(id, direction, fromLoc) {
    let size = this._board[fromLoc[0]][fromLoc[1]].topSpots.length;

    let tempArr = [];
      if(direction == moveUp || direction == moveBoth) {
        for(let i = 0; i < size; i += 1){
          // find the top spot id
          let checkId = this._board[fromLoc[0]][fromLoc[1]].topSpots[i]
          if(checkId != 'none') {
            if(!this._board[checkId[0]][checkId[1]].isEmpty
               && id != this._board[checkId[0]][checkId[1]].checkerId) {
                 let checkId2 = this._board[checkId[0]][checkId[1]].topSpots[i]
                 if(checkId2 != 'none') {
                   if(this._board[checkId2[0]][checkId2[1]].isEmpty) {
                     tempArr.push(checkId2);
                   }
                 }
            }
          }
        }
      }
      if (direction == moveDown || direction == moveBoth) {
        for(let i = 0; i < size; i += 1){
          // find the bottom spot id
          let checkId = this._board[fromLoc[0]][fromLoc[1]].bottomSpots[i]
          if(checkId != 'none') {
            if(!this._board[checkId[0]][checkId[1]].isEmpty
               && id != this._board[checkId[0]][checkId[1]].checkerId) {
                 let checkId2 = this._board[checkId[0]][checkId[1]].bottomSpots[i]
                 if(checkId2 != 'none') {
                   if(this._board[checkId2[0]][checkId2[1]].isEmpty) {
                     tempArr.push(checkId2);
                   }
                 }
            }
          }
        }
      }
      return tempArr;
  };


  // send back a array of possible moves from location
  possibleMoves(id, direction, fromLoc) {
    let size = this._board[fromLoc[0]][fromLoc[1]].topSpots.length;

    let tempArr = [];
      if(direction == moveUp || direction == moveBoth) {
        for(let i = 0; i < size; i += 1){
          // find the top spot id
          let checkId = this._board[fromLoc[0]][fromLoc[1]].topSpots[i]
          if(checkId != 'none') {
            if(this._board[checkId[0]][checkId[1]].isEmpty) {
              tempArr.push(checkId);
            }
          }
        }
      }
      if (direction == moveDown || direction == moveBoth) {
        for(let i = 0; i < size; i += 1){
          // find the bottom spot id
          let checkId = this._board[fromLoc[0]][fromLoc[1]].bottomSpots[i]
          if(checkId != 'none') {
            if(this._board[checkId[0]][checkId[1]].isEmpty) {
              tempArr.push(checkId);
            }
          }

        }
      }
      return tempArr;
  };
  // jump checker piece
  // return: true if jump was a success
  //         false if piece wasn't moved
  jumpTo(fromLoc, toLoc, reMove) {
    try {
      this._board[toLoc[0]][toLoc[1]].checkerId = this._board[fromLoc[0]][fromLoc[1]].checkerId;
      this._board[toLoc[0]][toLoc[1]].isEmpty   = false;

      this._board[fromLoc[0]][fromLoc[1]].checkerId = [-1,-1];
      this._board[fromLoc[0]][fromLoc[1]].isEmpty = true;

      this._board[reMove[0]][reMove[1]].checkerId = [-1,-1];
      this._board[reMove[0]][reMove[1]].isEmpty = true;
      return true;
    }
    catch {
      return false;
    }

  };

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
  moveTo(fromLoc, toLoc) {
    try{
        this._board[toLoc[0]][toLoc[1]].checkerId = this._board[fromLoc[0]][fromLoc[1]].checkerId;
        this._board[toLoc[0]][toLoc[1]].isEmpty   = false;

        this._board[fromLoc[0]][fromLoc[1]].checkerId = [-1,-1];
        this._board[fromLoc[0]][fromLoc[1]].isEmpty = true;

        return true;
      }
      catch {
         return false;
       }
  }

  getSpotAt(fromLoc) {
    try {
      return this._board[fromLoc[0]][fromLoc[1]];
    }
    catch {
      return false;
    }

  };

  // end of class
};

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
      this._gameBoard.createJumps();
      GameState._instance =  this;
    }
    else{
      console.log("same class"); // for testing delete later.
    }

    return GameState._instance;

  };

  // Spot Info
  // return: Array
  //        = [ playerId, color]
 spotInfo(Id) {
   debugger;
   let infoArr = [];
   let tempSpot = this._gameBoard.getSpotAt(Id);
   try {
     infoArr[0] = tempSpot.checkerId[0];
     infoArr[1] = this._players[ tempSpot.checkerId[0] -1]._color;
     return infoArr;
   }
   catch {
     return false;
   }
 };
 gameUpdate () {
   if(gameState.gameRunning){
     checkWin();
     displayGame();
    }
  };


};

// our game state
const gameState = new GameState();
// freeze its methods from being changed, prevent new methods or properties from being added.
Object.freeze(gameState);


////////////////////////////////////////////////
///////// View
// tip use  "let src = elem.nodeValue;" research
class GameDOM {
  constructor() {
    // if there is no instance of class make one
    if(!GameDOM._instance) {
      ///
      this._body = document.body;

      GameDOM._instance =  this;
      //Object.freeze(GameDOM._instance);
    }
    return GameDOM._instance;
  };

  loadElements() {
    // basic
    this._body = document.querySelector('body');
    this._title = document.querySelector('#title');
    this._board = document.querySelector('#board');
    // Player Name
    this._P1Score = document.querySelector('#P1Num');
    this._P2Score = document.querySelector('#P2Num');
    // Player score
    this._P1Name = document.querySelector('#P1');
    this._P2Name = document.querySelector('#P2');
    // init game State board
    gameState._gameBoard.setBoard(gameState._players[0]._pieces, gameState._players[1]._pieces);

  };

  set p1Name(value) {
    this._P1Name = value;
  };

  set p2Name(value) {
    this._P2Name = value;
  };

  set p1Score(value) {
    this._P1Score = value;
  };

  set p2Score(value) {
    this._P2Score = value;
  };
  set boardInner(value) {
    this._board.innerHTML = value;
  }
  set boardAppend(value) {
    this._board.appendChild(value);
  }

  displayGame() {

    let spots = document.querySelectorAll('.spot');
    for(let i = 0 ; i < spots.length; i += 1){
      let spotId = spots[i].getAttribute('value');
      let sInfo = gameState.spotInfo(spotId);// = [ playerId, color]
      debugger;
      if(sInfo)
      {
        let tempSpotDiv = document.createElement('div');
        tempSpotDiv.setAttribute('class',sInfo[1]);

        spots[i].innerHTML = '';
        spots[i].appendChild( tempSpotDiv);
        console.log( tempSpotDiv);
      }

    }

  }

  input() {


  }

  createBoard() {
    // legend Row
    let tmpRowL = document.createElement('div');
    tmpRowL.setAttribute('class','Row');
    // create numbers for the Legend
    for(let i = 0; i < maxBoardSize+1; i += 1){
      let tempSpotDiv = document.createElement('div');
      tempSpotDiv.setAttribute('class','L' +' lSpot');

      if( i > 0)
      {
        tempSpotDiv.innerHTML = i-1;
        tempSpotDiv.setAttribute('value', i-1);
      }
      else {
        tempSpotDiv.innerHTML = "";
        tempSpotDiv.setAttribute('value', 'none');
      }
      tmpRowL.appendChild(tempSpotDiv);
    }

    this.boardAppend = tmpRowL;

    // Row Container
    for(let offset = 0; offset < maxBoardSize; offset += 1) {
      let key = String.fromCharCode(utfA + offset);

      let tmpRow = document.createElement('div');
      tmpRow.setAttribute('class','Row');

      let tmpLeg = document.createElement('div');
      tmpLeg.setAttribute('class','L' + ` ${key}`);
      tmpLeg.innerHTML = key;

      tmpRow.appendChild(tmpLeg);

      // row spot
      for(let i = 0; i < maxBoardSize; i += 1){
        let tempSpotDiv = document.createElement('div');
        tempSpotDiv.setAttribute('class', key + ' spot');
        tempSpotDiv.setAttribute('value', key + i);
        //Temp Code
        tempSpotDiv.innerHTML = key + i;
        //////
        tmpRow.appendChild(tempSpotDiv);
        //tempRowA.addEventListener('click', placeMark);
      }
      this.boardAppend = tmpRow;
    }
    this.displayGame();
  }



// end of class
}

// our game DOM
const gameDOM = new GameDOM();



const linkDOM = () => {
  gameDOM.loadElements();
  gameDOM.createBoard();
  // freeze its methods from being changed, prevent new methods or properties from being added.
  Object.freeze(gameDOM);
}

// if still loading
if(document.readyState == "loading") {
   document.addEventListener("DOMContentLoaded", linkDOM);
}
else { // else it's already loaded
  linkDOM();
}


/////////////////////////////////////////////////
////////// Control
