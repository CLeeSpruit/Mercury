import { Component, Input, ElementRef } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';
import { SprintService } from '@sprint/services/sprint.service';
import { TfsService } from '@sprint/services/tfs.service';

@Component({
    selector: '[hg-backlog-item]',
    styleUrls: ['backlog-item.component.scss'],
    templateUrl: 'backlog-item.component.html'
})
export class BacklogItemComponent {
    @Input() pbiId: string;

    pbi: WorkItem;
    isLoaded = false;

    constructor(
        // TODO: Move the pbi opener functionality to shared generic service
        private sprintService: SprintService,
        private tfsService: TfsService,
        private el: ElementRef
    ) { }

    openPbi(pbi: WorkItem) {
        this.sprintService.setSelectedPbi(pbi);
    }

    // Scroll
    checkScroll() {
        const scrollTop = window.pageYOffset;
        const scrollBottom = scrollTop + window.innerHeight;
        const componentPosition = this.el.nativeElement.offsetTop;

        this.isLoaded = (scrollTop < componentPosition) && (scrollBottom >= componentPosition);

        return this.isLoaded;
    }

    private load() {
        this.tfsService.getSpecificWorkItems([this.pbiId]).take(1).subscribe((workItems: Array<WorkItem>) => {
            this.pbi = workItems[0];
        });
    }
}
