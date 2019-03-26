import { Component, OnInit, HostListener, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';
import { BacklogService } from '@backlog/services/backlog.service';
import { TfsService } from '@sprint/services/tfs.service';
import { BacklogItemComponent } from '@backlog/backlog-item/backlog-item.component';
import { AsyncSubject, Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
    templateUrl: 'backlog.component.html',
    selector: 'hg-backlog',
    styleUrls: ['backlog.component.scss']
})
export class BacklogComponent implements OnInit, AfterViewInit {
    @ViewChildren(BacklogItemComponent) backlogItemComponents: QueryList<BacklogItemComponent>;
    backlogItems: Array<string> = new Array<string>();
    scrollSub: Subscription = new Subscription();

    constructor(
        private cdr: ChangeDetectorRef,
        private backlogService: BacklogService,

        // TODO: Move get work item functionality to shared generic service
        private tfsService: TfsService
    ) { }

    ngOnInit() {

    }

    ngAfterViewInit() {
        // This closes itself and doesn't need an unsubscribe
        this.backlogService.getBacklog().subscribe((data: Array<string>) => {
            this.backlogItems = data;
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
        this.backlogItemComponents.forEach((comp: BacklogItemComponent) => {
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
