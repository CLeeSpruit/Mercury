import { Component, OnInit, OnDestroy } from '@angular/core';
import { SprintService } from '@sprint/services/sprint.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'hg-query-viewer-container',
    templateUrl: 'query-viewer-container.component.html',
    styleUrls: ['query-viewer-container.component.scss']
})
export class QueryViewerContainerComponent implements OnInit, OnDestroy {
    showPbiSlider = false;

    private pbiSub: Subscription = new Subscription();

    constructor(
        private sprintService: SprintService
    ) { }

    ngOnInit() {
        this.pbiSub = this.sprintService.getSelectedPbi().subscribe(pbi => this.showPbiSlider = !!pbi);
    }

    ngOnDestroy() {
        this.pbiSub.unsubscribe();
    }
}
