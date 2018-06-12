import { Component, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { TfsEnvironmentService } from '@environments/services/tfs-environment.service';
import { SprintService } from '@sprint/services/sprint.service';
import { ConfigService } from 'config/services/config.service';
import { TfsService } from '@sprint/services/tfs.service';
import { BacklogService } from '@backlog/services/backlog.service';
import { SprintQueryService } from '@sprint/services/sprint-query.service';

@Component({
    selector: 'hg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    @ViewChild('insertPoint', { read: ViewContainerRef}) dynamicInsert: ViewContainerRef;

    constructor(
        private dynamicComponentService: DynamicComponentService,
        private configService: ConfigService,
        private environmentService: TfsEnvironmentService,
        private tfsService: TfsService,
        private backlogService: BacklogService,
        private sprintQueryService: SprintQueryService
    ) {
        configService.init();
        tfsService.init();
        environmentService.init();
        backlogService.init();
        sprintQueryService.init();
    }

    ngAfterViewInit() {
        this.dynamicComponentService.setRootContainer(this.dynamicInsert);
    }
}
