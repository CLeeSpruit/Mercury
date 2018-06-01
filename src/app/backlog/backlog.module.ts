import { NgModule } from '@angular/core';
import { BacklogComponent } from './backlog.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { BacklogService } from '@backlog/services/backlog.service';
import { BacklogItemComponent } from '@backlog/backlog-item/backlog-item.component';

@NgModule({
    declarations: [
        BacklogComponent,
        BacklogItemComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    providers: [
        BacklogService
    ]
})
export class BacklogModule { }
