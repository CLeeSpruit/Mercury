import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';

import { PbiComponent } from '@sprint/components/pbi/pbi.component';
import { PbiCardComponent } from '@sprint/components/pbi-card/pbi-card.component';
import { PbiColumnComponent } from '@sprint/components/pbi-column/pbi-column.component';
import { PbiTaskComponent } from '@sprint/components/pbi-task/pbi-task.component';
import { SprintComponent } from '@sprint/components/sprint/sprint.component';
import { SprintService } from '@sprint/services/sprint.service';
import { TfsService } from '@sprint/services/tfs.service';
import { CommonModule } from '@angular/common';
import { WorkItemMapper } from '@sprint/constants/work-item-mapper';
import { SharedModule } from '@shared/shared.module';
import { PbiContainerComponent } from '@sprint/pbi-container/pbi-container.component';
import { SprintQueryService } from '@sprint/services/sprint-query.service';
import { SprintCommService } from '@sprint/services/sprint-comm.service';

@NgModule({
    declarations: [
        PbiComponent,
        PbiCardComponent,
        PbiColumnComponent,
        PbiTaskComponent,
        SprintComponent,
        PbiContainerComponent
    ],
    providers: [
        SprintService,
        TfsService,
        WorkItemMapper,
        SprintQueryService,
        SprintCommService
    ],
    imports: [
        CommonModule,
        SharedModule,
        EditorModule,
        FormsModule
    ],
    exports: [
        PbiComponent
    ]
})
export class SprintBoardModule { }
