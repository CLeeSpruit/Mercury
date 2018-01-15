import { WorkItem } from './../../models/work-item';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'kb-pbi-task',
    templateUrl: './pbi-task.component.html',
    styleUrls: ['./pbi-task.component.scss']
})
export class PbiTaskComponent implements OnInit {
    @Input() task: WorkItem;

    constructor() { }

    ngOnInit() {
    }

}
