import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';
import { SprintCommService } from '@sprint/services/sprint-comm.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'hg-pbi-column',
    templateUrl: './pbi-column.component.html',
    styleUrls: ['./pbi-column.component.scss']
})
export class PbiColumnComponent implements OnInit, OnDestroy {
    @Input() list: string; // Corresponding TaskStatus title
    @Input() label: string; // Title to display on page
    ids: Array<string> = new Array<string>();

    private columnSub: Subscription = new Subscription();

    constructor(
        private sprintCommSerivce: SprintCommService
    ) { }

    ngOnInit() {
        this.columnSub = this.sprintCommSerivce.getColumn(this.list).subscribe(data => {
            // TODO: Move this to the service?
            this.ids = data
                .sort((a: WorkItem, b: WorkItem) => {
                    return a.backlogPriority - b.backlogPriority;
                })
                .map(wi => wi.id);
        });
    }

    ngOnDestroy() {
        this.columnSub.unsubscribe();
    }
}
