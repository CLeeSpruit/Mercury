import { TfsService } from './../../services/tfs.service';
import { WorkItem } from './../../models/work-item';
import { Component, OnInit, Input } from '@angular/core';

import { TaskStatus } from './../../shared/task-status';

@Component({
    selector: 'kb-pbi-task',
    templateUrl: './pbi-task.component.html',
    styleUrls: ['./pbi-task.component.scss']
})
export class PbiTaskComponent implements OnInit {
    @Input() task: WorkItem;

    statusPopup = false;
    hoursPopup = false;

    constructor(private tfsService: TfsService) { }

    ngOnInit() {
    }

    toggleStatus() {
        this.statusPopup = !this.statusPopup;
    }

    toggleHours() {
        this.hoursPopup = !this.hoursPopup;
    }

    statusChange(status: string) {
        this.toggleStatus();
        if (status !== '') {
            this.tfsService.editWorkItem(this.task.id, <WorkItem>{state: status}).subscribe(data =>
                this.task.state = status
            );
        }
    }

    hoursChange(hours: number) {
        this.toggleHours();
        if (hours) {
            this.tfsService.editWorkItem(this.task.id, <WorkItem>{remainingWork: hours}).subscribe(data =>
                this.task.remainingWork = hours
            );
        }
    }
}
