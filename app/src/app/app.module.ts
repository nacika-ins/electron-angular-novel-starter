import { NgModule, Renderer2 } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { dataReducer } from '../reducers/data.reducer';
import { DataState } from '../state/data.state';
import { GameComponent } from './game/game.component';
import { StartComponent } from './start/start.component';
import { LoadingComponent } from './loading/loading.component';
import { LoginComponent } from './+login/login.component';
import { SelectDataComponent } from './select-data/select-data.component';
import { ConfigComponent } from './config/config.component';
import { CoverService } from '../services/cover.service';
import { NovelService } from '../services/novel.service';
import { EndingComponent } from './ending/ending.component';
import {DBInfrastructure} from '../infrastructure/db.infrastructure';
import {BookmarkRepository} from '../repositories/bookmark.repository';

@NgModule({
  imports: [
    HttpModule,
    AppRoutingModule,
    CommonModule,
    StoreModule.forRoot({ data: dataReducer })
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LoadingComponent,
    StartComponent,
    GameComponent,
    SelectDataComponent,
    ConfigComponent,
    EndingComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    DataService,
    DataState,
    CoverService,
    NovelService,
    DBInfrastructure,
    BookmarkRepository
  ],
})
export class AppModule { }
