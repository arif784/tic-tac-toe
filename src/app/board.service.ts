import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  apiUrl: string = 'http://localhost:3000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  getGameIds(gameType: string) {
    return this.http.get(`
      /graphql?query={
        gameIds(gameType: "${gameType}") {
          id
        }
      }
    `);
  }

  getGameFromId(id: string) {
    return this.http.get(`
      /graphql?query={
        game(id: "${id}") {
          id
          gameType
          cells {
            player
            row
            column
          }
        }
      }
    `);
  }

  createGame(gameType: string) {
    return this.http.post(`
      /graphql?query=mutation {
        addGame(gameType: "${gameType}") {
          id
        }
      }
    `, {});
  }

  resetGame(id: string) {
    return this.http.post(`
      /graphql?query=mutation {
        resetGame(id: "${id}") {
          id
        }
      }
    `, {});
  }

  addMove(id: string, player: string, row: number, column: number) {
    return this.http.post(`
      /graphql?query=mutation {
        addMove(id: "${id}", player: "${player}", row: ${row}, column: ${column}) {
          player
        }
      }
    `, {});
  }

  // Handle Errors 
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
