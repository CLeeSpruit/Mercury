import { NgModule } from '@angular/core';
import { BacklogComponent } from './backlog/backlog.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { BacklogService } from '@backlog/services/backlog.service';
import { BacklogItemComponent } from '@backlog/backlog-item/backlog-item.component';
import { BacklogContainerComponent } from '@backlog/backlog-container/backlog-container.component';
import { SprintBoardModule } from '@sprint/sprint-board.module';

@NgModule({
    declarations: [
        BacklogContainerComponent,
        BacklogComponent,
        BacklogItemComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SprintBoardModule
    ],
    providers: [
        BacklogService
    ]
})
export class BacklogModule { }
