import { TfsService } from './../../services/tfs.service';
import { WorkItem } from './../../models/work-item';
import { Component, OnInit, Input } from '@angular/core';

import { TaskStatus } from './../../shared/task-status';

@Component({
    selector: 'hg-pbi-task',
    templateUrl: './pbi-task.component.html',
    styleUrls: ['./pbi-task.component.scss']
})
export class PbiTaskComponent implements OnInit {
    @Input() task: WorkItem;

    statusPopup = false;
    hoursPopup = false;
    titleEditable = false;

    constructor(private tfsService: TfsService) { }

    ngOnInit() {
    }

    editTitle() {
        console.log('dbclick');
        this.titleEditable = true;
    }

    saveTitle(title: string) {
        this.titleEditable = false;

        if (title !== '' && this.task.title !== title) {
            this.tfsService.editWorkItem(this.task.id, <WorkItem>{title: title}).subscribe(data => 
                this.task.title = title
            );
        }
    }

    toggleStatus() {
        this.statusPopup = !this.statusPopup;
    }

    toggleHours() {
        this.hoursPopup = !this.hoursPopup;
    }

    statusChange(status: string) {
        this.toggleStatus();
        if (status !== '' && status !== this.task.state) {
            this.tfsService.editWorkItem(this.task.id, <WorkItem>{state: status}).subscribe(data =>
                this.task.state = status
            );
        }
    }

    hoursChange(hours: number) {
        this.toggleHours();
        if (hours && this.task.remainingWork !== hours) {
            this.tfsService.editWorkItem(this.task.id, <WorkItem>{remainingWork: hours}).subscribe(data =>
                this.task.remainingWork = hours
            );
        }
    }
}
