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
               && id != this._board[checkId[0]][checkId[1]].checkerId[0]) {
                 let checkId2 = this._board[checkId[0]][checkId[1]].topSpots[i]
                 if(checkId2 != 'none') {
                   if(this._board[checkId2[0]][checkId2[1]].isEmpty) {
                     tempArr.push([100,100]);
                     tempArr[tempArr.length-1][0] = checkId2;
                     tempArr[tempArr.length-1][1] = checkId;
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
               && id != this._board[checkId[0]][checkId[1]].checkerId[0]) {
                 let checkId2 = this._board[checkId[0]][checkId[1]].bottomSpots[i]
                 if(checkId2 != 'none') {
                   if(this._board[checkId2[0]][checkId2[1]].isEmpty) {
                     tempArr.push([100,100])
                     tempArr[tempArr.length-1][0] = checkId2;
                     tempArr[tempArr.length-1][1] = checkId;
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
      this._fromPos = "";
      this._toPos = "";
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


  updatePlayerPiece(playerIndex, checkerId, direction, captured = false ,king = false) {
    debugger;
    let length = this._players[playerIndex]._pieces.length;
    let pieces = this._players[playerIndex]._pieces;
    for(let i = 0; i < length; i += 1) {
      if(pieces[i]._location == checkerId[0])
      {
        this._players[playerIndex]._pieces[i]._location = checkerId[1];
        this._players[playerIndex]._pieces[i]._direction = direction;
        this._players[playerIndex]._pieces[i]._captured = captured;
        this._players[playerIndex]._pieces[i]._king = king;
        break;
      }
    }

  }
  // Spot Info
  // return: Array
  //        = [ playerId, color]
 spotInfo(Id) {
   let infoArr = [];
   let tempSpot = this._gameBoard.getSpotAt(Id);
   try {
     infoArr[0] = tempSpot.checkerId[0];
     infoArr[1] = this._players[ tempSpot.checkerId[0] -1]._color;
     if(tempSpot.checkerId[1] > -1) {
       infoArr[2] = this._players[tempSpot.checkerId[0] -1]._pieces[tempSpot.checkerId[1]];
     }
     return infoArr;
   }
   catch {
     return false;
   }
 };

  spotAt(Id){
    return this._gameBoard.getSpotAt(Id);
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
//Object.freeze(gameState);


////////////////////////////////////////////////
///////// View
class GameDOM {
  constructor() {
    // if there is no instance of class make one
    if(!GameDOM._instance) {
      ///
      this._body = document.body;

      GameDOM._instance =  this;
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
    // input state
    this._States = ['State_1_Selection', 'State_2_Selection'];
    this._inputState = 0;
    this._spotsSel = [];
    this._possbSel = [];
    this._toRemove = [];
    this._jumpMove= true; // jump = true move = false
    this._addListener = true;
    // init game State board
    gameState._gameBoard.setBoard(gameState._players[0]._pieces, gameState._players[1]._pieces);

  };

  get inputState() {
    return this._States[this._inputState];
  }
  transitionState() {
    this._inputState++;
    if(this._inputState >= this._States.length) {
      this._inputState = 0;
    }
  }
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

  addScore() {
    if(gameState._p1Turn){
      gameState._players[0]._score += 1;
      console.log('player 1 scored a point');

    }
    else {
      gameState._players[1]._score += 1;
      console.log('player 2 scored a point');

    }
  }

  checkWinner(){
    let player = "";
    if(gameState._players[0]._score >= maxPieces)
    {
      player = gameState._players[0]._name;
      gameState._winner = true;
    }
    else if(gameState._players[1]._score >= maxPieces){
      player = gameState._players[1]._name;
      gameState._winner = true;
    }
    else {
      return false;
    }

    return `${player} is the winner`;
  }

  switchTurns() {
    gameState._p1Turn = !gameState._p1Turn;
    if(gameState._p1Turn){
      console.log('player 1 turn');
    }
    else {
      console.log('player 2 turn');
    }
  }

  set boardInner(value) {
    this._board.innerHTML = value;
  }
  set boardAppend(value) {
    this._board.appendChild(value);
  }
  set addSelection(value) {
    let checker = this.domGetGet(value);
    checker.setAttribute('class', checker.getAttribute('class')
    + ' highlight');
    this._spotsSel.push(value);
  }

  set addPossible(value) {
    let checker = this.domGetGet(value);
    checker.setAttribute('class', checker.getAttribute('class')
    + ' possible');
    this._possbSel.push(value);
  }

  set addRemove(value) {
    this._toRemove.push(value);
  }

  get getSelectionList() {
    return this._spotsSel;
  }

  get getPossibleList() {
    return this._possbSel;
  }

  get getRemoveList() {
    return this._toRemove;
  }

  domGetCheckerAt(value) {
    let checkers = document.querySelectorAll('.checker');
    for(let i = 0 ; i < checkers.length; i += 1){
      if(checkers[i].getAttribute('value') == value) {
        return checkers[i];
      }
    }
    return false;
  }
  domGetSpotAt(value) {
    let spots = document.querySelectorAll('.spot');
    for(let i = 0 ; i < spots.length; i += 1){
      if(spots[i].getAttribute('value') == value) {
        return spots[i];
      }
    }
    return false;
  }
  domGetGet(value) {
    let data = this.domGetCheckerAt(value);
    if(data){
      return data;
    }
    else{
      data = this.domGetSpotAt(value);
      if(data){
        return data;
      }
      return false;
    }
  }

  clearSelection() {
    let spots = document.querySelectorAll('.highlight');
    try {
      for(let i = 0; i < spots.length; i += 1) {
        spots[i].setAttribute('class',
                 spots[i].getAttribute('class').replace(' highlight','') );
      }
      this._spotsSel = [];
    }
    catch
    {
      console.log("error in clearSel")
    }
  }

  clearRemove() {
    this._toRemove = [];

  }

  clearPossible() {
    let spots = document.querySelectorAll('.possible');
    try {
      for(let i = 0; i < spots.length; i += 1) {
        spots[i].setAttribute('class',
                 spots[i].getAttribute('class').replace(' possible','') );
      }
      this._possbSel = [];
    }
    catch
    {
      console.log("error in clearPossb")
    }
  }

  clearAllList(){
    this.clearSelection();
    this.clearPossible();
    this.clearRemove();
  }


  // to  remove at
  // return index if in removble valid Array
  //        false if not in reamovble Array
  RemovableIndex(value) {

      for(let i = 0 ; i < this._possbSel.length; i += 1){
        if(value == this._possbSel[i]) {
          return i;
        }
      }
      return false;
  }

  // is Possible
  // return true if in possible move Array
  //        false if not in possible move Array
  isPossible(value) {

      for(let i = 0 ; i < this._possbSel.length; i += 1){
        if(value == this._possbSel[i]) {
          return true;
        }
      }
      return false;
  }

  displayGameState() {
    let spots = document.querySelectorAll('.spot');
    for(let i = 0 ; i < spots.length; i += 1) {
      let spotId = spots[i].getAttribute('value');
      let sInfo = gameState.spotInfo(spotId);// = [ playerId, color]
      if(sInfo)
      {
        let tempSpotDiv = document.createElement('div');
        tempSpotDiv.setAttribute('class',sInfo[1] + " checker");
        tempSpotDiv.setAttribute('value',spotId);
        spots[i].innerHTML = '';
        spots[i].appendChild( tempSpotDiv);
      }

    }

    let score1 = document.querySelector('#P1Num');
    let score2 = document.querySelector('#P2Num');
    score1.innerHTML = gameState._players[0]._score;
    score2.innerHTML = gameState._players[1]._score;

    let play1 = document.querySelector('#P1');
    let play2 = document.querySelector('#P2');
    play1.innerHTML = gameState._players[0]._name;
    play2.innerHTML = gameState._players[1]._name;
    let message = this.checkWinner();
    if(message) {
      alert(message);
    }
  }
  // # Goal 2: 2nd Selection
  // - player can select:
  // -    1) possible jumps/moves.
  // -    2) own/same checker piece.
  // -  - if valid jump
  // -     * player's checker move to new spot other player checker is removed from board.
  // -     * update to player's pieces, king if needed
  // -     * update to other player's pieces, remove it from play
  // -     * update to player score
  // -     * clear all 3 select lists
  // -     * switch player turn
  // -     * update display
  // -     * transition to 1st selection phase.
  // -  - else if valid moved
  // -     * player's checker move to new spot
  // -     * update to player's pieces, king if needed
  // -     * clear all 3 select lists
  // -     * switch player turn
  // -     * update display
  // -     * transition to 1st selection phase.
  // -  - else if own checker piece.
  // -     * clear all 3 select lists
  // -     * force call to 1st selection phase.
  // -  - else if same checker piece.
  // -     * clear all 3 select lists
  // -     * update display
  // -     * transition to 1st selection phase.
  // -   - else invalid do nothing to selection.
  get currentPlayerIndex() {
    return gameState._p1Turn ? 0 : 1;
  }

  get otherPlayerIndex() {
    return gameState._p1Turn ? 1 : 0;
  }

  jump() {
    let toRemove = this.getRemoveList[ this.RemovableIndex(this.getSelectionList[1]) ];
    let playerIndex = this.currentPlayerIndex;
    let otherPlayerIndex = this.otherPlayerIndex;
    let checkerInfo1 = gameState.spotInfo(this.getSelectionList[0]);
    let checkerInfo2 = gameState.spotInfo(toRemove);
    let reA = /A/gi;
    let reH = /H/gi;
    let spotInfo1 = this.domGetSpotAt(this.getSelectionList[1]);
    let spotId = spotInfo1.getAttribute('value');
    let foundA = spotId.match(reA);;
    let foundH = spotId.match(reH);;

    debugger;
    if(gameState._gameBoard.jumpTo(this.getSelectionList[0],this.getSelectionList[1],toRemove)) {
      // update move
      if(foundA != null || foundH != null ) {
        gameState.updatePlayerPiece(playerIndex,[this.getSelectionList[0],this.getSelectionList[1]],moveBoth,false,true);
      }
      else {
        gameState.updatePlayerPiece(playerIndex,[this.getSelectionList[0],this.getSelectionList[1]],checkerInfo1[2]._direction,false,checkerInfo1[2]._king);
      }
      // remove piece
      gameState.updatePlayerPiece(otherPlayerIndex,[toRemove,toRemove],checkerInfo2[2]._direction,true,checkerInfo2[2]._king);
      this.addScore();
    }
  }

  move() {
    let playerIndex = this.currentPlayerIndex;
    let checkerInfo1 = gameState.spotInfo(this.getSelectionList[0]);
    let reA = /A/gi;
    let reH = /H/gi;
    let spotInfo1 = this.domGetSpotAt(this.getSelectionList[1]);
    let spotId = spotInfo1.getAttribute('value');
    let foundA = spotId.match(reA);;
    let foundH = spotId.match(reH);;

    gameState._gameBoard.moveTo(this.getSelectionList[0],this.getSelectionList[1]);

    debugger;
    if(foundA != null || foundH != null) {
      gameState.updatePlayerPiece(playerIndex,[this.getSelectionList[0],this.getSelectionList[1]],moveBoth,false,true);
    }
    else {
      gameState.updatePlayerPiece(playerIndex,[this.getSelectionList[0],this.getSelectionList[1]],checkerInfo1[2]._direction,false,checkerInfo1[2]._king);
    }
    this._jumpMove = true;
  }

  processInput_2 () {
    console.log('in case 2');

    if(this._jumpMove) {
      console.log('jump to a new spot');
      this.jump();

    }
    else {
      console.log('move to a new spot');
      this.move();
    }

    this.clearAllList();
    this.switchTurns();
    this.createBoard();
    this.transitionState();
    }

  processInput_1 () {
    // if empty
    if(!this.getPossibleList.length) {

      let spot = gameState._gameBoard.getSpotAt(this.getSelectionList[0]);
      let checker;
      checker = gameState._players[spot.checkerId[0] - 1]._pieces[spot.checkerId[1]];
      let tmpArr = [];
      tmpArr =  gameState._gameBoard.possibleJumps(checker._id,checker._direction,this.getSelectionList[0]);
      // if empty
      if(!tmpArr.length) {
        this._jumpMove = false;
        tmpArr = gameState._gameBoard.possibleMoves(checker._id,checker._direction,this.getSelectionList[0]);
        for(let i = 0; i < tmpArr.length; i += 1) {

          this.addPossible = tmpArr[i];
        }
      }
      else {
        for(let i = 0; i < tmpArr.length; i += 1) {

          this.addPossible = tmpArr[i][0];
          this.addRemove = tmpArr[i][1];
        }
      }
    }
  }


  myCheckerPiece(sInfo, spotClass){
    // if a piece is there plus the player is the owner
    let found;
    let re = gameState._p1Turn ? /black/gi : /red/gi;
    if(gameState._p1Turn && (sInfo && (sInfo[0] == 1))) {
        found = spotClass.match(re);
        if( (found != null) ) {
          return true;
        }
    }
    else if( sInfo && (sInfo[0] == 2 )) {
      found = spotClass.match(re);
      if( (found != null) ) {
        return true;
      }
    }
    return false;
  }

  validSpot(){
    if(found != null) {

    }

  }
  //
  // ## Last Input Refinement Goals.
  // # Goal 1: 1st Selection
  // - player should only be able to select there own checker piece.
  // - process selection.
  // -   - if valid highlight the Selection.
  // -       * process possible moves/jumps.
  // -       * highlight possible moves.
  // -       * update display
  // -       * transition to 2nd selection phase.
  // -   - else invalid do nothing to selection.
  input(evt) {
    if(!GameState._winner) {
      let spotId = evt.target.getAttribute('value');
      let spotClass = evt.target.getAttribute('class');
      let sInfo = gameState.spotInfo(spotId); // = [ playerId, color]
      let re = /spot/gi;
      let found = spotClass.match(re);
      debugger;
      switch (gameDOM.inputState) {
        case 'State_1_Selection':
            if(gameDOM.myCheckerPiece(sInfo, spotClass)){
              gameDOM.addSelection = spotId;
              console.log(evt.target);
              gameDOM.processInput_1();
              gameDOM.transitionState();
            }
          break;
          case 'State_2_Selection':
          // own/same checker piece.
          if(gameDOM.myCheckerPiece(sInfo, spotClass)){
            // same checker piece.
            // -     * clear all 3 select lists
            // -     * update display
            // -     * transition to 1st selection phase.
            if(gameDOM.getSelectionList[0] == spotId) {
              gameDOM.clearAllList();
              gameDOM.transitionState();
            }
            // -  - else if own checker piece.
            // -     * clear all 3 select lists
            // -     * force call to 1st selection phase.
            else {
              gameDOM.clearAllList();
              gameDOM.transitionState();
              gameDOM.input(evt);

            }
          }
          else if (gameDOM.getPossibleList.length < 1) {
            break;
          }
          // if its a spot
          else if(found != null){
            if( gameDOM.isPossible(spotId) ) {
              gameDOM.addSelection = spotId;
              gameDOM.processInput_2();
            }
          }
          break;
      }
    } else {
      alert('There is a winner please refresh page the start again.');
    }
  }

  createBoard() {
    this.boardInner = '';
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
      }
      this.boardAppend = tmpRow;
    }
    if(this._addListener) {
      this._addListener = false;
      this._board.addEventListener('click', this.input);
    }
    this.displayGameState();
  }



// end of class
}

// our game DOM
const gameDOM = new GameDOM();



const linkDOM = () => {
  gameDOM.loadElements();
  gameDOM.createBoard();
}

// if still loading
if(document.readyState == "loading") {
   document.addEventListener("DOMContentLoaded", linkDOM);
}
else { // else it's already loaded
  linkDOM();
}
