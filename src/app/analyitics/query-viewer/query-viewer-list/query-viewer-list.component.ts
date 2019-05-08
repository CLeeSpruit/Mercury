import { Component, QueryList, ViewChildren, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { QueryItemComponent } from 'analyitics/query-viewer/query-viewer-item/query-viewer-item.component';
import { Subscription, fromEvent, AsyncSubject } from 'rxjs';
import { CustomQueryService } from 'analyitics/services/custom-query.service';
import { TfsService } from '@sprint/services/tfs.service';
import { debounceTime } from 'rxjs/operators';
import { AnalyticsCommService } from 'analyitics/services/analytics-comm.service';
import { WorkItem } from '@sprint/models/work-item';

@Component({
    selector: 'hg-query-viewer-list',
    styleUrls: ['query-viewer-list.component.scss'],
    templateUrl: 'query-viewer-list.component.html'
})
export class QueryViewerListComponent implements AfterViewInit {
    @ViewChildren(QueryItemComponent) queryItemComponents: QueryList<QueryItemComponent>;
    queryItems: Array<string> = new Array<string>();
    scrollSub: Subscription = new Subscription();

    constructor(
        private cdr: ChangeDetectorRef,
        // TODO: Move get work item functionality to shared generic service
        private tfsService: TfsService,
        private commService: AnalyticsCommService
    ) { }

    ngAfterViewInit() {
        this.commService.getQueryResults().subscribe((data: Array<string>) => {
            this.queryItems = data;
            this.cdr.detectChanges();
            this.getScroll();
        });

        const scrollWait = 100;
        const obs = fromEvent(window, 'scroll');
        this.scrollSub = obs.pipe(debounceTime(scrollWait)).subscribe(() => {
            this.getScroll();
        });
    }

    private getScroll() {
        const toBeLoaded: Map<string, AsyncSubject<WorkItem>> = new Map<string, AsyncSubject<WorkItem>>();
        this.queryItemComponents.forEach((comp: QueryItemComponent) => {
            const loaded = comp.checkScroll();
            if (!comp.pbi && loaded) {
                const subject = new AsyncSubject<WorkItem>();
                subject.subscribe((data: WorkItem) => {
                    comp.pbi = data;
                });
                toBeLoaded.set((comp as any).pbiId, subject);
            }
        });

        if (toBeLoaded.size) {
            const ids = Array.from(toBeLoaded.keys());
            this.tfsService.getSpecificWorkItems(ids).subscribe((data: Array<WorkItem>) => {
                data.forEach((pbi) => {
                    const subject = toBeLoaded.get(pbi.id);
                    subject.next(pbi);
                    subject.complete();
                });
            });
        }
    }
}
