import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BoardService } from '../board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() public playerType: string;
  @Input() public gameType: string;
  @Input() public gameId: string;
  @Output() public checkForAiMove: EventEmitter<boolean> = new EventEmitter<boolean>();
  gameResult: string = '';
  humanTurn: boolean = true;
  human: string = 'X';
  ai: string = 'O';
  currentPlayer: string = this.human;
  winnerCells: Array<{ row:number, column:number }> = [];
  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    if (this.gameId && this.gameId !== '') {
      this.boardService.getGameFromId(this.gameId).subscribe((response) => {
        const gameResponse = JSON.parse(JSON.stringify(response));
        const cells = gameResponse.data.game ? gameResponse.data.game.cells : [];
        if (cells && cells.length) {
          for (let i = 0; i < cells.length; i++) {
            this.fillBoard(cells[i]);
          }
          this.calculateGameTurn(cells);
        }
      });
    }
  }

  calculateGameTurn(cells) {
    const playerX = cells.filter(ele => ele.player === 'X');
    const playerO = cells.filter(ele => ele.player === 'O');
    this.humanTurn = playerO.length >= playerX.length;
  }

  fillBoard(cell) {
    this.board[cell.row][cell.column] = cell.player;
    const winner = this.calculateWinner(true);
    this.declareWinner(winner);
  }

  allEquals(cell1:string, cell2:string, cell3:string) {
    return cell1 === cell2 && cell2 === cell3 && cell1 !== '';
  }

  calculateWinner(fillCell:boolean) {
    let winner:string = '';

    //check horizontal
    for (let i = 0; i < 3; i++) {
      if (this.allEquals(this.board[i][0], this.board[i][1], this.board[i][2])) {
        winner = this.board[i][0];
        if (fillCell) {
          this.winnerCells = [{
            row: i,
            column: 0,
          }, {
            row: i,
            column: 1,
          }, {
            row: i,
            column: 2,
          }];
        }
      }
    }

    // check vertical

    for (let i = 0; i < 3; i++) {
      if (this.allEquals(this.board[0][i], this.board[1][i], this.board[2][i])) {
        winner = this.board[0][i];
        if (fillCell) {
          this.winnerCells = [{
            row: 0,
            column: i,
          }, {
            row: 1,
            column: i,
          }, {
            row: 2,
            column: i,
          }];
        }
      }
    }

    // check diagonal

    if (this.allEquals(this.board[0][0], this.board[1][1], this.board[2][2])) {
      winner = this.board[0][0];
      if (fillCell) {
        this.winnerCells = [{
          row: 0,
          column: 0,
        }, {
          row: 1,
          column: 1,
        }, {
          row: 2,
          column: 2,
        }];
      }
    }

    if (this.allEquals(this.board[0][2], this.board[1][1], this.board[2][0])) {
      winner = this.board[0][2];
      if (fillCell) {
        this.winnerCells = [{
          row: 0,
          column: 2,
        }, {
          row: 1,
          column: 1,
        }, {
          row: 2,
          column: 0,
        }];
      }
    }

    // check empty cells
    let emptyCellCount:number  = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === '') {
          emptyCellCount++;
        }
      }
    }

    if (winner === '' && emptyCellCount === 0) {
      return 'tie';
    } else {
      return winner;
    }

  }

  isWinnerCell(rowIndex:number, columnIndex:number) {
    const cellIndex = this.winnerCells.findIndex((ele) => ele.row === rowIndex && ele.column === columnIndex);
    return cellIndex !== -1;
  }

  declareWinner(winner:string) {
    if (winner === 'tie') {
      this.gameResult = 'Draw';
      return;
    }
    if (winner !== '') {
      this.gameResult = `Winner is ${winner}!`;
      return;
    }
  }

  set(rowIndex:number, columnIndex:number) {
    if (this.board[rowIndex][columnIndex] !== '') return;
    if (this.playerType === 'single') {
      this.board[rowIndex][columnIndex] = 'X';
      this.boardService.addMove(this.gameId, 'X', rowIndex, columnIndex).subscribe((addMoveResponse) => {});    
      this.humanTurn = !this.humanTurn;
      const winner = this.calculateWinner(true);
      this.declareWinner(winner);
      this.checkForAiMove.emit(true);
      setTimeout(() => {
        this.findMoveForAI();
        this.checkForAiMove.emit(true);  
      }, 100);
    } else {
      const player = this.humanTurn ? 'X' : 'O';
      this.board[rowIndex][columnIndex] = player
      this.boardService.addMove(this.gameId, player, rowIndex, columnIndex).subscribe((addMoveResponse) => {});    
      this.humanTurn = !this.humanTurn;
      const winner = this.calculateWinner(true);
      this.declareWinner(winner);
    }
  }

  restartGame(): void {
    this.boardService.resetGame(this.gameId).subscribe((Response) => {
      this.humanTurn = true;
      this.winnerCells = [];
      this.gameResult = '';
      this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];
    });
  }

  scores = {
    X: -10,
    O: 10,
    tie: 0
  };

  minimax(board:string[][], depth:number, isMaximizing:boolean) {
    let result = this.calculateWinner(false);
    if (result !== '') {
      return this.scores[result];
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = this.ai;
            let score = this.minimax(board, depth + 1, false);
            board[i][j] = '';
            bestScore = score > bestScore ? score : bestScore;
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = this.human;
            let score = this.minimax(board, depth + 1, true);
            board[i][j] = '';
            bestScore = score < bestScore ? score : bestScore;
          }
        }
      }
      return bestScore;
    }
  }

  findMoveForAI() {
    // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (this.board[i][j] == '') {
        this.board[i][j] = this.ai;
        let score = this.minimax(this.board, 0, false);
        this.board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  if (move) {
    this.board[move.i][move.j] = this.ai;        
    this.boardService.addMove(this.gameId, 'O', move.i, move.j).subscribe((addMoveResponse) => {});
  }
  const winner = this.calculateWinner(true);
  this.declareWinner(winner);
  this.currentPlayer = this.human;
  }
}
