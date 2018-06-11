import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutesModule } from './app.routes';
import { EnvironmentsModule } from '@environments/environments.module';
import { AuthorizationModule } from '@auth/authorization.module';
import { BacklogModule } from './backlog/backlog.module';
import { SprintBoardModule } from '@sprint/sprint-board.module';
import { SharedModule } from '@shared/shared.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PbiContainerComponent } from 'sprint-board/pbi-container/pbi-container.component';
import { ConfigModule } from 'config/config.module';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    AppRoutesModule,
    AuthorizationModule,
    BacklogModule,
    EnvironmentsModule,
    SharedModule,
    SprintBoardModule,
    ConfigModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
