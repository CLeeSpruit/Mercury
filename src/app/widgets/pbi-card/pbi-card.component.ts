import { WorkItem } from './../../models/work-item';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'kb-pbi-card',
    templateUrl: './pbi-card.component.html',
    styleUrls: ['./pbi-card.component.scss']
})
export class PbiCardComponent implements OnInit {
    @Input() pbi: WorkItem;

    constructor() { }

    ngOnInit() {
    }

}
