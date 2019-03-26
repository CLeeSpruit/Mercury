import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription ,  Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { WorkItem } from '@sprint/models/work-item';
import { TfsService } from '@sprint/services/tfs.service';
import { SprintService } from '@sprint/services/sprint.service';
import { Sprint } from '@sprint/models/sprint';

import { TaskStatus } from '@sprint/constants/task-status';
import { ActivatedRoute, Router } from '@angular/router';
import { SprintCommService } from '@sprint/services/sprint-comm.service';

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

    pbiType: string;

    private pbiSelecitonSubscription: Subscription = new Subscription();

    constructor(
        private tfsService: TfsService,
        private sprintService: SprintService,
        private sprintCommService: SprintCommService,
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
        this.tfsService.getAllSprints().pipe(take(1)).subscribe((data) => {
            this.sprints = data;
        });

        this.pbiSelecitonSubscription = this.sprintService.getSelectedPbi().subscribe(pbi => this.showPbiSlider = !!pbi);
    }

    ngOnDestroy() {
        this.pbiSelecitonSubscription.unsubscribe();
    }

    private reset() {
        // Clear out previous props
        this.showSprintSelect = false;
        this.showAddNewPbi = false;
        this.showTaskBoard = false;
        this.showPbiSlider = false;

        // Reinit subscriptions
        this.getSprint();
    }

    private getSprint() {
        const sprintSub: Observable<Sprint> =
            this.sprintId ? this.tfsService.getSprint(this.sprintId) : this.tfsService.getCurrentSprint();

        sprintSub.pipe(take(1)).subscribe((data: Sprint) => {
            this.sprint = data;

            this.tfsService.getSprintWorkItems(this.sprint).subscribe((workItems: Array<string>) => {
                // TODO: This might no longer be needed if the query is done correctly
                this.tfsService.getSpecificWorkItems(workItems).subscribe((workItemsData: Array<WorkItem>) => {
                    this.sprintCommService.setAllPbis(workItemsData);
                    this.showTaskBoard = true;
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
            // TODO: Create PBI through comm service
            // this.columns[TaskStatus.todo].push(data);
        });
    }

    toggleSelectSprint() {
        this.showSprintSelect = !this.showSprintSelect;
    }

    navToSprint(sprint: Sprint) {
        this.router.navigate(['sprint', sprint.id], { relativeTo: this.route.parent });
    }
}
