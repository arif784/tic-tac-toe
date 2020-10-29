import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { SingleComponent } from './single/single.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { HomeComponent } from './home/home.component';
import { BoardService } from './board.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SingleComponent,
    MultiplayerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [BoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
