import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WorkItem } from '@sprint/models/work-item';
import { SprintService } from '@sprint/services/sprint.service';
import { TfsService } from '@sprint/services/tfs.service';

@Component({
    styleUrls: ['pbi.component.scss'],
    templateUrl: 'pbi.component.html',
    selector: 'hg-pbi'
})
export class PbiComponent implements OnInit {
    pbi: WorkItem;
    unsavedPbi: WorkItem;
    pbiTitle: string;
    tinySettings: any;
    hasNoDescription = false;
    hasNoAcceptanceCriteria = false;

    constructor(
        private sprintService: SprintService,
        private tfsService: TfsService,
        private router: Router
    ) {
        // Initialize tinyMceSettings
        this.tinySettings = {
            branding: false,
            height: '20em'
        };
    }

    ngOnInit() {
        this.sprintService.getSelectedPbi().subscribe(pbi => {
            this.pbi = pbi;
            if (this.pbi) {
                this.setPbi();
            }
        });
    }

    close() {
        this.sprintService.setSelectedPbi(null);
    }

    save() {
        const changes: WorkItem = <WorkItem>{};
        const additions: WorkItem = <WorkItem>{};
        for (const key in this.pbi) {
            if (this.pbi[key] !== this.unsavedPbi[key]) {
                if (key === 'description' && this.hasNoDescription) {
                    additions[key] = this.pbi[key];
                } else if (key === 'acceptanceCriteria' && this.hasNoAcceptanceCriteria) {
                    additions[key] = this.pbi[key];
                } else {
                    changes[key] = this.pbi[key];
                }
            }
        }

        if (changes !== <WorkItem>{} || additions !== <WorkItem>{}) {
            this.tfsService.editWorkItem(this.pbi.id, changes, additions)
                .subscribe(() => {
                    // TODO: Put something here
                });
        }

    }

    navigateToPbi() {
        this.router.navigate(['pbi', this.pbi.id]);
    }

    private setPbi() {
        this.unsavedPbi = Object.assign({}, this.pbi);
        this.pbiTitle = `${this.pbi.id} - ${this.pbi.title}`;
        this.hasNoAcceptanceCriteria = !this.pbi.acceptanceCriteria;
        // TODO: Bugs do not have a description
        this.hasNoDescription = !this.pbi.description;
        if (!this.pbi.description) {
            this.pbi.description = '';
        }
        if (!this.pbi.acceptanceCriteria) {
            this.pbi.acceptanceCriteria = '';
        }
    }
}
