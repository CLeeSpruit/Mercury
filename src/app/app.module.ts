import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './widgets/calendar/calendar.component';
import { TodoComponent } from './widgets/todo/todo.component';
import { PbiListComponent } from './widgets/pbi-list/pbi-list.component';
import { PbiCardComponent } from './widgets/pbi-card/pbi-card.component';

import { TfsService } from './services/tfs.service';
import { SprintComponent } from './sprint/sprint.component';
import { PbiColumnComponent } from './widgets/pbi-column/pbi-column.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CalendarComponent,
    TodoComponent,
    PbiListComponent,
    SprintComponent,
    PbiCardComponent,
    PbiColumnComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [TfsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
