import { Component, OnInit, Input } from '@angular/core';
import { TfsEnvironmentService } from '../services/tfs-environment.service';
import { Deployment } from '../models/deployment.model';

@Component({
    selector: 'hg-heartbeat',
    templateUrl: './heartbeat.component.html',
    styleUrls: ['./heartbeat.component.scss']
})
export class HeartbeatComponent implements OnInit {
    @Input() deployment: Deployment;
    // buildData: BuildRecord;

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService
    ) { }

    ngOnInit() {
        // this.tfsEnvironmentService.getBuildTimeline(this.build).subscribe((data: BuildRecord) => {
        //     this.buildData = data;
        // });
    }
}
