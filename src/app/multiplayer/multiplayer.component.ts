import { Component, OnInit } from '@angular/core';

import { BoardComponent } from '../board/board.component';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css']
})
export class MultiplayerComponent implements OnInit {

  showAiMsg: boolean = false;
  isSelection: boolean = true;
  gameType: string = 'new';
  gameIds: string[] = [];
  showExist: boolean = false;
  isChooseGame: boolean = false;
  gameId: string;
  selectedGameId: string = '';

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.boardService.getGameIds('multi').subscribe((response) => {
      const gameIdResponse = JSON.parse(JSON.stringify(response));
      this.gameIds = gameIdResponse.data.gameIds.map(ele => ele.id);
    });
  }

  checkForMsg(): void {
    this.showAiMsg = !this.showAiMsg;
  }

  markSelection(gameType: string): void {    
    this.gameType = gameType;
    this.isChooseGame = true;
    if (gameType === 'new') {
      this.boardService.createGame('multi').subscribe((response) => {
        const res = JSON.parse(JSON.stringify(response));
        this.selectedGameId = res.data.addGame.id;
        this.isSelection = false;
      });
    } else {
      if (this.gameIds && this.gameIds.length) {
        this.showExist = true;
      }
    }
  }

  enterToTheGame(id: string): void {
    this.selectedGameId = id;
    this.isSelection = false;
  }

}
