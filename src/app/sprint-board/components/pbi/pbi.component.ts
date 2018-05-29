import { Component, Input, OnInit } from '@angular/core';
import { WorkItem } from '@sprint/models/work-item';

@Component({
    styleUrls: [ 'pbi.component.scss'],
    templateUrl: 'pbi.component.html',
    selector: 'hg-pbi'
})
export class PbiComponent implements OnInit{
    @Input() pbi: WorkItem;

    pbiTitle: string;

    constructor() { }

    ngOnInit() {
        this.pbiTitle = `${this.pbi.id} - ${this.pbi.title}`;
    }
}
