import { WorkItem } from '@sprint/models/work-item';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'hg-pbi-list',
    templateUrl: './pbi-list.component.html',
    styleUrls: ['./pbi-list.component.scss']
})
export class PbiListComponent implements OnChanges {
    @Input() pbiList: Array<WorkItem> = new Array<WorkItem>();
    constructor() { }

    ngOnChanges() {
    }

}

