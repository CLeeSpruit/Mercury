import { Component, OnInit, OnDestroy } from '@angular/core';
import { SprintService } from '@sprint/services/sprint.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'hg-backlog-container',
    templateUrl: 'backlog-container.component.html',
    styleUrls: ['backlog-container.component.scss']
})
export class BacklogContainerComponent implements OnInit, OnDestroy {
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

