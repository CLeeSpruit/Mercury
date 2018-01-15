import { WorkItem } from './../../models/work-item';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'kb-pbi-column',
    templateUrl: './pbi-column.component.html',
    styleUrls: ['./pbi-column.component.scss']
})
export class PbiColumnComponent implements OnChanges {
    @Input() list: Array<WorkItem> = new Array<WorkItem>();
    @Input() label: string;

    constructor() { }

    ngOnChanges() {
        if (this.list) {
            // Order pbi list
            this.list = this.list.sort((a: WorkItem, b: WorkItem) => {
                return a.backlogPriority - b.backlogPriority;
            });
        }
    }
}
