import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { WorkItem } from '@sprint/models/work-item';
import { TfsService } from '@sprint/services/tfs.service';
import { SprintService } from '@sprint/services/sprint.service';
import { Sprint } from '@sprint/models/sprint';

import { TaskStatus } from '@sprint/constants/task-status';
import { WorkItemTypes } from '@sprint/constants/work-item-types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'hg-sprint',
    templateUrl: './sprint.component.html',
    styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit, OnDestroy {
    showSprintSelect = false;
    showAddNewPbi = false;
    showTaskBoard = false;
    showPbiSlider = false;

    sprint: Sprint; // Display component
    sprints: Array<Sprint> = new Array<Sprint>(); // Display list on showSprintSelect
    private sprintId: string;
    private workItems: Array<WorkItem>;

    columns: Array<Array<WorkItem>> = new Array<Array<WorkItem>>();
    pbiType: string;

    private workItemIds: Array<number>;
    private workItemChangeSubscription: Subscription = new Subscription();
    private pbiSelecitonSubscription: Subscription = new Subscription();

    constructor(
        private tfsService: TfsService,
        private sprintService: SprintService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.params.subscribe(param => {
            if (param && param.iteration && param.iteration !== 'current') {
                // This should just be the id
                this.sprintId = param.iteration;
            } else {
                this.sprintId = null;
            }

            this.reset();
        });
    }

    ngOnInit() {
        this.tfsService.getAllSprints().take(1).subscribe((data) => {
            this.sprints = data;
        });

        this.workItemChangeSubscription = this.sprintService.listenToWorkItemChange().subscribe(this.syncItem.bind(this));
        this.pbiSelecitonSubscription = this.sprintService.getSelectedPbi().subscribe(pbi => this.showPbiSlider = !!pbi);
    }

    ngOnDestroy() {
        this.workItemChangeSubscription.unsubscribe();
        this.pbiSelecitonSubscription.unsubscribe();
    }

    private reset() {
        // Clear out previous props
        this.workItems = new Array<WorkItem>();
        this.showSprintSelect = false;
        this.showAddNewPbi = false;
        this.showTaskBoard = false;
        this.showPbiSlider = false;
        this.workItemIds = new Array<number>();

        this.workItemChangeSubscription.unsubscribe();
        this.workItemChangeSubscription = new Subscription();

        this.columns[TaskStatus.todo] = new Array<WorkItem>();
        this.columns[TaskStatus.inProgress] = new Array<WorkItem>();
        this.columns[TaskStatus.testing] = new Array<WorkItem>();
        this.columns[TaskStatus.done] = new Array<WorkItem>();

        // Reinit subscriptions
        this.getSprint();
    }

    private getSprint() {
        const sprintSub: Observable<Sprint> =
        this.sprintId ? this.tfsService.getSprint(this.sprintId) : this.tfsService.getCurrentSprint();

        sprintSub.take(1).subscribe((data: Sprint) => {
            this.sprint = data;

            this.tfsService.getSprintWorkItems(this.sprint).subscribe((workItems: Array<number>) => {
                this.workItemIds = workItems;

                // TODO: This might no longer be needed if the query is done correctly
                this.tfsService.getSpecificWorkItems(this.workItemIds).subscribe((workItemsData: Array<WorkItem>) => {
                    this.workItems = workItemsData;
                    if (this.workItems) {
                        this.sortWork();
                    }
                });
            });
        }, () => {
            // If sprint is not found, redirect to current sprint
            this.router.navigate(['sprint'], { relativeTo: this.route.parent });
        });
    }

    addPbi(type: string) {
        this.showAddNewPbi = true;
        this.pbiType = type;
    }

    createPbi(titleText: string) {
        this.tfsService.createPbi(<WorkItem>{ title: titleText }, this.sprint.path).subscribe((data: WorkItem) => {
            this.columns[TaskStatus.todo].push(data);
        });
    }

    private sortWork() {
        if (this.workItems && this.workItems.length) {
            this.workItems.forEach((wi: WorkItem) => {
                if (wi.workItemType === WorkItemTypes.pbi || wi.workItemType === WorkItemTypes.bug) {
                    this.sortItem(wi);
                    this.columns[wi.column].push(wi);
                }
            });

            this.showTaskBoard = true;
        }
    }

    toggleSelectSprint() {
        this.showSprintSelect = !this.showSprintSelect;
    }

    navToSprint(sprint: Sprint) {
        this.router.navigate(['sprint', sprint.id], { relativeTo: this.route.parent });
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
}
