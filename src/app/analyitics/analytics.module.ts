import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsPageComponent } from 'analyitics/analytics-page/analytics-page.component';
import { QueryCreatorComponent } from 'analyitics/query-creator/query-creator.component';
import { CustomQueryService } from 'analyitics/services/custom-query.service';
import { QueryItemComponent } from 'analyitics/query-viewer/query-viewer-item/query-viewer-item.component';
import { AnalyticsCommService } from 'analyitics/services/analytics-comm.service';
import { QueryViewerListComponent } from 'analyitics/query-viewer/query-viewer-list/query-viewer-list.component';
import { QueryViewerContainerComponent } from 'analyitics/query-viewer/query-viewer-container/query-viewer-container.component';
import { SharedModule } from '@shared/shared.module';
import { SprintBoardModule } from '@sprint/sprint-board.module';

@NgModule({
    declarations: [
        AnalyticsPageComponent,
        QueryCreatorComponent,
        QueryViewerListComponent,
        QueryItemComponent,
        QueryViewerContainerComponent
    ],
    imports: [CommonModule, SharedModule, SprintBoardModule],
    providers: [
        CustomQueryService,
        AnalyticsCommService
    ],
    bootstrap: []
})
export class AnalyticsModule { }
