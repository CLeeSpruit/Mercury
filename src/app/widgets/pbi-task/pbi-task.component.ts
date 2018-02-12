import { Component, EventEmitter, OnInit, Input, Output, OnChanges, ViewChild } from '@angular/core';

import { TfsService } from './../../services/tfs.service';
import { SprintService } from './../../services/sprint.service';

import { WorkItem } from './../../models/work-item';
import { TaskStatus } from './../../shared/task-status';

@Component({
    selector: 'hg-pbi-task',
    templateUrl: './pbi-task.component.html',
    styleUrls: ['./pbi-task.component.scss']
})
export class PbiTaskComponent implements OnChanges {
    @Input() task: WorkItem;
    @Input() isNew = false;
    @Output() taskChanged: EventEmitter<WorkItem> = new EventEmitter<WorkItem>();
    @Output() newTask: EventEmitter<WorkItem> = new EventEmitter<WorkItem>();
    @ViewChild('initials') initial: HTMLElement;

    statusPopup = false;
    hoursPopup = false;
    titleEditable = false;

    initials: string;
    initialsColor: string;

    constructor(
        private tfsService: TfsService,
        private sprintService: SprintService
    ) { }

    ngOnChanges() {
        if (this.task && this.task.assignedTo) {
            this.initials = this.parseInitials(this.task.assignedTo);
            this.initialsColor = this.generateColor(this.initials);
        } else if (this.isNew) {
            this.task = <WorkItem>{
                title: 'Add New'
            };
        }
    }

    /* User Icon */
    private parseInitials(user: string) {
        const words = user.split(' ');
        words.splice(words.length - 1); // Remove last <> with username
        return words.map(word => word.charAt(0)).join('');
    }

    private generateColor(initials: string) {
        const colorList = ['#01BAEF', '#01BAEF', '#939F5C', '#D16014', '#FE64A3', '#3E000C', '#AF125A'];
        const initialNumber = this.task.assignedTo.length;
        const multiplier = this.task.assignedTo.charCodeAt(0);
        return colorList[(initialNumber * multiplier) % colorList.length];
    }

    /* Title */
    editTitle() {
        this.titleEditable = true;
    }

    saveTitle(title: string, addAnother: boolean = false) {
        this.titleEditable = false;
        if (title !== '' && (this.isNew || this.task.title !== title)) {
            if (this.isNew) {
                this.task.title = title;
                this.isNew = false;
                this.newTask.emit(this.task);
                if (addAnother) {
                    // TODO: Set focus to next text
                }
            } else {
                this.tfsService.editWorkItem(this.task.id, <WorkItem>{ title: title }).subscribe(data =>
                    this.task.title = title
                );
            }
        }
    }

    /* Dropdowns */
    toggleStatus() {
        this.statusPopup = !this.statusPopup;
    }

    toggleHours() {
        this.hoursPopup = !this.hoursPopup;
    }

    statusChange(status: string) {
        this.toggleStatus();
        if (status !== '' && status !== this.task.state) {
            this.tfsService.editWorkItem(this.task.id, <WorkItem>{ state: status }).subscribe(data => {
                this.task.state = status;
                this.taskChanged.emit(this.task);
            });
        }
    }

    hoursChange(hours: number) {
        this.toggleHours();
        if (hours && this.task.remainingWork !== hours) {
            this.tfsService.editWorkItem(this.task.id, <WorkItem>{ remainingWork: hours }).subscribe(data =>
                this.task.remainingWork = hours
            );
        }
    }
}
