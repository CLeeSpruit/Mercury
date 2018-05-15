import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutesModule } from './app.routes';
import { EnvironmentsModule } from './environments/environments.module';
import { AuthorizationModule } from './authorization/authorization.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './widgets/calendar/calendar.component';
import { TodoComponent } from './widgets/todo/todo.component';
import { PbiListComponent } from './widgets/pbi-list/pbi-list.component';
import { PbiCardComponent } from './widgets/pbi-card/pbi-card.component';
import { PbiTaskComponent } from './widgets/pbi-task/pbi-task.component';

import { TfsService } from './services/tfs.service';
import { SprintService } from './services/sprint.service';
import { WorkItemMapper } from './shared/work-item-mapper';
import { DynamicComponentService } from './services/dynamic-component.service';

import { SprintComponent } from './sprint/sprint.component';
import { PbiColumnComponent } from './widgets/pbi-column/pbi-column.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CalendarComponent,
    TodoComponent,
    PbiListComponent,
    SprintComponent,
    PbiCardComponent,
    PbiColumnComponent,
    PbiTaskComponent
    ,NavigationComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    AppRoutesModule,
    EnvironmentsModule,
    AuthorizationModule
  ],
  providers: [
    TfsService,
    SprintService,
    WorkItemMapper,
    DynamicComponentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
