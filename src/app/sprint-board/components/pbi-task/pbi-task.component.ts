import { Component, EventEmitter, OnInit, Input, Output, OnChanges, ViewChild, OnDestroy } from '@angular/core';

import { TfsService } from '@sprint/services/tfs.service';
import { SprintService } from '@sprint/services/sprint.service';
import { WorkItem } from '@sprint/models/work-item';
import { Subscription } from 'rxjs/Subscription';
import { SprintCommService } from '@sprint/services/sprint-comm.service';

@Component({
    selector: 'hg-pbi-task',
    templateUrl: './pbi-task.component.html',
    styleUrls: ['./pbi-task.component.scss']
})
export class PbiTaskComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @Input() parentId: string;
    @Input() isNew = false;
    @ViewChild('initials') initial: HTMLElement;

    task: WorkItem;
    statusPopup = false;
    hoursPopup = false;
    titleEditable = false;

    initials: string;
    initialsColor: string;

    private taskSub: Subscription = new Subscription();

    constructor(
        private tfsService: TfsService,
        private sprintCommService: SprintCommService
    ) { }

    ngOnInit() {
        if (this.isNew) {
            this.task = <WorkItem>{
                title: 'Add New'
            };
        } else {
            this.taskSub = this.sprintCommService.getWorkItem(this.id).subscribe(data => {
                if (data) {
                    this.initials = this.parseInitials(data.assignedTo);
                    this.initialsColor = this.generateColor(this.initials, data.assignedTo);
                    this.task = data;
                }
            });
        }
    }

    ngOnDestroy() {
        this.taskSub.unsubscribe();
    }

    /* Title */
    editTitle() {
        this.titleEditable = true;
    }

    saveTitleEdit(title: string) {
        this.titleEditable = false;
        if (title !== '' && this.task.title !== title) {
            this.tfsService.editWorkItem(this.id, <WorkItem>{ title: title }).subscribe(data => {
                // This doesn't really affect the parent, so this doesn't need to recalc parent
                this.sprintCommService.setPbi(data);
            });
        }
    }

    saveNewTitle(title: string, addAnother: boolean = false) {
        if (title !== '') {
            this.sprintCommService.createTask(title, this.parentId);
            if (!addAnother) {
                this.titleEditable = false;
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
                this.sprintCommService.setTask(data, this.parentId);
            });
        }
    }

    hoursChange(hours: number) {
        this.toggleHours();
        if (hours && this.task.remainingWork !== hours) {
            const modify: WorkItem = <WorkItem>{ remainingWork: hours };
            let change, add;
            change = this.task.remainingWork ? modify : {};
            add = !this.task.remainingWork ? modify : {};
            this.tfsService.editWorkItem(this.task.id, change, add).subscribe(data =>
                this.sprintCommService.setTask(data, this.parentId)
            );
        }
    }

    /* User Icon */
    private parseInitials(user: string): string {
        if (!user) { return; }
        const words = user.split(' ');
        words.splice(words.length - 1); // Remove last <> with username
        return words.map(word => word.charAt(0)).join('');
    }

    private generateColor(initials: string, assignedTo: string) {
        if (!initials || !assignedTo) { return; }
        const colorList = ['#01BAEF', '#01BAEF', '#939F5C', '#D16014', '#FE64A3', '#3E000C', '#AF125A'];
        const initialNumber = assignedTo.length;
        const multiplier = assignedTo.charCodeAt(0);
        return colorList[(initialNumber * multiplier) % colorList.length];
    }
}
