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

    constructor() { }

    ngOnInit() {
    }

    toggleStatus() {
        this.statusPopup = !this.statusPopup;
    }

    toggleHours() {
        this.hoursPopup = !this.hoursPopup;
    }

    statusChange(status: string) {
        switch (status) {
            case TaskStatus.todo:
                break;
            case TaskStatus.inProgress:
                break;
            case TaskStatus.testing:
                break;
            case TaskStatus.done:
                break;
            default:
                break;
        }
    }
}
