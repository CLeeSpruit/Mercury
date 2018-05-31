import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TfsService } from '@sprint/services/tfs.service';
import { SprintService } from '@sprint/services/sprint.service';
import { WorkItem } from '@sprint/models/work-item';

@Component({
    selector: 'hg-pbi-container',
    templateUrl: 'pbi-container.component.html'
})
export class PbiContainerComponent {
    constructor(
        private activatedRoute: ActivatedRoute,
        private tfsService: TfsService,
        private sprintService: SprintService,
        private router: Router
    ) {
        this.activatedRoute.params.subscribe((params: any) => {
            if (params.pbiId) {
                this.tfsService.getSpecificWorkItems([params.pbiId]).subscribe((data: Array<WorkItem>) => {
                    this.sprintService.setSelectedPbi(data[0]);
                }, () => {
                    this.navigateHome();
                });
            } else {
                this.navigateHome();
            }
        });
    }

    private navigateHome() {
        this.router.navigate(['sprint', 'current'], { relativeTo: this.activatedRoute.parent});
    }
}
