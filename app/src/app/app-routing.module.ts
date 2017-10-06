import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from '../services/logged-in.guard';
import { UserService } from '../services/user';

import { LoginComponent } from './+login/login.component';
import { CryptService } from '../services/crypt.service';
import { LoadingComponent } from './loading/loading.component';
import { StartComponent } from './start/start.component';
import { GameComponent } from './game/game.component';
import { SelectDataComponent } from './select-data/select-data.component';
import { ConfigComponent } from './config/config.component';
import { EndingComponent } from './ending/ending.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'authorized',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'authorized',
    loadChildren: './+authorized/authorized.module#AuthorizedModule',
    canActivate: [LoggedInGuard],
  },
  {
    path: 'loading',
    component: LoadingComponent
  },
  {
    path: 'start',
    component: StartComponent
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: 'select-data',
    component: SelectDataComponent
  },
  {
    path: 'config',
    component: ConfigComponent
  },
  {
    path: 'ending',
    component: EndingComponent
  },
];


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [
    LoggedInGuard,
    UserService,
    CryptService
  ],
  declarations: [],
  exports: [
    RouterModule
  ],
})

export class AppRoutingModule { }
