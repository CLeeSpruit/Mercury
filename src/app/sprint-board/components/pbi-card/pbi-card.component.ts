import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';
import { SprintService } from '@sprint/services/sprint.service';
import { TfsService } from '@sprint/services/tfs.service';

@Component({
    selector: 'hg-pbi-card',
    templateUrl: './pbi-card.component.html',
    styleUrls: ['./pbi-card.component.scss']
})
export class PbiCardComponent implements OnChanges {
    @Input() pbi: WorkItem;
    keyword: string;

    constructor(
        private sprintService: SprintService,
        private tfsService: TfsService
    ) { }

    ngOnChanges() {
        if (this.pbi) {
            this.parseHeader();
        }
    }

    pbiChanged(wi: WorkItem) {
        const foundIndex = this.pbi.children.findIndex(child => child.id === wi.id);
        if (foundIndex !== -1) {
            this.pbi.children[foundIndex] = wi;
        }
        this.sprintService.sendChangedWorkItem(this.pbi);
    }

    newTask(task: WorkItem) {
        this.tfsService.createTask(task, this.pbi).subscribe((data: WorkItem) => {
            if (this.pbi.children) {
                this.pbi.children = new Array(...this.pbi.children, data);
            } else {
                this.pbi.children = [data];
            }

            this.pbiChanged(this.pbi);
        });
    }

    selectPbi(wi: WorkItem) {
        this.sprintService.setSelectedPbi(wi);
    }

    // TODO: Consider moving this out to it's own file
    private parseHeader() {
        const title = this.pbi.title;
        if (title.toLowerCase().includes('publish')) {
            this.keyword = 'publish';
        } else if (title.toLowerCase().includes('trac')) {
            this.keyword = 'trac';
        } else if (title.toLowerCase().includes('r & d') || title.toLowerCase().includes('r&d')
        ) {
            this.keyword = 'test';
        } else {
            this.keyword = 'op';
        }
    }

    trackTasks(index, task: WorkItem) {
        return task.backlogPriority;
    }
}
