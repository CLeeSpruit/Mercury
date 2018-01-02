import { WorkItem } from './../../models/work-item';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'kb-pbi-column',
    templateUrl: './pbi-column.component.html',
    styleUrls: ['./pbi-column.component.scss']
})
export class PbiColumnComponent implements OnInit {
    @Input() list: Array<WorkItem> = new Array<WorkItem>();
    @Input() label: string;

    constructor() { }

    ngOnInit() {
    }

}
