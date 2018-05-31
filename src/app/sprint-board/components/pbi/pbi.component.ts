import { Component, Input, OnInit } from '@angular/core';
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

    constructor(
        private sprintService: SprintService,
        private tfsService: TfsService
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
        for (const key in this.pbi) {
            if (this.pbi[key] !== this.unsavedPbi[key]) {
                changes[key] = this.pbi[key];
            }
        }

        if (changes !== <WorkItem>{}) {
            this.tfsService.editWorkItem(this.pbi.id, changes).subscribe(() => {
                // TODO: Put something here
            });
        }

    }

    private setPbi() {
        this.unsavedPbi = Object.assign({}, this.pbi);
        this.pbiTitle = `${this.pbi.id} - ${this.pbi.title}`;
        if (!this.pbi.description) {
            this.pbi.description = '';
        }
        if (!this.pbi.acceptanceCriteria) {
            this.pbi.acceptanceCriteria = '';
        }
    }
}
