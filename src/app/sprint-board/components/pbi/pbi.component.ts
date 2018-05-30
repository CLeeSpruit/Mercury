import { Component, Input, OnInit } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';
import { SprintService } from '@sprint/services/sprint.service';

@Component({
    styleUrls: ['pbi.component.scss'],
    templateUrl: 'pbi.component.html',
    selector: 'hg-pbi'
})
export class PbiComponent implements OnInit {
    pbi: WorkItem;
    pbiTitle: string;

    constructor(private sprintService: SprintService) { }

    ngOnInit() {
        this.sprintService.getSelectedPbi().subscribe(pbi => {
            this.pbi = pbi;
            if (this.pbi) {
                this.setPbi();
            }
        });
    }

    // TODO:
    // savePbi() { }

    private setPbi() {
        this.pbiTitle = `${this.pbi.id} - ${this.pbi.title}`;
    }
}
