import { WorkItem } from './../models/work-item';
import { TfsService } from './../services/tfs.service';
import { Sprint } from './../models/sprint';
import { Component, OnInit } from '@angular/core';

import { TaskStatus } from './../shared/task-status';
@Component({
    selector: 'hg-sprint',
    templateUrl: './sprint.component.html',
    styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {
    sprint: Sprint;
    workItems: Array<WorkItem> = new Array<WorkItem>();
    workItemProperties: Array<string> = new Array<string>();

    todo: Array<WorkItem> = new Array<WorkItem>();
    inProgress: Array<WorkItem> = new Array<WorkItem>();
    testing: Array<WorkItem> = new Array<WorkItem>();
    done: Array<WorkItem> = new Array<WorkItem>();

    private workAssignedQuery: string;
    private workItemIds: Array<string> = new Array<string>(); // They're numbers but whatever.

    constructor(
        private tfsService: TfsService
    ) { }

    ngOnInit() {
        this.buildWorkItemProperties();
        this.tfsService.getCurrentSprint().subscribe((data: Sprint) => {
            this.sprint = data;
        });

        this.tfsService.getWorkAssignedQuery().subscribe((queryData: string) => {
            this.workAssignedQuery = queryData;

            this.tfsService.runQuery(this.workAssignedQuery).subscribe((itemsData: Array<string>) => {
                this.workItemIds = itemsData;

                this.tfsService.getSpecificWorkItems(this.workItemIds).subscribe((workItemsData: Array<WorkItem>) => {
                    this.workItems = workItemsData;
                    this.sortWork();
                });
            });
        });
    }

    sortWork() {
        this.todo = [];
        this.inProgress = [];
        this.testing = [];
        this.done = [];

        this.workItems.forEach((wi: WorkItem) => {
            if (wi.workItemType === 'Product Backlog Item') {
                this.attachChildren(wi);

                // To do: No tasks have been assigned
                // In progress: One or more tasks have been moved to 'In Progress'
                // Testing: At least one task have been moved to 'Ready to Test', overwrites in progress
                // Done: All tasks have been moved to done

                if (!wi.children || !wi.children.length) {
                    this.todo.push(wi);
                } else if (wi.children.every(child => child.state === TaskStatus.done)) {
                    this.done.push(wi);
                } else if (wi.children.find(child => child.state === TaskStatus.testing)) {
                    this.testing.push(wi);
                } else if (wi.children.find(child => child.state === TaskStatus.inProgress)) {
                    this.inProgress.push(wi);
                } else {
                    this.todo.push(wi);
                }
            }
        });
    }

    private attachChildren(pbi: WorkItem) {
        // For now, only go one deep. If a tree is needed...well, we'll get to that bridge when we come to it
        if (pbi.childrenIds && pbi.childrenIds.length) {
            pbi.children = pbi.childrenIds.map((taskId: number) => {
                if (!taskId) { return; }

                const id = taskId;
                return this.workItems.find((task: WorkItem) => {
                    return task.id === +id;
                });
            }).filter((task: WorkItem) => {
                if (task) { return task; }
            });
        }
    }

    private buildWorkItemProperties() {
        this.workItemProperties = [];
        const example = <WorkItem>{};

        for (const prop in example) {
            if (example.hasOwnProperty(prop)) {
                this.workItemProperties.push(prop);
            }
        }
    }
}
