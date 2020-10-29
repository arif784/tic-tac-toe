import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SingleComponent } from './single/single.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component'

const routes: Routes = [{
  path: '', component: HomeComponent
}, {
  path: 'single', component: SingleComponent
}, {
  path: 'multiplayer', component: MultiplayerComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
