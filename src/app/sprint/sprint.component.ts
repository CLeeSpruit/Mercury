import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { WorkItem } from './../models/work-item';
import { TfsService } from './../services/tfs.service';
import { SprintService } from './../services/sprint.service';
import { Sprint } from './../models/sprint';

import { TaskStatus } from './../shared/task-status';
import { WorkItemTypes } from './../shared/work-item-types';

@Component({
    selector: 'hg-sprint',
    templateUrl: './sprint.component.html',
    styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit, OnDestroy {
    sprint: Sprint;
    workItems: Array<WorkItem> = new Array<WorkItem>();
    workItemProperties: Array<string> = new Array<string>();

    columns: Array<Array<WorkItem>> = new Array<Array<WorkItem>>();

    private workAssignedQuery: string;
    private workItemIds: Array<string> = new Array<string>(); // They're numbers but whatever.
    private workItemChangeSubscription: Subscription = new Subscription();

    constructor(
        private tfsService: TfsService,
        private sprintService: SprintService
    ) {
        this.columns[TaskStatus.todo] = new Array<WorkItem>();
        this.columns[TaskStatus.inProgress] = new Array<WorkItem>();
        this.columns[TaskStatus.testing] = new Array<WorkItem>();
        this.columns[TaskStatus.done] = new Array<WorkItem>();
    }

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
                    if (this.workItems) {
                        this.sortWork();
                    }
                });
            });
        });

        this.workItemChangeSubscription = this.sprintService.listenToWorkItemChange().subscribe(this.syncItem.bind(this));
    }

    ngOnDestroy() {
        this.workItemChangeSubscription.unsubscribe();
    }

    private sortWork() {
        if (this.workItems && this.workItems.length) {
            this.workItems.forEach((wi: WorkItem) => {
                if (wi.workItemType === WorkItemTypes.pbi || wi.workItemType === WorkItemTypes.bug) {
                    this.sortItem(wi);
                    this.columns[wi.column].push(wi);
                }
            });
        }
    }

    private sortItem(workItem: WorkItem) {
        // To do: No tasks have been assigned
        // In progress: One or more tasks have been moved to 'In Progress'
        // Testing: At least one task have been moved to 'Ready to Test', overwrites in progress
        // Done: All tasks have been moved to done
        if (!workItem.children || !workItem.children.length) {
            this.attachChildren(workItem);
        }

        if (!workItem.children || !workItem.children.length) {
            workItem.column = TaskStatus.todo;
        } else if (workItem.children.every(child => child.state === TaskStatus.done)) {
            workItem.column = TaskStatus.done;
        } else if (workItem.children.find(child => child.state === TaskStatus.testing)) {
            workItem.column = TaskStatus.testing;
        } else if (workItem.children.find(child => child.state === TaskStatus.inProgress)) {
            workItem.column = TaskStatus.inProgress;
        } else {
            workItem.column = TaskStatus.todo;
        }
    }

    private syncItem(workItem: WorkItem) {
        const previousColumn = workItem.column;
        this.sortItem(workItem);

        if (previousColumn !== workItem.column) {
            const futureList = this.columns[workItem.column];
            const previousList = this.columns[previousColumn];
            if (previousList) {
                const foundIndex = previousList.findIndex(wi => wi.id === workItem.id);
                if (foundIndex !== -1) {
                    previousList.splice(foundIndex, 1);
                }
            }

            futureList.push(workItem);
        }
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
