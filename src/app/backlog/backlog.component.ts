import { Component, OnInit, HostListener, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';
import { BacklogService } from '@backlog/services/backlog.service';
import { SprintService } from '@sprint/services/sprint.service';
import { TfsService } from '@sprint/services/tfs.service';
import { BacklogItemComponent } from '@backlog/backlog-item/backlog-item.component';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

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
        private backlogService: BacklogService,

        // TODO: Move get work item functionality to shared generic service
        private tfsService: TfsService
    ) { }

    ngOnInit() {
        // This closes itself and doesn't need an unsubscribe
        this.backlogService.getBacklog().subscribe((data: Array<string>) => {
            this.backlogItems = data;
            // TODO: consider moving this function to the services

        });
    }

    ngAfterViewInit() {
        const scrollWait = 500;
        const obs = Observable.fromEvent(window, 'scroll');
        this.scrollSub = obs.debounceTime(scrollWait).subscribe(() => {
            this.getScroll();
        });
        this.getScroll();
    }

    private getScroll() {
        const toBeLoaded: Map<number, AsyncSubject<WorkItem>> = new Map<number, AsyncSubject<WorkItem>>();
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
