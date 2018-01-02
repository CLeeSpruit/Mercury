import { WorkItem } from './../models/work-item';
import { TfsService } from './../services/tfs.service';
import { Sprint } from './../models/sprint';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'kb-sprint',
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
                switch (wi.boardColumn) {
                    case 'Commited': {
                        this.todo.push(wi);
                        break;
                    }
                    case 'Done': {
                        this.done.push(wi);
                        break;
                    }
                    default:
                        this.inProgress.push(wi);
                }
            }
        });
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
