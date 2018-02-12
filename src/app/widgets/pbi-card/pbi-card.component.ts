import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WorkItem } from './../../models/work-item';
import { SprintService } from './../../services/sprint.service';

@Component({
    selector: 'hg-pbi-card',
    templateUrl: './pbi-card.component.html',
    styleUrls: ['./pbi-card.component.scss']
})
export class PbiCardComponent implements OnChanges {
    @Input() pbi: WorkItem;
    keyword: string;

    constructor(private sprintService: SprintService) { }

    ngOnChanges() {
        if (this.pbi) {
            this.parseHeader();
        }
    }

    taskChanged(wi: WorkItem) {
        this.sprintService.sendChangedWorkItem(wi);
    }

    private parseHeader() {
        const title = this.pbi.title;
        if (title.toLowerCase().includes('publish')) {
            this.keyword = 'publish';
        } else if (title.toLowerCase().includes('trac')) {
            this.keyword = 'trac';
        } else if (title.toLowerCase().includes('r & d') || title.toLowerCase().includes('r&d')
        ) {
            this.keyword = 'test';
        } else {
            this.keyword = 'op';
        }
    }
}
