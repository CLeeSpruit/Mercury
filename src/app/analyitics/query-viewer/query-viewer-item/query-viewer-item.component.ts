import { Component, Input, ElementRef } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';
import { SprintService } from '@sprint/services/sprint.service';
import { TfsService } from '@sprint/services/tfs.service';
import { take } from 'rxjs/operators';
import { QueryColumn } from 'analyitics/models/query-column';

@Component({
    selector: 'hg-query-viewer-item',
    styleUrls: ['query-viewer-item.component.scss'],
    templateUrl: 'query-viewer-item.component.html'
})
export class QueryItemComponent {
    @Input() pbiId: string;
    @Input() columns: Array<QueryColumn> = new Array<QueryColumn>();

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
        this.tfsService.getSpecificWorkItems([this.pbiId]).pipe(take(1)).subscribe((workItems: Array<WorkItem>) => {
            this.pbi = workItems[0];
        });
    }
}
