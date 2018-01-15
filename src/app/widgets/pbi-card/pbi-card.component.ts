import { WorkItem } from './../../models/work-item';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'kb-pbi-card',
    templateUrl: './pbi-card.component.html',
    styleUrls: ['./pbi-card.component.scss']
})
export class PbiCardComponent implements OnChanges {
    @Input() pbi: WorkItem;
    keyword: string;

    constructor() { }

    ngOnChanges() {
        if (this.pbi) {
            this.parseHeader();
        }
    }

    private parseHeader() {
        const title = this.pbi.title;
        if (title.toLowerCase().includes('publish')) {
            this.keyword = 'publish';
        } else if (title.toLowerCase().includes('trac')) {
            this.keyword = 'trac';
        } else if (title.toLowerCase().includes('r & d')) {
            this.keyword = 'test';
        } else {
            this.keyword = 'op';
        }
    }
}
