import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';
import { SprintService } from '@sprint/services/sprint.service';
import { TfsService } from '@sprint/services/tfs.service';
import { Subscription } from 'rxjs/Subscription';
import { SprintCommService } from '@sprint/services/sprint-comm.service';

@Component({
    selector: 'hg-pbi-card',
    templateUrl: './pbi-card.component.html',
    styleUrls: ['./pbi-card.component.scss']
})
export class PbiCardComponent implements OnInit, OnDestroy {
    // CAUTION: Using childIds will get you ALL children tasks, even if it's not in the sprint
    @Input() id: string;

    pbi: WorkItem;
    keyword: string;

    private pbiSub: Subscription = new Subscription();

    constructor(
        private sprintService: SprintService,
        private sprintCommService: SprintCommService
    ) { }

    ngOnInit() {
        this.pbiSub = this.sprintCommService.getWorkItem(this.id).subscribe(data => {
            this.pbi = data;
            this.keyword = this.parseHeader(data);
        });
    }

    ngOnDestroy() {
        this.pbiSub.unsubscribe();
    }

    selectPbi(wi: WorkItem) {
        this.sprintService.setSelectedPbi(wi);
    }

    // TODO: Consider moving this out to it's own file
    private parseHeader(pbi: WorkItem): string {
        const title = pbi.title.toLowerCase();
        if (title.includes('publish')) {
            return 'publish';
        } else if (title.includes('trac')) {
            return 'trac';
        } else if (title.includes('r & d') || title.includes('r&d')
        ) {
            return 'test';
        } else {
            return 'op';
        }
    }

    trackTasks(index, task: WorkItem) {
        return task.backlogPriority;
    }
}
