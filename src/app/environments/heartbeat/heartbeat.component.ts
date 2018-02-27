import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hg-heartbeat',
  templateUrl: './heartbeat.component.html',
  styleUrls: ['./heartbeat.component.scss']
})
export class HeartbeatComponent implements OnInit {
    @Input() build: any;


    constructor() { }

    ngOnInit() {

    }
}
